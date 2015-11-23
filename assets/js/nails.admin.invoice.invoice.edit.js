/* globals ko, console, _nails_api */
/* exported invoiceEdit*/
var invoiceEdit = function(units, taxes, items) {

    /**
     * Avoid scope issues in callbacks and anonymous functions by referring to `this` as `base`
     * @type {Object}
     */
    var base = this;

    // --------------------------------------------------------------------------

    /**
     * The unit types available
     * @type {observableArray}
     */

    base.units = ko.observableArray();
    for (var key in units) {
        if (units.hasOwnProperty(key)) {
            base.units.push({
                'slug': key,
                'label': units[key]
            });
        }
    }

    // --------------------------------------------------------------------------

    /**
     * The taxes available
     * @type {observableArray}
     */
    base.taxes = ko.observableArray(taxes);

    // --------------------------------------------------------------------------

    /**
     * The items attached to this invoice
     * @type {observableArray}
     */
    base.items = ko.observableArray(items);

    // --------------------------------------------------------------------------

    base.addItem = function()
    {
        var item = {
            'id': null,
            'quantity': null,
            'unit': null,
            'label': '',
            'body': '',
            'price': null,
            'tax': null
        };

        base.items.push(item);
    };

    // --------------------------------------------------------------------------

    base.removeItem = function()
    {
        base.items.remove(this);
    };

    // --------------------------------------------------------------------------

    base.moveUp = function()
    {
        base.warn('@todo: move item up the list');
    };

    // --------------------------------------------------------------------------

    base.moveDown = function()
    {
        base.warn('@todo: move item down the list');
    };

    // --------------------------------------------------------------------------

    base.generateRef = function(thisClass, event)
    {
        $(event.currentTarget).addClass('loading');
        var call = {
            'controller': 'invoice/invoice',
            'method': 'generateRef',
            'success': function(data) {
                $('#invoice-ref').val(data.ref);
                $(event.currentTarget).removeClass('loading');
            }
        };

        _nails_api.call(call);
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

                console.log('Invoice Edit:', message, payload);

            } else {

                console.log('Invoice Edit:', message);
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

                console.warn('Invoire Edit:', message, payload);

            } else {

                console.warn('Invoire Edit:', message);
            }
        }
    };
};
