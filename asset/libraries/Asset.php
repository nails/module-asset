<?php

/**
 * The class provides asset loading facilities
 *
 * @package     Nails
 * @subpackage  module-asset
 * @category    Library
 * @author      Nails Dev Team
 * @link
 */
class Asset
{

	protected $CI;
	protected $_css;
	protected $_css_inline;
	protected $_js;
	protected $_js_inline;


	// --------------------------------------------------------------------------


	/**
	 * Constructor
	 *
	 * @access	public
	 * @param	none
	 * @return	void
	 **/
	public function __construct()
	{
		$this->CI			=& get_instance();
		$this->_css			= array();
		$this->_css_inline	= array();
		$this->_js			= array();
		$this->_js_inline	= array();
	}


	// --------------------------------------------------------------------------


	/**
	 * Load an asset
	 *
	 * @access	public
	 * @param	string
 	 * @param	boolean
 	 * @param	boolean
	 * @return	void
	 **/
	public function load( $assets, $asset_type = 'APP', $force_type = NULL )
	{
		$assets = ! is_array( $assets ) && ! is_object( $assets ) ? array( $assets ) : $assets ;

		// --------------------------------------------------------------------------

		//	Backwards compatibility
		$asset_type = $asset_type === TRUE ? 'NAILS' : $asset_type;

		// --------------------------------------------------------------------------

		switch ( strtoupper( $asset_type ) ) :

			case 'NAILS' :			$_asset_type_method = '_load_nails';			break;
			case 'NAILS-BOWER' :
			case 'BOWER' :			$_asset_type_method = '_load_nails_bower';		break;
			case 'NAILS-PACKAGE' :	$_asset_type_method = '_load_nails_package';	break;
			case 'APP-BOWER' :		$_asset_type_method = '_load_app_bower';		break;
			case 'APP' :
			default :				$_asset_type_method = '_load_app';				break;

		endswitch;

		// --------------------------------------------------------------------------

		foreach ( $assets AS $asset ) :

			if  ( preg_match( '#^https?://#', $asset ) ) :

				$this->_load_url( $asset, $force_type );

			elseif ( substr( $asset, 0, 0 ) == '/' ) :

				$this->_load_absolute( $asset, $force_type );

			else :

				$this->{$_asset_type_method}( $asset, $force_type );

			endif;

		endforeach;
	}


	// --------------------------------------------------------------------------


	/**
	 * Loads an asset supplied as a URL
	 * @param  string $asset      The asset's URL
	 * @param  string $force_type Forces a particular type (accepts values CSS or JS)
	 * @return void
	 */
	protected function _load_url( $asset, $force_type )
	{
		$_type = $this->_determine_type( $asset, $force_type );

		switch ( $_type ) :

			case 'CSS' :	$this->_css['URL-' . $asset]	= $asset;	break;
			case 'JS' :		$this->_js['URL-' . $asset]		= $asset;	break;

		endswitch;
	}


	// --------------------------------------------------------------------------


	/**
	 * Loads an asset supplied as an absolute URL
	 * @param  string $asset      The asset's absolute URL
	 * @param  string $force_type Forces a particular type (accepts values CSS or JS)
	 * @return void
	 */
	protected function _load_absolute( $asset, $force_type )
	{
		$_type = $this->_determine_type( $asset, $force_type );

		switch ( $_type ) :

			case 'CSS' :	$this->_css['ABSOLUTE-' . $asset]	= site_url( $asset );	break;
			case 'JS' :		$this->_js['ABSOLUTE-' . $asset]	= site_url( $asset );	break;

		endswitch;
	}


	// --------------------------------------------------------------------------


	/**
	 * Loads a Nails asset
	 * @param  string $asset      The asset's name
	 * @param  string $force_type Forces a particular type (accepts values CSS or JS)
	 * @return void
	 */
	protected function _load_nails( $asset, $force_type = NULL )
	{
		$_type = $this->_determine_type( $asset, $force_type );

		switch ( $_type ) :

			case 'CSS' :	$this->_css['NAILS-' . $asset]	= NAILS_ASSETS_URL . 'css/' . $asset;	break;
			case 'JS' :		$this->_js['NAILS-' . $asset]	= NAILS_ASSETS_URL . 'js/' . $asset;	break;

		endswitch;
	}


	// --------------------------------------------------------------------------


	/**
	 * Loads a Nails Bower asset
	 * @param  string $asset      The asset's name (as a relative url from NAILS_ASSETS_URL . 'bower_components/')
	 * @param  string $force_type Forces a particular type (accepts values CSS or JS)
	 * @return void
	 */
	protected function _load_nails_bower( $asset, $force_type = NULL )
	{
		$_type = $this->_determine_type( $asset, $force_type );

		switch ( $_type ) :

			case 'CSS' :	$this->_css['NAILS-BOWER-' . $asset]	= NAILS_ASSETS_URL . 'bower_components/' . $asset;	break;
			case 'JS' :		$this->_js['NAILS-BOWER-' . $asset]		= NAILS_ASSETS_URL . 'bower_components/' . $asset;	break;

		endswitch;
	}


	// --------------------------------------------------------------------------


	/**
	 * Loads a Nails package asset
	 * @param  string $asset      The asset's name (as a relative url from NAILS_ASSETS_URL . 'packages/')
	 * @param  string $force_type Forces a particular type (accepts values CSS or JS)
	 * @return void
	 */
	protected function _load_nails_package( $asset, $force_type = NULL )
	{
		$_type = $this->_determine_type( $asset, $force_type );

		switch ( $_type ) :

			case 'CSS' :	$this->_css['APP-' . $asset]	= NAILS_ASSETS_URL . 'packages/' . $asset;	break;
			case 'JS' :		$this->_js['APP-' . $asset]		= NAILS_ASSETS_URL . 'packages/' . $asset;	break;

		endswitch;
	}


	// --------------------------------------------------------------------------


	/**
	 * Loads an App Bower asset
	 * @param  string $asset      The asset's name (as a relative url from assets/bower_components)
	 * @param  string $force_type Forces a particular type (accepts values CSS or JS)
	 * @return void
	 */
	protected function _load_app_bower( $asset, $force_type = NULL )
	{
		$_type = $this->_determine_type( $asset, $force_type );

		switch ( $_type ) :

			case 'CSS' :	$this->_css['APP-BOWER-' . $asset]	= site_url( 'assets/bower_components/' . $asset );	break;
			case 'JS' :		$this->_js['APP-BOWER-' . $asset]	= site_url( 'assets/bower_components/' . $asset );	break;

		endswitch;
	}


	// --------------------------------------------------------------------------


	/**
	 * Loads an app asset
	 * @param  string $asset      The asset's name (as a relative url from assets/[css|js])
	 * @param  string $force_type Forces a particular type (accepts values CSS or JS)
	 * @return void
	 */
	protected function _load_app( $asset, $force_type = NULL )
	{
		$_type = $this->_determine_type( $asset, $force_type );

		switch ( $_type ) :

			case 'CSS' :	$this->_css['APP-' . $asset]	= site_url( 'assets/css/' . $asset );	break;
			case 'JS' :		$this->_js['APP-' . $asset]		= site_url( 'assets/js/' . $asset );	break;

		endswitch;
	}


	// --------------------------------------------------------------------------


	/**
	 * Mark an asset for unloading
	 *
	 * @access	public
	 * @param	string
	 * @return	void
	 **/
	public function unload( $assets, $asset_type = 'APP', $force_type = NULL )
	{
		$assets = ! is_array( $assets ) && ! is_object( $assets ) ? array( $assets ) : $assets ;

		// --------------------------------------------------------------------------

		//	Backwards compatibility
		$asset_type = $asset_type === TRUE ? 'NAILS' : $asset_type;

		// --------------------------------------------------------------------------

		switch ( strtoupper( $asset_type ) ) :

			case 'NAILS' :			$_asset_type_method = '_unload_nails';			break;
			case 'NAILS-BOWER' :
			case 'BOWER' :			$_asset_type_method = '_unload_nails_bower';	break;
			case 'NAILS-PACKAGE' :	$_asset_type_method = '_unload_nails_package';	break;
			case 'APP-BOWER' :		$_asset_type_method = '_unload_app_bower';		break;
			case 'APP' :
			default :				$_asset_type_method = '_unload_app';			break;

		endswitch;

		// --------------------------------------------------------------------------

		foreach ( $assets AS $asset ) :

			if  ( preg_match( '#^https?://#', $asset ) ) :

				$this->_unload_url( $asset, $force_type );

			elseif ( substr( $asset, 0, 0 ) == '/' ) :

				$this->_unload_absolute( $asset, $force_type );

			else :

				$this->{$_asset_type_method}( $asset, $force_type );

			endif;

		endforeach;
	}


	// --------------------------------------------------------------------------


	/**
	 * Unloads an asset supplied as a URL
	 * @param  string $asset      The asset's URL
	 * @param  string $force_type Forces a particular type (accepts values CSS or JS)
	 * @return void
	 */
	protected function _unload_url( $asset, $force_type = NULL )
	{
		$_type = $this->_determine_type( $asset, $force_type );

		switch ( $_type ) :

			case 'CSS' :	unset( $this->_css['URL-' . $asset] );	break;
			case 'JS' :		unset( $this->_js['URL-' . $asset] );	break;

		endswitch;
	}


	// --------------------------------------------------------------------------


	/**
	 * Unloads an asset supplied as an absolute URL
	 * @param  string $asset      The asset's absolute URL
	 * @param  string $force_type Forces a particular type (accepts values CSS or JS)
	 * @return void
	 */
	protected function _unload_absolute( $asset, $force_type = NULL )
	{
		$_type = $this->_determine_type( $asset, $force_type );

		switch ( $_type ) :

			case 'CSS' :	unset( $this->_css['ABSOLUTE-' . $asset] );	break;
			case 'JS' :		unset( $this->_js['ABSOLUTE-' . $asset] );	break;

		endswitch;
	}


	// --------------------------------------------------------------------------


	/**
	 * Unloads a Nails asset
	 * @param  string $asset      The asset's name
	 * @param  string $force_type Forces a particular type (accepts values CSS or JS)
	 * @return void
	 */
	protected function _unload_nails( $asset, $force_type = NULL )
	{
		$_type = $this->_determine_type( $asset, $force_type );

		switch ( $_type ) :

			case 'CSS' :	unset( $this->_css['NAILS-' . $asset] );	break;
			case 'JS' :		unset( $this->_js['NAILS-' . $asset] );	break;

		endswitch;
	}


	// --------------------------------------------------------------------------


	/**
	 * Unloads a Nails Bower asset
	 * @param  string $asset      The asset's name (as a relative url from NAILS_ASSETS_URL . 'bower_components/')
	 * @param  string $force_type Forces a particular type (accepts values CSS or JS)
	 * @return void
	 */
	protected function _unload_nails_bower( $asset, $force_type = NULL )
	{
		$_type = $this->_determine_type( $asset, $force_type );

		switch ( $_type ) :

			case 'CSS' :	unset( $this->_css['NAILS-BOWER-' . $asset] );	break;
			case 'JS' :		unset( $this->_js['NAILS-BOWER-' . $asset] );	break;

		endswitch;
	}


	// --------------------------------------------------------------------------


	/**
	 * Unloads a Nails package asset
	 * @param  string $asset      The asset's name (as a relative url from NAILS_ASSETS_URL . 'packages/')
	 * @param  string $force_type Forces a particular type (accepts values CSS or JS)
	 * @return void
	 */
	protected function _unload_nails_package( $asset, $force_type = NULL )
	{
		$_type = $this->_determine_type( $asset, $force_type );

		switch ( $_type ) :

			case 'CSS' :	unset( $this->_css['APP-' . $asset] );	break;
			case 'JS' :		unset( $this->_js['APP-' . $asset] );	break;

		endswitch;
	}


	// --------------------------------------------------------------------------


	/**
	 * Unloads an App Bower asset
	 * @param  string $asset      The asset's name (as a relative url from assets/bower_components)
	 * @param  string $force_type Forces a particular type (accepts values CSS or JS)
	 * @return void
	 */
	protected function _unload_app_bower( $asset, $force_type = NULL )
	{
		$_type = $this->_determine_type( $asset, $force_type );

		switch ( $_type ) :

			case 'CSS' :	unset( $this->_css['APP-BOWER-' . $asset] );	break;
			case 'JS' :		unset( $this->_js['APP-BOWER-' . $asset] );		break;

		endswitch;
	}


	// --------------------------------------------------------------------------


	/**
	 * Unloads an app asset
	 * @param  string $asset      The asset's name (as a relative url from assets/[css|js])
	 * @param  string $force_type Forces a particular type (accepts values CSS or JS)
	 * @return void
	 */
	protected function _unload_app( $asset, $force_type = NULL )
	{
		$_type = $this->_determine_type( $asset, $force_type );

		switch ( $_type ) :

			case 'CSS' :	unset( $this->_css['APP-' . $asset] );	break;
			case 'JS' :		unset( $this->_js['APP-' . $asset] );	break;

		endswitch;
	}


	// --------------------------------------------------------------------------


	/**
	 * Loads an inline asset
	 * @param  string $script     The inline asset to load, wrap in <script> tags for JS, or <style> tags for CSS
	 * @param  string $force_type Forces a particular type (accepts values CSS, JS, CSS_INLINE or JS_INLINE)
	 * @return void
	 */
	public function inline( $script = NULL, $force_type = NULL )
	{
		if ( empty( $script ) ) :

			return;

		endif;

		// --------------------------------------------------------------------------

		$_type = $this->_determine_type( $script, $force_type );

		switch ( $_type ) :

			case 'CSS' :
			case 'CSS-INLINE' :
			case 'CSS_INLINE' :	$this->_css_inline['INLINE-CSS-' . md5( $script )]	= $script;	break;
			case 'JS' :
			case 'JS-INLINE' :
			case 'JS_INLINE' :	$this->_js_inline['INLINE-JS-' . md5( $script )]	= $script;	break;

		endswitch;
	}


	// --------------------------------------------------------------------------


	/**
	 * Unloads an inline asset
	 * @param  string $script     The inline asset to load, wrap in <script> tags for JS, or <style> tags for CSS
	 * @param  string $force_type Alternatively specify the type as a string (accepts values CSS or JS)
	 * @return void
	 */
	public function unload_inline( $script = NULL, $force_type = NULL )
	{
		if ( empty( $script ) ) :

			return;

		endif;

		// --------------------------------------------------------------------------

		$_type = $this->_determine_type( $script, $force_type );

		switch ( $_type ) :

			case 'CSS' :
			case 'CSS_INLINE' :	unset( $this->_css_inline['INLINE-CSS-' . md5( $script )] );	break;
			case 'JS' :
			case 'JS_INLINE' :	unset( $this->_js_inline['INLINE-JS-' . md5( $script )] );		break;

		endswitch;
	}


	// --------------------------------------------------------------------------


	/**
	 * Loads a set of assets
	 * @param  string $library The library to load
	 * @return void
	 */
	public function library( $library )
	{
		switch( $library ) :

			case 'ckeditor' :

				$this->load( 'ckeditor/ckeditor.js',		'NAILS-BOWER' );
				$this->load( 'ckeditor/adapters/jquery.js',	'NAILS-BOWER' );

			break;

			// --------------------------------------------------------------------------

			case 'jqueryui' :

				$this->load( 'jquery-ui/jquery-ui.min.js',											'NAILS-BOWER' );
				$this->load( 'jquery-ui/themes/smoothness/jquery-ui.min.css',						'NAILS-BOWER' );
				$this->load( 'jquery.ui.extra.css',													'NAILS' );
				$this->load( 'jqueryui-timepicker-addon/dist/jquery-ui-timepicker-addon.min.js',	'NAILS-BOWER' );
				$this->load( 'jqueryui-timepicker-addon/dist/jquery-ui-timepicker-addon.css',		'NAILS-BOWER' );

			break;

			// --------------------------------------------------------------------------

			case 'uploadify' :

				$this->load( 'uploadify/uploadify.css',				'NAILS-PACKAGE' );
				$this->load( 'uploadify/jquery.uploadify.min.js',	'NAILS-PACKAGE' );

			break;

			// --------------------------------------------------------------------------

			case 'chosen' :

				$this->load( 'chosen/chosen.min.css',		'NAILS-BOWER' );
				$this->load( 'chosen/chosen.jquery.min.js',	'NAILS-BOWER' );

			break;

			// --------------------------------------------------------------------------

			case 'select2' :

				$this->load( 'select2/select2.css',		'NAILS-BOWER' );
				$this->load( 'select2/select2.min.js',	'NAILS-BOWER' );

			break;

		endswitch;
	}


	// --------------------------------------------------------------------------

	/**
	 * Clears all loaded assets
	 * @return void
	 */
	public function clear()
	{
		$this->_css			= array();
		$this->_css_inline	= array();
		$this->_js			= array();
		$this->_js_inline	= array();
	}


	// --------------------------------------------------------------------------


	/**
	 * Returns an object containing all oaded assets, useful for debugging.
	 * @return stdClass
	 */
	public function get_loaded()
	{
		$_loaded					= new stdClass();
		$_loaded->css				= $this->_css;
		$_loaded->css_inline		= $this->_css_inline;

		$_loaded->js				= $this->_js;
		$_loaded->js_inline			= $this->_js_inline;

		return $_loaded;
	}


	// --------------------------------------------------------------------------


	/**
	 * Out put the assets for HTML
	 * @param  string  $type   The type of assets to output/
	 * @param  boolean $return Return the string or send it to the browser.
	 * @return string
	 */
	public function output( $type = 'ALL', $return = FALSE )
	{
		$_out	= '';
		$_type	= strtoupper( $type );

		//	Linked Stylesheets
		if ( $_type == 'CSS' | $_type == 'ALL' ) :

			foreach ( $this->_css AS $asset ) :

				$_out .= link_tag( $asset ) . "\n";

			endforeach;

		endif;

		// --------------------------------------------------------------------------

		//	Linked JS
		if ( $_type == 'JS' | $_type == 'ALL' ) :

			foreach ( $this->_js AS $asset ) :

				$_out .= '<script type="text/javascript" src="' . $asset . '"></script>' . "\n";

			endforeach;

		endif;

		// --------------------------------------------------------------------------

		//	Inline CSS
		if ( $_type == 'CSS-INLINE' | $_type == 'ALL' ) :

			$_out .= '<style type="text/css">';
			foreach ( $this->_css_inline AS $asset ) :

				$_out .= preg_replace( '/<\/?style.*?>/si', '', $asset ) . "\n";

			endforeach;
			$_out .= '</style>';

		endif;

		// --------------------------------------------------------------------------

		//	Inline JS
		if ( $_type == 'JS-INLINE' | $_type == 'ALL' ) :

			$_out .= '<script type="text/javascript">';
			foreach ( $this->_js_inline AS $asset ) :

				$_out .= preg_replace( '/<\/?script.*?>/si', '', $asset );

			endforeach;
			$_out .= '</script>';

		endif;

		// --------------------------------------------------------------------------

		//	Force SSL for assets if running on non-standard port
		if ( isPageSecure() ) :

			$_out = str_replace( BASE_URL, SECURE_BASE_URL, $_out );

		endif;

		// --------------------------------------------------------------------------

		if ( $return ) :

			return $_out;

		else :

			echo $_out;

		endif;
	}


	// --------------------------------------------------------------------------


	/**
	 * Determines the type of asset being loaded
	 * @param  string $input      The asset being loaded
	 * @param  string $force_type Forces a particular type (accepts values CSS, JS, CSS_INLINE or JS_INLINE)
	 * @return string
	 */
	protected function _determine_type( $input, $force_type = NULL )
	{
		//	Override if nessecary
		if ( ! empty( $force_type ) ) :

			return $force_type;

		endif;

		// --------------------------------------------------------------------------

		//	Look for <style></style>
		if ( preg_match( '/\<style.*\<\/style\>/si', $input ) ) :

			return 'CSS_INLINE';

		endif;

		// --------------------------------------------------------------------------

		//	Look for <script></script>
		if ( preg_match( '/\<script.*\<\/script\>/si', $input ) ) :

			return 'JS_INLINE';

		endif;

		// --------------------------------------------------------------------------

		//	Look for .css
		if ( substr( $input, strrpos( $input, '.' ) ) == '.css' ) :

			return 'CSS';

		endif;

		// --------------------------------------------------------------------------

		//	Look for .js
		if ( substr( $input, strrpos( $input, '.' ) ) == '.js' ) :

			return 'JS';

		endif;
	}
}
