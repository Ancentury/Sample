var find_address = document.getElementById("findAddress");
find_address.addEventListener("click", function (event) {
  var postal_code = document.getElementById("edit-postal-code").value.replace(/ /g, "").toUpperCase();
  var addressUrl = 'https://national-address-register-statcan.api.canada.ca:443/v1/addresses?naql=mailingAddress.postalCode%20eq%20%22' + postal_code + '%22';
  $.ajax({
    url: addressUrl,
    headers: {
      Accept: 'application/json',
      user_key: 'f4da6f59405b9984e7da29dbd1bf4761'
    }
  })
    .done(function (data) {
      var addressResultEl = document.getElementById("address_result");
      addressResultEl.innerHTML = "";
      if (data === undefined) {
        addressResultEl.innerHTML = "No address match, please try again.";
        return;
      }

      var ulEl = document.createElement("fieldset");

      data.data.forEach(eel => {
        var civicType = eel.civicNumber.Type == null || undefined ? "" : eel.civicNumber.Type + " ";
        var civicPrefix = eel.civicNumber.prefix == null || undefined ? "" : eel.civicNumber.prefix + "-";
        var civicSuffix = eel.civicNumber.civicSuffix == null || undefined ? "" : eel.civicNumber.civicSuffix + " ";
        var civicDirection = eel.streetDirection.code == null || undefined ? "" : eel.streetDirection.code;
        var value = civicType + civicPrefix + eel.civicNumber.number + " " + civicSuffix + eel.streetName + " " + eel.streetType.code + " " + civicDirection;
        var radioBtn = document.createElement("input");
        radioBtn.type = 'radio';
        radioBtn.id = value;
        radioBtn.name = 'address';
        radioBtn.value = value;
        var liEl = document.createElement("label");
        liEl.innerText = value;
        var newline = document.createElement('br');
        ulEl.appendChild(radioBtn);
        ulEl.appendChild(liEl);
        ulEl.appendChild(newline);

      });

      addressResultEl.appendChild(ulEl);
      console.log(data.data[1]);

      var addr = document.getElementsByName('address');
      for (var i = 0; i < addr.length; i++) {
        addr[i].addEventListener('change', function () {
          console.log(this.value);
          document.getElementById('edit-address').value = this.value;
          document.getElementById('edit-city').value = data.data[0].cityName.en;
          document.getElementById('edit-province').value = data.data[0].mailingAddress.province.code;
        });
      }
    })
    .fail(function (data) {
      console.log(data);
    });
});


var prev = document.getElementsByClassName("previous");
var next = document.getElementsByClassName("next");
for (var i = 0; i < prev.length; i++) {
  prev[i].addEventListener("click", function (event) {
    var el = event.target.parentElement.parentElement.parentElement;
    el.previousElementSibling.firstElementChild.click();
    el.parentElement.previousElementSibling.firstElementChild.firstElementChild.click();
  });
}
for (var i = 0; i < next.length; i++) {
  next[i].addEventListener("click", function (event) {
    var el = event.target.parentElement.parentElement.parentElement;
    el.previousElementSibling.firstElementChild.click();
    el.parentElement.nextElementSibling.firstElementChild.firstElementChild.click();
  });
}
