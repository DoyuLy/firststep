!
function () {
    function e(e) {
        var i = new Image;
        i.src = p[e],
		i.onload = function () {
		    o++;
		    var e = parseInt(o / p.length * 100);
		    e > 10 && 100 > e ? t.style.left = "84px" : 100 == e && (t.style.left = "80px", setTimeout(function () {
		        g.style.display = "none",
				s.style.opacity = 0,
				setTimeout(function () {
				    s.style.display = "none"
				},
				1e3)
		    },
			400)),
			t.innerHTML = e + "%"
		}
    }
    var s = document.getElementById("loading-box"),
	g = s.getElementsByTagName("div")[0],
	t = document.getElementById("num");
    g.style.left = (view().w - g.offsetWidth) / 2 + "px",
	g.style.top = (view().h - g.offsetHeight) / 2 + "px";
    for (var p = ["images/opus/1.jpg", "images/opus/2.jpg", "images/opus/3.jpg", "images/opus/4.jpg", "images/opus/5.jpg", "images/opus/6.jpg", "images/opus/7.jpg", "images/opus/8.jpg", "images/opus/9.jpg", "images/opus/10.jpg", "images/opus/11.jpg", "images/opus/12.jpg", "images/bg_01.jpg", "images/bg_02.jpg"], o = 0, i = 0; i < p.length; i++) e(i)
}();