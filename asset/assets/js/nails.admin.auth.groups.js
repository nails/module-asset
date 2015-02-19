var NAILS_Admin_Auth_Groups_Edit;
NAILS_Admin_Auth_Groups_Edit = function()
{
    var base = this;

    // --------------------------------------------------------------------------

    base.searchTimeout = null;
    base.searchDelay   = 250;

    // --------------------------------------------------------------------------

    base.__construct = function()
    {
        base.toggleSuperuser();
        base.togglePermissions();
        base.permissionSearch();
    };

    // --------------------------------------------------------------------------

    base.toggleSuperuser = function()
    {
        $('.field.boolean .toggle').on('toggle', function(e, active) {

            if (active) {

                $('#adminPermissions').hide();

            } else {

                $('#adminPermissions').show();
            }
        });
    };

    // --------------------------------------------------------------------------

    base.togglePermissions = function()
    {
        $('.permissionGroup tbody td.permission').on('click', function()
        {
            $(this).closest('tr').find('input[type=checkbox]').click();
        });

        $('.permissionGroup tbody td.enabled input').on('change', function() {

            var td = $(this).closest('td');
            if ($(this).is(':checked')) {

                td.removeClass('error');
                td.addClass('success');

            } else {

                td.addClass('error');
                td.removeClass('success');
            }
        });

        $('.permissionGroup .toggleAll').on('click', function()
        {
            var inputs  = $(this).closest('table').find('tbody td.enabled input');
            var checked = $(this).is(':checked');

            inputs.each(function() {

                $(this).prop('checked', checked);

                var td = $(this).closest('td');

                if ($(this).is(':checked')) {

                    td.removeClass('error');
                    td.addClass('success');

                } else {

                    td.addClass('error');
                    td.removeClass('success');
                }
            });
        });
    };

    // --------------------------------------------------------------------------

    base.permissionSearch = function()
    {
        $('#permissionSearch input').on('keyup', function() {

            var keywords = $(this).val();

            clearTimeout(base.searchTimeout);
            base.searchTimeout = setTimeout(function() {

                base.doPermissionSearch(keywords);

            }, base.searchDelay);
        });
    };

    // --------------------------------------------------------------------------

    base.doPermissionSearch = function(keywords)
    {
        var regex, searchMe, result;

        /**
         * Search through all the filters
         */
        regex = new RegExp($.trim(keywords), 'i');

        $('.permissionGroup td.permission').each(function() {

            searchMe = $.trim($(this).text());
            result   = regex.test(searchMe);

            if (result) {

                $(this).closest('tr').show();

            } else {

                $(this).closest('tr').hide();
            }
        });

        /**
         * Only show groups where there are visible filters
         */
        $('.permissionGroup').show();
        $('.permissionGroup').each(function() {

            var visible = $(this).find('td.permission:visible').length;

            if (visible > 0) {

                $(this).show();

            } else {

                $(this).hide();
            }
        });
    };

    // --------------------------------------------------------------------------

    return base.__construct();
};