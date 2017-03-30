(function() {
  window.monacaPages = window.monacaPages || [];

  monacaPages["/support/inquiry.html"] = function (loginData) {
    var params = monacaApi.getUrlVars();
    var initFormData;

    loginData.autoDisplay = false;
    displayBody();
    showLoading("support-inquiry", "loading");
    
    if(!loginData.status.isLogin) document.getElementById('link_technical_to').href += '?tag=bugs';
    
    loginData.onReady(function() {
      $.ajax({
        type: "GET",
        url: monacaApi.getBaseUrl() + "/" + window.LANG + "/support/inquiry_io",
        xhrFields: {
          withCredentials: true
        },
        dataType: "json",
        success: function(msg) {
          hideLoading("support-inquiry", "loading");

          if (msg.result && msg.result.initOK) {
            initFormData = msg.result.initOK;
            displayForm(initFormData);
            return;
          }
          displayUnknownError();
        },
        error: function(msg) {
          hideLoading("support-inquiry", "loading");
          displayUnknownError();
        }
      });

      $("#send").click(function() {
        formUtil.disableAllInput();
        var sendData = createSendData();

        $.ajax( {
          type: "POST",
          url: monacaApi.getBaseUrl() + "/" + window.LANG + "/support/inquiry_io",
          xhrFields: {
            withCredentials: true
          },
          data: sendData,
          dataType: "json",
          success: function(msg) {
            formUtil.enableAllInput();

            if (msg.result == 'submitOK') {
              displayFinishPage();
            } else if (msg.result && msg.result.formError) {
              formUtil.displayFormError(msg.result.formError);
            } else {
              displayUnknownError();
            }
          },
          error: function(msg) {
            formUtil.enableAllInput();
            displayUnknownError();
          }
        });

        return false;
      });
    });

    function displayForm(data) {
      formUtil.resetError();
      formUtil.setRadioOptions('question-type-radio', 'inquiry[quiestion_type]', data.question_types, 'question-type');
      formUtil.setSelectOptions('product-type', data.product_types);
      formUtil.setSelectOptions('subject',      data.subjects);
      $('#name').val(loginData.getProfileColumn('name'));
      $('#email').val(loginData.getProfileColumn('email'));
      displayBody();
    }

    function displayUnknownError(tag) {
      formUtil.resetError();
      $('#csrf-token-error').css('display', 'block');
      displayBody();
    }

    function createSendData() {
      var sendData = {
        "inquiry[message]":      $('#message').val(),
        "inquiry[name]":         $('#name').val(),
        "inquiry[email]":        $('#email').val(),
        "inquiry[_csrf_token]":  initFormData['_csrf_token'],
        "inquiry[subject]":      $('#subject').val(),
        "inquiry[product_type]": $('#product-type').val()
      };

      $('#question-type-radio :radio:checked').each(function(){
        sendData['inquiry[question_type]'] = $(this).val();
      });

      return sendData;
    }
  };

  monacaPages["/support/technical/index.html"] = function (loginData) {
    var params = monacaApi.getUrlVars();
    var tag = params.tag;
    var initFormData;

    loginData.autoDisplay = false;
    displayBody();
    showLoading("support-tech", "loading");

    if (tag != 'bugs') {
      tag = 'technical';
    }

    loginData.onPreReady(function() {
      if (!loginData.status.isLogin) {
        displayLoginError(tag);
      }
    });

    loginData.onReady(function() {
      if (!loginData.status.isLogin) {
        hideLoading("support-tech", "loading");
        return;
      }

      $("#email").html(loginData.getProfileColumn('email'));
      $("#gravatar").attr('src', loginData.getProfileColumn('gravatar'));

      $.ajax({
        type: "GET",
        url: monacaApi.getBaseUrl() + "/" + window.LANG + "/support/technical_io/" + tag,
        xhrFields: {
          withCredentials: true
        },
        dataType: "json",
        success: function(msg) {
          hideLoading("support-tech", "loading");

          if (msg.result && msg.result.initOK) {
            initFormData = msg.result.initOK;
            setTicket(initFormData);
            displayForm(tag, initFormData);
            return;
          }

          if (msg.result == 'loginError') {
            displayLoginError(tag);
          } else if (msg.result == 'planError') {
            displayPlanError(tag);
          } else {
            displayUnknownError();
          }
        },
        error: function(msg) {
          hideLoading("support-tech", "loading");
          displayUnknownError();
        }
      });

      $('#show-support-ticket').click(function() {
        $('#support-ticket-balloon').toggle();
      });

      $("#send").click(function() {
        formUtil.disableAllInput();
        var sendData = createSendData();

        $.ajax( {
          type: "POST",
          url: monacaApi.getBaseUrl() + "/" + window.LANG + "/support/technical_io/" + tag,
          xhrFields: {
            withCredentials: true
          },
          data: sendData,
          dataType: "json",
          success: function(msg) {
            formUtil.enableAllInput();

            if (msg.result == 'submitOK') {
              displayFinishPage();
            } else if (msg.result && msg.result.formError) {
              formUtil.displayFormError(msg.result.formError);
            } else {
              console.log(msg);
              displayUnknownError(tag);
            }
          },
          error: function(msg) {
            console.log(msg);
          }
        });

        return false;
      });
    });

    function setTicket(data) {
      $('.ticket-retain').html(data.ticketCount);
      formUtil.setTicketBaloon('ticket-title-tr', data.tickets);

      if (!data.ticketCount) {
        $('#show-support-ticket').css('display', 'none');
      }
    }

    function displayForm(tag, data) {
      formUtil.resetError();
      formUtil.setSelectOptions('support-type', data.support_types);
      formUtil.setSelectOptions('product-type', data.product_types);
      formUtil.setSelectOptions('subject',      data.subjects);
      formUtil.setSelectOptions('project-id',   data.projects);
      formUtil.setCheckboxOptions('device-checkbox', 'support[device_os][]', data.devices, 'device-label');
      displayFormParts(tag);
      $('#form-container').css('display', 'block');
      displayBody();
    }

    function displayFormParts(tag) {
      var erase_tag = 'technical';
      if (tag == 'technical') {
        erase_tag = 'bugs';
      }
      $('.for-'+erase_tag).css('display', 'none');
    }

    function displayLoginError(tag) {
      $('#login-error-container').css('display', 'block');
      $('#plan-error-container').css('display', 'none');
      displayFormParts(tag);
      displayBody();

      $("#exec-login-for-support").click(function() {
        location.href = '/login/?url=' + encodeURIComponent('/support/technical/?tag=' + tag);
      });
    }

    function displayPlanError(tag)  {
      $('#login-error-container').css('display', 'none');
      $('#plan-error-container').css('display', 'block');
      $('#form-container').css('display', 'none');
      $('#support-index').css('display', 'block');
      displayFormParts(tag);
      displayBody();
    }

    function displayUnknownError(tag) {
      formUtil.resetError();
      $('#form-container').css('display', 'block');
      $('#csrf-token-error').css('display', 'block');
      displayFormParts(tag);
      displayBody();
    }

    function createSendData() {
      var sendData = {
        "tag": tag,
        "support[support_type]":    $('#support-type').val(),
        "support[message]":         $('#message').val(),
        "support[project_id]":      $('#project-id').val(),
        "support[device_os_other]": $('#device-os-other').val(),
        "support[user_name]":       loginData.getProfileColumn('name'),
        "support[user_email]":      loginData.getProfileColumn('email'),
        "support[_csrf_token]":     initFormData['_csrf_token'],
        "support[subject]":         $('#subject').val(),
        "support[product_type]":    $('#product-type').val()
      };

      if ($('#agree-support').filter(':checked')) {
        sendData['support[agree_support]'] = $('#agree-support').filter(':checked').val();
      }

      $('#device-checkbox :checkbox:checked').each(function(){
        sendData['support[device_os]["' + $(this).val() + '"]'] = $(this).val();
      });

      return sendData;
    }
  };

  function displayFinishPage() {
    location.href='/support/thankyou.html';
  }
})();
