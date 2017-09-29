/*
 * DEV
 */
var flipbookBaseURL = "https://photogurusdev.scancafe.com/web/preview/";
var baseUrlNew = "https://apidev.photogurus.com/";
var branchKey = 'key_test_iigOe5ilx8SnPzVoCz0DAnapyFddgSuI';

/*
 * LIVE
var flipbookBaseURL = "https://www.photogurus.com/web/preview/";
var baseUrlNew = "https://api.photogurus.com/";
var branchKey = 'key_live_fihLn7lgEYSoUAIitE5vKjneuAdfoSx3';
*/

var getCookie = function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};
var setCookie = function (cname, cvalue, exdays) {
    var d = new Date();
    // (number*days)
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    var co = cname + "=" + cvalue + ";";
    co += "path=/;";
    co += expires;
    document.cookie = co;
};

var delete_cookie = function (cname) {
    document.cookie = cname + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

var expireDays = 2;
var user_id, authtoken, login_id, account_id, sharee_id, story_cover_pic, login_type, sharer_name, share_token, country_code, communication_token, story_id, ownstory_tracking_id, public_id, order_token;
var cust_ID = getCookie("custId");

//            var stringURL = window.location.href;
//            stringURL = stringURL.split("?");
var publicStory = function () {
    if (cust_ID) {
         //delete cookies to clear the cache
        delete_cookie("connectStory");
        delete_cookie("communication_token");
        delete_cookie("story_id");   
        
        setCookie("connectStory", 1, expireDays);
        setCookie("communication_token", communication_token, expireDays);
        setCookie("story_id", story_id, expireDays);
        setCookie("connectStory", 1, expireDays);
        //console.log("matched");
    }
    else {
        //delete cookies to clear the cache
        delete_cookie("copylink");
        delete_cookie("communication_token");
        delete_cookie("story_id"); 
        delete_cookie("storyCoverDeep"); 
        delete_cookie("share_tokenDeep"); 
        delete_cookie("country_codeDeep"); 
        delete_cookie("sharer_nameDeep"); 
        delete_cookie("account"); 
        delete_cookie("sharee_id"); 
        
        setCookie("copylink", 1, expireDays);
        setCookie("communication_token", communication_token, expireDays);
        setCookie("story_id", story_id, expireDays);
        setCookie("storyCoverDeep", story_cover_pic, expireDays);
        setCookie("share_tokenDeep", share_token, expireDays);
        setCookie("country_codeDeep", country_code, expireDays);
        setCookie("sharer_nameDeep", sharer_name, expireDays);
        setCookie("account", login_id, 1);
        setCookie("sharee_id", sharee_id, 1);


    }
    var str = order_token;

    var encodedString = window.btoa(str);
    window.location.href = flipbookBaseURL + encodedString + '/1';
};
/*branch io sdk*/
(function (b, r, a, n, c, h, _, s, d, k) {
    if (!b[n] || !b[n]._q) {
        for (; s < _.length;) c(h, _[s++]);
        d = r.createElement(a);
        d.async = 1;
        d.src = "https://cdn.branch.io/branch-latest.min.js";
        k = r.getElementsByTagName(a)[0];
        k.parentNode.insertBefore(d, k);
        b[n] = h
    }
})(window, document, "script", "branch", function (b, r) {
    b[r] = function () {
        b._q.push([r, arguments])
    }
}, {
    _q: [],
    _v: 1
}, "addListener applyCode autoAppIndex banner closeBanner closeJourney creditHistory credits data deepview deepviewCta first getCode init link logout redeem referrals removeListener sendSMS setBranchViewData setIdentity track validateCode trackCommerceEvent".split(" "), 0);
branch.init(branchKey, function (err, data) {
    console.log(data.data_parsed.order_token);
});


/*branch io data*/
branch.data(
        function (err, data) {

            console.log(data);
            data = JSON.parse(data.data);
            user_id = data.user_id;
            authtoken = data.token;
            share_token = data.share_token;
            login_id = data.login_id;
            account_id = data.account_id;
            sharee_id = data.sharee_id;
            story_cover_pic = data.story_cover_pic;
            login_type = data.login_type;
            sharer_name = data.sharer_name;
            country_code = data.country_code;
            communication_token = data.communication_token;
            story_id = data.story_id;
            ownstory_tracking_id = data.tracking_id;
            public_id = data.login_id;
            console.log(data);
            //delete cookies to clear the cache
            delete_cookie("token_flag");
            delete_cookie("sharee_id");
            delete_cookie("account"); 
            delete_cookie("communication_token"); 
            delete_cookie("order_token"); 
            if (public_id === undefined || public_id === '' || public_id === null) {
                setCookie("token_flag", 0, expireDays);
                setCookie("sharee_id", sharee_id, expireDays);
                setCookie("account", account_id, expireDays);
                setCookie("communication_token ", communication_token, expireDays);
            } else {
                setCookie("token_flag", 1, expireDays);
                setCookie("sharee_id", sharee_id, expireDays);
                setCookie("account", account_id, expireDays);
                setCookie("communication_token ", communication_token, expireDays);
            
        }
        setCookie("order_token", data.order_token, expireDays);
        order_token = data.order_token;
        if (data.event_type === "public_share" || data.event_type === "copy_link") {
            publicStory();
        }
    }
);
