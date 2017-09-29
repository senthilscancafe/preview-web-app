! function(d, $) {
    "object" == typeof exports && "object" == typeof module ? module.exports = $() : "function" == typeof define && define.amd ? define("libphonenumber", [], $) : "object" == typeof exports ? exports.libphonenumber = $() : d.libphonenumber = $()
}(this, function() {
    return function(d) {
        function $(n) {
            if (t[n]) return t[n].exports;
            var e = t[n] = {
                i: n,
                l: !1,
                exports: {}
            };
            return d[n].call(e.exports, e, e.exports, $), e.l = !0, e.exports
        }
        var t = {};
        return $.m = d, $.c = t, $.i = function(d) {
            return d
        }, $.d = function(d, t, n) {
            $.o(d, t) || Object.defineProperty(d, t, {
                configurable: !1,
                enumerable: !0,
                get: n
            })
        }, $.n = function(d) {
            var t = d && d.__esModule ? function() {
                return d.default
            } : function() {
                return d
            };
            return $.d(t, "a", t), t
        }, $.o = function(d, $) {
            return Object.prototype.hasOwnProperty.call(d, $)
        }, $.p = "", $($.s = 75)
    }([function(d, $) {
        var t = d.exports = {
            version: "2.4.0"
        };
        "number" == typeof __e && (__e = t)
    }, function(d, $) {
        var t = d.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
        "number" == typeof __g && (__g = t)
    }, function(d, $, t) {
        var n = t(30)("wks"),
            e = t(32),
            r = t(1).Symbol,
            l = "function" == typeof r,
            u = d.exports = function(d) {
                return n[d] || (n[d] = l && r[d] || (l ? r : e)("Symbol." + d))
            };
        u.store = n
    }, function(d, $, t) {
        d.exports = !t(16)(function() {
            return 7 != Object.defineProperty({}, "a", {
                get: function() {
                    return 7
                }
            }).a
        })
    }, function(d, $, t) {
        var n = t(11),
            e = t(28);
        d.exports = t(3) ? function(d, $, t) {
            return n.f(d, $, e(1, t))
        } : function(d, $, t) {
            return d[$] = t, d
        }
    }, function(d, $, t) {
        "use strict";

        function n(d) {
            return d && d.__esModule ? d : {
                default: d
            }
        }

        function e(d, $, t) {
            var n = void 0,
                e = void 0;
            if ("string" == typeof $) {
                var l = $;
                n = (0, v.default)({}, B, {
                    country: {
                        restrict: l
                    }
                }), e = t
            } else $.countries ? e = $ : (n = $, e = t);
            n || (n = (0, v.default)({}, B)), e.countries[n.country.default] || (n = (0, v.default)({}, n), delete n.country.default), e.countries[n.country.restrict] || (n = (0, v.default)({}, n), delete n.country.restrict);
            var i = o(d);
            if (!u(i)) return {};
            var c = a(i, e),
                s = c.country_phone_code,
                h = c.number;
            if (!s && !h) return {};
            var m = void 0,
                y = void 0,
                x = !1;
            if (s) {
                if (x = !0, n.country.restrict && s !== (0, b.get_phone_code)(e.countries[n.country.restrict])) return {};
                y = (0, b.get_metadata_by_country_phone_code)(s, e)
            } else(n.country.default || n.country.restrict) && (m = n.country.default || n.country.restrict, y = e.countries[m], h = r(d));
            if (!y) return {};
            var M = _(h, y),
                E = M !== h;
            if (!x && !E && p(M, y)) return {};
            if (!m && (m = f(s, M, e), !m)) return {};
            if (M.length > N) return {};
            var O = new RegExp((0, b.get_national_number_pattern)(y));
            return (0, g.matches_entirely)(M, O) ? {
                country: m,
                phone: M
            } : {}
        }

        function r(d) {
            return l(d, C)
        }

        function l(d, $) {
            var t = "",
                n = !0,
                e = !1,
                r = void 0;
            try {
                for (var l, u = (0, m.default)(d); !(n = (l = u.next()).done); n = !0) {
                    var o = l.value,
                        i = $[o.toUpperCase()];
                    void 0 !== i && (t += i)
                }
            } catch (d) {
                e = !0, r = d
            } finally {
                try {
                    !n && u.return && u.return()
                } finally {
                    if (e) throw r
                }
            }
            return t
        }

        function u(d) {
            return d.length >= G && (0, g.matches_entirely)(d, T)
        }

        function o(d) {
            if (!d || d.length > w) return "";
            var $ = d.search(I);
            return $ < 0 ? "" : d.slice($).replace(P, "")
        }

        function i(d) {
            if (!d) return "";
            var $ = R.test(d);
            return d = r(d), $ ? "+" + d : d
        }

        function a(d, $) {
            if (d = i(d), !d) return {};
            if ("+" !== d[0]) return {
                number: d
            };
            if (d = d.slice(1), "0" === d[0]) return {};
            for (var t = 1; t <= L && t <= d.length;) {
                var n = d.slice(0, t);
                if ($.country_phone_code_to_countries[n]) return {
                    country_phone_code: n,
                    number: d.slice(t)
                };
                t++
            }
            return {}
        }

        function _(d, $) {
            var t = (0, b.get_national_prefix_for_parsing)($);
            if (!d || !t) return d;
            var n = new RegExp("^(?:" + t + ")"),
                e = n.exec(d);
            if (!e) return d;
            var r = (0, b.get_national_prefix_transform_rule)($),
                l = void 0,
                u = e[e.length - 1];
            l = r && u ? d.replace(n, r) : d.slice(e[0].length);
            var o = new RegExp((0, b.get_national_number_pattern)($));
            return (0, g.matches_entirely)(d, o) && !(0, g.matches_entirely)(l, o) ? d : l
        }

        function f(d, $, t) {
            var n = t.country_phone_code_to_countries[d];
            if (1 === n.length) return n[0];
            var e = !0,
                r = !1,
                l = void 0;
            try {
                for (var u, o = (0, m.default)(n); !(e = (u = o.next()).done); e = !0) {
                    var i = u.value,
                        a = t.countries[i];
                    if ((0, b.get_leading_digits)(a)) {
                        if ($ && 0 === $.search((0, b.get_leading_digits)(a))) return i
                    } else if (c($, a)) return i
                }
            } catch (d) {
                r = !0, l = d
            } finally {
                try {
                    !e && o.return && o.return()
                } finally {
                    if (r) throw l
                }
            }
        }

        function c(d, $) {
            if (s(d, (0, b.get_national_number_pattern)($))) return s(d, (0, b.get_type_mobile)($)) ? (0, b.get_type_fixed_line)($) ? "MOBILE" : "FIXED_LINE_OR_MOBILE" : s(d, (0, b.get_type_fixed_line)($)) ? (0, b.get_type_mobile)($) ? "FIXED_LINE" : "FIXED_LINE_OR_MOBILE" : s(d, (0, b.get_type_toll_free)($)) ? "TOLL_FREE" : s(d, (0, b.get_type_premium_rate)($)) ? "PREMIUM_RATE" : s(d, (0, b.get_type_personal_number)($)) ? "PERSONAL_NUMBER" : s(d, (0, b.get_type_voice_mail)($)) ? "VOICEMAIL" : s(d, (0, b.get_type_uan)($)) ? "UAN" : s(d, (0, b.get_type_pager)($)) ? "PAGER" : s(d, (0, b.get_type_voip)($)) ? "VOIP" : s(d, (0, b.get_type_shared_cost)($)) ? "SHARED_COST" : void 0
        }

        function s(d, $) {
            return (0, g.matches_entirely)(d, $)
        }

        function p(d, $) {
            var t = (0, x.choose_format_for_number)((0, b.get_formats)($), d);
            if (t) return (0, b.get_format_national_prefix_is_mandatory_when_formatting)(t, $)
        }
        Object.defineProperty($, "__esModule", {
            value: !0
        }), $.VALID_PUNCTUATION = $.VALID_DIGITS = $.PLUS_CHARS = void 0, $.default = e, $.normalize = r, $.replace_characters = l, $.is_viable_phone_number = u, $.extract_formatted_phone_number = o, $.parse_phone_number = i, $.parse_phone_number_and_country_phone_code = a, $.strip_national_prefix = _, $.find_country_code = f, $.get_number_type = c, $.is_of_type = s, $.is_national_prefix_required = p;
        var h = t(14),
            m = n(h),
            y = t(41),
            v = n(y),
            g = t(13),
            b = t(6),
            x = t(12),
            M = $.PLUS_CHARS = "+＋",
            E = $.VALID_DIGITS = "0-9０-９٠-٩۰-۹",
            O = $.VALID_PUNCTUATION = "-x‐-―−ー－-／  ­​⁠　()（）［］.\\[\\]/~⁓∼～",
            S = "[" + E + "]{" + G + "}",
            A = "[" + M + "]{0,1}(?:[" + O + "]*[" + E + "]){3,}[" + O + E + "]*",
            T = new RegExp("^" + S + "$|^" + A + "$", "i"),
            I = new RegExp("[" + M + E + "]"),
            P = new RegExp("[^" + E + "]+$"),
            R = new RegExp("^[" + M + "]+"),
            C = {
                0: "0",
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
                6: "6",
                7: "7",
                8: "8",
                9: "9",
                "０": "0",
                "１": "1",
                "２": "2",
                "３": "3",
                "４": "4",
                "５": "5",
                "６": "6",
                "７": "7",
                "８": "8",
                "９": "9",
                "٠": "0",
                "١": "1",
                "٢": "2",
                "٣": "3",
                "٤": "4",
                "٥": "5",
                "٦": "6",
                "٧": "7",
                "٨": "8",
                "٩": "9",
                "۰": "0",
                "۱": "1",
                "۲": "2",
                "۳": "3",
                "۴": "4",
                "۵": "5",
                "۶": "6",
                "۷": "7",
                "۸": "8",
                "۹": "9"
            },
            L = 3,
            G = 2,
            N = 17,
            w = 250,
            B = {
                country: {}
            }
    }, function(d, $, t) {
        "use strict";

        function n(d) {
            return d[0]
        }

        function e(d) {
            return d[1]
        }

        function r(d) {
            return d[2] || []
        }

        function l(d) {
            return d[3]
        }

        function u(d) {
            return d[4]
        }

        function o(d) {
            var $ = d[5];
            return $ || ($ = l(d)), $
        }

        function i(d) {
            return d[6]
        }

        function a(d) {
            return d[7]
        }

        function _(d) {
            return d[8]
        }

        function f(d) {
            return d[0]
        }

        function c(d) {
            return d[1]
        }

        function s(d) {
            return d[2] || []
        }

        function p(d, $) {
            return d[3] || u($)
        }

        function h(d, $) {
            return d[4] || a($)
        }

        function m(d, $) {
            return p(d, $) && !h(d, $)
        }

        function y(d) {
            return d[5] || c(d)
        }

        function v(d, $) {
            var t = $.country_phone_code_to_countries[d][0];
            return $.countries[t]
        }

        function g(d) {
            return d[9]
        }

        function b(d, $) {
            return g(d) ? g(d)[$] : void 0
        }

        function x(d) {
            return b(d, 0)
        }

        function M(d) {
            return b(d, 1)
        }

        function E(d) {
            return b(d, 2)
        }

        function O(d) {
            return b(d, 3)
        }

        function S(d) {
            return b(d, 4)
        }

        function A(d) {
            return b(d, 5)
        }

        function T(d) {
            return b(d, 6)
        }

        function I(d) {
            return b(d, 7)
        }

        function P(d) {
            return b(d, 8)
        }

        function R(d) {
            return b(d, 9)
        }
        Object.defineProperty($, "__esModule", {
            value: !0
        }), $.get_phone_code = n, $.get_national_number_pattern = e, $.get_formats = r, $.get_national_prefix = l, $.get_national_prefix_formatting_rule = u, $.get_national_prefix_for_parsing = o, $.get_national_prefix_transform_rule = i, $.get_national_prefix_is_optional_when_formatting = a, $.get_leading_digits = _, $.get_format_pattern = f, $.get_format_format = c, $.get_format_leading_digits_patterns = s, $.get_format_national_prefix_formatting_rule = p, $.get_format_national_prefix_is_optional_when_formatting = h, $.get_format_national_prefix_is_mandatory_when_formatting = m, $.get_format_international_format = y, $.get_metadata_by_country_phone_code = v, $.get_types = g, $.get_type_fixed_line = x, $.get_type_mobile = M, $.get_type_toll_free = E, $.get_type_premium_rate = O, $.get_type_personal_number = S, $.get_type_voice_mail = A, $.get_type_uan = T, $.get_type_pager = I, $.get_type_voip = P, $.get_type_shared_cost = R
    }, function(d, $, t) {
        var n = t(17);
        d.exports = function(d) {
            if (!n(d)) throw TypeError(d + " is not an object!");
            return d
        }
    }, function(d, $, t) {
        var n = t(1),
            e = t(0),
            r = t(50),
            l = t(4),
            u = "prototype",
            o = function(d, $, t) {
                var i, a, _, f = d & o.F,
                    c = d & o.G,
                    s = d & o.S,
                    p = d & o.P,
                    h = d & o.B,
                    m = d & o.W,
                    y = c ? e : e[$] || (e[$] = {}),
                    v = y[u],
                    g = c ? n : s ? n[$] : (n[$] || {})[u];
                c && (t = $);
                for (i in t) a = !f && g && void 0 !== g[i], a && i in y || (_ = a ? g[i] : t[i], y[i] = c && "function" != typeof g[i] ? t[i] : h && a ? r(_, n) : m && g[i] == _ ? function(d) {
                    var $ = function($, t, n) {
                        if (this instanceof d) {
                            switch (arguments.length) {
                                case 0:
                                    return new d;
                                case 1:
                                    return new d($);
                                case 2:
                                    return new d($, t)
                            }
                            return new d($, t, n)
                        }
                        return d.apply(this, arguments)
                    };
                    return $[u] = d[u], $
                }(_) : p && "function" == typeof _ ? r(Function.call, _) : _, p && ((y.virtual || (y.virtual = {}))[i] = _, d & o.R && v && !v[i] && l(v, i, _)))
            };
        o.F = 1, o.G = 2, o.S = 4, o.P = 8, o.B = 16, o.W = 32, o.U = 64, o.R = 128, d.exports = o
    }, function(d, $) {
        var t = {}.hasOwnProperty;
        d.exports = function(d, $) {
            return t.call(d, $)
        }
    }, function(d, $) {
        d.exports = {}
    }, function(d, $, t) {
        var n = t(7),
            e = t(52),
            r = t(66),
            l = Object.defineProperty;
        $.f = t(3) ? Object.defineProperty : function(d, $, t) {
            if (n(d), $ = r($, !0), n(t), e) try {
                return l(d, $, t)
            } catch (d) {}
            if ("get" in t || "set" in t) throw TypeError("Accessors not supported!");
            return "value" in t && (d[$] = t.value), d
        }
    }, function(d, $, t) {
        "use strict";

        function n(d) {
            return d && d.__esModule ? d : {
                default: d
            }
        }

        function e() {
            var d = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
                $ = arguments[1],
                t = arguments[2],
                n = arguments[3],
                e = void 0,
                r = void 0,
                u = void 0;
            "string" == typeof d ? "string" == typeof t ? (e = {
                phone: d,
                country: $
            }, r = t, u = n) : (e = {
                phone: d
            }, r = $, u = t) : (e = d, r = $, u = t);
            var o = void 0;
            e.country && (o = u.countries[e.country]);
            var i = (0, f.parse_phone_number_and_country_phone_code)(e.phone, u),
                a = i.country_phone_code,
                _ = i.number;
            if (a) {
                if (e.country && o && a !== (0, c.get_phone_code)(o)) return e.phone;
                o = (0, c.get_metadata_by_country_phone_code)(a, u)
            }
            if (!o) return e.phone;
            switch (r) {
                case "International":
                    if (!_) return "+" + (0, c.get_phone_code)(o);
                    var s = l(_, "International", !1, o);
                    return "+" + (0, c.get_phone_code)(o) + " " + s;
                case "International_plaintext":
                    return "+" + (0, c.get_phone_code)(o) + e.phone;
                case "National":
                    return _ ? l(_, "National", !1, o) : ""
            }
        }

        function r(d, $, t, n, e) {
            var r = new RegExp((0, c.get_format_pattern)($)),
                l = (0, c.get_format_national_prefix_formatting_rule)($, e),
                u = !l || l && (0, c.get_format_national_prefix_is_optional_when_formatting)($, e) && !n;
            if (!t && !u) return d.replace(r, (0, c.get_format_format)($).replace(s, l));
            var i = d.replace(r, t ? (0, c.get_format_international_format)($) : (0, c.get_format_format)($));
            //return t ? o(i) : i // modified by niladri to return with hipehenated
            return i;
        }

        function l(d, $, t, n) {
            var e = u((0, c.get_formats)(n), d);
            return e ? r(d, e, "International" === $, t, n) : d
        }

        function u(d, $) {
            var t = !0,
                n = !1,
                e = void 0;
            try {
                for (var r, l = (0, a.default)(d); !(t = (r = l.next()).done); t = !0) {
                    var u = r.value;
                    if ((0, c.get_format_leading_digits_patterns)(u).length > 0) {
                        var o = (0, c.get_format_leading_digits_patterns)(u)[(0, c.get_format_leading_digits_patterns)(u).length - 1];
                        if (0 !== $.search(o)) continue
                    }
                    if ((0, _.matches_entirely)($, new RegExp((0, c.get_format_pattern)(u)))) return u
                }
            } catch (d) {
                n = !0, e = d
            } finally {
                try {
                    !t && l.return && l.return()
                } finally {
                    if (n) throw e
                }
            }
        }

        function o(d) {
            return d.replace(/[\(\)]/g, "").replace(/\-/g, " ").trim()
        }
        Object.defineProperty($, "__esModule", {
            value: !0
        }), $.FIRST_GROUP_PATTERN = void 0, $.default = e, $.format_national_number_using_format = r, $.format_national_number = l, $.choose_format_for_number = u, $.local_to_international_style = o;
        var i = t(14),
            a = n(i),
            _ = t(13),
            f = t(5),
            c = t(6),
            s = $.FIRST_GROUP_PATTERN = /(\$\d)/
    }, function(d, $, t) {
        "use strict";

        function n() {
            var d = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
                $ = arguments[1];
            "string" == typeof $ && ($ = "^(?:" + $ + ")$");
            var t = d.match($);
            return t && t[0].length === d.length
        }
        Object.defineProperty($, "__esModule", {
            value: !0
        }), $.matches_entirely = n
    }, function(d, $, t) {
        d.exports = {
            default: t(42),
            __esModule: !0
        }
    }, function(d, $) {
        d.exports = function(d) {
            if (void 0 == d) throw TypeError("Can't call method on  " + d);
            return d
        }
    }, function(d, $) {
        d.exports = function(d) {
            try {
                return !!d()
            } catch (d) {
                return !0
            }
        }
    }, function(d, $) {
        d.exports = function(d) {
            return "object" == typeof d ? null !== d : "function" == typeof d
        }
    }, function(d, $, t) {
        var n = t(30)("keys"),
            e = t(32);
        d.exports = function(d) {
            return n[d] || (n[d] = e(d))
        }
    }, function(d, $) {
        var t = Math.ceil,
            n = Math.floor;
        d.exports = function(d) {
            return isNaN(d = +d) ? 0 : (d > 0 ? n : t)(d)
        }
    }, function(d, $, t) {
        var n = t(24),
            e = t(15);
        d.exports = function(d) {
            return n(e(d))
        }
    }, function(d, $) {
        var t = {}.toString;
        d.exports = function(d) {
            return t.call(d).slice(8, -1)
        }
    }, function(d, $, t) {
        var n = t(17),
            e = t(1).document,
            r = n(e) && n(e.createElement);
        d.exports = function(d) {
            return r ? e.createElement(d) : {}
        }
    }, function(d, $) {
        d.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")
    }, function(d, $, t) {
        var n = t(21);
        d.exports = Object("z").propertyIsEnumerable(0) ? Object : function(d) {
            return "String" == n(d) ? d.split("") : Object(d)
        }
    }, function(d, $, t) {
        "use strict";
        var n = t(55),
            e = t(8),
            r = t(62),
            l = t(4),
            u = t(9),
            o = t(10),
            i = t(53),
            a = t(29),
            _ = t(59),
            f = t(2)("iterator"),
            c = !([].keys && "next" in [].keys()),
            s = "@@iterator",
            p = "keys",
            h = "values",
            m = function() {
                return this
            };
        d.exports = function(d, $, t, y, v, g, b) {
            i(t, $, y);
            var x, M, E, O = function(d) {
                    if (!c && d in I) return I[d];
                    switch (d) {
                        case p:
                            return function() {
                                return new t(this, d)
                            };
                        case h:
                            return function() {
                                return new t(this, d)
                            }
                    }
                    return function() {
                        return new t(this, d)
                    }
                },
                S = $ + " Iterator",
                A = v == h,
                T = !1,
                I = d.prototype,
                P = I[f] || I[s] || v && I[v],
                R = P || O(v),
                C = v ? A ? O("entries") : R : void 0,
                L = "Array" == $ ? I.entries || P : P;
            if (L && (E = _(L.call(new d)), E !== Object.prototype && (a(E, S, !0), n || u(E, f) || l(E, f, m))), A && P && P.name !== h && (T = !0, R = function() {
                    return P.call(this)
                }), n && !b || !c && !T && I[f] || l(I, f, R), o[$] = R, o[S] = m, v)
                if (x = {
                        values: A ? R : O(h),
                        keys: g ? R : O(p),
                        entries: C
                    }, b)
                    for (M in x) M in I || r(I, M, x[M]);
                else e(e.P + e.F * (c || T), $, x);
            return x
        }
    }, function(d, $, t) {
        var n = t(7),
            e = t(57),
            r = t(23),
            l = t(18)("IE_PROTO"),
            u = function() {},
            o = "prototype",
            i = function() {
                var d, $ = t(22)("iframe"),
                    n = r.length,
                    e = "<",
                    l = ">";
                for ($.style.display = "none", t(51).appendChild($), $.src = "javascript:", d = $.contentWindow.document, d.open(), d.write(e + "script" + l + "document.F=Object" + e + "/script" + l), d.close(), i = d.F; n--;) delete i[o][r[n]];
                return i()
            };
        d.exports = Object.create || function(d, $) {
            var t;
            return null !== d ? (u[o] = n(d), t = new u, u[o] = null, t[l] = d) : t = i(), void 0 === $ ? t : e(t, $)
        }
    }, function(d, $, t) {
        var n = t(60),
            e = t(23);
        d.exports = Object.keys || function(d) {
            return n(d, e)
        }
    }, function(d, $) {
        d.exports = function(d, $) {
            return {
                enumerable: !(1 & d),
                configurable: !(2 & d),
                writable: !(4 & d),
                value: $
            }
        }
    }, function(d, $, t) {
        var n = t(11).f,
            e = t(9),
            r = t(2)("toStringTag");
        d.exports = function(d, $, t) {
            d && !e(d = t ? d : d.prototype, r) && n(d, r, {
                configurable: !0,
                value: $
            })
        }
    }, function(d, $, t) {
        var n = t(1),
            e = "__core-js_shared__",
            r = n[e] || (n[e] = {});
        d.exports = function(d) {
            return r[d] || (r[d] = {})
        }
    }, function(d, $, t) {
        var n = t(15);
        d.exports = function(d) {
            return Object(n(d))
        }
    }, function(d, $) {
        var t = 0,
            n = Math.random();
        d.exports = function(d) {
            return "Symbol(".concat(void 0 === d ? "" : d, ")_", (++t + n).toString(36))
        }
    }, function(d, $) {
        d.exports = {
            country_phone_code_to_countries: {
                1: ["US", "AG", "AI", "AS", "BB", "BM", "BS", "CA", "DM", "DO", "GD", "GU", "JM", "KN", "KY", "LC", "MP", "MS", "PR", "SX", "TC", "TT", "VC", "VG", "VI"],
                7: ["RU", "KZ"],
                20: ["EG"],
                27: ["ZA"],
                30: ["GR"],
                31: ["NL"],
                32: ["BE"],
                33: ["FR"],
                34: ["ES"],
                36: ["HU"],
                39: ["IT", "VA"],
                40: ["RO"],
                41: ["CH"],
                43: ["AT"],
                44: ["GB", "GG", "IM", "JE"],
                45: ["DK"],
                46: ["SE"],
                47: ["NO", "SJ"],
                48: ["PL"],
                49: ["DE"],
                51: ["PE"],
                52: ["MX"],
                53: ["CU"],
                54: ["AR"],
                55: ["BR"],
                56: ["CL"],
                57: ["CO"],
                58: ["VE"],
                60: ["MY"],
                61: ["AU", "CC", "CX"],
                62: ["ID"],
                63: ["PH"],
                64: ["NZ"],
                65: ["SG"],
                66: ["TH"],
                81: ["JP"],
                82: ["KR"],
                84: ["VN"],
                86: ["CN"],
                90: ["TR"],
                91: ["IN"],
                92: ["PK"],
                93: ["AF"],
                94: ["LK"],
                95: ["MM"],
                98: ["IR"],
                211: ["SS"],
                212: ["MA", "EH"],
                213: ["DZ"],
                216: ["TN"],
                218: ["LY"],
                220: ["GM"],
                221: ["SN"],
                222: ["MR"],
                223: ["ML"],
                224: ["GN"],
                225: ["CI"],
                226: ["BF"],
                227: ["NE"],
                228: ["TG"],
                229: ["BJ"],
                230: ["MU"],
                231: ["LR"],
                232: ["SL"],
                233: ["GH"],
                234: ["NG"],
                235: ["TD"],
                236: ["CF"],
                237: ["CM"],
                238: ["CV"],
                239: ["ST"],
                240: ["GQ"],
                241: ["GA"],
                242: ["CG"],
                243: ["CD"],
                244: ["AO"],
                245: ["GW"],
                246: ["IO"],
                247: ["AC"],
                248: ["SC"],
                249: ["SD"],
                250: ["RW"],
                251: ["ET"],
                252: ["SO"],
                253: ["DJ"],
                254: ["KE"],
                255: ["TZ"],
                256: ["UG"],
                257: ["BI"],
                258: ["MZ"],
                260: ["ZM"],
                261: ["MG"],
                262: ["RE", "YT"],
                263: ["ZW"],
                264: ["NA"],
                265: ["MW"],
                266: ["LS"],
                267: ["BW"],
                268: ["SZ"],
                269: ["KM"],
                290: ["SH", "TA"],
                291: ["ER"],
                297: ["AW"],
                298: ["FO"],
                299: ["GL"],
                350: ["GI"],
                351: ["PT"],
                352: ["LU"],
                353: ["IE"],
                354: ["IS"],
                355: ["AL"],
                356: ["MT"],
                357: ["CY"],
                358: ["FI", "AX"],
                359: ["BG"],
                370: ["LT"],
                371: ["LV"],
                372: ["EE"],
                373: ["MD"],
                374: ["AM"],
                375: ["BY"],
                376: ["AD"],
                377: ["MC"],
                378: ["SM"],
                380: ["UA"],
                381: ["RS"],
                382: ["ME"],
                385: ["HR"],
                386: ["SI"],
                387: ["BA"],
                389: ["MK"],
                420: ["CZ"],
                421: ["SK"],
                423: ["LI"],
                500: ["FK"],
                501: ["BZ"],
                502: ["GT"],
                503: ["SV"],
                504: ["HN"],
                505: ["NI"],
                506: ["CR"],
                507: ["PA"],
                508: ["PM"],
                509: ["HT"],
                590: ["GP", "BL", "MF"],
                591: ["BO"],
                592: ["GY"],
                593: ["EC"],
                594: ["GF"],
                595: ["PY"],
                596: ["MQ"],
                597: ["SR"],
                598: ["UY"],
                599: ["CW", "BQ"],
                670: ["TL"],
                672: ["NF"],
                673: ["BN"],
                674: ["NR"],
                675: ["PG"],
                676: ["TO"],
                677: ["SB"],
                678: ["VU"],
                679: ["FJ"],
                680: ["PW"],
                681: ["WF"],
                682: ["CK"],
                683: ["NU"],
                685: ["WS"],
                686: ["KI"],
                687: ["NC"],
                688: ["TV"],
                689: ["PF"],
                690: ["TK"],
                691: ["FM"],
                692: ["MH"],
                800: ["001"],
                808: ["001"],
                850: ["KP"],
                852: ["HK"],
                853: ["MO"],
                855: ["KH"],
                856: ["LA"],
                870: ["001"],
                878: ["001"],
                880: ["BD"],
                881: ["001"],
                882: ["001"],
                883: ["001"],
                886: ["TW"],
                888: ["001"],
                960: ["MV"],
                961: ["LB"],
                962: ["JO"],
                963: ["SY"],
                964: ["IQ"],
                965: ["KW"],
                966: ["SA"],
                967: ["YE"],
                968: ["OM"],
                970: ["PS"],
                971: ["AE"],
                972: ["IL"],
                973: ["BH"],
                974: ["QA"],
                975: ["BT"],
                976: ["MN"],
                977: ["NP"],
                979: ["001"],
                992: ["TJ"],
                993: ["TM"],
                994: ["AZ"],
                995: ["GE"],
                996: ["KG"],
                998: ["UZ"]
            },
            countries: {
                AC: ["247", "[46]\\d{4}|[01589]\\d{5}"],
                AD: ["376", "[16]\\d{5,8}|[37-9]\\d{5}", [
                    ["(\\d{3})(\\d{3})", "$1 $2", ["[137-9]|6[0-8]"]],
                    ["(\\d{4})(\\d{4})", "$1 $2", ["180", "180[02]"]],
                    ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["690"]]
                ]],
                AE: ["971", "[2-79]\\d{7,8}|800\\d{2,9}", [
                    ["([2-4679])(\\d{3})(\\d{4})", "$1 $2 $3", ["[2-4679][2-8]"]],
                    ["(5\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["5"]],
                    ["([479]00)(\\d)(\\d{5})", "$1 $2 $3", ["[479]0"], "$1"],
                    ["([68]00)(\\d{2,9})", "$1 $2", ["60|8"], "$1"]
                ], "0", "0$1"],
                AF: ["93", "[2-7]\\d{8}", [
                    ["([2-7]\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[2-7]"]]
                ], "0", "0$1"],
                AG: ["1", "[2589]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, "268"],
                AI: ["1", "[2589]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, "264"],
                AL: ["355", "[2-57]\\d{7}|6\\d{8}|8\\d{5,7}|9\\d{5}", [
                    ["(4)(\\d{3})(\\d{4})", "$1 $2 $3", ["4[0-6]"]],
                    ["(6[6-9])(\\d{3})(\\d{4})", "$1 $2 $3", ["6"]],
                    ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2358][2-5]|4[7-9]"]],
                    ["(\\d{3})(\\d{3,5})", "$1 $2", ["[235][16-9]|8[016-9]|[79]"]]
                ], "0", "0$1"],
                AM: ["374", "[1-9]\\d{7}", [
                    ["(\\d{2})(\\d{6})", "$1 $2", ["1|47"]],
                    ["(\\d{2})(\\d{6})", "$1 $2", ["4[1349]|[5-7]|9[1-9]"], "0$1"],
                    ["(\\d{3})(\\d{5})", "$1 $2", ["[23]"]],
                    ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["8|90"], "0 $1"]
                ], "0", "(0$1)"],
                AO: ["244", "[29]\\d{8}", [
                    ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3"]
                ]],
                AR: ["54", "11\\d{8}|[2368]\\d{9}|9\\d{10}", [
                    ["([68]\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["[68]"]],
                    ["(9)(11)(\\d{4})(\\d{4})", "$2 15-$3-$4", ["911"], null, null, "$1 $2 $3-$4"],
                    ["(9)(\\d{3})(\\d{3})(\\d{4})", "$2 15-$3-$4", ["9(?:2[234689]|3[3-8])", "9(?:2(?:2[013]|3[067]|49|6[01346]|80|9[147-9])|3(?:36|4[1-358]|5[138]|6[24]|7[069]|8[013578]))", "9(?:2(?:2(?:0[013-9]|[13])|3(?:0[013-9]|[67])|49|6(?:[0136]|4[0-59])|8|9(?:[19]|44|7[013-9]|8[14]))|3(?:36|4(?:[12]|3[456]|[58]4)|5(?:1|3[0-24-689]|8[46])|6|7[069]|8(?:[01]|34|[578][45])))", "9(?:2(?:2(?:0[013-9]|[13])|3(?:0[013-9]|[67])|49|6(?:[0136]|4[0-59])|8|9(?:[19]|44|7[013-9]|8[14]))|3(?:36|4(?:[12]|3(?:4|5[014]|6[1239])|[58]4)|5(?:1|3[0-24-689]|8[46])|6|7[069]|8(?:[01]|34|[578][45])))"], null, null, "$1 $2 $3-$4"],
                    ["(9)(\\d{4})(\\d{2})(\\d{4})", "$2 15-$3-$4", ["9[23]"], null, null, "$1 $2 $3-$4"],
                    ["(11)(\\d{4})(\\d{4})", "$1 $2-$3", ["1"], null, "true"],
                    ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2-$3", ["2(?:2[013]|3[067]|49|6[01346]|80|9[147-9])|3(?:36|4[1-358]|5[138]|6[24]|7[069]|8[013578])", "2(?:2(?:0[013-9]|[13])|3(?:0[013-9]|[67])|49|6(?:[0136]|4[0-59])|8|9(?:[19]|44|7[013-9]|8[14]))|3(?:36|4(?:[12]|3[456]|[58]4)|5(?:1|3[0-24-689]|8[46])|6|7[069]|8(?:[01]|34|[578][45]))", "2(?:2(?:0[013-9]|[13])|3(?:0[013-9]|[67])|49|6(?:[0136]|4[0-59])|8|9(?:[19]|44|7[013-9]|8[14]))|3(?:36|4(?:[12]|3(?:4|5[014]|6[1239])|[58]4)|5(?:1|3[0-24-689]|8[46])|6|7[069]|8(?:[01]|34|[578][45]))"], null, "true"],
                    ["(\\d{4})(\\d{2})(\\d{4})", "$1 $2-$3", ["[23]"], null, "true"]
                ], "0", "0$1", "0?(?:(11|2(?:2(?:02?|[13]|2[13-79]|4[1-6]|5[2457]|6[124-8]|7[1-4]|8[13-6]|9[1267])|3(?:02?|1[467]|2[03-6]|3[13-8]|[49][2-6]|5[2-8]|[67])|4(?:7[3-578]|9)|6(?:[0136]|2[24-6]|4[6-8]?|5[15-8])|80|9(?:0[1-3]|[19]|2\\d|3[1-6]|4[02568]?|5[2-4]|6[2-46]|72?|8[23]?))|3(?:3(?:2[79]|6|8[2578])|4(?:0[0-24-9]|[12]|3[5-8]?|4[24-7]|5[4-68]?|6[02-9]|7[126]|8[2379]?|9[1-36-8])|5(?:1|2[1245]|3[237]?|4[1-46-9]|6[2-4]|7[1-6]|8[2-5]?)|6[24]|7(?:[069]|1[1568]|2[15]|3[145]|4[13]|5[14-8]|7[2-57]|8[126])|8(?:[01]|2[15-7]|3[2578]?|4[13-6]|5[4-8]?|6[1-357-9]|7[36-8]?|8[5-8]?|9[124])))?15)?", "9$1"],
                AS: ["1", "[5689]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, "684"],
                AT: ["43", "[1-9]\\d{3,12}", [
                    ["(116\\d{3})", "$1", ["116"], "$1"],
                    ["(1)(\\d{3,12})", "$1 $2", ["1"]],
                    ["(5\\d)(\\d{3,5})", "$1 $2", ["5[079]"]],
                    ["(5\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["5[079]"]],
                    ["(5\\d)(\\d{4})(\\d{4,7})", "$1 $2 $3", ["5[079]"]],
                    ["(\\d{3})(\\d{3,10})", "$1 $2", ["316|46|51|732|6(?:5[0-3579]|[6-9])|7(?:[28]0)|[89]"]],
                    ["(\\d{4})(\\d{3,9})", "$1 $2", ["2|3(?:1[1-578]|[3-8])|4[2378]|5[2-6]|6(?:[12]|4[1-9]|5[468])|7(?:2[1-8]|35|4[1-8]|[5-79])"]]
                ], "0", "0$1"],
                AU: ["61", "[1-578]\\d{5,9}", [
                    ["([2378])(\\d{4})(\\d{4})", "$1 $2 $3", ["[2378]"], "(0$1)"],
                    ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[45]|14"], "0$1"],
                    ["(16)(\\d{3})(\\d{2,4})", "$1 $2 $3", ["16"], "0$1"],
                    ["(1[389]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["1(?:[38]0|90)", "1(?:[38]00|90)"], "$1"],
                    ["(180)(2\\d{3})", "$1 $2", ["180", "1802"], "$1"],
                    ["(19\\d)(\\d{3})", "$1 $2", ["19[13]"], "$1"],
                    ["(19\\d{2})(\\d{4})", "$1 $2", ["19[679]"], "$1"],
                    ["(13)(\\d{2})(\\d{2})", "$1 $2 $3", ["13[1-9]"], "$1"]
                ], "0", null, null, null, null, null, ["[237]\\d{8}|8(?:[6-8]\\d{3}|9(?:[02-9]\\d{2}|1(?:[0-57-9]\\d|6[0135-9])))\\d{4}", "14(?:5\\d|71)\\d{5}|4(?:[0-3]\\d|4[47-9]|5[0-25-9]|6[6-9]|7[02-9]|8[147-9]|9[017-9])\\d{6}", "180(?:0\\d{3}|2)\\d{3}", "19(?:0[0126]\\d|[679])\\d{5}", "500\\d{6}", null, null, "16\\d{3,7}", "550\\d{6}"]],
                AW: ["297", "[25-9]\\d{6}", [
                    ["(\\d{3})(\\d{4})", "$1 $2"]
                ]],
                AX: ["358", "[135]\\d{5,9}|[27]\\d{4,9}|4\\d{5,10}|6\\d{7,8}|8\\d{6,9}", [
                    ["(\\d{3})(\\d{3,7})", "$1 $2", ["(?:[1-3]00|[6-8]0)"]],
                    ["(116\\d{3})", "$1", ["116"], "$1"],
                    ["(\\d{2})(\\d{4,10})", "$1 $2", ["[14]|2[09]|50|7[135]"]],
                    ["(\\d)(\\d{4,11})", "$1 $2", ["[25689][1-8]|3"]]
                ], "0", "0$1", null, null, null, null, ["18[1-8]\\d{3,9}", "4\\d{5,10}|50\\d{4,8}", "800\\d{4,7}", "[67]00\\d{5,6}", null, null, "[13]0\\d{4,8}|2(?:0(?:[016-8]\\d{3,7}|[2-59]\\d{2,7})|9\\d{4,8})|60(?:[12]\\d{5,6}|6\\d{7})|7(?:1\\d{7}|3\\d{8}|5[03-9]\\d{2,7})"]],
                AZ: ["994", "[1-9]\\d{8}", [
                    ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["(?:1[28]|2(?:[45]2|[0-36])|365)"]],
                    ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[4-8]"], "0$1"],
                    ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["9"], "0$1"]
                ], "0", "(0$1)"],
                BA: ["387", "[3-9]\\d{7,8}", [
                    ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2-$3", ["[3-5]"]],
                    ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["6[1-356]|[7-9]"]],
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["6[047]"]]
                ], "0", "0$1"],
                BB: ["1", "[2589]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, "246"],
                BD: ["880", "[2-79]\\d{5,9}|1\\d{9}|8[0-7]\\d{4,8}", [
                    ["(2)(\\d{7,8})", "$1-$2", ["2"]],
                    ["(\\d{2})(\\d{4,6})", "$1-$2", ["[3-79]1"]],
                    ["(\\d{4})(\\d{3,6})", "$1-$2", ["1|3(?:0|[2-58]2)|4(?:0|[25]2|3[23]|[4689][25])|5(?:[02-578]2|6[25])|6(?:[0347-9]2|[26][25])|7[02-9]2|8(?:[023][23]|[4-7]2)|9(?:[02][23]|[458]2|6[016])"]],
                    ["(\\d{3})(\\d{3,7})", "$1-$2", ["[3-79][2-9]|8"]]
                ], "0", "0$1"],
                BE: ["32", "[1-9]\\d{7,8}", [
                    ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["4[6-9]"]],
                    ["(\\d)(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[23]|4[23]|9[2-4]"]],
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[156]|7[018]|8(?:0[1-9]|[1-79])"]],
                    ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["(?:80|9)0"]]
                ], "0", "0$1"],
                BF: ["226", "[25-7]\\d{7}", [
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4"]
                ]],
                BG: ["359", "[23567]\\d{5,7}|[489]\\d{6,8}", [
                    ["(2)(\\d)(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["2"]],
                    ["(2)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2"]],
                    ["(\\d{3})(\\d{4})", "$1 $2", ["43[124-7]|70[1-9]"]],
                    ["(\\d{3})(\\d{3})(\\d{2})", "$1 $2 $3", ["43[124-7]|70[1-9]"]],
                    ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["[78]00"]],
                    ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["999"]],
                    ["(\\d{2})(\\d{3})(\\d{2,3})", "$1 $2 $3", ["[356]|4[124-7]|7[1-9]|8[1-6]|9[1-7]"]],
                    ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["48|8[7-9]|9[08]"]]
                ], "0", "0$1"],
                BH: ["973", "[136-9]\\d{7}", [
                    ["(\\d{4})(\\d{4})", "$1 $2"]
                ]],
                BI: ["257", "[267]\\d{7}", [
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4"]
                ]],
                BJ: ["229", "[2689]\\d{7}|7\\d{3}", [
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4"]
                ]],
                BL: ["590", "[56]\\d{8}", [
                    ["([56]90)(\\d{2})(\\d{4})", "$1 $2-$3"]
                ], "0", null, null, null, null, null, ["590(?:2[7-9]|5[12]|87)\\d{4}", "690(?:0[0-7]|[1-9]\\d)\\d{4}"]],
                BM: ["1", "[4589]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, "441"],
                BN: ["673", "[2-578]\\d{6}", [
                    ["([2-578]\\d{2})(\\d{4})", "$1 $2"]
                ]],
                BO: ["591", "[23467]\\d{7}", [
                    ["([234])(\\d{7})", "$1 $2", ["[234]"]],
                    ["([67]\\d{7})", "$1", ["[67]"]]
                ], "0", null, "0(1\\d)?"],
                BQ: ["599", "[347]\\d{6}", [
                    ["(\\d{3})(\\d{4})", "$1 $2", ["[13-7]"]],
                    ["(9)(\\d{3})(\\d{4})", "$1 $2 $3", ["9"]]
                ], null, null, null, null, null, null, ["(?:318[023]|416[023]|7(?:1[578]|50)\\d)\\d{3}", "(?:318[14-68]|416[15-9]|7(?:0[01]|7[07]|[89]\\d)\\d)\\d{3}"]],
                BR: ["55", "[1-46-9]\\d{7,10}|5(?:[0-4]\\d{7,9}|5(?:[2-8]\\d{7}|9\\d{7,8}))", [
                    ["(\\d{2})(\\d{5})(\\d{4})", "$1 $2-$3", ["(?:[14689][1-9]|2[12478]|3[1-578]|5[1-5]|7[13-579])9"], "($1)"],
                    ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2-$3", ["[1-9][1-9]"], "($1)"],
                    ["(\\d{4})(\\d{4})", "$1-$2", ["(?:300|40(?:0|20))"]],
                    ["([3589]00)(\\d{2,3})(\\d{4})", "$1 $2 $3", ["[3589]00"], "0$1"]
                ], "0", null, "0(?:(1[245]|2[1-35]|31|4[13]|[56]5|99)(\\d{10,11}))?", "$2"],
                BS: ["1", "[2589]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, "242"],
                BT: ["975", "[1-8]\\d{6,7}", [
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["1|77"]],
                    ["([2-8])(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-68]|7[246]"]]
                ]],
                BW: ["267", "[2-79]\\d{6,7}", [
                    ["(\\d{3})(\\d{4})", "$1 $2", ["[2-6]"]],
                    ["(7\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["7"]],
                    ["(90)(\\d{5})", "$1 $2", ["9"]]
                ]],
                BY: ["375", "[1-4]\\d{8}|800\\d{3,7}|[89]\\d{9,10}", [
                    ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["17[0-3589]|2[4-9]|[34]", "17(?:[02358]|1[0-2]|9[0189])|2[4-9]|[34]"], "8 0$1"],
                    ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["1(?:5[24]|6[235]|7[467])|2(?:1[246]|2[25]|3[26])", "1(?:5[24]|6(?:2|3[04-9]|5[0346-9])|7(?:[46]|7[37-9]))|2(?:1[246]|2[25]|3[26])"], "8 0$1"],
                    ["(\\d{4})(\\d{2})(\\d{3})", "$1 $2-$3", ["1(?:5[169]|6[3-5]|7[179])|2(?:1[35]|2[34]|3[3-5])", "1(?:5[169]|6(?:3[1-3]|4|5[125])|7(?:1[3-9]|7[0-24-6]|9[2-7]))|2(?:1[35]|2[34]|3[3-5])"], "8 0$1"],
                    ["([89]\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["8[01]|9"], "8 $1"],
                    ["(82\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["82"], "8 $1"],
                    ["(800)(\\d{3})", "$1 $2", ["800"], "8 $1"],
                    ["(800)(\\d{2})(\\d{2,4})", "$1 $2 $3", ["800"], "8 $1"]
                ], "8", null, "8?0?"],
                BZ: ["501", "[2-8]\\d{6}|0\\d{10}", [
                    ["(\\d{3})(\\d{4})", "$1-$2", ["[2-8]"]],
                    ["(0)(800)(\\d{4})(\\d{3})", "$1-$2-$3-$4", ["0"]]
                ]],
                CA: ["1", "[2-9]\\d{9}|3\\d{6}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, null, ["(?:2(?:04|[23]6|[48]9|50)|3(?:06|43|65)|4(?:03|1[68]|3[178]|50)|5(?:06|1[49]|48|79|8[17])|6(?:0[04]|13|22|39|47)|7(?:0[59]|78|8[02])|8(?:[06]7|19|25|73)|90[25])[2-9]\\d{6}|310\\d{4}", "(?:2(?:04|[23]6|[48]9|50)|3(?:06|43|65)|4(?:03|1[68]|3[178]|50)|5(?:06|1[49]|48|79|8[17])|6(?:0[04]|13|22|39|47)|7(?:0[59]|78|8[02])|8(?:[06]7|19|25|73)|90[25])[2-9]\\d{6}", "8(?:00|44|55|66|77|88)[2-9]\\d{6}|310\\d{4}", "900[2-9]\\d{6}", "5(?:00|22|33|44|66|77|88)[2-9]\\d{6}"]],
                CC: ["61", "[1458]\\d{5,9}", [
                    ["([2378])(\\d{4})(\\d{4})", "$1 $2 $3", ["[2378]"], "(0$1)"],
                    ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[45]|14"], "0$1"],
                    ["(16)(\\d{3})(\\d{2,4})", "$1 $2 $3", ["16"], "0$1"],
                    ["(1[389]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["1(?:[38]0|90)", "1(?:[38]00|90)"], "$1"],
                    ["(180)(2\\d{3})", "$1 $2", ["180", "1802"], "$1"],
                    ["(19\\d)(\\d{3})", "$1 $2", ["19[13]"], "$1"],
                    ["(19\\d{2})(\\d{4})", "$1 $2", ["19[679]"], "$1"],
                    ["(13)(\\d{2})(\\d{2})", "$1 $2 $3", ["13[1-9]"], "$1"]
                ], "0", null, null, null, null, null, ["89162\\d{4}", "14(?:5\\d|71)\\d{5}|4(?:[0-2]\\d|3[0-57-9]|4[47-9]|5[0-25-9]|6[6-9]|7[02-9]|8[147-9]|9[017-9])\\d{6}", "180(?:0\\d{3}|2)\\d{3}", "190[0126]\\d{6}", "500\\d{6}", null, null, null, "550\\d{6}"]],
                CD: ["243", "[2-6]\\d{6}|[18]\\d{6,8}|9\\d{8}", [
                    ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["12"]],
                    ["([89]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["8[0-2459]|9"]],
                    ["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["88"]],
                    ["(\\d{2})(\\d{5})", "$1 $2", ["[1-6]"]]
                ], "0", "0$1"],
                CF: ["236", "[278]\\d{7}", [
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4"]
                ]],
                CG: ["242", "[028]\\d{8}", [
                    ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[02]"]],
                    ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["8"]]
                ]],
                CH: ["41", "[2-9]\\d{8}|860\\d{9}", [
                    ["([2-9]\\d)(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-7]|[89]1"]],
                    ["([89]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["8[047]|90"]],
                    ["(\\d{3})(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["860"]]
                ], "0", "0$1"],
                CI: ["225", "[02-8]\\d{7}", [
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4"]
                ]],
                CK: ["682", "[2-8]\\d{4}", [
                    ["(\\d{2})(\\d{3})", "$1 $2"]
                ]],
                CL: ["56", "(?:[2-9]|600|123)\\d{7,8}", [
                    ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["2[23]"], "($1)"],
                    ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[357]|4[1-35]|6[13-57]"], "($1)"],
                    ["(9)(\\d{4})(\\d{4})", "$1 $2 $3", ["9"]],
                    ["(44)(\\d{3})(\\d{4})", "$1 $2 $3", ["44"]],
                    ["([68]00)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["60|8"], "$1"],
                    ["(600)(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["60"], "$1"],
                    ["(1230)(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "$1"],
                    ["(\\d{5})(\\d{4})", "$1 $2", ["219"], "($1)"]
                ], "0", "0$1", "0|(1(?:1[0-69]|2[0-57]|5[13-58]|69|7[0167]|8[018]))"],
                CM: ["237", "[2368]\\d{7,8}", [
                    ["([26])(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["[26]"]],
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[23]|88"]],
                    ["(800)(\\d{2})(\\d{3})", "$1 $2 $3", ["80"]]
                ]],
                CN: ["86", "[1-7]\\d{6,11}|8[0-357-9]\\d{6,9}|9\\d{7,10}", [
                    ["(80\\d{2})(\\d{4})", "$1 $2", ["80[2678]"], "0$1", "true"],
                    ["([48]00)(\\d{3})(\\d{4})", "$1 $2 $3", ["[48]00"]],
                    ["(\\d{2})(\\d{5,6})", "$1 $2", ["(?:10|2\\d)[19]", "(?:10|2\\d)(?:10|9[56])", "(?:10|2\\d)(?:100|9[56])"], "0$1"],
                    ["(\\d{3})(\\d{5,6})", "$1 $2", ["[3-9]", "[3-9]\\d{2}[19]", "[3-9]\\d{2}(?:10|9[56])"], "0$1"],
                    ["(21)(\\d{4})(\\d{4,6})", "$1 $2 $3", ["21"], "0$1", "true"],
                    ["([12]\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["10[1-9]|2[02-9]", "10[1-9]|2[02-9]", "10(?:[1-79]|8(?:[1-9]|0[1-9]))|2[02-9]"], "0$1", "true"],
                    ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["3(?:1[02-9]|35|49|5|7[02-68]|9[1-68])|4(?:1[02-9]|2[179]|[35][2-9]|6[4789]|7\\d|8[23])|5(?:3[03-9]|4[36]|5[02-9]|6[1-46]|7[028]|80|9[2-46-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]|2[248]|3[04-9]|4[3-6]|6[2368])|8(?:1[236-8]|2[5-7]|3|5[1-9]|7[02-9]|8[3678]|9[1-7])|9(?:0[1-3689]|1[1-79]|[379]|4[13]|5[1-5])"], "0$1", "true"],
                    ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["3(?:11|7[179])|4(?:[15]1|3[1-35])|5(?:1|2[37]|3[12]|51|7[13-79]|9[15])|7(?:31|5[457]|6[09]|91)|8(?:[57]1|98)"], "0$1", "true"],
                    ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["807", "8078"], "0$1", "true"],
                    ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["1[3-578]"]],
                    ["(10800)(\\d{3})(\\d{4})", "$1 $2 $3", ["108", "1080", "10800"]],
                    ["(\\d{3})(\\d{7,8})", "$1 $2", ["950"]]
                ], "0", null, "(1(?:[129]\\d{3}|79\\d{2}))|0"],
                CO: ["57", "(?:[13]\\d{0,3}|[24-8])\\d{7}", [
                    ["(\\d)(\\d{7})", "$1 $2", ["1(?:8[2-9]|9[0-3]|[2-7])|[24-8]", "1(?:8[2-9]|9(?:09|[1-3])|[2-7])|[24-8]"], "($1)"],
                    ["(\\d{3})(\\d{7})", "$1 $2", ["3"]],
                    ["(1)(\\d{3})(\\d{7})", "$1-$2-$3", ["1(?:80|9[04])", "1(?:800|9(?:0[01]|4[78]))"], "0$1", null, "$1 $2 $3"]
                ], "0", null, "0([3579]|4(?:44|56))?"],
                CR: ["506", "[24-9]\\d{7,9}", [
                    ["(\\d{4})(\\d{4})", "$1 $2", ["[24-7]|8[3-9]"]],
                    ["(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", ["[89]0"]]
                ], null, null, "(19(?:0[012468]|1[09]|20|66|77|99))"],
                CU: ["53", "[2-57]\\d{5,7}", [
                    ["(\\d)(\\d{6,7})", "$1 $2", ["7"]],
                    ["(\\d{2})(\\d{4,6})", "$1 $2", ["[2-4]"]],
                    ["(\\d)(\\d{7})", "$1 $2", ["5"], "0$1"]
                ], "0", "(0$1)"],
                CV: ["238", "[259]\\d{6}", [
                    ["(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3"]
                ]],
                CW: ["599", "[169]\\d{6,7}", [
                    ["(\\d{3})(\\d{4})", "$1 $2", ["[13-7]"]],
                    ["(9)(\\d{3})(\\d{4})", "$1 $2 $3", ["9"]]
                ], null, null, null, null, null, null, ["9(?:[48]\\d{2}|50\\d|7(?:2[0-24]|[34]\\d|6[35-7]|77|8[7-9]))\\d{4}", "9(?:5(?:[12467]\\d|3[01])|6(?:[15-9]\\d|3[01]))\\d{4}", null, null, null, null, null, "955\\d{5}"]],
                CX: ["61", "[1458]\\d{5,9}", [
                    ["([2378])(\\d{4})(\\d{4})", "$1 $2 $3", ["[2378]"], "(0$1)"],
                    ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[45]|14"], "0$1"],
                    ["(16)(\\d{3})(\\d{2,4})", "$1 $2 $3", ["16"], "0$1"],
                    ["(1[389]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["1(?:[38]0|90)", "1(?:[38]00|90)"], "$1"],
                    ["(180)(2\\d{3})", "$1 $2", ["180", "1802"], "$1"],
                    ["(19\\d)(\\d{3})", "$1 $2", ["19[13]"], "$1"],
                    ["(19\\d{2})(\\d{4})", "$1 $2", ["19[679]"], "$1"],
                    ["(13)(\\d{2})(\\d{2})", "$1 $2 $3", ["13[1-9]"], "$1"]
                ], "0", null, null, null, null, null, ["89164\\d{4}", "14(?:5\\d|71)\\d{5}|4(?:[0-2]\\d|3[0-57-9]|4[47-9]|5[0-25-9]|6[6-9]|7[02-9]|8[147-9]|9[017-9])\\d{6}", "180(?:0\\d{3}|2)\\d{3}", "190[0126]\\d{6}", "500\\d{6}", null, null, null, "550\\d{6}"]],
                CY: ["357", "[257-9]\\d{7}", [
                    ["(\\d{2})(\\d{6})", "$1 $2"]
                ]],
                CZ: ["420", "[2-8]\\d{8}|9\\d{8,11}", [
                    ["([2-9]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-8]|9[015-7]"]],
                    ["(96\\d)(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["96"]],
                    ["(9\\d)(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["9[36]"]]
                ]],
                DE: ["49", "[1-35-9]\\d{3,14}|4(?:[0-8]\\d{4,12}|9(?:[0-37]\\d|4(?:[1-35-8]|4\\d?)|5\\d{1,2}|6[1-8]\\d?)\\d{2,8})", [
                    ["(1\\d{2})(\\d{7,8})", "$1 $2", ["1[67]"]],
                    ["(15\\d{3})(\\d{6})", "$1 $2", ["15[0568]"]],
                    ["(1\\d{3})(\\d{7})", "$1 $2", ["15"]],
                    ["(\\d{2})(\\d{3,11})", "$1 $2", ["3[02]|40|[68]9"]],
                    ["(\\d{3})(\\d{3,11})", "$1 $2", ["2(?:\\d1|0[2389]|1[24]|28|34)|3(?:[3-9][15]|40)|[4-8][1-9]1|9(?:06|[1-9]1)"]],
                    ["(\\d{4})(\\d{2,11})", "$1 $2", ["[24-6]|[7-9](?:\\d[1-9]|[1-9]\\d)|3(?:[3569][02-46-9]|4[2-4679]|7[2-467]|8[2-46-8])", "[24-6]|[7-9](?:\\d[1-9]|[1-9]\\d)|3(?:3(?:0[1-467]|2[127-9]|3[124578]|[46][1246]|7[1257-9]|8[1256]|9[145])|4(?:2[135]|3[1357]|4[13578]|6[1246]|7[1356]|9[1346])|5(?:0[14]|2[1-3589]|3[1357]|4[1246]|6[1-4]|7[1346]|8[13568]|9[1246])|6(?:0[356]|2[1-489]|3[124-6]|4[1347]|6[13]|7[12579]|8[1-356]|9[135])|7(?:2[1-7]|3[1357]|4[145]|6[1-5]|7[1-4])|8(?:21|3[1468]|4[1347]|6[0135-9]|7[1467]|8[136])|9(?:0[12479]|2[1358]|3[1357]|4[134679]|6[1-9]|7[136]|8[147]|9[1468]))"]],
                    ["(3\\d{4})(\\d{1,10})", "$1 $2", ["3"]],
                    ["(800)(\\d{7,12})", "$1 $2", ["800"]],
                    ["(\\d{3})(\\d)(\\d{4,10})", "$1 $2 $3", ["(?:18|90)0|137", "1(?:37|80)|900[1359]"]],
                    ["(1\\d{2})(\\d{5,11})", "$1 $2", ["181"]],
                    ["(18\\d{3})(\\d{6})", "$1 $2", ["185", "1850", "18500"]],
                    ["(18\\d{2})(\\d{7})", "$1 $2", ["18[68]"]],
                    ["(18\\d)(\\d{8})", "$1 $2", ["18[2-579]"]],
                    ["(700)(\\d{4})(\\d{4})", "$1 $2 $3", ["700"]],
                    ["(138)(\\d{4})", "$1 $2", ["138"]],
                    ["(15[013-68])(\\d{2})(\\d{8})", "$1 $2 $3", ["15[013-68]"]],
                    ["(15[279]\\d)(\\d{2})(\\d{7})", "$1 $2 $3", ["15[279]"]],
                    ["(1[67]\\d)(\\d{2})(\\d{7,8})", "$1 $2 $3", ["1(?:6[023]|7)"]]
                ], "0", "0$1"],
                DJ: ["253", "[27]\\d{7}", [
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4"]
                ]],
                DK: ["45", "[2-9]\\d{7}", [
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4"]
                ]],
                DM: ["1", "[57-9]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, "767"],
                DO: ["1", "[589]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, "8[024]9"],
                DZ: ["213", "(?:[1-4]|[5-9]\\d)\\d{7}", [
                    ["([1-4]\\d)(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[1-4]"]],
                    ["([5-8]\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[5-8]"]],
                    ["(9\\d)(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["9"]]
                ], "0", "0$1"],
                EC: ["593", "1\\d{9,10}|[2-8]\\d{7}|9\\d{8}", [
                    ["(\\d)(\\d{3})(\\d{4})", "$1 $2-$3", ["[247]|[356][2-8]"], null, null, "$1-$2-$3"],
                    ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["9"], "0$1"],
                    ["(1800)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["1"], "$1"]
                ], "0", "(0$1)"],
                EE: ["372", "1\\d{3,4}|[3-9]\\d{6,7}|800\\d{6,7}", [
                    ["([3-79]\\d{2})(\\d{4})", "$1 $2", ["[369]|4[3-8]|5(?:[0-2]|5[0-478]|6[45])|7[1-9]", "[369]|4[3-8]|5(?:[02]|1(?:[0-8]|95)|5[0-478]|6(?:4[0-4]|5[1-589]))|7[1-9]"]],
                    ["(70)(\\d{2})(\\d{4})", "$1 $2 $3", ["70"]],
                    ["(8000)(\\d{3})(\\d{3})", "$1 $2 $3", ["800", "8000"]],
                    ["([458]\\d{3})(\\d{3,4})", "$1 $2", ["40|5|8(?:00|[1-5])", "40|5|8(?:00[1-9]|[1-5])"]]
                ]],
                EG: ["20", "1\\d{4,9}|[2456]\\d{8}|3\\d{7}|[89]\\d{8,9}", [
                    ["(\\d)(\\d{7,8})", "$1 $2", ["[23]"]],
                    ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["1[012]|[89]00"]],
                    ["(\\d{2})(\\d{6,7})", "$1 $2", ["1[35]|[4-6]|[89][2-9]"]]
                ], "0", "0$1"],
                EH: ["212", "[5-9]\\d{8}", [
                    ["([5-7]\\d{2})(\\d{6})", "$1-$2", ["5(?:2[015-7]|3[0-4])|[67]"]],
                    ["([58]\\d{3})(\\d{5})", "$1-$2", ["5(?:2[2-489]|3[5-9]|92)|892", "5(?:2(?:[2-48]|90)|3(?:[5-79]|80)|924)|892"]],
                    ["(5\\d{4})(\\d{4})", "$1-$2", ["5(?:29|38)", "5(?:29|38)[89]"]],
                    ["([5]\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["5(?:4[067]|5[03])"]],
                    ["(8[09])(\\d{7})", "$1-$2", ["8(?:0|9[013-9])"]]
                ], "0", "0$1", null, null, null, "528[89]"],
                ER: ["291", "[178]\\d{6}", [
                    ["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3"]
                ], "0", "0$1"],
                ES: ["34", "[5-9]\\d{8}", [
                    ["([89]00)(\\d{3})(\\d{3})", "$1 $2 $3", ["[89]00"]],
                    ["([5-9]\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[568]|[79][0-8]"]]
                ]],
                ET: ["251", "[1-59]\\d{8}", [
                    ["([1-59]\\d)(\\d{3})(\\d{4})", "$1 $2 $3"]
                ], "0", "0$1"],
                FI: ["358", "1\\d{4,11}|[2-9]\\d{4,10}", [
                    ["(\\d{3})(\\d{3,7})", "$1 $2", ["(?:[1-3]00|[6-8]0)"]],
                    ["(116\\d{3})", "$1", ["116"], "$1"],
                    ["(\\d{2})(\\d{4,10})", "$1 $2", ["[14]|2[09]|50|7[135]"]],
                    ["(\\d)(\\d{4,11})", "$1 $2", ["[25689][1-8]|3"]]
                ], "0", "0$1", null, null, null, null, ["1(?:[3569][1-8]\\d{3,9}|[47]\\d{5,10})|2[1-8]\\d{3,9}|3(?:[1-8]\\d{3,9}|9\\d{4,8})|[5689][1-8]\\d{3,9}", "4\\d{5,10}|50\\d{4,8}", "800\\d{4,7}", "[67]00\\d{5,6}", null, null, "[13]0\\d{4,8}|2(?:0(?:[016-8]\\d{3,7}|[2-59]\\d{2,7})|9\\d{4,8})|60(?:[12]\\d{5,6}|6\\d{7})|7(?:1\\d{7}|3\\d{8}|5[03-9]\\d{2,7})"]],
                FJ: ["679", "[36-9]\\d{6}|0\\d{10}", [
                    ["(\\d{3})(\\d{4})", "$1 $2", ["[36-9]"]],
                    ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["0"]]
                ]],
                FK: ["500", "[2-7]\\d{4}"],
                FM: ["691", "[39]\\d{6}", [
                    ["(\\d{3})(\\d{4})", "$1 $2"]
                ]],
                FO: ["298", "[2-9]\\d{5}", [
                    ["(\\d{6})", "$1"]
                ], null, null, "(10(?:01|[12]0|88))"],
                FR: ["33", "[1-9]\\d{8}", [
                    ["([1-79])(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["[1-79]"]],
                    ["(8\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "0 $1"]
                ], "0", "0$1"],
                GA: ["241", "0?\\d{7}", [
                    ["(\\d)(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-7]"], "0$1"],
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["0"]]
                ]],
                GB: ["44", "\\d{7,10}", [
                    ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["2|5[56]|7(?:0|6[013-9])", "2|5[56]|7(?:0|6(?:[013-9]|2[0-35-9]))"]],
                    ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["1(?:1|\\d1)|3|9[018]"]],
                    ["(\\d{5})(\\d{4,5})", "$1 $2", ["1(?:38|5[23]|69|76|94)", "1(?:387|5(?:24|39)|697|768|946)", "1(?:3873|5(?:242|39[456])|697[347]|768[347]|9467)"]],
                    ["(1\\d{3})(\\d{5,6})", "$1 $2", ["1"]],
                    ["(7\\d{3})(\\d{6})", "$1 $2", ["7(?:[1-5789]|62)", "7(?:[1-5789]|624)"]],
                    ["(800)(\\d{4})", "$1 $2", ["800", "8001", "80011", "800111", "8001111"]],
                    ["(845)(46)(4\\d)", "$1 $2 $3", ["845", "8454", "84546", "845464"]],
                    ["(8\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["8(?:4[2-5]|7[0-3])"]],
                    ["(80\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["80"]],
                    ["([58]00)(\\d{6})", "$1 $2", ["[58]00"]]
                ], "0", "0$1", null, null, null, null, ["2(?:0[01378]|3[0189]|4[017]|8[0-46-9]|9[012])\\d{7}|1(?:(?:1(?:3[0-48]|[46][0-4]|5[012789]|7[0-49]|8[01349])|21[0-7]|31[0-8]|[459]1\\d|61[0-46-9]))\\d{6}|1(?:2(?:0[024-9]|2[3-9]|3[3-79]|4[1-689]|[58][02-9]|6[0-4789]|7[013-9]|9\\d)|3(?:0\\d|[25][02-9]|3[02-579]|[468][0-46-9]|7[1235679]|9[24578])|4(?:0[03-9]|[28][02-5789]|[37]\\d|4[02-69]|5[0-8]|[69][0-79])|5(?:0[1235-9]|2[024-9]|3[015689]|4[02-9]|5[03-9]|6\\d|7[0-35-9]|8[0-468]|9[0-5789])|6(?:0[034689]|2[0-35689]|[38][013-9]|4[1-467]|5[0-69]|6[13-9]|7[0-8]|9[0124578])|7(?:0[0246-9]|2\\d|3[023678]|4[03-9]|5[0-46-9]|6[013-9]|7[0-35-9]|8[024-9]|9[02-9])|8(?:0[35-9]|2[1-5789]|3[02-578]|4[0-578]|5[124-9]|6[2-69]|7\\d|8[02-9]|9[02569])|9(?:0[02-589]|2[02-689]|3[1-5789]|4[2-9]|5[0-579]|6[234789]|7[0124578]|8\\d|9[2-57]))\\d{6}|1(?:2(?:0(?:46[1-4]|87[2-9])|545[1-79]|76(?:2\\d|3[1-8]|6[1-6])|9(?:7(?:2[0-4]|3[2-5])|8(?:2[2-8]|7[0-4789]|8[345])))|3(?:638[2-5]|647[23]|8(?:47[04-9]|64[015789]))|4(?:044[1-7]|20(?:2[23]|8\\d)|6(?:0(?:30|5[2-57]|6[1-8]|7[2-8])|140)|8(?:052|87[123]))|5(?:24(?:3[2-79]|6\\d)|276\\d|6(?:26[06-9]|686))|6(?:06(?:4\\d|7[4-79])|295[567]|35[34]\\d|47(?:24|61)|59(?:5[08]|6[67]|74)|955[0-4])|7(?:26(?:6[13-9]|7[0-7])|442\\d|50(?:2[0-3]|[3-68]2|76))|8(?:27[56]\\d|37(?:5[2-5]|8[239])|84(?:3[2-58]))|9(?:0(?:0(?:6[1-8]|85)|52\\d)|3583|4(?:66[1-8]|9(?:2[01]|81))|63(?:23|3[1-4])|9561))\\d{3}|176888[234678]\\d{2}|16977[23]\\d{3}", "7(?:[1-4]\\d\\d|5(?:0[0-8]|[13-9]\\d|2[0-35-9])|7(?:0[1-9]|[1-7]\\d|8[02-9]|9[0-689])|8(?:[014-9]\\d|[23][0-8])|9(?:[04-9]\\d|1[02-9]|2[0-35-9]|3[0-689]))\\d{6}", "80(?:0(?:1111|\\d{6,7})|8\\d{7})|500\\d{6}", "(?:87[123]|9(?:[01]\\d|8[2349]))\\d{7}", "70\\d{8}", null, "(?:3[0347]|55)\\d{8}", "76(?:0[012]|2[356]|4[0134]|5[49]|6[0-369]|77|81|9[39])\\d{6}", "56\\d{8}"]],
                GD: ["1", "[4589]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, "473"],
                GE: ["995", "[34578]\\d{8}", [
                    ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[348]"], "0$1"],
                    ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["7"], "0$1"],
                    ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["5"], "$1"]
                ], "0"],
                GF: ["594", "[56]\\d{8}", [
                    ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4"]
                ], "0", "0$1"],
                GG: ["44", "[135789]\\d{6,9}", [
                    ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["2|5[56]|7(?:0|6[013-9])", "2|5[56]|7(?:0|6(?:[013-9]|2[0-35-9]))"]],
                    ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["1(?:1|\\d1)|3|9[018]"]],
                    ["(\\d{5})(\\d{4,5})", "$1 $2", ["1(?:38|5[23]|69|76|94)", "1(?:387|5(?:24|39)|697|768|946)", "1(?:3873|5(?:242|39[456])|697[347]|768[347]|9467)"]],
                    ["(1\\d{3})(\\d{5,6})", "$1 $2", ["1"]],
                    ["(7\\d{3})(\\d{6})", "$1 $2", ["7(?:[1-5789]|62)", "7(?:[1-5789]|624)"]],
                    ["(800)(\\d{4})", "$1 $2", ["800", "8001", "80011", "800111", "8001111"]],
                    ["(845)(46)(4\\d)", "$1 $2 $3", ["845", "8454", "84546", "845464"]],
                    ["(8\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["8(?:4[2-5]|7[0-3])"]],
                    ["(80\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["80"]],
                    ["([58]00)(\\d{6})", "$1 $2", ["[58]00"]]
                ], "0", "0$1", null, null, null, null, ["1481\\d{6}", "7(?:781|839|911)\\d{6}", "80(?:0(?:1111|\\d{6,7})|8\\d{7})|500\\d{6}", "(?:87[123]|9(?:[01]\\d|8[0-3]))\\d{7}", "70\\d{8}", null, "(?:3[0347]|55)\\d{8}", "76(?:0[012]|2[356]|4[0134]|5[49]|6[0-369]|77|81|9[39])\\d{6}", "56\\d{8}"]],
                GH: ["233", "[235]\\d{8}|8\\d{7}", [
                    ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[235]"]],
                    ["(\\d{3})(\\d{5})", "$1 $2", ["8"]]
                ], "0", "0$1"],
                GI: ["350", "[2568]\\d{7}", [
                    ["(\\d{3})(\\d{5})", "$1 $2", ["2"]]
                ]],
                GL: ["299", "[1-689]\\d{5}", [
                    ["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3"]
                ]],
                GM: ["220", "[2-9]\\d{6}", [
                    ["(\\d{3})(\\d{4})", "$1 $2"]
                ]],
                GN: ["224", "[367]\\d{7,8}", [
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["3"]],
                    ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[67]"]]
                ]],
                GP: ["590", "[56]\\d{8}", [
                    ["([56]90)(\\d{2})(\\d{4})", "$1 $2-$3"]
                ], "0", "0$1", null, null, null, null, ["590(?:0[13468]|1[012]|2[0-68]|3[28]|4[0-8]|5[579]|6[0189]|70|8[0-689]|9\\d)\\d{4}", "690(?:0[0-7]|[1-9]\\d)\\d{4}"]],
                GQ: ["240", "[23589]\\d{8}", [
                    ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[235]"]],
                    ["(\\d{3})(\\d{6})", "$1 $2", ["[89]"]]
                ]],
                GR: ["30", "[26-9]\\d{9}", [
                    ["([27]\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["21|7"]],
                    ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["2[2-9]1|[689]"]],
                    ["(2\\d{3})(\\d{6})", "$1 $2", ["2[2-9][02-9]"]]
                ]],
                GT: ["502", "[2-7]\\d{7}|1[89]\\d{9}", [
                    ["(\\d{4})(\\d{4})", "$1 $2", ["[2-7]"]],
                    ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]]
                ]],
                GU: ["1", "[5689]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, "671"],
                GW: ["245", "(?:4(?:0\\d{5}|4\\d{7})|9\\d{8})", [
                    ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["44|9[567]"]],
                    ["(\\d{3})(\\d{4})", "$1 $2", ["40"]]
                ]],
                GY: ["592", "[2-4679]\\d{6}", [
                    ["(\\d{3})(\\d{4})", "$1 $2"]
                ]],
                HK: ["852", "[235-7]\\d{7}|8\\d{7,8}|9\\d{4,10}", [
                    ["(\\d{4})(\\d{4})", "$1 $2", ["[235-7]|[89](?:0[1-9]|[1-9])"]],
                    ["(800)(\\d{3})(\\d{3})", "$1 $2 $3", ["800"]],
                    ["(900)(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["900"]],
                    ["(900)(\\d{2,5})", "$1 $2", ["900"]]
                ]],
                HN: ["504", "[237-9]\\d{7}", [
                    ["(\\d{4})(\\d{4})", "$1-$2"]
                ]],
                HR: ["385", "[1-7]\\d{5,8}|[89]\\d{6,11}", [
                    ["(1)(\\d{4})(\\d{3})", "$1 $2 $3", ["1"]],
                    ["(6[09])(\\d{4})(\\d{3})", "$1 $2 $3", ["6[09]"]],
                    ["([67]2)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[67]2"]],
                    ["([2-5]\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-5]"]],
                    ["(9\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["9"]],
                    ["(9\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["9"]],
                    ["(9\\d)(\\d{3,4})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["9"]],
                    ["(\\d{2})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["6[0145]|7"]],
                    ["(\\d{2})(\\d{3,4})(\\d{3})", "$1 $2 $3", ["6[0145]|7"]],
                    ["(80[01])(\\d{2})(\\d{2,3})", "$1 $2 $3", ["8"]],
                    ["(80[01])(\\d{3,4})(\\d{3})", "$1 $2 $3", ["8"]]
                ], "0", "0$1"],
                HT: ["509", "[2-489]\\d{7}", [
                    ["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3"]
                ]],
                HU: ["36", "[1-9]\\d{7,8}", [
                    ["(1)(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]],
                    ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-9]"]]
                ], "06", "($1)"],
                ID: ["62", "(?:[1-79]\\d{6,10}|8\\d{7,11})", [
                    ["(\\d{2})(\\d{5,8})", "$1 $2", ["2[124]|[36]1"], "(0$1)"],
                    ["(\\d{3})(\\d{5,8})", "$1 $2", ["[4579]|2[035-9]|[36][02-9]"], "(0$1)"],
                    ["(8\\d{2})(\\d{3,4})(\\d{3,5})", "$1-$2-$3", ["8[1-35-9]"]],
                    ["(1)(500)(\\d{3})", "$1 $2 $3", ["15"], "$1"],
                    ["(177)(\\d{6,8})", "$1 $2", ["17"]],
                    ["(800)(\\d{5,7})", "$1 $2", ["800"]],
                    ["(804)(\\d{3})(\\d{4})", "$1 $2 $3", ["804"]],
                    ["(80\\d)(\\d)(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["80[79]"]]
                ], "0", "0$1"],
                IE: ["353", "[124-9]\\d{6,9}", [
                    ["(1)(\\d{3,4})(\\d{4})", "$1 $2 $3", ["1"]],
                    ["(\\d{2})(\\d{5})", "$1 $2", ["2[24-9]|47|58|6[237-9]|9[35-9]"]],
                    ["(\\d{3})(\\d{5})", "$1 $2", ["40[24]|50[45]"]],
                    ["(48)(\\d{4})(\\d{4})", "$1 $2 $3", ["48"]],
                    ["(818)(\\d{3})(\\d{3})", "$1 $2 $3", ["81"]],
                    ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[24-69]|7[14]"]],
                    ["([78]\\d)(\\d{3,4})(\\d{4})", "$1 $2 $3", ["76|8[35-9]"], "0$1"],
                    ["(700)(\\d{3})(\\d{3})", "$1 $2 $3", ["70"], "0$1"],
                    ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1(?:8[059]|5)", "1(?:8[059]0|5)"], "$1"]
                ], "0", "(0$1)"],
                IL: ["972", "[17]\\d{6,9}|[2-589]\\d{3}(?:\\d{3,6})?|6\\d{3}", [
                    ["([2-489])(\\d{3})(\\d{4})", "$1-$2-$3", ["[2-489]"], "0$1"],
                    ["([57]\\d)(\\d{3})(\\d{4})", "$1-$2-$3", ["[57]"], "0$1"],
                    ["(1)([7-9]\\d{2})(\\d{3})(\\d{3})", "$1-$2-$3-$4", ["1[7-9]"]],
                    ["(1255)(\\d{3})", "$1-$2", ["125"]],
                    ["(1200)(\\d{3})(\\d{3})", "$1-$2-$3", ["120"]],
                    ["(1212)(\\d{2})(\\d{2})", "$1-$2-$3", ["121"]],
                    ["(1599)(\\d{6})", "$1-$2", ["15"]],
                    ["(\\d{4})", "*$1", ["[2-689]"]]
                ], "0", "$1"],
                IM: ["44", "[135789]\\d{6,9}", [
                    ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["2|5[56]|7(?:0|6[013-9])", "2|5[56]|7(?:0|6(?:[013-9]|2[0-35-9]))"]],
                    ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["1(?:1|\\d1)|3|9[018]"]],
                    ["(\\d{5})(\\d{4,5})", "$1 $2", ["1(?:38|5[23]|69|76|94)", "1(?:387|5(?:24|39)|697|768|946)", "1(?:3873|5(?:242|39[456])|697[347]|768[347]|9467)"]],
                    ["(1\\d{3})(\\d{5,6})", "$1 $2", ["1"]],
                    ["(7\\d{3})(\\d{6})", "$1 $2", ["7(?:[1-5789]|62)", "7(?:[1-5789]|624)"]],
                    ["(800)(\\d{4})", "$1 $2", ["800", "8001", "80011", "800111", "8001111"]],
                    ["(845)(46)(4\\d)", "$1 $2 $3", ["845", "8454", "84546", "845464"]],
                    ["(8\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["8(?:4[2-5]|7[0-3])"]],
                    ["(80\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["80"]],
                    ["([58]00)(\\d{6})", "$1 $2", ["[58]00"]]
                ], "0", "0$1", null, null, null, null, ["1624\\d{6}", "7[569]24\\d{6}", "808162\\d{4}", "(?:872299|90[0167]624)\\d{4}", "70\\d{8}", null, "3(?:08162\\d|3\\d{5}|4(?:40[49]06|5624\\d)|7(?:0624\\d|2299\\d))\\d{3}|55\\d{8}", null, "56\\d{8}"]],
                IN: ["91", "008\\d{9}|1\\d{7,12}|[2-9]\\d{9,10}", [
                    ["(\\d{5})(\\d{5})", "$1 $2", ["7(?:[02-578]|19|6[0-35-9]|9[07-9])|8(?:0[015-9]|2[02356-9]|3[0-57-9]|[1459]|6[02-9]|7[01-69]|8[0-24-9])|9", "7(?:[078]|19[0-5]|2(?:[02356-9]|[14][017-9]|9[389])|3(?:[025-9]|1[07-9]|[34][017-9])|4(?:[0-35689]|[47][017-9])|5(?:[02346-9]|1[019]|5[017-9])|6(?:[06-9]|1[0-257-9]|2[0-5]|3[19]|5[4589])|9(?:0|7[2-9]|8[0246-9]|9[0-24-9]))|8(?:0(?:[01589]|6[67]|7[2-9])|1(?:[02-57-9]|1[0135-9]|6[089])|2(?:0[08]|[236-9]|5[1-9])|3(?:[0357-9]|17|28|4[1-9])|[45]|6(?:[02457-9]|6[07-9])|7(?:0[07]|[1-69])|8(?:[0-26-9]|44|5[2-9])|9(?:[035-9]|19|2[2-9]|4[0-8]))|9", "7(?:0|19[0-5]|2(?:[0235679]|[14][017-9]|8(?:[0-569]|78|8[089])|9[389])|3(?:[05-8]|1(?:[089]|7[5-9])|2(?:[5-8]|[0-49][089])|3[017-9]|4(?:[07-9]|11)|9(?:[01689]|[2345][089]|40|7[0189]))|4(?:[056]|1(?:[0135-9]|[23][089]|2[089]|4[089])|2(?:0[089]|[1-7][089]|[89])|3(?:[0-8][089]|9)|4(?:[089]|11|7[02-8])|7(?:[089]|11|7[02-8])|8(?:[0-24-7][089]|[389])|9(?:[0-7][089]|[89]))|5(?:[0346-9]|1[019]|2(?:[03-9]|[12][089])|5[017-9])|6(?:[06-9]|1[0-257-9]|2[0-5]|3[19]|5[4589])|7(?:0(?:[02-9]|10)|[1-9])|8(?:[0-79]|8(?:0[0189]|11|8[013-9]|9[012]))|9(?:0|7(?:[2-8]|9[7-9])|8[0246-9]|9(?:[04-9]|11|2[234])))|8(?:0(?:[01589]|6[67]|7(?:[2-7]|86|90))|1(?:[02-57-9]|1(?:[0135-9]|22|44)|6[089])|2(?:0[08]|[236-9]|5[1-9])|3(?:[0357-9]|170|28[0-6]|4[1-9])|[45]|6(?:[02457-9]|6(?:[08]|7[02-8]|9[01]))|7(?:0[07]|[1-69])|8(?:[0-26-9]|44|5[2-9])|9(?:[035-9]|19|2[2-9]|4[0-8]))|9"]],
                    ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["11|2[02]|33|4[04]|79[1-9]|80[2-46]"]],
                    ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["1(?:2[0-249]|3[0-25]|4[145]|[569][14]|7[1257]|8[1346]|[68][1-9])|2(?:1[257]|3[013]|4[01]|5[0137]|6[0158]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|[36][25]|22|4[28]|5[12]|[78]1|9[15])|6(?:12|[2345]1|57|6[13]|7[14]|80)"]],
                    ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["7(?:12|2[14]|3[134]|4[47]|5[15]|[67]1|88)", "7(?:12|2[14]|3[134]|4[47]|5(?:1|5[2-6])|[67]1|88)"]],
                    ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8(?:16|2[014]|3[126]|6[136]|7[078]|8[34]|91)"]],
                    ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1(?:[23579]|[468][1-9])|[2-8]"]],
                    ["(\\d{2})(\\d{3})(\\d{4})(\\d{3})", "$1 $2 $3 $4", ["008"]],
                    ["(1600)(\\d{2})(\\d{4})", "$1 $2 $3", ["160", "1600"], "$1"],
                    ["(1800)(\\d{4,5})", "$1 $2", ["180", "1800"], "$1"],
                    ["(18[06]0)(\\d{2,4})(\\d{4})", "$1 $2 $3", ["18[06]", "18[06]0"], "$1"],
                    ["(140)(\\d{3})(\\d{4})", "$1 $2 $3", ["140"], "$1"],
                    ["(\\d{4})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["18[06]", "18(?:0[03]|6[12])"], "$1"]
                ], "0", "0$1", null, null, !0],
                IO: ["246", "3\\d{6}", [
                    ["(\\d{3})(\\d{4})", "$1 $2"]
                ]],
                IQ: ["964", "[1-7]\\d{7,9}", [
                    ["(1)(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]],
                    ["([2-6]\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-6]"]],
                    ["(7\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"]]
                ], "0", "0$1"],
                IR: ["98", "[1-8]\\d{9}|9(?:[0-4]\\d{8}|9\\d{2,8})", [
                    ["(21)(\\d{3,5})", "$1 $2", ["21"]],
                    ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["[1-8]"]],
                    ["(\\d{3})(\\d{3})", "$1 $2", ["9"]],
                    ["(\\d{3})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["9"]],
                    ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["9"]]
                ], "0", "0$1"],
                IS: ["354", "[4-9]\\d{6}|38\\d{7}", [
                    ["(\\d{3})(\\d{4})", "$1 $2", ["[4-9]"]],
                    ["(3\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["3"]]
                ]],
                IT: ["39", "[01589]\\d{5,10}|3(?:[12457-9]\\d{8}|[36]\\d{7,9})", [
                    ["(\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["0[26]|55"]],
                    ["(0[26])(\\d{4})(\\d{5})", "$1 $2 $3", ["0[26]"]],
                    ["(0[26])(\\d{4,6})", "$1 $2", ["0[26]"]],
                    ["(0\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["0[13-57-9][0159]"]],
                    ["(\\d{3})(\\d{3,6})", "$1 $2", ["0[13-57-9][0159]|8(?:03|4[17]|9[245])", "0[13-57-9][0159]|8(?:03|4[17]|9(?:2|[45][0-4]))"]],
                    ["(0\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["0[13-57-9][2-46-8]"]],
                    ["(0\\d{3})(\\d{2,6})", "$1 $2", ["0[13-57-9][2-46-8]"]],
                    ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[13]|8(?:00|4[08]|9[59])", "[13]|8(?:00|4[08]|9(?:5[5-9]|9))"]],
                    ["(\\d{4})(\\d{4})", "$1 $2", ["894", "894[5-9]"]],
                    ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["3"]]
                ], null, null, null, null, null, null, ["0(?:[26]\\d{4,9}|(?:1(?:[0159]\\d|[27][1-5]|31|4[1-4]|6[1356]|8[2-57])|3(?:[0159]\\d|2[1-4]|3[12]|[48][1-6]|6[2-59]|7[1-7])|4(?:[0159]\\d|[23][1-9]|4[245]|6[1-5]|7[1-4]|81)|5(?:[0159]\\d|2[1-5]|3[2-6]|4[1-79]|6[4-6]|7[1-578]|8[3-8])|7(?:[0159]\\d|2[12]|3[1-7]|4[2346]|6[13569]|7[13-6]|8[1-59])|8(?:[0159]\\d|2[34578]|3[1-356]|[6-8][1-5])|9(?:[0159]\\d|[238][1-5]|4[12]|6[1-8]|7[1-6]))\\d{2,7})", "3(?:[12457-9]\\d{8}|6\\d{7,8}|3\\d{7,9})", "80(?:0\\d{6}|3\\d{3})", "0878\\d{5}|1(?:44|6[346])\\d{6}|89(?:2\\d{3}|4(?:[0-4]\\d{2}|[5-9]\\d{4})|5(?:[0-4]\\d{2}|[5-9]\\d{6})|9\\d{6})", "1(?:78\\d|99)\\d{6}", null, null, null, "55\\d{8}"]],
                JE: ["44", "[135789]\\d{6,9}", [
                    ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["2|5[56]|7(?:0|6[013-9])", "2|5[56]|7(?:0|6(?:[013-9]|2[0-35-9]))"]],
                    ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["1(?:1|\\d1)|3|9[018]"]],
                    ["(\\d{5})(\\d{4,5})", "$1 $2", ["1(?:38|5[23]|69|76|94)", "1(?:387|5(?:24|39)|697|768|946)", "1(?:3873|5(?:242|39[456])|697[347]|768[347]|9467)"]],
                    ["(1\\d{3})(\\d{5,6})", "$1 $2", ["1"]],
                    ["(7\\d{3})(\\d{6})", "$1 $2", ["7(?:[1-5789]|62)", "7(?:[1-5789]|624)"]],
                    ["(800)(\\d{4})", "$1 $2", ["800", "8001", "80011", "800111", "8001111"]],
                    ["(845)(46)(4\\d)", "$1 $2 $3", ["845", "8454", "84546", "845464"]],
                    ["(8\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["8(?:4[2-5]|7[0-3])"]],
                    ["(80\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["80"]],
                    ["([58]00)(\\d{6})", "$1 $2", ["[58]00"]]
                ], "0", "0$1", null, null, null, null, ["1534\\d{6}", "7(?:509|7(?:00|97)|829|937)\\d{6}", "80(?:07(?:35|81)|8901)\\d{4}", "(?:871206|90(?:066[59]|1810|71(?:07|55)))\\d{4}", "701511\\d{4}", null, "3(?:0(?:07(?:35|81)|8901)|3\\d{4}|4(?:4(?:4(?:05|42|69)|703)|5(?:041|800))|7(?:0002|1206))\\d{4}|55\\d{8}", "76(?:0[012]|2[356]|4[0134]|5[49]|6[0-369]|77|81|9[39])\\d{6}", "56\\d{8}"]],
                JM: ["1", "[589]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, "876"],
                JO: ["962", "[235-9]\\d{7,8}", [
                    ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[2356]|87"], "(0$1)"],
                    ["(7)(\\d{4})(\\d{4})", "$1 $2 $3", ["7[457-9]"]],
                    ["(\\d{3})(\\d{5,6})", "$1 $2", ["70|8[0158]|9"]]
                ], "0", "0$1"],
                JP: ["81", "[1-9]\\d{8,9}|00(?:[36]\\d{7,14}|7\\d{5,7}|8\\d{7})", [
                    ["(\\d{3})(\\d{3})(\\d{3})", "$1-$2-$3", ["(?:12|57|99)0"]],
                    ["(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", ["800"]],
                    ["(\\d{2})(\\d{4})(\\d{4})", "$1-$2-$3", ["[2579]0|80[1-9]"]],
                    ["(\\d{4})(\\d)(\\d{4})", "$1-$2-$3", ["1(?:26|3[79]|4[56]|5[4-68]|6[3-5])|5(?:76|97)|499|746|8(?:3[89]|63|47|51)|9(?:49|80|9[16])", "1(?:267|3(?:7[247]|9[278])|4(?:5[67]|66)|5(?:47|58|64|8[67])|6(?:3[245]|48|5[4-68]))|5(?:76|97)9|499[2468]|7468|8(?:3(?:8[78]|96)|636|477|51[24])|9(?:496|802|9(?:1[23]|69))", "1(?:267|3(?:7[247]|9[278])|4(?:5[67]|66)|5(?:47|58|64|8[67])|6(?:3[245]|48|5[4-68]))|5(?:769|979[2-69])|499[2468]|7468|8(?:3(?:8[78]|96[2457-9])|636[2-57-9]|477|51[24])|9(?:496|802|9(?:1[23]|69))"]],
                    ["(\\d{3})(\\d{2})(\\d{4})", "$1-$2-$3", ["1(?:2[3-6]|3[3-9]|4[2-6]|5[2-8]|[68][2-7]|7[2-689]|9[1-578])|2(?:2[03-689]|3[3-58]|4[0-468]|5[04-8]|6[013-8]|7[06-9]|8[02-57-9]|9[13])|4(?:2[28]|3[689]|6[035-7]|7[05689]|80|9[3-5])|5(?:3[1-36-9]|4[4578]|5[013-8]|6[1-9]|7[2-8]|8[14-7]|9[4-9])|7(?:2[15]|3[5-9]|4[02-9]|6[135-8]|7[0-4689]|9[014-9])|8(?:2[49]|3[3-8]|4[5-8]|5[2-9]|6[35-9]|7[579]|8[03-579]|9[2-8])|9(?:[23]0|4[02-46-9]|5[024-79]|6[4-9]|7[2-47-9]|8[02-7]|9[3-7])", "1(?:2[3-6]|3[3-9]|4[2-6]|5(?:[236-8]|[45][2-69])|[68][2-7]|7[2-689]|9[1-578])|2(?:2(?:[04-689]|3[23])|3[3-58]|4[0-468]|5(?:5[78]|7[2-4]|[0468][2-9])|6(?:[0135-8]|4[2-5])|7(?:[0679]|8[2-7])|8(?:[024578]|3[25-9]|9[6-9])|9(?:11|3[2-4]))|4(?:2(?:2[2-9]|8[237-9])|3[689]|6[035-7]|7(?:[059][2-8]|[68])|80|9[3-5])|5(?:3[1-36-9]|4[4578]|5[013-8]|6[1-9]|7[2-8]|8[14-7]|9(?:[89][2-8]|[4-7]))|7(?:2[15]|3[5-9]|4[02-9]|6[135-8]|7[0-4689]|9(?:[017-9]|4[6-8]|5[2-478]|6[2-589]))|8(?:2(?:4[4-8]|9[2-8])|3(?:7[2-6]|[3-6][2-9]|8[2-5])|4[5-8]|5[2-9]|6(?:[37]|5[4-7]|6[2-9]|8[2-8]|9[236-9])|7[579]|8[03-579]|9[2-8])|9(?:[23]0|4[02-46-9]|5[024-79]|6[4-9]|7[2-47-9]|8[02-7]|9(?:3[34]|[4-7]))", "1(?:2[3-6]|3[3-9]|4[2-6]|5(?:[236-8]|[45][2-69])|[68][2-7]|7[2-689]|9[1-578])|2(?:2(?:[04-689]|3[23])|3[3-58]|4[0-468]|5(?:5[78]|7[2-4]|[0468][2-9])|6(?:[0135-8]|4[2-5])|7(?:[0679]|8[2-7])|8(?:[024578]|3[25-9]|9[6-9])|9(?:11|3[2-4]))|4(?:2(?:2[2-9]|8[237-9])|3[689]|6[035-7]|7(?:[059][2-8]|[68])|80|9[3-5])|5(?:3[1-36-9]|4[4578]|5[013-8]|6[1-9]|7[2-8]|8[14-7]|9(?:[89][2-8]|[4-7]))|7(?:2[15]|3[5-9]|4[02-9]|6[135-8]|7[0-4689]|9(?:[017-9]|4[6-8]|5[2-478]|6[2-589]))|8(?:2(?:4[4-8]|9(?:[3578]|20|4[04-9]|6[56]))|3(?:7(?:[2-5]|6[0-59])|[3-6][2-9]|8[2-5])|4[5-8]|5[2-9]|6(?:[37]|5(?:[467]|5[014-9])|6(?:[2-8]|9[02-69])|8[2-8]|9(?:[236-8]|9[23]))|7[579]|8[03-579]|9[2-8])|9(?:[23]0|4[02-46-9]|5[024-79]|6[4-9]|7[2-47-9]|8[02-7]|9(?:3(?:3[02-9]|4[0-24689])|4[2-69]|[5-7]))", "1(?:2[3-6]|3[3-9]|4[2-6]|5(?:[236-8]|[45][2-69])|[68][2-7]|7[2-689]|9[1-578])|2(?:2(?:[04-689]|3[23])|3[3-58]|4[0-468]|5(?:5[78]|7[2-4]|[0468][2-9])|6(?:[0135-8]|4[2-5])|7(?:[0679]|8[2-7])|8(?:[024578]|3[25-9]|9[6-9])|9(?:11|3[2-4]))|4(?:2(?:2[2-9]|8[237-9])|3[689]|6[035-7]|7(?:[059][2-8]|[68])|80|9[3-5])|5(?:3[1-36-9]|4[4578]|5[013-8]|6[1-9]|7[2-8]|8[14-7]|9(?:[89][2-8]|[4-7]))|7(?:2[15]|3[5-9]|4[02-9]|6[135-8]|7[0-4689]|9(?:[017-9]|4[6-8]|5[2-478]|6[2-589]))|8(?:2(?:4[4-8]|9(?:[3578]|20|4[04-9]|6(?:5[25]|60)))|3(?:7(?:[2-5]|6[0-59])|[3-6][2-9]|8[2-5])|4[5-8]|5[2-9]|6(?:[37]|5(?:[467]|5[014-9])|6(?:[2-8]|9[02-69])|8[2-8]|9(?:[236-8]|9[23]))|7[579]|8[03-579]|9[2-8])|9(?:[23]0|4[02-46-9]|5[024-79]|6[4-9]|7[2-47-9]|8[02-7]|9(?:3(?:3[02-9]|4[0-24689])|4[2-69]|[5-7]))"]],
                    ["(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["1|2(?:2[37]|5[5-9]|64|78|8[39]|91)|4(?:2[2689]|64|7[347])|5(?:[2-589]|39)|60|8(?:[46-9]|3[279]|2[124589])|9(?:[235-8]|93)", "1|2(?:2[37]|5(?:[57]|[68]0|9[19])|64|78|8[39]|917)|4(?:2(?:[68]|20|9[178])|64|7[347])|5(?:[2-589]|39[67])|60|8(?:[46-9]|3[279]|2[124589])|9(?:[235-8]|93[34])", "1|2(?:2[37]|5(?:[57]|[68]0|9(?:17|99))|64|78|8[39]|917)|4(?:2(?:[68]|20|9[178])|64|7[347])|5(?:[2-589]|39[67])|60|8(?:[46-9]|3[279]|2[124589])|9(?:[235-8]|93(?:31|4))"]],
                    ["(\\d{3})(\\d{2})(\\d{4})", "$1-$2-$3", ["2(?:9[14-79]|74|[34]7|[56]9)|82|993"]],
                    ["(\\d)(\\d{4})(\\d{4})", "$1-$2-$3", ["3|4(?:2[09]|7[01])|6[1-9]"]],
                    ["(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["[2479][1-9]"]]
                ], "0", "0$1"],
                KE: ["254", "20\\d{6,7}|[4-9]\\d{6,9}", [
                    ["(\\d{2})(\\d{5,7})", "$1 $2", ["[24-6]"]],
                    ["(\\d{3})(\\d{6})", "$1 $2", ["7"]],
                    ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[89]"]]
                ], "0", "0$1", "005|0"],
                KG: ["996", "[235-8]\\d{8,9}", [
                    ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[25-7]|31[25]"]],
                    ["(\\d{4})(\\d{5})", "$1 $2", ["3(?:1[36]|[2-9])"]],
                    ["(\\d{3})(\\d{3})(\\d)(\\d{3})", "$1 $2 $3 $4", ["8"]]
                ], "0", "0$1"],
                KH: ["855", "[1-9]\\d{7,9}", [
                    ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["1\\d[1-9]|[2-9]"], "0$1"],
                    ["(1[89]00)(\\d{3})(\\d{3})", "$1 $2 $3", ["1[89]0"]]
                ], "0"],
                KI: ["686", "[2458]\\d{4}|3\\d{4,7}|7\\d{7}", [], null, null, "0"],
                KM: ["269", "[379]\\d{6}", [
                    ["(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3"]
                ]],
                KN: ["1", "[589]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, "869"],
                KP: ["850", "1\\d{9}|[28]\\d{7}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]],
                    ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["2"]],
                    ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"]]
                ], "0", "0$1"],
                KR: ["82", "007\\d{9,11}|[1-7]\\d{3,9}|8\\d{8}", [
                    ["(\\d{2})(\\d{4})(\\d{4})", "$1-$2-$3", ["1(?:0|1[19]|[69]9|5[458])|[57]0", "1(?:0|1[19]|[69]9|5(?:44|59|8))|[57]0"]],
                    ["(\\d{2})(\\d{3,4})(\\d{4})", "$1-$2-$3", ["1(?:[01]|5[1-4]|6[2-8]|[7-9])|[68]0|[3-6][1-9][1-9]", "1(?:[01]|5(?:[1-3]|4[56])|6[2-8]|[7-9])|[68]0|[3-6][1-9][1-9]"]],
                    ["(\\d{3})(\\d)(\\d{4})", "$1-$2-$3", ["131", "1312"]],
                    ["(\\d{3})(\\d{2})(\\d{4})", "$1-$2-$3", ["131", "131[13-9]"]],
                    ["(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", ["13[2-9]"]],
                    ["(\\d{2})(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3-$4", ["30"]],
                    ["(\\d)(\\d{3,4})(\\d{4})", "$1-$2-$3", ["2[1-9]"]],
                    ["(\\d)(\\d{3,4})", "$1-$2", ["21[0-46-9]"]],
                    ["(\\d{2})(\\d{3,4})", "$1-$2", ["[3-6][1-9]1", "[3-6][1-9]1(?:[0-46-9])"]],
                    ["(\\d{4})(\\d{4})", "$1-$2", ["1(?:5[246-9]|6[04678]|8[03579])", "1(?:5(?:22|44|66|77|88|99)|6(?:00|44|6[16]|70|88)|8(?:00|33|55|77|99))"], "$1"]
                ], "0", "0$1", "0(8[1-46-8]|85\\d{2})?"],
                KW: ["965", "[12569]\\d{6,7}", [
                    ["(\\d{4})(\\d{3,4})", "$1 $2", ["[16]|2(?:[0-35-9]|4[0-35-9])|9[024-9]|52[25]"]],
                    ["(\\d{3})(\\d{5})", "$1 $2", ["244|5(?:[015]|66)"]]
                ]],
                KY: ["1", "[3589]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, "345"],
                KZ: ["7", "(?:33\\d|7\\d{2}|80[09])\\d{7}", [
                    ["([3489]\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["[34689]"]],
                    ["(7\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"]]
                ], "8", null, null, null, null, null, ["33622\\d{5}|7(?:1(?:0(?:[23]\\d|4[023]|59|63)|1(?:[23]\\d|4[0-79]|59)|2(?:[23]\\d|59)|3(?:2\\d|3[1-79]|4[0-35-9]|59)|4(?:2\\d|3[013-79]|4[0-8]|5[1-79])|5(?:2\\d|3[1-8]|4[1-7]|59)|6(?:[234]\\d|5[19]|61)|72\\d|8(?:[27]\\d|3[1-46-9]|4[0-5]))|2(?:1(?:[23]\\d|4[46-9]|5[3469])|2(?:2\\d|3[0679]|46|5[12679])|3(?:[234]\\d|5[139])|4(?:2\\d|3[1235-9]|59)|5(?:[23]\\d|4[01246-8]|59|61)|6(?:2\\d|3[1-9]|4[0-4]|59)|7(?:[2379]\\d|40|5[279])|8(?:[23]\\d|4[0-3]|59)|9(?:2\\d|3[124578]|59)))\\d{5}", "7(?:0[012578]|47|6[02-4]|7[15-8]|85)\\d{7}", "800\\d{7}", "809\\d{7}", null, null, null, null, "751\\d{7}"]],
                LA: ["856", "[2-8]\\d{7,9}", [
                    ["(20)(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["20"]],
                    ["([2-8]\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["2[13]|3[14]|[4-8]"]],
                    ["(30)(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["30"]]
                ], "0", "0$1"],
                LB: ["961", "[13-9]\\d{6,7}", [
                    ["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[13-6]|7(?:[2-57]|62|8[0-7]|9[04-9])|8[02-9]|9"], "0$1"],
                    ["([7-9]\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[89][01]|7(?:[01]|6[013-9]|8[89]|9[1-3])"]]
                ], "0"],
                LC: ["1", "[5789]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, "758"],
                LI: ["423", "6\\d{8}|[23789]\\d{6}", [
                    ["(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", ["[23789]"]],
                    ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["6[56]"]],
                    ["(69)(7\\d{2})(\\d{4})", "$1 $2 $3", ["697"]]
                ], "0", null, "0|10(?:01|20|66)"],
                LK: ["94", "[1-9]\\d{8}", [
                    ["(\\d{2})(\\d{1})(\\d{6})", "$1 $2 $3", ["[1-689]"]],
                    ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"]]
                ], "0", "0$1"],
                LR: ["231", "2\\d{7,8}|[378]\\d{8}|4\\d{6}|5\\d{6,8}", [
                    ["(2\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["2"]],
                    ["([4-5])(\\d{3})(\\d{3})", "$1 $2 $3", ["[45]"]],
                    ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[23578]"]]
                ], "0", "0$1"],
                LS: ["266", "[2568]\\d{7}", [
                    ["(\\d{4})(\\d{4})", "$1 $2"]
                ]],
                LT: ["370", "[3-9]\\d{7}", [
                    ["([34]\\d)(\\d{6})", "$1 $2", ["37|4(?:1|5[45]|6[2-4])"]],
                    ["([3-6]\\d{2})(\\d{5})", "$1 $2", ["3[148]|4(?:[24]|6[09])|528|6"]],
                    ["([7-9]\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["[7-9]"], "8 $1"],
                    ["(5)(2\\d{2})(\\d{4})", "$1 $2 $3", ["52[0-79]"]]
                ], "8", "(8-$1)", "[08]", null, !0],
                LU: ["352", "[24-9]\\d{3,10}|3(?:[0-46-9]\\d{2,9}|5[013-9]\\d{1,8})", [
                    ["(\\d{2})(\\d{3})", "$1 $2", ["[2-5]|7[1-9]|[89](?:[1-9]|0[2-9])"]],
                    ["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["[2-5]|7[1-9]|[89](?:[1-9]|0[2-9])"]],
                    ["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["20"]],
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{1,2})", "$1 $2 $3 $4", ["2(?:[0367]|4[3-8])"]],
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["20"]],
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{1,2})", "$1 $2 $3 $4 $5", ["2(?:[0367]|4[3-8])"]],
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{1,4})", "$1 $2 $3 $4", ["2(?:[12589]|4[12])|[3-5]|7[1-9]|8(?:[1-9]|0[2-9])|9(?:[1-9]|0[2-46-9])"]],
                    ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["70|80[01]|90[015]"]],
                    ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["6"]]
                ], null, null, "(15(?:0[06]|1[12]|35|4[04]|55|6[26]|77|88|99)\\d)"],
                LV: ["371", "[2689]\\d{7}", [
                    ["([2689]\\d)(\\d{3})(\\d{3})", "$1 $2 $3"]
                ]],
                LY: ["218", "[25679]\\d{8}", [
                    ["([25679]\\d)(\\d{7})", "$1-$2"]
                ], "0", "0$1"],
                MA: ["212", "[5-9]\\d{8}", [
                    ["([5-7]\\d{2})(\\d{6})", "$1-$2", ["5(?:2[015-7]|3[0-4])|[67]"]],
                    ["([58]\\d{3})(\\d{5})", "$1-$2", ["5(?:2[2-489]|3[5-9]|92)|892", "5(?:2(?:[2-48]|90)|3(?:[5-79]|80)|924)|892"]],
                    ["(5\\d{4})(\\d{4})", "$1-$2", ["5(?:29|38)", "5(?:29|38)[89]"]],
                    ["([5]\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["5(?:4[067]|5[03])"]],
                    ["(8[09])(\\d{7})", "$1-$2", ["8(?:0|9[013-9])"]]
                ], "0", "0$1", null, null, null, null, ["5(?:2(?:(?:[015-7]\\d|2[02-9]|3[2-57]|4[2-8]|8[235-7])\\d|9(?:0\\d|[89]0))|3(?:(?:[0-4]\\d|[57][2-9]|6[2-8]|9[3-9])\\d|8(?:0\\d|[89]0))|(?:4[067]|5[03])\\d{2})\\d{4}", "(?:6(?:[0-79]\\d|8[0-247-9])|7(?:[07][07]|6[12]))\\d{6}", "80\\d{7}", "89\\d{7}", null, null, null, null, "5924[01]\\d{4}"]],
                MC: ["377", "[34689]\\d{7,8}", [
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[39]"], "$1"],
                    ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["4"]],
                    ["(6)(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["6"]],
                    ["(\\d{3})(\\d{3})(\\d{2})", "$1 $2 $3", ["8"], "$1"]
                ], "0", "0$1"],
                MD: ["373", "[235-9]\\d{7}", [
                    ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["22|3"]],
                    ["([25-7]\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["2[13-9]|[5-7]"]],
                    ["([89]\\d{2})(\\d{5})", "$1 $2", ["[89]"]]
                ], "0", "0$1"],
                ME: ["382", "[2-9]\\d{7,8}", [
                    ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-57-9]|6[036-9]", "[2-57-9]|6(?:[03689]|7(?:[0-8]|9[3-9]))"]],
                    ["(67)(9)(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["679", "679[0-2]"]]
                ], "0", "0$1"],
                MF: ["590", "[56]\\d{8}", [
                    ["([56]90)(\\d{2})(\\d{4})", "$1 $2-$3"]
                ], "0", null, null, null, null, null, ["590(?:[02][79]|13|5[0-268]|[78]7)\\d{4}", "690(?:0[0-7]|[1-9]\\d)\\d{4}"]],
                MG: ["261", "[23]\\d{8}", [
                    ["([23]\\d)(\\d{2})(\\d{3})(\\d{2})", "$1 $2 $3 $4"]
                ], "0", "0$1"],
                MH: ["692", "[2-6]\\d{6}", [
                    ["(\\d{3})(\\d{4})", "$1-$2"]
                ], "1"],
                MK: ["389", "[2-578]\\d{7}", [
                    ["(2)(\\d{3})(\\d{4})", "$1 $2 $3", ["2"]],
                    ["([347]\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[347]"]],
                    ["([58]\\d{2})(\\d)(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[58]"]]
                ], "0", "0$1"],
                ML: ["223", "[246-9]\\d{7}", [
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[246-9]"]]
                ]],
                MM: ["95", "[1478]\\d{5,7}|[256]\\d{5,8}|9(?:[279]\\d{0,2}|[58]|[34]\\d{1,2}|6\\d?)\\d{6}", [
                    ["(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["1|2[245]"]],
                    ["(2)(\\d{4})(\\d{4})", "$1 $2 $3", ["251"]],
                    ["(\\d)(\\d{2})(\\d{3})", "$1 $2 $3", ["16|2"]],
                    ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["67|81"]],
                    ["(\\d{2})(\\d{2})(\\d{3,4})", "$1 $2 $3", ["[4-8]"]],
                    ["(9)(\\d{3})(\\d{4,6})", "$1 $2 $3", ["9(?:2[0-4]|[35-9]|4[137-9])"]],
                    ["(9)([34]\\d{4})(\\d{4})", "$1 $2 $3", ["9(?:3[0-36]|4[0-57-9])"]],
                    ["(9)(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["92[56]"]],
                    ["(9)(\\d{3})(\\d{3})(\\d{2})", "$1 $2 $3 $4", ["93"]]
                ], "0", "0$1"],
                MN: ["976", "[12]\\d{7,9}|[57-9]\\d{7}", [
                    ["([12]\\d)(\\d{2})(\\d{4})", "$1 $2 $3", ["[12]1"]],
                    ["([12]2\\d)(\\d{5,6})", "$1 $2", ["[12]2[1-3]"]],
                    ["([12]\\d{3})(\\d{5})", "$1 $2", ["[12](?:27|[3-5])", "[12](?:27|[3-5]\\d)2"]],
                    ["(\\d{4})(\\d{4})", "$1 $2", ["[57-9]"], "$1"],
                    ["([12]\\d{4})(\\d{4,5})", "$1 $2", ["[12](?:27|[3-5])", "[12](?:27|[3-5]\\d)[4-9]"]]
                ], "0", "0$1"],
                MO: ["853", "[268]\\d{7}", [
                    ["([268]\\d{3})(\\d{4})", "$1 $2"]
                ]],
                MP: ["1", "[5689]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, "670"],
                MQ: ["596", "[56]\\d{8}", [
                    ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4"]
                ], "0", "0$1"],
                MR: ["222", "[2-48]\\d{7}", [
                    ["([2-48]\\d)(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4"]
                ]],
                MS: ["1", "[5689]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, "664"],
                MT: ["356", "[2357-9]\\d{7}", [
                    ["(\\d{4})(\\d{4})", "$1 $2"]
                ]],
                MU: ["230", "[2-9]\\d{6,7}", [
                    ["([2-46-9]\\d{2})(\\d{4})", "$1 $2", ["[2-46-9]"]],
                    ["(5\\d{3})(\\d{4})", "$1 $2", ["5"]]
                ]],
                MV: ["960", "[346-8]\\d{6,9}|9(?:00\\d{7}|\\d{6})", [
                    ["(\\d{3})(\\d{4})", "$1-$2", ["[3467]|9(?:[1-9]|0[1-9])"]],
                    ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[89]00"]]
                ]],
                MW: ["265", "(?:1(?:\\d{2})?|[2789]\\d{2})\\d{6}", [
                    ["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["1"]],
                    ["(2\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["2"]],
                    ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[1789]"]]
                ], "0", "0$1"],
                MX: ["52", "[1-9]\\d{9,10}", [
                    ["([358]\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["33|55|81"]],
                    ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[2467]|3[0-2457-9]|5[089]|8[02-9]|9[0-35-9]"]],
                    ["(1)([358]\\d)(\\d{4})(\\d{4})", "044 $2 $3 $4", ["1(?:33|55|81)"], "$1", null, "$1 $2 $3 $4"],
                    ["(1)(\\d{3})(\\d{3})(\\d{4})", "044 $2 $3 $4", ["1(?:[2467]|3[0-2457-9]|5[089]|8[2-9]|9[1-35-9])"], "$1", null, "$1 $2 $3 $4"]
                ], "01", "01 $1", "0[12]|04[45](\\d{10})", "1$1", !0],
                MY: ["60", "[13-9]\\d{7,9}", [
                    ["([4-79])(\\d{3})(\\d{4})", "$1-$2 $3", ["[4-79]"], "0$1"],
                    ["(3)(\\d{4})(\\d{4})", "$1-$2 $3", ["3"], "0$1"],
                    ["([18]\\d)(\\d{3})(\\d{3,4})", "$1-$2 $3", ["1[02-46-9][1-9]|8"], "0$1"],
                    ["(1)([36-8]00)(\\d{2})(\\d{4})", "$1-$2-$3-$4", ["1[36-8]0"]],
                    ["(11)(\\d{4})(\\d{4})", "$1-$2 $3", ["11"], "0$1"],
                    ["(15[49])(\\d{3})(\\d{4})", "$1-$2 $3", ["15"], "0$1"]
                ], "0"],
                MZ: ["258", "[28]\\d{7,8}", [
                    ["([28]\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2|8[2-7]"]],
                    ["(80\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["80"]]
                ]],
                NA: ["264", "[68]\\d{7,8}", [
                    ["(8\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["8[1235]"]],
                    ["(6\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["6"]],
                    ["(88)(\\d{3})(\\d{3})", "$1 $2 $3", ["88"]],
                    ["(870)(\\d{3})(\\d{3})", "$1 $2 $3", ["870"]]
                ], "0", "0$1"],
                NC: ["687", "[2-57-9]\\d{5}", [
                    ["(\\d{2})(\\d{2})(\\d{2})", "$1.$2.$3", ["[2-46-9]|5[0-4]"]]
                ]],
                NE: ["227", "[0289]\\d{7}", [
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[289]|09"]],
                    ["(08)(\\d{3})(\\d{3})", "$1 $2 $3", ["08"]]
                ]],
                NF: ["672", "[13]\\d{5}", [
                    ["(\\d{2})(\\d{4})", "$1 $2", ["1"]],
                    ["(\\d)(\\d{5})", "$1 $2", ["3"]]
                ]],
                NG: ["234", "[1-6]\\d{5,8}|9\\d{5,9}|[78]\\d{5,13}", [
                    ["(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[12]|9(?:0[3-9]|[1-9])"]],
                    ["(\\d{2})(\\d{3})(\\d{2,3})", "$1 $2 $3", ["[3-6]|7(?:[1-79]|0[1-9])|8[2-9]"]],
                    ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["70|8[01]|90[2357-9]"]],
                    ["([78]00)(\\d{4})(\\d{4,5})", "$1 $2 $3", ["[78]00"]],
                    ["([78]00)(\\d{5})(\\d{5,6})", "$1 $2 $3", ["[78]00"]],
                    ["(78)(\\d{2})(\\d{3})", "$1 $2 $3", ["78"]]
                ], "0", "0$1"],
                NI: ["505", "[12578]\\d{7}", [
                    ["(\\d{4})(\\d{4})", "$1 $2"]
                ]],
                NL: ["31", "1\\d{4,8}|[2-7]\\d{8}|[89]\\d{6,9}", [
                    ["([1-578]\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["1[035]|2[0346]|3[03568]|4[0356]|5[0358]|7|8[4578]"]],
                    ["([1-5]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["1[16-8]|2[259]|3[124]|4[17-9]|5[124679]"]],
                    ["(6)(\\d{8})", "$1 $2", ["6[0-57-9]"]],
                    ["(66)(\\d{7})", "$1 $2", ["66"]],
                    ["(14)(\\d{3,4})", "$1 $2", ["14"], "$1"],
                    ["([89]0\\d)(\\d{4,7})", "$1 $2", ["80|9"]]
                ], "0", "0$1"],
                NO: ["47", "0\\d{4}|[2-9]\\d{7}", [
                    ["([489]\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["[489]"]],
                    ["([235-7]\\d)(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[235-7]"]]
                ], null, null, null, null, null, null, ["(?:2[1-4]|3[1-3578]|5[1-35-7]|6[1-4679]|7[0-8])\\d{6}", "(?:4[015-8]|5[89]|87|9\\d)\\d{6}", "80[01]\\d{5}", "82[09]\\d{5}", "880\\d{5}", "81[23]\\d{5}", "0\\d{4}|81(?:0(?:0[7-9]|1\\d)|5\\d{2})\\d{3}", null, "85[0-5]\\d{5}"]],
                NP: ["977", "[1-8]\\d{7}|9(?:[1-69]\\d{6,8}|7[2-6]\\d{5,7}|8\\d{8})", [
                    ["(1)(\\d{7})", "$1-$2", ["1[2-6]"]],
                    ["(\\d{2})(\\d{6})", "$1-$2", ["1[01]|[2-8]|9(?:[1-69]|7[15-9])"]],
                    ["(9\\d{2})(\\d{7})", "$1-$2", ["9(?:6[013]|7[245]|8)"], "$1"]
                ], "0", "0$1"],
                NR: ["674", "[458]\\d{6}", [
                    ["(\\d{3})(\\d{4})", "$1 $2"]
                ]],
                NU: ["683", "[1-5]\\d{3}"],
                NZ: ["64", "6[235-9]\\d{6}|[2-57-9]\\d{7,10}", [
                    ["([34679])(\\d{3})(\\d{4})", "$1-$2 $3", ["[346]|7[2-57-9]|9[1-9]"]],
                    ["(24099)(\\d{3})", "$1 $2", ["240", "2409", "24099"]],
                    ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["21"]],
                    ["(\\d{2})(\\d{3})(\\d{3,5})", "$1 $2 $3", ["2(?:1[1-9]|[69]|7[0-35-9])|70|86"]],
                    ["(2\\d)(\\d{3,4})(\\d{4})", "$1 $2 $3", ["2[028]"]],
                    ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2(?:10|74)|5|[89]0"]]
                ], "0", "0$1"],
                OM: ["968", "(?:5|[279]\\d)\\d{6}|800\\d{5,6}", [
                    ["(2\\d)(\\d{6})", "$1 $2", ["2"]],
                    ["([79]\\d{3})(\\d{4})", "$1 $2", ["[79]"]],
                    ["([58]00)(\\d{4,6})", "$1 $2", ["[58]"]]
                ]],
                PA: ["507", "[1-9]\\d{6,7}", [
                    ["(\\d{3})(\\d{4})", "$1-$2", ["[1-57-9]"]],
                    ["(\\d{4})(\\d{4})", "$1-$2", ["6"]]
                ]],
                PE: ["51", "[14-9]\\d{7,8}", [
                    ["(1)(\\d{7})", "$1 $2", ["1"]],
                    ["([4-8]\\d)(\\d{6})", "$1 $2", ["[4-7]|8[2-4]"]],
                    ["(\\d{3})(\\d{5})", "$1 $2", ["80"]],
                    ["(9\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["9"], "$1"]
                ], "0", "(0$1)"],
                PF: ["689", "4\\d{5,7}|8\\d{7}", [
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["4[09]|8[79]"]],
                    ["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["44"]]
                ]],
                PG: ["675", "[1-9]\\d{6,7}", [
                    ["(\\d{3})(\\d{4})", "$1 $2", ["[13-689]|27"]],
                    ["(\\d{4})(\\d{4})", "$1 $2", ["20|7"]]
                ]],
                PH: ["63", "2\\d{5,7}|[3-9]\\d{7,9}|1800\\d{7,9}", [
                    ["(2)(\\d{3})(\\d{4})", "$1 $2 $3", ["2"], "(0$1)"],
                    ["(2)(\\d{5})", "$1 $2", ["2"], "(0$1)"],
                    ["(\\d{4})(\\d{4,6})", "$1 $2", ["3(?:23|39|46)|4(?:2[3-6]|[35]9|4[26]|76)|5(?:22|44)|642|8(?:62|8[245])", "3(?:230|397|461)|4(?:2(?:35|[46]4|51)|396|4(?:22|63)|59[347]|76[15])|5(?:221|446)|642[23]|8(?:622|8(?:[24]2|5[13]))"], "(0$1)"],
                    ["(\\d{5})(\\d{4})", "$1 $2", ["346|4(?:27|9[35])|883", "3469|4(?:279|9(?:30|56))|8834"], "(0$1)"],
                    ["([3-8]\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[3-8]"], "(0$1)"],
                    ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["81|9"], "0$1"],
                    ["(1800)(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]],
                    ["(1800)(\\d{1,2})(\\d{3})(\\d{4})", "$1 $2 $3 $4", ["1"]]
                ], "0"],
                PK: ["92", "1\\d{8}|[2-8]\\d{5,11}|9(?:[013-9]\\d{4,9}|2\\d(?:111\\d{6}|\\d{3,7}))", [
                    ["(\\d{2})(111)(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["(?:2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)1", "(?:2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)11", "(?:2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)111"]],
                    ["(\\d{3})(111)(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["2[349]|45|54|60|72|8[2-5]|9[2-9]", "(?:2[349]|45|54|60|72|8[2-5]|9[2-9])\\d1", "(?:2[349]|45|54|60|72|8[2-5]|9[2-9])\\d11", "(?:2[349]|45|54|60|72|8[2-5]|9[2-9])\\d111"]],
                    ["(\\d{2})(\\d{7,8})", "$1 $2", ["(?:2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)[2-9]"]],
                    ["(\\d{3})(\\d{6,7})", "$1 $2", ["2[349]|45|54|60|72|8[2-5]|9[2-9]", "(?:2[349]|45|54|60|72|8[2-5]|9[2-9])\\d[2-9]"]],
                    ["(3\\d{2})(\\d{7})", "$1 $2", ["3"], "0$1"],
                    ["([15]\\d{3})(\\d{5,6})", "$1 $2", ["58[12]|1"]],
                    ["(586\\d{2})(\\d{5})", "$1 $2", ["586"]],
                    ["([89]00)(\\d{3})(\\d{2})", "$1 $2 $3", ["[89]00"], "0$1"]
                ], "0", "(0$1)"],
                PL: ["48", "[12]\\d{6,8}|[3-57-9]\\d{8}|6\\d{5,8}", [
                    ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[14]|2[0-57-9]|3[2-4]|5[24-689]|6[1-3578]|7[14-7]|8[1-79]|9[145]"]],
                    ["(\\d{2})(\\d{1})(\\d{4})", "$1 $2 $3", ["[12]2"]],
                    ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["26|39|5[0137]|6[0469]|7[02389]|8[08]"]],
                    ["(\\d{3})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["64"]],
                    ["(\\d{3})(\\d{3})", "$1 $2", ["64"]]
                ]],
                PM: ["508", "[45]\\d{5}", [
                    ["([45]\\d)(\\d{2})(\\d{2})", "$1 $2 $3"]
                ], "0", "0$1"],
                PR: ["1", "[5789]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, "787|939"],
                PS: ["970", "[24589]\\d{7,8}|1(?:[78]\\d{8}|[49]\\d{2,3})", [
                    ["([2489])(2\\d{2})(\\d{4})", "$1 $2 $3", ["[2489]"]],
                    ["(5[69]\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["5"]],
                    ["(1[78]00)(\\d{3})(\\d{3})", "$1 $2 $3", ["1[78]"], "$1"]
                ], "0", "0$1"],
                PT: ["351", "[2-46-9]\\d{8}", [
                    ["(2\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["2[12]"]],
                    ["([2-46-9]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["2[3-9]|[346-9]"]]
                ]],
                PW: ["680", "[2-8]\\d{6}", [
                    ["(\\d{3})(\\d{4})", "$1 $2"]
                ]],
                PY: ["595", "5[0-5]\\d{4,7}|[2-46-9]\\d{5,8}", [
                    ["(\\d{2})(\\d{5})", "$1 $2", ["(?:[26]1|3[289]|4[124678]|7[123]|8[1236])"], "(0$1)"],
                    ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["(?:[26]1|3[289]|4[124678]|7[123]|8[1236])"], "(0$1)"],
                    ["(\\d{3})(\\d{3,6})", "$1 $2", ["[2-9]0"], "0$1"],
                    ["(\\d{3})(\\d{6})", "$1 $2", ["9[1-9]"], "0$1"],
                    ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["8700"]],
                    ["(\\d{3})(\\d{4,5})", "$1 $2", ["[2-8][1-9]"], "(0$1)"],
                    ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-8][1-9]"], "0$1"]
                ], "0"],
                QA: ["974", "[2-8]\\d{6,7}", [
                    ["([28]\\d{2})(\\d{4})", "$1 $2", ["[28]"]],
                    ["([3-7]\\d{3})(\\d{4})", "$1 $2", ["[3-7]"]]
                ]],
                RE: ["262", "[268]\\d{8}", [
                    ["([268]\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4"]
                ], "0", "0$1", null, null, null, "262|6[49]|8"],
                RO: ["40", "2\\d{5,8}|[37-9]\\d{8}", [
                    ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[23]1"]],
                    ["(21)(\\d{4})", "$1 $2", ["21"]],
                    ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[23][3-7]|[7-9]"]],
                    ["(2\\d{2})(\\d{3})", "$1 $2", ["2[3-6]"]]
                ], "0", "0$1"],
                RS: ["381", "[126-9]\\d{4,11}|3(?:[0-79]\\d{3,10}|8[2-9]\\d{2,9})", [
                    ["([23]\\d{2})(\\d{4,9})", "$1 $2", ["(?:2[389]|39)0"]],
                    ["([1-3]\\d)(\\d{5,10})", "$1 $2", ["1|2(?:[0-24-7]|[389][1-9])|3(?:[0-8]|9[1-9])"]],
                    ["(6\\d)(\\d{6,8})", "$1 $2", ["6"]],
                    ["([89]\\d{2})(\\d{3,9})", "$1 $2", ["[89]"]],
                    ["(7[26])(\\d{4,9})", "$1 $2", ["7[26]"]],
                    ["(7[08]\\d)(\\d{4,9})", "$1 $2", ["7[08]"]]
                ], "0", "0$1"],
                RU: ["7", "[3489]\\d{9}", [
                    ["([3489]\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["[34689]"]],
                    ["(7\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"]]
                ], "8", "8 ($1)", null, null, !0, null, ["(?:3(?:0[12]|4[1-35-79]|5[1-3]|65|8[1-58]|9[0145])|4(?:01|1[1356]|2[13467]|7[1-5]|8[1-7]|9[1-689])|8(?:1[1-8]|2[01]|3[13-6]|4[0-8]|5[15]|6[1-35-79]|7[1-37-9]))\\d{7}", "9\\d{9}", "80[04]\\d{7}", "80[39]\\d{7}"]],
                RW: ["250", "[027-9]\\d{7,8}", [
                    ["(2\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["2"], "$1"],
                    ["([7-9]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[7-9]"], "0$1"],
                    ["(0\\d)(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["0"]]
                ], "0"],
                SA: ["966", "1\\d{7,8}|(?:[2-467]|92)\\d{7}|5\\d{8}|8\\d{9}", [
                    ["([1-467])(\\d{3})(\\d{4})", "$1 $2 $3", ["[1-467]"]],
                    ["(1\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["1[1-467]"]],
                    ["(5\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["5"]],
                    ["(92\\d{2})(\\d{5})", "$1 $2", ["92"], "$1"],
                    ["(800)(\\d{3})(\\d{4})", "$1 $2 $3", ["80"], "$1"],
                    ["(811)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["81"]]
                ], "0", "0$1"],
                SB: ["677", "[1-9]\\d{4,6}", [
                    ["(\\d{2})(\\d{5})", "$1 $2", ["[7-9]"]]
                ]],
                SC: ["248", "[2468]\\d{5,6}", [
                    ["(\\d{3})(\\d{3})", "$1 $2", ["8"]],
                    ["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[246]"]]
                ]],
                SD: ["249", "[19]\\d{8}", [
                    ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3"]
                ], "0", "0$1"],
                SE: ["46", "[1-35-9]\\d{5,11}|4\\d{6,8}", [
                    ["(8)(\\d{2,3})(\\d{2,3})(\\d{2})", "$1-$2 $3 $4", ["8"], null, null, "$1 $2 $3 $4"],
                    ["([1-69]\\d)(\\d{2,3})(\\d{2})(\\d{2})", "$1-$2 $3 $4", ["1[013689]|2[0136]|3[1356]|4[0246]|54|6[03]|90"], null, null, "$1 $2 $3 $4"],
                    ["([1-469]\\d)(\\d{3})(\\d{2})", "$1-$2 $3", ["1[136]|2[136]|3[356]|4[0246]|6[03]|90"], null, null, "$1 $2 $3"],
                    ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1-$2 $3 $4", ["1[2457]|2(?:[247-9]|5[0138])|3[0247-9]|4[1357-9]|5[0-35-9]|6(?:[124-689]|7[0-2])|9(?:[125-8]|3[0-5]|4[0-3])"], null, null, "$1 $2 $3 $4"],
                    ["(\\d{3})(\\d{2,3})(\\d{2})", "$1-$2 $3", ["1[2457]|2(?:[247-9]|5[0138])|3[0247-9]|4[1357-9]|5[0-35-9]|6(?:[124-689]|7[0-2])|9(?:[125-8]|3[0-5]|4[0-3])"], null, null, "$1 $2 $3"],
                    ["(7\\d)(\\d{3})(\\d{2})(\\d{2})", "$1-$2 $3 $4", ["7"], null, null, "$1 $2 $3 $4"],
                    ["(77)(\\d{2})(\\d{2})", "$1-$2$3", ["7"], null, null, "$1 $2 $3"],
                    ["(20)(\\d{2,3})(\\d{2})", "$1-$2 $3", ["20"], null, null, "$1 $2 $3"],
                    ["(9[034]\\d)(\\d{2})(\\d{2})(\\d{3})", "$1-$2 $3 $4", ["9[034]"], null, null, "$1 $2 $3 $4"],
                    ["(9[034]\\d)(\\d{4})", "$1-$2", ["9[034]"], null, null, "$1 $2"],
                    ["(\\d{3})(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1-$2 $3 $4 $5", ["25[245]|67[3-6]"], null, null, "$1 $2 $3 $4 $5"]
                ], "0", "0$1"],
                SG: ["65", "[36]\\d{7}|[17-9]\\d{7,10}", [
                    ["([3689]\\d{3})(\\d{4})", "$1 $2", ["[369]|8[1-9]"]],
                    ["(1[89]00)(\\d{3})(\\d{4})", "$1 $2 $3", ["1[89]"]],
                    ["(7000)(\\d{4})(\\d{3})", "$1 $2 $3", ["70"]],
                    ["(800)(\\d{3})(\\d{4})", "$1 $2 $3", ["80"]]
                ]],
                SH: ["290", "[256]\\d{4}", [], null, null, null, null, null, null, ["2(?:[0-57-9]\\d|6[4-9])\\d{2}", "[56]\\d{4}", null, null, null, null, null, null, "262\\d{2}"]],
                SI: ["386", "[1-7]\\d{6,7}|[89]\\d{4,7}", [
                    ["(\\d)(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[12]|3[24-8]|4[24-8]|5[2-8]|7[3-8]"], "(0$1)"],
                    ["([3-7]\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[37][01]|4[0139]|51|6"]],
                    ["([89][09])(\\d{3,6})", "$1 $2", ["[89][09]"]],
                    ["([58]\\d{2})(\\d{5})", "$1 $2", ["59|8[1-3]"]]
                ], "0", "0$1"],
                SJ: ["47", "0\\d{4}|[4789]\\d{7}", [
                    ["([489]\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["[489]"]],
                    ["([235-7]\\d)(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[235-7]"]]
                ], null, null, null, null, null, null, ["79\\d{6}", "(?:4[015-8]|5[89]|9\\d)\\d{6}", "80[01]\\d{5}", "82[09]\\d{5}", "880\\d{5}", "81[23]\\d{5}", "0\\d{4}|81(?:0(?:0[7-9]|1\\d)|5\\d{2})\\d{3}", null, "85[0-5]\\d{5}"]],
                SK: ["421", "(?:[2-68]\\d{5,8}|9\\d{6,8})", [
                    ["(2)(16)(\\d{3,4})", "$1 $2 $3", ["216"]],
                    ["([3-5]\\d)(16)(\\d{2,3})", "$1 $2 $3", ["[3-5]"]],
                    ["(2)(\\d{3})(\\d{3})(\\d{2})", "$1/$2 $3 $4", ["2"]],
                    ["([3-5]\\d)(\\d{3})(\\d{2})(\\d{2})", "$1/$2 $3 $4", ["[3-5]"]],
                    ["([689]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[689]"]],
                    ["(9090)(\\d{3})", "$1 $2", ["9090"]]
                ], "0", "0$1"],
                SL: ["232", "[2-9]\\d{7}", [
                    ["(\\d{2})(\\d{6})", "$1 $2"]
                ], "0", "(0$1)"],
                SM: ["378", "[05-7]\\d{7,9}", [
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[5-7]"]],
                    ["(0549)(\\d{6})", "$1 $2", ["0"], null, null, "($1) $2"],
                    ["(\\d{6})", "0549 $1", ["[89]"], null, null, "(0549) $1"]
                ], null, null, "(?:0549)?([89]\\d{5})", "0549$1"],
                SN: ["221", "[3789]\\d{8}", [
                    ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[379]"]],
                    ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"]]
                ]],
                SO: ["252", "[1-79]\\d{6,8}", [
                    ["(\\d)(\\d{6})", "$1 $2", ["2[0-79]|[13-5]"]],
                    ["(\\d)(\\d{7})", "$1 $2", ["24|[67]"]],
                    ["(\\d{2})(\\d{5,7})", "$1 $2", ["15|28|6[1-35-9]|799|9[2-9]"]],
                    ["(90\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["90"]]
                ], "0"],
                SR: ["597", "[2-8]\\d{5,6}", [
                    ["(\\d{3})(\\d{3})", "$1-$2", ["[2-4]|5[2-58]"]],
                    ["(\\d{2})(\\d{2})(\\d{2})", "$1-$2-$3", ["56"]],
                    ["(\\d{3})(\\d{4})", "$1-$2", ["59|[6-8]"]]
                ]],
                SS: ["211", "[19]\\d{8}", [
                    ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", null, "0$1"]
                ], "0"],
                ST: ["239", "[29]\\d{6}", [
                    ["(\\d{3})(\\d{4})", "$1 $2"]
                ]],
                SV: ["503", "[267]\\d{7}|[89]\\d{6}(?:\\d{4})?", [
                    ["(\\d{4})(\\d{4})", "$1 $2", ["[267]"]],
                    ["(\\d{3})(\\d{4})", "$1 $2", ["[89]"]],
                    ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["[89]"]]
                ]],
                SX: ["1", "[5789]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, "721"],
                SY: ["963", "[1-59]\\d{7,8}", [
                    ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[1-5]"]],
                    ["(9\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["9"]]
                ], "0", "0$1", null, null, !0],
                SZ: ["268", "[027]\\d{7}", [
                    ["(\\d{4})(\\d{4})", "$1 $2", ["[027]"]]
                ]],
                TA: ["290", "8\\d{3}", [], null, null, null, null, null, null, ["8\\d{3}"]],
                TC: ["1", "[5689]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, "649"],
                TD: ["235", "[2679]\\d{7}", [
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4"]
                ]],
                TG: ["228", "[29]\\d{7}", [
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4"]
                ]],
                TH: ["66", "[2-9]\\d{7,8}|1\\d{3}(?:\\d{5,6})?", [
                    ["(2)(\\d{3})(\\d{4})", "$1 $2 $3", ["2"]],
                    ["([13-9]\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["14|[3-9]"]],
                    ["(1[89]00)(\\d{3})(\\d{3})", "$1 $2 $3", ["1"], "$1"]
                ], "0", "0$1"],
                TJ: ["992", "[3-589]\\d{8}", [
                    ["([349]\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["[34]7|91[78]"]],
                    ["([4589]\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["4[148]|[58]|9(?:1[59]|[0235-9])"]],
                    ["(331700)(\\d)(\\d{2})", "$1 $2 $3", ["331", "3317", "33170", "331700"]],
                    ["(\\d{4})(\\d)(\\d{4})", "$1 $2 $3", ["3[1-5]", "3(?:[1245]|3(?:[02-9]|1[0-589]))"]]
                ], "8", "(8) $1", null, null, !0],
                TK: ["690", "[2-47]\\d{3,6}"],
                TL: ["670", "[2-489]\\d{6}|7\\d{6,7}", [
                    ["(\\d{3})(\\d{4})", "$1 $2", ["[2-489]"]],
                    ["(\\d{4})(\\d{4})", "$1 $2", ["7"]]
                ]],
                TM: ["993", "[1-6]\\d{7}", [
                    ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["12"]],
                    ["(\\d{2})(\\d{6})", "$1 $2", ["6"], "8 $1"],
                    ["(\\d{3})(\\d)(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["13|[2-5]"]]
                ], "8", "(8 $1)"],
                TN: ["216", "[2-57-9]\\d{7}", [
                    ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3"]
                ]],
                TO: ["676", "[02-8]\\d{4,6}", [
                    ["(\\d{2})(\\d{3})", "$1-$2", ["[1-6]|7[0-4]|8[05]"]],
                    ["(\\d{3})(\\d{4})", "$1 $2", ["7[5-9]|8[47-9]"]],
                    ["(\\d{4})(\\d{3})", "$1 $2", ["0"]]
                ]],
                TR: ["90", "[2-589]\\d{9}|444\\d{4}", [
                    ["(\\d{3})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[23]|4(?:[0-35-9]|4[0-35-9])"], "(0$1)", "true"],
                    ["(\\d{3})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["5[02-69]"], "0$1", "true"],
                    ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["51|[89]"], "0$1", "true"],
                    ["(444)(\\d{1})(\\d{3})", "$1 $2 $3", ["444"]]
                ], "0"],
                TT: ["1", "[589]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, "868"],
                TV: ["688", "[279]\\d{4,6}"],
                TW: ["886", "2\\d{6,8}|[3-689]\\d{7,8}|7\\d{7,9}", [
                    ["(20)(\\d)(\\d{4})", "$1 $2 $3", ["202"]],
                    ["(20)(\\d{3})(\\d{4})", "$1 $2 $3", ["20[013-9]"]],
                    ["([2-8])(\\d{3,4})(\\d{4})", "$1 $2 $3", ["2[23-8]|[3-6]|[78][1-9]"]],
                    ["([89]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["80|9"]],
                    ["(70)(\\d{4})(\\d{4})", "$1 $2 $3", ["70"]]
                ], "0", "0$1"],
                TZ: ["255", "\\d{9}", [
                    ["([24]\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[24]"]],
                    ["([67]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[67]"]],
                    ["([89]\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["[89]"]]
                ], "0", "0$1"],
                UA: ["380", "[3-9]\\d{8}", [
                    ["([3-9]\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[38]9|4(?:[45][0-5]|87)|5(?:0|6[37]|7[37])|6[36-8]|73|9[1-9]", "[38]9|4(?:[45][0-5]|87)|5(?:0|6(?:3[14-7]|7)|7[37])|6[36-8]|73|9[1-9]"]],
                    ["([3-689]\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["3[1-8]2|4[13678]2|5(?:[12457]2|6[24])|6(?:[49]2|[12][29]|5[24])|8[0-8]|90", "3(?:[1-46-8]2[013-9]|52)|4(?:[1378]2|62[013-9])|5(?:[12457]2|6[24])|6(?:[49]2|[12][29]|5[24])|8[0-8]|90"]],
                    ["([3-6]\\d{3})(\\d{5})", "$1 $2", ["3(?:5[013-9]|[1-46-8])|4(?:[137][013-9]|6|[45][6-9]|8[4-6])|5(?:[1245][013-9]|6[0135-9]|3|7[4-6])|6(?:[49][013-9]|5[0135-9]|[12][13-8])", "3(?:5[013-9]|[1-46-8](?:22|[013-9]))|4(?:[137][013-9]|6(?:[013-9]|22)|[45][6-9]|8[4-6])|5(?:[1245][013-9]|6(?:3[02389]|[015689])|3|7[4-6])|6(?:[49][013-9]|5[0135-9]|[12][13-8])"]]
                ], "0", "0$1"],
                UG: ["256", "\\d{9}", [
                    ["(\\d{3})(\\d{6})", "$1 $2", ["[7-9]|20(?:[013-8]|2[5-9])|4(?:6[45]|[7-9])"]],
                    ["(\\d{2})(\\d{7})", "$1 $2", ["3|4(?:[1-5]|6[0-36-9])"]],
                    ["(2024)(\\d{5})", "$1 $2", ["2024"]]
                ], "0", "0$1"],
                US: ["1", "[2-9]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, !0, null, ["(?:2(?:0[1-35-9]|1[02-9]|2[04589]|3[149]|4[08]|5[1-46]|6[0279]|7[026]|8[13])|3(?:0[1-57-9]|1[02-9]|2[0135]|3[014679]|4[67]|5[12]|6[014]|8[056])|4(?:0[124-9]|1[02-579]|2[3-5]|3[0245]|4[0235]|58|6[39]|7[0589]|8[04])|5(?:0[1-57-9]|1[0235-8]|20|3[0149]|4[01]|5[19]|6[1-37]|7[013-5]|8[056])|6(?:0[1-35-9]|1[024-9]|2[03689]|3[016]|4[16]|5[017]|6[0-279]|78|8[12])|7(?:0[1-46-8]|1[02-9]|2[0457]|3[1247]|4[037]|5[47]|6[02359]|7[02-59]|8[156])|8(?:0[1-68]|1[02-8]|28|3[0-25]|4[3578]|5[046-9]|6[02-5]|7[028])|9(?:0[1346-9]|1[02-9]|2[0589]|3[014678]|4[0179]|5[12469]|7[0-3589]|8[0459]))[2-9]\\d{6}", null, "8(?:00|44|55|66|77|88)[2-9]\\d{6}", "900[2-9]\\d{6}", "5(?:00|22|33|44|66|77|88)[2-9]\\d{6}"]],
                UY: ["598", "[2489]\\d{6,7}", [
                    ["(\\d{4})(\\d{4})", "$1 $2", ["[24]"]],
                    ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["9[1-9]"], "0$1"],
                    ["(\\d{3})(\\d{4})", "$1 $2", ["[89]0"], "0$1"]
                ], "0"],
                UZ: ["998", "[679]\\d{8}", [
                    ["([679]\\d)(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4"]
                ], "8", "8 $1"],
                VA: ["39", "(?:0(?:878\\d{5}|6698\\d{5})|[1589]\\d{5,10}|3(?:[12457-9]\\d{8}|[36]\\d{7,9}))", [
                    ["(\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["0[26]|55"]],
                    ["(0[26])(\\d{4})(\\d{5})", "$1 $2 $3", ["0[26]"]],
                    ["(0[26])(\\d{4,6})", "$1 $2", ["0[26]"]],
                    ["(0\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["0[13-57-9][0159]"]],
                    ["(\\d{3})(\\d{3,6})", "$1 $2", ["0[13-57-9][0159]|8(?:03|4[17]|9[245])", "0[13-57-9][0159]|8(?:03|4[17]|9(?:2|[45][0-4]))"]],
                    ["(0\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["0[13-57-9][2-46-8]"]],
                    ["(0\\d{3})(\\d{2,6})", "$1 $2", ["0[13-57-9][2-46-8]"]],
                    ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[13]|8(?:00|4[08]|9[59])", "[13]|8(?:00|4[08]|9(?:5[5-9]|9))"]],
                    ["(\\d{4})(\\d{4})", "$1 $2", ["894", "894[5-9]"]],
                    ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["3"]]
                ], null, null, null, null, null, null, ["06698\\d{5}", "3(?:[12457-9]\\d{8}|6\\d{7,8}|3\\d{7,9})", "80(?:0\\d{6}|3\\d{3})", "0878\\d{5}|1(?:44|6[346])\\d{6}|89(?:2\\d{3}|4(?:[0-4]\\d{2}|[5-9]\\d{4})|5(?:[0-4]\\d{2}|[5-9]\\d{6})|9\\d{6})", "1(?:78\\d|99)\\d{6}", null, null, null, "55\\d{8}"]],
                VC: ["1", "[5789]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, "784"],
                VE: ["58", "[24589]\\d{9}", [
                    ["(\\d{3})(\\d{7})", "$1-$2"]
                ], "0", "0$1"],
                VG: ["1", "[2589]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, "284"],
                VI: ["1", "[3589]\\d{9}", [
                    ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", null, null, null, "$1-$2-$3"]
                ], "1", null, null, null, null, "340"],
                VN: ["84", "[17]\\d{6,9}|[2-69]\\d{7,9}|8\\d{6,8}", [
                    ["([17]99)(\\d{4})", "$1 $2", ["[17]99"]],
                    ["([48])(\\d{4})(\\d{4})", "$1 $2 $3", ["4|8(?:[1-57]|[689][0-79])"]],
                    ["([235-7]\\d)(\\d{4})(\\d{3})", "$1 $2 $3", ["2[025-79]|3[0136-9]|5[2-9]|6[0-46-8]|7[02-79]"]],
                    ["(80)(\\d{5})", "$1 $2", ["80"]],
                    ["(69\\d)(\\d{4,5})", "$1 $2", ["69"]],
                    ["([235-7]\\d{2})(\\d{4})(\\d{3})", "$1 $2 $3", ["2[1348]|3[25]|5[01]|65|7[18]"]],
                    ["([89]\\d)(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8[689]8|9"]],
                    ["(1[2689]\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["1(?:[26]|8[68]|99)"]],
                    ["(1[89]00)(\\d{4,6})", "$1 $2", ["1[89]0"], "$1"]
                ], "0", "0$1", null, null, !0],
                VU: ["678", "[2-57-9]\\d{4,6}", [
                    ["(\\d{3})(\\d{4})", "$1 $2", ["[579]"]]
                ]],
                WF: ["681", "[4-8]\\d{5}", [
                    ["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3"]
                ]],
                WS: ["685", "[2-8]\\d{4,6}", [
                    ["(8\\d{2})(\\d{3,4})", "$1 $2", ["8"]],
                    ["(7\\d)(\\d{5})", "$1 $2", ["7"]],
                    ["(\\d{5})", "$1", ["[2-6]"]]
                ]],
                YE: ["967", "[1-7]\\d{6,8}", [
                    ["([1-7])(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[1-6]|7[24-68]"]],
                    ["(7\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["7[0137]"]]
                ], "0", "0$1"],
                YT: ["262", "[268]\\d{8}", [
                    ["([268]\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4"]
                ], "0", "0$1", null, null, null, "269|63"],
                ZA: ["27", "[1-79]\\d{8}|8(?:[067]\\d{7}|[1-4]\\d{3,7})", [
                    ["(860)(\\d{3})(\\d{3})", "$1 $2 $3", ["860"]],
                    ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[1-79]|8(?:[0-47]|6[1-9])"]],
                    ["(\\d{2})(\\d{3,4})", "$1 $2", ["8[1-4]"]],
                    ["(\\d{2})(\\d{3})(\\d{2,3})", "$1 $2 $3", ["8[1-4]"]]
                ], "0", "0$1"],
                ZM: ["260", "[289]\\d{8}", [
                    ["([29]\\d)(\\d{7})", "$1 $2", ["[29]"]],
                    ["(800)(\\d{3})(\\d{3})", "$1 $2 $3", ["8"]]
                ], "0", "0$1"],
                ZW: ["263", "2(?:[012457-9]\\d{3,8}|6(?:[14]\\d{7}|\\d{4}))|[13-79]\\d{4,9}|8[06]\\d{8}", [
                    ["([49])(\\d{3})(\\d{2,4})", "$1 $2 $3", ["4|9[2-9]"]],
                    ["(7\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["7"]],
                    ["(86\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["86[24]"]],
                    ["([2356]\\d{2})(\\d{3,5})", "$1 $2", ["2(?:0[45]|2[278]|[49]8|[78])|3(?:08|17|3[78]|7[1569]|8[37]|98)|5[15][78]|6(?:[29]8|[38]7|6[78]|75|[89]8)"]],
                    ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2(?:1[39]|2[0157]|6[14]|7[35]|84)|329"]],
                    ["([1-356]\\d)(\\d{3,5})", "$1 $2", ["1[3-9]|2[0569]|3[0-69]|5[05689]|6[0-46-9]"]],
                    ["([235]\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[23]9|54"]],
                    ["([25]\\d{3})(\\d{3,5})", "$1 $2", ["(?:25|54)8", "258[23]|5483"]],
                    ["(8\\d{3})(\\d{6})", "$1 $2", ["86"]],
                    ["(80\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["80"]]
                ], "0", "0$1"],
                "001": ["979", "\\d{9}", [
                    ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3"]
                ]]
            }
        }
    }, function(d, $, t) {
        "use strict";

        function n(d) {
            return d && d.__esModule ? d : {
                default: d
            }
        }

        function e(d, $) {
            for (var t = d.slice(0, $), n = r("(", t), e = r(")", t), l = n - e; l > 0 && $ < d.length;) ")" === d[$] && l--, $++;
            return d.slice(0, $)
        }

        function r(d, $) {
            var t = 0,
                n = !0,
                e = !1,
                r = void 0;
            try {
                for (var l, u = (0, o.default)($); !(n = (l = u.next()).done); n = !0) {
                    var i = l.value;
                    i === d && t++
                }
            } catch (d) {
                e = !0, r = d
            } finally {
                try {
                    !n && u.return && u.return()
                } finally {
                    if (e) throw r
                }
            }
            return t
        }

        function l(d, $) {
            if ($ < 1) return "";
            for (var t = ""; $ > 1;) 1 & $ && (t += d), $ >>= 1, d += d;
            return t + d
        }
        Object.defineProperty($, "__esModule", {
            value: !0
        }), $.DIGIT_PLACEHOLDER = void 0, $.close_dangling_braces = e, $.count_occurences = r, $.repeat = l;
        var u = t(14),
            o = n(u),
            i = t(39),
            a = n(i),
            _ = t(40),
            f = n(_),
            c = t(6),
            s = t(5),
            p = t(12),
            h = t(13),
            m = "9",
            y = new RegExp(m, "g"),
            v = 15,
            g = l(m, v),
            b = $.DIGIT_PLACEHOLDER = "x",
            x = new RegExp(b),
            M = new RegExp(b, "g"),
            E = /\[([^\[\]])*\]/g,
            O = /\d(?=[^,}][^,}])/g,
            S = new RegExp("^[" + s.VALID_PUNCTUATION + "]*(\\$\\d[" + s.VALID_PUNCTUATION + "]*)+$"),
            A = 3,
            T = "[" + s.PLUS_CHARS + "]{0,1}[" + s.VALID_PUNCTUATION + s.VALID_DIGITS + "]*",
            I = new RegExp("^" + T + "$", "i"),
            P = function() {
                function d($, t) {
                    (0, a.default)(this, d), $ && t.countries[$] && (this.default_country = $), this.metadata = t, this.reset()
                }
                return (0, f.default)(d, [{
                    key: "input",
                    value: function(d) {
                        var $ = (0, s.extract_formatted_phone_number)(d);
                        return $ || d && d.indexOf("+") >= 0 && ($ = "+"), (0, h.matches_entirely)($, I) ? this.process_input((0, s.parse_phone_number)($)) : this.current_output
                    }
                }, {
                    key: "process_input",
                    value: function(d) {
                        if ("+" === d[0] && (this.parsed_input || (this.parsed_input += "+", this.reset_countriness()), d = d.slice(1)), this.parsed_input += d, this.valid = !1, this.national_number += d, this.is_international())
                            if (this.country_phone_code) this.country || this.determine_the_country();
                            else {
                                if (!this.extract_country_phone_code()) return this.parsed_input;
                                this.initialize_phone_number_formats_for_this_country_phone_code(), this.reset_format(), this.determine_the_country()
                            } else {
                            var $ = this.national_prefix;
                            this.national_number = this.national_prefix + this.national_number, this.extract_national_prefix(), this.national_prefix !== $ && (this.matching_formats = this.available_formats, this.reset_format())
                        }
                        var t = this.format_national_phone_number(d);
                        return t ? this.full_phone_number(t) : this.parsed_input
                    }
                }, {
                    key: "format_national_phone_number",
                    value: function(d) {
                        var $ = void 0;
                        this.chosen_format && ($ = this.format_next_national_number_digits(d));
                        var t = this.attempt_to_format_complete_phone_number();
                        return t ? (this.country && (this.valid = !0), t) : (this.match_formats_by_leading_digits(), this.choose_another_format() ? this.reformat_national_number() : $)
                    }
                }, {
                    key: "reset",
                    value: function() {
                        return this.parsed_input = "", this.current_output = "", this.national_prefix = "", this.national_number = "", this.reset_countriness(), this.reset_format(), this.valid = !1, this
                    }
                }, {
                    key: "reset_country",
                    value: function() {
                        this.default_country && !this.is_international() ? this.country = this.default_country : this.country = void 0
                    }
                }, {
                    key: "reset_countriness",
                    value: function() {
                        this.reset_country(), this.default_country && !this.is_international() ? (this.country_metadata = this.metadata.countries[this.default_country], this.country_phone_code = this.country_metadata.phone_code, this.initialize_phone_number_formats_for_this_country_phone_code()) : (this.country_metadata = void 0, this.country_phone_code = void 0, this.available_formats = [], this.matching_formats = this.available_formats)
                    }
                }, {
                    key: "reset_format",
                    value: function() {
                        this.chosen_format = void 0, this.template = void 0, this.partially_populated_template = void 0, this.last_match_position = -1
                    }
                }, {
                    key: "reformat_national_number",
                    value: function() {
                        return this.format_next_national_number_digits(this.national_number)
                    }
                }, {
                    key: "initialize_phone_number_formats_for_this_country_phone_code",
                    value: function() {
                        this.available_formats = (0, c.get_formats)(this.country_metadata).filter(function(d) {
                            return S.test((0, c.get_format_international_format)(d))
                        }).sort(function(d, $) {
                            return 0 === (0, c.get_format_leading_digits_patterns)(d).length && (0, c.get_format_leading_digits_patterns)($).length > 0 ? -1 : (0, c.get_format_leading_digits_patterns)(d).length > 0 && 0 === (0, c.get_format_leading_digits_patterns)($).length ? 1 : 0
                        }), this.matching_formats = this.available_formats
                    }
                }, {
                    key: "match_formats_by_leading_digits",
                    value: function() {
                        var d = this.national_number,
                            $ = d.length - A;
                        $ < 0 && ($ = 0), this.matching_formats = this.get_relevant_phone_number_formats().filter(function(t) {
                            var n = (0, c.get_format_leading_digits_patterns)(t).length;
                            if (0 === n) return !0;
                            var e = Math.min($, n - 1),
                                r = (0, c.get_format_leading_digits_patterns)(t)[e];
                            return new RegExp("^" + r).test(d)
                        })
                    }
                }, {
                    key: "get_relevant_phone_number_formats",
                    value: function() {
                        var d = this.national_number;
                        return d.length <= A ? this.available_formats : this.matching_formats
                    }
                }, {
                    key: "attempt_to_format_complete_phone_number",
                    value: function() {
                        var d = !0,
                            $ = !1,
                            t = void 0;
                        try {
                            for (var n, e = (0, o.default)(this.get_relevant_phone_number_formats()); !(d = (n = e.next()).done); d = !0) {
                                var r = n.value,
                                    l = new RegExp("^(?:" + (0, c.get_format_pattern)(r) + ")$");
                                if (l.test(this.national_number)) {
                                    if (this.validate_format(r)) {
                                        this.reset_format(), this.chosen_format = r;
                                        var u = (0, p.format_national_number_using_format)(this.national_number, r, this.is_international(), this.national_prefix.length > 0, this.country_metadata);
                                        if (this.create_formatting_template(r)) this.reformat_national_number();
                                        else {
                                            var i = this.full_phone_number(u);
                                            this.template = i.replace(/[\d\+]/g, b), this.partially_populated_template = i
                                        }
                                        return u
                                    }
                                } else if (this.national_prefix && (0, c.get_format_national_prefix_is_optional_when_formatting)(r, this.country_metadata)) {
                                    if (!l.test(this.national_prefix + this.national_number)) continue;
                                    this.national_number = this.national_prefix + this.national_number, this.national_prefix = ""
                                }
                            }
                        } catch (d) {
                            $ = !0, t = d
                        } finally {
                            try {
                                !d && e.return && e.return()
                            } finally {
                                if ($) throw t
                            }
                        }
                    }
                }, {
                    key: "full_phone_number",
                    value: function(d) {
                        return this.is_international() ? "+" + this.country_phone_code + " " + d : d
                    }
                }, {
                    key: "extract_country_phone_code",
                    value: function() {
                        if (this.national_number) {
                            var d = (0, s.parse_phone_number_and_country_phone_code)(this.parsed_input, this.metadata),
                                $ = d.country_phone_code,
                                t = d.number;
                            if ($) return this.country_phone_code = $, this.national_number = t, this.country_metadata = (0, c.get_metadata_by_country_phone_code)($, this.metadata)
                        }
                    }
                }, {
                    key: "extract_national_prefix",
                    value: function() {
                        if (this.national_prefix = "", this.country_metadata) {
                            var d = (0, c.get_national_prefix_for_parsing)(this.country_metadata);
                            if (d) {
                                var $ = this.national_number.match(new RegExp("^(?:" + d + ")"));
                                if ($ && $[0]) {
                                    var t = $[0].length;
                                    return this.national_prefix = this.national_number.slice(0, t), this.national_number = this.national_number.slice(t), this.national_prefix
                                }
                            }
                        }
                    }
                }, {
                    key: "choose_another_format",
                    value: function() {
                        var d = !0,
                            $ = !1,
                            t = void 0;
                        try {
                            for (var n, e = (0, o.default)(this.get_relevant_phone_number_formats()); !(d = (n = e.next()).done); d = !0) {
                                var r = n.value;
                                if (this.chosen_format === r) return;
                                if (this.validate_format(r) && this.create_formatting_template(r)) return this.chosen_format = r, this.last_match_position = -1, !0
                            }
                        } catch (d) {
                            $ = !0, t = d
                        } finally {
                            try {
                                !d && e.return && e.return()
                            } finally {
                                if ($) throw t
                            }
                        }
                        this.reset_country(), this.reset_format()
                    }
                }, {
                    key: "validate_format",
                    value: function(d) {
                        if (this.is_international() || this.national_prefix || !(0, c.get_format_national_prefix_is_mandatory_when_formatting)(d, this.country_metadata)) return !0
                    }
                }, {
                    key: "create_formatting_template",
                    value: function(d) {
                        if (!((0, c.get_format_pattern)(d).indexOf("|") >= 0)) {
                            var $ = ((0, c.get_format_national_prefix_formatting_rule)(d, this.country_metadata), (0, c.get_format_pattern)(d).replace(E, "\\d").replace(O, "\\d")),
                                t = g.match($)[0];
                            if (!(this.national_number.length > t.length)) {
                                var n = this.get_format_format(d);
                                if (this.national_prefix) {
                                    var e = (0, c.get_format_national_prefix_formatting_rule)(d, this.country_metadata);
                                    e && (n = n.replace(p.FIRST_GROUP_PATTERN, e))
                                }
                                var r = t.replace(new RegExp($, "g"), n).replace(y, b);
                                return this.partially_populated_template = r, r = this.is_international() ? b + l(b, this.country_phone_code.length) + " " + r : r.replace(/\d/g, b), this.template = r
                            }
                        }
                    }
                }, {
                    key: "format_next_national_number_digits",
                    value: function(d) {
                        var $ = !0,
                            t = !1,
                            n = void 0;
                        try {
                            for (var r, l = (0, o.default)(d); !($ = (r = l.next()).done); $ = !0) {
                                var u = r.value;
                                if (this.partially_populated_template.slice(this.last_match_position + 1).search(x) === -1) return this.chosen_format = void 0, this.template = void 0, void(this.partially_populated_template = void 0);
                                this.last_match_position = this.partially_populated_template.search(x), this.partially_populated_template = this.partially_populated_template.replace(x, u)
                            }
                        } catch (d) {
                            t = !0, n = d
                        } finally {
                            try {
                                !$ && l.return && l.return()
                            } finally {
                                if (t) throw n
                            }
                        }
                        return e(this.partially_populated_template, this.last_match_position + 1).replace(M, " ")
                    }
                }, {
                    key: "is_international",
                    value: function() {
                        return this.parsed_input && "+" === this.parsed_input[0]
                    }
                }, {
                    key: "get_format_format",
                    value: function(d) {
                        return this.is_international() ? (0, p.local_to_international_style)((0, c.get_format_international_format)(d)) : (0, c.get_format_format)(d)
                    }
                }, {
                    key: "determine_the_country",
                    value: function() {
                        this.country = (0, s.find_country_code)(this.country_phone_code, this.national_number, this.metadata)
                    }
                }]), d
            }();
        $.default = P
    }, function(d, $, t) {
        "use strict";

        function n(d) {
            return d && d.__esModule ? d : {
                default: d
            }
        }

        function e(d, $, t) {
            var n = void 0,
                e = void 0;
            if ("string" == typeof d ? "string" == typeof $ ? (e = t, n = (0, l.default)(d, $, e)) : (e = $, n = (0, l.default)(d, e)) : (n = d, e = $), !n) return !1;
            if (!n.country) return !1;
            var o = e.countries[n.country];
            return !((0, u.get_types)(o) && !(0, r.get_number_type)(n.phone, o))
        }
        Object.defineProperty($, "__esModule", {
            value: !0
        }), $.default = e;
        var r = t(5),
            l = n(r),
            u = t(6)
    }, function(d, $, t) {
        d.exports = {
            default: t(44),
            __esModule: !0
        }
    }, function(d, $, t) {
        d.exports = {
            default: t(43),
            __esModule: !0
        }
    }, function(d, $, t) {
        d.exports = {
            default: t(45),
            __esModule: !0
        }
    }, function(d, $, t) {
        "use strict";
        $.__esModule = !0, $.default = function(d, $) {
            if (!(d instanceof $)) throw new TypeError("Cannot call a class as a function")
        }
    }, function(d, $, t) {
        "use strict";

        function n(d) {
            return d && d.__esModule ? d : {
                default: d
            }
        }
        $.__esModule = !0;
        var e = t(38),
            r = n(e);
        $.default = function() {
            function d(d, $) {
                for (var t = 0; t < $.length; t++) {
                    var n = $[t];
                    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), (0, r.default)(d, n.key, n)
                }
            }
            return function($, t, n) {
                return t && d($.prototype, t), n && d($, n), $
            }
        }()
    }, function(d, $, t) {
        "use strict";

        function n(d) {
            return d && d.__esModule ? d : {
                default: d
            }
        }
        $.__esModule = !0;
        var e = t(37),
            r = n(e);
        $.default = r.default || function(d) {
            for (var $ = 1; $ < arguments.length; $++) {
                var t = arguments[$];
                for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (d[n] = t[n])
            }
            return d
        }
    }, function(d, $, t) {
        t(74), t(73), d.exports = t(68)
    }, function(d, $, t) {
        t(70), d.exports = t(0).Object.assign
    }, function(d, $, t) {
        t(71);
        var n = t(0).Object;
        d.exports = function(d, $) {
            return n.create(d, $)
        }
    }, function(d, $, t) {
        t(72);
        var n = t(0).Object;
        d.exports = function(d, $, t) {
            return n.defineProperty(d, $, t)
        }
    }, function(d, $) {
        d.exports = function(d) {
            if ("function" != typeof d) throw TypeError(d + " is not a function!");
            return d
        }
    }, function(d, $) {
        d.exports = function() {}
    }, function(d, $, t) {
        var n = t(20),
            e = t(65),
            r = t(64);
        d.exports = function(d) {
            return function($, t, l) {
                var u, o = n($),
                    i = e(o.length),
                    a = r(l, i);
                if (d && t != t) {
                    for (; i > a;)
                        if (u = o[a++], u != u) return !0
                } else
                    for (; i > a; a++)
                        if ((d || a in o) && o[a] === t) return d || a || 0; return !d && -1
            }
        }
    }, function(d, $, t) {
        var n = t(21),
            e = t(2)("toStringTag"),
            r = "Arguments" == n(function() {
                return arguments
            }()),
            l = function(d, $) {
                try {
                    return d[$]
                } catch (d) {}
            };
        d.exports = function(d) {
            var $, t, u;
            return void 0 === d ? "Undefined" : null === d ? "Null" : "string" == typeof(t = l($ = Object(d), e)) ? t : r ? n($) : "Object" == (u = n($)) && "function" == typeof $.callee ? "Arguments" : u
        }
    }, function(d, $, t) {
        var n = t(46);
        d.exports = function(d, $, t) {
            if (n(d), void 0 === $) return d;
            switch (t) {
                case 1:
                    return function(t) {
                        return d.call($, t)
                    };
                case 2:
                    return function(t, n) {
                        return d.call($, t, n)
                    };
                case 3:
                    return function(t, n, e) {
                        return d.call($, t, n, e)
                    }
            }
            return function() {
                return d.apply($, arguments)
            }
        }
    }, function(d, $, t) {
        d.exports = t(1).document && document.documentElement
    }, function(d, $, t) {
        d.exports = !t(3) && !t(16)(function() {
            return 7 != Object.defineProperty(t(22)("div"), "a", {
                get: function() {
                    return 7
                }
            }).a
        })
    }, function(d, $, t) {
        "use strict";
        var n = t(26),
            e = t(28),
            r = t(29),
            l = {};
        t(4)(l, t(2)("iterator"), function() {
            return this
        }), d.exports = function(d, $, t) {
            d.prototype = n(l, {
                next: e(1, t)
            }), r(d, $ + " Iterator")
        }
    }, function(d, $) {
        d.exports = function(d, $) {
            return {
                value: $,
                done: !!d
            }
        }
    }, function(d, $) {
        d.exports = !0
    }, function(d, $, t) {
        "use strict";
        var n = t(27),
            e = t(58),
            r = t(61),
            l = t(31),
            u = t(24),
            o = Object.assign;
        d.exports = !o || t(16)(function() {
            var d = {},
                $ = {},
                t = Symbol(),
                n = "abcdefghijklmnopqrst";
            return d[t] = 7, n.split("").forEach(function(d) {
                $[d] = d
            }), 7 != o({}, d)[t] || Object.keys(o({}, $)).join("") != n
        }) ? function(d, $) {
            for (var t = l(d), o = arguments.length, i = 1, a = e.f, _ = r.f; o > i;)
                for (var f, c = u(arguments[i++]), s = a ? n(c).concat(a(c)) : n(c), p = s.length, h = 0; p > h;) _.call(c, f = s[h++]) && (t[f] = c[f]);
            return t
        } : o
    }, function(d, $, t) {
        var n = t(11),
            e = t(7),
            r = t(27);
        d.exports = t(3) ? Object.defineProperties : function(d, $) {
            e(d);
            for (var t, l = r($), u = l.length, o = 0; u > o;) n.f(d, t = l[o++], $[t]);
            return d
        }
    }, function(d, $) {
        $.f = Object.getOwnPropertySymbols
    }, function(d, $, t) {
        var n = t(9),
            e = t(31),
            r = t(18)("IE_PROTO"),
            l = Object.prototype;
        d.exports = Object.getPrototypeOf || function(d) {
            return d = e(d), n(d, r) ? d[r] : "function" == typeof d.constructor && d instanceof d.constructor ? d.constructor.prototype : d instanceof Object ? l : null
        }
    }, function(d, $, t) {
        var n = t(9),
            e = t(20),
            r = t(48)(!1),
            l = t(18)("IE_PROTO");
        d.exports = function(d, $) {
            var t, u = e(d),
                o = 0,
                i = [];
            for (t in u) t != l && n(u, t) && i.push(t);
            for (; $.length > o;) n(u, t = $[o++]) && (~r(i, t) || i.push(t));
            return i
        }
    }, function(d, $) {
        $.f = {}.propertyIsEnumerable
    }, function(d, $, t) {
        d.exports = t(4)
    }, function(d, $, t) {
        var n = t(19),
            e = t(15);
        d.exports = function(d) {
            return function($, t) {
                var r, l, u = String(e($)),
                    o = n(t),
                    i = u.length;
                return o < 0 || o >= i ? d ? "" : void 0 : (r = u.charCodeAt(o), r < 55296 || r > 56319 || o + 1 === i || (l = u.charCodeAt(o + 1)) < 56320 || l > 57343 ? d ? u.charAt(o) : r : d ? u.slice(o, o + 2) : (r - 55296 << 10) + (l - 56320) + 65536)
            }
        }
    }, function(d, $, t) {
        var n = t(19),
            e = Math.max,
            r = Math.min;
        d.exports = function(d, $) {
            return d = n(d), d < 0 ? e(d + $, 0) : r(d, $)
        }
    }, function(d, $, t) {
        var n = t(19),
            e = Math.min;
        d.exports = function(d) {
            return d > 0 ? e(n(d), 9007199254740991) : 0
        }
    }, function(d, $, t) {
        var n = t(17);
        d.exports = function(d, $) {
            if (!n(d)) return d;
            var t, e;
            if ($ && "function" == typeof(t = d.toString) && !n(e = t.call(d))) return e;
            if ("function" == typeof(t = d.valueOf) && !n(e = t.call(d))) return e;
            if (!$ && "function" == typeof(t = d.toString) && !n(e = t.call(d))) return e;
            throw TypeError("Can't convert object to primitive value")
        }
    }, function(d, $, t) {
        var n = t(49),
            e = t(2)("iterator"),
            r = t(10);
        d.exports = t(0).getIteratorMethod = function(d) {
            if (void 0 != d) return d[e] || d["@@iterator"] || r[n(d)]
        }
    }, function(d, $, t) {
        var n = t(7),
            e = t(67);
        d.exports = t(0).getIterator = function(d) {
            var $ = e(d);
            if ("function" != typeof $) throw TypeError(d + " is not iterable!");
            return n($.call(d))
        }
    }, function(d, $, t) {
        "use strict";
        var n = t(47),
            e = t(54),
            r = t(10),
            l = t(20);
        d.exports = t(25)(Array, "Array", function(d, $) {
            this._t = l(d), this._i = 0, this._k = $
        }, function() {
            var d = this._t,
                $ = this._k,
                t = this._i++;
            return !d || t >= d.length ? (this._t = void 0, e(1)) : "keys" == $ ? e(0, t) : "values" == $ ? e(0, d[t]) : e(0, [t, d[t]])
        }, "values"), r.Arguments = r.Array, n("keys"), n("values"), n("entries")
    }, function(d, $, t) {
        var n = t(8);
        n(n.S + n.F, "Object", {
            assign: t(56)
        })
    }, function(d, $, t) {
        var n = t(8);
        n(n.S, "Object", {
            create: t(26)
        })
    }, function(d, $, t) {
        var n = t(8);
        n(n.S + n.F * !t(3), "Object", {
            defineProperty: t(11).f
        })
    }, function(d, $, t) {
        "use strict";
        var n = t(63)(!0);
        t(25)(String, "String", function(d) {
            this._t = String(d), this._i = 0
        }, function() {
            var d, $ = this._t,
                t = this._i;
            return t >= $.length ? {
                value: void 0,
                done: !0
            } : (d = n($, t), this._i += d.length, {
                value: d,
                done: !1
            })
        })
    }, function(d, $, t) {
        t(69);
        for (var n = t(1), e = t(4), r = t(10), l = t(2)("toStringTag"), u = ["NodeList", "DOMTokenList", "MediaList", "StyleSheetList", "CSSRuleList"], o = 0; o < 5; o++) {
            var i = u[o],
                a = n[i],
                _ = a && a.prototype;
            _ && !_[l] && e(_, l, i), r[i] = r.Array
        }
    }, function(d, $, t) {
        "use strict";

        function n(d) {
            return d && d.__esModule ? d : {
                default: d
            }
        }

        function e() {
            var d = Array.prototype.slice.call(arguments);
            return d.push(m.default), y.default.apply(this, d)
        }

        function r() {
            var d = Array.prototype.slice.call(arguments);
            return d.push(m.default), v.default.apply(this, d)
        }

        function l() {
            var d = Array.prototype.slice.call(arguments);
            return d.push(m.default), g.default.apply(this, d)
        }

        function u() {
            return l.apply(this, arguments)
        }

        function o(d) {
            b.default.call(this, d, m.default)
        }

        function i(d) {
            b.default.call(this, d, m.default)
        }
        Object.defineProperty($, "__esModule", {
            value: !0
        }), $.DIGIT_PLACEHOLDER = $.asYouTypeCustom = $.isValidNumberCustom = $.formatCustom = $.parseCustom = void 0;
        var a = t(36),
            _ = n(a);
        $.parse = e, $.format = r, $.is_valid_number = l, $.isValidNumber = u, $.as_you_type = o, $.asYouType = i;
        var f = t(5);
        Object.defineProperty($, "parseCustom", {
            enumerable: !0,
            get: function() {
                return n(f).default
            }
        });
        var c = t(12);
        Object.defineProperty($, "formatCustom", {
            enumerable: !0,
            get: function() {
                return n(c).default
            }
        });
        var s = t(35);
        Object.defineProperty($, "isValidNumberCustom", {
            enumerable: !0,
            get: function() {
                return n(s).default
            }
        });
        var p = t(34);
        Object.defineProperty($, "asYouTypeCustom", {
            enumerable: !0,
            get: function() {
                return n(p).default
            }
        }), Object.defineProperty($, "DIGIT_PLACEHOLDER", {
            enumerable: !0,
            get: function() {
                return p.DIGIT_PLACEHOLDER
            }
        });
        var h = t(33),
            m = n(h),
            y = n(f),
            v = n(c),
            g = n(s),
            b = n(p);
        o.prototype = (0, _.default)(b.default.prototype, {}), o.prototype.constructor = o, i.prototype = (0, _.default)(b.default.prototype, {}), i.prototype.constructor = i
    }])
});