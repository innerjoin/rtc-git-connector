define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/dom-construct",
    "dojo/dom-style",
    "../../services/MainDataStore",
    "../../js/ViewHelper",
    "../ListItem/ListItem",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./ViewIssuesToLink.html"
], function (declare, array, lang, domConstruct, domStyle,
    MainDataStore, ViewHelper, ListItem,
    _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
    template) {
    return declare("com.siemens.bt.jazz.workitemeditor.rtcGitConnector.ui.widget.viewIssuesToLink",
        [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin],
    {
        templateString: template,
        mainDataStore: null,

        constructor: function () {
            this.mainDataStore = MainDataStore.getInstance();
        },

        startup: function () {
            this.watchDataStore();
        },

        watchDataStore: function () {
            var self = this;

            // React when issues are added or removed from the issues to link list
            this.mainDataStore.selectedRepositoryData.issuesToLink.watchElements(function () {
                if (self.mainDataStore.selectedRepositoryData.issuesToLink.length > 0) {
                    // show issues to link list
                    domStyle.set("viewIssuesToLinkContainer", "display", "block");
                    domStyle.set("rtcGitConnectorIssuesListToLink", "width", "100%");
                    domStyle.set("rtcGitConnectorIssuesListToLink", "margin-right", "10px");
                } else {
                    // hide issues to link list
                    domStyle.set("rtcGitConnectorIssuesListToLink", "width", "0");
                    domStyle.set("rtcGitConnectorIssuesListToLink", "margin-right", "0");
                    domStyle.set("viewIssuesToLinkContainer", "display", "none");
                }

                self.drawIssuesToLink(self.mainDataStore.selectedRepositoryData.issuesToLink);
            });
        },

        // Draw the issues to link list in the view
        drawIssuesToLink: function (issuesToLink) {
            var self = this;
            var gitHost = this.mainDataStore.selectedRepositorySettings.get("gitHost");
            domConstruct.empty(this.listItemsContainer);

            array.forEach(issuesToLink, function (issue) {
                var details;
                var buttonType;

                if (issue.id < 0) {
                    details = "This will create a new issue in " + gitHost.displayName + " using the information from the current work item";
                    buttonType = "times";
                } else {
                    details = ViewHelper.GetIssueOrRequestDateString(issue);
                    buttonType = "trash";
                }

                var listItem = new ListItem(issue.id);
                listItem.set("title", issue.title);
                listItem.set("details", details);
                listItem.set("buttonType", buttonType);
                listItem.set("notClickable", true);

                listItem.onButtonClick = lang.hitch(self, self.listItemButtonClick);

                issue.listItem = listItem;
                domConstruct.place(listItem.domNode, self.listItemsContainer);
            });

            // Get the mainDialog and resize to fit the new content
            ViewHelper.ResizeMainDialog();
        },

        // Remove the issue with the specified id from the issues to link list in store and add to the issues list
        listItemButtonClick: function (itemId) {
            var selectedIssue = null;

            for (var i = this.mainDataStore.selectedRepositoryData.issuesToLink.length - 1; i >= 0; i--) {
                if (this.mainDataStore.selectedRepositoryData.issuesToLink[i].id == itemId) {
                    selectedIssue = this.mainDataStore.selectedRepositoryData.issuesToLink.splice(i, 1)[0];
                    break;
                }
            }

            if (selectedIssue && !this.mainDataStore.selectedRepositoryData.issues.find(function (issue) {
                return issue.id == selectedIssue.id;
            })) {
                this.mainDataStore.selectedRepositoryData.issues.push(selectedIssue);
            }
        }
    });
});