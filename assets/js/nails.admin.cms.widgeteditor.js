/* globals console, _nails_api */
var NAILS_Admin_CMS_WidgetEditor;
NAILS_Admin_CMS_WidgetEditor = function()
{
    /**
     * Avoid scope issues in callbacks and anonymous functions by referring to `this` as `base`
     * @type {Object}
     */
    var base = this;

    // --------------------------------------------------------------------------

    /**
     * An array of the available widgets
     * @type {Array}
     */
    base.widgets = [];

    // --------------------------------------------------------------------------

    /**
     * An array of actions to render
     * @type {Array}
     */
    base.actions = [
        {
            'label': '<i class="fa fa-lg fa-times"></i>',
            'type': 'danger',
            'callback': function() {
                base.close();
            }
        }
    ];

    // --------------------------------------------------------------------------

    /**
     * An array of the data to use when rendering widget areas
     * @type {Array}
     */
    base.widgetData = {};

    // --------------------------------------------------------------------------

    /**
     * The main editor container
     */
    base.container = null;

    // --------------------------------------------------------------------------

    /**
     * The individual editor sections
     */
    base.sections = null;

    // --------------------------------------------------------------------------

    /**
     * Whether the editor is currently open
     * @type {Boolean}
     */
    base.isOpen = false;

    // --------------------------------------------------------------------------

    /**
     * Construct the CMS widget editor
     * @return {Object}
     */
    base.__construct = function() {

        base.log('Constructing Widget Editor');

        //  Inject markup
        base.generateMarkup();
        base.bindEvents();

         // Fetch and render available widgets
        base.loadSidebarWidgets().done(function() {
            base.renderSidebarWidgets();
        });

        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Generate the base amrkup for the editor
     * @return {Object}
     */
    base.generateMarkup = function() {

        var item;

        if (base.container === null) {

            base.log('Injecting editor markup');

            base.container = $('<div>').addClass('group-cms widgeteditor');
            base.sections  = {
                'header': $('<div>').addClass('widgeteditor-header').text('Some header text, maybe'),
                'actions': $('<div>').addClass('widgeteditor-actions'),
                'search': $('<div>').addClass('widgeteditor-search'),
                'widgets': $('<div>').addClass('widgeteditor-widgets'),
                'body': $('<ul>').addClass('widgeteditor-body').html(
                    '<ul></ul><div class="no-widgets">Drag widgets from the left to here</div>'
                )
            };

            //  Add search input
            item = $('<input>').attr('type', 'search').attr('placeholder', 'Search widgets');
            base.sections.search.append(item);

            //  Glue it all together
            base.container
                .append(base.sections.header)
                .append(base.sections.actions)
                .append(base.sections.search)
                .append(base.sections.widgets)
                .append(base.sections.body);

            $('body').append(base.container);

            //  Render any actions and widgets
            base.renderSidebarWidgets();
            base.renderActions();

        } else {
            base.warn('Editor already generated');
        }

        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Bind to various events
     * @return {Object}
     */
    base.bindEvents = function() {

        var actionIndex, groupIndex;

        //  Actions
        base.sections.actions.on('click', '.action', function() {

            actionIndex = $(this).data('action-index');
            base.log('Action clicked', actionIndex);

            if (base.actions[actionIndex]) {
                if (typeof base.actions[actionIndex].callback === 'function') {
                    base.actions[actionIndex].callback.call(base);
                }
            } else {
                base.warn('"' + actionIndex+ '" is not a valid action.');
            }
            return false;
        });

        //  Widgets
        base.sections.widgets.on('click', '.widget-group', function() {

            base.log('Toggling visibility of group\'s widgets.');
            if ($(this).hasClass('closed')) {
                $(this).removeClass('closed');
            } else {
                $(this).addClass('closed');
            }

            groupIndex = $(this).data('group');
            $('.widget-group-' + groupIndex).toggle();
        });

        //  Search
        base.sections.search.on('keyup', function(e) {
            var term = base.sections.search.find('input').val().trim();
            base.log('Filtering widgets by term "' + term + '"');
        });

        //  Body
        base.sections.body.on('click', '.action-remove', function() {
            base.log('Removing Widget');
            $(this).closest('.widget').remove();
        });

        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Laod the available widgets from the server
     * @return {Object} Deferred
     */
    base.loadSidebarWidgets = function() {

        var deferred;

        base.log('Fetching available CMS widgets');

        deferred = $.Deferred();

        //  @todo get this from the server
        _nails_api.call({
            'controller': 'cms/widgets',
            'method': 'index',
            'success': function(data)
            {
                base.log('Succesfully fetched widgets from the server.');
                base.widgets = data.widgets;
                deferred.resolve();
            },
            'error': function()
            {
                base.warn('Failed to load widgets from the server.');
                deferred.reject();
            }
        });

        return deferred;
    };

    // --------------------------------------------------------------------------

    /**
     * Render the widgets
     * @return {Object}
     */
    base.renderSidebarWidgets = function() {

        base.sections.widgets.empty();

        var i, x, label, toggle, container, icon;

        for (i = 0; i < base.widgets.length; i++) {

            //  Widget Group
            label     = $('<span>').addClass('label').text(base.widgets[i].label);
            toggle    = $('<i>').addClass('icon fa fa-chevron-down');
            container = $('<div>').addClass('widget-group').data('group', i).append(label).append(toggle);
            base.sections.widgets.append(container);

            //  Individual widgets
            for (x = 0; x < base.widgets[i].widgets.length; x++) {

                icon         = $('<i>').addClass('icon fa ' + base.widgets[i].widgets[x].icon);
                label        = $('<span>').addClass('label').text(base.widgets[i].widgets[x].label);
                description  = $('<div>').addClass('description').text(base.widgets[i].widgets[x].description);
                btnRemove    = $('<a>').attr('href', '#').addClass('action action-remove fa fa-trash-o');
                editorTarget = $('<div>').addClass('editor-target').html('Widget Loading...');
                container    = $('<div>').addClass('widget widget-group-' + i).data('group', i).data('widget', x);

                container
                    .append(icon)
                    .append(label)
                    .append(btnRemove)
                    .append(description)
                    .append(editorTarget);

                base.sections.widgets.append(container);
            }
        }

        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Add an action to the header
     * @param {String}   label    The label of the button
     * @param {String}   type     The type of button (e.g., primary)
     * @param {Function} callback A callback to call when the button is clicked
     */
    base.addAction = function(label, type, callback) {

        base.log('Adding action "' + label + '"');
        base.actions.push({
            'label': label,
            'type': type,
            'callback': callback
        });
        base.renderActions();
        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Remove a widget from an area
     * @param  {String} area       The area to remove from
     * @param  {String} widgetSlug The widget's slug
     * @return {Object}
     */
    base.removeAction = function(label) {

        base.log('Removing action "' + label + '"');
        base.renderActions();
        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Render the actions
     * @return {Object}
     */
    base.renderActions = function() {

        var i, action;

        base.sections.actions.empty();

        for (i = 0; i < base.actions.length; i++) {

            action = $('<a>')
                .addClass('action btn btn-sm btn-' + base.actions[i].type)
                .data('action-index', i)
                .html(base.actions[i].label);

            base.sections.actions.append(action);
        }

        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Show the widget editor and populate with the data for a particular area
     * @param  {String} area Load widgets for this area
     * @return {Object}
     */
    base.show = function(area) {

        area = area || 'default';

        base.log('Showing Editor for "' + area + '"');

        //  Build the widgets for this area
        base.sections.body.find('> ul').empty();
        //  @todo

        //  Make things draggable and sortable
        base.draggableConstruct();
        base.sortableConstruct(area);

        //  Show the editor
        base.container.addClass('active');
        base.isOpen = true;

        //  Prevent scrolling on the body
        $('body').addClass('noscroll');

        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Close the editor
     * @return {Object}
     */
    base.close = function() {

        base.log('Closing Editor');
        base.container.removeClass('active');
        base.isOpen = true;

        //  Destroy all sortables and draggables
        base.draggableDestroy();
        base.sortableDestroy();

        //  Allow body scrolling
        $('body').removeClass('noscroll');

        $(base).trigger('widgeteditor-close');
        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Set up draggables
     * @return {Object}
     */
    base.draggableConstruct = function() {

        base.sections.widgets.find('.widget').draggable({
            'helper': 'clone',
            'connectToSortable': base.sections.body.find('> ul')
        });

        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Destroy draggables
     * @return {Object}
     */
    base.draggableDestroy = function() {

        base.sections.widgets
            .find('.widget.ui-draggable')
            .draggable('destroy');

        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Set up sortables
     * @return {Object}
     */
    base.sortableConstruct = function(area) {

        base.sections.body.find('> ul').sortable({
            placeholder: 'sortable-placeholder',
            handle: '.icon',
            receive: function(e, ui)
            {
                var sourceWidget, targetWidget, groupIndex, widgetIndex;

                sourceWidget = ui.item;
                targetWidget = ui.helper;
                groupIndex   = sourceWidget.data('group');
                widgetIndex  = sourceWidget.data('widget');

                base.addWidget(area, groupIndex, widgetIndex);

                //  Allow auto sizing
                targetWidget.removeAttr('style');
            }
        });

        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Destroy sortables
     * @return {Object}
     */
    base.sortableDestroy = function() {

        var sortable = base.sections.body.find('> ul.ui-sortable');

        if (sortable.length > 0) {
            sortable.sortable('destroy');
        }

        return base;
    };

    // --------------------------------------------------------------------------

    base.addWidget = function(area, groupIndex, widgetIndex, data) {

        if (base.widgets[groupIndex] && base.widgets[groupIndex].widgets[widgetIndex]) {

            var widget = base.widgets[groupIndex].widgets[widgetIndex];

            base.log('Adding Widget "' + widget.label + '" with data:', data);

            //  Add to the widget array for this area

            //  If the editor is active then fetch the widget's editor panel
            if (base.isOpen) {
                base.getWidgetEditor(groupIndex, widgetIndex, data);
            }

        } else {

            base.warn('Attempted to add an invalid widget');
        }
    };

    // --------------------------------------------------------------------------

    base.getWidgetEditor = function(groupIndex, widgetIndex, data) {

        base.log('Getting widget editor');
    };

    // --------------------------------------------------------------------------

    /**
     * Return the data contents of an area
     * @param  {String} area The area to get data for
     * @return {Array}
     */
    base.getData = function(area)
    {
        area = area || 'default';

        base.log('Getting editor data for area "' + area + '"');

        return [{'foo': 'bar'}, {'foo': 'bar'}];
    };

    // --------------------------------------------------------------------------

    /**
     * Write a log to the console
     * @param  {String} message The message to log
     * @param  {Mixed}  payload Any additional data to display in the console
     * @return {Void}
     */
    base.log = function(message, payload)
    {
        if (typeof(console.log) === 'function') {

            if (payload !== undefined) {

                console.log('CMS Widget Editor:', message, payload);

            } else {

                console.log('CMS Widget Editor:', message);
            }
        }
    };

    // --------------------------------------------------------------------------

    /**
     * Write a warning to the console
     * @param  {String} message The message to warn
     * @param  {Mixed}  payload Any additional data to display in the console
     * @return {Void}
     */
    base.warn = function(message, payload)
    {
        if (typeof(console.warn) === 'function') {

            if (payload !== undefined) {

                console.warn('CMS Widget Editor:', message, payload);

            } else {

                console.warn('CMS Widget Editor:', message);
            }
        }
    };

    // --------------------------------------------------------------------------

    return base.__construct();
};
