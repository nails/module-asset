var NAILS_Admin_Export;
NAILS_Admin_Export = function () {
    /**
     * Avoid scope issues in callbacks and anonymous functions by referring to `this` as `base`
     * @type {Object}
     */
    var base = this;

    // --------------------------------------------------------------------------

    /**
     * Construct the class
     * @return {void}
     */
    base.__construct = function () {
        $('select[name=source]')
            .on('change', function () {
                var slug     = $(this).val();
                $('.js-options')
                    .addClass('hidden')
                    .filter('[data-slug="' + slug + '"]')
                    .removeClass('hidden');
            })
            .trigger('change');
    };

    // --------------------------------------------------------------------------

    return base.__construct();
}();
