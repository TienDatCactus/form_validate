function validator(opts) {

  var selectorRule = {};

  function validate(inputElement, rule) {
    var error = rule.test(inputElement.value);
    var message = inputElement.parentElement.querySelector(".form-msg");
    if (error) {
      message.innerText = error;
      inputElement.parentElement.classList.add("invalid");
    } else {
      inputElement.parentElement.classList.remove("invalid");
      message.innerText = " ";
    }
  }
  var form = document.querySelector(opts.form);
  opts.rules.forEach(function (rule) {
    // save rules for each input
    selectorRule[rule.selector] = rule.test;

    var inputElement = form.querySelector(rule.selector);
    var message = inputElement.parentElement.querySelector(opts.errorSelector);
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
    console.log(selectorRule)
  });
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
