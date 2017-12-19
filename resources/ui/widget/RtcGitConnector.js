define([
    "dojo/_base/declare",
    "dojo/dom",
    "dojo/dom-style",
    "./js/MainLayout",
    "./js/MainDataStore",
    "./js/JazzRestService",
    "./js/GitRestService",
    "./_AbstractActionWidget",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/registry",
    "dijit/Dialog",
    "dojo/text!./templates/RtcGitConnector.html"
], function (declare, dom, domStyle,
    MainLayout, MainDataStore, JazzRestService, GitRestService,
    _AbstractActionWidget, _TemplatedMixin, _WidgetsInTemplateMixin,
    registry, Dialog, template) {
    return declare([_AbstractActionWidget, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        mainDataStore: null,

        // Set the work item and project area properties in the
        // data store so that other classes can access them
        constructor: function () {
            this.mainDataStore = MainDataStore.getInstance();
            this.mainDataStore.workItem = this.workItem;
            this.mainDataStore.projectArea = this.workItem.object.attributes.projectArea;
        },

        startup: function () {
            this.setEventHandlers();

            if (this.isInternetExplorer()) {
                this.mainErrorDialog.startup();
                this.mainErrorDialog.show();
            } else {
                this.mainDialog.startup();
                this.mainDialog.show();
            }
        },

        setEventHandlers: function () {
            var self = this;

            // Clean up the dom and custom class instances when the widget is closed.
            // This is especially important for making the widget work when opened
            // and closed multiple times.
            this.mainDialog.onHide = function () {
                // Destroy all dialogs and remove them from the dom
                self.destroyWidgetById("browserIsInternetExplorerContainer");
                this.destroyRecursive(false);

                // Destroy data store and services
                self.destroyWidgetInstance();
            };

            this.mainErrorDialog.onHide = function () {
                self.destroyWidgetById("connectWithGitMainDialog");
                this.destroyRecursive(false);

                self.destroyWidgetInstance();
            };
        },

        // These custom singleton instances need to be manually destroyed.
        // If the widget is opened again it will then get new instances,
        // which is the intended behavior.
        destroyWidgetInstance: function () {
            MainDataStore.destroyInstance();
            JazzRestService.destroyInstance();
            GitRestService.destroyInstance();
        },

        // Finds a widget by it's HTML id and destroys it,
        // also removing it from the dom.
        destroyWidgetById: function (domId) {
            var widgetToDestroy = registry.byId(domId);

            if (widgetToDestroy) {
                widgetToDestroy.destroyRecursive(false);
            }
        },

        isInternetExplorer: function () {
            var ms_ie = false;
            var ua = window.navigator.userAgent;
            var old_ie = ua.indexOf('MSIE ');
            var new_ie = ua.indexOf('Trident/');

            if ((old_ie > -1) || (new_ie > -1)) {
                ms_ie = true;
            }

            return ms_ie;
        }
    });
});