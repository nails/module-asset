/* globals console */
var NAILS_Admin_CMS_Pages_CreateEdit;
NAILS_Admin_CMS_Pages_CreateEdit = function(widgetEditor, templates)
{
    /**
     * Avoid scope issues in callbacks and anonymous functions by referring to `this` as `base`
     * @type {Object}
     */
    var base = this;

    // --------------------------------------------------------------------------

    /**
     * The widget editor instance
     * @type {Object}
     */
    base.editor = widgetEditor;

    // --------------------------------------------------------------------------

    /**
     * The available page templates
     * @type {Array}
     */
    base.templates = templates;

    // --------------------------------------------------------------------------

    /**
     * The active template
     * @type {String}
     */
    base.activeTemplate = '';

    // --------------------------------------------------------------------------

    /**
     * The active area
     * @type {String}
     */
    base.activeArea = '';

    // --------------------------------------------------------------------------

    /**
     * Construct the CMS widget editor
     * @return {void}
     */
    base.__construct = function()
    {
        base.log('Constructing Pages Editor');
        base.bindEvents();

        //  Add the preview action to the widget editor
        base.editor.addAction(
            'Preview',
            'primary',
            function() {
                base.showPreview();
            }
        );

        //  Move the preview element to the foot pf the page and match the zindex of the widgeteditor
        $('body').append($('#page-preview'));
        $('#page-preview').css('zIndex', base.editor.container.css('zIndex'));

        //  Organise the interface for the selected template
        $('.template.selected input').click();
    };

    // --------------------------------------------------------------------------

    /**
     * Bind to various events
     * @return {Object}
     */
    base.bindEvents = function()
    {
        //  Bind to template changes
        $('.template input').on('click', function() {
            base.selectTemplate($(this).data('slug'));
        });

        //  Bind to area buttons
        $('button.launch-editor').on('click', function() {

            var area = $(this).data('area');
            base.log('Launching editor for area "' + area + '"');
            base.activeArea = area;
            base.editor.show(area);
        });

        $(base.editor).on('widgeteditor-close', function()
        {
            var data = {}, area;

            base.log('Editor Closing, getting area data');

            $('#template-area-' + base.activeTemplate + ' .btn').each(function() {

                area =$(this).data('area');
                data[area] = base.editor.getAreaData(area);
            });

            $('#template-data').val(JSON.stringify(data));
            base.activeArea = '';
        });

        //  Bind to preview button
        $('#action-preview').on('click', function() {
            base.showPreview();
        });

        $('#page-preview .action-close').on('click', function() {
            base.hidePreview();
        });

        $('#page-preview .action-publish').on('click', function() {
            base.hidePreview();
            $('#action-publish').click();
        });

        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Select a template, showing the appropriate options and areas
     * @param  {String} slug The template's slug
     * @return {Object}
     */
    base.selectTemplate = function(slug) {

        base.log('Showing template "' + slug + '"');
        base.activeTemplate = slug;

        //  Reset
        $('.template').removeClass('selected');
        $('#template-options-none').hide();
        $('.additional-fields').hide();
        $('#template-areas-none').hide();
        $('.template-area').hide();

        //  Select template
        $('.template[data-slug=' + slug + ']')
            .addClass('selected');

        //  Show Template options and areas
        $('#additional-fields-' + slug).show();
        $('#template-area-' + slug).show();

        //  Show alerts if no options/areas are visible
        if ($('.additional-fields:visible').length === 0) {
            $('#template-options-none').show();
        }

        if ($('.template-area:visible').length === 0) {
            $('#template-areas-none').show();
        }

        return base;
    };

    // --------------------------------------------------------------------------

    /**
     * Generate a preview and show in a model window
     * @return {Object}
     */
    base.showPreview = function() {

        base.log('Generating preview');

        $('body').addClass('noscroll');

        $('#page-preview')
            .addClass('loading')
            .show();

        //  @todo do whatever it is we need to to do get a preview URL
        $('#page-preview iframe').attr('src', 'http://hellopablo.co.uk');

        return base;
    };

    // --------------------------------------------------------------------------

    base.hidePreview = function() {

        base.log('Hiding preview');

        $('#page-preview')
            .hide()
            .removeClass('loading')
            .find('iframe')
            .removeAttr('src');

        $('body').removeClass('noscroll');

        return base;
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
        if (typeof(console.log) === 'function')
        {
            if (payload !== undefined) {
                console.log('CMS Pages:', message, payload);
            } else {
                console.log('CMS Pages:', message);
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
        if (typeof(console.warn) === 'function')
        {
            if (payload !== undefined) {
                console.warn('CMS Pages:', message, payload);
            } else {
                console.warn('CMS Pages:', message);
            }
        }
    };

    // --------------------------------------------------------------------------

    return base.__construct();
};