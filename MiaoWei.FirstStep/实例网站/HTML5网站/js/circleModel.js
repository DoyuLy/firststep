function circleModel(e) {
    function t(e, t) {
        setTimeout(function () {
            e.style.WebkitTransform = "rotateY(" + 360 * t / o + "deg) translateZ(400px)",
			e.style.MozTransform = "rotateY(" + 360 * t / o + "deg) translateZ(400px)",
			e.style.transition = "rotateY(" + 360 * t / o + "deg) translateZ(400px)",
			0 == t && setTimeout(function () {
			    regulateOpa(v, i);
			    for (var e = 0; e < v.length; e++) v[e].style.WebkitTransition = "none",
				v[e].style.MozTransition = "none",
				v[e].style.transition = "none";
			    circleCloseOnOff = !0
			},
			1e3)
        },
		200 * (o - t))
    }
    function n(e, t) {
        clearInterval(s),
		s = setInterval(function () {
		    r -= t,
			i += e,
			e *= .94,
			t *= .94,
			Math.abs(e) < .1 && Math.abs(t) < .1 && clearInterval(s),
			a(),
			regulateOpa(v, i)
		},
		30)
    }
    function a() {
        p.iMoved = !0,
		p.style.WebkitTransform = "perspective(1000px) rotateX(" + r + "deg) rotateY(" + i + "deg)",
		p.style.MozTransform = "perspective(1000px) rotateX(" + r + "deg) rotateY(" + i + "deg)",
		p.style.transform = "perspective(1000px) rotateX(" + r + "deg) rotateY(" + i + "deg)"
    }
    var o = 11,
	r = -10,
	i = 0,
	l = ["webQQ", "tmail", "pubuliu", "sinaweibo", "word", "xiangqi", "webQQ", "tmail", "pubuliu", "sinaweibo", "word"],
	s = null,
	c = document.createElement("div");
    c.id = "circle-box";
    var d = document.createElement("div");
    d.id = "circle-bg",
	c.appendChild(d);
    for (var u = 0; o > u; u++) {
        var g = document.createElement("div");
        g.className = "cont",
		g.innerHTML = '<div class="img" title="' + l[u] + '" style="background-image:url(images/opus/' + (u + 1) + '.jpg)"><div class="over"><div class="shadow" style="background:-webkit-linear-gradient(top, rgb(0, 0, 0) 30%, rgba(255, 255, 255, 0)),url(images/opus/' + (u + 1) + '.jpg);background-size: 100% 100%"></div></div></div>',
		c.appendChild(g)
    }
    e.appendChild(c);
    for (var p = document.getElementById("circle-box"), v = getByClass(p, "div", "cont"), u = 0; u < v.length; u++) t(v[u], u),
	v[u].degY = 360 * u / o;
    e.onmousedown = function (t) {
        var t = t || window.event,
		o = t.clientX,
		l = t.clientY,
		s = r,
		c = i,
		d = 0,
		u = 0,
		g = s,
		p = c;
        return e.onmousemove = function (e) {
            var e = e || window.event;
            r = s - (e.clientY - l) / 10,
			i = c + (e.clientX - o) / 10,
			d = (e.clientX - g) / 5,
			u = (e.clientY - p) / 5,
			a(),
			regulateOpa(v, i),
			g = e.clientX,
			p = e.clientY
        },
		e.onmouseup = function () {
		    n(d, u),
			e.onmousemove = e.onmouseup = null
		},
		t.cancelBubble = !0,
		!1
    }
}
function closeCircleModel(e) {
    function t(e, t) {
        e.style.WebkitTransition = "1s all ease",
		e.style.MozTransition = "1s all ease",
		e.style.transition = "1s all ease",
		setTimeout(function () {
		    e.style.WebkitTransform = "rotateY(0deg) translateZ(0px)",
			e.style.MozTransform = "rotateY(0deg) translateZ(0px)",
			e.style.transform = "rotateY(0deg) translateZ(0px)"
		},
		200 * (o - t))
    }
    if (circleCloseOnOff) {
        var n = document.getElementById("circle-box"),
		a = getByClass(n, "div", "cont"),
		o = 11;
        if (n.iMoved) n.style.WebkitTransform = "perspective(1000px) rotateX(-10deg) rotateY(0deg)",
		n.style.MozTransform = "perspective(1000px) rotateX(-10deg) rotateY(0deg)",
		n.style.transform = "perspective(1000px) rotateX(-10deg) rotateY(0deg)",
		n.style.WebkitTransition = "1s all ease",
		n.style.MozTransition = "1s all ease",
		n.style.transition = "1s all ease",
		setTimeout(function () {
		    regulateOpa(a);
		    for (var n = 0; n < a.length; n++) t(a[n], n);
		    setTimeout(e, 2800)
		},
		1e3);
        else {
            for (var r = 0; r < a.length; r++) t(a[r], r);
            setTimeout(e, 2800)
        }
    }
}
function regulateOpa(e, t) {
    for (var n = e.length - 1; n >= 0; n--) {
        var a = e[n].degY + t,
		o = (a % 360 + 360) % 360;
        o = Math.abs(180 - o);
        var r = .1 + o / 180 * .9; .2 > r && (r = .2),
		e[n].style.opacity = r
    }
}
var circleCloseOnOff = !1;