/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.plugins.addExternal( 'codemirror',	window.NAILS.URL + 'js/ckeditor.plugins/codemirror/' );
CKEDITOR.plugins.addExternal( 'mediaembed',	window.NAILS.URL + 'js/ckeditor.plugins/mediaembed/' );
CKEDITOR.plugins.addExternal( 'image2',	window.NAILS.URL + 'js/ckeditor.plugins/image2/' );

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For the complete reference:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	config.extraPlugins = 'justify,autogrow,mediaembed,codemirror,colorbutton,colordialog,font,image2';
	config.removePlugins = 'resize,elementspath';

	// The toolbar groups arrangement, optimized for a single toolbar row.
	config.toolbarGroups = [
		{ name: 'document',    groups: [ 'mode' ] },
		{ name: 'styles',      groups: [ '' ] },
		{ name: 'basicstyles', groups: [ 'basicstyles' ] },
		{ name: 'colors' },
		{ name: 'paragraph',   groups: [ 'align', 'list', 'indent', 'blocks' ] },
		{ name: 'links' },
		{ name: 'insert',      groups: [ 'mediaembed' ] },
		{ name: 'tools' },
		{ name: 'others' }
	];

	config.removeButtons = 'Font';

	//	Only allow certain formatting
	config.format_small = { element : 'small', name : 'Small' };
	config.format_tags = 'p;small;h1;h2;h3;h4;h5';

	//	Allow the editor to define whatever classes the user wants on elements
	//	Same deal for data-* attributes
	config.extraAllowedContent = {
		'*':
		{
			classes: '*',
			attributes: 'data-*'
		},
		'img':
		{
			attributes: '!width,!height'
		}
	};

	//	Limit height of autoGrow plugin
	config.autoGrow_maxHeight = 500;

	// Considering that the basic setup doesn't provide pasting cleanup features,
	// it's recommended to force everything to be plain text.
	config.forcePasteAsPlainText = true;

	//	CDN
	config.filebrowserImageBrowseUrl	= window.SITE_URL + 'cdn/manager/browse/image';
	config.filebrowserFlashBrowseUrl	= window.SITE_URL + 'cdn/manager/browse/flash';
	config.filebrowserBrowseUrl			= window.SITE_URL + 'cdn/manager/browse/file';

	//	Dialog colour; tie it in with the rest of admin
	config.dialog_backgroundCoverColor		= 'rgb(0,0,0)';
	config.dialog_backgroundCoverOpacity	= 0.75;

	//	Don't show codemirror buttons
	config.codemirror = {
		showSearchButton: false,
		showCommentButton: false,
		showFormatButton: false,
		showUncommentButton: false,
		showAutoCompleteButton: false
	};
};