var _ = require('underscore'),
    utils = require('kujua-utils');

(function () {

  'use strict';

  var inboxServices = angular.module('inboxServices');
  
  var backOffFunction = function(prev) {
    if (prev <= 0) {
      // first run, backoff 1 second
      return 1000;
    }
    // double the backoff, maxing out at 1 minute
    return Math.min(prev * 2, 60000);
  };

  var getRemoteUrl = function(name) {
    var port = location.port ? ':' + location.port : '';
    return location.protocol + '//' + location.hostname + port + '/' + name;
  };

  inboxServices.factory('DB', [
    'pouchDB', 'UserDistrict', 'UserCtxService', 'DbNameService',
    function(pouchDB, UserDistrict, UserCtxService, DbNameService) {

      // TODO lock down api so non-admins can only replicate
      // TODO stop users from creating docs against another facility - update validation on replicate?

      var replicate = function(from, options) {
        options = options || {};
        _.defaults(options, {
          live: true,
          retry: true,
          back_off_function: backOffFunction
        });
        var direction = from ? 'from' : 'to';
        var fn = get().replicate[direction];
        return fn(getRemoteUrl(DbNameService()), options)
          .on('error', function(err) {
            console.log('Error replicating ' + direction + ' remote server', err);
          });
      };

      var isAdmin = function() {
        return utils.isUserAdmin(UserCtxService());
      };

      var get = function(name) {
        name = name || DbNameService();
        if (isAdmin()) {
          name = getRemoteUrl(name);
        }
        return pouchDB(name);
      };

      return {

        get: get,

        sync: function() {

          if (isAdmin()) {
            // admins have potentially too much data so bypass local pouch
            return;
          }

          UserDistrict(function(err, district) {
            if (err) {
              return console.log('Error fetching district', err);
            }

            replicate(true, {
              filter: 'medic/doc_by_place',
              query_params: {
                id: district,
                unassigned: false // TODO get from user
              }
            });
          });

          replicate(false);

          // TODO only admins can replicate _users! Find another way to get current user information
          // TODO user context is actually cached in the dom in appcache. listen to change and invalidate appcacahe?
          // pouchDB('_users')
          //   .replicate.from('http://localhost:5988/_users', replicationOptions);
        }

      };
    }
  ]);

}());
