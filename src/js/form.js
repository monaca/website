"use strict";

$(function() {
  var formUtil = {
    setSelectOptions: function(id, keyValues) {
      $('#' + id + ' > option').remove();
      for (var key in keyValues) {
        $('#' + id).append($('<option>').html(keyValues[key]).val(key));
      }
    },
    setCheckboxOptions: function(id, name, keyValues, labelClass) {
      $('#' + id + ' > label').remove();
      for (var key in keyValues) {
        $('#' + id).append('<label class="'+labelClass+'"><input type="checkbox" name="' + name + '" value="' + key + '">'+ keyValues[key] +'</label>');
      }
    },
    displayError: function(id, str) {
      $('#' + id).html(str);
      $('#' + id).css('display', 'block');
    },
    resetError: function() {
      $('.form-error').css('display', 'none');
    },
    setTicketBaloon: function(id, list) {
      $("#" + id).nextAll().remove();
      list = list.reverse();
      for (var key in list) {
        $("#" + id).after('<tr><td>' + list[key]['created_date'] + '</td><td>' + list[key]['expire_date'] + '</td>')
      }
    },
    getCssNameFromString: function(str) {
      if (str.substr(0, 1) == '_') {
        str = str.substr(1);
      }
      return str.replace('_', '-');
    }

  };

  window.formUtil = formUtil;
});