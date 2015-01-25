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
    protected $css;
    protected $cssInline;
    protected $js;
    protected $jsInline;
    protected $cacheBuster;

    // --------------------------------------------------------------------------

    /**
     * Construct the library
     * @return  void
     **/
    public function __construct()
    {
        $this->CI          =& get_instance();
        $this->css         = array();
        $this->cssInline   = array();
        $this->js          = array();
        $this->jsInline    = array();
        $this->cacheBuster = defined('DEPLOY_REVISION') ? DEPLOY_REVISION : '';
    }

    // --------------------------------------------------------------------------

    /**
     * Loads an asset
     * @param  mixed  $assets    The asset to load, can be an array or a string
     * @param  string $assetType The asset's type
     * @param  string $forceType The asset's file type (e.g., JS or CSS)
     * @return void
     */
    public function load($assets, $assetType = 'APP', $forceType = null)
    {
        //  Cast as an array
        $assets = (array) $assets;

        // --------------------------------------------------------------------------

        //  Backwards compatibility
        $assetType = $assetType === true ? 'NAILS' : $assetType;

        // --------------------------------------------------------------------------

        switch (strtoupper($assetType)) {

            case 'NAILS':

                $assetTypeMethod = 'loadNails';
                break;

            case 'NAILS-BOWER':
            case 'BOWER':

                $assetTypeMethod = 'loadNailsBower';
                break;

            case 'NAILS-PACKAGE':

                $assetTypeMethod = 'loadNailsPackage';
                break;

            case 'APP-BOWER':

                $assetTypeMethod = 'loadAppBower';
                break;

            case 'APP':
            default:

                $assetTypeMethod = 'loadApp';
                break;
        }

        // --------------------------------------------------------------------------

        foreach ($assets as $asset) {

            if (preg_match('#^https?{//#', $asset)) {

                $this->loadUrl($asset, $forceType);

            } elseif (substr($asset, 0, 0) == '/') {

                $this->loadAbsolute($asset, $forceType);

            } else {

                $this->{$assetTypeMethod}($asset, $forceType);
            }
        }
    }

    // --------------------------------------------------------------------------

    /**
     * Loads an asset supplied as a URL
     * @param  string $asset     The asset to load
     * @param  string $forceType Force a particular type of asset (i.e. JS or CSS)
     * @return void
     */
    protected function loadUrl($asset, $forceType)
    {
        $type = $this->determineType($asset, $forceType);

        switch ($type) {

            case 'CSS':

                $this->css['URL-' . $asset] = $asset;
                break;

            case 'JS':

                $this->js['URL-' . $asset] = $asset;
                break;
        }
    }

    // --------------------------------------------------------------------------

    /**
     * Loads an asset supplied as an absolute URL
     * @param  string $asset     The asset to load
     * @param  string $forceType Force a particular type of asset (i.e. JS or CSS)
     * @return void
     */
    protected function loadAbsolute($asset, $forceType)
    {
        $type = $this->determineType($asset, $forceType);

        switch ($type) {

            case 'CSS':

                $this->css['ABSOLUTE-' . $asset] = site_url($asset);
                break;

            case 'JS':

                $this->js['ABSOLUTE-' . $asset] = site_url($asset);
                break;
        }
    }

    // --------------------------------------------------------------------------

    /**
     * Loads an asset from the Nails asset module
     * @param  string $asset     The asset to load
     * @param  string $forceType Force a particular type of asset (i.e. JS or CSS)
     * @return void
     */
    protected function loadNails($asset, $forceType = null)
    {
        $type = $this->determineType($asset, $forceType);

        switch ($type) {

            case 'CSS':

                $this->css['NAILS-' . $asset] = NAILS_ASSETS_URL . 'css/' . $asset;
                break;

            case 'JS':

                $this->js['NAILS-' . $asset] = NAILS_ASSETS_URL . 'js/' . $asset;
                break;
        }
    }

    // --------------------------------------------------------------------------

    /**
     * Loads a Bower asset from the NAils asset module's bower_components directory
     * @param  string $asset     The asset to load
     * @param  string $forceType Force a particular type of asset (i.e. JS or CSS)
     * @return void
     */
    protected function loadNailsBower($asset, $forceType = null)
    {
        $type = $this->determineType($asset, $forceType);

        switch ($type) {

            case 'CSS':

                $this->css['NAILS-BOWER-' . $asset] = NAILS_ASSETS_URL . 'bower_components/' . $asset;
                break;

            case 'JS':

                $this->js['NAILS-BOWER-' . $asset] = NAILS_ASSETS_URL . 'bower_components/' . $asset;
                break;
        }
    }

    // --------------------------------------------------------------------------

    /**
     * Loads a Nails package asset (as a relative url from NAILS_ASSETS_URL . 'packages/')
     * @param  string $asset     The asset to load
     * @param  string $forceType Force a particular type of asset (i.e. JS or CSS)
     * @return void
     */
    protected function loadNailsPackage($asset, $forceType = null)
    {
        $type = $this->determineType($asset, $forceType);

        switch ($type) {

            case 'CSS':

                $this->css['APP-' . $asset] = NAILS_ASSETS_URL . 'packages/' . $asset;
                break;

            case 'JS':

                $this->js['APP-' . $asset] = NAILS_ASSETS_URL . 'packages/' . $asset;
                break;
        }
    }

    // --------------------------------------------------------------------------

    /**
     * Loads a Bower asset from the app's bower_components directory
     * @param  string $asset     The asset to load
     * @param  string $forceType Force a particular type of asset (i.e. JS or CSS)
     * @return void
     */
    protected function loadAppBower($asset, $forceType = null)
    {
        $type = $this->determineType($asset, $forceType);

        switch ($type) {

            case 'CSS':

                $this->css['APP-BOWER-' . $asset] = site_url('assets/bower_components/' . $asset);
                break;

            case 'JS':

                $this->js['APP-BOWER-' . $asset] = site_url('assets/bower_components/' . $asset);
                break;
        }
    }

    // --------------------------------------------------------------------------

    /**
     * Loads an asset from the app's asset directory
     * @param  string $asset     The asset to load
     * @param  string $forceType Force a particular type of asset (i.e. JS or CSS)
     * @return void
     */
    protected function loadApp($asset, $forceType = null)
    {
        $type = $this->determineType($asset, $forceType);

        switch ($type) {

            case 'CSS':

                $this->css['APP-' . $asset] = site_url('assets/css/' . $asset);
                break;

            case 'JS':

                $this->js['APP-' . $asset] = site_url('assets/js/' . $asset);
                break;
        }
    }

    // --------------------------------------------------------------------------

    /**
     * Unloads an asset
     * @param  mixed  $assets    The asset to unload, can be an array or a string
     * @param  string $assetType The asset's type
     * @param  string $forceType The asset's file type (e.g., JS or CSS)
     * @return void
     */
    public function unload($assets, $assetType = 'APP', $forceType = null)
    {
        //  Cast as an array
        $assets = (array) $assets;

        // --------------------------------------------------------------------------

        //  Backwards compatibility
        $assetType = $assetType === true ? 'NAILS' : $assetType;

        // --------------------------------------------------------------------------

        switch (strtoupper($assetType)) {

            case 'NAILS':

                $assetTypeMethod = 'unloadNails';
                break;

            case 'NAILS-BOWER':
            case 'BOWER':

                $assetTypeMethod = 'unloadNailsBower';
                break;

            case 'NAILS-PACKAGE':

                $assetTypeMethod = 'unloadNailsPackage';
                break;

            case 'APP-BOWER':

                $assetTypeMethod = 'unloadAppBower';
                break;

            case 'APP':
            default:

                $assetTypeMethod = 'unloadApp';
                break;
        }

        // --------------------------------------------------------------------------

        foreach ($assets as $asset) {

            if (preg_match('#^https?://#', $asset)) {

                $this->unloadUrl($asset, $forceType);

            } elseif (substr($asset, 0, 0) == '/') {

                $this->unloadAbsolute($asset, $forceType);

            } else {

                $this->{$assetTypeMethod}($asset, $forceType);
            }
        }
    }

    // --------------------------------------------------------------------------

    /**
     * Unloads an asset supplied as a URL
     * @param  string $asset     The asset to unload
     * @param  string $forceType Force a particular type of asset (i.e. JS or CSS)
     * @return void
     */
    protected function unloadUrl($asset, $forceType = null)
    {
        $type = $this->determineType($asset, $forceType);

        switch ($type) {

            case 'CSS':

                unset($this->css['URL-' . $asset]);
                break;

            case 'JS':

                unset($this->js['URL-' . $asset]);
                break;
        }
    }

    // --------------------------------------------------------------------------

    /**
     * Unloads an asset supplied as an absolute URL
     * @param  string $asset     The asset to unload
     * @param  string $forceType Force a particular type of asset (i.e. JS or CSS)
     * @return void
     */
    protected function unloadAbsolute($asset, $forceType = null)
    {
        $type = $this->determineType($asset, $forceType);

        switch ($type) {

            case 'CSS':

                unset($this->css['ABSOLUTE-' . $asset]);
                break;

            case 'JS':

                unset($this->js['ABSOLUTE-' . $asset]);
                break;
        }
    }

    // --------------------------------------------------------------------------

    /**
     * Unloads an asset from the Nails asset module
     * @param  string $asset     The asset to unload
     * @param  string $forceType Force a particular type of asset (i.e. JS or CSS)
     * @return void
     */
    protected function unloadNails($asset, $forceType = null)
    {
        $type = $this->determineType($asset, $forceType);

        switch ($type) {

            case 'CSS':

                unset($this->css['NAILS-' . $asset]);
                break;

            case 'JS':

                unset($this->js['NAILS-' . $asset]);
                break;
        }
    }

    // --------------------------------------------------------------------------

    /**
     * Loads a Bower asset from the NAils asset module's bower_components directory
     * @param  string $asset     The asset to unload
     * @param  string $forceType Force a particular type of asset (i.e. JS or CSS)
     * @return void
     */
    protected function unloadNailsBower($asset, $forceType = null)
    {
        $type = $this->determineType($asset, $forceType);

        switch ($type) {

            case 'CSS':

                unset($this->css['NAILS-BOWER-' . $asset]);
                break;

            case 'JS':

                unset($this->js['NAILS-BOWER-' . $asset]);
                break;
        }
    }

    // --------------------------------------------------------------------------

    /**
     * Unloads a Nails package asset (as a relative url from NAILS_ASSETS_URL . 'packages/')
     * @param  string $asset     The asset to unload
     * @param  string $forceType Force a particular type of asset (i.e. JS or CSS)
     * @return void
     */
    protected function unloadNailsPackage($asset, $forceType = null)
    {
        $type = $this->determineType($asset, $forceType);

        switch ($type) {

            case 'CSS':

                unset($this->css['APP-' . $asset]);
                break;

            case 'JS':

                unset($this->js['APP-' . $asset]);
                break;
        }
    }

    // --------------------------------------------------------------------------

    /**
     * Unloads a Bower asset from the app's bower_components directory
     * @param  string $asset     The asset to unload
     * @param  string $forceType Force a particular type of asset (i.e. JS or CSS)
     * @return void
     */
    protected function unloadAppBower($asset, $forceType = null)
    {
        $type = $this->determineType($asset, $forceType);

        switch ($type) {

            case 'CSS':

                unset($this->css['APP-BOWER-' . $asset]);
                break;

            case 'JS':

                unset($this->js['APP-BOWER-' . $asset]);
                break;
        }
    }

    // --------------------------------------------------------------------------

    /**
     * Unloads an asset from the app's asset directory
     * @param  string $asset     The asset to unload
     * @param  string $forceType Force a particular type of asset (i.e. JS or CSS)
     * @return void
     */
    protected function unloadApp($asset, $forceType = null)
    {
        $type = $this->determineType($asset, $forceType);

        switch ($type) {

            case 'CSS':

                unset($this->css['APP-' . $asset]);
                break;

            case 'JS':

                unset($this->js['APP-' . $asset]);
                break;
        }
    }

    // --------------------------------------------------------------------------

    /**
     * Loads an inline asset
     * @param  string $script    The inline asset to load, wrap in <script> tags for JS, or <style> tags for CSS
     * @param  string $forceType Force a particular type of asset (i.e. JS or CSS)
     * @return void
     */
    public function inline($script = null, $forceType = null)
    {
        if (empty($script)) {

            return;
        }

        // --------------------------------------------------------------------------

        $type = $this->determineType($script, $forceType);

        switch ($type) {

            case 'CSS':

                $this->cssInline['INLINE-CSS-' . md5($script)] = $script;
                break;

            case 'JS':

                $this->jsInline['INLINE-JS-' . md5($script)] = $script;
                break;
        }
    }

    // --------------------------------------------------------------------------

    /**
     * Unloads an inline asset
     * @param  string $script    The inline asset to load, wrap in <script> tags for JS, or <style> tags for CSS
     * @param  string $forceType Force a particular type of asset (i.e. JS or CSS)
     * @return void
     */
    public function unloadInline($script = null, $forceType = null)
    {
        if (empty($script)) {

            return;
        }

        // --------------------------------------------------------------------------

        $type = $this->determineType($script, $forceType);

        switch ($type) {

            case 'CSS':

                unset($this->cssInline['INLINE-CSS-' . md5($script)]);
                break;

            case 'JS':

                unset($this->jsInline['INLINE-JS-' . md5($script)]);
                break;
        }
    }

    // --------------------------------------------------------------------------

    /**
     * Loads a set of assets
     * @param  string $library The library to load
     * @return void
     */
    public function library($library)
    {
        switch (strtoupper($library)) {

            case 'CKEDITOR':

                $this->load('ckeditor/ckeditor.js', 'NAILS-BOWER');
                $this->load('ckeditor/adapters/jquery.js', 'NAILS-BOWER');
                break;

            case 'JQUERYUI':

                $this->load('jquery-ui/jquery-ui.min.js', 'NAILS-BOWER');
                $this->load('jquery-ui/themes/smoothness/jquery-ui.min.css', 'NAILS-BOWER');
                $this->load('jquery.ui.extra.css', 'NAILS');
                $this->load('jqueryui-timepicker-addon/dist/jquery-ui-timepicker-addon.min.js', 'NAILS-BOWER');
                $this->load('jqueryui-timepicker-addon/dist/jquery-ui-timepicker-addon.css', 'NAILS-BOWER');
                break;

            case 'UPLOADIFY':

                $this->load('uploadify/uploadify.css', 'NAILS-PACKAGE');
                $this->load('uploadify/jquery.uploadify.min.js', 'NAILS-PACKAGE');
                break;

            case 'CHOSEN':

                $this->load('chosen/chosen.min.css', 'NAILS-BOWER');
                $this->load('chosen/chosen.jquery.min.js', 'NAILS-BOWER');
                break;

            case 'SELECT2':

                $this->load('select2/select2.css', 'NAILS-BOWER');
                $this->load('select2/select2.min.js', 'NAILS-BOWER');
                break;
        }
    }

    // --------------------------------------------------------------------------

    /**
     * Clears all loaded assets
     * @return void
     */
    public function clear()
    {
        $this->css       = array();
        $this->cssInline = array();
        $this->js        = array();
        $this->jsInline  = array();
    }

    // --------------------------------------------------------------------------

    /**
     * Returns an object containing all loaded assets, useful for debugging.
     * @return stdClass
     */
    public function getLoaded()
    {
        $loaded            = new stdClass();
        $loaded->css       = $this->css;
        $loaded->cssInline = $this->cssInline;
        $loaded->js        = $this->js;
        $loaded->jsInline  = $this->jsInline;

        return $loaded;
    }

    // --------------------------------------------------------------------------

    /**
     * Output the assets for HTML
     * @param  string  $type   The type of asset to output
     * @param  boolean $return whether to output to the browser or to return as a string
     * @return string
     */
    public function output($type = 'ALL', $return = false)
    {
        $out  = '';
        $type = strtoupper($type);

        //  Linked Stylesheets
        if ($type == 'CSS' | $type == 'ALL') {

            foreach ($this->css as $asset) {

                $asset = $this->addCacheBuster($asset);
                $out .= link_tag($asset) . "\n";
            }
        }

        // --------------------------------------------------------------------------

        //  Linked JS
        if ($type == 'JS' | $type == 'ALL') {

            foreach ($this->js as $asset) {

                $asset = $this->addCacheBuster($asset);
                $out .= '<script type="text/javascript" src="' . $asset . '"></script>' . "\n";
            }
        }

        // --------------------------------------------------------------------------

        //  Inline CSS
        if ($type == 'CSS-INLINE' | $type == 'ALL') {

            $out .= '<style type="text/css">';
            foreach ($this->cssInline as $asset) {

                $out .= preg_replace('/<\/?style.*?>/si', '', $asset) . "\n";
            }
            $out .= '</style>';
        }

        // --------------------------------------------------------------------------

        //  Inline JS
        if ($type == 'JS-INLINE' | $type == 'ALL') {

            $out .= '<script type="text/javascript">';
            foreach ($this->jsInline as $asset) {

                $out .= preg_replace('/<\/?script.*?>/si', '', $asset);
            }
            $out .= '</script>';
        }

        // --------------------------------------------------------------------------

        //  Force SSL for assets if page is secure
        if (isPageSecure()) {

            $out = str_replace(BASE_URL, SECURE_BASE_URL, $out);
        }

        // --------------------------------------------------------------------------

        if ($return) {

            return $out;

        } else {

            echo $out;
        }
    }

    // --------------------------------------------------------------------------

    /**
     * Appends the cacheBuster string to the asset name, accounts for existing query strings
     * @param string $asset The asset's url to append
     */
    protected function addCacheBuster($asset)
    {
        if ($this->cacheBuster) {

            $parsedUrl = parse_url($asset);

            if (empty($parsedUrl['query'])) {

                $asset .= '?';

            } else {

                $asset .= '&';
            }

            $asset .= 'revision=' . $this->cacheBuster;
        }

        return $asset;
    }

    // --------------------------------------------------------------------------

    /**
     * Determines the type of asset being loaded
     * @param  string $asset     The asset being loaded
     * @param  string $forceType Forces a particular type (accepts values CSS, JS, CSS-INLINE or JS-INLINE)
     * @return string
     */
    protected function determineType($asset, $forceType = null)
    {
        //  Override if nessecary
        if (!empty($forceType)) {

            return $forceType;
        }

        // --------------------------------------------------------------------------

        //  Look for <style></style>
        if (preg_match('/\<style.*?\<\/style\>/si', $asset)) {

            return 'CSS-INLINE';
        }

        // --------------------------------------------------------------------------

        //  Look for <script></script>
        if (preg_match('/\<script.*?\<\/script\>/si', $asset)) {

            return 'JS-INLINE';
        }

        // --------------------------------------------------------------------------

        //  Look for .css
        if (substr($asset, strrpos($asset, '.')) == '.css') {

            return 'CSS';
        }

        // --------------------------------------------------------------------------

        //  Look for .js
        if (substr($asset, strrpos($asset, '.')) == '.js') {

            return 'JS';
        }
    }
}
