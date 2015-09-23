var NAILS_Admin_CMS_Pages;
NAILS_Admin_CMS_Pages = function()
{
    /**
     * Avoid scope issues in callbacks and anonymous functions by referring to `this` as `base`
     * @type {Object}
     */
    var base = this;

    // --------------------------------------------------------------------------

    /**
     * Construct the CMS Pages index page
     * @return {void}
     */
    base.__construct = function()
    {
        $('.search-text input').on('keyup', function()
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
        $('tr.page').each(function()
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

    return base.__construct();
};