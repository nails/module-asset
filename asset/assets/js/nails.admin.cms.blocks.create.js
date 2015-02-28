var NAILS_Admin_CMS_Blocks_Create;
NAILS_Admin_CMS_Blocks_Create = function()
{
    /**
     * Avoid scope issues in callbacks and anonymous functions by referring to `this` as `base`
     * @type {Object}
     */
    var base = this;

    // --------------------------------------------------------------------------

    /**
     * Construct the class
     * @return {Void}
     */
    base.__construct = function()
    {
        base.initTypeChange();
    };

    // --------------------------------------------------------------------------

    /**
     * Binds to the `type` select box
     * @return {Void}
     */
    base.initTypeChange = function()
    {
        $('select[name=type]').on('change', function() {

            base.typeChanged();
        });

        base.typeChanged();
    };

    // --------------------------------------------------------------------------

    /**
     * Triggered when the `type` select changes and shows/renders the appropriate fields
     * @return {Void}
     */
    base.typeChanged = function()
    {
        var type = $('select[name=type]').val();

        switch(type)
        {
            case 'plaintext':

                //  Destroy the rich text editor instance and hide the WYSIWYG warning
                $('#default-value').show();
                $('#ckeditor-warn').hide();

                if (typeof(CKEDITOR.instances.default_value) !== 'undefined')
                {
                    CKEDITOR.instances.default_value.destroy();
                }
                break;

            case 'richtext':

                //  Instanciate a CKEditor instance and show the WYSIWYG warning
                $('#default-value').show();
                $('#ckeditor-warn').show();
                CKEDITOR.replace('default_value', { 'customConfig' : window.NAILS.URL + 'js/ckeditor.config.default.min.js' });
                break;

            default:

                //  Destroy the instance, hide the warning and hide the fieldset
                $('#default-value').hide();
                $('#ckeditor-warn').hide();

                if (typeof(CKEDITOR.instances.default_value) !== 'undefined')
                {
                    CKEDITOR.instances.default_value.destroy();
                }
                break;
        }
    };

    // --------------------------------------------------------------------------

    return base.__construct();
}();