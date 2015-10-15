/* globals console */
var NAILS_Admin_Admin_Settings;
NAILS_Admin_Admin_Settings = function()
{
    /**
     * Avoid scope issues in callbacks and anonymous functions by referring to `this` as `base`
     * @type {Object}
     */
    var base = this;

    base.allowFormSubmit = true;

    // --------------------------------------------------------------------------

    /**
     * Construct the class
     * @return {void}
     */
    base.__construct = function()
    {
        base.initMaintenanceMode();
    };

    // --------------------------------------------------------------------------

    /**
     * Set the activeTab when a tab is clicked so that the same tab can be shown on POST
     */
    base.initMaintenanceMode = function()
    {
        $('#field-maintenance-mode-enabled .toggle').on('toggle', function(e, active) {

            if (active) {

                base.allowFormSubmit = false;
                $('#maintenance-mode-extras').show();

            } else {

                base.allowFormSubmit = true;
                $('#maintenance-mode-extras').hide();
            }
        });

        if ($('#maintenance-mode-enabled').is(':checked')) {

            base.allowFormSubmit = false;
        }

        // --------------------------------------------------------------------------

        var message;
        $('#settings-form').on('submit', function() {

            console.log('boom', base.allowFormSubmit);
            if (!base.allowFormSubmit) {

                message  = 'You are about to enable maintenance mode.<br /><br />If you have not whitelisted your ';
                message += 'IP address then you will not be able to access the site, or turn off maintenance mode.';
                message += '<br /><br />Continue only if you are sure your IP address is whitelisted.';

                $('<div>').html(message).dialog({
                    title: 'Are you sure?',
                    resizable: false,
                    draggable: false,
                    modal: true,
                    buttons:
                    {
                        OK: function()
                        {
                            base.allowFormSubmit = true;
                            $('#settings-form input[type=submit]').click();
                        },
                        Cancel: function()
                        {
                            $(this).dialog('close');
                        },
                    }
                });
                return false;
            }

            return true;
        });
    };

    // --------------------------------------------------------------------------

    return base.__construct();
}();