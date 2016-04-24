window.onload = function () {
    function resetPos() {
        oRegBtnBox.style.top = oHeaderBox.style.top = parseInt(view().h / 25) + "px",
		oMain.style.top = (view().h - oMain.offsetHeight) / 2 + "px",
		oFooterBox.style.bottom = parseInt(view().h / 25) + "px",
		oRegBtnBox.style.display = view().w < 1024 ? "none" : "block"
    }
    function openBrowserPrompt() {
        oPopLayer.style.display = "block",
		oLyWrap.style.display = "block",
		aLyCont[4].style.display = "block",
		aLyCont[4].getElementsByTagName("p")[0].children[0].innerHTML = browserUserAgent,
		oLyWrap.style.top = -oLyWrap.offsetHeight + "px",
		oLyWrap.style.left = (view().w - oLyWrap.offsetWidth) / 2 + "px";
        var e = (view().h - oLyWrap.offsetHeight) / 2;
        startMove(oPopLayer, {
            opacity: 90
        },
		1e3, "linear",
		function () {
		    startMove(oLyWrap, {
		        top: e
		    },
			1e3, "bounceOut")
		})
    }
    function isChrome360() {
        if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
            var e = navigator.mimeTypes["application/x-shockwave-flash"].description.toLowerCase();
            if (-1 != e.indexOf("adobe")) return !0
        }
        return !1
    }
    function getTL(e, t) {
        var o = Math.round(t * Math.sin(e / 180 * Math.PI)),
		n = -Math.round(t * Math.cos(e / 180 * Math.PI));
        return {
            l: n,
            t: o
        }
    }
    function closeMenu() {
        oMenuBtn.style.WebkitTransform = "rotate(0deg)",
		oMenuBtn.style.MozTransform = "rotate(0deg)";
        for (var e = 0; e < aMenuList.length; e++) {
            {
                getTL(90 / (aMenuList.length - 1) * e, iRadius)
            }
            aMenuList[e].style.transition = ".5s all ease-in",
			aMenuList[e].style.WebkitTransform = "rotate(0deg)",
			aMenuList[e].style.MozTransform = "rotate(0deg)",
			aMenuList[e].style.left = "0px",
			aMenuList[e].style.top = "0px"
        }
        ibOff = !0
    }
    var oWrap = document.getElementById("wrap"),
	oHeaderBox = document.getElementById("header"),
	oMain = document.getElementById("main"),
	oContList = getByClass(oMain, "ul", "cont-list")[0],
	aContListLi = oContList.getElementsByTagName("li"),
	oRollBarbox = getByClass(oMain, "div", "roll-bar-box")[0],
	oRollBar = getByClass(oMain, "div", "roll-bar")[0],
	oPopLayer = document.getElementById("pop-layer"),
	oLyWrap = document.getElementById("ly-wrap"),
	aLyCont = oLyWrap.children,
	oRegBtnBox = document.getElementById("login-box"),
	oMenuBox = document.getElementById("menu-box"),
	aMenuList = oMenuBox.getElementsByTagName("ul")[0].getElementsByTagName("a"),
	oMenuBtn = document.getElementById("menu-btn").getElementsByTagName("a")[0],
	iRadius = 150,
	ibOff = !0,
	oFooterBox = document.getElementById("footer"); !
	function () {
	    var e = getByClass(oHeaderBox, "ul", "nav-list")[0],
		t = e.getElementsByTagName("li"),
		o = getByClass(oHeaderBox, "div", "nav-bg-box")[0],
		n = o.getElementsByTagName("ul")[0],
		i = n.getElementsByTagName("li"),
		l = getByClass(oLyWrap, "div", "card")[0];
	    elasticCross(t, o, n);
	    for (var a = 1; a < i.length; a++) i[a].index = a,
		i[a].onclick = function () {
		    oPopLayer.style.display = "block",
			oLyWrap.style.display = "block",
			aLyCont[this.index].style.display = "block",
			oLyWrap.style.top = -oLyWrap.offsetHeight + "px",
			oLyWrap.style.left = (view().w - oLyWrap.offsetWidth) / 2 + "px";
		    var e = (view().h - oLyWrap.offsetHeight) / 2;
		    startMove(oPopLayer, {
		        opacity: 90
		    },
			1e3, "linear",
			function () {
			    startMove(oLyWrap, {
			        top: e
			    },
				1e3, "bounceOut")
			})
		};
	    l.onmouseover = function () {
	        startMove(this, {
	            width: 260
	        },
			1e3, "bounceOut")
	    },
		l.onmouseout = function () {
		    startMove(this, {
		        width: 20
		    },
			1e3, "bounceOut")
		},
		function () {
		    var e = oLyWrap.children[0];
		    e.onclick = function () {
		        var e = view().w;
		        startMove(oLyWrap, {
		            left: e
		        },
				1e3, "elasticIn",
				function () {
				    oPopLayer.style.opacity = 0,
					oPopLayer.style.filter = "alpha(opacity=0)",
					oLyWrap.style.left = "0px",
					oPopLayer.style.display = "none",
					oLyWrap.style.display = "none";
				    for (var e = 1; e < aLyCont.length; e++) aLyCont[e].style.display = "none"
				})
		    }
		}()
	}(),
	resetPos(),
	window.onresize = function () {
	    resetPos()
	},
	function () {
	    var e = getByClass(oHeaderBox, "div", "search-box")[0],
		t = getByClass(e, "div", "search-bg")[0],
		o = document.getElementById("ipt"),
		n = document.getElementById("lab"),
		i = document.getElementById("search-btn"),
		l = document.getElementById("search-result");
	    t.onclick = function (o) {
	        var o = o || window.event;
	        startMove(e, {
	            width: 284
	        },
			2e3, "bounceOut",
			function () {
			    t.style.display = "none"
			}),
			o.cancelBubble = !0
	    },
		o.onfocus = function () {
		    n.style.display = "none"
		},
		o.onkeyup = function () {
		    if ("" == o.value) return l.style.display = "none",
			void 0;
		    var e = document.createElement("script");
		    e.src = "http://suggestion.baidu.com/su?wd=" + this.value + "&cb=getWords",
			document.body.appendChild(e),
			i.href = "http://www.baidu.com/s?wd=" + this.value
		},
		o.onblur = function () {
		    o.value = "",
			n.style.display = "block",
			t.style.display = "block",
			setTimeout(function () {
			    l.style.display = "none"
			},
			200),
			startMove(e, {
			    width: 50
			},
			2e3, "bounceOut")
		},
		n.onclick = o.onclick = function (e) {
		    var e = e || window.event;
		    e.cancelBubble = !0
		},
		document.onclick = function () {
		    "50px" != e.style.width && (o.value = "", n.style.display = "block", t.style.display = "block", l.style.display = "none", startMove(e, {
		        width: 50
		    },
			2e3, "bounceOut")),
			closeMenu()
		},
		i.onclick = function (e) {
		    var e = e || window.event;
		    e.cancelBubble = !0
		}
	}(),
	function () {
	    var e = getByClass(oMain, "ul", "nav-list")[0],
		t = e.getElementsByTagName("li"),
		o = getByClass(oMain, "div", "nav-bg-box")[0],
		n = o.getElementsByTagName("ul")[0],
		i = n.getElementsByTagName("li");
	    elasticCross(t, o, n, i);
	    for (var l = ["all", "complete", "css", "game", "practice"], a = 0; a < i.length; a++) i[a].index = a,
		myAddEvent(i[a], "click",
		function () {
		    var e = 0;
		    if (0 == this.index) for (var t = 0; t < aContListLi.length; t++) aContListLi[t].style.display = "block",
			aContListLi[t].style.opacity = 0,
			aContListLi[t].style.filter = "alpha(opacity=0)",
			startMove(aContListLi[t], {
			    opacity: 100
			},
			1e3, "linear"),
			e += aContListLi[t].offsetWidth;
		    else for (var t = 0; t < aContListLi.length; t++) aContListLi[t].getAttribute("type") == l[this.index] ? (aContListLi[t].style.display = "block", aContListLi[t].style.opacity = 0, aContListLi[t].style.filter = "alpha(opacity=0)", startMove(aContListLi[t], {
		        opacity: 100
		    },
			1e3, "linear"), e += aContListLi[t].offsetWidth) : aContListLi[t].style.display = "none";
		    oContList.style.width = e + "px",
			oContList.style.left = oRollBar.style.left = "0px",
			oRollBarbox.style.display = e < oContList.parentNode.clientWidth ? "none" : "block"
		})
	}(),
	function () {
	    oContList.style.width = oContList.children[0].offsetWidth * oContList.children.length + "px",
		oRollBar.onmousedown = function (e) {
		    var e = e || window.event,
			t = e.clientX - this.offsetLeft,
			o = 0;
		    return this.setCapture && this.setCapture(),
			document.onmousemove = function (e) {
			    var e = e || window.event,
				n = e.clientX - t;
			    n > oRollBarbox.clientWidth - oRollBar.offsetWidth ? n = oRollBarbox.clientWidth - oRollBar.offsetWidth : 0 > n && (n = 0),
				o = n / (oRollBarbox.clientWidth - oRollBar.offsetWidth),
				oRollBar.style.left = n + "px",
				oContList.style.left = -(oContList.offsetWidth - oContList.parentNode.clientWidth) * o + "px"
			},
			document.onmouseup = function () {
			    document.onmouseup = null,
				document.onmousemove = null
			},
			!1
		},
		addWheel(document,
		function () {
		    if (!(oContList.offsetWidth < oContList.parentNode.clientWidth)) {
		        var e = oContList.offsetLeft + 50;
		        e > 0 && (e = 0);
		        var t = e / -(oContList.offsetWidth - oContList.parentNode.clientWidth);
		        oContList.style.left = e + "px",
				oRollBar.style.left = t * (oRollBarbox.clientWidth - oRollBar.offsetWidth) + "px"
		    }
		},
		function () {
		    if (!(oContList.offsetWidth < oContList.parentNode.clientWidth)) {
		        var e = oContList.offsetLeft - 50;
		        e < -(oContList.offsetWidth - oContList.parentNode.clientWidth) && (e = -(oContList.offsetWidth - oContList.parentNode.clientWidth));
		        var t = e / -(oContList.offsetWidth - oContList.parentNode.clientWidth);
		        oContList.style.left = e + "px",
				oRollBar.style.left = t * (oRollBarbox.clientWidth - oRollBar.offsetWidth) + "px"
		    }
		})
	}();
    var browserOnOff = !0,
	browserUserAgent = window.navigator.userAgent; (-1 == browserUserAgent.indexOf("Chrome") || isChrome360()) && (browserOnOff = !1, openBrowserPrompt()),
	-1 != browserUserAgent.indexOf("Firefox") && (browserOnOff = !0),
	function () {
	    function e() {
	        p.value = m.value = "",
			a.style.WebkitTransform = "perspective(1000px) rotateY(0deg)",
			a.style.MozTransform = "perspective(1000px) rotateY(0deg)",
			a.children[0].style.display = "none",
			a.children[1].style.display = "block"
	    }
	    function t() {
	        d.value = y.value = "",
			a.style.WebkitTransform = "perspective(1000px) rotateY(180deg)",
			a.style.MozTransform = "perspective(1000px) rotateY(180deg)",
			a.children[0].style.display = "block",
			a.children[1].style.display = "none"
	    }
	    function o() {
	        l.style.display = "block",
			startMove(l, {
			    opacity: 30
			},
			500, "linear",
			function () {
			    a.style.display = "block",
				a.style.top = -a.offsetHeight + "px",
				a.style.left = (view().w - a.offsetWidth) / 2 + "px",
				startMove(a, {
				    top: (view().h - a.offsetHeight) / 2
				},
				1e3, "bounceOut")
			})
	    }
	    function n() {
	        startMove(a, {
	            left: view().w
	        },
			1e3, "elasticIn",
			function () {
			    a.style.display = "none",
				l.style.opacity = 0,
				l.style.filter = "alpha(opacity=0)",
				l.style.display = "none",
				p.value = m.value = d.value = y.value = ""
			})
	    }
	    var i = oRegBtnBox.getElementsByTagName("a"),
		l = document.getElementById("login-layer-bg"),
		a = document.getElementById("login-layer"),
		s = oRegBtnBox.getElementsByTagName("div")[0],
		r = s.getElementsByTagName("span")[0],
		c = document.getElementById("login-dialog-close"),
		d = document.getElementById("login-username"),
		y = document.getElementById("login-password"),
		u = document.getElementById("login-btn-cancel"),
		f = document.getElementById("login-btn-ok"),
		g = document.getElementById("reg-dialog-close"),
		p = document.getElementById("reg-username"),
		m = document.getElementById("reg-password"),
		v = document.getElementById("reg-btn-ok"),
		h = document.getElementById("reg-btn-cancel");
	    window.localStorage && "true" == window.localStorage.getItem("loginIng") && (i[0].style.display = i[1].style.display = "none", s.style.display = "block", r.innerHTML = window.localStorage.getItem("username")),
		i[0].onclick = function () {
		    return browserOnOff ? (e(), o(), void 0) : (alert("对不起，您的浏览器对本功能支持不完善，请先升级Google Chrome浏览器浏览器后再访问本站。"), void 0)
		},
		i[1].onclick = function () {
		    return browserOnOff ? (t(), o(), void 0) : (alert("对不起，您的浏览器对本功能支持不完善，请先升级Google Chrome浏览器浏览器后再访问本站。"), void 0)
		},
		aMenuList[0].onclick = i[2].onclick = function () {
		    i[0].style.display = i[1].style.display = "inline-block",
			s.style.display = "none",
			r.innerHTML = "",
			window.localStorage.setItem("loginIng", "false")
		},
		v.onclick = function () {
		    if ("" != p.value && "" != m.value) {
		        if (p.value == window.localStorage.getItem("username")) return alert("您所使用的用户名已经被注册，请登录。"),
				t(),
				void 0;
		        alert("注册成功"),
				window.localStorage.setItem("username", p.value),
				window.localStorage.setItem("password", m.value),
				t(),
				"" == d.value && (d.value = window.localStorage.getItem("username"))
		    }
		},
		f.onclick = function () {
		    if ("" != d.value && "" != y.value) {
		        if (!window.localStorage.getItem("username")) return alert("你还没有注册"),
				e(),
				void 0;
		        if (y.value != window.localStorage.getItem("password") || d.value != window.localStorage.getItem("username")) return alert("密码错误"),
				void 0;
		        window.localStorage.setItem("loginIng", "true"),
				n(),
				i[0].style.display = i[1].style.display = "none",
				s.style.display = "block",
				r.innerHTML = d.value
		    }
		},
		g.onclick = c.onclick = h.onclick = u.onclick = n
	}(),
	function () {
	    function fn() {
	        with (this.removeEventListener("transitionend", fn, !1), this.removeEventListener("webkitTransitionEnd", fn, !1), this.style) transition = "0.1s ease-in",
			WebkitTransform = "rotate(-360deg) scale(1)",
			MozTransform = "rotate(-360deg) scale(1)",
			opacity = 1,
			boxShadow = ""
	    }
	    var iNowBg = "01";
	    getCookie("iNowBg") && (oWrap.style.backgroundImage = "url(images/bg_" + getCookie("iNowBg") + ".jpg)", iNowBg = getCookie("iNowBg")),
		oMenuBtn.onclick = function (e) {
		    var e = e || window.event;
		    if (ibOff) {
		        this.style.WebkitTransform = "rotate(-360deg)",
				this.style.MozTransform = "rotate(-360deg)";
		        for (var t = 0; t < aMenuList.length; t++) {
		            var o = getTL(90 / (aMenuList.length - 1) * t, iRadius);
		            aMenuList[t].style.transition = ".4s " + 100 * t + "ms",
					aMenuList[t].style.WebkitTransform = "rotate(-360deg)",
					aMenuList[t].style.MozTransform = "rotate(-360deg)",
					aMenuList[t].style.left = o.l + "px",
					aMenuList[t].style.top = o.t + "px"
		        }
		        ibOff = !1
		    } else closeMenu();
		    e.cancelBubble = !0
		};
	    for (var i = 0; i < aMenuList.length; i++) aMenuList[i].onmouseover = function () {
	        with (this.addEventListener("transitionend", fn, !1), this.addEventListener("webkitTransitionEnd", fn, !1), this.style) transition = "0.3s ease-out",
			WebkitTransform = "rotate(-360deg) scale(2)",
			MozTransform = "rotate(-360deg) scale(2)",
			opacity = .2,
			boxShadow = "0 0 5px 3px #0164C5"
	    },
		aMenuList[1].onclick = function () {
		    iNowBg = "01" == iNowBg ? "02" : "01",
			oWrap.style.backgroundImage = "url(images/bg_" + iNowBg + ".jpg)",
			setCookie("iNowBg", iNowBg, 5)
		},
		aMenuList[4].onclick = function () {
		    window.location.reload()
		}
	}(),
	function () {
	    function e(e) {
	        n.style.display = "block",
			startMove(n, {
			    width: view().w + 160,
			    height: view().w + 160
			},
			400, "easeBoth",
			function () {
			    startMove(n, {
			        opacity: 100
			    },
				1e3, "linear"),
				i.style.WebkitTransform = "rotateZ(-90deg)",
				i.style.MozTransform = "rotateZ(-90deg)",
				e && e()
			})
	    }
	    function t() {
	        var e = document.getElementById("circle-box"),
			t = document.getElementById("fullscreen-wrap");
	        e && (e.innerHTML = "", n.removeChild(e)),
			t && (t.innerHTML = "", n.removeChild(t)),
			i.style.WebkitTransform = "rotateZ(90deg)",
			i.style.MozTransform = "rotateZ(90deg)",
			startMove(n, {
			    opacity: 80
			},
			1e3, "linear",
			function () {
			    startMove(n, {
			        width: 0,
			        height: 0
			    },
				400, "easeBoth",
				function () {
				    n.style.display = "none"
				})
			})
	    }
	    var o = getByClass(oMenuBox, "li", "mode"),
		n = document.getElementById("effect-layer"),
		i = getByClass(n, "div", "effect-close")[0],
		l = "";
	    o[0].onclick = function () {
	        return browserOnOff ? (e(function () {
	            fullscreen(n)
	        }), l = "fullscreen", void 0) : (alert("对不起，您的浏览器对本功能支持不完善，请先升级Google Chrome浏览器浏览器后再访问本站。"), void 0)
	    },
		o[1].onclick = function () {
		    return browserOnOff ? (e(function () {
		        circleModel(n)
		    }), l = "circle", void 0) : (alert("对不起，您的浏览器对本功能支持不完善，请先升级Google Chrome浏览器浏览器后再访问本站。"), void 0)
		},
		i.onclick = function () {
		    switch (l) {
		        case "circle":
		            closeCircleModel(t);
		            break;
		        case "fullscreen":
		            closeFullScreen(t)
		    }
		},
		i.onmousedown = function (e) {
		    var e = e || window.event;
		    e.cancelBubble = !0
		}
	}()
};