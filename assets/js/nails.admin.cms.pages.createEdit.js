/* globals Mustache, console */
var NAILS_Admin_CMS_pages_Create_Edit;
NAILS_Admin_CMS_pages_Create_Edit = function(templates, widgets, page_id, page_data)
{
    this._api               = null;
    this.editor_id          = Math.floor(Math.random() * 10000000000000001);
    this._editor            = {};
    this.search_placeholder = 'Search widget library';
    this.templates          = templates;
    this.mustache_tpl       = {};
    this.widgets            = widgets;
    this.page_data          = {};
    this._dragging_widget   = false;
    this._editor_open       = false;
    this._preview_open      = false;
    this._dialog_open       = false;
    this._saving            = false;
    this._refreshing        = false;
    this._async_save        = true;

    // --------------------------------------------------------------------------

    this.__construct = function(page_id, page_data)
    {
        //  Set up the API interface
        this._api = new window.NAILS_API();

        // --------------------------------------------------------------------------

        var _key, _key2;

        //  Prepare page_data, if empty create a new object
        if (typeof(page_data) === 'undefined' || page_data === null)
        {
            this.page_data =
            {
                hash : null,
                id : typeof(page_id) !== 'undefined' ? page_id : null,
                data : {},
                widget_areas : {}
            };

            //  Create new page_data object
            for (var i = 0; i < this.templates.length; i++) {

                this.page_data.widget_areas[this.templates[i].slug] = {};

                for (var x = 0; x < this.templates[i].widget_areas.length; i++) {

                    this.page_data.widget_areas[this.templates[i].slug][this.templates[i].widget_areas[x].slug] = [];
                }
            }

            this._refresh_page_data();
        }
        else
        {
            this.page_data      = page_data;
            this.page_data.id   = page_id;

            for(_key in this.templates)
            {
                if (this.templates.hasOwnProperty(_key)) {
                    if (typeof(this.page_data.widget_areas) === 'undefined') {
                        this.page_data.widget_areas = {};
                    }

                    if (typeof(this.page_data.widget_areas[_key]) === 'undefined') {
                        this.page_data.widget_areas[_key] = {};
                    }

                    for (_key2 in this.templates[_key].widget_areas) {
                        if (typeof(this.page_data.widget_areas[_key][_key2]) === 'undefined') {
                            this.page_data.widget_areas[_key][_key2] = [];
                        }
                    }
                }
            }
        }

        //  Set the data hash
        this.page_data.hash = this._generate_data_hash();

        if (typeof(console.log) === 'function')
        {
            console.log('CMS PAGES: Initial page_data:', this.page_data);
        }

        // --------------------------------------------------------------------------

        this._template_chooser_init();
        this._editor_init();

        // --------------------------------------------------------------------------

        //  bind onto the unload event
        var _this = this;
        window.onbeforeunload = function()
        {
            if (_this._needs_saved() !== false)
            {
                return 'You have unsaved changes. Are you sure you want to leave?';
            }
        };

        // --------------------------------------------------------------------------

        //  Bind to main-action buttons
        $(document).on('click', 'a.main-action', function(e)
        {
            //  Ignore duplicate requests
            if ($(this).hasClass('disabled'))
            {
                return false;
            }

            // --------------------------------------------------------------------------

            //  Action to perform
            var _action = $(this).data('action');

            //  Disable the buttons while we process the request
            _this._disable_main_actions();

            switch(_action)
            {
                case 'save' :       _this._main_action_save();              break;
                case 'publish' :    _this._main_action_publish();           break;
                case 'preview':     _this._main_action_launch_preview();    break;
                default :

                    if (typeof(console.warn) === 'function')
                    {
                        console.warn('CMS PAGES: Uncaught main-action.');
                    }
                    _this._enable_main_actions();

                break;
            }

            e.stopPropagation();
            return false;
        });
    };

    // --------------------------------------------------------------------------

    this._enable_main_actions = function()
    {
        //  Disable buttons
        $('a.main-action').removeClass('disabled');

        //  Hide animated stripes
        $('p.actions').removeClass('loading');
    };

    // --------------------------------------------------------------------------

    this._disable_main_actions = function()
    {
        //  Disable buttons
        $('a.main-action').addClass('disabled');

        //  Start animated stripes
        $('p.actions').addClass('loading');
    };

    // --------------------------------------------------------------------------

    this._main_action_save = function()
    {
        var _this = this;

        var _success = function(data)
        {
            _this._redirect(window.SITE_URL + 'admin/cms/pages/edit/' + data.id + '?message=saved');
        };

        var _error = function(data)
        {
            _this._enable_main_actions();

            // --------------------------------------------------------------------------

            $('<div>').text(data.error).dialog({
                title: 'Something went wrong.',
                resizable: false,
                draggable: false,
                modal: true,
                buttons:
                {
                    OK: function()
                    {
                        $(this).dialog('close');
                    }
                },
                open : function() { _this._dialog_open = true; },
                close : function() { setTimeout(function() { _this._dialog_open = false; }, 500); }
            });
        };

        _this._save(_success, _error, true);
    };

    // --------------------------------------------------------------------------

    this._main_action_publish = function()
    {
        var _this = this;

        var _success = function(data)
        {
            _this._redirect(window.SITE_URL + 'admin/cms/pages/edit/' + data.id + '?message=published');
        };

        var _error = function(data)
        {
            _this._enable_main_actions();

            // --------------------------------------------------------------------------

            $('<div>').text(data.error).dialog({
                title: 'Something went wrong.',
                resizable: false,
                draggable: false,
                modal: true,
                buttons:
                {
                    OK: function()
                    {
                        $(this).dialog('close');
                    }
                },
                open : function() { _this._dialog_open = true; },
                close : function() { setTimeout(function() { _this._dialog_open = false; }, 500); }
            });
        };

        _this._save(_success, _error, true, true);
    };

    // --------------------------------------------------------------------------

    this._main_action_launch_preview = function()
    {
        this._editor.container.addClass('loading');
        this._preview_open = true;

        // --------------------------------------------------------------------------

        var _this = this;
        var _success = function(data)
        {
            _this._editor.container.removeClass('loading');

            $.fancybox({
                type:'iframe',
                href: window.SITE_URL + 'cms/render/preview/' + data.id,
                width:'90%',
                height:'90%',
                iframe : {preload: false},
                afterClose: function()
                {
                    _this._preview_open = false;
                    _this._enable_main_actions();
                }
            });
        };

        var _error = function(data)
        {
            _this._editor.container.removeClass('loading');
            _this._dialog_open = true;

            $('<div>').text(data.error).dialog({
                title: 'Something went wrong.',
                resizable: false,
                draggable: false,
                modal: true,
                buttons:
                {
                    OK: function()
                    {
                        $(this).dialog('close');
                    }
                },
                open : function() { _this._dialog_open = true; },
                close : function() { setTimeout(function() { _this._dialog_open = false; }, 500); }
            });

            _this._preview_open = false;
            _this._enable_main_actions();
        };

        this._save_preview(_success, _error, true);
    };

    // --------------------------------------------------------------------------

    this._save = function(success_callback, error_callback, force_save, is_published)
    {
        //  If we're already saving ignore any more calls
        if (this._saving)
        {
            if (typeof(console.log) === 'function')
            {
                console.log('CMS PAGES: Save in progress, ignoring repeated call.');
            }
            return false;
        }

        //  If we're refreshing, then ignore those calls too
        if (this._refreshing)
        {
            if (typeof(console.log) === 'function')
            {
                console.log('CMS PAGES: Refresh in progress, ignoring repeated call.');
            }
            return false;
        }

        // --------------------------------------------------------------------------

        //  Generate the hash of the data
        var _hash = this._needs_saved();

        if (_hash !== false || force_save)
        {
            if (force_save !== true)
            {
                if (typeof(console.log) === 'function')
                {
                    console.log('CMS PAGES: Data has changed, old hash: ' + this.page_data.hash + ', new hash: ' + _hash + ' - Saving...');
                }
            }
            else
            {
                if (typeof(console.log) === 'function')
                {
                    console.log('CMS PAGES: Forced save requested. Saving... old hash: ' + this.page_data.hash + ', new hash: ' + _hash + ' - Saving...');
                }
            }

            if (_hash !== false)
            {
                this.page_data.hash = _hash;
            }

            this._saving = true;

            $('#save-status').removeClass('message').addClass('saving notice').show();
            $('#save-status .last-saved').text('Saving...');

            /**
             * Send the data to the server and wait for the response. If all OK, the
             * server will respond with the page's ID, make sure this is set in the
             * page_data object
             */

            var _publish_action;

            if (is_published === true)
            {
                _publish_action = 'PUBLISH';
            }
            else
            {
                _publish_action = 'NONE';
            }

            var _call =
            {
                'controller'    : 'cms/pages',
                'method'        : 'save',
                'action'        : 'POST',
                'async'         : this._async_save,
                'data'          :
                {
                    'page_data'         : JSON.stringify(this.page_data),
                    'publish_action'    : _publish_action
                },
                'success'       : $.proxy(function(data) { this._save_ok(success_callback, data); }, this),
                'error'         : $.proxy(function(data) { this._save_fail(error_callback, data); }, this),
            };

            this._api.call(_call);

            return true;
        }
        else
        {
            if (typeof(console.log) === 'function')
            {
                console.log('CMS PAGES: Page data hasn\'t changed, ignoring call');
            }
            return false;
        }
    };

    // --------------------------------------------------------------------------

    this._save_ok = function(success_callback, data)
    {
        /**
         * Use data, if we get 200 OK then save was a success and payload will be
         * the page's ID as the server thinks it is.
         */

        if (data.status === 200)
        {
            //  Set the page ID
            this.page_data.id = data.id;

            //  Reset the hash
            this.page_data.hash = this._generate_data_hash();

            //  Feedback to the user
            $('#save-status').removeClass('saving');

            var _date   = new Date();
            var _hours  = _date.getHours() < 10 ? '0' + _date.getHours() : _date.getHours();
            var _mins   = _date.getMinutes() < 10 ? '0' + _date.getMinutes() : _date.getMinutes();
            var _str    = _hours + ':' + _mins;


            $('#save-status .last-saved').text(_str);

            if (typeof(console.log) === 'function')
            {
                console.log('CMS PAGES: Save completed successfully');
            }
        }
        else
        {
            $('#save-status').removeClass('saving notice').addClass('message');
            $('#save-status .last-saved').text('ERROR: ' + data.error);

            if (typeof(console.log) === 'function')
            {
                console.log('CMS PAGES: Save failed: ' + data.error);
            }
        }

        this._saving = false;

        // --------------------------------------------------------------------------

        //  Execute any custom callback
        if (typeof(success_callback) === 'function')
        {
            success_callback.call(undefined, data);
        }
    };

    // --------------------------------------------------------------------------

    this._save_fail = function(error_callback, data)
    {
        var _data;

        try
        {
            _data = JSON.parse(data.responseText);
        }
        catch(err)
        {
            _data = {};
        }

        $('#save-status').removeClass('saving notice').addClass('message');
        $('#save-status .last-saved').text('ERROR: ' + _data.error);

        if (typeof(console.log) === 'function')
        {
            console.log('CMS PAGES: Save failed: ' + _data.error);
        }

        this._saving = false;

        // --------------------------------------------------------------------------

        //  Execute any custom callback
        if (typeof(error_callback) === 'function')
        {
            error_callback.call(undefined, _data);
        }
    };

    // --------------------------------------------------------------------------

    this._save_preview = function(success_callback, error_callback)
    {
        //  If we're already saving ignore any more calls
        if (this._saving_preview)
        {
            if (typeof(console.log) === 'function')
            {
                console.log('CMS PAGES: Save (Preview) in progress, ignoring repeated call.');
            }
            return false;
        }

        this._saving_preview = true;
        this._refresh_page_data();
        this.page_data.hash = this._generate_data_hash();

        // --------------------------------------------------------------------------

        var _call =
        {
            'controller'    : 'cms/pages',
            'method'        : 'save',
            'action'        : 'POST',
            'async'         : this._async_save,
            'data'          :
            {
                'page_data'         : JSON.stringify(this.page_data),
                'generate_preview'  : true
            },
            'success'       : $.proxy(function(data) { this._save_preview_ok(success_callback, data); }, this),
            'error'         : $.proxy(function(data) { this._save_preview_fail(error_callback, data); }, this),
        };

        this._api.call(_call);
    };

    // --------------------------------------------------------------------------

    this._save_preview_ok = function(success_callback, data)
    {
        this._saving_preview = false;

        // --------------------------------------------------------------------------

        //  Execute any custom callback
        if (typeof(success_callback) === 'function')
        {
            success_callback.call(undefined, data);
        }
    };

    // --------------------------------------------------------------------------

    this._save_preview_fail = function(error_callback, data)
    {
        var _data;

        try
        {
            _data = JSON.parse(data.responseText);
        }
        catch(err)
        {
            _data = {};
        }

        // --------------------------------------------------------------------------

        this._saving_preview = false;

        // --------------------------------------------------------------------------

        //  Execute any custom callback
        if (typeof(error_callback) === 'function')
        {
            error_callback.call(undefined, _data);
        }
    };

    // --------------------------------------------------------------------------

    this._needs_saved = function()
    {
        //  Generate the hash of the data
        var _hash = this._generate_data_hash();

        if (this.page_data.hash !== _hash)
        {
            return _hash;
        }
        else
        {
            return false;
        }
    };

    // --------------------------------------------------------------------------

    this._refresh_page_data = function()
    {
        /**
         * Set refreshing, so any save calls which come in while we're doing this
         * get ignored
         */

        this._refreshing = true;

        //  Main data object
        this.page_data.data.title           = $('<div />').text($('input[name=title]').val()).html();
        this.page_data.data.is_published    = $('input[name=is_published]').val();

        var _parent_id = $('select[name=parent_id]');

        if (_parent_id.length === 1)
        {
            this.page_data.data.parent_id       = _parent_id.val();
        }
        else
        {
            this.page_data.data.parent_id       = $('input[name=parent_id]').val();
        }

        this.page_data.data.seo_title           = $('input[name=seo_title]').val();
        this.page_data.data.seo_description     = $('input[name=seo_description]').val();
        this.page_data.data.seo_keywords        = $('input[name=seo_keywords]').val();
        this.page_data.data.template            = $('input[name=template]:checked').val();
        this.page_data.data.additional_fields   = $(':input[name^=additional_field]').serialize();

        // --------------------------------------------------------------------------

        //  If the editor is open, save the state of the visible widgets
        if (this._editor_open)
        {
            var _this       = this;
            var _template   = this._editor.dropzone.data('template');
            var _area       = this._editor.dropzone.data('area');

            if (typeof(this.page_data.widget_areas[_template]) === 'undefined')
            {
                this.page_data.widget_areas[_template] = {};
            }

            //  Clear out the data, we're resetting it, not appending to it.
            this.page_data.widget_areas[_template][_area] = [];

            //  Find all the widgets
            this._editor.dropzone.find('li.processed.dropzone-widget').each(function()
            {
                var _data =
                {
                    widget: $(this).data('slug'),
                    data : $(this).find('form.editor').serialize()
                };
                _this.page_data.widget_areas[_template][_area].push(_data);
            });
        }

        //  Unset refreshing
        this._refreshing = false;
    };

    // --------------------------------------------------------------------------

    this._generate_data_hash = function()
    {
        this._refresh_page_data();

        // --------------------------------------------------------------------------

        //  Convert to a string then pass through MD5
        var _carrots = { data:{}, widget_areas:{} };

        $.extend(_carrots.data,         this.page_data.data);
        $.extend(_carrots.widget_areas, this.page_data.widget_areas);

        return this.md5(JSON.stringify(_carrots));
    };

    // --------------------------------------------------------------------------

    this._template_chooser_init = function()
    {
        $('label.template').on('click', function()
        {
            //  Set the correct label
            $('label.template').removeClass('selected');
            $(this).addClass('selected');

            //  Show the correct buttons
            var _template = $(this).data('template-slug');
            $('a.launch-editor').hide();
            $('a.launch-editor.template-' + _template).show();

            //  Show the correct additional data fields
            $('.additional-fields').hide();
            $('#additional-fields-' + _template).show();
        });
    };

    // --------------------------------------------------------------------------

    this._editor_init = function()
    {
        var _this = this;

        //  Get Mustache templates
        this.mustache_tpl.loader            = $('#template-loader').html();
        this.mustache_tpl.widget_search     = $('#template-widget-search').html();
        this.mustache_tpl.dropzone_empty    = $('#template-dropzone-empty').html();
        this.mustache_tpl.widget_grouping   = $('#template-widget-grouping').html();
        this.mustache_tpl.widget            = $('#template-widget').html();
        this.mustache_tpl.header            = $('#template-header').html();
        this.mustache_tpl.dropzone_empty    = $('#template-dropzone-empty').html();
        this.mustache_tpl.dropzone_widget   = $('#template-dropzone-widget').html();

        // --------------------------------------------------------------------------

        //  Generate the editor HTML and inject into DOM
        this._editor.container      = $('<div>').attr('id', this.editor_id).addClass('group-cms pages widgeteditor ready');
        this._editor.loader         = $('<div>').attr('id', this.editor_id + '-loader').addClass('loader').html(this.mustache_tpl.loader);
        this._editor.header         = $('<ul>').attr('id', this.editor_id + '-header').addClass('header');
        this._editor.widgets        = $('<ul>').attr('id', this.editor_id + '-widgets').addClass('widgets').disableSelection();
        this._editor.widgets_search = $('<li>').attr('id', this.editor_id + '-search').addClass('search').html(this.mustache_tpl.widget_search);
        this._editor.dropzone       = $('<ul>').attr('id',  this.editor_id + '-dropzone').addClass('dropzone empty').html(this.mustache_tpl.dropzone_empty);

        // --------------------------------------------------------------------------

        //  Get the pritt-stick out
        this._editor.widgets.append(this._editor.widgets_search);

        //  Build the widgets HTML
        var _group_counter,_tpl_group,_tpl_widget,_data,_html,_script,_callbacks;

        _group_counter  = 0;
        _tpl_group      =  this.mustache_tpl.widget_grouping;
        _tpl_widget     =  this.mustache_tpl.widget;

        for (var i = 0; i < this.widgets.length; i++) {

            //  Build the grouping HTML
            _data   = {
                name: this.widgets[i].label,
                group : 'group-' + _group_counter
            };

            _html = Mustache.render(_tpl_group, _data);

            this._editor.widgets.append(_html);

            //  Build this grouping's widgets
            for (var x = 0; x < this.widgets[i].widgets.length; x++) {

                _data = {
                    group: 'group-' + _group_counter,
                    name: this.widgets[i].widgets[x].label,
                    description: this.widgets[i].widgets[x].description,
                    keywords: this.widgets[i].widgets[x].keywords,
                    slug:  this.widgets[i].widgets[x].slug
                };

                _html = Mustache.render(_tpl_widget, _data);

                this._editor.widgets.append(_html);

                // --------------------------------------------------------------------------

                //  Build the callback functions for this widget
                _script = 'var _WIDGET_CALLBACKS_' + this.widgets[i].widgets[x].slug + ' = function(){';

                // --------------------------------------------------------------------------

                    //  Init CKEditors
                    _script += "this.findCkeditor = function(ui)";
                    _script += "{";

                        /**
                         * Should the app want to override the default behaviour of the editors
                         * then it must provide complete config files. If these are found they
                         * will be loaded *instead* of the default config files.
                         */

                        //  Scoping
                        _script += "var _this = this;";

                        //  Nails Config files
                        _script += "var configBasic   = window.NAILS.URL + 'js/ckeditor.config.basic.min.js';";
                        _script += "var configDefault = window.NAILS.URL + 'js/ckeditor.config.default.min.js';";

                        //  App Config files
                        _script += "var appConfigBasic   = window.SITE_URL + 'assets/js/nails.admin.ckeditor.config.basic.min.js';";
                        _script += "var appConfigDefault = window.SITE_URL + 'assets/js/nails.admin.ckeditor.config.default.min.js';";

                        /**
                         * Check for the presence of the app config files, if found use them as
                         * the customConfig; if not found fall back to the Nails config files.
                         */

                        _script += "$.ajax({";
                        _script += "    url: appConfigBasic,";
                        _script += "    type:'HEAD',";
                        _script += "    success: function()";
                        _script += "    {";
                        _script += "        ui.find('textarea.wysiwyg-basic').each(function(index) {";
                        _script += "            _this.initWysiwyg(ui, $(this), appConfigBasic, index);";
                        _script += "        });";
                        _script += "    },";
                        _script += "    error: function()";
                        _script += "    {";
                        _script += "        ui.find('textarea.wysiwyg-basic').each(function(index) {";
                        _script += "            _this.initWysiwyg(ui, $(this), configBasic, index);";
                        _script += "        });";
                        _script += "    }";
                        _script += "});";

                        //  Instantiate default editors
                        _script += "$.ajax({";
                        _script += "    url: appConfigDefault,";
                        _script += "    type:'HEAD',";
                        _script += "    success: function()";
                        _script += "    {";
                        _script += "        ui.find('textarea.wysiwyg').each(function(index) {";
                        _script += "            _this.initWysiwyg(ui, $(this), appConfigDefault, index);";
                        _script += "        });";
                        _script += "    },";
                        _script += "    error: function()";
                        _script += "    {";
                        _script += "        ui.find('textarea.wysiwyg').each(function(index) {";
                        _script += "            _this.initWysiwyg(ui, $(this), configDefault, index);";
                        _script += "        });";
                        _script += "    }";
                        _script += "});";
                    _script += "};";

                    _script += "this.initWysiwyg = function(ui, el, config, index)";
                    _script += "{";
                        _script += "var id = ui.attr('id') + '-wysiwyg-' + index;";
                        _script += "el.attr('id', id);";

                        //  Instantiate the editor
                        _script += "el.ckeditor(";
                        _script += "{";
                        _script += "    customConfig: config";

                        _script += "}, function() {";

                            // Increase the height of the container
                        _script += "    var headerHeight = ui.find('.header-bar').outerHeight();";
                        _script += "    var editorHeight = ui.find('.editor').outerHeight();";
                        _script += "    var height       = headerHeight + editorHeight;";

                            //  Take into account the border if there is one
                        _script += "    if (ui.css('box-sizing') === 'border-box') {";

                        _script += "        height = height + (2 * parseInt(ui.css('border-width'), 10));";
                        _script += "    }";

                        _script += "    ui.stop().animate({height: height}, 250);";
                        _script += "});";

                        //  Bind to autogrow so heights are calculated correctly
                        _script += "CKEDITOR.instances[id].on('autoGrow', function(e) {";

                        _script += "    var difference   = e.data.newHeight - e.data.currentHeight;";
                        _script += "    var headerHeight = ui.find('.header-bar').outerHeight();";
                        _script += "    var editorHeight = ui.find('.editor').outerHeight();";
                        _script += "    var height       = headerHeight + editorHeight + difference;";
                        _script += "    ui.css({height:height});";
                        _script += "});";
                    _script += "};";

                    //  Dropped
                    _script += 'this.dropped = function(ui) {';

                        if (this.widgets[i].widgets[x].callbacks.dropped.length > 0)
                        {
                            _script += this.widgets[i].widgets[x].callbacks.dropped;
                        }

                        //  Automatically interpret any textareas with the class `wysiwyg` as CKEditors
                        _script += ' this.findCkeditor(ui);';

                        // --------------------------------------------------------------------------

                        //  Automatically interpret any selects with the class `select2` as select2's
                        _script += 'ui.find(\'select.select2\').select2();';

                    _script += '};';

                    // --------------------------------------------------------------------------

                    //  Removed
                    _script += 'this.removed = function(ui){';

                        if (this.widgets[i].widgets[x].callbacks.removed.length > 0)
                        {
                            _script += this.widgets[i].widgets[x].callbacks.removed;
                        }

                    _script += '};';

                // --------------------------------------------------------------------------

                //  Helpers
                _script += 'this.resize_widget = function(ui){';
                _script += 'var _header_height  = ui.find(\'.header-bar\').outerHeight();';
                _script += 'var _editor_height  = ui.find(\'.editor\').outerHeight();';
                _script += 'var _height         = _header_height + _editor_height;';
                _script += 'if (ui.css(\'box-sizing\') === \'border-box\')';
                _script += '{';
                _script += '_height = _height + (2 * parseInt(ui.css(\'border-width\'), 10));';
                _script += '}';
                _script += 'ui.animate({height:_height},250);';
                _script += '};';

                // --------------------------------------------------------------------------

                _script += '};';
                _script += 'var _WIDGET_' + this.widgets[i].widgets[x].slug + ' = new _WIDGET_CALLBACKS_' + this.widgets[i].widgets[x].slug + '();';

                _callbacks = $('<script>').attr('id', 'callbacks-' + this.widgets[i].widgets[x].slug).attr('type', 'text/javascript').html(_script);

                $('body').append(_callbacks);

            }

            _group_counter++;
        }

        this._editor.container.append(this._editor.loader);
        this._editor.container.append(this._editor.header);
        this._editor.container.append(this._editor.dropzone);
        this._editor.container.append(this._editor.widgets);

        $('body').append(this._editor.container);

        // --------------------------------------------------------------------------

        //  Bind to launchers
        $('a.launch-editor').on('click', function()
        {
            var _template   = $(this).data('template');
            var _area       = $(this).data('area');

            _this._editor_launch(_template, _area);

            return false;
        });

        //  Bind tipsys
        $('li.widget[title!=""]', this._editor.widgets).tipsy({gravity:'w'});
    };

    // --------------------------------------------------------------------------

    this._editor_launch = function(template, area)
    {
        $('#' + this.editor_id).removeClass('ready').addClass('loading').show();

        // --------------------------------------------------------------------------

        //  Disable scrolling of body
        $('body').addClass('noscroll');

        // --------------------------------------------------------------------------

        //  Load any existing widgets
        this._load_widgets_for_area(template, area);

        // --------------------------------------------------------------------------

        //  Set up the editor environment
        this._editor_construct(template, area);

        // --------------------------------------------------------------------------

        //  Editor ready
        $('#' + this.editor_id).addClass('ready').removeClass('loading');
    };

    // --------------------------------------------------------------------------

    this._editor_construct = function(template, area)
    {
        var _this = this;

        // --------------------------------------------------------------------------

        //  Set data on the editor
        this._editor.dropzone.data('template', template);
        this._editor.dropzone.data('area', area);

        // --------------------------------------------------------------------------

        //  Init the header
        var _template,_tpl_header;
        _template               = this._get_template(template);
        _template.active_area   = _template.widget_areas[area].title;

        _tpl_header = this.mustache_tpl.header;
        _tpl_header = Mustache.render(_tpl_header, _template);

        this._editor.header.html(_tpl_header);

        // --------------------------------------------------------------------------

        //  Initialise sortables
        this._editor.dropzone.sortable(
        {
            placeholder: 'placeholder',
            handle: '.sorter',
            start: function(e,ui)
            {
                ui.placeholder.height(ui.helper.height());
            },
            update: function(e,ui)
            {
                if (! ui.item.hasClass('processed'))
                {
                    _this._drop_widget(_template.slug, ui.item);
                }
            },
            over: function()
            {
                _this._editor.dropzone.removeClass('empty');
                _this._editor.dropzone.find('li.empty').remove();
            },
            out: function()
            {
                var _counter = 0;
                _counter = _counter + _this._editor.dropzone.find('li.dropzone-widget').length;
                _counter = _counter + _this._editor.dropzone.find('li.widget').length;

                if (_counter <= 1)
                {
                    var _tpl_empty = _this.mustache_tpl.dropzone_empty;
                    _this._editor.dropzone.addClass('empty').append(_tpl_empty);
                }
            },
            stop: function(e,ui)
            {
                if (_this._editor.dropzone.find('li.dropzone-widget').length <= 0)
                {
                    var _tpl_empty = _this.mustache_tpl.dropzone_empty;
                    _this._editor.dropzone.addClass('empty').append(_tpl_empty);
                }
                else
                {
                    _this._editor.dropzone.removeClass('empty');
                    _this._editor.dropzone.find('li.empty').remove();
                }
            }
        });

        // --------------------------------------------------------------------------

        //  Initialise draggables
        this._editor.widgets.find('li.widget:not(.disabled)').draggable(
        {
            helper : function(e)
            {
                var _src = $(e.currentTarget);
                return $('<li>')
                            .addClass('dragging-widget')
                            .text(_src.data('title'))
                            .attr('data-slug', _src.data('slug'));
            },
            appendTo: '#' + this.editor_id,
            zIndex: 3,
            connectToSortable: this._editor.dropzone,
            start: function()
            {
                _this._dragging_widget = true;
            },
            stop: function()
            {
                _this._dragging_widget = false;
            }
        });

        // --------------------------------------------------------------------------

        //  Bind keyUp event for the escape key, don't close if dragging or previewing
        $(document).on('keyup', function(e)
        {
            if (! _this._dragging_widget && ! _this._preview_open && ! _this._dialog_open && e.keyCode === 27)
            {
                _this._editor_close();
            }
        });

        //  Bind the minimiser
        this._editor.widgets_search.find('a.minimiser').on('click', function()
        {
            $('#' + _this.editor_id).toggleClass('minimised');
        });

        //  Bind the search box
        this._editor.widgets_search.find('input').on('keyup', function()
        {
            var _text = $.trim($(this).val());

            /**
             * @TODO: consider adding fuzzy search
             * http://glench.github.io/fuzzyset.js/
             * or
             * http://listjs.com/examples/fuzzy-search
             */

            if (_text.length > 0)
            {
                _this._editor.widgets.find('li.widget').each(function()
                {
                    var _title      = $.trim($(this).find('.label').text());
                    var _keywords   = $(this).data('keywords').split(',');

                    //  Add te widget title as a keyword
                    _keywords.push(_title);

                    //  Clean the keywords list
                    _keywords = _keywords.filter(function(value) {

                        value = $.trim(value);
                        if (value.length === 0) {

                            return false;
                        }
                        return true;
                    });

                    //  Do the test
                    var _regex = new RegExp(_text, 'gi');

                    if (_regex.test(_keywords))
                    {
                        //  Search hit
                        $(this).addClass('search-hit');
                        $(this).removeClass('search-miss');
                    }
                    else
                    {
                        //  Search miss
                        $(this).addClass('search-miss');
                        $(this).removeClass('search-hit');
                    }
                });
            }
            else
            {
                //  Remove search hit/miss classes
                _this._editor.widgets.find('li.widget').removeClass('search-miss search-hit');
            }

        });

        //  Bind group containers
        this._editor.widgets.find('li.grouping').on('click', function()
        {
            $(this).toggleClass('open');

            var _grouping = $(this).data('group');
            _this._editor.widgets.find('li.widget.' + _grouping).toggleClass('hidden');
        });

        //  Bind the action buttons
        _this._editor.header.find('ul.rhs a.action').on('click', function()
        {
            var _action = $(this).data('action');

            switch(_action)
            {
                case 'close' :

                    _this._editor_close();

                break;
            }

            return false;
        });

        // --------------------------------------------------------------------------

        //  Mark the editor as opened
        this._editor_open = true;
    };

    // --------------------------------------------------------------------------

    this._editor_destruct = function()
    {
        //  Save widget data/state
        this._refresh_page_data();

        // --------------------------------------------------------------------------

        //  Re-enable scrolling
        $('body').removeClass('noscroll');

        // --------------------------------------------------------------------------

        //  Remove draggables
        this._editor.widgets.find('li.widget:not(.disabled)').draggable('destroy');

        //  Remove sortables
        this._editor.widgets.find('li.dropzone').sortable('destroy');

        //  Enable all widgets
        this._editor.widgets.find('li.widget.disabled').removeClass('disabled').data('original-title', '').attr('title', '');

        // --------------------------------------------------------------------------

        //  Remove binds
        $(document).off('keyup');
        this._editor.widgets_search.find('a.minimiser').off('click');
        this._editor.widgets_search.find('input').off('keyup');
        this._editor.widgets.find('li.grouping').off('click');
        this._editor.header.find('ul.rhs a').off('click');

        // --------------------------------------------------------------------------

        //  Unset data on the editor
        this._editor.dropzone.data('template', '');
        this._editor.dropzone.data('area', '');

        // --------------------------------------------------------------------------

        //  Mark the editor as opened
        this._editor_open = false;
    };

    // --------------------------------------------------------------------------

    this._load_widgets_for_area = function(template, area)
    {
        //  Clear the dropzone and make empty
        var _tpl_empty = this.mustache_tpl.dropzone_empty;
        this._editor.dropzone.addClass('empty').html(_tpl_empty);

        // --------------------------------------------------------------------------

        //  Load widgets
        if (typeof(this.page_data.widget_areas[template][area]) !== 'undefined')
        {
            if (this.page_data.widget_areas[template][area].length)
            {
                this._editor.dropzone.removeClass('empty');
                this._editor.dropzone.find('li.empty').remove();

                for (var _key in this.page_data.widget_areas[template][area]) {
                    if (this.page_data.widget_areas[template][area].hasOwnProperty(_key)) {
                        //  Quick shortcut
                        var _data = this.page_data.widget_areas[template][area][_key];

                        //  Create a placeholder item in the list
                        var _placeholder = $('<div>').data('slug', _data.widget);
                        this._editor.dropzone.append(_placeholder);

                        //  Drop the widget
                        this._drop_widget(template, _placeholder, _data.data);
                    }
                }
            }
        }
    };

    // --------------------------------------------------------------------------

    this._drop_widget = function(template, ui, widget_data)
    {
        //  Define vars
        var _slug,_widget,_data,_html,_item;

        //  What type of widget are we dealing with? Get more info.
        _slug   = $(ui).data('slug');
        _widget = this._get_widget(_slug);

        if (_widget !== false)
        {
            _data = {
                id          : 'widget-editor-' + Math.floor(Math.random() * 10000000000000001),
                slug        : _slug,
                label       : _widget.label,
                description : _widget.description
            };

            _html = Mustache.render(this.mustache_tpl.dropzone_widget, _data);

            _item = $('<li>');
            _item.addClass('processed dropzone-widget ' + _data.slug);
            if (_data.description.length === 0)
            {
                _item.addClass('mask-no-description');
            }
            _item.attr('id', _data.id);
            _item.data('slug', _data.slug);
            _item.html(_html);

            // --------------------------------------------------------------------------

            //  Bind onto the closer button
            var _this = this;
            $('.header-bar .closer', _item).on('click', function(e)
            {

                var _id = $(this).closest('li.dropzone-widget').attr('id');

                _this._remove_widget(_id);

                e.stopPropagation();
                return false;
            });

            // --------------------------------------------------------------------------

            //  Place it into the DOM
            ui.replaceWith(_item);

            // --------------------------------------------------------------------------

            this._editor.dropzone.removeClass('empty');
            this._editor.dropzone.find('li.empty').remove();

            //  Call the server asking for the widget's editor view, use POST in case
            //  there's a lot of data

            var _call =
            {
                'action'        : 'POST',
                'controller'    : 'cms/pages',
                'method'        : 'widgetEditor',
                'data'          :
                {
                    widget: _widget.slug,
                    template: template,
                    id: _data.id,
                    data: widget_data
                },
                'success' : function(data)
                {
                    $(_item).find('.editor').html(data.HTML);

                    // --------------------------------------------------------------------------

                    //  Add stripes
                    /* jshint ignore:start */
                    if (typeof(_nails.addStripes) === 'function')
                    {
                        _nails.addStripes();
                    }
                    /* jshint ignore:end */

                    // --------------------------------------------------------------------------

                    //  Select2
                    /* jshint ignore:start */
                    if (typeof($.fn.select2) === 'function')
                    {
                        //$('select.select2').select2();

                        //  TODO: get this working with the overflow'd parents
                    }
                    /* jshint ignore:end */

                    // --------------------------------------------------------------------------

                    //  Execute this widget's dropped callback
                    try
                    {
                        window['_WIDGET_' + _widget.slug].dropped(_item);
                    }
                    catch(error)
                    {
                        if (typeof(console.log) === 'function')
                        {
                            console.log('CMS PAGES: `dropped` callback is not defined for widget "' + _widget.slug + '"', error);
                        }
                    }

                    // --------------------------------------------------------------------------

                    //  Resize the container to the size of the content
                    try
                    {
                        window['_WIDGET_' + _widget.slug].resize_widget(_item);
                    }
                    catch(error)
                    {
                        if (typeof(console.log) === 'function')
                        {
                            console.log('CMS PAGES: `resize_widget` callback is not defined for widget "' + _widget.slug + '"', error);
                        }
                    }

                    // --------------------------------------------------------------------------

                    //  Finally, update the page_data
                    _this._refresh_page_data();

                },
                'error' : function(data)
                {
                    var _data = JSON.parse(data.responseText);

                    $(_item).addClass('error').find('.editor').html('<p class="system-alert error"><strong>Error:</strong> ' + _data.error + '</p>');

                },
            };

            this._api.call(_call);
        }
        else
        {
            if (typeof(console.warn) === 'function')
            {
                console.warn('CMS PAGES: Could not find widget "' + _slug + '"; ignored.');
            }

            //  Remove the dud element
            $(ui).remove();

            //  Feedback
            var _message = '';
            _message += '<p>I just attempted, and failed, to load a widget whose slug was "' + _slug + '"</p>';
            _message += '<p>This likely happened due to an out-of-date database or a 3rd party edited the database with bad data.</p>';
            _message += '<p>While nothing dangerous has happened, you should know that this widget was not loaded. You should check that your page is as expected.</p>';
            $('<div>').html(_message).dialog({
                title: 'A widget could not be loaded',
                resizable: false,
                draggable: false,
                modal: true,
                buttons:
                {
                    OK: function()
                    {
                        $(this).dialog('close');
                    }
                }
            });
        }
    };

    // --------------------------------------------------------------------------

    this._remove_widget = function(id)
    {
        var _this = this;

        $('<div>').text('Are you sure you wish to remove this widget from the interface?').dialog({
            title: 'Are you sure?',
            resizable: false,
            draggable: false,
            modal: true,
            buttons:
            {
                OK: function()
                {
                    var _item   = $('#' + id);
                    var _slug   = _item.data('slug');

                    //  Close dialog
                    $(this).dialog('close');

                    _item.animate({opacity:0,height:0}, 250, function()
                    {
                        //  Remove the widget
                        _item.remove();

                        //  Test to see if the list is now empty
                        if (_this._editor.dropzone.find('li.dropzone-widget').length <= 0)
                        {
                            var _tpl_empty = _this.mustache_tpl.dropzone_empty;

                            _this._editor.dropzone
                            .addClass('empty')
                            .append(_tpl_empty)
                            .find('li.empty')
                            .css({opacity:0})
                            .animate({opacity:1},250);
                        }

                        //  Removed callback
                        try
                        {
                            window['_WIDGET_' + _slug].removed(_item);
                        }
                        catch(error)
                        {
                            if (typeof(console.log) === 'function')
                            {
                                console.log('CMS PAGES: `removed` callback is not defined for widget "' + _slug + '"', error);
                            }
                        }
                    });
                },
                Cancel: function()
                {
                    $(this).dialog('close');
                }
            },
            open : function() { _this._dialog_open = true; },
            close : function() { setTimeout(function() { _this._dialog_open = false; }, 500); }
        });

        $('.ui-widget-overlay').css({zIndex:1000});
    };

    // --------------------------------------------------------------------------

    this._editor_close = function()
    {
        $('#' + this.editor_id).hide();
        this._editor_destruct();
    };

    // --------------------------------------------------------------------------

    /**
     * Get an individual template by it's ID.
     * @param  {String} slug The template's slug
     * @return {Object}
     */
    this._get_template = function(slug)
    {
        for (var i = this.templates.length - 1; i >= 0; i--) {
            if (slug === this.templates[i].slug)
            {
                return this.templates[i];
            }
        }

        return false;
    };

    // --------------------------------------------------------------------------

    /**
     * Get an individual widget by it's ID.
     * @param  {String} slug The widget's slug
     * @return {Object}
     */
    this._get_widget = function(slug)
    {
        for (var i = this.widgets.length - 1; i >= 0; i--) {
            for (var x = this.widgets[i].widgets.length - 1; x >= 0; x--) {
                if (slug === this.widgets[i].widgets[x].slug)
                {
                    return this.widgets[i].widgets[x];
                }
            }
        }

        return false;
    };

    // --------------------------------------------------------------------------

    this._redirect = function(url)
    {
        window.onbeforeunload   = null;
        window.location.href    = url;
    };

    // --------------------------------------------------------------------------

    /* jshint ignore:start */
    this._array_search = function(needle, haystack, argStrict )
    {
        /* jshint ignore:start */
        //  discuss at: http://phpjs.org/functions/array_search/
        // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        //    input by: Brett Zamir (http://brett-zamir.me)
        // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        //  depends on: array
        //        test: skip
        //   example 1: array_search('zonneveld', {firstname: 'kevin', middle: 'van', surname: 'zonneveld'});
        //   returns 1: 'surname'
        //   example 2: ini_set('phpjs.return_phpjs_arrays', 'on');
        //   example 2: var ordered_arr = array({3:'value'}, {2:'value'}, {'a':'value'}, {'b':'value'});
        //   example 2: var key = array_search(/val/g, ordered_arr); // or var key = ordered_arr.search(/val/g);
        //   returns 2: '3'

        var strict = !! argStrict,
        key = '';

        if (haystack && typeof haystack === 'object' && haystack.change_key_case)   // Duck-type check for our own array()-created PHPJS_Array
        {
            return haystack.search(needle, argStrict);
        }
        if (typeof needle === 'object' && needle.exec)  // Duck-type for RegExp
        {
            if (!strict) // Let's consider case sensitive searches as strict
            {
                var flags = 'i' + (needle.global ? 'g' : '') +
                (needle.multiline ? 'm' : '') +
                (needle.sticky ? 'y' : ''); // sticky is FF only
                needle = new RegExp(needle.source, flags);
            }
            for (key in haystack)
            {
                if (needle.test(haystack[key]))
                {
                    return key;
                }
            }
            return false;
        }

        for (key in haystack)
        {
            if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle))
            {
                return key;
            }
        }

        return false;
    };
    /* jshint ignore:end */

    // --------------------------------------------------------------------------

    /* jshint ignore:start */
    this.md5 = function(str)
    {
        //    discuss at: http://phpjs.org/functions/md5/
        // original by: Webtoolkit.info (http://www.webtoolkit.info/)
        // improved by: Michael White (http://getsprink.com)
        // improved by: Jack
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        //        input by: Brett Zamir (http://brett-zamir.me)
        // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        //    depends on: utf8_encode
        //     example 1: md5('Kevin van Zonneveld');
        //     returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'

        var xl;

        var rotateLeft = function(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        };

        var addUnsigned = function(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        };

        var _F = function(x, y, z) {
            return (x & y) | ((~x) & z);
        };
        var _G = function(x, y, z) {
            return (x & z) | (y & (~z));
        };
        var _H = function(x, y, z) {
            return (x ^ y ^ z);
        };
        var _I = function(x, y, z) {
            return (y ^ (x | (~z)));
        };

        var _FF = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };

        var _GG = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };

        var _HH = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };

        var _II = function(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };

        var convertToWordArray = function(str) {
            var lWordCount;
            var lMessageLength = str.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = new Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };

        var wordToHex = function(lValue) {
            var wordToHexValue = '',
                wordToHexValue_temp = '',
                lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                wordToHexValue_temp = '0' + lByte.toString(16);
                wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
            }
            return wordToHexValue;
        };

        var x = [],
            k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
            S12 = 12,
            S13 = 17,
            S14 = 22,
            S21 = 5,
            S22 = 9,
            S23 = 14,
            S24 = 20,
            S31 = 4,
            S32 = 11,
            S33 = 16,
            S34 = 23,
            S41 = 6,
            S42 = 10,
            S43 = 15,
            S44 = 21;

        str = this.utf8_encode(str);
        x = convertToWordArray(str);
        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;

        xl = x.length;
        for (k = 0; k < xl; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = addUnsigned(a, AA);
            b = addUnsigned(b, BB);
            c = addUnsigned(c, CC);
            d = addUnsigned(d, DD);
        }

        var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

        return temp.toLowerCase();
    };
    /* jshint ignore:end */

    // --------------------------------------------------------------------------

    /* jshint ignore:start */
    this.utf8_encode = function(argString)
    {
        return unescape(encodeURIComponent(argString));
    };
    /* jshint ignore:end */

    // --------------------------------------------------------------------------

    return this.__construct(page_id, page_data);
};
