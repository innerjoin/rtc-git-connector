define([
    "dojo/_base/declare",
    "dojo/dom",
    "dojo/dom-style",
    "./js/MainLayout",
    "./_AbstractActionWidget",
    "dijit/_TemplatedMixin",
    "dijit/Dialog",
    "dojo/text!./templates/RtcGitConnector.html"
], function (declare, dom, domStyle, MainLayout, _AbstractActionWidget, _TemplateMixin, Dialog, template) {
    return declare([_AbstractActionWidget, _TemplateMixin], {
        templateString: template,

        constructor: function () {
        },

        startup: function () {
            this.makeMainDialog();
            this.mainDialog.show();
        },

        makeMainDialog: function () {
            this.mainDialog = new Dialog({
                title: "Connect with Git",
                content: new MainLayout(),
                style: "background-color: white;"
            });
        }
    });
});