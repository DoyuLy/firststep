function startMove(obj,json,fn) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        var bStop = true; //Assume all attr is done

        for (var attr in json) {
            var iCur = 0;
            if (attr == "opacity") {
                iCur = Math.round(getStyle(obj, attr) * 100);
            }
            else {
                iCur = parseInt(getStyle(obj, attr));
            }
            var iSpeed = (json[attr] - iCur) / 7; //destination - current
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);//desolve -/+

            if (iCur != json[attr]) {
                bStop = false;
            }

            if (attr == "opacity") {
                obj.style.filter = 'alpha(opacity=' + iCur + iSpeed + ')';
                obj.style.opacity = (iCur + iSpeed) / 100;
            } else {
                obj.style[attr] = iCur + iSpeed + 'px';
            }
        }

        if (bStop) { 
            clearInterval(obj.timer);//when all attr reach their destination
            if (fn)
                fn.call(obj);//  change 'this' to obj
        }
    },30)
}

function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    }
    else return getComputedStyle(obj, false)[attr];// second parameter is anything
}

function setStyle(obj,json) {
    for (attr in json) {
        obj.style[attr] = json[attr];
    }
}

function addClass(obj, sClass) {
    var aClass = obj.className.split(' ');
    if (!aClass[0]) {
        obj.className = sClass;
        return;
    }

    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] == sClass) 
            return;
    }
    obj.className += ' ' + sClass;
}

function getClass(obj, sClass) {
    ///return boolean
    var aClass = obj.className.split(' ');
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] == sClass)
            return true;
    }
    return false;
}

function removeClass(obj, sClass) {
    var aClass = obj.className.split(' ');
    if (!aClass[0]) return;
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] == sClass) {
            aClass.splice(i, 1);
            obj.className = aClass.join(' ');
            return;
        }
    }
}

function getByClass(sClass, oParent) {
    /// the same as $('.xxx')
    var parent = oParent || document;
    var aEles = parent.getElementsByTagName('*');
    var arr = [];

    for (var i = 0; i < aEles.length; i++) {
        var aClass = aEles[i].className.split(' ');
        for (var j = 0; j < aClass.length; j++) {
            if (aClass[j] == sClass) {
                arr.push(aEles[i]);
            }
        }
    }
    return arr;
}

//-------- get view/scroll region height/width ---------
function viewHeight() {
    return document.documentElement.clientHeight;
}
function viewWidth() {
    return document.documentElement.clientWidth;
}
function scrollTop() {
    return document.body.scrollTop || document.documentElement.scrollTop;//compatible chrome /ie
}

//-----------------------end----------------------------

function bindEvent(obj,event,fn) {
    if (obj.addEventListener)
        obj.addEventListener(event, fn, false);//the third parameter is anything
    else
        obj.attachEvent('on' + event, function () {
            fn.call(obj);// or apply
        });
}

function unbindEvent(obj, event, fn) {
    if (obj.detachEvent) {
        obj.detachEvent('on' + event, function () {
            fn.call(obj);//or apply
        });
    }
    else {
        obj.removeEventListener(event, fn, false);// 不监视
    }
}

function dows(obj) {
    obj.onmousedown = function (ev) {
        var oEvent = ev || event;

        //obj.offsetWidth:指的是obj自身宽 (width + border + padding)
        //obj.offsetLeft:指的是obj距离parentObj 的border距离(注意：包含了obj的margin)
        var disX = oEvent.clientX - obj.offsetLeft;
        var disY = oEvent.clientY - obj.offsetTop;

        if (obj.setCapture) {
            obj.setCapture();
        }

        document.onmousemove = function (ev) {
            var oEvent = ev || event;
            var L = oEvent.clientX - disX;
            var T = oEvent.clientY - disY;

            var domClientWidth = document.body.clientWidth || document.documentElement.clientWidth;
            var domClientHeight = document.body.clientHeight || document.documentElement.clientHeight;
            if (L < 0) L = 0;
            if (L > domClientWidth - obj.offsetLeft)
                L = domClientWidth - obj.offsetLeft;
            if (T < 0) T = 0;
            if (T > domClientHeight - obj.offsetTop)
                T = domClientHeight - obj.offsetTop;

            obj.style.left = L + 'px';
            obj.style.top = T + 'px';
        }

        document.onmouseup = function (ev) {
            document.onmousemove = null;
            document.onmouseup = null;
            if (obj.releaseCapture)
                obj.releaseCapture();
        }

        return false;
    }
}

function getPadleftTime(itime) {
    if (itime < 10)
        return '0' + itime;
    return '' + itime;
}

function setCookie(key, value, times) {
    var oDate = new Date();
    var iDate = oDate.getDate();
    document.cookie = key + '=' + value + ';expires' + iDate + times;
}

function getCookie(key) {
    var a = document.cookie.split('; ');
    for (var i = 0; i < a.length; i++) {
        var t = a[i].split('=');
        if (key == t[0]) {
            return t[1];
        }
    }
}

function removeCookie(key) {
    setCookie(key, '', -1);
}

///用instanceof  ,不要用typeof 因为很多都是object (实例来自何类)
/*
s = " 网页可见区域宽：" document.body.clientWidth; 
s = " 网页可见区域高：" document.body.clientHeight; 
s = " 网页可见区域宽：" document.body.offsetWidth " (包括边线和滚动条的宽)"; 
s = " 网页可见区域高：" document.body.offsetHeight " (包括边线的宽)"; 
s = " 网页正文全文宽：" document.body.scrollWidth; 
s = " 网页正文全文高：" document.body.scrollHeight; 
s = " 网页被卷去的高(ff)：" document.body.scrollTop; 
s = " 网页被卷去的高(ie)：" document.documentElement.scrollTop; 
s = " 网页被卷去的左：" document.body.scrollLeft; 
s = " 网页正文部分上：" window.screenTop; 
s = " 网页正文部分左：" window.screenLeft; 
s = " 屏幕分辨率的高：" window.screen.height; 
s = " 屏幕分辨率的宽：" window.screen.width; 
s = " 屏幕可用工作区高度：" window.screen.availHeight; 
s = " 屏幕可用工作区宽度：" window.screen.availWidth; 
s = " 你的屏幕设置是 " window.screen.colorDepth " 位彩色"; 
s = " 你的屏幕设置 " window.screen.deviceXDPI " 像素/英寸"; 

在我本地测试当中： 
在IE、FireFox、Opera下都可以使用 
document.body.clientWidth 
document.body.clientHeight 
即可获得，很简单，很方便。 
而在公司项目当中： 
Opera仍然使用 
document.body.clientWidth 
document.body.clientHeight 
可是IE和FireFox则使用 
document.documentElement.clientWidth 
document.documentElement.clientHeight 
原来是W3C的标准在作怪啊 
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> 
如果在页面中添加这行标记的话 在IE中： 
document.body.clientWidth ==> BODY对象宽度 
document.body.clientHeight ==> BODY对象高度 
document.documentElement.clientWidth ==> 可见区域宽度 
document.documentElement.clientHeight ==> 可见区域高度 
在FireFox中： 
document.body.clientWidth ==> BODY对象宽度 
document.body.clientHeight ==> BODY对象高度 
document.documentElement.clientWidth ==> 可见区域宽度 
document.documentElement.clientHeight ==> 可见区域高度 
? 
在Opera中： 
document.body.clientWidth ==> 可见区域宽度 
document.body.clientHeight ==> 可见区域高度 
document.documentElement.clientWidth ==> 页面对象宽度（即BODY对象宽度加上Margin宽） 
document.documentElement.clientHeight ==> 页面对象高度（即BODY对象高度加上Margin高） 
而如果没有定义W3C的标准，则 
IE为： 
document.documentElement.clientWidth ==> 0 
document.documentElement.clientHeight ==> 0 
FireFox为： 
document.documentElement.clientWidth ==> 页面对象宽度（即BODY对象宽度加上Margin宽）document.documentElement.clientHeight ==> 页面对象高度（即BODY对象高度加上Margin高） 
Opera为： 
document.documentElement.clientWidth ==> 页面对象宽度（即BODY对象宽度加上Margin宽）document.documentElement.clientHeight ==> 页面对象高度（即BODY对象高度加上Margin高
*/