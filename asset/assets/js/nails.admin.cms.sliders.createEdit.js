var NAILS_Admin_CMS_Sliders_Create_Edit;
NAILS_Admin_CMS_Sliders_Create_Edit = function()
{
    var base = this;

    // --------------------------------------------------------------------------

    base.__construct = function()
    {
        $('#addSlide').on('click', function()
        {
            base.addSlide();
            return false;
        });

        $(document).on('click', '.setImg, .changeImg', function()
        {
            alert('set/change Img');
            return false;
        });

        $('#slides tbody').sortable({
            handle: '.sortHandle',
            axis:'y',
            start: function(e, ui)
            {
                ui.placeholder.height(ui.helper.outerHeight());
            },
        });
    };

    // --------------------------------------------------------------------------

    base.addSlides = function(slides)
    {
        for (var key in slides) {
            base.addSlide(slides[key]);
        }
    };

    // --------------------------------------------------------------------------

    base.addSlide = function(slide)
    {
        var html;

        html = $('#templateSlideRow').html();
        html = Mustache.render(html, slide);

        $('#slides tbody').append(html);

        /**
         * Fix the width of the flexible table cells. We do this so that when sorting
         * the row doesn't collapse.
         */

        base.fixCellWidth();
    };

    // --------------------------------------------------------------------------

    base.fixCellWidth = function()
    {
        //  Remove all inline styles
        $('#slides tbody tr td.caption').removeAttr('style');

        //  Recalculate, account for right border
        var width = $('#slides tbody tr td.caption:first').outerWidth() - 1;

        //  Reset styles
        $('#slides tbody tr td.caption').css('width', width);
    };

    // --------------------------------------------------------------------------

    return base.__construct();
};