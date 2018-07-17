$(document).ready(function () {

  $('input[type=number]').on('keydown', function (e) {
    e = (e) ? e : window.event;
    var charCode = (e.which) ? e.which : e.keyCode;
    var availableChar = [8, 18, 33, 34, 35, 36, 37, 38, 39, 40, 46];
    if (availableChar.indexOf(charCode) != -1) {
      return true;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  });

  $('input[type=tel]').on('keydown', function (e) {
    e = (e) ? e : window.event;
    var charCode = (e.which) ? e.which : e.keyCode;
    if (charCode == 189)  {
      return false;
    }
    return true;
  });

  // Credit Card Behavior >>>
  $("input#creditcard").on('keyup', function() {
      if ($(this).val() == '' || $(this).val() == undefined) {
        $(this).parents('.form-group').prev('.payment-icon').find('svg').removeClass('inactive');
      }
  });
  $("input#creditcard").detectCard({supported:['american-express', 'visa', 'mastercard', 'discover']});
  $("input#creditcard").on("cardChange", function(e, card) {
    if (card.supported == true) {
      $('.payment-icon svg.'+ card.type).parents('a').siblings().find('svg').removeClass('active').addClass('inactive');
      $('.payment-icon svg.'+ card.type).removeClass('inactive');
      $('.payment-icon svg.'+ card.type).addClass('active');
    }
    else {
      $('.payment-icon svg').removeClass('inactive active');
    }
  });
  //  <<< Credit Card Behavior

  $('#checkoutForm')
      .on('init.field.fv', function (e, data) {
        var field = data.field,        // Get the field name
            $field = data.element,      // Get the field element
            bv = data.fv;           // FormValidation instance

        // Create a span element to show valid message
        // and place it right before the field
        var $span = $('<small/>')
            .addClass('help-block validMessage text-success')
            .attr('data-field', field)
            .insertAfter($field)
            .hide();

        // Retrieve the valid message via getOptions()
        var message = bv.getOptions(field).validMessage;
        if (message) {
          $span.html(message);
        }
      })
      .formValidation({
        framework: 'bootstrap4',
        icon: {
          valid: 'fa fa-check',
          invalid: 'fa fa-remove',
          validating: 'fa fa-refresh'
        },
        autoFocus: true,
        fields: {
          // Name field
          name: {
            validMessage: 'Nice to meet you!',
            validators: {
              notEmpty: {
                message: 'The name is required'
              },
              stringLength: {
                max: 30,
                message: 'The name must be more than 6 and less than 30 characters long. '
              },
              // regexp: {
              //     regexp: /^[a-zA-Z' \.]+$/,
              //     message: 'The name can only consist of alphabetical'
              // }
            }
          },
          // Email field
          email: {
            validMessage: 'We will email you a confirmation',
            validators: {
              notEmpty: {
                message: 'The email address is required'
              },
              stringLength: {
                min: 1,
                max: 100,
                message: 'The email address must be more than 6 and less than 30 characters long. '
              },
              regexp: {
                regexp: '^[^@\\s]+@([^@\\s]+\\.)+[^@\\s]+$',
                message: 'The value is not a valid email address'
              }
            }
          },
          // phone number field
          phonenumber: {
            validMessage: 'We will only contact you about your order',
            validators: {
              notEmpty: {
                message: 'Please supply a phone number so we can call if there are any problems using this address.'
              },
              stringLength: {
                min: 10,
                message: 'Not a valid 10-digit US phone number.'
              }
            }
          },
          // zip code field
          zipcode: {
            validMessage: null,
            validators: {
              stringLength: {
                min: 5,
                message: 'The zip code must be 5 number long '
              },
              notEmpty: {
                message: 'The zip code is required'
              },
            }
          },
          // The City  field
          city: {
            validMessage: 'That was easy!',
            validators: {
              stringLength: {
                max: 50,
                message: 'The city must be less than 50 characters long. '
              },
              notEmpty: {
                message: 'The city is required'
              }
            }
          },
          // address field
          address: {
            validMessage: 'We ship anywhere in the USA',
            validators: {
              stringLength: {
                min: 1,
                max: 100,
                message: 'The address must be less than 100 characters long. '
              },
              notEmpty: {
                message: 'The address is required'
              }
            }
          },
          address2: {
            validators: {
              stringLength: {
                min: 1,
                max: 100,
                message: 'The address2 must be less than 100 characters long. '
              }
            }
          },
          // Card Number
          creditcard: {
            validMessage: 'Your credit card looks great!',
            validators: {
              creditCard: {
                message: 'The credit card number is not valid'
              },
              notEmpty: {
                message: 'Please enter a valid card number'
              },
              // // stringLength: {
              //   min: 15,
              //   message: 'The credit card can be 15 or 16 digits. '
              // }
            }
          },
          // State
          state: {
            validMessage: null,
            validators: {
              notEmpty: {
                message: 'The State is required'
              }
            }
          },
          // Security Code
          securitycode: {
            validators: {
              notEmpty: {
                message: 'The Security Code is required'
              }
            }
          },
          // Month
          month: {
            validators: {
              notEmpty: {
                message: 'The Month is required'
              },
              callback: {
                message: 'Please set month more or equal current',
                callback: function(value, validator, $field) {
                  var currentDate = new Date();
                  var year = parseInt(currentDate.getYear());

                  var selectedYear = 100 + parseInt($('#checkoutForm').find('[name=year]').val());

                  if (selectedYear == year) {
                    return (parseInt(value)-1 >= parseInt(currentDate.getMonth()));
                  }
                  else {
                    return true;
                  }
                }
              }
            }
          },
          // Year
          year: {
            validators: {
              notEmpty: {
                message: 'The Year is required'
              },
              callback: {
                message: 'Please set year more or equal current',
                callback: function(value, validator, $field) {
                  var currentDate = new Date();
                  var yearCondition = 100+parseInt(value) >= parseInt(currentDate.getYear());

                  if (100+parseInt(value) > parseInt(currentDate.getYear())) {
                    $('#checkoutForm').find('[name=month]').parents('.form-group').removeClass('has-warning').addClass('has-success');
                    $('#checkoutForm').find('[name=month]').next('.text-success').show();
                    $('#checkoutForm').find('[name=month]').nextAll('.form-control-feedback').hide();
                    $('#checkoutForm').find('[name=month]').nextAll('.fa ').removeClass('fa-remove').addClass('fa-check');
                  }
                  // else if(100+parseInt(value) < parseInt(currentDate.getYear())) {
                  //   $('#checkoutForm').find('[name=month]').parents('.form-group').removeClass('has-success').addClass('has-warning');
                  //   $('#checkoutForm').find('[name=month]').next('.text-success').hide();
                  //   $('#checkoutForm').find('[name=month]').nextAll('.form-control-feedback').hide();
                  //   $('#checkoutForm').find('[name=month]').nextAll('.fa ').removeClass('fa-remove').addClass('fa-check');
                  // }

                  return yearCondition;
                }
              }
            }
          }
        }
      })
      .on('err.field.fv', function(e, data) {
      })
      .on('success.validator.fv', function(e, data) {
      })
      .on('err.form.fv', function (e, data) {
      })
      .on('success.form.fv', function (e, data) {
      })
      .on('success.field.fv', function (e, data) {
        var field = data.field,        // Get the field name
            $field = data.element;      // Get the field element

        // Show the valid message element
        $field.next('.validMessage[data-field="' + field + '"]').show();

        if(data.fv.getInvalidFields().length == 0) {
          if ($('#checkoutForm .fv-has-feedback.has-warning').length > 0) {
            $('#checkoutForm .btn-complete').removeClass('pulse');
          }
          else {
            if ($('#checkoutForm .fv-has-feedback.has-success').length >= 10) {
              $('#checkoutForm .btn-complete').addClass('pulse');
            }
            else {
              $('#checkoutForm .btn-complete').removeClass('pulse');
            }
          }
        }
        else {
          $('#checkoutForm .btn-complete').removeClass('pulse');
        }
      })
      .on('err.field.fv', function (e, data) {
        var field = data.field,        // Get the field name
            $field = data.element;      // Get the field element

        if(data.fv.getInvalidFields().length == 0) {
          if ($('#checkoutForm .fv-has-feedback.has-warning').length > 0) {
            $('#checkoutForm .btn-complete').removeClass('pulse');
          }
          else {
            if ($('#checkoutForm .fv-has-feedback.has-success').length >= 10) {
              $('#checkoutForm .btn-complete').addClass('pulse');
            }
            else {
              $('#checkoutForm .btn-complete').removeClass('pulse');
            }
          }
        }
        else {
          $('#checkoutForm .btn-complete').removeClass('pulse');
        }

        // Show the valid message element
        $field.next('.validMessage[data-field="' + field + '"]').hide();
      });

// $('#phonenumber').keyup(function() {
//   var phonenumberspacing = $(this).val().split("-").join("");
//   if (phonenumberspacing.length > 0) {
//     phonenumberspacing = phonenumberspacing.match(new RegExp('.{1,3}', 'g')).join("-");
//   } 
//   $(this).val(phonenumberspacing);
// });

});
jQuery(function ($) {
  $('input[name=creditcard]').mask('0000000000000000', {'translation': {0: {pattern: /[0-9*]/}}});
  $('input[name=phonenumber]').mask('000-000-0000', {'translation': {0: {pattern: /[0-9*-]/}}});
  $('input[name=zipcode]').mask('00000', {'translation': {0: {pattern: /[0-9]/}}});
});
 