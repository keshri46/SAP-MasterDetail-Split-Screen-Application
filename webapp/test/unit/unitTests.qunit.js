/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"masterdetails/masterdetail/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
