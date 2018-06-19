/* globals console  */
// --------------------------------------------------------------------------
//  NAILS_JS: A ton of helpful stuff
// --------------------------------------------------------------------------

//  Catch undefined console
/* jshint ignore:start */
if (typeof(console) === 'undefined') {
    var console;
    console = {
        log: function() {
        },
        debug: function() {
        },
        info: function() {
        },
        warn: function() {
        },
        error: function() {
        }
    };
}
/* jshint ignore:end */

// --------------------------------------------------------------------------

var NAILS_JS;
NAILS_JS = function() {

    /**
     * Avoid scope issues in callbacks and anonymous functions by referring to `this` as `base`
     * @type {Object}
     */
    var base = this;

    // --------------------------------------------------------------------------

    /**
     * Construct the class
     */
    base.__construct = function() {

        base.initSystemAlerts();
        base.initTipsy();
        base.initFancybox();
        base.initConfirm();
        base.initTabs();
        base.initForms();
        base.initDatePickers();
    };

    // --------------------------------------------------------------------------

    /**
     * Add a close button to any system-alerts which are on the page
     * @return {Void}
     */
    base.initSystemAlerts = function() {

        //  Scroll to first error, if scrollTo is available
        if ($.fn.scrollTo) {

            var inline, scroll, system;

            inline = $('div.field.error:visible');

            if (inline.length) {

                //  Scroll to this item
                scroll = $(inline.get(0));

            } else {

                system = $('div.system-alert.error:visible');
                scroll = $(system.get(0));
            }

            if (scroll.length) {

                //  Giving the browser a slight chance to work out sizes etc
                setTimeout(function() {
                    $.scrollTo(scroll, 'fast', {axis: 'y', offset: {top: -60}});
                }, 750);
            }

        } else {

            base.log('NAILS_JS: scrollTo not available.');
        }
    };

    // --------------------------------------------------------------------------

    /**
     * Initialise any tipsy elements on the page
     * @return {Void}
     */
    base.initTipsy = function() {

        if ($.fn.tipsy) {

            /**
             * Once tipsy'd, add drunk class - so it's not called twice should this
             * method be called again. Tipsy... drunk... geddit?
             */

            $('*[rel=tipsy]:not(.drunk)').tipsy({opacity: 0.85}).addClass('drunk');
            $('*[rel=tipsy-html]:not(.drunk)').tipsy({opacity: 0.85, html: true}).addClass('drunk');
            $('*[rel=tipsy-right]:not(.drunk)').tipsy({opacity: 0.85, gravity: 'w'}).addClass('drunk');
            $('*[rel=tipsy-left]:not(.drunk)').tipsy({opacity: 0.85, gravity: 'e'}).addClass('drunk');
            $('*[rel=tipsy-top]:not(.drunk)').tipsy({opacity: 0.85, gravity: 's'}).addClass('drunk');
            $('*[rel=tipsy-bottom]:not(.drunk)').tipsy({opacity: 0.85, gravity: 'n'}).addClass('drunk');

        } else {

            base.log('NAILS_JS: Tipsy not available.');
        }
    };

    // --------------------------------------------------------------------------

    /**
     * Initialise any fancybox elements on the page
     * @return {Void}
     */
    base.initFancybox = function() {

        if ($.fn.fancybox) {

            $(document).on('click', '.fancybox', function(e) {

                e.preventDefault();
                e.stopPropagation();

                //  Prep the URL
                var href = $(this).attr('href');
                var type = 'iframe';

                if (href.substr(0, 1) !== '#') {

                    /**
                     * Ok, so fancybox has a hard time auto detecting things when it's done like this;
                     * this results in it silently failing when trying to open something which should
                     * be opened in an iframe.
                     *
                     * To solve this we're going to explicitly look for certain file extensions and set
                     * the `type` accordingly.
                     */

                    var regex;
                    /*jshint ignore: start */
                    regex = new RegExp('^.+\.(jpg|png|gif)(\\?.*)?$');
                    /*jshint ignore: end */

                    if (regex.test(href)) {

                        type = null;
                    }

                    //  Parse the URL for a query string
                    regex = /\?/g;

                    if (!regex.test(href)) {

                        //  Append '?'
                        href += '?';

                    } else {

                        //  Append '&'
                        href += '&';
                    }

                    href += 'isModal=true';

                } else {

                    //  It's an inline fancybox
                    type = null;
                }

                //  Interpret width and height
                var height = $(this).data('height');
                var width = $(this).data('width');

                //  Open a new fancybox instance
                $.fancybox.open({
                    'href': href,
                    'height': height,
                    'width': width,
                    'type': type,
                    'helpers': {
                        'overlay': {
                            'locked': false
                        }
                    },
                    'beforeLoad': function() {

                        $('body').addClass('noScroll modal-open');
                    },
                    'afterClose': function() {

                        $('body').removeClass('noScroll modal-open');
                    }
                });

                return false;
            });

        } else {

            base.log('NAILS_JS: Fancybox not available.');
        }
    };

    // --------------------------------------------------------------------------

    /**
     * Initialise any confirm links or buttons on the page
     * @return {Void}
     */
    base.initConfirm = function() {

        var link, body, title;

        $(document).on('click', 'a.confirm', function() {

            link = $(this);
            body = link.data('body') || 'Please confirm you\'d like to continue with this action.';
            body.replace(/\\n/g, '\n');
            title = link.data('title') || 'Are you sure?';

            if (body.length) {

                $('<div>').html(body).dialog({
                    'title': title,
                    'resizable': false,
                    'draggable': false,
                    'modal': true,
                    'dialogClass': 'no-close',
                    'buttons': {
                        'OK': function() {
                            window.location.href = link.attr('href');
                        },
                        'Cancel': function() {
                            $(this).dialog('close');
                        }
                    }
                });

                return false;

            } else {

                //  No message, just let the event bubble as normal.
                return true;
            }
        });
    };

    // --------------------------------------------------------------------------

    /**
     * Initialise any tabs on the page
     * @return {Void}
     */
    base.initTabs = function() {

        $(document).on('click', 'ul.tabs:not(.disabled) li.tab a', function() {
            if (!$(this).hasClass('disabled')) {
                base.switchToTab($(this));
            }
            return false;
        });

        // --------------------------------------------------------------------------

        //  Look for tabs which contain error'd fields
        $('li.tab a').each(function() {

            if ($('.tab-page.' + $(this).data('tab') + ' div.field.error').length) {
                $(this).addClass('error');
            }

            if ($('.tab-page.' + $(this).data('tab') + ' .system-alert.error').length) {
                $(this).addClass('error');
            }

            if ($('.tab-page.' + $(this).data('tab') + ' .alert.alert-danger').length) {
                $(this).addClass('error');
            }

            if ($('.tab-page.' + $(this).data('tab') + ' .error.show-in-tabs').length) {
                $(this).addClass('error');
            }
        });

        // --------------------------------------------------------------------------

        //  For tabs which are attached to an "active tab input", automatically go to said tab if it's defined
        $('ul.tabs').filter('[data-active-tab-input][data-active-tab-input!=""]').each(function() {
            var activeTabInput = $($(this).data('active-tab-input'));
            if (activeTabInput.length && activeTabInput.val()) {
                $(this).find('.tab a[data-tab="' + activeTabInput.val() + '"]').click();
            }
        });
    };

    // --------------------------------------------------------------------------

    /**
     * Switch to a specific tab
     * @param  {Object} tab The tab which was clicked
     * @return {Void}
     */
    base.switchToTab = function(tab) {
        //  Tab group
        var selectedTab = tab.data('tab');
        var tabGroup = tab.parents('ul.tabs').data('tabgroup');
        var activeTab = tab.parents('ul.tabs').data('active-tab-input');

        //  Switch tab
        if (tabGroup) {

            //  Find all tab groups and set the appropriate tab as the active one

            //  Mark the appropriate tab as active
            $('ul.tabs[data-tabgroup="' + tabGroup + '"] > li.tab')
                .removeClass('active');

            $('ul.tabs[data-tabgroup="' + tabGroup + '"] > li.tab > a[data-tab="' + selectedTab + '"]')
                .parent()
                .addClass('active');

            //  Show the appropriate panel
            $('section.tabs[data-tabgroup="' + tabGroup + '"] > div.tab-page')
                .removeClass('active');

            $('section.tabs[data-tabgroup="' + tabGroup + '"] > div.tab-page.' + selectedTab)
                .addClass('active');

        } else {

            //  No tab group, keep it global

            //  Mark the selected tab as active
            $('li.tab').removeClass('active');
            tab.parent().addClass('active');

            //  Show the appropriate panel
            $('section.tabs > div.tab-page').removeClass('active');
            var newTab = tab.attr('data-tab');
            $('section.tabs > div.tab-page.' + newTab).addClass('active');
        }

        // --------------------------------------------------------------------------

        if (activeTab) {
            $(activeTab).val(selectedTab);
        }

        // --------------------------------------------------------------------------

        //  Add stripes to any visible form elements
        base.addStripes();
    };

    // --------------------------------------------------------------------------

    /**
     * Initialise any forms on the page
     * @return {Void}
     */
    base.initForms = function() {

        base.addStripes();
        base.processPrefixedInputs();
    };

    // --------------------------------------------------------------------------

    base.initDatePickers = function() {

        //  Init any datetime pickers
        if ($.fn.datepicker) {

            //  Date pickers
            $('input.date').each(function() {

                //  Fetch some info which may be available in the data attributes
                var dateFormat = $(this).data('datepicker-dateformat') || 'yy-mm-dd';
                var yearRange = $(this).data('datepicker-yearrange') || 'c-100:c+10';

                //  Instanciate datepicker
                $(this).datepicker({
                    'dateFormat': dateFormat,
                    'changeMonth': true,
                    'changeYear': true,
                    'yearRange': yearRange
                });
            });

        } else {
            base.error('NAILS_JS: datepicker not available.');
        }

        if ($.fn.datetimepicker) {

            //  Datetime pickers
            $('input.datetime').each(function() {

                //  Fetch some info which may be available in the data attributes
                var dateFormat = $(this).data('datepicker-dateformat') || 'yy-mm-dd';
                var timeFormat = $(this).data('datepicker-timeformat') || 'HH:mm:ss';
                var yearRange = $(this).data('datepicker-yearrange') || 'c-100:c+10';

                $(this).datetimepicker({
                    'dateFormat': dateFormat,
                    'timeFormat': timeFormat,
                    'changeMonth': true,
                    'changeYear': true,
                    'yearRange': yearRange
                });
            });

            //  Time pickers
            $('input.time').each(function() {

                //  Fetch some info which may be available in the data attributes
                var timeFormat = $(this).data('datepicker-timeformat') || 'HH:mm';

                $(this).datetimepicker({
                    'timeOnly': true,
                    'timeFormat': timeFormat
                });
            });

        } else {
            base.log('NAILS_JS: datetimepicker not available.');
        }
    };

    // --------------------------------------------------------------------------

    /**
     * Add odd/even stripes to forms on the page
     * @return {Void}
     */
    base.addStripes = function() {

        $('fieldset,.fieldset').each(function() {

            $('div.field', this).removeClass('odd even');
            $('div.field:visible:odd', this).addClass('odd');
            $('div.field:visible:even', this).addClass('even');

        });
    };

    // --------------------------------------------------------------------------

    /**
     * Process any prefixed inputs on the page
     * @return {Void}
     */
    base.processPrefixedInputs = function() {

        $('input[data-prefix]:not(.nails-prefixed)').each(function() {

            var container = $('<div>').addClass('nails-prefixed').css('width', $(this).css('width'));
            var prefix = $('<div>').addClass('nails-prefix').html($(this).data('prefix'));

            container.append(prefix);
            $(this).clone(true).addClass('nails-prefixed').appendTo(container);

            $(this).replaceWith(container);
        });
    };

    // --------------------------------------------------------------------------

    /**
     * Write to console.log
     * @param  {String} output The message to write
     * @return {Void}
     */
    base.log = function(output) {

        if (window.console && window.ENVIRONMENT !== 'PRODUCTION') {
            console.log(output);
        }
    };

    // --------------------------------------------------------------------------

    /**
     * Write to console.error
     * @param  {String} output The message to write
     * @return {Void}
     */
    base.error = function(output) {

        if (window.console && window.ENVIRONMENT !== 'PRODUCTION') {
            console.error(output);
        }
    };

    // --------------------------------------------------------------------------

    /**
     * Write to console.warn
     * @param  {String} output The message to write
     * @return {Void}
     */
    base.warn = function(output) {

        if (window.console && window.ENVIRONMENT !== 'PRODUCTION') {
            console.warn(output);
        }
    };

    // --------------------------------------------------------------------------

    return base.__construct();
};
