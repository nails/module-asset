var NAILS_Admin_Email_Settings;
NAILS_Admin_Email_Settings = function()
{
	this.__construct = function()
	{
		this._init_driver();
	};


	// --------------------------------------------------------------------------


	this._init_driver = function()
	{
		//	Bind
		var _this = this;
		$( '#driver-environment' ).on( 'change', function()
		{
			_this._driver_environment_change();
		});

		$( 'select.environment-driver' ).on( 'change', function()
		{
			_this._driver_change( $(this) );
		});

		// --------------------------------------------------------------------------

		//	Initial settings
		this._driver_environment_change();

		$( 'select.environment-driver' ).each( function()
		{
			_this._driver_change( $(this) );
		});
	};


	// --------------------------------------------------------------------------


	this._driver_environment_change = function()
	{
		var _value = $('#driver-environment').val();

		$( '.driver-settings' ).hide();

		if ( _value.length )
		{
			$( '.driver-settings.' + _value ).show();
		}
	};


	// --------------------------------------------------------------------------


	this._driver_change = function( element )
	{
		var _container	= element.closest( '.driver-settings' );
		var _value		= element.val();

		switch ( _value )
		{
			case 'SMTP' :

				$( '.settings-smtp', _container ).show();
				$( '.settings-mandrill', _container ).hide();

			break;

			case 'MANDRILL' :

				$( '.settings-smtp', _container ).hide();
				$( '.settings-mandrill', _container ).show();

			break;

			default :

				$( '.settings-smtp', _container ).hide();
				$( '.settings-mandrill', _container ).hide();

			break;
		}
	};


	// --------------------------------------------------------------------------

	return this.__construct();
};