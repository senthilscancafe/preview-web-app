//Object.prototype.getKeyByValue = function (value) {
//    for (var prop in this) {
//        if (this.hasOwnProperty(prop)) {
//            if (this[ prop ] === value)
//                return prop;
//        }
//    }
//};
//
//var getOrdinal = function (n) {
//    var s = ["th", "st", "nd", "rd"],
//            v = n % 100;
//    return n + (s[(v - 20) % 10] || s[v] || s[0]);
//};
//
//function createCountrySelect() {
//    var allRegions = leodido.i18n.PhoneNumbers.getSupportedRegions();
//    var nullOption = document.createElement('OPTION');
//    nullOption.setAttribute('label', '');
//    nullOption.setAttribute('value', '');
//    defaultCountry.appendChild(nullOption);
//    for (var i = 1; i <= allRegions.length; i++) {
//        var value = allRegions[i - 1],
//                label = value.toLowerCase();
//        var optionEl = document.createElement('OPTION');
//        optionEl.setAttribute('label', label);
//        optionEl.setAttribute('value', value);
//        defaultCountry.appendChild(optionEl);
//    }
//}
