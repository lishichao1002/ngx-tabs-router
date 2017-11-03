(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a)return a(o, !0);
                if (i)return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f
            }
            var l = n[o] = {exports: {}};
            t[o][0].call(l.exports, function (e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, l, l.exports, e, t, n, r)
        }
        return n[o].exports
    }

    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++)s(r[o]);
    return s
})({
    1: [function (require, module, exports) {
        "use strict";
        function escape(e) {
            return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;")
        }

        function hide(e) {
            for (var t = document.querySelectorAll(e), n = 0; n < t.length; n++)t[n].style.display = "none"
        }

        function show(e) {
            for (var t = document.querySelectorAll(e), n = 0; n < t.length; n++)t[n].style.display = null
        }

        function update() {
            keys = [], regexp = pathRegexp(_("#inputRoute").value, keys), _("#regexp-display").textContent = regexp.toString(), _("#keys-display").innerHTML = keys.length ? "<ol>" + keys.map(function (e) {
                    return "<li>" + escape(e.name) + (e.optional ? " (optional)" : "") + "</li>"
                }).join("") + "</ol>" : "There are no keys captured by this route", updatePath()
        }

        function updatePath() {
            var e = _("#inputPath").value;
            if (regexp.test(e)) {
                hide(".is-not-match"), show(".is-match");
                var t = regexp.exec(e);
                _("#keys-results-display").innerHTML = '<dl class="dl-horizontal">' + keys.map(function (e, n) {
                        return "<dt>" + escape(e.name) + "</dt><dd>" + (t[n + 1] ? escape(t[n + 1]) : "&nbsp;") + "</dd>"
                    }).join("") + "</dl>"
            } else show(".is-not-match"), hide(".is-match")
        }

        var pathRegexp = require("path-to-regexp"), debounce = require("debounce"),
            _ = document.querySelector.bind(document);
        _("#inputRoute").addEventListener("input", debounce(update, 100), !1), _("#inputPath").addEventListener("input", debounce(updatePath, 100), !1);
        var keys, regexp;
        update();
    }, {"debounce": 2, "path-to-regexp": 4}], 2: [function (require, module, exports) {
        var now = require("date-now");
        module.exports = function (n, u, t) {
            function e() {
                var p = now() - a;
                u > p && p > 0 ? r = setTimeout(e, u - p) : (r = null, t || (i = n.apply(o, l), r || (o = l = null)))
            }

            var r, l, o, a, i;
            return null == u && (u = 100), function () {
                o = this, l = arguments, a = now();
                var p = t && !r;
                return r || (r = setTimeout(e, u)), p && (i = n.apply(o, l), o = l = null), i
            }
        };
    }, {"date-now": 3}], 3: [function (require, module, exports) {
        function now() {
            return (new Date).getTime()
        }

        module.exports = Date.now || now;
    }, {}], 4: [function (require, module, exports) {
        function escapeGroup(e) {
            return e.replace(/([=!:$\/()])/g, "\\$1")
        }

        function attachKeys(e, r) {
            return e.keys = r, e
        }

        function flags(e) {
            return e.sensitive ? "" : "i"
        }

        function regexpToRegexp(e, r) {
            var a = e.source.match(/\((?!\?)/g);
            if (a)for (var t = 0; t < a.length; t++)r.push({name: t, delimiter: null, optional: !1, repeat: !1});
            return attachKeys(e, r)
        }

        function arrayToRegexp(e, r, a) {
            for (var t = [], n = 0; n < e.length; n++)t.push(pathToRegexp(e[n], r, a).source);
            var i = new RegExp("(?:" + t.join("|") + ")", flags(a));
            return attachKeys(i, r)
        }

        function replacePath(e, r) {
            function a(e, a, n, i, p, o, u, c) {
                if (a)return a;
                if (c)return "\\" + c;
                var s = "+" === u || "*" === u, g = "?" === u || "*" === u;
                return r.push({
                    name: i || t++,
                    delimiter: n || "/",
                    optional: g,
                    repeat: s
                }), n = n ? "\\" + n : "", p = escapeGroup(p || o || "[^" + (n || "\\/") + "]+?"), s && (p = p + "(?:" + n + p + ")*"), g ? "(?:" + n + "(" + p + "))?" : n + "(" + p + ")"
            }

            var t = 0;
            return e.replace(PATH_REGEXP, a)
        }

        function pathToRegexp(e, r, a) {
            if (r = r || [], isArray(r) ? a || (a = {}) : (a = r, r = []), e instanceof RegExp)return regexpToRegexp(e, r, a);
            if (isArray(e))return arrayToRegexp(e, r, a);
            var t = a.strict, n = a.end !== !1, i = replacePath(e, r), p = "/" === e.charAt(e.length - 1);
            return t || (i = (p ? i.slice(0, -2) : i) + "(?:\\/(?=$))?"), i += n ? "$" : t && p ? "" : "(?=\\/|$)", attachKeys(new RegExp("^" + i, flags(a)), r)
        }

        var isArray = require("isarray");
        module.exports = pathToRegexp;
        var PATH_REGEXP = new RegExp(["(\\\\.)", "([\\/.])?(?:\\:(\\w+)(?:\\(((?:\\\\.|[^)])*)\\))?|\\(((?:\\\\.|[^)])*)\\))([+*?])?", "([.+*?=^!:${}()[\\]|\\/])"].join("|"), "g");
    }, {"isarray": 5}], 5: [function (require, module, exports) {
        module.exports = Array.isArray || function (r) {
                return "[object Array]" == Object.prototype.toString.call(r)
            };
    }, {}]
}, {}, [1])


//# sourceMappingURL=build.js.map