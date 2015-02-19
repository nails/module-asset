var NAILS_Admin_Settings;
NAILS_Admin_Settings = function()
{
	var base = this;

	// --------------------------------------------------------------------------

	/**
	 * Construct the class
	 * @return {void}
	 */
	base.__construct = function()
	{
		base.setActiveTab();
	};

	// --------------------------------------------------------------------------

	/**
	 * Set the activeTab when a tab is clicked so that the same tab can be shown on POST
	 */
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
}();