/* global Mustache */
var NAILS_Admin_Logs_Site;
NAILS_Admin_Logs_Site = function()
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
        base.fetchLogs();
    };

    // --------------------------------------------------------------------------

    /**
     * Fetches logs from the server
     * @return {Void}
     */
    base.fetchLogs = function()
    {
        var call = {
            'controller': 'admin',
            'method': 'logs/site',
            'success': function(data)
            {
                base.fetchLogsOk(data);
            },
            'error': function(data)
            {
                var _data;
                try
                {
                    _data = JSON.parse(data);

                } catch (err) {

                    _data = {};
                }

                base.fetchLogsFail(_data);
            }
        };
        _nails_api.call(call);
    };

    // --------------------------------------------------------------------------

    /**
     * Called when fetchLogs is successful
     * @param  {Object} data Data returned by the server
     * @return {Void}
     */
    base.fetchLogsOk = function(data)
    {
        var tpl,html;

        $('#logEntries').empty();
        $('#pleaseNote').remove();

        if (data.logs.length > 0) {

            tpl = $('#templateLogRow').html();

            for (var i = 0; i < data.logs.length; i++) {

                html = Mustache.render(tpl, data.logs[i]);
                $('#logEntries').append(html);
            }

        } else {

            html = $('#templateNoLogFiles').html();
            $('#logEntries').html(html);
        }
    };

    // --------------------------------------------------------------------------

    /**
     * Called when fetchLogs is unsuccessful
     * @param  {Object} data Data from the server
     * @return {Void}
     */
    base.fetchLogsFail = function(data)
    {
        $('<div>')
        .html('<p>' + data.error + '</p>')
        .dialog(
        {
            title: 'An error occurred',
            resizable: false,
            draggable: false,
            modal: true,
            dialogClass: "no-close",
            buttons:
            {
                OK: function()
                {
                    $(this).dialog('close');
                }
            }
        })
        .show();
    };

    // --------------------------------------------------------------------------

    return base.__construct();
};