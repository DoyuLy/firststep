var iSpeed = 0;
var iCur = 0;
var oDiv = null;
var oUl = null;

window.onload = function () {
    oDiv = document.getElementById('btn_bg');
    oUl = oDiv.getElementsByTagName('ul')[0];
    var aLi = document.getElementById('header').getElementsByTagName('ul')[0].getElementsByTagName('li');
    var i = 0;

    for (i = 0; i < aLi.length; i++) {
        aLi[i].miaovIndex = i;//赋予index给li
        aLi[i].timer = null;
        aLi[i].onmouseover = startMove(this);//li
    }

    iCur = -oUl.offsetLeft;
};

function startMove(obj) {

    oDiv.style.left = 432 + iCur + 'px';
    oUl.style.left = -iCur + 'px';
    if (obj.timer) {
        clearInterval(obj.timer);
    }
    obj.timer = setInterval("doMove(" + this + "," + obj.offsetLeft + ")", 35);
}

function doMove(obj,iTarget) {

    iSpeed += (iTarget + oUl.offsetLeft) / 5;
    iSpeed *= 0.7;

    if (Math.abs(iSpeed) > 60) {
        iSpeed = iSpeed > 0 ? 60 : -60;
    }

    iCur += iSpeed;

    if (iCur > 0) {
        iCur = Math.ceil(iCur);
    }
    else {
        iCur = Math.floor(iCur);
    }

    if (Math.abs(iTarget - iCur) < 1 && Math.abs(iSpeed) < 1) {
        clearInterval(obj.timer);
        obj.timer = null;
    }
    else {
        oDiv.style.left = 432 + iCur + 'px';
        oUl.style.left = -iCur + 'px';
    }
}