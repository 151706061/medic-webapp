var _ = require('underscore'),
    scrollLoader = require('../modules/scroll-loader');

(function () {

  'use strict';

  var inboxControllers = angular.module('inboxControllers');

  inboxControllers.controller('ContactsCtrl', 
    ['$rootScope', '$scope', '$state', '$timeout', 'ContactSchema', 'DB', 'Search',
    function ($rootScope, $scope, $state, $timeout, ContactSchema, DB, Search) {

      $scope.filterModel.type = 'contacts';
      $scope.contacts = [];
      $scope.selected = null;

      $scope.titleFor = function(doc) {
        if(!doc) {
          return '';
        }
        var titleFormat = ContactSchema.get()[doc.type].title;
        return titleFormat.replace(/\{\{([^}]+)\}\}/g, function(all, name) {
          return doc[name];
        });
      };

      $scope.selectedSchema = function() {
        return $scope.selected && ContactSchema.get()[$scope.selected.type];
      };

      $scope.selectedSchemaNormalFields = function() {
        // TODO we should parse `title` for `selected.type` and remove referenced fields
        if(!$scope.selected) {
          return;
        }
        var fields = _.clone(ContactSchema.get()[$scope.selected.type].fields);
        delete fields.name;
        delete fields.parent;
        return fields;
      };

      $scope.query = function(options) {
        options = options || {};
        options.limit = 50;

        $scope.loading = true;
        $scope.appending = options.skip;
        $scope.error = false;

        _.defaults(options, {
          index: 'contacts',
          sort: 'name_sorting'
        });

        if (options.skip) {
          options.skip = $scope.items.length;
        }
        Search($scope, options, function(err, data) {
          $scope.loading = false;
          $scope.appending = false;
          if (err) {
            $scope.error = true;
            return console.log('Error searching for contacts', err);
          }
          $scope.moreItems = data.length >= options.limit;
          if (options.skip) {
            $scope.items.push.apply($scope.items, data);
          } else {
            $scope.contacts = data;
            scrollLoader.init(function() {
              if (!$scope.loading && $scope.moreItems) {
                $timeout(function() {
                  $scope.query({ skip: true });
                });
              }
            });
            if (!data.length) {
              $scope.clearSelected();
            } else if (!$state.params.id && !options.stay && !$('#back').is(':visible')) {
              // wait for selected to be set before checking
              $timeout(function() {
                var id = $('.inbox-items li').first().attr('data-record-id');
                $state.go('contacts.detail', { id: id }, { location: 'replace' });
              });
            }
          }
        });
      };

      $scope.setSelected = function(doc) {
        $scope.selected = doc;
        $scope.setActionBar({
          _id: doc._id,
          sendTo: doc
        });
      };

      $scope.select = function(id) {
        if (id) {
          $state.go('contacts.detail', { id: id });
        } else {
          $state.go('contacts');
        }
      };

      $scope.$on('ClearSelected', function() {
        $scope.selected = null;
      });

      $scope.$on('query', function() {
        $scope.query();
      });

      $scope.$on('EditContact', function(e, record) {
        $rootScope.$broadcast('EditContactInit', record || $scope.selected);
      });

      $scope.$on('ContactUpdated', function(e, contact) {
        if (!contact) {
          return $scope.query();
        } else if (contact._deleted) {
          $scope.contacts = _.filter($scope.contacts, function(i) {
            return i._id !== contact._id;
          });
          return;
        }
        $state.go('contacts.detail', { id: contact._id });
        var outdated = _.findWhere($scope.items, { _id: contact._id });
        if (!outdated) {
          return $scope.query({ stay: true });
        }
        _.extend(outdated, contact);
      });
    }
  ]);

}());
