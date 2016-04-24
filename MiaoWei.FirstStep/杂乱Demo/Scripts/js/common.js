// JavaScript Document
function nav() {
    var oNav = document.getElementById('nav');
    var toLasti = oNav.getElementsByTagName('li');
    var oldClass;
    //导航
    for (var i = 0, len = toLasti.length; i < len; i++) {
        toLasti[i].onmouseover = function () {
            this.className = this.getAttribute('new');
        };
        toLasti[i].onmouseout = function () {
            this.className = this.getAttribute('cName');

        };
    }
    //导航结束	
}
function startMove(obj, json, fnEnd) {  //回调函数，链式运动
    if (obj.timer) {
        clearInterval(obj.timer);
    }
    obj.timer = setInterval(function () {
        doMove(obj, json, fnEnd);
    }, 20);
}
//拖拽
function drag(obj) {
    var disX = 0;
    var disY = 0;

    obj.onmousedown = function (ev) {
        var ev = ev || window.event;
        disX = ev.clientX - obj.offsetLeft;
        disY = ev.clientY - obj.offsetTop;

        if (obj.setCapture) {
            obj.setCapture();
        }

        document.onmousemove = function (ev) {
            var ev = ev || window.event;
            obj.style.left = ev.clientX - disX + 'px';
            obj.style.top = ev.clientY - disY + 'px';
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;

            if (obj.releaseCapture) {
                obj.releaseCapture();
            }
        };

        return false;

    };
}

//运动

function doMove(obj, json, fnEnd) {
    var iCur = 0;
    var attr = null;
    var bStop = true;
    for (attr in json) {
        if (attr == 'opacity') {
            iCur = parseInt(100 * parseFloat(getStyle(obj, attr)));
        }
        else {
            iCur = parseInt(getStyle(obj, attr));
        }

        var iSpeed = (json[attr] - iCur) / 8;
        iSpeed = (iSpeed > 0) ? Math.ceil(iSpeed) : Math.floor(iSpeed);

        if (json[attr] != iCur) {
            bStop = false;
        }

        if (attr == 'opacity') {
            obj.style.filter = 'alpha(opacity=' + (iCur + iSpeed) + ')';
            obj.style.opacity = (iCur + iSpeed) / 100;
        }
        else {
            obj.style[attr] = iCur + iSpeed + 'px';
        }

    }
    if (bStop) {
        clearInterval(obj.timer);
        obj.timer = null;
        if (fnEnd) {
            fnEnd.call(obj);
        }
    }
}
//获取样式
function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    }
    else {
        return getComputedStyle(obj, false)[attr];
    }
}
//用class获取元素 ，
function getByClass(oParent, sClass) {
    var aEle = oParent.getElementsByTagName('*');
    var arr = [];

    //var re = /sClass/; // 简写不能做传参的操作
    var re = new RegExp('\\b' + sClass + '\\b');

    for (var i = 0; i < aEle.length; i++) {
        if (re.test(aEle[i].className)) {
            arr.push(aEle[i]);
        }
    }

    return arr;
}

//无缝
function getClass(myClass) {//取class
    var myNode = document.getElementsByTagName('*');
    var getNameClass = [];
    for (var i = 0; i < myNode.length; i++) {
        if (myNode[i].className == myClass) {
            getNameClass.push(myNode[i]);
        }
    }
    return getNameClass;
} //取class
function getRolling(rollDiv, fangxiang) {

    var myImg = document.getElementById(rollDiv);

    myImg.myOpen = null;
    myImg.direction = null;
    myImg.widthCurrent = 0;

    //var aa=myImg.getClass('obj2')[0].innerHTML;

    for (var c = 0; c < getClass('obj1').length; c++) {
        getClass('obj2')[c].innerHTML = getClass('obj1')[c].innerHTML;

        myImg.Width = getClass('obj1')[c].getElementsByTagName('li');
    }



    var imgWidth = parseInt(getStyle(myImg.Width[0], "width"));
    var imgMarginL = parseInt(getStyle(myImg.Width[0], "marginLeft"));
    var imgMarginR = parseInt(getStyle(myImg.Width[0], "marginRight"));

    myImg.widthCurrent = imgMarginL + imgMarginR + imgWidth + 4;

    myImg.style.width = (myImg.Width.length * myImg.widthCurrent) * 2 + 'px';
    if (fangxiang == 'right') {
        myImg.direction = 2;
        myImg.myOpen = true;
    } else {
        myImg.direction = -2;
        myImg.myOpen = false;
    }


    function to() {

        if (myImg.myOpen == true) {
            if (myImg.offsetLeft > 0) { myImg.style.left = (myImg.Width.length * myImg.widthCurrent) * -1 + 'px'; } else { myImg.style.left = myImg.offsetLeft + myImg.direction + 'px'; }
        } else {
            if ((myImg.Width.length * myImg.widthCurrent) <= Math.abs(myImg.offsetLeft)) { myImg.style.left = 0 + 'px'; } else { myImg.style.left = myImg.offsetLeft + myImg.direction + 'px'; }
        }
    }
    myImg.timer = setInterval(to, 25);
    myImg.onmouseover = function () { clearInterval(myImg.timer); }
    myImg.onmouseout = function () { myImg.timer = setInterval(to, 25); }
} 