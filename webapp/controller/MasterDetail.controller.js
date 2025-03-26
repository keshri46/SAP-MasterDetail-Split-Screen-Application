sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/syncStyleClass",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/BusyDialog",
    "sap/ui/Device",
    "sap/base/Log"
], function (Controller, JSONModel, Fragment, syncStyleClass, FilterOperator, Filter, MessageBox, MessageToast, BusyDialog, Device, Log) {
    "use strict";
    var that, oView;
    return Controller.extend("masterdetails.controller.MasterDetail", {

        onInit: function () {
            this.getSplitAppObj().setHomeIcon({
                'phone': 'phone-icon.png',
                'tablet': 'tablet-icon.png',
                'icon': 'desktop.ico'
            });
            Device.orientation.attachHandler(this.onOrientationChange, this);

            that = this;
            oView = that.getView();
            that.i18nBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();
            //oView.byId("tabTitle").setText(that.i18nBundle.getText("purOrder", 0));

            // Model for the search data
            var oOrdersModel = new JSONModel();
            oView.setModel(oOrdersModel, "OrdersModel");

            var oFormModel = new JSONModel([]);
            oView.setModel(oFormModel, "oFormModel");

            this.aSearchFields = [
                "CustomerID",
                // "OrderDate",
                "ShipVia",
                "ShipName",
                "ShipAddress",
                "ShipCity",
                "OrderID",
                "ShipCountry"
            ];

            that.oRouter = that.getOwnerComponent().getRouter();
            that.oRouter.getRoute("RouteMasterDetail").attachPatternMatched(that.onAppRouteMatched, that);
        },
        onAppRouteMatched: function () {
            that.loadNorthwindData();
        },
        loadNorthwindData: function () {
            // debugger;
            var oModel = that.getOwnerComponent().getModel();
            var sPath = "/Orders";
            var oBusyDialog = new BusyDialog();
            oBusyDialog.open();
            oModel.read(sPath, {
                success: function (oData) {
                    console.log("Success");
                    console.log(oData);
                    let res = oData.results.map(function (val) {
                        val.OrderID = String(val.OrderID);
                        val.ShipVia = String(val.ShipVia);
                        val.EmployeeID = String(val.EmployeeID);
                        val.isNew = false;
                        return val;
                    });
                    oView.getModel("oFormModel").setData(oData.results);
                    oView.getModel("oFormModel").refresh();
                    // oView.byId("tabTitle").setText(that.i18nBundle.getText("purOrder", res.length));
                    oView.getModel("OrdersModel").setData(res);
                    oView.getModel("OrdersModel").setSizeLimit(1000);
                    oView.getModel("OrdersModel").refresh();
                    that.currentOrderPath = 0;
                    that.currentOrder = oView.getModel("oFormModel").getData()[0];
                    that.bindElement();
                    oBusyDialog.close();
                },
                error: function (oerror) {
                    oBusyDialog.close();
                    console.log("error");
                }
            });
        },
        bindElement: function () {
            // oView.byId("FormDisplay354wideDual").setModel(oView.getModel("oFormModel"));
            // oView.byId("FormDisplay354wideDual").bindElement({ path: "/"+that.currentOrderPath, model: "oFormModel" });
            // debugger;
            this.getSplitAppObj().toDetail(this.createId("detailpage"));
            that.detailPageView = this.getView().byId("detailpage");
            that.detailPageView.setTitle("OrderID - " + that.currentOrder.OrderID);
            this.getView().byId("detailpage").setModel(oView.getModel("oFormModel"), "oFormModel");

            console.log("Binding to index:", that.currentOrderPath);
            that.detailPageView.unbindElement();
            that.detailPageView.bindElement({
                path: "/" + that.currentOrderPath,
                model: "oFormModel"
            });

            this._formFragments = {};

            // Set the initial .36form to be the display one
            this._showFormFragment("Display");
        },
        onPressGoToOrderMaster: function () {
            this.getSplitAppObj().toMaster(this.createId("ordermaster"));
        },
        onPressGoToCustomerMaster : function () {
            // this.getSplitAppObj().toMaster(this.createId("ordermaster"));
        },
        onPressGoToProductMaster : function () {
            // this.getSplitAppObj().toMaster(this.createId("ordermaster"));
        },
        onPressGoToSupplierMaster : function () {
            // this.getSplitAppObj().toMaster(this.createId("ordermaster"));
        },
        onPressGoToShipperMaster : function () {
            // this.getSplitAppObj().toMaster(this.createId("ordermaster"));
        },
        onPressMasterBack: function () {
            this.getSplitAppObj().backMaster();
        },
        onListItemPress: function (oEvent) {
            var oSelectedItem = oEvent.getSource();
            var oContext = oSelectedItem.getBindingContext("OrdersModel");

            var sPath = oContext.getPath();
            var oSelectedOrder = oContext.getModel().getProperty(sPath);

            var sPath2 = oSelectedItem.getBindingContextPath();
            var oSelectedOrder2 = oView.getModel("OrdersModel").getProperty(sPath);

            that.currentOrderPath = sPath2.replace('/', '');
            that.currentOrder = oSelectedOrder2;

            // console.log(oSelectedItem);
            // console.log(oContext);
            // console.log(sPath);
            // console.log(oSelectedOrder);
            // console.log(sPath2);
            // console.log(oSelectedOrder2);

            // Now, you have the selected order's data (oSelectedOrder).
            // Navigate to the detail page and pass the order data.
            //this.getSplitAppObj().toDetail(this.createId("detail"));
            //You can pass the data to the detail page here, for example by setting it to a model
            //var oDetailModel = new JSONModel(oSelectedOrder);
            //this.getView().byId("detail").setModel(oDetailModel, "detailModel");
            //this.getView().byId("detail").setTitle("OrderID - " + oSelectedOrder.OrderID);
            //this.getView().byId("detail").getContent()[0].setText(JSON.stringify(oSelectedOrder.CustomerID));

            that.displayOrderDetails();
        },
        displayOrderDetails : function(){
            this.getView().byId("detailpage").setTitle("OrderID - " + that.currentOrder.OrderID);

            that.detailPageView.unbindElement();
            that.detailPageView.bindElement({
                path: "/" + that.currentOrderPath,
                model: "oFormModel"
            });
        },
        onExit: function () {
            Device.orientation.detachHandler(this.onOrientationChange, this);
        },
        onOrientationChange: function (mParams) {
            var sMsg = "Orientation now is: " + (mParams.landscape ? "Landscape" : "Portrait");
            MessageToast.show(sMsg, { duration: 5000 });
        },
        getSplitAppObj: function () {
            var result = this.byId("SplitAppDemo");
            if (!result) {
                Log.info("SplitApp object can't be found");
            }
            return result;
        },
        onP: function () {
            MessageToast.show("Clicked ", { duration: 5000 });
        },
        searchOrder: function (oEvent) {
            // Implement search logic here
        },
        onSearchOrderLiveChange: function (oEvent) {
            // Implement live change search logic here
        },
        onValueHelpRequestOrder: function (oEvent) {
            // Implement value help logic here
        },
        onAddNewOrder: function (oEvent) {
            // Implement adding new order logic here
        },
        onUpdateOrderPress: function (oEvent) {
            // Implement order update logic here
        },
        onDeleteOrderPress: function (oEvent) {
            // Implement order deletion logic here
        },
        onSaveClicked: function (oEvent) {
            // Implement save logic here
        },
        open: function (oEvent) {
            // Implement the action when a table item is pressed
        },
        handleEditPress: function () {
            debugger;
            //Clone the data
            var oModel = oView.getModel("oFormModel");
            var oData = oModel.getData();
            this._oSupplier = Object.assign({}, oData[that.currentOrderPath]);

            this._toggleButtonsAndView(true);

        },
        handleCancelPress: function () {
            debugger;
            //Restore the data
            var oModel = oView.getModel("oFormModel");
            var oData = oModel.getData();
            oData[that.currentOrderPath] = this._oSupplier;
            oModel.setData(oData);
            this._toggleButtonsAndView(false);
        },
        handleSavePress: function () {
            debugger;
            this._toggleButtonsAndView(false);
        },
        _toggleButtonsAndView: function (bEdit) {
            debugger;
            var oView = this.getView();

            // Show the appropriate action buttons
            oView.byId("edit").setVisible(!bEdit);
            oView.byId("save").setVisible(bEdit);
            oView.byId("cancel").setVisible(bEdit);

            // Set the right form type
            this._showFormFragment(bEdit ? "Change" : "Display");
        },
        _getFormFragment: function (sFragmentName) {
            debugger;
            var pFormFragment = this._formFragments[sFragmentName],
                oView = this.getView();
            debugger;
            if (!pFormFragment) {
                pFormFragment = Fragment.load({
                    id: oView.getId(),
                    name: "masterdetails.view." + sFragmentName
                });
                this._formFragments[sFragmentName] = pFormFragment;
            }
            debugger;
            return pFormFragment;
        },
        _showFormFragment: function (sFragmentName) {
            debugger;
            var oPage = this.byId("detailpage");

            oPage.removeAllContent();

            this._getFormFragment(sFragmentName).then(function (oVBox) {
                // Use the current binding context of the view
                oVBox.setBindingContext(oView.getBindingContext());
                oPage.insertContent(oVBox);
            });
        }
    });
});