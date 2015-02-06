var NAILS_Admin_CMS_Blocks_Create;
NAILS_Admin_CMS_Blocks_Create = function()
{
    var base = this;

    // --------------------------------------------------------------------------

    base.__construct = function()
    {
        base._init_type_change();
    };

    // --------------------------------------------------------------------------

    base._init_type_change = function()
    {
        $('select[name=type]').on('change', function() {

            base._type_changed();
        });

        base._type_changed();
    };

    // --------------------------------------------------------------------------

    base._type_changed = function()
    {
        var _type = $('select[name=type]').val();

        switch(_type)
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