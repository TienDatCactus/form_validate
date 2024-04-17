function validator(opts) {
  var selectorRules = {};
  function validate(inputElement, rule) {
    var error = inputElement.parentElement.querySelector(opts.errorSelector);
    var message;

    // takes out rules of selector
    var ruled = selectorRules[rule.selector];
    // loop through rules & check
    // if error exists , stop
    for (var i = 0; i < ruled.length; ++i) {
      message = ruled[i](inputElement.value);
      if (message) break;
    }

    if (message) {
      error.innerText = message;
      inputElement.parentElement.classList.add("invalid");
    } else {
      inputElement.parentElement.classList.remove("invalid");
      error.innerText = " ";
    }

    return !message;
  }
  var form = document.querySelector(opts.form);
  if (form) {
    form.onsubmit = function (e) {
      e.preventDefault();

      let isValid = true;

      opts.rules.forEach(function (rule) {
        var inputElement = form.querySelector(rule.selector);
        var valid = validate(inputElement, rule);
        if (!valid) {
          isValid = false;
        }
      });

      if (isValid) {
        // submit with js
        if (typeof opts.onSubmit === "function") {
          var formData = form.querySelectorAll("[name]");
          var formValue = Array.from(formData);
          formValue.reduce(function (values, input) {
            return (values[input.name] = input.value) && values;
          }, {});
          opts.onSubmit(formValue);
        } // submit with default event
        else {
          form.submit();
        }
      }
    };
    // loop through and process ( events )
    opts.rules.forEach(function (rule) {
      // save rules for each input
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }
      var inputElement = form.querySelector(rule.selector);
      var message = inputElement.parentElement.querySelector(
        opts.errorSelector
      );
      if (inputElement) {
        // blur out of input
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };

        // while input
        inputElement.oninput = function () {
          inputElement.parentElement.classList.remove("invalid");
          message.innerText = "";
        };
      }
    });
  }
}

// Định nghĩa rule
// 1. Khi có lỗi -> Trả ra msg lỗi
// 2. Khi ko có lỗi -> ko trả ra gì (undefined)
validator.isRequired = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : "Please enter your information !";
    },
  };
};

validator.isEmail = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      return regex.test(value)
        ? undefined
        : "Please enter your Email correctly !";
    },
  };
};

validator.minLength = function (selector, min) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : `Please enter a minimum length of ${min}`;
    },
  };
};

validator.checkPass = function (selector, getPass) {
  return {
    selector: selector,
    test: function (value) {
      return value.length != 0
        ? value.includes(getPass())
          ? undefined
          : `Passwords do not match !`
        : "Please enter your password first!";
    },
  };
};
