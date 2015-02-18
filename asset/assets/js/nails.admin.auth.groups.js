var NAILS_Admin_Auth_Groups_Edit;
NAILS_Admin_Auth_Groups_Edit = function()
{
    var base = this;

    // --------------------------------------------------------------------------

    base.__construct = function()
    {
        base.toggleSuperuser();
        base.togglePermissions();
    };

    // --------------------------------------------------------------------------

    base.toggleSuperuser = function()
    {
        $('.field.boolean .toggle').on('toggle', function(e, active) {

            if (active) {

                $('#adminPermissions').slideUp();

            } else {

                $('#adminPermissions').slideDown();
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

    return base.__construct();
};