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

            // Model for the data
            var oOrdersModel = new JSONModel();
            oView.setModel(oOrdersModel, "OrdersModel");

            var oFormModel = new JSONModel();
            oView.setModel(oFormModel, "oFormModel");

            var oCustomersModel = new JSONModel([]);
            oView.setModel(oCustomersModel, "CustomersModel");

            var oProductsModel = new JSONModel([]);
            oView.setModel(oProductsModel, "ProductsModel");

            var oSuppliersModel = new JSONModel([]);
            oView.setModel(oSuppliersModel, "SuppliersModel");

            var oShippersModel = new JSONModel([]);
            oView.setModel(oShippersModel, "ShippersModel");

            var oOrdersDetailsModel = new JSONModel([]);
            oView.setModel(oOrdersDetailsModel, "OrdersDetailsModel");

            var oOrdersProductModel = new JSONModel();
            oView.setModel(oOrdersProductModel, "OrdersProductModel");

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
            that.loadAllOrders();
            that.loadAllCustomers();
            that.loadAllProducts();
            that.loadAllSuppliers();
            that.loadAllShippers();
            that.loadAllOrdersDetail();
        },
        loadAllOrders: function () {
            // // debugger;
            var oModel = that.getOwnerComponent().getModel();
            var sPath = "/Orders";
            var oBusyDialog = new BusyDialog();
            oBusyDialog.open();
            oModel.read(sPath, {
                success: function (oData) {
                    console.log("Success");
                    let res = oData.results.map(function (val) {
                        val.OrderID = String(val.OrderID);
                        val.ShipVia = String(val.ShipVia);
                        val.EmployeeID = String(val.EmployeeID);
                        val.isNew = false;
                        return val;
                    });
                    console.log("Orders ", res[0]);
                    that.allOrders = oData.results;
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
        loadAllCustomers: function () {
            // // debugger;
            var oModel = that.getOwnerComponent().getModel();
            var sPath = "/Customers";
            oModel.read(sPath, {
                success: function (oData) {
                    console.log("Success");
                    console.log("Customers", oData.results[0]);
                    oView.getModel("CustomersModel").setData(oData.results);
                    oView.getModel("CustomersModel").setSizeLimit(1000);
                    oView.getModel("CustomersModel").refresh();
                    // oView.byId("tabTitle").setText(that.i18nBundle.getText("purOrder", res.length));
                    // that.currentOrderPath = 0;
                    // that.currentOrder = oView.getModel("oFormModel").getData()[0];
                },
                error: function (oerror) {
                    console.log("error");
                }
            });
        },
        loadAllProducts: function () {
            var oModel = that.getOwnerComponent().getModel();
            var sPath = "/Products";
            oModel.read(sPath, {
                success: function (oData) {
                    console.log("Success");
                    console.log("Products", oData.results[0])
                    that.allProductsDetails = oData.results;
                    oView.getModel("ProductsModel").setData(oData.results);
                    oView.getModel("ProductsModel").setSizeLimit(1000);
                    oView.getModel("ProductsModel").refresh();
                    // oView.byId("tabTitle").setText(that.i18nBundle.getText("purOrder", res.length));
                    // that.currentOrderPath = 0;
                    // that.currentOrder = oView.getModel("oFormModel").getData()[0];            
                },
                error: function (oerror) {
                    console.log("error");
                }
            });
        },
        loadAllShippers: function () {
            var oModel = that.getOwnerComponent().getModel();
            var sPath = "/Shippers";
            oModel.read(sPath, {
                success: function (oData) {
                    console.log("Success");
                    console.log("Shippers", oData.results[0])
                    oView.getModel("ShippersModel").setData(oData.results);
                    oView.getModel("ShippersModel").setSizeLimit(1000);
                    oView.getModel("ShippersModel").refresh();
                    // oView.byId("tabTitle").setText(that.i18nBundle.getText("purOrder", res.length));
                    // that.currentOrderPath = 0;
                    // that.currentOrder = oView.getModel("oFormModel").getData()[0];            
                },
                error: function (oerror) {
                    console.log("error");
                }
            });
        },
        loadAllSuppliers: function () {
            var oModel = that.getOwnerComponent().getModel();
            var sPath = "/Suppliers";
            oModel.read(sPath, {
                success: function (oData) {
                    console.log("Success");
                    console.log("Suppliers", oData.results)
                    oView.getModel("SuppliersModel").setData(oData.results);
                    oView.getModel("SuppliersModel").setSizeLimit(1000);
                    oView.getModel("SuppliersModel").refresh();
                    // oView.byId("tabTitle").setText(that.i18nBundle.getText("purOrder", res.length));
                    // that.currentOrderPath = 0;
                    // that.currentOrder = oView.getModel("oFormModel").getData()[0];            
                },
                error: function (oerror) {
                    console.log("error");
                }
            });
        },
        loadAllOrdersDetail: function () {
            var oModel = that.getOwnerComponent().getModel();
            var sPath = "/Order_Details";
            oModel.read(sPath, {
                success: function (oData) {
                    console.log("Success");
                    console.log("OrdersDetail", oData.results[0])
                    that.allOrdersDetails = oData.results;
                    oView.getModel("OrdersDetailsModel").setData(oData.results);
                    oView.getModel("OrdersDetailsModel").setSizeLimit(1000);
                    oView.getModel("OrdersDetailsModel").refresh();
                    // oView.byId("tabTitle").setText(that.i18nBundle.getText("purOrder", res.length));
                    // that.currentOrderPath = 0;
                    // that.currentOrder = oView.getModel("oFormModel").getData()[0];            
                },
                error: function (oerror) {
                    console.log("error");
                }
            });
        },
        addOrdersProduct: function () {
            var addProducts = function (order) {
                // console.log("in addProducts : order : ", order);

                var orderId = order.OrderID;
                var checkOrder = function (orderd) {
                    // console.log("in checkOrder : orderd : ", orderd);
                    return orderd.OrderID == orderId;
                };
                var orderProducts = that.allOrdersDetails.filter(checkOrder).map(function name(order) {
                    var productId = order.ProductID;
                    console.log(" allOrdersDetails.filter : ", order);
                    // debugger;
                    var products = that.allProductsDetails.filter(function checkProduct(product) {
                        // debugger;
                        return product.ProductID == productId;
                    });
                    console.log(" allOrdersDetails.filter : products", products);
                    if (products[0]){
                        order.ProductName = products[0].ProductName;
                    }
                    return order;
                });
                // console.log("in addProducts : orderProducts : ",orderProducts);
                return {
                    "OrderID": orderId,
                    "Products": orderProducts
                }
            };
            var ordersProduct = that.allOrders.map(addProducts);
            console.log("in addOrdersProduct : ordersProduct : ", ordersProduct);
            oView.getModel("OrdersProductModel").setData(ordersProduct);
            oView.getModel("OrdersProductModel").setSizeLimit(1000);
            oView.getModel("OrdersProductModel").refresh();
        },
        bindElement: function () {
            // oView.byId("FormDisplay354wideDual").setModel(oView.getModel("oFormModel"));
            // oView.byId("FormDisplay354wideDual").bindElement({ path: "/"+that.currentOrderPath, model: "oFormModel" });
            // // debugger;
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
            that.addOrdersProduct();
            this.getSplitAppObj().toMaster(this.createId("ordermaster"));
        },
        onPressGoToCustomerMaster: function () {
            this.getSplitAppObj().toMaster(this.createId("customermaster"));
        },
        onPressGoToProductMaster: function () {
            this.getSplitAppObj().toMaster(this.createId("productmaster"));
        },
        onPressGoToSupplierMaster: function () {
            this.getSplitAppObj().toMaster(this.createId("shippermaster"));
        },
        onPressGoToShipperMaster: function () {
            this.getSplitAppObj().toMaster(this.createId("suppliermaster"));
        },
        onPressMasterBack: function () {
            this.getSplitAppObj().backMaster();
        },
        onListItemOrderPress: function (oEvent) {
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
        onListItemCustomerPress: function (oEvent) {
            // var oSelectedItem = oEvent.getSource();
            // var oContext = oSelectedItem.getBindingContext("OrdersModel");

            // var sPath = oContext.getPath();
            // var oSelectedOrder = oContext.getModel().getProperty(sPath);

            // var sPath2 = oSelectedItem.getBindingContextPath();
            // var oSelectedOrder2 = oView.getModel("OrdersModel").getProperty(sPath);

            // that.currentOrderPath = sPath2.replace('/', '');
            // that.currentOrder = oSelectedOrder2;

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

            // that.displayOrderDetails();
        },
        onListItemProductPress: function (oEvent) {
            // var oSelectedItem = oEvent.getSource();
            // var oContext = oSelectedItem.getBindingContext("OrdersModel");

            // var sPath = oContext.getPath();
            // var oSelectedOrder = oContext.getModel().getProperty(sPath);

            // var sPath2 = oSelectedItem.getBindingContextPath();
            // var oSelectedOrder2 = oView.getModel("OrdersModel").getProperty(sPath);

            // that.currentOrderPath = sPath2.replace('/', '');
            // that.currentOrder = oSelectedOrder2;

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

            // that.displayOrderDetails();
        },
        onListItemSupplierPress: function (oEvent) {
            // var oSelectedItem = oEvent.getSource();
            // var oContext = oSelectedItem.getBindingContext("OrdersModel");

            // var sPath = oContext.getPath();
            // var oSelectedOrder = oContext.getModel().getProperty(sPath);

            // var sPath2 = oSelectedItem.getBindingContextPath();
            // var oSelectedOrder2 = oView.getModel("OrdersModel").getProperty(sPath);

            // that.currentOrderPath = sPath2.replace('/', '');
            // that.currentOrder = oSelectedOrder2;

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

            // that.displayOrderDetails();
        },
        onListItemShipperPress: function (oEvent) {
            // var oSelectedItem = oEvent.getSource();
            // var oContext = oSelectedItem.getBindingContext("OrdersModel");

            // var sPath = oContext.getPath();
            // var oSelectedOrder = oContext.getModel().getProperty(sPath);

            // var sPath2 = oSelectedItem.getBindingContextPath();
            // var oSelectedOrder2 = oView.getModel("OrdersModel").getProperty(sPath);

            // that.currentOrderPath = sPath2.replace('/', '');
            // that.currentOrder = oSelectedOrder2;

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

            // that.displayOrderDetails();
        },
        displayOrderDetails: function () {
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
            //// debugger;
            //Clone the data
            var oModel = oView.getModel("oFormModel");
            var oData = oModel.getData();
            this._oSupplier = Object.assign({}, oData[that.currentOrderPath]);

            this._toggleButtonsAndView(true);

        },
        handleCancelPress: function () {
            // debugger;
            //Restore the data
            var oModel = oView.getModel("oFormModel");
            var oData = oModel.getData();
            oData[that.currentOrderPath] = this._oSupplier;
            oModel.setData(oData);
            this._toggleButtonsAndView(false);
        },
        handleSavePress: function () {
            // debugger;
            this._toggleButtonsAndView(false);
        },
        _toggleButtonsAndView: function (bEdit) {
            // debugger;
            var oView = this.getView();

            // Show the appropriate action buttons
            oView.byId("edit").setVisible(!bEdit);
            oView.byId("save").setVisible(bEdit);
            oView.byId("cancel").setVisible(bEdit);

            // Set the right form type
            this._showFormFragment(bEdit ? "Change" : "Display");
        },
        _getFormFragment: function (sFragmentName) {
            // debugger;
            var pFormFragment = this._formFragments[sFragmentName],
                oView = this.getView();
            // debugger;
            if (!pFormFragment) {
                pFormFragment = Fragment.load({
                    id: oView.getId(),
                    name: "masterdetails.view." + sFragmentName
                });
                this._formFragments[sFragmentName] = pFormFragment;
            }
            // debugger;
            return pFormFragment;
        },
        _showFormFragment: function (sFragmentName) {
            // debugger;
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