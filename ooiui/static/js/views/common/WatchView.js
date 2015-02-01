"use strict";
/*
* ooiui/static/js/views/common/ChartView.js
* View definitions for charts
*
* Dependencies
* Partials
* - ooiui/static/js/partials/Watch.html
* Libs
* - ooiui/static/lib/underscore/underscore.js
* - ooiui/static/lib/backbone/backbone.js
* - ooiui/static/js/ooi.js
* Models
* - ooiui/static/js/models/common/WatchModel.js
*
* Usage
*/

/*
 * The WatchView will render the watches from the collection as a list-group.
 */
var WatchView = Backbone.View.extend({
  className: 'panel',
  events: {
    'click .watch-item': 'onClick',
    'click #new-watch-link' : 'onNewWatchModal',
    'click #end-watch-link' : 'onEndWatchModal',
    'click #new-watch' : 'onStartNewWatch',
    'click #end-watch' : 'onEndWatch'
  },
  initialize: function(options) {
    _.bindAll(this, "render", "onSync", "onClick", "onLogin", "onLogout", "onNewWatchModal", "onEndWatchModal", "onStartNewWatch", "onEndWatch");
    this.listenTo(ooi, "login:success", this.onLogin);
    this.listenTo(ooi, "login:logout", this.onLogout);
    var self = this;
    // We create a comparator for the collection to use as a sorting mechanism.
    // We want to sort the collection by the end_time in reverse order.
    this.collection.comparator = function(model) {
      // We get the milliseconds since 1970-01-01 from parsing the end_time in
      // the model
      var d = model.getEndDate();
      if(d == null) { 
        // if we couldn't parse it, then just use the current timestamp.
        d = new Date(); 
      } else {
        d = new Date(d);
      }
      // Return -d so that the sort is reverse order.
      return -d;
    };
    // Whenever this collection is fetched, call this.onSync
    this.listenTo(this.collection, 'sync', this.onSync);
    this.render();
  },
  onClick: function(e) {
    ooi.trigger('watchview:click', $(e.target).closest('.watch-item').attr('data-id'));
  },
  onEndWatch: function() {
    var watchModel = this.collection.at(0);
    watchModel.save({
      success: function(model, response, options) {
        ooi.trigger('watchview:endwatch', model);
      }
    });
  },
  onLogin: function() {
    this.render();
  },
  onLogout: function() {
    this.render();
  },
  onNewWatchModal: function() {
    this.$el.find('#new-watch-modal').modal('show');
  },
  onEndWatchModal: function() {
    this.$el.find('#end-watch-modal').modal('show');
  },
  onStartNewWatch: function() {
    var newWatch = new WatchModel();
    var self = this;
    newWatch.save(null, {
      success: function(model, response, options) {
        ooi.trigger('watchview:newwatch', model);
      }
    }); // Creates a new watch
  },
  /*
   * onSync is called whenver the collection is fetched successfully. This
   * allows us to re-render the view.
   */
  onSync: function() {
    this.render();
  },
  // comment
  template: JST['ooiui/static/js/partials/Watch.html'],
  render: function() {
    console.log("WatchView: render");
    var orgSelected = false;
    // Sort by the end date
    this.collection.sort();
    this.$el.html(this.template({collection: this.collection}));
    if(ooi.login.loggedIn()) {
      if(this.collection.length > 0) {
        var recentModel = this.collection.at(0);
        if(recentModel.get('end_time') == null) { // open watch
          this.$el.find('#new-watch-dropdown').toggleClass('disabled');
          this.$el.find('#new-watch-link').toggle();
        } else {
          this.$el.find('#new-watch-dropdown').toggleClass('disabled');
          this.$el.find('#end-watch-link').toggle();
        }
      } else { // no current watches
        this.$el.find('#new-watch-dropdown').toggleClass('disabled');
        this.$el.find('#end-watch-link').toggle();
      }
    }
  }
});
