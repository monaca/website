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
    setRadioOptions: function(id, name, keyValues, labelClass) {
      $('#' + id + ' > label').remove();
      for (var key in keyValues) {
        $('#' + id).append('<li class="'+labelClass+'"><label><input type="radio" name="' + name + '" value="' + key + '">'+ keyValues[key] +'</label></li>');
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
    },
    disableAllInput: function() {
      this.toggleAllInput(true);
    },
    enableAllInput: function() {
      this.toggleAllInput(false);
    },
    toggleAllInput: function(disabled) {
      var elements = ['input', 'select', 'textarea'];
      for (var key in elements) {
        if (disabled) {
          $(elements[key]).attr('disabled', 'disabled');
        } else {
          $(elements[key]).removeAttr('disabled');
        }
      }
    },
    displayFormError: function(data) {
      this.resetError();
      for (var key in data) {
        var col = this.getCssNameFromString(key);
        if (col != 'csrf-token') {
          $('#' + col + '-error').html(data[key]);
        }
        $('#' + col + '-error').css('display', 'block');
        location.href = '#';
      }
    }
  };

  window.formUtil = formUtil;
});