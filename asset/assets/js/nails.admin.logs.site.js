/* global Mustache */
var NAILS_Admin_Logs_Site;
NAILS_Admin_Logs_Site = function()
{
    var base = this;

    // --------------------------------------------------------------------------

    base.__construct = function()
    {
        base.fetchLogs();
    };

    // --------------------------------------------------------------------------

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

    base.fetchLogsFail = function(data)
    {
        alert('fail');
        console.log(data);
    };

    // --------------------------------------------------------------------------

    return base.__construct();
};