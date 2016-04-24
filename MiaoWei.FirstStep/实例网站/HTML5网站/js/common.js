function view(t) {
    return {
        w: (t || document.documentElement).clientWidth,
        h: (t || document.documentElement).clientHeight
    }
}
function getByClass(t, e, n) {
    for (var r = t.getElementsByTagName(e), i = [], o = new RegExp("(^|\\s)" + n + "(\\s|$)", "i"), a = 0; a < r.length; a++) o.test(r[a].className) && i.push(r[a]);
    return i
}
function getStyle(t, e) {
    return t.currentStyle ? t.currentStyle[e] || 0 : getComputedStyle(t, !1)[e] || 0
}
function startMove(t, e, n, r, i) {
    function o() {
        return (new Date).getTime()
    }
    "undefined" == typeof n && (n = 400, fx = "linear"),
	"string" == typeof n ? ("function" == typeof fx && (i = fx), fx = n, n = 400) : "function" == typeof n ? (i = n, n = 400, fx = "linear") : "number" == typeof n && ("function" == typeof fx ? (i = fx, fx = "linear") : "undefined" == typeof fx && (fx = "linear"));
    var a = {},
	u = o();
    for (var f in e) a[f] = 0,
	a[f] = "opacity" == f ? Math.round(100 * getStyle(t, f)) : parseInt(getStyle(t, f));
    clearInterval(t.timer),
	t.timer = setInterval(function () {
	    var f = o(),
		c = 1 - Math.max(0, u - f + n) / n;
	    for (var l in e) {
	        var s = Tween[r](c * n, a[l], e[l] - a[l], n);
	        "opacity" == l ? (t.style.filter = "alpha(oapcity=" + s + ")", t.style.opacity = s / 100) : t.style[l] = s + "px"
	    }
	    1 == c && (clearInterval(t.timer), i && i.call(t))
	},
	13)
}
function elasticMotion(t, e, n) {
    var r = 0;
    clearInterval(t.timer),
	t.timer = setInterval(function () {
	    r += (e - t.offsetLeft) / 5,
		r *= .7,
		Math.abs(r) <= 1 && Math.abs(e - t.offsetLeft) <= 1 ? (clearInterval(t.timer), t.style.left = e + "px", n.style.left = -e + "px", r = 0) : (t.style.left = t.offsetLeft + r + "px", n.style.left = -t.offsetLeft + "px")
	},
	30)
}
function elasticCross(t, e, n, r) {
    t.timer = null,
	t.iTarget = 0;
    for (var i = 0; i < t.length; i++) t[i].onmouseover = function () {
        clearTimeout(t.timer),
		elasticMotion(e, this.offsetLeft, n)
    },
	t[i].onmouseout = function () {
	    t.timer = setTimeout(function () {
	        elasticMotion(e, t.iTarget, n)
	    },
		100)
	};
    if (e.onmouseover = function () {
		clearTimeout(t.timer)
    },
	e.onmouseout = function () {
		t.timer = setTimeout(function () {
			elasticMotion(e, t.iTarget, n)
    },
		100)
    },
	r) for (var i = 0; i < r.length; i++) r[i].index = i,
	myAddEvent(r[i], "click",
	function () {
	    t.iTarget = 84 * this.index
	})
}
function addWheel(t, e, n) {
    function r(t) {
        var t = t || window.event,
		r = !0;
        return r = t.wheelDelta ? t.wheelDelta > 0 ? !0 : !1 : t.detail < 0 ? !0 : !1,
		r ? e && e() : n && n(),
		t.preventDefault && t.preventDefault(),
		!1
    }
    t.onmousewheel = r,
	t.addEventListener && t.addEventListener("DOMMouseScroll", r, !1)
}
function myAddEvent(t, e, n) {
    t.attachEvent ? t.attachEvent("on" + e,
	function () {
	    n.call(t)
	}) : t.addEventListener(e, n, !1)
}
function getCookie(t) {
    for (var e = document.cookie.split("; "), n = 0; n < e.length; n++) {
        var r = e[n].split("=");
        if (r[0] == t) return r[1]
    }
}
function setCookie(t, e, n) {
    var r = new Date;
    r.setDate(r.getDate() + n),
	document.cookie = t + "=" + e + ";expires=" + r.toGMTString()
}
var Tween = {
    linear: function (t, e, n, r) {
        return n * t / r + e
    },
    easeIn: function (t, e, n, r) {
        return n * (t /= r) * t + e
    },
    easeOut: function (t, e, n, r) {
        return -n * (t /= r) * (t - 2) + e
    },
    easeBoth: function (t, e, n, r) {
        return (t /= r / 2) < 1 ? n / 2 * t * t + e : -n / 2 * (--t * (t - 2) - 1) + e
    },
    easeInStrong: function (t, e, n, r) {
        return n * (t /= r) * t * t * t + e
    },
    easeOutStrong: function (t, e, n, r) {
        return -n * ((t = t / r - 1) * t * t * t - 1) + e
    },
    easeBothStrong: function (t, e, n, r) {
        return (t /= r / 2) < 1 ? n / 2 * t * t * t * t + e : -n / 2 * ((t -= 2) * t * t * t - 2) + e
    },
    elasticIn: function (t, e, n, r, i, o) {
        if (0 === t) return e;
        if (1 == (t /= r)) return e + n;
        if (o || (o = .3 * r), !i || i < Math.abs(n)) {
            i = n;
            var a = o / 4
        } else var a = o / (2 * Math.PI) * Math.asin(n / i);
        return -(i * Math.pow(2, 10 * (t -= 1)) * Math.sin(2 * (t * r - a) * Math.PI / o)) + e
    },
    elasticOut: function (t, e, n, r, i, o) {
        if (0 === t) return e;
        if (1 == (t /= r)) return e + n;
        if (o || (o = .3 * r), !i || i < Math.abs(n)) {
            i = n;
            var a = o / 4
        } else var a = o / (2 * Math.PI) * Math.asin(n / i);
        return i * Math.pow(2, -10 * t) * Math.sin(2 * (t * r - a) * Math.PI / o) + n + e
    },
    elasticBoth: function (t, e, n, r, i, o) {
        if (0 === t) return e;
        if (2 == (t /= r / 2)) return e + n;
        if (o || (o = .3 * r * 1.5), !i || i < Math.abs(n)) {
            i = n;
            var a = o / 4
        } else var a = o / (2 * Math.PI) * Math.asin(n / i);
        return 1 > t ? -.5 * i * Math.pow(2, 10 * (t -= 1)) * Math.sin(2 * (t * r - a) * Math.PI / o) + e : i * Math.pow(2, -10 * (t -= 1)) * Math.sin(2 * (t * r - a) * Math.PI / o) * .5 + n + e
    },
    backIn: function (t, e, n, r, i) {
        return "undefined" == typeof i && (i = 1.70158),
		n * (t /= r) * t * ((i + 1) * t - i) + e
    },
    backOut: function (t, e, n, r, i) {
        return "undefined" == typeof i && (i = 3.70158),
		n * ((t = t / r - 1) * t * ((i + 1) * t + i) + 1) + e
    },
    backBoth: function (t, e, n, r, i) {
        return "undefined" == typeof i && (i = 1.70158),
		(t /= r / 2) < 1 ? n / 2 * t * t * (((i *= 1.525) + 1) * t - i) + e : n / 2 * ((t -= 2) * t * (((i *= 1.525) + 1) * t + i) + 2) + e
    },
    bounceIn: function (t, e, n, r) {
        return n - Tween.bounceOut(r - t, 0, n, r) + e
    },
    bounceOut: function (t, e, n, r) {
        return (t /= r) < 1 / 2.75 ? 7.5625 * n * t * t + e : 2 / 2.75 > t ? n * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + e : 2.5 / 2.75 > t ? n * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + e : n * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + e
    },
    bounceBoth: function (t, e, n, r) {
        return r / 2 > t ? .5 * Tween.bounceIn(2 * t, 0, n, r) + e : .5 * Tween.bounceOut(2 * t - r, 0, n, r) + .5 * n + e
    }
};