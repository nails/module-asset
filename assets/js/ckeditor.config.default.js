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
CKEDITOR.plugins.addExternal('footnotes', window.NAILS.URL + 'js/ckeditor.plugins/footnotes/');
CKEDITOR.plugins.addExternal('mediaembed', window.NAILS.URL + 'js/ckeditor.plugins/mediaembed/');

/**
 * Set the contents of the "Styles" dropdown
 */
CKEDITOR.stylesSet.add(
    'nailsStyles',
    [
        {
            name: 'Preformatted',
            element: 'pre'
        },
        {
            name: 'Code Block',
            element: 'pre',
            attributes: {'class': 'code-block'}
        },
        {
            name: 'Big',
            element: 'big'
        },
        {
            name: 'Small',
            element: 'small'
        },
        {
            name: 'Computer Code',
            element: 'code'
        },
        {
            name: 'Variable',
            element: 'var'
        },
        {
            name: 'Deleted Text',
            element: 'del'
        },
        {
            name: 'Marker',
            element: 'mark'
        }
    ]
);

/**
 * Define the CSS to use in the content area
 * @type {String}
 */
CKEDITOR.config.contentsCss = window.NAILS.URL + 'css/nails.admin.ckeditor.min.css';


/**
 * enable native spell checking
 * @type {Bool}
 */
CKEDITOR.config.disableNativeSpellChecker = false;

/**
 * Define the CKEditor config object
 */
CKEDITOR.editorConfig = function(config) {
    /**
     * The name of the styles object to show in the "Styles" dropdown
     * @type {String}
     */
    config.stylesSet = 'nailsStyles';

    /**
     * Additional plugins to enable
     * @type {String}
     */
    config.extraPlugins = 'justify,autogrow,mediaembed,codemirror,colorbutton,colordialog,font,image2,pastefromword,iframe,indentblock,footnotes';

    /**
     * Plugins to remove
     * @type {String}
     */
    config.removePlugins = 'resize,elementspath,image';

    /**
     * The toolbar groups arrangement, optimized for a single toolbar row.
     * @type {Array}
     */
    config.toolbarGroups = [
        {
            name: 'document',
            groups: ['mode']
        },
        {
            name: 'styles',
            groups: ['']
        },
        {
            name: 'basicstyles',
            groups: ['basicstyles']
        },
        {
            name: 'colors'
        },
        {
            name: 'clipboard',
            groups: ['clipboard', 'undo']
        },
        {
            name: 'paragraph',
            groups: ['align', 'list', 'indent', 'blocks']
        },
        {
            name: 'links'
        },
        {
            name: 'insert',
            groups: ['mediaembed']
        },
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
            attributes: 'data-*,id,clas'
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
     * Configure the CDN endpoints
     * @type {string}
     */
    config.filebrowserImageBrowseUrl = window.SITE_URL + 'admin/cdn/manager?isModal=1';
    config.filebrowserFlashBrowseUrl = window.SITE_URL + 'admin/cdn/manager?isModal=1';
    config.filebrowserBrowseUrl = window.SITE_URL + 'admin/cdn/manager?isModal=1';

    /**
     * Dialog colour; tie it in with the rest of admin
     * @type {String}
     */
    config.dialog_backgroundCoverColor = 'rgb(0,0,0)';
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

    /**
     * Enable pasteformword prompt
     * @type {boolean}
     */
    config.pasteFromWordPromptCleanup = true;

    /**
     * Only paste  text with links and basic formatting
     * @type {String}
     */
    config.pasteFilter = 'p; a[!href]; strong; em';
};

/**
 * Change the default values of the table dialog
 */
CKEDITOR.on('dialogDefinition', function(e) {

    var dialogName = e.data.name;
    var dialogDefinition = e.data.definition;

    if (dialogName === 'table') {
        var info = dialogDefinition.getContents('info');
        info.get('txtWidth')['default'] = '100%';
        info.get('txtBorder')['default'] = '0';
        info.get('txtCellSpace')['default'] = '0';
        info.get('txtCellPad')['default'] = '0';
    }
});
