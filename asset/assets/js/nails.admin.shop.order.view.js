var NAILS_Admin_Shop_Order_View;
NAILS_Admin_Shop_Order_View = function()
{
	this.__construct = function()
	{
		this._match_col_heights();

		// --------------------------------------------------------------------------

		var _this = this;	/*	Ugly Scope Hack	*/
		$( '.todo' ).on( 'click', function()
		{
			_this._todo();
			return false;
		});
	};

	// --------------------------------------------------------------------------

	this._match_col_heights = function()
	{
		var _max_height = 0;
		$( '.col-3 fieldset' ).each(function()
		{
			if ( $(this).outerHeight() > _max_height )
			{
				_max_height = $(this).outerHeight();
			}
		});

		$( '.col-3 fieldset' ).css( { 'height' : _max_height } );
	};

	// --------------------------------------------------------------------------

	this._todo = function()
	{
		$('<div>').html('This piece of functionality is in the works and will be available soon.').dialog({
			title: 'Coming soon!',
			resizable: false,
			draggable: false,
			modal: true,
			dialogClass: "no-close",
			buttons:
			{
				OK: function()
				{
					$(this).dialog("close");
				}
			}
		});
	};

	// --------------------------------------------------------------------------

	return this.__construct();
};