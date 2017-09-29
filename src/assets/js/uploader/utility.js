'use strict';
function createUUID () {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}

function calculateTransferRate (bitrate) {
    var bytes = bitrate / 8.0;
    var KBs = bytes / (1024 * 1024);
    return KBs.toFixed(2) + " MB/s";
}

function calculateRemainingTime (remaningbites, bitrate) {
    var seconds = parseInt(remaningbites / (bitrate / 8));
    var timestr = toTimeString(seconds);
    return timestr;// + " sec";
}

function formatToMB (bitrate) {
    var bytes = bitrate / 1.0;
    var KBs = bytes / (1024 * 1024);
    return KBs.toFixed(2) + " MB";
}

function toTimeString (seconds) {
    return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
}

function get_browser_info () {
    var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return {name: 'IE', version: (tem[1] || '')};
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/);
        if (tem !== null) {
            return {name: 'Opera', version: tem[1]};
        }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    tem = ua.match(/version\/(\d+)/i);
    if ( tem !== null) {
        M.splice(1, 1, tem[1]);
    }
    return {
        name: M[0],
        version: M[1]
    };
}

