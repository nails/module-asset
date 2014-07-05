<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
* Name:			Asset
*
* Description:	A Library to make the loading (and unloading) of CSS and JS assets a breeze
*
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

		$asset_type = $asset_type === TRUE ? 'NAILS' : $asset_type;

		// --------------------------------------------------------------------------

		switch ( strtoupper( $asset_type ) ) :

			case 'NAILS' :			$this->_load_nails( $assets, $force_type );				break;
			case 'NAILS-BOWER' :
			case 'BOWER' :			$this->_load_nails_bower( $assets, $force_type );		break;
			case 'NAILS-PACKAGE' :	$this->_load_nails_package( $assets, $force_type );		break;
			case 'APP-BOWER' :		$this->_load_app_bower( $assets, $force_type );			break;
			case 'APP' :
			default :				$this->_load_app( $assets, $force_type );				break;

		endswitch;
	}


	// --------------------------------------------------------------------------


	/**
	 * Load a Nails asset
	 *
 	 * @access	protected
	 * @param array $assets An array of assets to load
	 * @return void
	 **/
	protected function _load_nails( $assets, $force_type = NULL )
	{
		foreach ( $assets AS $asset ) :

			$_type = $this->_determine_type( $asset, $force_type );

			switch ( $_type ) :

				case 'CSS' :	$this->_css['NAILS-' . $asset]	= NAILS_ASSETS_URL . 'css/' . $asset;	break;
				case 'JS' :		$this->_js['NAILS-' . $asset]	= NAILS_ASSETS_URL . 'js/' . $asset;	break;

			endswitch;

		endforeach;
	}


	// --------------------------------------------------------------------------


	/**
	 * Load a Nails bower asset
	 *
	 * @access	protected
	 * @param array $assets An array of assets to load
	 * @return void
	 **/
	protected function _load_nails_bower( $assets, $force_type = NULL )
	{
		foreach ( $assets AS $asset ) :

			$_type = $this->_determine_type( $asset, $force_type );

			switch ( $_type ) :

				case 'CSS' :	$this->_css['NAILS-BOWER-' . $asset]	= NAILS_ASSETS_URL . 'bower_components/' . $asset;	break;
				case 'JS' :		$this->_js['NAILS-BOWER-' . $asset]		= NAILS_ASSETS_URL . 'bower_components/' . $asset;	break;

			endswitch;

		endforeach;
	}


	// --------------------------------------------------------------------------


	/**
	 * Load a Nails package asset
	 *
	 * @access	protected
	 * @param array $assets An array of assets to load
	 * @return void
	 **/
	protected function _load_nails_package( $assets, $force_type = NULL )
	{
		foreach ( $assets AS $asset ) :

			$_type = $this->_determine_type( $asset, $force_type );

			switch ( $_type ) :

				case 'CSS' :	$this->_css['APP-' . $asset]	= NAILS_ASSETS_URL . 'packages/' . $asset;	break;
				case 'JS' :		$this->_js['APP-' . $asset]		= NAILS_ASSETS_URL . 'packages/' . $asset;	break;

			endswitch;

		endforeach;
	}


	// --------------------------------------------------------------------------


	/**
	 * Load an App bower asset
	 *
	 * @access	protected
	 * @param array $assets An array of assets to load
	 * @return void
	 **/
	protected function _load_app_bower( $assets, $force_type = NULL )
	{
		foreach ( $assets AS $asset ) :

			$_type = $this->_determine_type( $asset, $force_type );

			switch ( $_type ) :

				case 'CSS' :	$this->_css['APP-BOWER-' . $asset]	= 'assets/bower_components/' . $asset;	break;
				case 'JS' :		$this->_js['APP-BOWER-' . $asset]	= 'assets/bower_components/' . $asset;	break;

			endswitch;

		endforeach;
	}


	// --------------------------------------------------------------------------


	/**
	 * Load an app asset
	 *
 	 * @access	protected
	 * @param array $assets An array of assets to load
	 * @return void
	 **/
	protected function _load_app( $assets, $force_type = NULL )
	{
		foreach ( $assets AS $asset ) :

			$_type = $this->_determine_type( $asset, $force_type );

			switch ( $_type ) :

				case 'CSS' :	$this->_css['APP-' . $asset]	= site_url( 'assets/css/' . $asset );	break;
				case 'JS' :		$this->_js['APP-' . $asset]		= site_url( 'assets/js/' . $asset );	break;

			endswitch;

		endforeach;
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

		switch ( strtoupper( $asset_type ) ) :

			case TRUE :
			case 'NAILS' :			$this->_unload_nails( $assets, $force_type );			break;
			case 'NAILS-BOWER' :
			case 'BOWER' :			$this->_unload_nails_bower( $assets, $force_type );		break;
			case 'NAILS-PACKAGE' :	$this->_unload_nails_package( $assets, $force_type );	break;
			case 'APP-BOWER' :		$this->_unload_app_bower( $assets, $force_type );		break;
			case 'APP' :
			default :				$this->_unload_app( $assets, $force_type );				break;

		endswitch;
	}


	// --------------------------------------------------------------------------


	/**
	 * Load a Nails asset
	 *
 	 * @access	protected
	 * @param array $assets An array of assets to load
	 * @return void
	 **/
	protected function _unload_nails( $assets, $force_type = NULL )
	{
		foreach ( $assets AS $asset ) :

			$_type = $this->_determine_type( $asset, $force_type );

			switch ( $_type ) :

				case 'CSS' :	unset( $this->_css['NAILS-' . $asset] );	break;
				case 'JS' :		unset( $this->_js['NAILS-' . $asset] );	break;

			endswitch;

		endforeach;
	}


	// --------------------------------------------------------------------------


	/**
	 * Load a Nails bower asset
	 *
	 * @access	protected
	 * @param array $assets An array of assets to load
	 * @return void
	 **/
	protected function _unload_nails_bower( $assets, $force_type = NULL )
	{
		foreach ( $assets AS $asset ) :

			$_type = $this->_determine_type( $asset, $force_type );

			switch ( $_type ) :

				case 'CSS' :	unset( $this->_css['NAILS-BOWER-' . $asset] );	break;
				case 'JS' :		unset( $this->_js['NAILS-BOWER-' . $asset] );	break;

			endswitch;

		endforeach;
	}


	// --------------------------------------------------------------------------


	/**
	 * Load a Nails package asset
	 *
	 * @access	protected
	 * @param array $assets An array of assets to load
	 * @return void
	 **/
	protected function _unload_nails_package( $assets, $force_type = NULL )
	{
		foreach ( $assets AS $asset ) :

			$_type = $this->_determine_type( $asset, $force_type );

			switch ( $_type ) :

				case 'CSS' :	unset( $this->_css['APP-' . $asset] );	break;
				case 'JS' :		unset( $this->_js['APP-' . $asset] );	break;

			endswitch;

		endforeach;
	}


	// --------------------------------------------------------------------------


	/**
	 * Load an App bower asset
	 *
	 * @access	protected
	 * @param array $assets An array of assets to load
	 * @return void
	 **/
	protected function _unload_app_bower( $assets, $force_type = NULL )
	{
		foreach ( $assets AS $asset ) :

			$_type = $this->_determine_type( $asset, $force_type );

			switch ( $_type ) :

				case 'CSS' :	unset( $this->_css['APP-BOWER-' . $asset] );	break;
				case 'JS' :		unset( $this->_js['APP-BOWER-' . $asset] );		break;

			endswitch;

		endforeach;
	}


	// --------------------------------------------------------------------------


	/**
	 * Load an app asset
	 *
 	 * @access	protected
	 * @param array $assets An array of assets to load
	 * @return void
	 **/
	protected function _unload_app( $assets, $force_type = NULL )
	{
		foreach ( $assets AS $asset ) :

			$_type = $this->_determine_type( $asset, $force_type );

			switch ( $_type ) :

				case 'CSS' :	unset( $this->_css['APP-' . $asset] );	break;
				case 'JS' :		unset( $this->_js['APP-' . $asset] );	break;

			endswitch;

		endforeach;
	}


	// --------------------------------------------------------------------------


	/**
	 * Load an inline asset
	 *
	 * @access	public
	 * @param	string
	 * @return	void
	 **/
	public function inline( $script = NULL, $force_type = NULL )
	{
		if ( empty( $script ) ) :

			return;

		endif;

		// --------------------------------------------------------------------------

		$_type = $this->_determine_type( $script, $force_type );

		switch ( $_type ) :

			case 'CSS' :
			case 'CSS_INLINE' :	$this->_css_inline['INLINE-CSS-' . md5( $script )]	= $script;	break;
			case 'JS' :
			case 'JS_INLINE' :	$this->_js_inline['INLINE-JS-' . md5( $script )]	= $script;	break;

		endswitch;
	}


	// --------------------------------------------------------------------------


	/**
	 * Unload an inline asset
	 *
	 * @access	public
	 * @param	string
	 * @return	void
	 **/
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
	 * Load a library (collection of assets)
	 *
	 * @access	public
	 * @param	string
	 * @return	void
	 **/
	public function library( $library )
	{
		switch( $library ) :

			case 'ckeditor' :

				$this->load( 'ckeditor/ckeditor.js',		'NAILS-BOWER' );
				$this->load( 'ckeditor/adapters/jquery.js',	'NAILS-BOWER' );

			break;

			// --------------------------------------------------------------------------

			case 'jqueryui' :

				$this->load( 'jquery-ui/ui/minified/jquery-ui.min.js',								'NAILS-BOWER' );
				$this->load( 'jqueryui-timepicker-addon/dist/jquery-ui-timepicker-addon.min.js',	'NAILS-BOWER' );
				$this->load( 'jquery-ui/themes/base/minified/jquery-ui.min.css',					'NAILS-BOWER' );
				$this->load( 'jqueryui-timepicker-addon/dist/jquery-ui-timepicker-addon.css',		'NAILS-BOWER' );
				$this->load( 'jquery.ui.extra.css',													'NAILS' );

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
	 * Clear loaded assets
	 *
	 * @access	public
	 * @return	void
	 **/
	public function clear()
	{
		$this->_css			= array();
		$this->_css_inline	= array();
		$this->_js			= array();
		$this->_js_inline	= array();
	}


	// --------------------------------------------------------------------------


	/**
	 * Return an object with the currently loaded objects, useful for debugging
	 *
	 * @access	public
	 * @return	object
	 **/
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
	 * Output the assets for HTML
	 *
	 * @access	public
	 * @param	string
	 * @param	boolean
	 * @return	object
	 **/
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
		if ( page_is_secure() ) :

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
	 * Determine the type of asset being loaded
	 *
	 * @access	protected
	 * @param	string
	 * @param	string
	 * @return	string
	 **/
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

/* End of file asset.php */
/* Location: ./application/libraries/asset.php */