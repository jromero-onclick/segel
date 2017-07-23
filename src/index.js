'use strict';

// Dependencies.
import Vue from 'vue';

// Components.
import Main from './components/main.vue';
import Events from './helpers/events.js';
import Store from './helpers/store.js';

// Create Vue instance.
const vueInstance = new Vue({
  template: '<segel-main v-bind:start="start" v-bind:end="end" v-bind:objects="objects" v-bind:bookings="bookings"></segel-main>',

  beforeMount: function () {
    // Get attributes from root element if present.
    this.start = this.$el.getAttribute('start') ? parseInt(this.$el.getAttribute('start')) : this.start;
    this.end = this.$el.getAttribute('end') ? parseInt(this.$el.getAttribute('end')) : this.end;
    this.steps = this.$el.getAttribute('steps') ? parseInt(this.$el.getAttribute('steps')) : this.steps;
    this.objects = this.$el.getAttribute('objects') ? this.$el.getAttribute('objects') : this.objects;
    this.bookings = this.$el.getAttribute('bookings') ? this.$el.getAttribute('bookings') : this.bookings;
  },

  components: {
    'segel-main': Main
  },

  data: Store.state
});

// Republish events.
Events.$on('bookings:add', function (data) {
  vueInstance.$emit('bookings:add', data);
  Store.addBooking(data);
});

Events.$on('bookings:update', function (data) {
  vueInstance.$emit('bookings:update', data);
  Store.updateBooking(data);
});

// Declare function to export.
const Segel = function (selector) {
  vueInstance.$mount(selector);
};

Segel.bookings = {
  add: function (data) {
    Store.addBooking(data);
  },
  update: function (data) {
    Store.updateBooking(data);
  },
  remove: function (data) {
    Store.removeBooking(data);
  }
};

Segel.instance = vueInstance;

/**
 * Include test data if development build.
 */
if (process.env.NODE_ENV === 'development') {
  Segel.bookings.add({
    id: 1,
    object: 1,
    start: 1483264800,
    end: 1483311600
  });
}

export default Segel;
