(function()
{
    var base  = this;

    // --------------------------------------------------------------------------

    base.template = $('#template-row').html();

    // --------------------------------------------------------------------------

    base.__construct = function()
    {
        $('#add').on('click', function(e){
            $('.redirect-table tbody tr:last').before(base.template);
            $('.select2').select2('destroy');
            $('.select2').select2();
            e.preventDefault();
        });

        $(document).on('click', '.delete',  function(e){
            $(e.target).closest('tr').remove();
            e.preventDefault();
        });
    };

    // --------------------------------------------------------------------------

    base.__construct();
})();
