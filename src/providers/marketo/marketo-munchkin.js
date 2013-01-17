/*
 * Copyright (c) 2007-2012, Marketo, Inc. All rights reserved.
 * Marketo marketing automation web activity tracking script
 *
 * $Id: munchkin.js 44633 2012-08-17 23:47:19Z dj $
 * $Rev: 44633 $
 */
var Munchkin = {
    ASSOCIATE_LEAD: "associateLead",
    CLICK_LINK: "clickLink",
    VISIT_WEB_PAGE: "visitWebPage",
    init: function (a, b) {
        if (_MchHlpr.Cookie.enabled() && !(a == null || a.length == 0)) {
            _MchHlpr.discoverClientLibrary();
            _MchSingle.id = a;
            var c = document.location;
            _MchSingle.notifyPrefix = c.protocol + "//" + _MchSingle.id + ".mktoresp.com/";
            if (_MchHlpr.isDefined(b)) {
                if (_MchHlpr.isDefined(b.customName)) _MchSingle.customName = b.customName;
                if (_MchHlpr.isDefined(b.notifyPrefix)) _MchSingle.notifyPrefix = b.notifyPrefix;
                if (_MchHlpr.isDefined(b.wsInfo)) _MchSingle.wsInfo = b.wsInfo;
                if (_MchHlpr.isDefined(b.altIds)) _MchSingle.altIds = b.altIds;
                if (_MchHlpr.isDefined(b.visitorToken)) _MchSingle.visitorToken = b.visitorToken;
                if (_MchHlpr.isDefined(b.cookieLifeDays)) _MchSingle.cookieLifeDays = b.cookieLifeDays;
                if (_MchHlpr.isDefined(b.clickTime)) _MchSingle.clickTime = b.clickTime;
                if (_MchHlpr.isDefined(b.cookieAnon)) _MchSingle.cookieAnon = b.cookieAnon;
                if (_MchHlpr.isDefined(b.mkt_tok)) _MchSingle.override = b.mkt_tok;
                if (_MchHlpr.isDefined(b.domainLevel)) _MchSingle.domainLevel = b.domainLevel
            }
            var d =
                "",
                e = window.location.search;
            if (e != null && e.length > 0) for (var e = e.substr(1).split("&"), f = 0; f < e.length; f++) {
                var g = e[f].split("=");
                switch (g[0]) {
                    case "mkt_tok":
                        _MchSingle.override = _MchHlpr.decodeURIComponentSafe(g[1]);
                        break;
                    case "lpview":
                        d = g[1];
                        break;
                    case "mkt_dbg":
                        _MchSingle.debug = g[1] == 1
                }
            }
            if (!(d == "preview" && /\/lpeditor\/preview$/.test(c.pathname))) {
                _MchSingle.capable = true;
                try {
                    _MchHlpr.$(document).ready(function () {
                        _MchSingle.initialize()
                    })
                } catch (h) {}
            }
        }
    },
    munchkinFunction: function (a, b, c) {
        var d = {};
        if (c != null) d._mchKy = c;
        switch (a) {
            case Munchkin.ASSOCIATE_LEAD:
                for (var e in b) d["_mchAt" + e] = b[e];
                _MchSingle.createTrackingCookie(true);
                _MchSingle.post("webevents/associateLead", d);
                break;
            case Munchkin.CLICK_LINK:
                if (b.href != null) d._mchHr = d._mchLr = _MchHlpr.decodeURIComponentSafe(b.href);
                _MchSingle.post("webevents/clickLink", d, {
                    _mchCn: _MchSingle.customName != null ? _MchSingle.customName : ""
                }, 0);
                break;
            case Munchkin.VISIT_WEB_PAGE:
                if (b.url != null) d._mchRu = _MchHlpr.decodeURIComponentSafe(b.url);
                if (b.params != null) d._mchQp = _MchHlpr.decodeURIComponentSafe(b.params.replace(/&/g, "__-__"));
                if (b.name != null) d._mchCn = b.name;
                _MchSingle.post("webevents/visitWebPage", d, {
                    _mchRe: _MchHlpr.decodeURIComponentSafe(document.location.href)
                }, 0)
        }
    },
    createTrackingCookie: function (a) {
        _MchSingle.createTrackingCookie(a)
    },
    debug: function (a, b) {
        var c = {
            _mchId: _MchSingle.Cookie.id,
            _mchTk: _MchSingle.Cookie.token,
            _mchMsg: _MchSingle.debugSeq++,
            _mchUa: navigator.userAgent
        };
        if (_MchSingle.override != null) c.mkt_tok = _MchSingle.override;
        a != null && (c._mchMsg +=
            " - " + a);
        if (b != null) {
            var d = _MchHlpr.$("#" + b);
            if (d.length > 0) c._mchScr = d.html()
        }
        c._mchVr = _MchSingle.VERSION;
        d = _MchSingle.notifyPrefix + "webevents/debug";
        d += "?_mchNc=" + (new Date).getTime() + "&" + _MchHlpr.$.param(c);
        c = new Image(1, 1);
        c.onload = function () {};
        c.src = d
    }
};
mktoMunchkin = Munchkin.init;
mktoMunchkinDebug = Munchkin.debug;
mktoMunchkinFunction = Munchkin.munchkinFunction;
var _MchSingle = {
    capable: false,
    inited: false,
    id: null,
    altIds: null,
    cookie: null,
    customName: null,
    override: null,
    wsInfo: null,
    visitorToken: null,
    cookieLifeDays: 730,
    clickTime: 250,
    cookieAnon: true,
    debug: false,
    debugSeq: 1,
    defQ: [],
    domainLevel: null,
    VERSION: "134",
    LINK_SELECTOR: 'a[href]:not([href^="#"],[href=],[class~="mchNoDecorate"],[href^="javascript"],[href^="mailto"]),area[href]:not([href^="#"],[href=],[class~="mchNoDecorate"],[href^="javascript"],[href^="mailto"])',
    initialize: function () {
        if (this.capable) {
            if (!this.inited) {
                this.inited = true;
                for (var a = this.createTrackingCookie(this.override != null); this.defQ.length > 0;) {
                    var b = this.defQ.shift();
                    switch (b[0]) {
                        case "createTrackingCookie":
                            a = this.createTrackingCookie(b[1]);
                            break;
                        case "post":
                            this.post(b[1], b[2], _MchHlpr.isDefined(b[3]) ? b[3] : null, _MchHlpr.isDefined(b[4]) ? b[4] : null, _MchHlpr.isDefined(b[5]) ? b[5] : null)
                    }
                }
                if (a != null) a = document.location, this.post("webevents/visitWebPage", {
                    _mchCn: this.customName != null ? this.customName : ""
                }, {
                    _mchHa: _MchHlpr.decodeURIComponentSafe(a.hash),
                    _mchRe: _MchHlpr.decodeURIComponentSafe(document.referrer),
                    _mchQp: _MchHlpr.decodeURIComponentSafe(a.search.substr(1).replace(/&/g, "__-__"))
                }, 0)
            }
        } else _MchHlpr.updateLpForm("")
    },
    createTrackingCookie: function (a) {
        if (this.inited) {
            if (this.cookie != null) return this.cookie;
            this.domain = _MchHlpr.getDomain(document.location.hostname, this.domainLevel);
            var b = new _MchHlpr.Cookie("_mkto_trk");
            if (b.id != null && b.id != this.id) b.token = null;
            if (_MchHlpr.isDefined(b.id) || this.cookieAnon || a) {
                b.id = this.id;
                if (b.token == null) b.token = this.visitorToken != null && this.visitorToken != "VISITOR_MKTTOK_REPLACE" ? this.visitorToken : _MchHlpr.generateToken(this.domain);
                b.store(this.cookieLifeDays, "/", this.domain, false);
                _MchHlpr.updateLpForm("id:" + b.id + "&token:" + b.token);
                this.instrumentLinks();
                return this.cookie = b
            } else return null
        } else this.defQ.push(["createTrackingCookie", a])
    },
    post: function (a, b, c, d, e) {
        if (this.inited) if (this.cookie != null) {
            var f = document.location;
            b._mchId = this.cookie.id;
            b._mchTk = this.cookie.token;
            if (this.override != null) b.mkt_tok = this.override;
            if (this.wsInfo != null) b._mchWs = this.wsInfo;
            b._mchHo = f.hostname;
            b._mchPo = f.port;
            if (b._mchRu == null) b._mchRu = _MchHlpr.decodeURIComponentSafe(f.pathname);
            b._mchPc = f.protocol;
            if (c != null) for (var g in c) b[g] = c[g];
            b._mchVr = this.VERSION;
            if (b._mchHo == null || b._mchHo.length == 0 || b._mchPc == "file:") this.debug && alert("Ignoring munchkin post: " + a);
            else {
                a += "?_mchNc=" + (new Date).getTime();
                _MchHlpr.doImageGet(this.notifyPrefix, a, b, d, e);
                for (var h in this.altIds) c = this.altIds[h], b._mchId = c, _MchHlpr.doImageGet(this.notifyPrefix.replace(/\w{3}\-\w{3}\-\w{3}\.mktoresp\.com/i,
                c + ".mktoresp.com"), a, b, d)
            }
        } else this.debug && alert("Cannot post without cookie");
        else this.defQ.push(["post", a, b, c, d, e])
    },
    findEventTgtLink: function (a) {
        for (; a.tagName != "A" && a.tagName != "AREA" && a.parentNode != null;) a = a.parentNode;
        return a.tagName == "A" || a.tagName == "AREA" ? a : null
    },
    addEventListenerRepost: function (a, b) {
        return function () {
            if (_MchHlpr.isUndefined(b._mchInRepost)) b._mchInRepost = true, a.dispatchEvent(b)
        }
    },
    addEventListenerDelay: function (a) {
        var b = a.target ? a.target : a.srcElement;
        if (a._mchInRepost) return true;
        if (typeof a.button !== "undefined" && a.button !== 0) return true;
        var c = _MchSingle.findEventTgtLink(b);
        if (c == null) return true;
        if (!_MchHlpr.$(c).is(_MchSingle.LINK_SELECTOR)) return true;
        var d = false,
            e = _MchHlpr.$(c).data("events"),
            e = _MchHlpr.isDefined(e) && _MchHlpr.isDefined(e.click) && e.click.length > 0,
            f = c.target == "" || c.target == "_self" || c.target == "_top" || c.target == "_parent";
        !a.ctrlKey && !e && f && (d = true);
        var g;
        d && (g = document.createEvent("MouseEvents"), g.initMouseEvent("click", a.bubbles, a.cancelable, a.view, a.detail,
        a.screenX, a.screenY, a.clientX, a.clientY, a.ctrlKey, a.altKey, a.shiftKey, a.metaKey, a.button, a.relatedTarget), g = _MchSingle.addEventListenerRepost(b, g), a.preventDefault(), a.stopPropagation());
        _MchSingle.post("webevents/clickLink", {
            _mchCn: _MchSingle.customName != null ? _MchSingle.customName : "",
            _mchHr: _MchHlpr.decodeURIComponentSafe(c.href)
        }, null, 0, g);
        return d ? (setTimeout(g, _MchSingle.clickTime), false) : true
    },
    instrumentLinks: function () {
        var a = _MchHlpr.$.browser,
            b = a.version.indexOf("."),
            c = b != -1 ? a.version.substr(0,
            b) : a.version,
            b = _MchHlpr.isDefined(a.mozilla) && a.mozilla && c < 6,
            a = _MchHlpr.isDefined(a.msie) && a.msie && c < 9;
        b || a ? _MchHlpr.$(_MchSingle.LINK_SELECTOR).live("mouseup", function () {
            this.href != null && this.href.length > 0 && !/^mailto:/.test(this.href) && _MchSingle.post("webevents/clickLink", {
                _mchCn: _MchSingle.customName != null ? _MchSingle.customName : "",
                _mchHr: _MchHlpr.decodeURIComponentSafe(this.href)
            }, null, 100);
            return true
        }) : document.addEventListener && document.addEventListener("click", function (a) {
            return _MchSingle.addEventListenerDelay(a)
        },
        true)
    }
}, _MchHlpr = {
    $: null,
    jQueryPriv: false,
    clientLib: null,
    clientLibMajorVer: 0,
    clientLibMinorVer: 0,
    clientLibPatchVer: 0,
    clientLibRevisionVer: 0,
    CLIENT_NONE: 0,
    CLIENT_JQUERY: 1,
    discoverClientLibrary: function () {
        if (this.clientLib != null) return this.clientLib;
        if (!this.jQueryPriv) try {
            return this.parseVersion(jQuery.fn.jquery), this.clientLib = this.CLIENT_JQUERY
        } catch (a) {}
        return this.clientLib = this.CLIENT_NONE
    },
    parseVersion: function (a) {
        if (this.isDefined(a)) {
            if (a = /^([0-9])\.([0-9])\.?([0-9])?\.?([0-9])?$/.exec(a),
            a != null) {
                this.clientLibMajorVer = a[1];
                this.clientLibMinorVer = a[2];
                if (this.isDefined(a[3])) this.clientLibPatchVer = a[3];
                if (this.isDefined(a[4])) this.clientLibRevisionVer = a[4]
            }
        } else throw "Invalid version";
    },
    doImageGet: function (a, b, c, d, e) {
        var b = a + b + "&" + this.$.param(c),
            f = false,
            a = new Image(1, 1);
        a.onload = function () {
            f = true;
            _MchHlpr.isDefined(e) && e()
        };
        a.src = b;
        if (d > 0) for (b = (new Date).getTime(); !f;) if ((new Date).getTime() - b > d) break
    },
    loadAsync: function (a, b) {
        var c = document.createElement("script");
        c.type = "text/javascript";
        c.async = true;
        c.src = a;
        var d = false,
            e = function () {
                d === false && (d = true, b())
            };
        if (b) c.onreadystatechange = function () {
            (this.readyState == "complete" || this.readyState == "loaded") && e()
        }, c.onload = e;
        document.getElementsByTagName("head")[0].appendChild(c)
    },
    updateLpForm: function (a) {
        this.$("input[type=hidden][name=_mkt_trk]").attr("value", a)
    },
    getDomain: function (a, b) {
        if (b != null && b === parseInt(b)) {
            for (var c = a.split("."); c.length > b && c.length > 2;) c.shift();
            return c.join(".")
        }
        c = /([^.]+\.[^.]{3,})$/i.exec(a);
        return c != null ? c[1] : (c = /([^.]+\.[^.]+\.[^.]{2})$/i.exec(a), c != null ? c[1] : a)
    },
    rand: function (a, b) {
        return b ? Math.floor(Math.random() * (b - a + 1)) + a : Math.floor(Math.random() * (a + 1))
    },
    generateToken: function (a) {
        return "_mch-" + a + "-" + (new Date).getTime() + "-" + this.rand(1E4, 99999)
    },
    isUndefined: function (a) {
        return typeof a == "undefined"
    },
    isDefined: function (a) {
        return typeof a != "undefined" && a != null
    },
    noOp: function () {},
    decodeURIComponentSafe: function (a) {
        if (a == null) return null;
        else if (a.length == 0) return "";
        else try {
            return decodeURIComponent(a)
        } catch (b) {
            var c = a.indexOf("?");
            if (c != -1) try {
                return decodeURIComponent(a.substr(0, c)) + a.substr(c)
            } catch (d) {}
            return String(a)
        }
    }
};
_MchHlpr.Cookie = function (a) {
    this.$name = a;
    var b = document.cookie;
    if (b != "") {
        for (var c = b.split(";"), d = null, b = 0; b < c.length; b++) {
            var e = c[b].replace(/^\s+/, "");
            if (e.substring(0, a.length + 1) == a + "=") {
                d = e;
                break
            }
        }
        if (d != null) {
            a = d.substring(a.length + 1).split("&");
            for (b = 0; b < a.length; b++) a[b] = a[b].split(":");
            for (b = 0; b < a.length; b++) this[a[b][0]] = _MchHlpr.decodeURIComponentSafe(a[b][1])
        }
    }
};
_MchHlpr.Cookie.prototype.store = function (a, b, c, d) {
    var e = "",
        f;
    for (f in this) if (!(f.charAt(0) == "$" || typeof this[f] == "function")) {
        e != "" && (e += "&");
        var g = encodeURIComponent(this[f]);
        e += f + ":" + g
    }
    e = this.$name + "=" + e;
    a > 0 && (f = new Date, f.setTime(f.getTime() + a * 864E5), e += "; expires=" + f.toGMTString());
    b && (e += "; path=" + b);
    c && c.indexOf(".") != -1 && (e += "; domain=" + c);
    d && (e += "; secure");
    document.cookie = e
};
_MchHlpr.Cookie.enabled = function () {
    if (navigator.cookieEnabled != void 0) return navigator.cookieEnabled;
    if (this.Cookie.enabled.cache != void 0) return this.Cookie.enabled.cache;
    document.cookie = "testcookie=test; max-age=10000";
    return document.cookie.indexOf("testcookie=test") == -1 ? this.Cookie.enabled.cache = false : (document.cookie = "testcookie=test; max-age=0", this.Cookie.enabled.cache = true)
};
(function () {
    try {
        if (_MchHlpr.discoverClientLibrary() == _MchHlpr.CLIENT_JQUERY && (_MchHlpr.clientLibMajorVer == 1 && _MchHlpr.clientLibMinorVer >= 3 || _MchHlpr.clientLibMajorVer > 1)) _MchHlpr.$ = jQuery;
        else throw "Invalid jQuery version";
    } catch (a) {
        _MchHlpr.loadAsync(document.location.protocol + "//munchkin.marketo.net/jquery-latest.min.js", function () {
            _MchHlpr.$ = jQuery.noConflict(true);
            _MchHlpr.jQueryPriv = true;
            _MchHlpr.$(document).ready(function () {
                _MchSingle.initialize()
            })
        })
    }
})();