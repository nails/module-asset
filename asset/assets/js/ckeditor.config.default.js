/* global CKEDITOR */

/**
 * Define changes to default configuration here.
 * For the complete reference: http://docs.ckeditor.com/#!/api/CKEDITOR.config
 */

/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * Load any external plugins (i.e, plugins not bundled with CKEditor)
 */

CKEDITOR.plugins.addExternal('codemirror', window.NAILS.URL + 'js/ckeditor.plugins/codemirror/');
CKEDITOR.plugins.addExternal('mediaembed', window.NAILS.URL + 'js/ckeditor.plugins/mediaembed/');
CKEDITOR.plugins.addExternal('image2', window.NAILS.URL + 'js/ckeditor.plugins/image2/');

/**
 * Define the CKEditor config object
 */

CKEDITOR.editorConfig = function(config)
{
    /**
     * Additional plugins to enable
     * @type {String}
     */

    config.extraPlugins = 'justify,autogrow,mediaembed,codemirror,colorbutton,colordialog,font,image2';

    /**
     * Plugins to remove
     * @type {String}
     */

    config.removePlugins = 'resize,elementspath';

    /**
     * The toolbar groups arrangement, optimized for a single toolbar row.
     * @type {Array}
     */

    config.toolbarGroups = [
        {
            name: 'document',
            groups: ['mode'] },
        {
            name: 'styles',
            groups: [''] },
        {
            name: 'basicstyles',
            groups: ['basicstyles'] },
        {
            name: 'colors'
        },
        {
            name: 'paragraph',
            groups: ['align', 'list', 'indent', 'blocks'] },
        {
            name: 'links'
        },
        {
            name: 'insert',
            groups: ['mediaembed'] },
        {
            name: 'tools'
        },
        {
            name: 'others'
        }
    ];

    /**
     * Any specific, individual, buttons to remove
     * @type {String}
     */

    config.removeButtons = 'Font';

    /**
     * Only allow certain formatting
     * @type {Object}
     */

    config.format_small = {
        element: 'small',
        name: 'Small'
    };

    /**
     * Only allow formatting on specific tags
     * @type {String}
     */

    config.format_tags = 'p;small;h1;h2;h3;h4;h5';

    /**
     * Allow the editor to define whatever classes the user wants on elements.
     * Same deal for data-* attributes
     * @type {Object}
     */

    config.extraAllowedContent = {
        '*': {
            classes: '*',
            attributes: 'data-*'
        },
        'img': {
            attributes: '!width,!height'
        }
    };

    /**
     * Limit height of autoGrow plugin
     * @type {Number}
     */

    config.autoGrow_maxHeight = 500;

    /**
     * Considering that the basic setup doesn't provide pasting cleanup features,
     * it's recommended to force everything to be plain text.
     * @type {Boolean}
     */

    config.forcePasteAsPlainText = true;

    /**
     * Configure the CDN endpoints
     * @type {string}
     */

    config.filebrowserImageBrowseUrl = window.SITE_URL + 'cdn/manager/browse/image';
    config.filebrowserFlashBrowseUrl = window.SITE_URL + 'cdn/manager/browse/flash';
    config.filebrowserBrowseUrl      = window.SITE_URL + 'cdn/manager/browse/file';

    /**
     * Dialog colour; tie it in with the rest of admin
     * @type {String}
     */

    config.dialog_backgroundCoverColor   = 'rgb(0,0,0)';
    config.dialog_backgroundCoverOpacity = 0.75;

    /**
     * Don't show codemirror buttons
     * @type {Object}
     */

    config.codemirror = {
        showSearchButton: false,
        showCommentButton: false,
        showFormatButton: false,
        showUncommentButton: false,
        showAutoCompleteButton: false
    };
};
