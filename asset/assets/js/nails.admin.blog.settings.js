var NAILS_Admin_Blog_Settings;
NAILS_Admin_Blog_Settings = function()
{
	this.__construct = function()
	{
		this._init_comments();
		this._init_social();
		this._init_skins();

		// --------------------------------------------------------------------------

		//	Set up shop
		this._comment_engine_change();
	};


	// --------------------------------------------------------------------------


	this._init_comments = function()
	{
		var _this = this;

		$( '#comment-engine' ).on( 'change', function()
		{
			_this._comment_engine_change();
		});
	};


	// --------------------------------------------------------------------------


	this._comment_engine_change = function()
	{
		switch( $( '#comment-engine' ).val() )
		{
			case 'NATIVE' :

				$( '#native-settings' ).show();
				$( '#disqus-settings' ).hide();

			break;

			// --------------------------------------------------------------------------

			case 'DISQUS' :

				$( '#native-settings' ).hide();
				$( '#disqus-settings' ).show();

			break;
		}
	};


	// --------------------------------------------------------------------------


	this._init_social = function()
	{
		var _this = this;

		$( '#social-service-facebook' ).on( 'change', function()
		{
			_this._social_service_change( 'facebook', $(this).is( ':checked' ) );
		});

		$( '#social-service-facebook' ).closest( 'div.field' ).on( 'toggle', function()
		{
			_this._social_service_change( 'facebook', $( '#social-service-facebook' ).is( ':checked' ) );
		});

		// --------------------------------------------------------------------------

		$( '#social-service-twitter' ).on( 'change', function()
		{
			_this._social_service_change( 'twitter', $(this).is( ':checked' ) );
		});

		$( '#social-service-twitter' ).closest( 'div.field' ).on( 'toggle', function()
		{
			_this._social_service_change( 'twitter', $( '#social-service-twitter' ).is( ':checked' ) );
		});

		// --------------------------------------------------------------------------

		$( '#social-service-googleplus' ).on( 'change', function()
		{
			_this._social_service_change( 'googleplus', $(this).is( ':checked' ) );
		});

		$( '#social-service-googleplus' ).closest( 'div.field' ).on( 'toggle', function()
		{
			_this._social_service_change( 'googleplus', $( '#social-service-googleplus' ).is( ':checked' ) );
		});

		// --------------------------------------------------------------------------

		$( '#social-service-pinterest' ).on( 'change', function()
		{
			_this._social_service_change( 'pinterest', $(this).is( ':checked' ) );
		});

		$( '#social-service-pinterest' ).closest( 'div.field' ).on( 'toggle', function()
		{
			_this._social_service_change( 'pinterest', $( '#social-service-pinterest' ).is( ':checked' ) );
		});

		// --------------------------------------------------------------------------

		$( '#blog-settings-social-layout' ).on( 'change', function()
		{
			_this._social_layout_change( $(this).val() );
		});
	};


	// --------------------------------------------------------------------------


	this._social_service_change = function( service, enabled )
	{
		switch( service )
		{
			case 'facebook' :


			break;

			// --------------------------------------------------------------------------

			case 'twitter' :

				if ( enabled )
				{
					$( '#blog-settings-social-twitter' ).show();
				}
				else
				{
					$( '#blog-settings-social-twitter' ).hide();
				}

			break;

			// --------------------------------------------------------------------------

			case 'googleplus' :

			break;

			// --------------------------------------------------------------------------

			case 'pinterest' :

			break;
		}

		// --------------------------------------------------------------------------

		//	If anything is enabled, then show customisation settings
		if (
				$( '#social-service-facebook' ).is( ':checked' ) ||
				$( '#social-service-twitter' ).is( ':checked' ) ||
				$( '#social-service-googleplus' ).is( ':checked' ) ||
				$( '#social-service-pinterest' ).is( ':checked' )
		)
		{
			$( '#blog-settings-social-config' ).show();
		}
		else
		{
			$( '#blog-settings-social-config' ).hide();
		}
	};


	// --------------------------------------------------------------------------


	this._social_layout_change = function( layout )
	{
		if ( layout === 'SINGLE' )
		{
			$( '#blog-settings-social-layout-single-text' ).show();
		}
		else
		{
			$( '#blog-settings-social-layout-single-text' ).hide();
		}

		// --------------------------------------------------------------------------

		_nails.add_stripes();
	};


	// --------------------------------------------------------------------------


	this._init_skins = function()
	{
		$( 'ul.skins li.skin' ).on( 'click', function()
		{
			$( 'ul.skins li.skin' ).removeClass( 'selected' );
			$(this).addClass( 'selected' );
			$(this).find( 'input[type=radio]' ).prop( 'checked', true );
		});
	};


	// --------------------------------------------------------------------------


	return this.__construct();
};