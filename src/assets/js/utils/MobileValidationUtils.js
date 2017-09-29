/*global define*/

define(['Augment',
    'Instance',
    'GlobalData',
    'utils/MobileCountryCodeDict'], function (augment, instance, GlobalData, MobileCountryCodeDict) {
    'use strict';

    var MobileValidationUtils = augment(instance, function () {

        this.getCurrentCountryCodeINT = function () {
            // check GlobalData for code if not present load from json
            if (GlobalData.CURRENTCOUNTRYCODE !== undefined && GlobalData.CURRENTCOUNTRYCODE !== null) {
                return GlobalData.CURRENTCOUNTRYCODE;
            }
//            $.getJSON("https://freegeoip.net/json/", function (result) {
//                myip = result.ip;
//                var countryCodeStr = result.country_code;
//                console.log("countryCodeStr : " + countryCodeStr);
//                GlobalData.CURRENTCOUNTRYCODE = ("+" + MobileCountryCodeDict.getCountryCodeINTFromSTR(countryCodeStr));
//            });
            return "+1";
        };

        this.doesWeSupportCountry = function (countryCodeINT) {
            //If supported then return true otherwise false
            return MobileCountryCodeDict.isCodeAvailable(countryCodeINT);
        };

        this.getKeyByValue = function (object, value) {
            for (var p in object) {
                if (object.hasOwnProperty(p)) {
//                    console.log( p + " , " + object[p] );
                    if (object[p] === value) {
                        return p;
                    }
                }
            }
        };

        this.parseMobileData = function (number, defaultCode) {
            var defaultRegionCode = defaultCode;
            var isPossible = false;
            var isValid = false;
            var numberType = null;
            var regionCode = null;
            var outputObj = {isPossible: false, isValid: false, numberType: null, regionCode: null, formatRFC3966: null, errorStr: null, isValidNoForRegion: null};

            //setOutput(output);

            try {
                isPossible = leodido.i18n.PhoneNumbers.isPossibleNumber(number); // FIXME: pass country?
                outputObj.isPossible = isPossible ? 'true' : 'false';
                if (!isPossible) {
                    // Number not possible
                    var PNV = leodido.i18n.PhoneNumbers.RESULT;
                    var PNE = leodido.i18n.PhoneNumbers.ERROR;
                    var reason = leodido.i18n.PhoneNumbers.isPossibleNumberWithReason(number);
                    var code = this.getKeyByValue(PNV, reason);
                    if (typeof PNE[code] !== 'undefined') {
                        // PNV.INVALID_COUNTRY_CODE || PNV.TOO_LONG
                        outputObj.errorStr = PNE[code];
                    } else {
                        // NOTE: validation RESULT has only TOO_SHORT code while ERROR has two type of TOO_SHORT errors
                        if (code.match(/TOO_SHORT/)) {
                            // PNV.TOO_SHORT
                            outputObj.errorStr = PNE.TOO_SHORT_AFTER_IDD + "," + PNE.TOO_SHORT_NSN;
                        } else {
                            // NOTE: should never happen that reason == PNV.IS_POSSIBLE
                            // PNV.IS_POSSIBLE || PNE.NOT_A NUMBER
                            if (reason === PNV.IS_POSSIBLE) {
                                outputObj.errorStr = "something wrong, should never happen that number IS_POSSIBLE at this stage";
                            } else {
                                outputObj.errorStr = "probably an unknown error (code: " + code + ")";
                            }
                        }
                    }
                }
            } catch (exc) {
                outputObj.errorStr = exc;
            }

            if (isPossible) {
                try {
                    //  Number possible, check if it is valid
                    var PNT = leodido.i18n.PhoneNumbers.TYPE;
                    if (defaultRegionCode) {
                        isValid = leodido.i18n.PhoneNumbers.isValidNumber(number, defaultRegionCode);
                        regionCode = leodido.i18n.PhoneNumbers.getRegionCodeForNumber(number, defaultRegionCode);
                        var isValidNoForRegion = leodido.i18n.PhoneNumbers.isValidNumberForRegion(number, defaultRegionCode);

                        outputObj.isValid = isValid ? 'true' : 'false';
                        outputObj.regionCode = regionCode;
                        outputObj.isValidNoForRegion = isValidNoForRegion ? 'true' : 'false';

                    } else {
                        isValid = leodido.i18n.PhoneNumbers.isValidNumber(number);
                        regionCode = leodido.i18n.PhoneNumbers.getRegionCodeForNumber(number);
                        outputObj.isValid = isValid ? 'true' : 'false';
                        outputObj.regionCode = regionCode;

                    }
                    numberType = leodido.i18n.PhoneNumbers.getNumberType(number, regionCode);
                    console.log("PNT : " + PNT);
                    outputObj.numberType = this.getKeyByValue(PNT, numberType);
                    outputObj.errorStr = "Invalid number.";
                } catch (exc) {
                    outputObj.errorStr = exc;
                }
            }

            if (isValid) {
                // Formatting
                var PNF = leodido.i18n.PhoneNumbers.FORMAT;
                outputObj.formatRFC3966 = leodido.i18n.PhoneNumbers.formatNumber(number, regionCode, PNF.RFC3966);
            }

            return outputObj;
        }

    });

    return MobileValidationUtils;
});


