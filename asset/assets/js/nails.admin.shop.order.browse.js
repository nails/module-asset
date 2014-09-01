var NAILS_Admin_Shop_Order_Browse;
NAILS_Admin_Shop_Order_Browse = function()
{
	this.__construct = function()
	{
		var _this = this;	/*	Ugly Scope Hack	*/
		$( '#batch-action a' ).on( 'click', function()
		{
			_this._batch_action();
			return false;
		});
	};


	// --------------------------------------------------------------------------


	this._batch_action = function()
	{
		var _action = $( '#batch-action select' ).val();

		switch( _action )
		{
			case 'mark-fulfilled' :

				alert( 'TODO: Batch mark orders as fulfilled' );

			break;

			case 'mark-unfulfilled' :

				alert( 'TODO: Batch mark orders as unfulfilled' );

			break;

			case 'download' :

				alert( 'TODO: Download multiple orders' );

			break;
		}
	};


	// --------------------------------------------------------------------------


	return this.__construct();
};