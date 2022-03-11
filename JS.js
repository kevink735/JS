$(document).ready(function () {
    // hide boxes on load of dom
    $('#validLicense').hide();
    $('#invalidLicense').hide();
    $('#licenseDetails').hide();
    $('#licenseNotFound').hide();
    // form submit
    $('#eligiblity-form').on('submit', function (e) {
        // prevent default behavior
        e.preventDefault();
        validation();
        var request = new XMLHttpRequest()
        request.open('GET', 'https://www.mocky.io/v2/5dea8af93000001d442b09cd', true)
        request.onload = function () {

            // Begin accessing JSON data here
            var data = JSON.parse(this.response)

           // console.log(data);

            if (request.status >= 200 && request.status < 400) {
                data.forEach(product => {
                    console.log(JSON.stringify(product));
                });

                // get serial number
                var serialNumber = $('#testSerialNumber').val();
                // get product key
                var productKey = $('#testProductKey').val();
                // get email address
                var email = $('#testEmail').val();
                
                 var noshow = 0;
  
                var canUpgrade = data.find(product => product.productKey == productKey &&
                    product.serialNumber == serialNumber &&
                    product.email == email);


                var displayProperties = ['serialNumber', 'productKey', 'email', 'totalSeats', 'totalSeatsInstalled',
                    'totalSeatsEligible', 'maintenance', 'dateRegistered'
                ];         
                // hide the default box
                $('#default').hide();

                if (canUpgrade && canUpgrade.isUpgradeable) 
                {  
                    $('#default').hide();
                    $('#licenseNotFound').hide();
                    $('#invalidLicense').hide();
                    $('#validLicense').show();
                    $('#validLicenseBox').append($('#licenseDetails'));
                    $('#seats').text(canUpgrade.totalSeats);
                    $('#licenseNumber').text("license #" + canUpgrade.serialNumber);
                    console.log(JSON.stringify(canUpgrade));
                } 
                else if (canUpgrade &&  (!canUpgrade.isUpgradeable) ) 
                { 
                    displayProperties.forEach(function (prop) 
                    {
                        console.log(prop + ' : ' + canUpgrade[prop]);
                        if (prop === 'maintenance') 
                        {
                            var maintenanceString = 'Normal maintenance';
                            if (canUpgrade[prop] === true) {
                                maintenanceString = 'Premium Maintenance';
                            }

                            $('#' + prop).text(maintenanceString);
                        } else {
                            $('#' + prop).text(canUpgrade[prop]);
                        }
                    });
                    $('#invalidLicense').show();
                    $('#invalidLicenseBox').append($('#licenseDetails'));
                    $('#licenseDetails').show();
                    $('#licenseNotFound').hide();
                    $('#validLicense').hide();
                    console.log("false " + JSON.stringify(canUpgrade));                 
                }
                 // If a user enters their licensing info that isn’t in the API response, extra credit
                else
                {
                    $('#licenseNotFound').show();
                    $('#validLicense').hide();
                    $('#invalidLicense').hide();
                    $('#licenseDetails').hide();
                }

            } 
            else 
            {
              // any exception
							console.log('error');
            }

        }
        request.send();

    });
});

// General Validation
function validation() {
    var isFormValid = true;
    $(".eligiblity-form .required").each(function () {
        if ($.trim($(this).val()).length == 0) {
            $(this).addClass("input-validation-error");
            isFormValid = false;
        } else {
            $(this).removeClass("input-validation-error");
        }
    });
    if (!isFormValid) {
        alert("Please fill in all the required fields (highlighted in red)");
        return isFormValid;
    }
    else {
        hyphen();
        var reason = "";
        reason += validateEmail(document.getElementById("testEmail"));
        if (reason.length > 0) {
            $(document.getElementById("testEmail")).addClass("input-validation-error");
            return false;
        } else {
            $(document.getElementById("testEmail")).removeClass("input-validation-error");
            return false;
        }
    }
}


// validate email as required field and format
function trim(s) {
    return s.replace(/^\s+|\s+$/, '');
}

function validateEmail(email) 
{
    var error = "";
    var temail = trim(email.value); // value of field with whitespace trimmed off
    var emailFilter = /^[^@]+@[^@.]+\.[^@]*\w\w$/;
    var illegalChars = /[\(\)\<\>\,\;\:\\\"\[\]]/;

    if (email.value == "") {
        document.getElementById('email-error').innerHTML = "Please enter an email address.";
        var error = "2";
    } else if (!emailFilter.test(temail)) { //test email for illegal characters
        document.getElementById('email-error').innerHTML = "Please enter a valid email address.";
        var error = "3";
    } else if (email.value.match(illegalChars)) {
        var error = "4";
        document.getElementById('email-error').innerHTML = "Email contains invalid characters.";
    } else {
        document.getElementById('email-error').innerHTML = '';
    }
    return error;
}

// restrict only 7 characters for serial number
$(".allownumeric").on("keypress keyup blur", function (event) {
    $(this).val($(this).val().replace(/[^\d].+/, ""));
});

// validate if the product key has a hyphen
function hyphen() 
{
    // get product key
    var productKey = $('#testProductKey').val();
    var regex = /^.*-.*$/
    if (regex.test(productKey)) 
    {
        document.getElementById('pkey-error').innerHTML = '';
        return true;
    }
    else 
    {
        $(document.getElementById("testProductKey")).addClass("input-validation-error");
        document.getElementById('pkey-error').innerHTML = "Product Key should contain Hyphen.";
        return false;
    }

}

