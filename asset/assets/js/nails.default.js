
// --------------------------------------------------------------------------

//	NAILS_JS: A ton of helpful stuff

// --------------------------------------------------------------------------

//	Catch undefined console
/* jshint ignore:start */
if (typeof(console) === "undefined")
{
	var console;
	console = {
		log: function() {},
		debug: function() {},
		info: function() {},
		warn: function() {},
		error: function() {}
	};
}
/* jshint ignore:end */

// --------------------------------------------------------------------------

var NAILS_JS;
NAILS_JS = function()
{
	this.__construct = function()
	{
		this._init_system_alerts();
		this._init_tipsy();
		this._init_fancybox();
		this._init_confirm();
		this._init_tabs();
		this._init_forms();
	};


	// --------------------------------------------------------------------------


	/**
	 *
	 * Add a close button to any system-alerts which are on the page
	 *
	 **/
	this._init_system_alerts = function()
	{
		//	Scroll to first error, if scrollTo is available
		if ($.fn.scrollTo)
		{
			var _inline	= $('div.field.error:visible');
			var _scroll;

			if (_inline.length)
			{
				//	Scroll to this item
				_scroll = $(_inline.get(0));
			}
			else
			{
				var _system = $('div.system-alert.error:visible');
				_scroll = $(_system.get(0));
			}

			if (_scroll.length)
			{
				//	Giving the browser a slight chance to work out sizes etc
				setTimeout(function() { $.scrollTo(_scroll, 'fast', { axis: 'y', offset : { top: -60 } }); }, 750);
			}
		}
		else
		{
			this.log('NAILS_JS: scrollTo not available.');
		}
	};


	// --------------------------------------------------------------------------


	/**
	 *
	 * Initialise any tipsy elements on the page
	 *
	 **/
	this._init_tipsy = function()
	{
		if ($.fn.tipsy)
		{
			//	Once tipsy'd, add drunk class - so it's not called twice should this method be called again
			//	Tipsy... drunk... geddit?

			$('*[rel=tipsy]:not(.drunk)').tipsy({ opacity : 0.85 }).addClass('drunk');
			$('*[rel=tipsy-html]:not(.drunk)').tipsy({ opacity : 0.85, html: true }).addClass('drunk');
			$('*[rel=tipsy-right]:not(.drunk)').tipsy({ opacity : 0.85, gravity: 'w' }).addClass('drunk');
			$('*[rel=tipsy-left]:not(.drunk)').tipsy({ opacity : 0.85, gravity: 'e' }).addClass('drunk');
			$('*[rel=tipsy-top]:not(.drunk)').tipsy({ opacity : 0.85, gravity: 's' }).addClass('drunk');
			$('*[rel=tipsy-bottom]:not(.drunk)').tipsy({ opacity : 0.85, gravity: 'n' }).addClass('drunk');
		}
		else
		{
			this.log('NAILS_JS: Tipsy not available.');
		}
	};


	// --------------------------------------------------------------------------


	/**
	 *
	 * Initialise any fancybox elements on the page
	 *
	 **/
	this._init_fancybox = function()
	{
		if ($.fn.fancybox)
		{
			$(document).on('click', '.fancybox', function(e)
			{
				e.preventDefault();
				e.stopPropagation();

				//	Prep the URL
				var _href = $(this).attr('href');

				if (_href.substr(0, 1) !== '#')
				{
					var _regex	= /\?/g;

					if (!_regex.test(_href))
					{
						//	Append '?'
						_href += '?';
					}
					else
					{
						//	Append '&'
						_href += '&';
					}

					_href += 'isFancybox=true';
				}

				//	Interpret width and height
				var _h = $(this).data('height');
				var _w = $(this).data('width');

				//	Open a new fancybox instance
				$('<a>').fancybox({
					'href': _href,
					'width': _w,
					'height': _h,
					'helpers': {
						'overlay': {
							'locked': false
						}
					},
					'beforeLoad': function()
					{
						$('body').addClass('noScroll');
					},
					'afterClose': function()
					{
						$('body').removeClass('noScroll');
					}
				}).trigger('click');

				return false;
			});
		}
		else
		{
			this.log('NAILS_JS: Fancybox not available.');
		}
	};


	// --------------------------------------------------------------------------


	/**
	 *
	 * Initialise any confirm links or buttons on the page
	 *
	 **/
	this._init_confirm = function()
	{

		$(document).on('click', 'a.confirm' , function()
		{
			var _a		= $(this);
			var _body	= _a.data('body').replace(/\\n/g, "\n");
			var _title	= _a.data('title');

			if (_body.length)
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
							window.location.href = _a.attr('href');
						},
						Cancel: function()
						{
							$(this).dialog("close");
						}
					}
				});

				return false;
			}
			else
			{

				//	No message, just let the event bubble as normal.
				return true;
			}
		});
	};


	// --------------------------------------------------------------------------


	this._init_tabs = function()
	{
		var _this = this;	/*	Ugly Scope Hack	*/
		$(document).on('click', 'ul.tabs:not(.disabled) li.tab a', function()
		{
			if (!$(this).hasClass('disabled'))
			{
				_this.switch_to_tab($(this));
			}

			return false;
		});

		// --------------------------------------------------------------------------

		//	Look for tabs which contain error'd fields
		$('li.tab a').each(function(){

			if ($('#' + $(this).data('tab') + ' div.field.error').length)
			{
				$(this).addClass('error');
			}

			if ($('#' + $(this).data('tab') + ' .system-alert.error').length)
			{
				$(this).addClass('error');
			}

			if ($('#' + $(this).data('tab') + ' .error.show-in-tabs').length)
			{
				$(this).addClass('error');
			}
		});
	};


	// --------------------------------------------------------------------------


	this.switch_to_tab = function(switch_to)
	{
		//	Tab group
		var _tabs		= switch_to.parents('ul.tabs');
		var _tabgroup	= switch_to.parents('ul.tabs').data('tabgroup');
		_tabgroup		= _tabgroup ? '.' + _tabgroup : '';

		//	Switch tab
		$('li.tab', _tabs).removeClass('active');
		switch_to.parent().addClass('active');

		// --------------------------------------------------------------------------

		//	Show results
		var _tab = switch_to.attr('data-tab');
		$('section.tabs' + _tabgroup + ' > div.tab.page').removeClass('active');
		$('#' + _tab).addClass('active');

		// --------------------------------------------------------------------------

		this.add_stripes();
	};


	// --------------------------------------------------------------------------


	this._init_forms = function()
	{
		this.add_stripes();
		this.process_prefixed_inputs();

		// --------------------------------------------------------------------------

		//	Init any datetime pickers
		if ($.fn.datepicker)
		{
			//	Date pickers
			$('div.field.date input.date').each(function()
			{
				//	Fetch some info which may be available in the data attributes
				var _dateformat	= $(this).data('datepicker-dateformat') || 'yy-mm-dd';
				var _yearrange	= $(this).data('datepicker-yearrange') || 'c-100:c+10';

				//	Instanciate datepicker
				$(this).datepicker(
				{
					dateFormat	: _dateformat,
					changeMonth	: true,
					changeYear	: true,
					yearRange	: _yearrange
				});
			});
		}
		else
		{
			this.error('NAILS_JS: datepicker not available.');
		}

		if ($.fn.datetimepicker)
		{
			//	Datetime pickers
			$('div.field.datetime input.datetime').each(function()
			{
				//	Fetch some info which may be available in the data attributes
				var _dateformat	= $(this).data('datepicker-dateformat') || 'yy-mm-dd';
				var _timeformat	= $(this).data('datepicker-timeformat') || 'HH:mm:ss';
				var _yearrange	= $(this).data('datepicker-yearrange') || 'c-100:c+10';

				$(this).datetimepicker(
				{
					dateFormat	: _dateformat,
					timeFormat	: _timeformat,
					changeMonth	: true,
					changeYear	: true,
					yearRange	: _yearrange
				});

			});
		}
		else
		{
			this.log('NAILS_JS: datetimepicker not available.');
		}
	};


	// --------------------------------------------------------------------------


	this.add_stripes = function()
	{
		$('fieldset,.fieldset').each(function() {

			$('div.field', this).removeClass('odd even');
			$('div.field:visible:odd', this).addClass('odd');
			$('div.field:visible:even', this).addClass('even');

		});
	};


	// --------------------------------------------------------------------------


	this.process_prefixed_inputs = function()
	{
		$('input[data-prefix]:not(.nails-prefixed)').each(function()
		{
			var _container	= $('<div>').addClass('nails-prefixed').css('width', $(this).css('width'));
			var _prefix		= $('<div>').addClass('nails-prefix').html($(this).data('prefix'));

			_container.append(_prefix);
			$(this).clone(true).addClass('nails-prefixed').appendTo(_container);

			$(this).replaceWith(_container);
		});
	};


	// --------------------------------------------------------------------------


	this.log = function(output)
	{
		if (window.console && window.ENVIRONMENT !== 'PRODUCTION')
		{
			console.log(output);
		}
	};


	// --------------------------------------------------------------------------


	this.error = function(output)
	{
		if (window.console && window.ENVIRONMENT !== 'PRODUCTION')
		{
			console.error(output);
		}
	};


	// --------------------------------------------------------------------------


	this.warn = function(output)
	{
		if (window.console && window.ENVIRONMENT !== 'PRODUCTION')
		{
			console.warn(output);
		}
	};

	// --------------------------------------------------------------------------

	return this.__construct();
};