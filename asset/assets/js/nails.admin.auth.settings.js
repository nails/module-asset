var NAILS_Admin_Auth_Settings;
NAILS_Admin_Auth_Settings = function()
{
	var base = this;

	// --------------------------------------------------------------------------

	base.__construct = function()
	{
		base.setActiveTab();
	};

	// --------------------------------------------------------------------------

	base.setActiveTab = function()
	{
		$('ul.tabs a').on('click', function()
		{
			var tab = $(this).data('tab');
			$('#activeTab').val(tab);
		});
	};

	// --------------------------------------------------------------------------

	return base.__construct();
};