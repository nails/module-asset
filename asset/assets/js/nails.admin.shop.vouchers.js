var NAILS_Admin_Shop_Vouchers;
NAILS_Admin_Shop_Vouchers = function()
{
    this.init_create = function()
    {
        var _this = this;

        // --------------------------------------------------------------------------

        //  Bind listeners
        $( 'select[name=type]' ).on( 'change', function()
        {
            _this._handle_type_change();
        });

        $( 'select[name=discount_application]' ).on( 'change', function()
        {
            _this._handle_application_change();
        });

        $( '#generate-code' ).on( 'click', function()
        {
            return _this.generateCode();
        });

        // --------------------------------------------------------------------------

        //  Run the handlers, so the form is rendered appropriately
        this._handle_application_change();
        this._handle_type_change();

        // --------------------------------------------------------------------------

        //  Instanciate the datepickers
        $( '.datetime1' ).datetimepicker(
        {
            dateFormat  : 'yy-mm-dd',
            timeFormat  : 'HH:mm:ss',
            beforeShow      : function()
            {
                $( '.datetime1' ).datetimepicker( 'option', "maxDate", $( '.datetime2' ).datetimepicker( 'getDate' ) );
            },
            onSelect    : function()
            {
                $( '.datetime2' ).datetimepicker( 'option', "minDate", $( '.datetime1' ).datetimepicker( 'getDate' ) );
            }
        });

        var _today = new Date();

        $( '.datetime2' ).datetimepicker(
        {
            dateFormat  : 'yy-mm-dd',
            timeFormat  : 'HH:mm:ss',
            minDate     : _today,
            beforeShow      : function()
            {
                $( '.datetime2' ).datetimepicker( 'option', "minDate", $( '.datetime1' ).datetimepicker( 'getDate' ) );
            },
            onSelect    : function()
            {
                $( '.datetime1' ).datetimepicker( 'option', "maxDate", $( '.datetime2' ).datetimepicker( 'getDate' ) );
            }
        });
    };


    // --------------------------------------------------------------------------


    this._handle_type_change = function()
    {
        switch( $( 'select[name=type]' ).val() )
        {
            case 'NORMAL' :

                $( '#type-limited' ).hide();

                // --------------------------------------------------------------------------

                $( 'select[name=discount_type]' ).removeAttr( 'disabled' );
                $( 'select[name=discount_type]' ).trigger('liszt:updated');

                $( 'select[name=discount_application]' ).removeAttr( 'disabled' );
                $( 'select[name=discount_application]' ).trigger('liszt:updated');

            break;

            case 'LIMITED_USE' :

                $( '#type-limited' ).show();

                // --------------------------------------------------------------------------

                $( 'select[name=discount_type]' ).removeAttr( 'disabled' );
                $( 'select[name=discount_type]' ).trigger('liszt:updated');

                $( 'select[name=discount_application]' ).removeAttr( 'disabled' );
                $( 'select[name=discount_application]' ).trigger('liszt:updated');

            break;

            case 'GIFT_CARD' :

                $( '#type-limited' ).hide();
                $( '#application-product_types' ).hide();

                // --------------------------------------------------------------------------

                //  Set the discount type to amount and readonly-ify
                $( 'select[name=discount_type] option[selected=selected]' ).attr( 'selected', '' );
                $( 'select[name=discount_type] option[value=AMOUNT]' ).attr( 'selected', 'selected' );
                $( 'select[name=discount_type]' ).attr( 'disabled', 'disabled' );
                $( 'select[name=discount_type]' ).trigger('liszt:updated');

                $( 'select[name=discount_application] option[selected=selected]' ).attr( 'selected', '' );
                $( 'select[name=discount_application] option[value=ALL]' ).attr( 'selected', 'selected' );
                $( 'select[name=discount_application]' ).attr( 'disabled', 'disabled' );
                $( 'select[name=discount_application]' ).trigger('liszt:updated');

            break;
        }

        // --------------------------------------------------------------------------

        //  Test if any of the extended views are visible, if so, hide the message
        if ( $( '#type-limited:visible, #type-gift_card:visible, #application-product_types:visible' ).length )
        {
            $( '#no-extended-data' ).hide();
        }
        else
        {
            $( '#no-extended-data' ).show();
        }
    };


    // --------------------------------------------------------------------------


    this._handle_application_change = function()
    {
        switch( $( 'select[name=discount_application]' ).val() )
        {
            case 'PRODUCTS' :
            case 'SHIPPING' :
            case 'ALL' :

                $( '#application-product_types' ).hide();

            break;

            case 'PRODUCT_TYPES' :

                $( '#application-product_types' ).show();

            break;
        }

        // --------------------------------------------------------------------------

        //  Test if any of the extended views are visible, if so, hide the message
        if ( $( '#type-limited:visible, #type-gift_card:visible, #application-product_types:visible' ).length )
        {
            $( '#no-extended-data' ).hide();
        }
        else
        {
            $( '#no-extended-data' ).show();
        }
    };


    // --------------------------------------------------------------------------


    this.generateCode = function()
    {
        var _this = this;
        var _call = {
            'controller': 'admin/shop',
            'method': 'voucher_generate_code',
            'success': function(data)
            {
                _this.generateCodeOk(data);
            }
        };
        _nails_api.call(_call);
        return false;
    };

    // --------------------------------------------------------------------------

    this.generateCodeOk = function(data)
    {
        $('input[name=code]').val(data.code);
    };
};