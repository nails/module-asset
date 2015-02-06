var NAILS_CDN_Manager;
NAILS_CDN_Manager =  function() {

	this.handler			= '';
	this.callback			= '';
	this.url_schemes		= {};
	this.isFancybox			= '';
	this.reopen_fancybox	= '';
	this._api				= null;

	// --------------------------------------------------------------------------

	this.init = function(handler, callback, url_schemes, isFancybox, reopen_fancybox)
	{
		this.handler			= handler;
		this.callback			= callback;
		this.url_schemes		= url_schemes;
		this.isFancybox			= isFancybox;
		this.reopen_fancybox	= reopen_fancybox;

		// --------------------------------------------------------------------------

		//	Set up the API interface
		this._api = new window.NAILS_API();

		// --------------------------------------------------------------------------

		this._init_submit();
		this._init_alerts();
		this._init_upload();
		this._init_delete();
		this._init_insert();
		this._init_search();

		// --------------------------------------------------------------------------

		//	Is the callback callable?
		var _callable = false;
		if (this.handler === 'ckeditor')
		{
			//	Assume callable - CKEditor should handle this.
			_callable = true;
		}
		else
		{
			if (this.isFancybox)
			{
				_callable = typeof(window.parent._nails_forms[this.callback]) === 'function' ? true : false;
			}
			else
			{
				if (window.opener)
				{
					_callable = typeof(window.opener._nails_forms[this.callback]) === 'function' ? true : false;
				}
				else
				{
					_callable = false;
				}
			}
		}

		if (! _callable)
		{
			$('a.insert').remove();
		}

		// --------------------------------------------------------------------------

		//	Initiate the fancyboxes, doing so here so we can style it slightly differently
		$('a.cdn-fancybox').fancybox(
		{
			padding:0,
			wrapCSS: 'cdn-fancybox',
			helpers :
			{
				title:
				{
					type: 'over'
				}
			}
		});
	};


	// --------------------------------------------------------------------------


	this._init_submit = function()
	{
		var _this = this;	/*	Ugly Scope Hack	*/
		$('form').on('submit', function() { _this._show_mask(); });
	};


	// --------------------------------------------------------------------------


	this._init_alerts = function()
	{
		var _this = this;	/*	Ugly Scope Hack	*/
		$('.system-alert .awesome').on('click', function() { _this._hide_alert(); return false; });

		// --------------------------------------------------------------------------

		//	If alert is open and enter is pressed then trigger the first button
		$(document).on('keydown', function(e)
		{
			//	Enter key
			if (e.keyCode === 13 && $('#alert:visible').length > 0)
			{
				$('#alert .awesome.ok').first().click();
			}

			//	Escape
			if (e.keyCode === 27 && $('#alert:visible').length > 0)
			{
				$('#alert .awesome.cancel').first().click();
			}
		});
	};


	// --------------------------------------------------------------------------


	this._init_upload = function()
	{

	};


	// --------------------------------------------------------------------------


	this._init_delete = function()
	{
		$('a.delete').on('click', function()
		{
			var _a = $(this);

			$('<div>').html('<p>Any resources which are using this object will have the reference removed.</p><p>Continue?</p>').dialog({
				title: 'Are you sure?',
				resizable: false,
				draggable: false,
				modal: true,
				dialogClass: "no-close",
				buttons:
				{
					"Delete": function()
					{
						window.location.href = _a.attr('href');
					},
					Cancel: function()
					{
						$(this).dialog("close");
					}
				}
			});

			return false;
		});
	};


	// --------------------------------------------------------------------------


	this._init_insert = function()
	{
		var _this = this;	/*	Ugly Scope Hack	*/

		$('a.insert').on('click', function()
		{
			var _file		= $(this).attr('data-file');
			var _id			= $(this).attr('data-id');
			var _fieldid	= $(this).attr('data-fieldid');
			var _bucket		= $(this).attr('data-bucket');

			if (_this.handler === 'ckeditor')
			{
				_this._insert_ckeditor(_bucket, _file, _id);
			}
			else
			{
				_this._insert_native(_file, _id, _fieldid);
			}

			//	Close window
			if (_this.isFancybox)
			{
				parent.$.fancybox.close();
			}
			else
			{
				window.close();
			}

			// --------------------------------------------------------------------------

			return false;
		});
	};


	// --------------------------------------------------------------------------


	this._insert_ckeditor = function(bucket, file, id)
	{
		//	TODO Render a modal asking for customisations to the URL

		//	Choose the scheme to use (TODO, make this dynamic)
		var _scheme = this.url_schemes.serve;

		//	Break into filename and extensions
		var _file = file.split('.');

		//	Define the data object
		var _data = {
			bucket		: bucket,
			filename	: _file[0],
			extension	: '.' + _file[1],
			id			: id,
			width		: 0,		//	TODO
			height		: 0,		//	TODO
			sex			: '',		//	TODO
			border		: 0			//	TODO
		};

		//	Apply the scheme
		var _url = Mustache.render(_scheme, _data);

		//	Call back to the CKEditor instance
		window.opener.CKEDITOR.tools.callFunction(this.callback, _url);
	};


	// --------------------------------------------------------------------------


	this._insert_native = function(file, id, fieldid)
	{
		if (this.isFancybox)
		{
			window.parent._nails_forms[this.callback].call(null, file, id, this.reopen_fancybox, fieldid);
		}
		else
		{
			window.opener._nails_forms[this.callback].call(null, file, id, this.reopen_fancybox, fieldid);
		}
	};


	// --------------------------------------------------------------------------


	this._init_search = function()
	{
		var _this = this;	/*	Ugly Scope Hack	*/
		$('#search-text').on('keyup', function() { _this._do_search($(this).val()); return false; });
	};


	// --------------------------------------------------------------------------


	this._do_search = function(term)
	{
		$('li.file,tr.file:not(.head)').each(function()
		{
			var regex = new RegExp(term, 'gi');

			if (regex.test($(this).attr('data-title')))
			{
				$(this).show();
			}
			else
			{
				$(this).hide();
			}
		});
	};


	// --------------------------------------------------------------------------


	this._show_mask = function()
	{
		$('#mask').show();
	};


	// --------------------------------------------------------------------------


	this._hide_mask = function()
	{
		$('#mask').hide();
	};


	// --------------------------------------------------------------------------


	this._show_alert = function()
	{
		$('#alert').show();
	};


	// --------------------------------------------------------------------------


	this._hide_alert = function()
	{
		$('#alert').hide();
	};
};