(function () {

  'use strict';

  exports.init = function(src) {
    var enketo_src = '../static/dist/enketo-demo.html';
    if (src) {
      $.ajax({
        type: 'head',
        url: '/api/auth/' + encodeURIComponent(src),
        success: function() {
          // enable old-style form submission
          var btn = $('#send-record-button');
          btn.closest('li').removeClass('disabled');
          btn.on('click', function(e) {
            e.preventDefault();
            $('#add-record-panel .dropdown-menu').show();
            var iframe = $('#add-record-panel iframe');
            iframe.attr('src', src);
          });

          // enable enketo form submission
          var btn = $('#send-record-enketo');
          btn.closest('li').removeClass('disabled');
          btn.on('click', function(e) {
            e.preventDefault();
            var iframe = $('#add-record-panel iframe');
            iframe.attr('src', enketo_src);
          });

          // enable close button
          $('#add-record-panel .close').on('click', function() {
            $('#add-record-panel .dropdown-menu').hide();
            var iframe = $('#add-record-panel iframe');
          });
        }
      });
    }
  };
  
}());
