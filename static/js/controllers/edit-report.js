var modal = require('../modules/modal');

(function () {
  'use strict';

  angular.module('inboxControllers').controller('EditReportCtrl',
    ['$scope', '$state', '$translate', 'DB', 'DbNameService', 'UpdateFacility', 'Enketo',
    function ($scope, $state, $translate, DB, DbNameService, UpdateFacility, Enketo) {
      $(document).on('hidden.bs.modal', '#edit-report', function() {
        var modal = $(this);
        modal.find('.form-wrapper .container').empty();
        Enketo.discardBlobs();
        delete $scope.enketo_report;
      });

      $scope.$root.loadComposer = function() {
        $scope.$parent.loading = true;
        $('#edit-report [name=facility]').select2('val', null);
        Enketo.withAllForms(function(forms) {
          $scope.$parent.availableForms = forms;
          $scope.$parent.loading = false;
        });
      };

      $scope.$root.loadFormFor = function(doc) {
        loadForm(doc.form, doc.content, doc._id);
      };

      $scope.$root.loadXmlFrom = function(formInternalId, content) {
        $('#create-report').modal('hide');
        loadForm(formInternalId, content);
        $('#edit-report').modal('show');
      };

      var loadForm = function(formInternalId, formInstanceData, docId) {
        var formWrapper = $('.edit-report-dialog .form-wrapper');
        Enketo.render(formWrapper, formInternalId, formInstanceData)
          .then(function(form) {
            $scope.enketo_report = {
              formInternalId: formInternalId,
              docId: docId,
              formInstance: form
            };
            formWrapper.show();
          })
          .catch(function(err) {
            return console.error('Error loading form.', err);
          });
      };

      $scope.saveReport = function() {
        if ($scope.enketo_report) {
          saveEnketoReport();
        } else {
          saveJsonReport();
        }
      };

      var saveJsonReport = function() {
        var $modal = $('#edit-report');
        var docId = $modal.find('[name=id]').val();
        var facilityId = $modal.find('[name=facility]').val();
        if (!docId) {
          $modal.find('.modal-footer .note')
            .text($translate.instant('Error updating facility'));
          return;
        }
        if (!facilityId) {
          $modal.find('.modal-footer .note')
            .text($translate.instant('Please select a facility'));
          return;
        }
        var pane = modal.start($modal);
        UpdateFacility(docId, facilityId, function(err) {
          pane.done($translate.instant('Error updating facility'), err);
        });
      };

      var saveEnketoReport = function() {
        var form = $scope.enketo_report.formInstance,
            formInternalId = $scope.enketo_report.formInternalId,
            docId = $scope.enketo_report.docId,
            $modal = $('#edit-report'),
            facilityId = $modal.find('[name=facility]').val();
        form.validate();
        if(form.isValid()) {
          var record = form.getDataStr(),
              $submit = $('.edit-report-dialog .btn.submit');
          $submit.prop('disabled', true);

          Enketo.save(formInternalId, record, docId, facilityId)
            .then(function(doc) {
              if (!docId && $state.includes('reports')) {
                // set selected report
                $state.go('reports.detail', { id: doc._id });
              }
              $submit.prop('disabled', false);
              $('#edit-report').modal('hide');
              form.resetView();
              $('#edit-report .form-wrapper').hide();
            })
            .catch(function(err) {
              $submit.prop('disabled', false);
              console.log('[enketo] Error submitting form data: ' + err);
            });
        }
      };
    }
  ]);
}());
