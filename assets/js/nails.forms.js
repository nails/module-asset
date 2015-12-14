/* globals NAILS_Admin_CMS_WidgetEditor, console */
var NAILS_Forms;
NAILS_Forms = function()
{
    var base = this;

    // --------------------------------------------------------------------------

    base.__construct = function()
    {
        //  @todo: move into the CMS module
        base.initWidgetEditors();
    };

    // --------------------------------------------------------------------------

    base.widgetEditor = null;
    base.activeArea = null;
    base.initWidgetEditors = function()
    {
        //  Set up an instance of the widget editor
        base.widgetEditor = new NAILS_Admin_CMS_WidgetEditor();

        //  Populate the editor with existing areas
        $('.field.cms-widgets .open-editor').each(function() {

            //  Look for the associated input
            var key   = $(this).data('key');
            var input = $(this).siblings('input.widget-data');

            if (input.length) {

                try {

                    var widgetData = JSON.parse(input.val());
                    base.widgetEditor.setAreaData(key, widgetData);

                } catch (e) {}
            }
        });

        //  Bind to the thigns
        $(document).on('click', '.field.cms-widgets .open-editor', function() {
            base.activeArea = $(this);
            base.log('Opening Editor for area: ' + base.activeArea.data('key'));
            base.widgetEditor.show(base.activeArea.data('key'));
            return false;
        });

        $(base.widgetEditor).on('widgeteditor-close', function()
        {
            base.log('Editor Closing, getting area data and saving to input');
            var data  = base.widgetEditor.getAreaData(base.activeArea.data('key'));
            var input = base.activeArea.siblings('input.widget-data');

            if (input.length) {
                input.val(JSON.stringify(data));
            }

            base.activeArea = null;
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
        if (typeof(console.log) === 'function') {

            if (payload !== undefined) {

                console.log('Nails Forms:', message, payload);

            } else {

                console.log('Nails Forms:', message);
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

                console.warn('Nails Forms:', message, payload);

            } else {

                console.warn('Nails Forms:', message);
            }
        }
    };

    // --------------------------------------------------------------------------

    return base.__construct();
};