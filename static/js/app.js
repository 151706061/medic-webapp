require('lie/polyfill');

require('./services/index');
require('./controllers/index');
require('./filters/index');

var _ = require('underscore');
_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

(function () {

  'use strict';

  var app = angular.module('inboxApp', [
    'ipCookie',
    'ngRoute',
    'ui.router',
    'inboxFilters',
    'inboxControllers',
    'inboxServices',
    'pascalprecht.translate',
    'nvd3ChartDirectives',
    'pouchdb'
  ]);

  app.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$compileProvider',
    function($stateProvider, $urlRouterProvider, $translateProvider, $compileProvider) {

      $urlRouterProvider.otherwise('/error/404');

      $stateProvider

        // errors
        .state('error', {
          url: '/error/:code',
          controller: 'ErrorCtrl',
          templateUrl: 'templates/partials/error.html'
        })

        // home
        .state('home', {
          url: '/home',
          controller: 'HomeCtrl'
        })

        // messages
        .state('messages', {
          url: '/messages?tour',
          controller: 'MessagesCtrl',
          templateUrl: 'templates/partials/messages.html'
        })
        .state('messages.detail', {
          url: '/:id',
          views: {
            content: {
              controller: 'MessagesContentCtrl',
              templateUrl: 'templates/partials/messages_content.html'
            }
          }
        })

        // reports
        .state('reports', {
          url: '/reports?tour&query',
          controller: 'ReportsCtrl',
          templateUrl: 'templates/partials/reports.html'
        })
        .state('reports.add', {
          url: '/add/:formId',
          views: {
            content: {
              controller: 'ReportsAddCtrl',
              templateUrl: 'templates/partials/reports_add.html'
            }
          }
        })
        .state('reports.edit', {
          url: '/edit/:reportId',
          views: {
            content: {
              controller: 'ReportsAddCtrl',
              templateUrl: 'templates/partials/reports_add.html'
            }
          }
        })
        .state('reports.detail', {
          url: '/:id',
          views: {
            content: {
              controller: 'ReportsContentCtrl',
              templateUrl: 'templates/partials/reports_content.html'
            }
          }
        })

        // analytics
        .state('analytics', {
          url: '/analytics/:module?tour',
          controller: 'AnalyticsCtrl',
          templateUrl: 'templates/partials/analytics.html'
        })

        // contacts
        .state('contacts', {
          url: '/contacts',
          controller: 'ContactsCtrl',
          templateUrl: 'templates/partials/contacts.html'
        })
        .state('contacts.add', {
          url: '/add',
          views: {
            content: {
              controller: 'ContactsEditCtrl',
              templateUrl: 'templates/partials/contacts_edit.html'
            }
          }
        })
        .state('contacts.report', {
          url: '/:id/report/:formId',
          views: {
            content: {
              controller: 'ContactsReportCtrl',
              templateUrl: 'templates/partials/contacts_report.html'
            }
          }
        })
        .state('contacts.detail', {
          url: '/:id',
          views: {
            content: {
              controller: 'ContactsContentCtrl',
              templateUrl: 'templates/partials/contacts_content.html'
            }
          }
        })
        .state('contacts.addChild', {
          url: '/:parent_id/add/:type',
          views: {
            content: {
              controller: 'ContactsEditCtrl',
              templateUrl: 'templates/partials/contacts_edit.html'
            }
          }
        })
        .state('contacts.edit', {
          url: '/:id/edit',
          views: {
            content: {
              controller: 'ContactsEditCtrl',
              templateUrl: 'templates/partials/contacts_edit.html'
            }
          }
        })

        // tasks
        .state('tasks', {
          url: '/tasks',
          controller: 'TasksCtrl',
          templateUrl: 'templates/partials/tasks.html'
        })
        .state('tasks.detail', {
          url: '/:id',
          views: {
            content: {
              controller: 'TasksContentCtrl',
              templateUrl: 'templates/partials/tasks_content.html'
            }
          }
        })

        // configuration
        .state('configuration', {
          url: '/configuration',
          controller: 'ConfigurationCtrl',
          templateUrl: 'templates/partials/configuration.html'
        })
        .state('configuration.settings', {
          url: '/settings',
          views: {
            content: {
              templateUrl: 'templates/partials/configuration_settings.html'
            }
          }
        })
        .state('configuration.settings.basic', {
          url: '/basic',
          views: {
            tab: {
              controller: 'ConfigurationSettingsBasicCtrl',
              templateUrl: 'templates/partials/configuration_settings_basic.html'
            }
          }
        })
        .state('configuration.settings.advanced', {
          url: '/advanced',
          views: {
            tab: {
              controller: 'ConfigurationSettingsAdvancedCtrl',
              templateUrl: 'templates/partials/configuration_settings_advanced.html'
            }
          }
        })
        .state('configuration.translation', {
          url: '/translation',
          views: {
            content: {
              templateUrl: 'templates/partials/configuration_translation.html'
            }
          }
        })
        .state('configuration.translation.languages', {
          url: '/languages',
          views: {
            tab: {
              controller: 'ConfigurationTranslationLanguagesCtrl',
              templateUrl: 'templates/partials/configuration_translation_languages.html'
            }
          }
        })
        .state('configuration.translation.application', {
          url: '/application',
          views: {
            tab: {
              controller: 'ConfigurationTranslationApplicationCtrl',
              templateUrl: 'templates/partials/configuration_translation_application.html'
            }
          }
        })
        .state('configuration.translation.messages', {
          url: '/messages',
          views: {
            tab: {
              controller: 'ConfigurationTranslationMessagesCtrl',
              templateUrl: 'templates/partials/configuration_translation_messages.html'
            }
          }
        })
        .state('configuration.forms', {
          url: '/forms',
          views: {
            content: {
              controller: 'ConfigurationFormsCtrl',
              templateUrl: 'templates/partials/configuration_forms.html'
            }
          }
        })
        .state('configuration.user', {
          url: '/user',
          views: {
            content: {
              controller: 'ConfigurationUserCtrl',
              templateUrl: 'templates/partials/configuration_user.html'
            }
          }
        })
        .state('configuration.users', {
          url: '/users',
          views: {
            content: {
              controller: 'ConfigurationUsersCtrl',
              templateUrl: 'templates/partials/configuration_users.html'
            }
          }
        })
        .state('configuration.export', {
          url: '/export',
          views: {
            content: {
              controller: 'ConfigurationExportCtrl',
              templateUrl: 'templates/partials/configuration_export.html'
            }
          }
        })
        .state('configuration.icons', {
          url: '/icons',
          views: {
            content: {
              controller: 'ConfigurationIconsCtrl',
              templateUrl: 'templates/partials/configuration_icons.html'
            }
          }
        })

        // help
        .state('help', {
          url: '/help',
          controller: 'HelpCtrl',
          templateUrl: 'templates/partials/help.html'
        })

        // theme design testing page
        .state('theme', {
          url: '/theme',
          controller: 'ThemeCtrl',
          templateUrl: 'templates/partials/theme.html'
        });

      $urlRouterProvider.when('', '/home');
      $translateProvider.useLoader('SettingsLoader', {});
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|sms|file|blob):/);
    }
  ]);

  app.factory('SettingsLoader', ['SettingsP', function (SettingsP) {
    return function (options) {
      return SettingsP().then(function(res) {
        options.key = options.key || res.locale || 'en';

        var test = false;
        if (options.key === 'test') {
          options.key = 'en';
          test = true;
        }

        var data = {};
        if (res.translations) {
          res.translations.forEach(function(translation) {
            var key = translation.key;
            var value = translation.default || key;
            translation.translations.forEach(function(val) {
              if (val.locale === options.key) {
                value = val.content;
              }
            });
            if (test) {
              value = '-' + value + '-';
            }
            data[key] = value;
          });
        }
        return data;
      });
    };
  }]);

  var getDbNames = function() {
    // parse the URL to determine the remote and local database names
    var url = window.location.href;
    var protocolLocation = url.indexOf('//') + 2;
    var hostLocation = url.indexOf('/', protocolLocation) + 1;
    var dbNameLocation = url.indexOf('/', hostLocation);
    return {
      remote: url.slice(0, dbNameLocation),
      local: url.slice(hostLocation, dbNameLocation)
    };
  };

  // Protractor waits for requests to complete so we have to disable
  // long polling requests.
  app.constant('E2ETESTING', window.location.href.indexOf('e2eTesting=true') !== -1);

  var bootstrapApplication = function() {
    // check that the app has been fully started previously
    window.PouchDB(names.local)
      .get('local:first_run_completed_ok')
      .then(function() {
        app.constant('APP_CONFIG', {
          name: '@@APP_CONFIG.name',
          version: '@@APP_CONFIG.version'
        });
        angular.element(document).ready(function() {
          angular.bootstrap(document, [ 'inboxApp' ]);
        });
      })
      .catch(function() {
        $('.bootstrap-layer').html('<div><div class="loader"></div><p><span id="initial-sync-progress">0</span> docs downloaded...</p></div>');
        window.PouchDB.replicate(names.remote, names.local, {
          live: false,
          filter: 'medic/doc_by_place',
          query_params: { id: 'nonsense' },
          batch_size: 10,
        })
        .on('change', function(info) {
          $('#initial-sync-progress').html(info.docs_read);
        })
        .on('complete', function() {
          alert('sync complete!');
          window.PouchDB(names.local)
            .put({ _id: 'local:first_run_completed_ok' })
            .then(function() {
              alert('sync flag saved!!');
              window.location.reload();
            })
            .catch(function(err) {
              $('.bootstrap-layer').html('<div><p>Loading error, please check your connection.</p><a class="btn btn-primary" href="#" onclick="window.location.reload(false);">Try again</a></div>');
              console.error('Error saving first-run-complete flag', err);
            });
        })
        .on('error', function(err) {
          $('.bootstrap-layer').html('<div><p>Loading error, please check your connection.</p><a class="btn btn-primary" href="#" onclick="window.location.reload(false);">Try again</a></div>');
          console.error('Error performing initial sync', err);
        });
      });
  };

  var names = getDbNames();
  window.PouchDB(names.local)
    .get('_design/medic')
    .then(function() {
      // ddoc found - bootstrap immediately
      bootstrapApplication();
    }).catch(function() {
      window.PouchDB(names.remote)
        .get('_design/medic')
        .then(function(ddoc) {
          var minimal = _.pick(ddoc, '_id', 'app_settings', 'views');
          minimal.remote_rev = ddoc._rev;
          return window.PouchDB(names.local)
            .put(minimal);
        })
        .then(bootstrapApplication)
        .catch(function(err) {
          $('.bootstrap-layer').html('<div><p>Loading error, please check your connection.</p><a class="btn btn-primary" href="#" onclick="window.location.reload(false);">Try again</a></div>');
          console.error('Error fetching ddoc from remote server', err);
        });
    });

}());
