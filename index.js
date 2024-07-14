
        // try again btn
        const tryagainBtn = document.getElementById('tryagainBtn');
        tryagainBtn.style.display = "none";

        // try again vehicle number
        const tryagainVBtn = document.getElementById('tryagainVBtn');
        tryagainVBtn.style.display = "none";


        // OTP input group
        const phoneNumCont = document.getElementById('phoneNumCont');
        const otpNum = document.getElementById('otpNumCont');
        otpNum.style.display = "none";



        var numberInput = document.getElementById('phoneNum');
        var phoneBtn = document.getElementById('phoneBtn');
        var otpBtn = document.getElementById('otpBtn');
        var otpVBtn = document.getElementById('otpVBtn');

        // hide on initial page load
        phoneBtn.style.display = "none";

        otpBtn.disabled = true;

        numberInput.addEventListener('input', function (event) {
            var inputValue = event.target.value;
            var sanitizedValue = inputValue.replace(/[^0-9]/g, '');
            event.target.value = sanitizedValue;

            if (sanitizedValue.length === 10) {
                otpBtn.disabled = false;
            }
            else {
                otpBtn.disabled = true;
            }

        });

        // disable QR search button on empty and page load
        const btnSerialS = document.getElementById('btnSerialS');

        btnSerialS.disabled = true;

        function validateEmpty() {
            const serialNumberD = document.getElementById("serialNum").value;

            if (serialNumberD.length > 5) {
                btnSerialS.disabled = false;
            }
            else {
                btnSerialS.disabled = true;
            }
        }
        // disable OTP button on empty and page load


        phoneBtn.disabled = true;

        function validateEmptyOTP() {

            const otpNumValuetest = document.getElementById("otpNum").value;
            if (otpNumValuetest.length > 4) {
                phoneBtn.disabled = false;
            }
            else {
                phoneBtn.disabled = true;
            }
        }

        // disable- Search vehicle number button on empty and page load


        otpVBtn.disabled = true;

        function validateVEmptyOTP() {

            const otpVNumValuetest = document.getElementById("vehicleNum").value;
            var re = /^[A-Z|0-9]{1,3}[-][0-9]{4}$/;
            if (!re.test(otpVNumValuetest)) {
                otpVBtn.disabled = true;
            }
            else {
                otpVBtn.disabled = false;
            }
        }



        ///

        // get otp
        function otpVerity() {

            this.disabled = true;

            const hostNm = window.location.host;
            const mobileNo = numberInput.value;

            const apiUrl = `https://${hostNm}/Api/security/user-for-request-otp`;

            const postData = {
                MobileNo: mobileNo
            };

            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            })
                .then(response => response.json())
                .then(data => {

                    if (data.status === 200) {
                        // on otp success
                        console.log(data);
                        otpNum.style.display = "flex";
                        phoneBtn.style.display = "block";
                        otpBtn.style.display = "none";
                    }

                    else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Mobile Number Does Not Exist!'
                        });
                        otpNum.style.display = "none";
                    }




                })
                .catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Mobile Number Does Not Exist!'
                    });
                    otpNum.style.display = "none";

                });


        }

        function getWdata() {
            const hostName = window.location.host;
            const serialNumber = document.getElementById("serialNum").value;

            var warrantyLink = document.getElementById("warrantyLink");
            const url = `https://${hostName}/Api/get-check-warranty-activetion-by-qr?qr=${serialNumber}`;
            warrantyLink.style.display = "none";


            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`No Information available. Please re-check the Serial Number again.`);
                    }
                    return response.json();
                })
                .then(data => {

                    console.log("QR", data);

                    if (!data.data || data.data.length === 0) {
                        Swal.fire({
                            title: 'No Data Available',
                            text: 'Please contact the nearest Browns dealer point or the Browns showrooms for further information',
                            icon: 'info',
                            confirmButtonText: 'Ok',
                        }).then((result) => {
                            if (result.isConfirmed) {
                            }
                        });
                        // Reset the displayed values
                        resetDisplayedValues();
                    } else {

                        if (data.flag) {
                            const firstData = data.data[0];
                            if (firstData != null) {

                                // bind value to view warranty card
                                if (firstData.isShowEWorrantyCard) {
                                    warrantyLink.href = `https://${hostName}/E-warranty-card-View?qr=${firstData.qr}&m=1`;
                                    warrantyLink.style.display = "block";
                                }


                                document.getElementById("idContentManagement").innerHTML = firstData.contentManagement.htmlContent;
                                // document.getElementById("modal-435258").style.display = "block"

                                document.getElementById("trConsumerName").style.display = "revert";
                                document.getElementById("trConsumerAddress").style.display = "revert";
                                // document.getElementById("trConsumerContactNo").style.display = "revert";
                                document.getElementById("idWarrantyActivatedDate").style.display = "revert";
                                document.getElementById("trWarrantyExpiryDate").style.display = "revert";
                                document.getElementById("trRemainingWarrantyPeriod").style.display = "revert";
                                document.getElementById("trStatus").style.display = "revert";
                                document.getElementById("trproRataExpiryDate").style.display = "revert"
                                document.getElementById("trdealerCode").style.display = "revert"
                                document.getElementById("trdealerName").style.display = "revert"
                                document.getElementById("trMSG").style.display = "none"

                                document.getElementById("serialNumber").textContent = firstData.serialNumber;
                                document.getElementById("productName").textContent = firstData.productName;
                                document.getElementById("productCode").textContent = firstData.productCode;
                                document.getElementById("consumerName").textContent = firstData.consumerName;
                                document.getElementById("consumerAddress").textContent = firstData.consumerAddress;
                                //document.getElementById("consumerContactNo").textContent = firstData.consumerNumber;
                                document.getElementById("warrantyActivatedDate").textContent = formatDate(firstData.warrantyActivatedDate);
                                document.getElementById("warrantyExpiryDate").textContent = formatDate(firstData.warrantyExpiryDate);
                                document.getElementById("warrantyPeriod").textContent = firstData.warrantyPeriod + " months";
                                document.getElementById("RemainingWarrantyPeriod").textContent = firstData.remainingWarrantyPeriod;
                                document.getElementById("status").textContent = firstData.warrantyStatus;
                                document.getElementById("proRataExpiryDate").textContent = formatDate(firstData.proRataExpiryDate);
                                if (!firstData.isProRata) {
                                    document.getElementById("trproRataExpiryDate").style.display = "none"
                                }
                                else {
                                    document.getElementById("trproRataExpiryDate").style.display = ""
                                }

                                document.getElementById("dealerCode").textContent = firstData.warrantyActivatedDealerCode;
                                document.getElementById("dealerName").textContent = firstData.warrantyActivatedDealerName;

                                var text = "";

                                for (let i = 0; i < firstData.fieldTempletes.length; i++) {
                                    if (firstData.fieldTempletes[i].fieldValue != null) {
                                        if (firstData.fieldTempletes[i].fieldTypeName === "Select") {
                                            text += "<tr>";
                                            text += "<th>" + firstData.fieldTempletes[i].fieldName + " </th>";

                                            if (firstData.fieldTempletes[i].fieldValue != null) {
                                                var valueF = firstData.fieldTempletes[i].fieldValue.value;
                                                for (let c = 0; c < firstData.fieldTempletes[i].fieldDefaultValues.length; c++) {

                                                    if (firstData.fieldTempletes[i].fieldDefaultValues[c].id === parseInt(valueF)) {
                                                        text += "<td><span>" + firstData.fieldTempletes[i].fieldDefaultValues[c].text + "</span></td>";
                                                    }
                                                }
                                            }
                                            else {
                                                text += "<td><span></span></td>";
                                            }
                                            text += "</tr>";
                                        }
                                        else {
                                            text += "<tr>";
                                            text += "<th>" + firstData.fieldTempletes[i].fieldName + " </th>";
                                            text += "<td><span>" + firstData.fieldTempletes[i].fieldValue.value + " </span></td>";
                                            text += "</tr>";
                                        }
                                    }
                                }
                                let tbl = document.getElementById("tablSNDetailsBody");
                                tbl.innerHTML = text;



                                let letServiceHistory = document.getElementById("idServiceHistory");
                                var resultServiceHistory = "";


                                for (let i = 0; i < firstData.serviceScheduledTemplateData.length; i++) { 
                                    console.log(firstData.serviceScheduledTemplateData[i].displayCreateOn)


                                    resultServiceHistory += "<a class='btn btn-outline-secondary w-100 text-left text-dark mb-2 collapsed' data-bs-toggle='collapse' href='#collapseExample_" + firstData.serviceScheduledTemplateData[i].id + "' role='button' aria-expanded='false' aria-controls='collapseExample_" + firstData.serviceScheduledTemplateData[i].id + "'>";
                                    resultServiceHistory += "<div class='row' style=''>";
                                    resultServiceHistory += "<div class='col-md-9 text-start'>";
                                    resultServiceHistory += "<i class='fa-solid fa-clock-rotate-left'></i> <b> " + firstData.serviceScheduledTemplateData[i].id + " - " + firstData.productName + "</b>";
                                    resultServiceHistory += "<br>";
                                    resultServiceHistory += "<small text-muted=''>";
                                    resultServiceHistory += "<i class='fa-solid fa-location-pin'></i>";
                                    resultServiceHistory += "" + firstData.serviceScheduledTemplateData[i].dealerName + " | " + firstData.serviceScheduledTemplateData[i].dealerAddress + "";
                                    resultServiceHistory += "</small>";
                                    resultServiceHistory += "</div>";
                                    resultServiceHistory += "<div class='col-md-3 text-end'>";
                                    resultServiceHistory += "<small class='text-right text-muted'>" + firstData.serviceScheduledTemplateData[i].displayCreateOn + "</small>";
                                    resultServiceHistory += "</div>";
                                    resultServiceHistory += "</div>";
                                    resultServiceHistory += "</a>";
                                    resultServiceHistory += "<div class='collapse' id='collapseExample_" + firstData.serviceScheduledTemplateData[i].id + "' style=''>";
                                    resultServiceHistory += "<div class='card card-body'>";
                                    for (let g = 0; g < firstData.templateGroups.length; g++) {

                                        var no = 0;
                                        for (let s = 0; s < firstData.serviceScheduledTemplateData[i].fieldValues.length; s++) {

                                            if (firstData.templateGroups[g] == firstData.serviceScheduledTemplateData[i].fieldValues[s].serviceScheduledTemplateField.groupName) 
                                            {
                                                console.log(no);
                                                if (firstData.templateGroups[g] != "N/A" && no === 0) {
                                                    resultServiceHistory += "<div class='row px-3'>";
                                                    resultServiceHistory += "<label class='col-sm-3 lbl col-form-label ps-0 pb-0'> <span class='bg-white'>";
                                                    resultServiceHistory += "<b>" + firstData.templateGroups[g] + "</b>";
                                                    resultServiceHistory += "</span> </label>";
                                                    resultServiceHistory += "<div class='col-sm-9 ps-0 col-form-label lbl pb-0 text-end'>";
                                                    resultServiceHistory += "<span class='bg-white'><b> </b></span> ";
                                                    resultServiceHistory += "</div>";
                                                    resultServiceHistory += "</div>";
                                                }

                                                console.log(firstData.serviceScheduledTemplateData[i].fieldValues[s].serviceScheduledTemplateField.labaleName);


                                                //Checkbox
                                                if (firstData.serviceScheduledTemplateData[i].fieldValues[s].serviceScheduledTemplateField.serviceScheduledTemplateFieldTypeId == 3) {
                                                    resultServiceHistory += "<div class='row px-3'>";
                                                    resultServiceHistory += "<label class='col-sm-3 lbl col-form-label ps-0 pb-0'> <span class='bg-white'>";
                                                    resultServiceHistory += firstData.serviceScheduledTemplateData[i].fieldValues[s].serviceScheduledTemplateField.labaleName;
                                                    resultServiceHistory += "</span> </label>";
                                                    resultServiceHistory += "<div class='col-sm-9 ps-0 col-form-label lbl pb-0 text-end'>";

                                                    if(firstData.serviceScheduledTemplateData[i].fieldValues[s].value == "true")
                                                    {
                                                        resultServiceHistory += "<span class='bg-white'><img src='/assets/icons/checkboxchecked.svg'/></span> ";

                                                    }
                                                    else
                                                    {
                                                        resultServiceHistory += "<span class='bg-white'><img src='/assets/icons/checkboxunchecked.svg'/></span> ";

                                                    }
                                                    resultServiceHistory += "</div>";
                                                    resultServiceHistory += "</div>";
                                                }
                                                //Select
                                                else if (firstData.serviceScheduledTemplateData[i].fieldValues[s].serviceScheduledTemplateField.serviceScheduledTemplateFieldTypeId == 6) {
                                                    resultServiceHistory += "<div class='row px-3'>";
                                                    resultServiceHistory += "<label class='col-sm-3 lbl col-form-label ps-0 pb-0'> <span class='bg-white'>";
                                                
                                                    resultServiceHistory += firstData.serviceScheduledTemplateData[i].fieldValues[s].serviceScheduledTemplateField.labaleName;
                                                    resultServiceHistory += "</span> </label>";
                                                    resultServiceHistory += "<div class='col-sm-9 ps-0 col-form-label lbl pb-0 text-end'>";
                                                    for (const element of firstData.serviceScheduledTemplateData[i].fieldValues[s].serviceScheduledTemplateField.serviceScheduledTemplateFieldDefaultValues) {

                                                        if (element.id == firstData.serviceScheduledTemplateData[i].fieldValues[s].value) {
                                                            resultServiceHistory += "<span class='bg-white'><b>" + element.text + "  </b></span> ";

                                                        }
                                                    }
                                                    resultServiceHistory += "</div>";
                                                    resultServiceHistory += "</div>";
                                                }
                                                //RadioButton
                                                else if (firstData.serviceScheduledTemplateData[i].fieldValues[s].serviceScheduledTemplateField.serviceScheduledTemplateFieldTypeId == 9) {
                                                    resultServiceHistory += "<div class='row px-3'>";
                                                    resultServiceHistory += "<label class='col-sm-3 lbl col-form-label ps-0 pb-0'> <span class='bg-white'>";

                                                    resultServiceHistory += firstData.serviceScheduledTemplateData[i].fieldValues[s].serviceScheduledTemplateField.labaleName;
                                                    resultServiceHistory += "</span> </label>";
                                                    resultServiceHistory += "<div class='col-sm-9 ps-0 col-form-label lbl pb-0 text-end'>";
                                                    for (const element of firstData.serviceScheduledTemplateData[i].fieldValues[s].serviceScheduledTemplateField.serviceScheduledTemplateFieldDefaultValues) {

                                                        if (element.id == firstData.serviceScheduledTemplateData[i].fieldValues[s].value) {
                                                            resultServiceHistory += "<span class='bg-white'><b>" + element.text + "  </b></span> ";

                                                        }
                                                    }
                                                    resultServiceHistory += "</div>";
                                                    resultServiceHistory += "</div>";
                                                }
                                                //FileUpload
                                                else if (firstData.serviceScheduledTemplateData[i].fieldValues[s].serviceScheduledTemplateField.serviceScheduledTemplateFieldTypeId == 13) {
                                                    resultServiceHistory += "<div class='row px-3'>";
                                                    resultServiceHistory += "<label class='col-sm-3 lbl col-form-label ps-0 pb-0'> <span class='bg-white'>";
                                                    resultServiceHistory += firstData.serviceScheduledTemplateData[i].fieldValues[s].serviceScheduledTemplateField.labaleName;
                                                    resultServiceHistory += "</span> </label>";
                                                    resultServiceHistory += "<div class='col-sm-9 ps-0 col-form-label lbl pb-0 text-end'>";
                                                    resultServiceHistory += "<span class='bg-white'><a href=" + firstData.serviceScheduledTemplateData[i].fieldValues[s].value + "><b> Download </b></a></span> ";
                                                    resultServiceHistory += "</div>";
                                                    resultServiceHistory += "</div>";
                                                }
                                                //ImageUpload
                                                else if (firstData.serviceScheduledTemplateData[i].fieldValues[s].serviceScheduledTemplateField.serviceScheduledTemplateFieldTypeId == 14) {
                                                    resultServiceHistory += "<div class='row px-3'>";
                                                    resultServiceHistory += "<label class='col-sm-3 lbl col-form-label ps-0 pb-0'> <span class='bg-white'>";
                                                    resultServiceHistory += firstData.serviceScheduledTemplateData[i].fieldValues[s].serviceScheduledTemplateField.labaleName;
                                                    resultServiceHistory += "</span> </label>";
                                                    resultServiceHistory += "<div class='col-sm-9 ps-0 col-form-label lbl pb-0 text-end'>";
                                                    resultServiceHistory += "<span class='bg-white'><a href=" + firstData.serviceScheduledTemplateData[i].fieldValues[s].value + "><b> Download </b></a></span> ";
                                                    resultServiceHistory += "</div>";
                                                    resultServiceHistory += "</div>";
                                                }
                                                else {
                                                    resultServiceHistory += "<div class='row px-3'>";
                                                    resultServiceHistory += "<label class='col-sm-3 lbl col-form-label ps-0 pb-0'> <span class='bg-white'>";
                                                    resultServiceHistory += firstData.serviceScheduledTemplateData[i].fieldValues[s].serviceScheduledTemplateField.labaleName;
                                                    resultServiceHistory += "</span> </label>";
                                                    resultServiceHistory += "<div class='col-sm-9 ps-0 col-form-label lbl pb-0 text-end'>";
                                                    resultServiceHistory += "<span class='bg-white'><b>" + firstData.serviceScheduledTemplateData[i].fieldValues[s].value + "  </b></span> ";
                                                    resultServiceHistory += "</div>";
                                                    resultServiceHistory += "</div>";
                                                }

                                                no++;
                                            }

                                        }
                                    }
                                    resultServiceHistory += "</div>";
                                    resultServiceHistory += "</div>";
                                    resultServiceHistory += "<br>";
                                };

                                letServiceHistory.innerHTML = resultServiceHistory;

                                var myModal = new bootstrap.Modal(document.getElementById('warrantyModal'), {
                                    keyboard: false
                                });
                                myModal.show();
                            }
                            else {
                                Swal.fire({
                                    title: 'No Data Available',
                                    text: 'Please contact the nearest Browns dealer point or the Browns showrooms for further information',
                                    icon: 'info',
                                    confirmButtonText: 'Ok',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                    }
                                });
                            }
                        }
                        else {
                            const firstData = data.data;
                            if (firstData != null) {
                                document.getElementById("idContentManagement").innerHTML = firstData.contentManagement.htmlContent;
                                // document.getElementById("modal-435258").style.display = "block"

                                document.getElementById("serialNumber").textContent = firstData.serialNumber;
                                document.getElementById("productName").textContent = firstData.productName;
                                document.getElementById("productCode").textContent = firstData.productCode;
                                document.getElementById("trConsumerName").style.display = "none";
                                document.getElementById("trConsumerAddress").style.display = "none";
                                // document.getElementById("trConsumerContactNo").style.display = "none";
                                document.getElementById("idWarrantyActivatedDate").style.display = "none";
                                document.getElementById("trWarrantyExpiryDate").style.display = "none";
                                document.getElementById("warrantyPeriod").textContent = firstData.warrantyPeriod;
                                document.getElementById("trRemainingWarrantyPeriod").style.display = "none";
                                document.getElementById("trStatus").style.display = "none";
                                document.getElementById("trproRataExpiryDate").style.display = "none"
                                document.getElementById("trMSG").style.display = "revert"
                                document.getElementById("alertmsg").textContent = data.msg;

                                let tbl = document.getElementById("tablSNDetailsBody");
                                tbl.innerHTML = "";

                                var myModal = new bootstrap.Modal(document.getElementById('warrantyModal'), {
                                    keyboard: false
                                });
                                myModal.show();

                            }
                            else {
                                Swal.fire({
                                    title: 'No Data Available',
                                    text: 'Please contact the nearest Browns dealer point or the Browns showrooms for further information',
                                    icon: 'info',
                                    confirmButtonText: 'Ok',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                    }
                                });
                            }
                        }
                    }

                })
                .catch(error => {
                    alert(error.message);
                    console.error(error);
                    // Reset the displayed values
                    resetDisplayedValues();
                });
        }

        function resetDisplayedValues() {
            document.getElementById("serialNumber").textContent = "";
            document.getElementById("productName").textContent = "";
            document.getElementById("productCode").textContent = "";
            document.getElementById("consumerName").textContent = "";
            document.getElementById("consumerAddress").textContent = "";
            // document.getElementById("consumerContactNo").textContent = "";
            document.getElementById("warrantyActivatedDate").textContent = "";
            document.getElementById("warrantyExpiryDate").textContent = "";
            document.getElementById("warrantyPeriod").textContent = "";
            document.getElementById("RemainingWarrantyPeriod").textContent = "";
            document.getElementById("proRataExpiryDate").textContent = "";
            document.getElementById("status").textContent = "";
        }

        // get phone number data
        function getNumdata() {
            //const hostName = window.location.hostname;
            const hostName = window.location.host;

            const phoneNum = document.getElementById("phoneNum").value;
            const otpNum = document.getElementById("otpNum").value;

            const url = `https://${hostName}/Api/security/is-validate-otp`;

            const postOtpData = {
                MobileNo: phoneNum,
                OTP: otpNum
            };

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postOtpData)
            })
                .then(response => {
                    if (!response.ok) {
                        //throw new Error(`HTTP error! status: ${response.status}`);
                        throw new Error(`No Information available. Please re-check the Serial Number again.`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (!data.data) {
                        //document.getElementById("errorText").innerHTML = "<p>Please recheck the serial number.</p>"
                        Swal.fire({
                            title: 'No Data Available',
                            text: 'Please contact the nearest Browns dealer point or the Browns showrooms for further information',
                            icon: 'info',
                            confirmButtonText: 'Ok',
                        }).then((result) => {
                            if (result.isConfirmed) {
                            }
                        });
                        // Reset the displayed values
                        resetDisplayedValues();
                        //alert("No data available");
                    }
                    else {

                        //alert(JSON.stringify(data.data));
                        // hide phone and otp fields when results in display
                        phoneBtn.style.display = "none";
                        otpNumCont.style.display = "none";
                        phoneNumCont.style.display = "none";
                        tryagainBtn.style.display = "block";

                        const deviceList = document.getElementById("deviceList");
                        deviceList.innerHTML = "";

                        const headertxtbym = document.getElementById("headertxtbym");
                        headertxtbym.innerHTML = ' <li class="list-group-item active" aria-current="true">Registered Serial Numbers</li>';


                        data.data.forEach(serialNumber => {

                            const listitem = document.createElement("li");
                            listitem.classList.add("list-group-item");
                            listitem.setAttribute("data-seno", serialNumber);


                            const link = document.createElement("a");
                            link.href = "#site";
                            link.classList.add("snoClick");
                            link.textContent = serialNumber;
                            link.setAttribute("data-seno", serialNumber);

                            listitem.appendChild(link);
                            deviceList.appendChild(listitem);
                        });

                        ////////////////////////////////////////////////////////////////////////
                        //// pass SN from link auto to serial number form
                        var listItems = document.querySelectorAll('.snoClick');

                        // Add a click event listener to each list item
                        listItems.forEach(function (item) {
                            item.addEventListener('click', function (e) {
                                e.preventDefault();
                                // Get the value of the "data-seno" attribute
                                var dataSeno = item.getAttribute('data-seno');

                                const dataSenoValue = this.getAttribute("data-seno");

                                const serialNumTextbox = document.getElementById("serialNum");
                                serialNumTextbox.value = dataSenoValue;

                                btnSerialS.disabled = false;

                                if (btnSerialS) {
                                    btnSerialS.click(); // Trigger click event on btnSerialS if it exists
                                }



                            });
                        });


                    }

                })
                .catch(error => {
                    alert(error.message);
                    console.error(error);
                });
        }

        function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [year, month, day].join('-');
        }

        // JavaScript code



        // get vehicle data new JS
        function getVehicleNumdata() {
            //const hostName = window.location.hostname;
            const hostName = window.location.host;

            const vehicleNum = document.getElementById("vehicleNum").value;

            const url = `https://${hostName}/Api/product/consumeris-details-by-serial-number-for-validate-with-vehicle-number/${vehicleNum}`;

            //alert(url);

            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        //throw new Error(`HTTP error! status: ${response.status}`);
                        throw new Error(`No Information available. Please re-check the Serial Number again.`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (!data.data) {
                        //document.getElementById("errorText").innerHTML = "<p>Please recheck the serial number.</p>"
                        Swal.fire({
                            title: 'No Data Available',
                            text: 'Please contact the nearest Browns dealer point or the Browns showrooms for further information',
                            icon: 'info',
                            confirmButtonText: 'Ok',
                        }).then((result) => {
                            if (result.isConfirmed) {
                            }
                        });
                        // Reset the displayed values
                        resetDisplayedValues();
                        //alert("No data available");

                    }
                    else {

                        //alert(JSON.stringify(data.data));
                        // hide phone and otp fields when results in display
                        otpVBtn.style.display = "none";
                        tryagainVBtn.style.display = "block";

                        const deviceList = document.getElementById("deviceVList");
                        deviceList.innerHTML = "";

                        const headertxtbym = document.getElementById("headertxtbymV");
                        headertxtbym.innerHTML = ' <li class="list-group-item active" aria-current="true">Registered Serial Numbers for vehicle</li>';


                        data.data.forEach(serialNumber => {

                            const listitem = document.createElement("li");
                            listitem.classList.add("list-group-item");
                            listitem.setAttribute("data-seno", serialNumber);


                            const link = document.createElement("a");
                            link.href = "#site";
                            link.classList.add("snoVClick");
                            link.textContent = serialNumber;
                            link.setAttribute("data-seno", serialNumber);

                            listitem.appendChild(link);
                            deviceList.appendChild(listitem);
                        });

                        ////////////////////////////////////////////////////////////////////////
                        //// pass SN from link auto to serial number form
                        var listItems = document.querySelectorAll('.snoVClick');

                        // Add a click event listener to each list item
                        listItems.forEach(function (item) {
                            item.addEventListener('click', function (e) {
                                e.preventDefault();
                                // Get the value of the "data-seno" attribute
                                var dataSeno = item.getAttribute('data-seno');

                                const dataSenoValue = this.getAttribute("data-seno");

                                const serialNumTextbox = document.getElementById("serialNum");
                                serialNumTextbox.value = dataSenoValue;

                                btnSerialS.disabled = false;

                                if (btnSerialS) {
                                    btnSerialS.click(); // Trigger click event on btnSerialS if it exists
                                }



                            });
                        });


                    }

                })
                .catch(error => {
                    alert(error.message);
                    console.error(error);
                });
        }
