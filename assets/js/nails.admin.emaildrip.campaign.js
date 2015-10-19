/* globals ko */
var dripCampaignEdit = function(emails) {

    /**
     * Avoid scope issues in callbacks and anonymous functions by referring to `this` as `base`
     * @type {Object}
     */
    var base = this;

    // --------------------------------------------------------------------------

    if (emails) {
        for (var i = emails.length - 1; i >= 0; i--) {
            emails[i].showTemplate = ko.observable(false);
        }
    }

    // --------------------------------------------------------------------------


    /**
     * The emails attached to this campaign
     * @type {observableArray}
     */
    base.emails = ko.observableArray(emails);

    // --------------------------------------------------------------------------

    /**
     * The interval units which the user can choose from
     * @type {Object}
     */
    base.intervalUnits = [
        {
            'id': 'DAY',
            'label': 'Days'
        },
        {
            'id': 'WEEK',
            'label': 'Weeks'
        },
        {
            'id': 'MONTH',
            'label': 'Months'
        },
        {
            'id': 'YEAR',
            'label': 'Years'
        }
    ];

    // --------------------------------------------------------------------------

    base.toggleTemplate = function()
    {
        this.showTemplate(!this.showTemplate());
    };

    // --------------------------------------------------------------------------

    base.addEmail = function()
    {
        var email = {
            'subject': '',
            'body_html': '',
            'body_text': '',
            'showTemplate': ko.observable(false),
            'trigger_event': '',
            'trigger_delay': {
                'interval': 1,
                'unit': 'DAY'
            }
        };

        base.emails.push(email);
    };

    // --------------------------------------------------------------------------

    base.removeEmail = function()
    {
        base.emails.remove(this);
    };

    // --------------------------------------------------------------------------

    base.moveUp = function()
    {
        alert('@todo: move email up the list');
    };

    // --------------------------------------------------------------------------

    base.moveDown = function()
    {
        alert('@todo: move email down the list');
    };
};
