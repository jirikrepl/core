AT.prototype.atTitleHelpers = {
  title: function() {
    var parentData = Template.currentData();
    var state = (parentData && parentData.state) || AccountsTemplates.getState();
    return T9n.get(AccountsTemplates.texts.title[state], markIfMissing = false);
  },
  description() {
    var parentData = Template.currentData();
    var state = (parentData && parentData.state) || AccountsTemplates.getState();
    return T9n.get(AccountsTemplates.texts.description[state], markIfMissing = false);
  }
};
