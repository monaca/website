(function () {
  window.monacaPages = window.monacaPages || [];

  monacaPages["/service/estimate/index.html"] = function (loginData) {
    $('.form-error').hide();
    $('.form-error-detail').hide();


    $('#send_feedback').on('click', function (event) {
      // disable submit button
      $('#send_feedback').prop('disabled', true);
      
      let budgetEle = $('#budget option:selected');
      if (!budgetEle.val()) {
        $('#content #budget + p.form-error').show();
        $('#send_feedback').prop('disabled', false);
        return;
      }

      // setup parameters to send
      var data = {};
      $('#content input[type=text],textarea').each(function (index, el) {
        data[$(el).attr('name')] = $(el).val();
      });
      data.comment = "ご予算:" + $('#budget option:selected').text() + "\n" + data.comment;
      
      $('.form-error').hide(); // hide old errors

      

      const _dmains = freeMailDomains.join('|');
      const regexp = `^(?=.*@(${_dmains})).+$`; //stop free mail domain
      if ((new RegExp(regexp)).test($('input[name="email"]').val())) {
        $('#content input[name="email"] ~ p.form-error')
        .html("独自ドメインメールをご入力ください。").show();

        $('#send_feedback').prop('disabled', false);
        return;
      }

      // post estimate API
      $.ajax({
        type: 'POST',
        url: 'https://shop.asial.co.jp/api/estimate.php',
        dataType: 'json',
        data: data,
        success: function (data) {

          // error!
          if (data.success != 1) {
            for (var name in data.errors) {
              if (name == 'comment') {
                // show textarea error
                $('#content textarea[name=' + name + ']').closest('table').find('p.form-error-detail').html(data.errors[name]).show();
              } else {
                // show input[text] error
                $('#content input[name=' + name + '] + p.form-error')
                  .html(data.errors[name])
                  .show();
              }
            }

            // enable submit button
            $('#send_feedback').prop('disabled', false);
            return;
          }

          // success!
          location.href = '/service/estimate/thankyou.html';
        },
        error: function () {
          alert('データ送信中にエラーが発生しました');
        }
      });
    });
  }

  const freeMailDomains = [
    'gmail.com',
    'yahoo',
    'hotmail',
    'aol.com',
    'msn.com',
    'live.com',
    'mac.com',
    'facebook.com',
    'icloud',
    'outlook',
    'ezweb.ne.jp',
    'ido.ne.jp',
    'biz.ezweb.ne.jp',
    'augps.ezweb.ne.jp',
    'uqmobile.jp',
    'docomo.ne.jp',
    'mopera.net',
    'dwmail.jp',
    'pdx.ne.jp',
    'wcm.ne.jp',
    'willcom.com',
    'y-mobile.ne.jp',
    'emnet.ne.jp',
    'emobile-s.ne.jp',
    'emobile.ne.jp',
    'ymobile1.ne.jp',
    'ymobile.ne.jp',
    'jp-c.ne.jp',
    'jp-d.ne.jp',
    'jp-h.ne.jp',
    'jp-k.ne.jp',
    'jp-n.ne.jp',
    'jp-q.ne.jp',
    'jp-r.ne.jp',
    'jp-s.ne.jp',
    'jp-t.ne.jp',
    'sky.tkc.ne.jp',
    'sky.tkk.ne.jp',
    'sky.tu-ka.ne.jp',
    'disney.ne.jp',
    'i.softbank.jp',
    'softbank.ne.jp',
  ]
})();