/*global define, jQuery*/

define(['Augment',
    'Instance',
    'GlobalData',
    'PubSub',
    'utils/CookieUtils',
    'services/PrintService',
    'views/messages/MessagesView',
    'utils/UnderscoreMixinUtils',
    'xss',
    'libphonenumber',
    'hbs/underscore',
    'lockr',
    'hbs!views/print/templates/PrintShippingAddressView'
], function (augment, instance, GlobalData, PubSub, CookieUtils, PrintService, MessagesView, UnderscoreMixinUtils, xss, libphonenumber, _, Lockr, tplPrintShippingAddressView) {
    'use strict';

    var PrintShippingAddressView = augment(instance, function () {
        var printShippingAddressView = this;
        this.payload = null;
        var messagesView = '';
        printShippingAddressView.stateList = {
            "AL": "ALABAMA",
            "AK": "ALASKA",
            "AZ": "ARIZONA",
            "AR": "ARKANSAS",
            "CA": "CALIFORNIA",
            "CO": "COLORADO",
            "CT": "CONNECTICUT",
            "DE": "DELAWARE",
            "FL": "FLORIDA",
            "GA": "GEORGIA",
            "HI": "HAWAII",
            "ID": "IDAHO",
            "IL": "ILLINOIS",
            "IN": "INDIANA",
            "IA": "IOWA",
            "KS": "KANSAS",
            "KY": "KENTUCKY",
            "LA": "LOUISIANA",
            "ME": "MAINE",
            "MD": "MARYLAND",
            "MA": "MASSACHUSETTS",
            "MI": "MICHIGAN",
            "MN": "MINNESOTA",
            "MS": "MISSISSIPPI",
            "MO": "MISSOURI",
            "MT": "MONTANA",
            "NE": "NEBRASKA",
            "NV": "NEVADA",
            "NH": "NEW HAMPSHIRE",
            "NJ": "NEW JERSEY",
            "NM": "NEW MEXICO",
            "NY": "NEW YORK",
            "NC": "NORTH CAROLINA",
            "ND": "NORTH DAKOTA",
            "OH": "OHIO",
            "OK": "OKLAHOMA",
            "OR": "OREGON",
            "PA": "PENNSYLVANIA",
            "RI": "RHODE ISLAND",
            "SC": "SOUTH CAROLINA",
            "SD": "SOUTH DAKOTA",
            "TN": "TENNESSEE",
            "TX": "TEXAS",
            "UT": "UTAH",
            "VT": "VERMONT",
            "VA": "VIRGINIA",
            "WA": "WASHINGTON",
            "WV": "WEST VIRGINIA",
            "WI": "WISCONSIN",
            "WY": "WYOMING"
        };

        this.addToDiv = function () {
            if (_.isUndefined(GlobalData.printData)) {
                if(_.isUndefined(Lockr.get('storyData')) || _.isUndefined(Lockr.get('printData'))){
                    console.log('print flow data invalid');
                    if(!_.isUndefined(Lockr.get('storyDataBKP')) && !_.isUndefined(Lockr.get('printDataBKP'))){
                        Lockr.set('storyData', Lockr.get('storyDataBKP'));
                        Lockr.set('printData', Lockr.get('printDataBKP'));
                        Lockr.rm('storyDataBKP');
                        Lockr.rm('printDataBKP');
                        GlobalData.printData = Lockr.get('printData');
                        GlobalData.storyData = Lockr.get('storyData');
                    }else{
                        window.onbeforeunload = null;
                        location.hash = '#/dashboard';
                        return true;
                    }
                }
                GlobalData.printData = Lockr.get('printData');
                GlobalData.storyData = Lockr.get('storyData');
            }

            if (!_.isUndefined(GlobalData.printData)) {
                if (GlobalData.printData.action === 'edit') {
                    printShippingAddressView.editMode();
                } else {

                    printShippingAddressView.addMode();
                }
            }
            //jQuery('#saveShippingData').click(printShippingAddressView.saveShippingData);

            messagesView = MessagesView.create();

            //enable disable submit button
            $(":input").bind("keyup change", function (event) {
                event.stopPropagation();
                //console.log('dwdwdw '+$(this).val());
                printShippingAddressView.activateSubmitButton();

            });
        };

        this.activateSubmitButton = function () {
            var empty = $('.printFormBody').find("input").not("#shippingAddress2").filter(function () {
                return this.value === "";
            });
            if (empty.length) {
                //At least one input is empty
                jQuery('#saveShippingData').addClass('disabled').off("click", printShippingAddressView.saveShippingData);
            } else {
                jQuery('#saveShippingData').removeClass('disabled').off("click").on("click", printShippingAddressView.saveShippingData);
            }
        };

        this.preloader = function () {
            jQuery('body > .pageload').fadeOut();

        };

        this.saveShippingData = function (event) {
            event.stopPropagation();
            var requestData = printShippingAddressView.validation();
            if (requestData) {
                console.dir(GlobalData.printData);
                if (GlobalData.printData.action === 'edit') {
                    requestData.address_id = GlobalData.printData.temp.address_id;
                }
                var promise = PrintService.putShippingDetails(requestData);

                $.when(promise)
                    .done(function (obj) {
                        if (obj.arr_data !== null && obj.int_status_code !== 0) {
                            console.dir(obj.arr_data);
                            //GlobalData.printData.shippingAddress = GlobalData.printData.shippingList[i];
                            //build GlobalData.printData.shippingAddress

                            GlobalData.printData.shippingAddress = {};
                            GlobalData.printData.shippingAddress.address1 = requestData.address1;
                            GlobalData.printData.shippingAddress.address2 = requestData.address2;
                            GlobalData.printData.shippingAddress.address_firstname = requestData.customerfirstname;
                            GlobalData.printData.shippingAddress.address_id = obj.arr_data.address_id;
                            GlobalData.printData.shippingAddress.address_lastname = '';
                            GlobalData.printData.shippingAddress.address_type = requestData.address_type;
                            GlobalData.printData.shippingAddress.city = requestData.city;
                            GlobalData.printData.shippingAddress.country = requestData.country;
                            GlobalData.printData.shippingAddress.email = CookieUtils.getCookie("custEmail");
                            GlobalData.printData.shippingAddress.full_name = CookieUtils.getCookie("custName");
                            GlobalData.printData.shippingAddress.key_account_id = ''; //TODO
                            GlobalData.printData.shippingAddress.phone = requestData.phone;
                            GlobalData.printData.shippingAddress.state = requestData.state;
                            GlobalData.printData.shippingAddress.user_pic_path = CookieUtils.getCookie("custProfilePic");
                            GlobalData.printData.shippingAddress.userid = CookieUtils.getCookie("custId");
                            GlobalData.printData.shippingAddress.zip = requestData.zip;

                            //console.dir(GlobalData.printData);
                            jQuery('body > .pageload').fadeIn();
                            GlobalData.printData.redirectURL = '#/print/deliveryoption';
                            printShippingAddressView.redirectToPages();
                        } else {
                            console.log('putShippingDetails API response is null');
                            if (obj.str_status_message === 'Address details already exist') {
                                messagesView.addToDiv();
                                jQuery('.dialog-without-head').modal('show');
                                messagesView.messageMiddle();
                                jQuery('#dialog-without-head-content').text('This address already exists.');
                                jQuery('#dialog-without-head-action').parent().css("display", "block");
                                jQuery('#dialog-without-head-action').text('Ok');
                            } else {
                                messagesView.addToDiv();
                                jQuery('.dialog-without-head').modal('show');
                                messagesView.messageMiddle();
                                jQuery('#dialog-without-head-content').text(obj.str_status_message);
                                jQuery('#dialog-without-head-action').parent().css("display", "block");
                                jQuery('#dialog-without-head-action').text('Ok');
                            }
                        }
                    });
            }
        };

        this.validation = function () {
            //XSS filter
            var options = {
                whiteList: [], // empty, means filter out all tags
                //stripIgnoreTag:     true,      // filter out all HTML not in the whilelist
                stripIgnoreTagBody: true, // the script tag is a special case, we need to filter out its content
            };
            printShippingAddressView.shippingName = xss($.trim($('#shippingName').val()), options);
            printShippingAddressView.shippingAddress1 = xss($.trim($('#shippingAddress1').val()), options);
            printShippingAddressView.shippingAddress2 = xss($.trim($('#shippingAddress2').val()), options);
            printShippingAddressView.shippingCity = xss($.trim($('#shippingCity').val()), options);
            printShippingAddressView.shippingState = xss($.trim($('#shippingState').val()), options);
            printShippingAddressView.shippingZIP = xss($.trim($('#shippingZIP').val()), options);
            printShippingAddressView.shippingPhone = xss($.trim($('#shippingPhone').val()), options);
            printShippingAddressView.shippingCountry = xss($.trim($('#shippingCountry').val()), options);

            var obj = null;
            $('.errorLabel').css({
                'display': 'none'
            });
            if (printShippingAddressView.shippingName.length === 0) {
                obj = $("#shippingName").parent().find("label.errorLabel");
                obj.text('Full name field cannot be blank.').show();
                return false;
            }
            if (printShippingAddressView.shippingAddress1.length === 0) {
                obj = $("#shippingAddress1").parent().find("label.errorLabel");
                obj.text('Address line 1 field cannot be blank.').show();
                return false;
            }
            if (printShippingAddressView.shippingCity.length === 0) {
                obj = $("#shippingCity").parent().find("label.errorLabel");
                obj.text('City field cannot be blank.').show();
                return false;
            }
            if (printShippingAddressView.shippingState.length === 0) {
                obj = $("#shippingState").parent().find("label.errorLabel");
                obj.text('State/Province/Region cannot be blank.').show();
                return false;
            }

            //consider state entered as uppercase always
            printShippingAddressView.shippingState = printShippingAddressView.shippingState.toUpperCase();

            var stateListName = _.values(printShippingAddressView.stateList);
            if (!(printShippingAddressView.shippingState in printShippingAddressView.stateList) && !_.contains(stateListName, printShippingAddressView.shippingState)) {
                obj = $("#shippingState").parent().find("label.errorLabel");
                obj.text('Please enter a valid state.').show();
                return false;
            }

            if (printShippingAddressView.shippingZIP.length === 0) {
                obj = $("#shippingZIP").parent().find("label.errorLabel");
                obj.text('ZIP field cannot be blank.').show();
                return false;
            }

            var isValidZIP = /^\d{5}(?:-\d{4})?$/.test(printShippingAddressView.shippingZIP);
            if (!isValidZIP) {
                obj = $("#shippingZIP").parent().find("label.errorLabel");
                obj.text('Please enter a valid zip code.').show();
                return false;
            }

            if (printShippingAddressView.shippingPhone.length === 0) {
                obj = $("#shippingPhone").parent().find("label.errorLabel");
                obj.text('Please enter mobile number.').show();
                return false;
            }

            /*var isValidPhone = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(printShippingAddressView.shippingPhone);
            if (!isValidPhone) {
                obj = $("#shippingPhone").parent().find("label.errorLabel");
                obj.text('Please enter a valid phone number').show();
                return false;
            }*/

            //check phone number syntax
            var phonenoFilter = /^[0-9_@+-]*$/;
            if (!phonenoFilter.test(printShippingAddressView.shippingPhone)) {
                obj = $("#shippingPhone").parent().find("label.errorLabel");
                obj.text('Please enter a valid mobile number.').show();
                return false;
            }

            //check US phone number valid
            var parsed_number = libphonenumber.parse(printShippingAddressView.shippingPhone, 'US'); //TODO: get the contrycodestr dynamically, look in MobileValidationUtils.getCurrentCountryCodeINT() or GlobalData.CURRENTCOUNTRYCODE
            console.log(libphonenumber.isValidNumber(parsed_number));

            if (!libphonenumber.isValidNumber(parsed_number)) {
                console.log('libphonenumber told its invalid');
                obj = $("#shippingPhone").parent().find("label.errorLabel");
                obj.text('Please enter a valid mobile number.').show();
                return false;
            }

            var data = null;
            data = {
                "customerfirstname": printShippingAddressView.shippingName,
                "address1": printShippingAddressView.shippingAddress1,
                "address2": printShippingAddressView.shippingAddress2,
                "city": printShippingAddressView.shippingCity,
                "address_type": "2",
                "state": printShippingAddressView.shippingState,
                "country": printShippingAddressView.shippingCountry,
                "zip": printShippingAddressView.shippingZIP,
                "userid": CookieUtils.getCookie("custId"),
                "apimode": "web",
                //"address_id":"197",
                "phone": printShippingAddressView.shippingPhone,
                //"customerlastname":"testlastname"// not used
            };
            return data;
        };

        this.editMode = function () {
            if (_.isUndefined(GlobalData.printData.shippingList)) {
                console.log('GlobalData.printData.shippingList undefined');
            } else {
                for (var i = 0; i < GlobalData.printData.shippingList.length; i++) {
                    if (GlobalData.printData.shippingList[i].address_id == GlobalData.printData.temp.address_id) {
                        var dataSrc = GlobalData.printData.shippingList[i];
                        var divClass = "printContainer";
                        printShippingAddressView.payload = {
                            heading: 'Edit Shipping Address',
                            submitLabel: 'Use this address',
                            name: $.trim(dataSrc.address_firstname) + ' ' + $.trim(dataSrc.address_lastname),
                            address1: dataSrc.address1,
                            address2: dataSrc.address2,
                            city: dataSrc.city,
                            state: dataSrc.state,
                            zip: dataSrc.zip,
                            phone: dataSrc.phone,
                            country: 'United States'
                        };
                        var innerHtml = tplPrintShippingAddressView(printShippingAddressView.payload);
                        jQuery('.' + divClass).empty();
                        jQuery('.' + divClass).html(innerHtml);
                        jQuery('.page-loading').css('overflow', 'auto');

                        jQuery('#saveShippingData').removeClass('disabled').off("click").on("click", printShippingAddressView.saveShippingData);
                        printShippingAddressView.preloader();
                        break;
                    }
                }
                console.clear();
                //todo: make a function for delete keys
                delete printShippingAddressView.payload.heading;
                delete printShippingAddressView.payload.submitLabel;
                delete printShippingAddressView.payload.address2;
                delete printShippingAddressView.payload.country;
                console.dir(printShippingAddressView.payload);
                _.any(_.values(printShippingAddressView.payload), function (v) {
                    //console.log(v);
                    console.log(_(v).isEmptyORUndefinedORNull());
                    if (_(v).isEmptyORUndefinedORNull()) {
                        //At least one input is empty
                        console.log(v);
                        jQuery('#saveShippingData').addClass('disabled').off("click", printShippingAddressView.saveShippingData);
                    }
                });
            }
        };

        this.addMode = function () {
            var divClass = "printContainer";
            var innerHtml = tplPrintShippingAddressView({
                heading: 'Add Shipping Address',
                submitLabel: 'Ship to this address',
                country: 'United States',
                name: $.trim(CookieUtils.getCookie("custName")),
            });
            jQuery('.' + divClass).empty();
            jQuery('.' + divClass).html(innerHtml);
            jQuery('.page-loading').css('overflow', 'auto');
            jQuery('#saveShippingData').addClass('disabled');
            printShippingAddressView.preloader();
        };

        this.redirectToPages = function () {
            Lockr.set('printData', GlobalData.printData);
            location.hash = GlobalData.printData.redirectURL;
        };
    });

    return PrintShippingAddressView;
});