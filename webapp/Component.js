sap.ui.define([
    "sap/ui/core/UIComponent",
    "masterdetails/model/models",
    "sap/ui/core/routing/History"
], (UIComponent, models, History) => {
    "use strict";

    return UIComponent.extend("masterdetails.Component", {
        metadata: {
            manifest: "json",
            "config": {
                "sapFiori2Adaptation": true,
                "fullWidth": true
            },
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
        },

        onNavBack(route) {
            const oHistory = History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo(route, {}, true);
            }
        }
    });
});