var NAILS_Admin_Accounts_Merge;
NAILS_Admin_Accounts_Merge = function()
{
    this.__construct = function()
    {
        //  Construct searchers
        $('#userId').select2({
            placeholder: "Search for a user",
            minimumInputLength: 1,
            ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
                url: window.SITE_URL + 'api/admin/users/search',
                dataType: 'json',
                quietMillis: 250,
                data: function (term) {
                    return {
                        term: term, // search term
                    };
                },
                results: function (data) { // parse the results into the format expected by Select2.
                    // since we are using custom formatting functions we do not need to alter the remote JSON data
                    console.log(data);

                    var returnData = {results:[]};
                    var userId = '';
                    var userName = '';

                    for(var key in data.users) {

                        userId = data.users[key].id;
                        userName = '#' + userId + ' - ' + data.users[key].first_name + ' ' + data.users[key].last_name;

                        returnData.results.push({'text' : userName, 'id' : userId});
                    }

                    return returnData;
                },
                cache: true
            }
        });

        $('#mergeIds').select2({
            placeholder: "Search for a user",
            minimumInputLength: 1,
            multiple:true,
            ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
                url: window.SITE_URL + 'api/admin/users/search',
                dataType: 'json',
                quietMillis: 250,
                data: function (term) {
                    return {
                        term: term, // search term
                    };
                },
                results: function (data) { // parse the results into the format expected by Select2.
                    // since we are using custom formatting functions we do not need to alter the remote JSON data
                    console.log(data);

                    var returnData = {results:[]};
                    var userId = '';
                    var userName = '';

                    for(var key in data.users) {

                        userId = data.users[key].id;
                        userName = '#' + userId + ' - ' + data.users[key].first_name + ' ' + data.users[key].last_name;

                        returnData.results.push({'text' : userName, 'id' : userId});
                    }

                    return returnData;
                },
                cache: true
            }
        });
    };

    // --------------------------------------------------------------------------

    return this.__construct();
};