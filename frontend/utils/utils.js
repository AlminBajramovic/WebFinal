var Utils = {
  init_spapp: function () {
    var app = $.spapp({
      templateDir: "./pages/",
    });
    app.run();
  },
  set_to_localstorage: function(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  get_from_localstorage: function(key) {
    return JSON.parse(window.localStorage.getItem(key));
  },
  block_ui: function (element) {
  },
  unblock_ui: function (element) {
    $(element).unblock({});
  },
  get_datatable: function (
  ) {
    
  },
};
