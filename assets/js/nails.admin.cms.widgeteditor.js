/* globals console */
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
            'label': 'Preview',
            'type': 'primary'
        },
        {
            'label': '<i class="fa fa-lg fa-times"></i>',
            'type': 'danger',
            'callback': function() {
                base.hide();
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
     * Construct the CMS widget editor
     * @return {Object}
     */
    base.__construct = function() {

        base.log('Constructing Widget Editor');

        //  Inject markup
        base.generateMarkup();
        base.bindEvents();

         // Fetch available widgets
        base.loadWidgets();

        base.show();

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
                'body': $('<ul>').addClass('widgeteditor-body').html('<li><fieldset><legend>A Widget</legend><p>Some shiz</p></fieldset></li><li><fieldset><legend>A Widget</legend><p>Some shiz</p></fieldset></li><li><fieldset><legend>A Widget</legend><p>Some shiz</p></fieldset></li><li><fieldset><legend>A Widget</legend><p>Some shiz</p></fieldset></li><li><fieldset><legend>A Widget</legend><p>Some shiz</p></fieldset></li><li><fieldset><legend>A Widget</legend><p>Some shiz</p></fieldset></li><li><fieldset><legend>A Widget</legend><p>Some shiz</p></fieldset></li><li><fieldset><legend>A Widget</legend><p>Some shiz</p></fieldset></li><li><fieldset><legend>A Widget</legend><p>Some shiz</p></fieldset></li><li><fieldset><legend>A Widget</legend><p>Some shiz</p></fieldset></li><li><fieldset><legend>A Widget</legend><p>Some shiz</p></fieldset></li><li><fieldset><legend>A Widget</legend><p>Some shiz</p></fieldset></li><li><fieldset><legend>A Widget</legend><p>Some shiz</p></fieldset></li><li><fieldset><legend>A Widget</legend><p>Some shiz</p></fieldset></li>')
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
            base.renderWidgets();
            base.renderActions();

        } else {
            base.warn('Editor already generated');
        }

        return base;
    };

    // --------------------------------------------------------------------------

    base.bindEvents = function()
    {
        base.sections.actions.on('click', '.action', function() {

            var actionIndex = $(this).data('action-index') || null;

            if (actionIndex !== null && base.actions[actionIndex]) {
                if (typeof base.actions[actionIndex].callback === 'function') {
                    base.actions[actionIndex].callback.call(base);
                }
            }
            return false;
        });
    }

    // --------------------------------------------------------------------------

    /**
     * Laod the available widgets from the server
     * @return {Object} Deferred
     */
    base.loadWidgets = function() {

        var deferred, container, icon, toggle, label;

        base.log('Fetching available CMS widgets');

        deferred = $.Deferred();

        //  @todo get this from the server
        base.widgets = [
            {
                'label': 'Grouping 1',
                'widgets': [
                    {
                        'label': 'Image',
                        'icon': 'fa-picture-o'
                    },
                    {
                        'label': 'Table',
                        'icon': 'fa-search'
                    },
                    {
                        'label': 'Widget 2',
                        'icon': 'fa-adjust'
                    }
                ]
            }

        ];

        deferred.done(function() {
            base.renderWidgets();
        });

        deferred.resolve();
        return deferred;
    };

    // --------------------------------------------------------------------------

    /**
     * Render the widgets
     * @return {Object}
     */
    base.renderWidgets = function() {

        base.sections.widgets.empty();

        for (var i = 0; i < base.widgets.length; i++) {

            //  Widget Group
            label     = $('<span>').addClass('label').text(base.widgets[i].label);
            toggle    = $('<i>').addClass('icon fa fa-chevron-down');
            container = $('<div>').addClass('widget-group').data('group', i).append(label).append(toggle);
            base.sections.widgets.append(container);

            //  Individual widgets
            for (var x = 0; x < base.widgets[i].widgets.length; x++) {

                icon      = $('<i>').addClass('icon fa ' + base.widgets[i].widgets[x].icon);
                label     = $('<span>').addClass('label').text(base.widgets[i].widgets[x].label);
                container = $('<div>').addClass('widget widget-group-' + i).append(icon).append(label);
                base.sections.widgets.append(container);
            }
        }

        return base;
    }

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

        var action;

        base.sections.actions.empty();

        for (var i = 0; i < base.actions.length; i++) {

            action = $('<a>')
                .addClass('action btn btn-sm btn-' + base.actions[i].type)
                .data('action-index', i)
                .html(base.actions[i].label);
            base.sections.actions.append(action);
        }

        return base;
    }

    // --------------------------------------------------------------------------

    /**
     * Show the widget editor and populate with the data for a particular area
     * @param  {String} area Load widgets for this area
     * @return {Object}
     */
    base.show = function(area) {

        area = area || 'default';

        base.log('Showing Editor for "' + area + '"');
        base.container.addClass('active');

        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Hide the editor
     * @return {Object}
     */
    base.hide = function() {

        base.log('Hiding Editor');
        base.container.removeClass('active');
        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Write a log to the console
     * @param  {String} message The message to log
     * @param  {Mixed}  payload Any additional data to display in the console
     * @return {Void}
     */
    base.log = function(message, payload) {

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
    base.warn = function(message, payload) {

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
