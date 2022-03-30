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
        radioBtn.id = value.replace(/ /g, "-");
        radioBtn.name = 'address';
        radioBtn.value = value;

        var liEl = document.createElement("label");
        liEl.setAttribute("for", radioBtn.id);
        liEl.innerText = value;
        var newline = document.createElement('br');
        ulEl.appendChild(radioBtn);
        ulEl.appendChild(liEl);
        ulEl.appendChild(newline);

      });

      addressResultEl.appendChild(ulEl);

      var addr = document.getElementsByName('address');
      for (var i = 0; i < addr.length; i++) {
        addr[i].addEventListener('change', function () {
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
var breadcrumbIcon = '<span class="glyphicon glyphicon-unchecked"></span><span class="wb-inv">(current page)</span> ';
for (var i = 0; i < prev.length; i++) {
  prev[i].addEventListener("click", function(event) {
    var el = event.target.parentElement.parentElement.parentElement;
    el.previousElementSibling.firstElementChild.setAttribute("data-toggle", "collapse");
    el.previousElementSibling.firstElementChild.click();
    el.previousElementSibling.firstElementChild.setAttribute("data-toggle", "");
    el.parentElement.previousElementSibling.firstElementChild.firstElementChild.setAttribute("data-toggle", "collapse");
    el.parentElement.previousElementSibling.firstElementChild.firstElementChild.click();
    el.parentElement.previousElementSibling.firstElementChild.firstElementChild.setAttribute("data-toggle", "");
    var breadcrumbId = el.parentElement.previousElementSibling.firstElementChild.firstElementChild.getAttribute("aria-controls").substring(0,6).replace("edit", "breadcrumb");
    document.querySelector("#"+breadcrumbId).innerHTML = breadcrumbIcon + "<strong>" + document.querySelector("#"+breadcrumbId).innerHTML + "</strong>";
    var breadcrumbTxt = document.querySelector("#"+breadcrumbId).nextElementSibling.innerText.replace("(current page)","");
    document.querySelector("#"+breadcrumbId).nextElementSibling.innerHTML=breadcrumbTxt;
  });
}
for (var i = 0; i < next.length; i++) {
  next[i].addEventListener("click", function(event) {
    var el = event.target.parentElement.parentElement.parentElement;
    el.previousElementSibling.firstElementChild.setAttribute("data-toggle", "collapse");
    el.previousElementSibling.firstElementChild.click();
    el.previousElementSibling.firstElementChild.setAttribute("data-toggle", "");
    el.parentElement.nextElementSibling.firstElementChild.firstElementChild.setAttribute("data-toggle", "collapse");
    el.parentElement.nextElementSibling.firstElementChild.firstElementChild.click();
    el.parentElement.nextElementSibling.firstElementChild.firstElementChild.setAttribute("data-toggle", "");
    var breadcrumbId = el.parentElement.nextElementSibling.firstElementChild.firstElementChild.getAttribute("aria-controls").substring(0,6).replace("edit", "breadcrumb");
    document.querySelector("#"+breadcrumbId).innerHTML = breadcrumbIcon + "<strong>" + document.querySelector("#"+breadcrumbId).innerHTML + "</strong>";
    var breadcrumbTxt = document.querySelector("#"+breadcrumbId).previousElementSibling.innerText.replace("(current page)","");
    document.querySelector("#"+breadcrumbId).previousElementSibling.innerHTML=breadcrumbTxt;
  });
}

var submitBtn = document.querySelector(".webform-button--submit");
var panelBtns = document.querySelectorAll(".panel-heading a");
panelBtns.forEach(panelBtn => panelBtn.setAttribute("data-toggle", ""));
if (submitBtn != null){
  submitBtn.addEventListener("click", function(){
    panelBtns.forEach(panelBtn => {
      if(panelBtn.getAttribute("aria-expanded")!="true"){
        panelBtn.setAttribute("data-toggle", "collapse");        
        panelBtn.click();
      }
    });
    document.querySelectorAll(".previous").forEach(previousBtn=>previousBtn.disabled = true);
    document.querySelectorAll(".next").forEach(previousBtn=>previousBtn.disabled = true);
  });
}
