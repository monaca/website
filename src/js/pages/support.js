(function() {
  window.monacaPages = window.monacaPages || [];

  monacaPages["/support/inquiry.html"] = function (loginData) {
  };

  monacaPages["/support/technical/index.html"] = function (loginData) {
    var params = monacaApi.getUrlVars();
    var tag = params.tag;
    var initFormData;

    if (tag != 'bugs') {
      tag = 'technical';
    }

    console.log(params);

    loginData.onPreReady(function() {
      if (!loginData.status.isLogin) {
        displayLoginError();
      }
    });

    loginData.onReady(function() {
      console.log(loginData);

      if (!loginData.status.isLogin) {
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
          console.log(JSON.stringify(msg));

          if (msg.result && msg.result.initOK) {
            initFormData = msg.result.initOK;
            setTicket(initFormData);
            displayForm(tag, initFormData);
            return;
          }

          if (msg.result == 'loginError') {
            displayLoginError();
          } else if (msg.result == 'planError') {
            displayPlanError();
          } else {
            displayUnknownError();
          }
        },
        error: function(msg) {
          console.log('error!');
          console.log(JSON.stringify(msg));
          displayUnknownError();
        }
      });

      $('#show-support-ticket').click(function() {
        $('#support-ticket-balloon').toggle();
      });

      $("#send").click(function() {
        formUtil.resetError();
        var sendData = createSendData();
        console.log(sendData);

        $.ajax( {
          type : "POST",
          url : monacaApi.getBaseUrl() + "/" + window.LANG + "/support/technical_io/" + tag,
          xhrFields: {
            withCredentials: true
          },
          data: sendData,
          dataType: "json",
          success: function(msg) {
            console.log(msg);

            if (msg.result == 'submitOK') {
              displayFinishPage();
            } else if (msg.result && msg.result.formError) {
              displayFormError(msg.result.formError);
            } else {
              displayUnknownError();
            }
          },
          error: function(msg) {
            console.log(JSON.stringify(msg));
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
    }

    function displayFormError(data) {
      formUtil.resetError();
      for (var key in data) {
        var col = formUtil.getCssNameFromString(key);
        if (col != 'csrf-token') {
          $('#' + col + '-error').html(data[key]);
        }
        $('#' + col + '-error').css('display', 'block');
      }
    }

    function displayLoginError() {

    }

    function displayPlanError()  {

    }

    function displayUnknownError() {

    }

    function displayFinishPage() {

    }

    function createSendData() {
      var sendData = {
        "tag": tag,
        "support[support_type]": $('#support-type').val(),
        "support[message]": $('#message').val(),
        "support[project_id]": $('#project-id').val(),
        "support[device_os_other]": $('#device-os-other').val(),
        "support[user_name]": loginData.getProfileColumn('name'),
        "support[user_email]": loginData.getProfileColumn('email'),
        "support[_csrf_token]": initFormData['_csrf_token'],
        "support[subject]": $('#subject').val(),
        "support[product_type]": $('#product-type').val()
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
})();