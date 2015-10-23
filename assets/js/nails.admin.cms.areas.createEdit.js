/* globals console */
var NAILS_Admin_CMS_Areas_CreateEdit;
NAILS_Admin_CMS_Areas_CreateEdit = function(widgetEditor)
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
     * Construct the CMS widget editor
     * @return {void}
     */
    base.__construct = function()
    {
        base.log('Constructing Area Editor');

        base.bindEvents();
    };

    // --------------------------------------------------------------------------

    /**
     * Bind to various events
     * @return {Object}
     */
    base.bindEvents = function()
    {
        $('#open-widget-editor').on('click', function()
        {
            base.editor.show();
            return false;
        });

        $(base.editor).on('widgeteditor-close', function()
        {
            base.log('Editor Closing, getting area data');
            var data = base.editor.getData();
            $('#widget-data').html(JSON.stringify(data));
        });
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
                console.log('CMS Areas:', message, payload);
            } else {
                console.log('CMS Areas:', message);
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
                console.warn('CMS Areas:', message, payload);
            } else {
                console.warn('CMS Areas:', message);
            }
        }
    };

    // --------------------------------------------------------------------------

    return base.__construct();
};