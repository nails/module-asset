/* globals _nails_api  */
var NAILS_Admin_Shop_Vouchers_Edit;
NAILS_Admin_Shop_Vouchers_Edit = function()
{
    /**
     * Avoid scope issues in callbacks and anonymous functions by referring to `this` as `base`
     * @type {Object}
     */
    var base = this;

    // --------------------------------------------------------------------------

    /**
     * Constructs the class and binds to all the things
     * @return {void}
     */
    base.__construct = function()
    {
        //  Bind listeners
        $('select[name=type]').on('change', function()
        {
            base.handleTypeChange();
        });

        $('select[name=discount_application]').on('change', function()
        {
            base.handleApplicationChange();
        });

        $('#generate-code').on('click', function()
        {
            return base.generateCode();
        });

        // --------------------------------------------------------------------------

        //  Run the handlers, so the form is rendered appropriately
        base.handleApplicationChange();
        base.handleTypeChange();

        // --------------------------------------------------------------------------

        //  Instanciate the datepickers
        $('.datetime1').datetimepicker(
        {
            'dateFormat': 'yy-mm-dd',
            'timeFormat': 'HH:mm:ss',
            'beforeShow': function()
            {
                $('.datetime1').datetimepicker('option', "maxDate", $('.datetime2').datetimepicker('getDate'));
            },
            'onSelect': function()
            {
                $('.datetime2').datetimepicker('option', "minDate", $('.datetime1').datetimepicker('getDate'));
            }
        });

        $('.datetime2').datetimepicker(
        {
            'dateFormat': 'yy-mm-dd',
            'timeFormat': 'HH:mm:ss',
            'minDate': new Date(),
            'beforeShow': function()
            {
                $('.datetime2').datetimepicker('option', "minDate", $('.datetime1').datetimepicker('getDate'));
            },
            'onSelect': function()
            {
                $('.datetime1').datetimepicker('option', "maxDate", $('.datetime2').datetimepicker('getDate'));
            }
        });
    };

    // --------------------------------------------------------------------------

    /**
     * Triggered when the user changes the voucher type
     * @return {void}
     */
    base.handleTypeChange = function()
    {
        switch($('select[name=type]').val())
        {
            case 'NORMAL':

                $('#type-limited').hide();
                $('select[name=discount_type]').removeAttr('disabled');
                $('select[name=discount_application]').removeAttr('disabled');
                break;

            case 'LIMITED_USE':

                $('#type-limited').show();
                $('select[name=discount_type]').removeAttr('disabled');
                $('select[name=discount_application]').removeAttr('disabled');
                break;

            case 'GIFT_CARD':

                $('#type-limited').hide();
                $('#application-product_types').hide();

                //  Set the discount type to amount and readonly-ify
                $('select[name=discount_type] option[selected=selected]').attr('selected', '');
                $('select[name=discount_type] option[value=AMOUNT]').attr('selected', 'selected');
                $('select[name=discount_type]').attr('disabled', 'disabled');
                $('select[name=discount_type]').trigger('change');

                $('select[name=discount_application] option[selected=selected]').attr('selected', '');
                $('select[name=discount_application] option[value=ALL]').attr('selected', 'selected');
                $('select[name=discount_application]').attr('disabled', 'disabled');
                $('select[name=discount_application]').trigger('change');
                break;
        }

        base.hideNoExtendedData();
    };

    // --------------------------------------------------------------------------

    /**
     * Triggered when the user changes the voucher application
     * @return {void}
     */
    base.handleApplicationChange = function()
    {
        switch($('select[name=discount_application]').val())
        {
            case 'PRODUCTS':
            case 'SHIPPING':
            case 'ALL':

                $('#application-product_types').hide();
                break;

            case 'PRODUCT_TYPES':

                $('#application-product_types').show();
                break;
        }

        base.hideNoExtendedData();
    };

    // --------------------------------------------------------------------------

    /**
     * Shows the "No extended data" element when there's no extended data
     * @return {void}
     */
    base.hideNoExtendedData = function() {

        //  Test if any of the extended views are visible, if so, hide the message
        if ($('#type-limited:visible, #type-gift_card:visible, #application-product_types:visible').length) {

            $('#no-extended-data').hide();

        } else {

            $('#no-extended-data').show();
        }
    };

    // --------------------------------------------------------------------------

    /**
     * Calls the API and requests a unique voucher code
     * @return {void}
     */
    base.generateCode = function()
    {
        $('#generateCodeSpinner').show();

        var call = {
            'controller': 'shop/voucher',
            'method': 'generateCode',
            'success': function(data)
            {
                base.generateCodeOk(data);
            }
        };
        _nails_api.call(call);
        return false;
    };

    // --------------------------------------------------------------------------

    /**
     * Callback when the code generation was successful
     * @param  {Object} data The data returned by the server
     * @return {void}
     */
    this.generateCodeOk = function(data)
    {
        $('#generateCodeSpinner').hide();
        $('input[name=code]').val(data.code);
    };

    // --------------------------------------------------------------------------

    return base.__construct();
};