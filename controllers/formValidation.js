

function passVal() {
  window.onload = function () {
    console.log("formVal script file has successfully linked");
    document.getElementById("password1").onchange = validatePassword;
    document.getElementById("password2").onchange = validatePassword;
  }
  function validatePassword(){
  var pass2= document.getElementById("password2").value;
  var pass1= document.getElementById("password1").value;
  if(pass1!=pass2)
    document.getElementById("password2").setCustomValidity("Passwords Must Match");
  else
    document.getElementById("password2").setCustomValidity('');
  }

}

function phoneVal() {
  window.onload = function () {
    document.getElementById("phoneInput").onchange = validatePhone;
  }
  function validatePhone() {
  var phone = document.getElementById("phoneInput").value;
  var desiredPattern = "/\d{3}-\d{3}-\d{4}/";
  if(phone != desiredPattern)
    document.getElementById("phoneInput").setCustomValidity("Please follow the format provided: 555-555-5555");
  else
    document.getElementById("password2").setCustomValidity('Great');
  }

}
