var NAILS_CDN_Manager;
/**
 * The Nails CDN manager
 * @param  {string}   handler        The handler to use, either 'ckeditor' or 'native'
 * @param  {array}    callback       The callback to use when handler is native. First element is the class name, second the method name
 * @param  {mixed}    passback       Any JSON encoded data to pass back to the callback
 * @param  {Object}   urlSchemes     The URL Schemes
 * @param  {Boolean}  isFancybox     Whether this manager is being shown in a fancybox or not
 * @param  {Boolean}  reopenFancybox Whether to reopen the fancybox after closing
 */
NAILS_CDN_Manager =  function(handler, callback, passback, urlSchemes, isFancybox, reopenFancybox) {

    var base = this;

    // --------------------------------------------------------------------------

    base.handler        = handler;
    base.callback       = callback;
    base.passback       = passback;
    base.urlSchemes     = urlSchemes;
    base.isFancybox     = isFancybox;
    base.reopenFancybox = reopenFancybox;

    // --------------------------------------------------------------------------

    /**
     * Construct the manager
     * @return {void}
     */
    base.__construct = function()
    {
        base.initSubmit();
        base.initAlerts();
        base.initUpload();
        base.initDelete();
        base.initInsert();
        base.insertSearch();

        // --------------------------------------------------------------------------

        /**
         * Is the callback callable? Using try/catch blocks to avoid raising errors
         * on deep objects. That's what she said.
         */

        var isCallable = false;

        if (base.handler === 'ckeditor')
        {
            //  Assume callable - CKEditor should handle this.
            isCallable = true;

        } else {

            if (base.isFancybox) {

                try {

                    isCallable = typeof(window.parent[base.callback[0]][base.callback[1]]) === 'function' ? true : false;

                } catch (e) {

                    isCallable = false;
                }
            }
            else
            {
                if (window.opener)
                {
                    try {

                        isCallable = typeof(window.opener[base.callback[0]][base.callback[1]]) === 'function' ? true : false;

                    } catch (e) {

                        isCallable = false;
                    }
                }
                else
                {
                    isCallable = false;
                }
            }
        }

        if (!isCallable)
        {
            $('a.insert').remove();
        }

        // --------------------------------------------------------------------------

        //  Initiate the fancyboxes, doing so here so we can style it slightly differently
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

    /**
     * Show the mask when submitting the upload
     * @return {void}
     */
    base.initSubmit = function()
    {
        $('form').on('submit', function()
        {
            base.showMask();
        });
    };

    // --------------------------------------------------------------------------

    /**
     * Bind to the alerts
     * @return {void}
     */
    base.initAlerts = function()
    {
        $('.system-alert .awesome').on('click', function()
        {
            base.hideAlert();
            return false;
        });

        // --------------------------------------------------------------------------

        //  If alert is open and enter is pressed then trigger the first button
        $(document).on('keydown', function(e)
        {
            //  Enter key
            if (e.keyCode === 13 && $('#alert:visible').length > 0)
            {
                $('#alert .awesome.ok').first().click();
            }

            //  Escape
            if (e.keyCode === 27 && $('#alert:visible').length > 0)
            {
                $('#alert .awesome.cancel').first().click();
            }
        });
    };

    // --------------------------------------------------------------------------

    /**
     * Initialsie the ajax uploader
     * @return {void}
     */
    base.initUpload = function()
    {
    };

    // --------------------------------------------------------------------------

    /**
     * Bind the confirmation dialog to the delete buttons
     * @return {void}
     */
    base.initDelete = function()
    {
        $('a.delete').on('click', function()
        {
            var link, message;

            link = $(this);

            message  = '<p>';
            message += 'Any resources which are using this object will have the reference removed.';
            message += '</p>';
            message += '<p>';
            message += 'Continue?';
            message += '</p>';

            $('<div>').html(message).dialog({
                title: 'Are you sure?',
                resizable: false,
                draggable: false,
                modal: true,
                dialogClass: "no-close",
                buttons:
                {
                    'Delete': function()
                    {
                        window.location.href = link.attr('href');
                    },
                    'Cancel': function()
                    {
                        $(this).dialog("close");
                    }
                }
            });

            return false;
        });
    };

    // --------------------------------------------------------------------------

    /**
     * Bind to the "insert" buttons
     * @return {void}
     */
    base.initInsert = function()
    {
        $('a.insert').on('click', function()
        {
            var file     = $(this).attr('data-file');
            var objectId = $(this).attr('data-id');
            var bucket   = $(this).attr('data-bucket');

            if (base.handler === 'ckeditor')
            {
                base.insertCkeditor(bucket, file, objectId);
            }
            else
            {
                base.insertNative(bucket, file, objectId);
            }

            //  Close window
            if (base.isFancybox)
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

    /**
     * Handle inserting into CKEditor
     * @param  {string}  bucket   The bucket to which the object belongs
     * @param  {string}  file     The filename of the object
     * @param  {integer} objectId The object's ID
     * @return {void}
     */
    base.insertCkeditor = function(bucket, file, objectId)
    {
        //  @todo Render a modal asking for customisations to the URL
        //  Choose the scheme to use (@todo: make this dynamic)
        var scheme = this.urlSchemes.serve;

        //  Break into filename and extensions
        var filename = file.split('.');

        //  Define the data object
        var _data = {
            bucket      : bucket,
            filename    : filename[0],
            extension   : '.' + filename[1],
            id          : objectId,
            width       : 0,  // @todo add better support for URLs
            height      : 0,  // @todo add better support for URLs
            sex         : '', // @todo add better support for URLs
            border      : 0   // @todo add better support for URLs
        };

        //  Apply the scheme
        var url = Mustache.render(scheme, _data);

        //  Call back to the CKEditor instance
        window.opener.CKEDITOR.tools.callFunction(this.callback, url);
    };

    // --------------------------------------------------------------------------

    /**
     * Handle returning to the callback
     * @param  {string}  file     The filename of the object
     * @param  {integer} objectId The object's ID
     * @return {void}
     */
    base.insertNative = function(bucket, file, objectId)
    {
        if (this.isFancybox)
        {
            window.parent[this.callback[0]][this.callback[1]]
                .call(null, bucket, file, objectId, this.reopenFancybox, base.passback);
        }
        else
        {
            window.opener[this.callback[0]][this.callback[1]]
                .call(null, bucket, file, objectId, this.reopenFancybox, base.passback);
        }
    };

    // --------------------------------------------------------------------------

    /**
     * Init the search box
     * @return {void}
     */
    base.insertSearch = function()
    {
        $('#search-text').on('keyup', function()
        {
            base.doSearch($(this).val());
            return false;
        });
    };

    // --------------------------------------------------------------------------

    /**
     * Perform the search
     * @param  {string} term The search term
     * @return {void}
     */
    base.doSearch = function(term)
    {
        $('li.file,tr.file:not(.head)').each(function()
        {
            var regex = new RegExp(term, 'gi');

            if (regex.test($(this).attr('data-title'))) {

                $(this).show();

            } else {

                $(this).hide();
            }
        });
    };

    // --------------------------------------------------------------------------

    /**
     * Show the mask
     * @return {void}
     */
    base.showMask = function()
    {
        $('#mask').show();
    };

    // --------------------------------------------------------------------------

    /**
     * Hide the mask
     * @return {void}
     */
    base.hideMask = function()
    {
        $('#mask').hide();
    };

    // --------------------------------------------------------------------------

    /**
     * Show the alert
     * @return {void}
     */
    base.showAlert = function()
    {
        $('#alert').show();
    };

    // --------------------------------------------------------------------------

    /**
     * Hide the alert
     * @return {void}
     */
    base.hideAlert = function()
    {
        $('#alert').hide();
    };

    // --------------------------------------------------------------------------

    return base.__construct();
};