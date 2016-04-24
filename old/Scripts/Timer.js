

$(function () {
    //Timer.Init(); 
});
var Timer = {
    Init: function () {
        //window.onload = function () {
        //    Timer.toDrawCavas();
        //    setInterval(Timer.toDrawCavas, 1000);
        //}
    },
    toDrawCavas: function () {
        var d = document.getElementById('c1');
        var oGc = d.getContext('2d');
        var n = { x: 200, y: 200, r: 200 };
        var x = n.x;
        var y = n.y;
        var r = n.r;

        oGc.clearRect(0, 0, d.width, d.height);

        var oDate = new Date();
        var oHours = oDate.getHours();
        var oMin = oDate.getMinutes();
        var oSec = oDate.getSeconds();

        var oHoursValue = (-90 + oHours * 30 + oMin / 2) * Math.PI / 180;
        var oMinValue = (-90 + oMin * 6) * Math.PI / 180;
        var oSecValue = (-90 + oSec * 6) * Math.PI / 180;

        Timer.IsWStle(x, y, r, 'rs', oGc, null);
        Timer.FillRound(x, y, r, oGc, 'fs');
        Timer.IsWStle(x, y, r, 'rh', oGc, null);
        Timer.FillRound(x, y, r, oGc, null);
        Timer.IsWStle(x, y, r, 'h', oGc, oHoursValue);
        Timer.IsWStle(x, y, r, 'm', oGc, oMinValue);
        Timer.IsWStle(x, y, r, 's', oGc, oSecValue);

    },

    IsWStle: function (x, y, r, t, d, v) {
        var i, p;
        if (t === 'rs') {
            i = 60;
            Timer.DrawRound(x, y, r, d, i); return;
        }
        if (t === 'rh') {
            i = 12;
            Timer.DrawRound(x, y, r, d, i); return;
        }
        if (t === 'h') {
            p = 1 / 2;
            Timer.DrawTLine(x, y, r, d, v, p); return;
        }
        if (t === 'm') {
            p = 13 / 20;
            Timer.DrawTLine(x, y, r, d, v, p); return;
        }
        if (t === 's') {
            p = 16 / 20;
            Timer.DrawTLine(x, y, r, d, v, p); return;
        }
    },

    DrawRound: function (x, y, r, d, i) {
        d.beginPath();
        for (var j = 0; j < i; i++) {
            d.moveTo(x, y);
            d.arc(x, y, r, 360 / i * i * Math.PI / 180, 6 * (j + 1) * Math.PI / 180, false);
        }
        d.closePath();
        d.stroke();
    },

    DrawTLine: function (x, y, r, d, v, p) {
        //d.lineWidth = 5;
        d.beginPath();
        d.moveTo(x, y);
        d.arc(x, y, r * p, v, v, false)
        d.closePath();
        d.stroke();
    },

    FillRound: function (x, y, r, d, s) {
        var style = 0;
        if (s === 'fs')
            style = 19;
        else
            style = 18;
        d.fillStyle = 'white';
        d.beginPath();
        d.moveTo(x, y);
        d.arc(x, y, r * style / 20, 0, 360 * Math.PI / 180, false);
        d.closePath();
        d.fill();
    }
}