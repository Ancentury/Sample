var find_address = document.getElementById("findAddress");
      find_address.addEventListener("click", function(event) {
        var postal_code = document.getElementById("edit-postal-code").value.replace(/ /g, "").toUpperCase();
        var addressUrl = 'https://national-address-register-statcan.api.canada.ca:443/v1/addresses?naql=mailingAddress.postalCode%20eq%20%22' + postal_code + '%22';     
        $.ajax({
          url: addressUrl, 
          headers:{
            Accept: 'application/json',
            user_key: 'f4da6f59405b9984e7da29dbd1bf4761'
          }
        })
        .done(function(data){
          var addressResultEl=document.getElementById("address_result");
          addressResultEl.innerHTML="";
          var ulEl=document.createElement("fieldset");
          
          data.data.forEach(eel=>{
            var value=eel.civicNumber.number + " " + eel.streetName +" " + eel.streetType.code + " " + eel.streetDirection.code + " " + eel.cityName.en + " " + eel.province.code + " " + eel.mailingAddress.postalCode;
            var radioBtn = document.createElement("input");
            radioBtn.type='radio';
            radioBtn.id=value;
            radioBtn.name='address';
            radioBtn.value=value;
            var liEl=document.createElement("label");
            liEl.innerText=value;
            var newline = document.createElement('br');
            ulEl.appendChild(radioBtn);
            ulEl.appendChild(liEl);
            ulEl.appendChild(newline);
          });
          addressResultEl.appendChild(ulEl);
          console.log(data.data[1]);
        })
        .fail(function(data){
           console.log(data);
        });          
      });
