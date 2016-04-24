function fullscreen(e) {
    function t(e, t) {
        setTimeout(function () {
            n(e, -90, 0, 2e3),
			t == h.length - 1 && setTimeout(function () {
			    switchOnOff = !0,
				fullCloseOnOff = !0
			},
			2e3)
        },
		200 * (t + 1))
    }
    function n(e, t, n, a) {
        function l() {
            return (new Date).getTime()
        }
        var i = l();
        clearInterval(e.timer),
		e.timer = setInterval(function () {
		    var r = l(),
			s = 1 - Math.max(0, i - r + a) / a;
		    s > .65 && (clearInterval(e.timer), s = 1);
		    var o = Tween.elasticOut(s * a, t, n - t, a);
		    e.style.WebkitTransform = "perspective(1000px) rotateX(" + o + "deg)",
			e.style.MozTransform = "perspective(1000px) rotateX(" + o + "deg)",
			e.style.transform = "perspective(1000px) rotateX(" + o + "deg)"
		},
		30)
    }
    var a = ["l3", "l2", "l1", "r1", "r2", "r3"],
	l = 21,
	i = 0,
    href = 'javascript:viod(0)';
	//r = [["complete_page/webQQ/index.html", "Web-QQ"], ["complete_page/tmall/index.html", "天猫首页"], ["complete_page/waterfall/index.html", "瀑布流"], ["complete_page/xina_weibo/index.html", "新浪微博首页"], ["complete_page/homepage/index.html", "个人主页"], ["game/word/index.html", "打字小游戏"], ["game/chess/index.html", "中国象棋"], ["game/plane/index.html", "微信打飞机游戏"], ["game/enemy/index.html", "小蜜蜂"], ["complete_page/webQQ/index.html", "Web-QQ"], ["complete_page/tmall/index.html", "天猫首页"], ["complete_page/waterfall/index.html", "瀑布流"], ["complete_page/xina_weibo/index.html", "新浪微博首页"], ["game/word/index.html", "打字小游戏"], ["game/chess/index.html", "中国象棋"], ["game/plane/index.html", "微信打飞机游戏"], ["game/enemy/index.html", "小蜜蜂"], ["complete_page/homepage/index.html", "个人主页"], ["game/plane/index.html", "微信打飞机游戏"], ["game/word/index.html", "打字小游戏"], ["complete_page/tmall/index.html", "天猫首页"]],
    r = [[href, "Web-QQ"], [href, "天猫首页"], [href, "瀑布流"], [href, "新浪微博首页"], [href, "个人主页"], [href, "打字小游戏"], [href, "中国象棋"], [href, "微信打飞机游戏"], [href, "小蜜蜂"], [href, "Web-QQ"], [href, "天猫首页"], [href, "瀑布流"], [href, "新浪微博首页"], [href, "打字小游戏"], [href, "中国象棋"], [href, "微信打飞机游戏"], [href, "小蜜蜂"], [href, "个人主页"], [href, "微信打飞机游戏"], [href, "打字小游戏"], [href, "天猫首页"]],
    s = document.createElement("div");
    s.id = "fullscreen-wrap",
	s.innerHTML = '<div class="btn"><a id="prev" href="javascript:;">&lt;</a><a id="next" href="javascript:;">&gt;</a></div><div id="fullscreen-box"></div>',
	e.appendChild(s);
    for (var o = document.getElementById("prev"), m = document.getElementById("next"), g = document.getElementById("fullscreen-box"), f = 0; 4 > f; f++) {
        var p = document.createElement("ul");
        p.className = a[f + 1];
        for (var c = 0; 3 > c; c++) {
            var d = document.createElement("li");
            i++,
			i > l && (i = 1),
			d.innerHTML = '<a href="/works/' + r[i - 1][0] + '" style="background-image: url(images/opus/' + i + '.jpg)" _index="' + i + '" title="' + r[i - 1][1] + '"></a>',
			p.appendChild(d)
        }
        g.appendChild(p)
    }
    o.parentNode.style.right = (view().w - o.parentNode.offsetWidth) / 2 + "px",
	g.style.width = .94 * view().w + "px",
	g.style.height = .94 * view().h - 100 + "px",
	g.style.right = .06 * view().w / 2 + "px";
    for (var u = g.getElementsByTagName("ul"), h = g.getElementsByTagName("li"), f = 0; f < h.length; f++) t(h[f], f);
    o.onclick = function () {
        if (switchOnOff) {
            switchOnOff = !1,
			fullCloseOnOff = !1,
			i = parseInt(u[0].getElementsByTagName("a")[0].getAttribute("_index")) - 3,
			1 > i ? i += l - 1 : i--;
            for (var e = 0; e < u.length; e++) u[e].className = a[e + 2];
            setTimeout(function () {
                var e = g.removeChild(u[3]);
                e.className = "l2";
                for (var t = e.getElementsByTagName("li"), a = 0; a < t.length; a++) t[a].style.WebkitTransition = "none",
				t[a].style.MozTransition = "none",
				t[a].style.transition = "none",
				t[a].style.WebkitTransform = "perspective(1000px) rotateX(-180deg)",
				t[a].style.MozTransform = "perspective(1000px) rotateX(-180deg)",
				t[a].style.transform = "perspective(1000px) rotateX(-180deg)",
				i++,
				i > l && (i = 1),
				t[a].getElementsByTagName("a")[0].style.backgroundImage = "url(images/opus/" + i + ".jpg)",
				t[a].getElementsByTagName("a")[0].title = r[i - 1][1],
				t[a].getElementsByTagName("a")[0].href = "/works/" + r[i - 1][0],
				t[a].getElementsByTagName("a")[0].setAttribute("_index", i);
                g.insertBefore(e, u[0]);
                var s = u[0].getElementsByTagName("li");
                setTimeout(function () {
                    for (var e = 0; e < s.length; e++) n(s[e], -90, 0, 2e3),
					e == s.length - 1 && setTimeout(function () {
					    switchOnOff = !0,
						fullCloseOnOff = !0
					},
					2e3)
                },
				0)
            },
			1e3)
        }
    },
	m.onclick = function () {
	    if (switchOnOff) {
	        switchOnOff = !1,
			fullCloseOnOff = !1,
			i = parseInt(u[3].getElementsByTagName("a")[2].getAttribute("_index"));
	        for (var e = 0; e < u.length; e++) u[e].className = a[e];
	        setTimeout(function () {
	            var e = g.removeChild(u[0]);
	            e.className = "r2";
	            for (var t = e.getElementsByTagName("li"), a = 0; a < t.length; a++) t[a].style.WebkitTransition = "none",
				t[a].style.MozTransition = "none",
				t[a].style.transition = "none",
				t[a].style.WebkitTransform = "perspective(1000px) rotateX(-180deg)",
				t[a].style.MozTransform = "perspective(1000px) rotateX(-180deg)",
				t[a].style.transform = "perspective(1000px) rotateX(-180deg)",
				i++,
				i > l && (i = 1),
				t[a].getElementsByTagName("a")[0].style.backgroundImage = "url(images/opus/" + i + ".jpg)",
				t[a].getElementsByTagName("a")[0].title = r[i - 1][1],
				t[a].getElementsByTagName("a")[0].href = "/works/" + r[i - 1][0],
				t[a].getElementsByTagName("a")[0].setAttribute("_index", i);
	            g.appendChild(e);
	            var s = u[3].getElementsByTagName("li");
	            setTimeout(function () {
	                for (var e = 0; e < s.length; e++) n(s[e], -90, 0, 2e3),
					e == s.length - 1 && setTimeout(function () {
					    switchOnOff = !0,
						fullCloseOnOff = !0
					},
					2e3)
	            },
				0)
	        },
			1e3)
	    }
	}
}
function closeFullScreen(e) {
    function t(t, n) {
        setTimeout(function () {
            t.style.WebkitTransform = "perspective(1000px) rotateX(-180deg)",
			t.style.MozTransform = "perspective(1000px) rotateX(-180deg)",
			t.style.transform = "perspective(1000px) rotateX(-180deg)",
			0 == n && setTimeout(e, 1e3)
        },
		200 * (12 - n))
    }
    if (fullCloseOnOff) {
        var n = document.getElementById("fullscreen-box"),
		a = n.getElementsByTagName("li");
        switchOnOff = !1,
		fullCloseOnOff = !1;
        for (var l = 0; l < a.length; l++) a[l].style.WebkitTransition = "1s all ease",
		a[l].style.MozTransition = "1s all ease",
		a[l].style.transition = "1s all ease",
		t(a[l], l)
    }
}
var fullCloseOnOff = !1,
switchOnOff = !1;