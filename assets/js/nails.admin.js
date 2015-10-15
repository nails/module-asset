//  Catch undefined console
/* globals console, _nails_api  */
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

var NAILS_Admin;
NAILS_Admin = function()
{
    /**
     * Avoid scope issues in callbacks and anonymous functions by referring to `this` as `base`
     * @type {Object}
     */
    var base = this;

    // --------------------------------------------------------------------------

    /**
     * Construct the class
     * @return {Void}
     */
    base.__construct = function()
    {
        base.initBoxes();
        base.initNavSearch();
        base.initNavReset();
        base.initSearchBoxes();
        base.initMobileMenu();
        base.initToggles();
        base.initCkeditor();
        base.initSelect2();
        base.initNiceTime();
        base.initSystemAlerts();
    };

    // --------------------------------------------------------------------------

    /**
     * Initialise the nav boxes
     * @return {Void}
     */
    base.initBoxes = function()
    {
        //  Bind click events
        $('.box .toggle').on('click', function()
        {
            if ($(this).parents('.box').hasClass('open')) {

                base.closeBox(this, true);

            } else {

                base.openBox(this, true);
            }

            // --------------------------------------------------------------------------

            //  Save user's preference
            base.saveNav();

            // --------------------------------------------------------------------------

            return false;
        });

        // --------------------------------------------------------------------------

        //  Set initial state of each box
        var _state, _toggle, _height, _container;

        $('ul.modules li.module').each(function() {

            _state = $(this).data('initial-state');

            // --------------------------------------------------------------------------

            //  Determine height of each box and set it
            _toggle    = $(this).find('.toggle');
            _container = $(this).find('.box-container');
            _height    = _container.outerHeight();

            _toggle.attr('data-height', _height);

            // --------------------------------------------------------------------------

            if (_state === 'open')
            {
                base.openBox(_toggle, false);
            }
            else
            {
                base.closeBox(_toggle, false);
            }

        });

        // --------------------------------------------------------------------------

        //  Sortables!
        $('ul.modules').sortable({
            axis:'y',
            placeholder: 'sort-placeholder',
            items: 'li.module.sortable',
            handle: '.handle',
            start: function(e, ui)
            {
                ui.placeholder.height(ui.helper.outerHeight());
            },
            stop: function()
            {
                base.saveNav();
            }
        });
    };

    // --------------------------------------------------------------------------

    /**
     * Save the nav layout
     * @return {Void}
     */
    base.saveNav = function()
    {
        var _data, _call, _open;

        _data = {};

        $('ul.modules li.module').each(function()
        {
            _open = $('.box', this).hasClass('open');
            _data[$(this).data('grouping')] = {
                'open': _open
            };
        });

        _call = {
            'controller': 'admin/nav',
            'method': 'save',
            'action': 'POST',
            'data':
            {
                'preferences': _data
            }
        };

        _nails_api.call(_call);
    };

    // --------------------------------------------------------------------------

    /**
     * Open a nav box
     * @param  {Object}  toggle  The box which was toggled
     * @param  {Boolean} animate Whether to animate the movement
     * @return {Void}
     */
    base.openBox = function(toggle, animate)
    {
        var _id, _height;

        _id = $(toggle).parents('.box').attr('id');

        // --------------------------------------------------------------------------

        $(toggle).parents('.box').removeClass('closed');
        $(toggle).parents('.box').addClass('open');

        //  Set the height (so it animates)
        _height = $(toggle).attr('data-height');

        if (animate) {

            $(toggle).parents('.box').find('.box-container').stop().animate({
                'height': _height
            });

        } else {

            $(toggle).parents('.box').find('.box-container').height(_height);
        }
    };

    // --------------------------------------------------------------------------

    /**
     * Close a nav box
     * @param  {Object}  toggle  The box which was toggled
     * @param  {Boolean} animate Whether to animate the movement
     * @return {Void}
     */
    base.closeBox = function(toggle, animate)
    {
        var _id;

        _id = $(toggle).parents('.box').attr('id');

        // --------------------------------------------------------------------------

        $(toggle).parents('.box').removeClass('open');
        $(toggle).parents('.box').addClass('closed');

        //  Set the height (so it animates)
        if (animate)
        {
            $(toggle).parents('.box').find('.box-container').stop().animate({
                'height': 0
            });
        } else {
            $(toggle).parents('.box').find('.box-container').height(0);
        }
    };

    // --------------------------------------------------------------------------

    /**
     * Initialise the nav searchbox
     * @return {Void}
     */
    base.initNavSearch = function()
    {
        $('.nav-search input').on('keyup', function() {
            var _search = $(this).val();

            if (_search.length)
            {
                $('.box .toggle').hide();

                //  Loop through each menu item and hide items which don't apply to the search term
                $('.box li').each(function() {

                    var regex = new RegExp(_search, 'gi');

                    if (regex.test($(this).text())) {

                        $(this).show();

                    } else {

                        $(this).hide();
                    }

                    //  Resize the item to accomodate the number of viewable options
                    var _height = $(this).parents('.box').find('ul').outerHeight();
                    $(this).parents('.box').find('.box-container').height(_height);

                    //  If there are no items viewable, fade out the box
                    if (!$(this).parents('.box').find('li:visible').length) {
                        $(this).parents('.box').stop().css({
                            'opacity': 0.25
                        });
                    } else {
                        $(this).parents('.box').stop().css({
                            'opacity': 1
                        });
                    }
                });
            }
            else
            {
                //  Reset search
                $('.box').stop().animate({
                    'opacity': 1
                }, 'fast');

                $('.box li').each(function() {

                    $(this).show();

                });

                $('.box .toggle').each(function() {

                    $(this).show();

                    var _open = $(this).closest('.box').hasClass('closed');

                    if (_open)
                    {
                        base.openBox(this, false);
                    }
                    else
                    {
                        base.closeBox(this, false);
                    }

                });
            }
        });
    };

    // --------------------------------------------------------------------------

    /**
     * Reset the nav layout
     * @return {Void}
     */
    base.initNavReset = function()
    {
        $('#admin-nav-reset-buttons a').on('click', function()
        {
            if ($(this).data('action') === 'reset') {

                var _call = {
                    'controller': 'admin/nav',
                    'method': 'reset',
                    'action': 'POST'
                };

                _nails_api.call(_call);

                // --------------------------------------------------------------------------

                $('<div>')
                .html('<p>Your navigation has been reset, changes will take hold on the next page load.</p>')
                .dialog(
                {
                    'title': 'Reset Complete',
                    'resizable': false,
                    'draggable': false,
                    'modal': true,
                    'dialogClass': "no-close",
                    'buttons':
                    {
                        'OK': function()
                        {
                            $(this).dialog('close');
                        },
                        'Reload': function()
                        {
                            window.location.reload();
                        }
                    }
                })
                .show();

            } else if ($(this).data('action') === 'open') {

                $('ul.modules li.module').each(function() {

                    var _toggle = $(this).find('.toggle');
                    base.openBox(_toggle, false);
                });
                base.saveNav();

            } else if ($(this).data('action') === 'close') {

                $('ul.modules li.module').each(function() {

                    var _toggle = $(this).find('.toggle');
                    base.closeBox(_toggle, false);
                });
                base.saveNav();
            }

            return false;
        });
    };

    // --------------------------------------------------------------------------

    /**
     * Initialise the admin search & sort boxes
     * @return {Void}
     */
    base.initSearchBoxes = function()
    {
        //  Bind submit to select changes
        $('div.search select, div.search input[type=checkbox]').on('change', function() {

            $(this).closest('form').submit();
        });

        // --------------------------------------------------------------------------

        //  Show mask when submitting form
        $('div.search form').on('submit', function() {

            $(this).closest('div.search').find('div.mask').show();
        });

        // --------------------------------------------------------------------------

        //  Filter Checkboxes
        $('div.search .filterOption input[type=checkbox]').on('change', function() {

            if ($(this).is(':checked')) {

                $(this).closest('.filterOption').addClass('checked');

            } else {

                $(this).closest('.filterOption').removeClass('checked');
            }
        });

        //  Initial styles
        $('div.search .filterOption input[type=checkbox]').each(function() {

            if ($(this).is(':checked')) {

                $(this).closest('.filterOption').addClass('checked');

            } else {

                $(this).closest('.filterOption').removeClass('checked');
            }
        });
    };

    // --------------------------------------------------------------------------

    /**
     * Initialise the mobile menu
     * @return {Void}
     */
    base.initMobileMenu = function()
    {
        $('#mobileMenuBurger').on('click', function() {

            var maxHeight = $(window).height() - 150;

            $('#mobileMenu').toggleClass('open');

            if ($('#mobileMenu').hasClass('open')) {

                $('#mobileMenu').css('max-height', maxHeight + 'px');

            } else {

                $('#mobileMenu').css('max-height', '0px');
            }

            return false;
        });
    };

    // --------------------------------------------------------------------------

    /**
     * Initialise jQuery toggles
     * @return {Void}
     */
    base.initToggles = function()
    {
        if ($.fn.toggles) {

            $('.field.boolean:not(.toggled)').each(function() {

                var _checkbox = $(this).find('input[type=checkbox]');
                var _readonly = $(this).hasClass('readonly');
                var _on       = $(this).data('text-on') ? $(this).data('text-on') : 'ON';
                var _off      = $(this).data('text-off') ? $(this).data('text-off') : 'OFF';

                $(this).find('.toggle').css({
                    'width': '100px',
                    'height': '30px'
                }).toggles({
                    'checkbox': _checkbox,
                    'click': !_readonly,
                    'drag': !_readonly,
                    'clicker': _checkbox,
                    'on': _checkbox.is(':checked'),
                    'text': {
                        'on': _on,
                        'off': _off
                    }
                });

                $(this).addClass('toggled');

                _checkbox.hide();
            });

        } else {

            base.error('NAILS_ADMIN_JS: jQuery Toggles not available.');
        }
    };

    // --------------------------------------------------------------------------

    /**
     * Instantiates CKEditor instances
     * @return {Void}
     */
    base.initCkeditor = function()
    {
        if ($.fn.ckeditor) {

            /**
             * Should the app want to override the default behaviour of the editors
             * then it must provide complete config files. If these are found they
             * will be loaded *instead* of the default config files.
             */

            //  Nails Config files
            var configBasic   = window.NAILS.URL + 'js/ckeditor.config.basic.min.js';
            var configDefault = window.NAILS.URL + 'js/ckeditor.config.default.min.js';

            //  App Config files
            var appConfigBasic   = window.SITE_URL + 'assets/js/nails.admin.ckeditor.config.basic.min.js';
            var appConfigDefault = window.SITE_URL + 'assets/js/nails.admin.ckeditor.config.default.min.js';

            /**
             * Check for the presence of the app config files, if found use them as
             * the customConfig; if not found fall back to the Nails config files.
             */

            $.ajax({
                'url': appConfigBasic,
                'type':'HEAD',
                'success': function()
                {
                    $('.wysiwyg.wysiwyg-basic').ckeditor(
                    {
                        customConfig: appConfigBasic
                    });
                },
                'error': function()
                {
                    $('.wysiwyg.wysiwyg-basic').ckeditor(
                    {
                        customConfig: configBasic
                    });
                }
            });

            //  Instantiate default editors
            $.ajax({
                'url': appConfigDefault,
                'type':'HEAD',
                'success': function()
                {
                    $('.wysiwyg:not(.wysiwyg-basic)').ckeditor(
                    {
                        customConfig: appConfigDefault
                    });
                },
                'error': function()
                {
                    $('.wysiwyg:not(.wysiwyg-basic)').ckeditor(
                    {
                        customConfig: configDefault
                    });
                }
            });
        }
        else
        {
            base.error('NAILS_ADMIN_JS: CKEditor not available.');
        }
    };

    // --------------------------------------------------------------------------

    /**
     * Initialsie select2 elements
     * @return {Void}
     */
    base.initSelect2 = function()
    {
        if ($.fn.select2) {

            $('select.select2:not(.select2-offscreen)').select2();

        } else {

            this.error('NAILS_JS: Select2 not available.');
        }
    };

    // --------------------------------------------------------------------------

    /**
     * Initialise nicetime elements
     * @return {Void}
     */
    base.initNiceTime = function()
    {
        var _elems = $('.nice-time:not(.nice-timed)'); // Fetch just new objects

        //  Fetch objects which can be nice-timed
        _elems.each(function() {

            //  Setup variables
            var _src = $(this).text();

            //  Check format
            var _regex = /^\d\d\d\d-\d\d?-\d\d?(\d\d?\:\d\d?\:\d\d?)?$/;

            if (_regex.test(_src)) {

                //  Parse into various bits
                var _basic = _src.split(' ');

                if (!_basic[1]) {

                    _basic[1] = '00:00:00';
                }

                if (_basic[0]) {

                    var _date = _basic[0].split('-');
                    var _time = _basic[1].split(':');

                    var _Y = _date[0];
                    var _M = _date[1];
                    var _D = _date[2];
                    var _h = _time[0];
                    var _m = _time[1];
                    var _s = _time[2];

                    //  Attempt to parse the time
                    var _date_obj = new Date(_Y, _M, _D, _h, _m, _s);

                    if (!isNaN(_date_obj.getTime())) {

                        /**
                         * Date was parsed successfully, stick it as the attribute.
                         * Add .nice-timed to it so it's not picked up as a new object
                         */

                        $(this).addClass('nice-timed');
                        $(this).attr('data-time', _src);
                        $(this).attr('data-year', _Y);
                        $(this).attr('data-month', _M);
                        $(this).attr('data-day', _D);
                        $(this).attr('data-hour', _h);
                        $(this).attr('data-minute', _m);
                        $(this).attr('data-second', _s);
                        $(this).attr('title', _src);
                    }
                }
            }
        });

        // --------------------------------------------------------------------------

        //  Nice time-ify everything
        $('.nice-timed').each(function()
        {
            //  Pick up date form object
            var _Y = $(this).attr('data-year');
            var _M = $(this).attr('data-month') - 1; //  Because the date object does months from 0
            var _D = $(this).attr('data-day');
            var _h = $(this).attr('data-hour');
            var _m = $(this).attr('data-minute');
            var _s = $(this).attr('data-second');

            var _date     = new Date(_Y, _M, _D, _h, _m, _s);
            var _now      = new Date();
            var _relative = '';

            // --------------------------------------------------------------------------

            //  Do whatever it is we need to do to get relative time
            var _diff = Math.ceil((_now.getTime() - _date.getTime()) / 1000);

            if (_diff >= 0 && _diff < 10) {

                //  Has just happened so for a few seconds show plain ol' English
                _relative = 'a moment ago';

            } else if (_diff >= 10) {

                //  Target time is in the past
                _relative = base.initNiceTimeCalc(_diff) + ' ago';

            } else if (_diff < 0) {

                //  Target time is in the future
                _relative = base.initNiceTimeCalc(_diff) + ' from now';
            }

            // --------------------------------------------------------------------------

            //  Set the new relative time
            if (_relative === '1 day ago') {

                _relative = 'yesterday';

            } else if (_relative === '1 day from now') {

                _relative = 'tomorrow';
            }

            if ($(this).data('capitalise') === true) {

                _relative = _relative.charAt(0).toUpperCase() + _relative.slice(1);
            }

            $(this).text(_relative);
        });
    };

    // --------------------------------------------------------------------------

    /**
     * Perform the niceTime calculation
     * @param  {Number} diff The difference between then and now
     * @return {String}
     */
    base.initNiceTimeCalc = function(diff)
    {
        var _value = 0;
        var _term  = '';

        //  Constants
        var _second = 1;
        var _minute = _second * 60;
        var _hour   = _minute * 60;
        var _day    = _hour * 24;
        var _week   = _day * 7;
        var _month  = _day * 30;
        var _year   = _day * 365;

        //  Always dealing with positive values
        if (diff < 0) {

            diff = diff * -1;
        }

        //  Seconds
        if (diff < _minute) {

            //  Seconds
            _value = diff;
            _term  = 'second';

        } else if (diff < _hour) {

            //  Minutes
            _value = Math.floor(diff / 60);
            _term  = 'minute';

        } else if (diff < _day) {

            //  Hours
            _value = Math.floor(diff / 60 / 60);
            _term  = 'hour';

        } else if (diff < _week) {

            //  Days
            _value = Math.floor(diff / 60 / 60 / 24);
            _term  = 'day';

        } else if (diff < _month) {

            //  Weeks
            _value = Math.floor(diff / 60 / 60 / 24 / 7);
            _term  = 'week';

        } else if (diff < _year) {

            //  Months
            _value = Math.floor(diff / 60 / 60 / 24 / 30);
            _term  = 'month';

        } else {

            //  Years
            _value = Math.floor(diff / 60 / 60 / 24 / 365);
            _term  = 'year';
        }

        // --------------------------------------------------------------------------

        var _suffix = _value === 1 ? '' : 's';

        return _value + ' ' + _term + _suffix;
    };

    // --------------------------------------------------------------------------

    /**
     * Initialise system-alerts
     * @return {Void}
     */
    base.initSystemAlerts = function()
    {

    };

    // --------------------------------------------------------------------------

    /**
     * Write an error to the console
     * @param  {string} output The error to write
     * @return {Void}
     */
    base.error = function(output)
    {
        if (window.console && window.ENVIRONMENT !== 'PRODUCTION') {

            console.error(output);
        }
    };

    // --------------------------------------------------------------------------

    return base.__construct();
};