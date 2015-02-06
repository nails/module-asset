var NAILS_Admin_CMS_Blocks_Edit;
NAILS_Admin_CMS_Blocks_Edit = function()
{
    var base = this;

    // --------------------------------------------------------------------------

    base.newCounter = 0;           //  Counter holds the number of new translation being added on a page
    base.blockType  = 'plaintext'; //  When editing, this field contains the type of block we're editing.

    // --------------------------------------------------------------------------

    base.__construct = function(blockType)
    {
        base.blockType = blockType;

        // --------------------------------------------------------------------------

        base._init_new_translation();
        base._init_del_translation();
        base._init_toggle_revision();
        base._init_form_validation();

        // --------------------------------------------------------------------------

        //  Bind events
        $(document).on('change', '.translation select', function() {

            base._lang_change($(this));
            return false;
        });
    };

    // --------------------------------------------------------------------------

    base._init_new_translation = function()
    {
        $('#new-translation').on('click', function() {

            base._add_translation();
            return false;
        });
    };

    // --------------------------------------------------------------------------

    base._add_translation = function()
    {
        var _data     = { new_count : base.newCounter };
        var _template = $('#template-translation').html();
        var _fieldset = $('<fieldset>').addClass('translation');

        _fieldset.html(Mustache.render(_template, _data));

        //  Add a 'please choose' option
        _fieldset
            .attr('data-translation_id', base.newCounter)
            .find('select')
            .prepend($('<option>')
            .attr({ 'value' : '', 'selected' : 'selected', 'class' : 'please-choose', 'disabled' : 'disabled' })
            .text('Please Choose Language...'));

        $('.translation').last().after(_fieldset);

        base._lang_disable();

        // --------------------------------------------------------------------------

        //  If editing a richtext field we need to instantiate the new editor
        if (base.blockType === 'richtext')
        {
            CKEDITOR.replace('translation_' + base.newCounter, { 'customConfig' : window.NAILS.URL + 'js/ckeditor.config.default.min.js' });
        }

        // --------------------------------------------------------------------------

        base.newCounter++;
    };

    // --------------------------------------------------------------------------

    base._init_del_translation = function()
    {
        $(document).on('click', 'a.remove-translation', function() {

            base._del_translation($(this));
            return false;
        });
    };

    // --------------------------------------------------------------------------

    base._del_translation = function(obj)
    {
        //  If editing a richtext field we need to destory the editor, free up some memory, innit.
        if (base.blockType === 'richtext')
        {
            var id;
            id = obj.closest('fieldset').attr('data-translation_id');
            id = 'translation_' + id;

            CKEDITOR.instances[id].destroy();
        }

        // --------------------------------------------------------------------------

        obj.closest('fieldset').remove();
    };

    // --------------------------------------------------------------------------

    base._lang_change = function(obj)
    {
        obj.closest('fieldset').attr('data-language', obj.val());
        base._lang_disable();
    };

    // --------------------------------------------------------------------------

    base._lang_disable = function()
    {
        //  Enable all options
        $('.translation option[disabled=disabled]:not(.please-choose)')
            .removeAttr('disabled');

        // --------------------------------------------------------------------------

        //  Disable options which have been used
        $('.translation').each(function() {

            $('.translation option[value=' + $(this).attr('data-language') + ']')
                .attr('disabled', 'disabled');

            //  Re-enable for the selected item in this <select>
            $('option[value=' + $(this).attr('data-language') + ']', this)
                .removeAttr('disabled');
        });

        // --------------------------------------------------------------------------

        //  Remove the disabled attribute on the currently selected item (so it POSTS)
        $('.translation option[selected=selected]:not(.please-choose)')
        .removeAttr('disabled');
    };

    // --------------------------------------------------------------------------

    base._init_toggle_revision = function()
    {
        $('a.toggle-revisions').on('click', function() {

            base._toggle_revision($(this));
            return false;
        });
    };

    // --------------------------------------------------------------------------

    base._toggle_revision = function(obj)
    {
        obj.closest('.revisions').toggleClass('show');
    };

    // --------------------------------------------------------------------------

    base._init_form_validation = function()
    {
        $('form').on('submit', function() {

            return base._form_validation();
        });
    };

    // --------------------------------------------------------------------------

    base._form_validation = function()
    {
        var _errors = 0;
        $('fieldset.translation').each(function() {

            //  Check select has a value
            var _select;
            if ($('select', this).length)
            {
                _select = $('select', this).val();
            }
            else
            {
                _select = true;
            }

            //  Check textarea isn't empty
            var _textarea = $('textarea', this).val();

            if (! _select || !_textarea)
            {
                _errors++;
                $('.system-alert', this).show();
            }
            else
            {
                $('.system-alert', this).hide();
            }
        });

        // --------------------------------------------------------------------------

        if (_errors)
        {
            //  Scroll to the nearest error
            var _system = $('div.system-alert.error:visible').get(0);
            $.scrollTo(_system, 'fast', { axis: 'y', offset : { top: -50 } });

            // --------------------------------------------------------------------------

            return false;
        }
        else
        {
            return true;
        }
    };

    // --------------------------------------------------------------------------

    return base.__construct();
}();