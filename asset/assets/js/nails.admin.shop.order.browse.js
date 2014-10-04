var NAILS_Admin_Shop_Order_Browse;
NAILS_Admin_Shop_Order_Browse = function()
{
	this.__construct = function()
	{
		var _this = this;	/*	Ugly Scope Hack	*/
		$( '#toggle-all' ).on( 'click', function()
		{
			_this._toggle_all();
		});
		$( '#batch-action a' ).on( 'click', function()
		{
			_this._batch_action();
			return false;
		});
	};

	// --------------------------------------------------------------------------

	this._toggle_all = function()
	{
		var _checked = $( '#toggle-all' ).is(':checked');
		$( '.batch-checkbox' ).prop( 'checked', _checked );
	};

	// --------------------------------------------------------------------------

	this._batch_action = function()
	{
		var _action = $( '#batch-action select' ).val();

		var _body,_title;

		switch( _action )
		{
			case 'mark-fulfilled' :

				_title = 'Coming Soon!';
				_body = 'Batch marking orders as fulfilled is in the pipeline and will be available soon.';

			break;

			case 'mark-unfulfilled' :

				_title = 'Coming Soon!';
				_body = 'Batch marking orders as unfulfilled is in the pipeline and will be available soon.';

			break;

			case 'download' :

				_title = 'Coming Soon!';
				_body = 'Downloading multiple order invoices is in the pipeline and will be available soon.';

			break;
		}

		if ( _title && _body )
		{
			$('<div>').html(_body).dialog({
				title: _title,
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
		}
	};


	// --------------------------------------------------------------------------


	return this.__construct();
};