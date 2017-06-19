import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import Movie from '../models/movie.js';
import MovieView from '../views/movie_view.js';


var MovieListView = Backbone.View.extend({
  initialize: function(params){
    this.listenTo(this.model, 'update', this.render);
    this.template = _.template($('#movie-template').html());
  },

  render: function(){
    this.clearLibrary();
    var self = this;

    this.model.each(function(movie){
      var movieView = new MovieView({
        model: movie,
        template: self.template,
        tagName: 'section'
      });
      // console.log("rendering ", movieView.model);
      self.$('.movie-library').append(movieView.render().$el);
      self.listenTo(movieView, "addMovieListen", self.addToLibrary);
    });

    return this;
  },

  events: {
    "click .search-button" : "getSearchResults",
  },

  addToLibrary: function(movie){
    this.template = _.template($('#movie-template').html());
    var newMovie = new Movie(movie);
    this.model.create(newMovie);
  },

  clearLibrary: function(){
    this.$('.movie-library').empty();
  },

  getSearchResults: function() {
    var queryInput = this.$('.input-group-field').val();
    this.$('.input-group-field').val('');
    this.template = _.template($('#search-template').html());

    this.model.fetch({data: {query: queryInput}});
  },

});

export default MovieListView;
