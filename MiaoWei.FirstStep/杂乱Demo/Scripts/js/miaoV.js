function ajaxGet(url, fnSucc, fnFaild) {
    var oAjax = InitAjax();
    if (!oAjax) return;
    DoAjaxGet(oAjax, url, fnSucc, fnFaild)
}
function InitAjax() {
    var ajax = false;
    try {
        ajax = new ActiveXObject("Msxml2.XMLHTTP")
    } catch (e) {
        try {
            ajax = new ActiveXObject("Microsoft.XMLHTTP")
        } catch (E) {
            ajax = false
        }
    }
    if (!ajax && typeof XMLHttpRequest != 'undefined') {
        ajax = new XMLHttpRequest()
    }
    return ajax
}
function DoAjaxCancel(ajax) {
    ajax.onreadystatechange = null;
    ajax.close()
}
function DoAjaxGet(ajax, url, func_succ, func_faild) {
    ajax.open("GET", url, true);
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4) {
            if (ajax.status == 200) {
                if (func_succ) func_succ(ajax.responseText)
            } else {
                if (func_faild) func_faild(ajax.status)
            }
        }
    };
    ajax.send(null)
}
function DoAjaxPost(ajax, url, func_succ, post_datas, func_faild) {
    ajax.open("POST", url, true);
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4) {
            if (ajax.status == 200) {
                if (func_succ) func_succ(ajax.responseText)
            } else {
                if (func_faild) func_faild(ajax.status)
            }
        }
    };
    ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    ajax.send(post_datas)
}
function setCookie(key, value, day) {
    if (day) {
        var oDate = new Date();
        oDate.setDate(oDate.getDate() + day);
        document.cookie = key + '=' + value + ';expires=' + oDate.toGMTString()
    } else {
        document.cookie = key + '=' + value
    }
}
function getCookie(key) {
    var arr = document.cookie.split('; ');
    var arr2 = [];
    var i = 0;
    for (i = 0; i < arr.length; i++) {
        arr2 = arr[i].split('=');
        if (arr2[0] == key) {
            return arr2[1]
        }
    }
    return ''
}
function delCookie(key) {
    setCookie(key, '', -1)
}
var aCourseLiOutTimer = [];
var aEmCourse = [];
var aCourseLiInitData = [];
var aCourseDlInitData = [];
var aLiCourse;
var aDlCourse;
function fnCourseLiOut(index) {
    aEmCourse[index].em.setTarget([aCourseLiInitData[index].left, aCourseLiInitData[index].top, aCourseLiInitData[index].width, aCourseLiInitData[index].height, aCourseDlInitData[index].height]);
    aLiCourse[index].style.zIndex = '1';
    aCourseLiOutTimer[index] = null;
    aDlCourse[index].style.overflow = 'hidden'
}
function initCourseOutline() {
    var oUlCourseContent = document.getElementById('course_content');
    var maxHeight = 0;
    aLiCourse = oUlCourseContent.getElementsByTagName('li');
    aDlCourse = oUlCourseContent.getElementsByTagName('dl');
    var i;
    for (i = 0; i < aLiCourse.length; i++) {
        aCourseLiInitData[i] = {};
        aCourseLiInitData[i].left = aLiCourse[i].offsetLeft;
        aCourseLiInitData[i].top = aLiCourse[i].offsetTop;
        aCourseLiInitData[i].width = aLiCourse[i].offsetWidth;
        aCourseLiInitData[i].height = aLiCourse[i].offsetHeight;
        maxHeight = Math.max(maxHeight, aLiCourse[i].offsetTop + aLiCourse[i].offsetHeight + 4);
        aCourseLiInitData[i].bigWidth = Math.ceil(1.5 * aCourseLiInitData[i].width);
        aCourseLiInitData[i].bigHeight = Math.ceil(1.5 * aCourseLiInitData[i].height);
        aCourseLiInitData[i].bigLeft = Math.ceil(aCourseLiInitData[i].left - (aCourseLiInitData[i].bigWidth - aCourseLiInitData[i].width) / 2);
        aCourseLiInitData[i].bigTop = Math.ceil(aCourseLiInitData[i].top - (aCourseLiInitData[i].bigHeight - aCourseLiInitData[i].height) / 2);
        aCourseLiInitData[i].height;
        aCourseDlInitData[i] = {};
        aCourseDlInitData[i].height = aDlCourse[i].offsetHeight;
        aCourseDlInitData[i].bigHeight = Math.ceil(1.5 * aCourseDlInitData[i].height) - 22;
        aCourseDlInitData[i].height -= 22;
        aEmCourse[i] = {};
        aEmCourse[i].em = new MoveLib([aCourseLiInitData[i].left, aCourseLiInitData[i].top, aCourseLiInitData[i].width, aCourseLiInitData[i].height, aCourseDlInitData[i].height], [40, 40, 40, 40, 40],
        function (arr) {
            aLiCourse[this.counrseIndex].style.left = arr[0].cur + 'px';
            aLiCourse[this.counrseIndex].style.top = arr[1].cur + 'px';
            aLiCourse[this.counrseIndex].style.width = arr[2].cur + 'px';
            aLiCourse[this.counrseIndex].style.height = arr[3].cur + 'px';
            aDlCourse[this.counrseIndex].style.height = arr[4].cur + 'px'
        },
        function () {
            if (Math.ceil(parseInt(aLiCourse[this.counrseIndex].style.width)) >= aCourseLiInitData[this.counrseIndex].bigWidth) {
                aDlCourse[this.counrseIndex].style.overflow = 'auto'
            }
        },
        MoveLibType.ELASTICITY);
        aEmCourse[i].em.counrseIndex = i;
        aLiCourse[i].onmouseover = function () {
            var index = parseInt(this.counrseIndex);
            if (aCourseLiOutTimer[index]) {
                clearTimeout(aCourseLiOutTimer[index])
            }
            aEmCourse[index].em.setTarget([aCourseLiInitData[index].bigLeft, aCourseLiInitData[index].bigTop, aCourseLiInitData[index].bigWidth, aCourseLiInitData[index].bigHeight, aCourseDlInitData[index].bigHeight]);
            aLiCourse[index].style.zIndex = '2'
        };
        aLiCourse[i].onmouseout = function () {
            var index = parseInt(this.counrseIndex);
            aCourseLiOutTimer[index] = setTimeout("fnCourseLiOut(" + index + ")", 50)
        }
    }
    oUlCourseContent.style.height = maxHeight + 'px';
    for (i = 0; i < aLiCourse.length; i++) {
        aLiCourse[i].style.left = aCourseLiInitData[i].left + 'px';
        aLiCourse[i].style.top = aCourseLiInitData[i].top + 'px';
        aLiCourse[i].style.width = aCourseLiInitData[i].width + 'px';
        aLiCourse[i].style.height = aCourseLiInitData[i].height + 'px';
        aLiCourse[i].style.position = 'absolute';
        aLiCourse[i].style.zIndex = '1';
        aLiCourse[i].counrseIndex = i
    }
}
if (typeof DockType == "undefined") {
    DockType = {
        LEFT: 1,
        RIGHT: 2,
        TOP: 4,
        BOTTOM: 8
    }
}
function Dock(oEle, iDirection, oDistance, fnOnBrowserChecked, fnOnResizeOrScroll) {
    var bIsIe6 = false;
    var obj = this;
    this.__oEle__ = oEle;
    this.__iDir__ = iDirection;
    this.__oDis__ = oDistance;
    this.fnOnResizeOrScroll = fnOnResizeOrScroll;
    if (-1 != window.navigator.userAgent.indexOf('MSIE 6.0')) {
        if (-1 != window.navigator.userAgent.indexOf('MSIE 7.0') || -1 != window.navigator.userAgent.indexOf('MSIE 8.0')) {
            bIsIe6 = false
        } else {
            bIsIe6 = true
        }
    } else {
        bIsIe6 = false
    }
    this.bIsIe6 = bIsIe6;
    if (fnOnBrowserChecked) {
        fnOnBrowserChecked(bIsIe6)
    }
    if (bIsIe6) {
        oEle.style.position = 'absolute'
    } else {
        oEle.style.position = 'fixed'
    }
    if (bIsIe6) {
        miaovAppendEventListener(window, "scroll",
        function () {
            obj.fixItem()
        })
    }
    miaovAppendEventListener(window, "resize",
    function () {
        obj.fixItem()
    });
    this.fixItem()
}
Dock.prototype.getScreen = function () {
    var t = document.body.scrollTop || document.documentElement.scrollTop;
    return {
        left: 0,
        right: document.documentElement.clientWidth,
        top: t,
        bottom: t + document.documentElement.clientHeight
    }
};
Dock.prototype.move = function (oDistance) {
    this.__oDis__ = oDistance;
    this.fixItem()
};
Dock.prototype.fixItem = function () {
    var t = document.body.scrollTop || document.documentElement.scrollTop;
    if (this.__iDir__ & DockType.LEFT) {
        this.__oEle__.style.left = this.__oDis__.left + 'px'
    } else if (this.__iDir__ & DockType.RIGHT) {
        this.__oEle__.style.left = document.documentElement.clientWidth - this.__oDis__.right - this.__oEle__.offsetWidth + 'px'
    } else if (this.__iDir__ & DockType.BOTTOM) {
        if (this.bIsIe6) {
            this.__oEle__.style.top = t + document.documentElement.clientHeight - this.__oDis__.bottom - this.__oEle__.offsetHeight
        } else {
            this.__oEle__.style.top = document.documentElement.clientHeight - this.__oDis__.bottom - this.__oEle__.offsetHeight
        }
    } else if (this.__iDir__ & DockType.TOP) {
        if (this.bIsIe6) {
            this.__oEle__.style.top = t + this.__oDis__.top + 'px'
        } else {
            this.__oEle__.style.top = this.__oDis__.top + 'px'
        }
    }
    if (this.fnOnResizeOrScroll) {
        this.fnOnResizeOrScroll({
            left: 0,
            right: document.documentElement.clientWidth,
            top: t,
            bottom: t + document.documentElement.clientHeight
        })
    }
};
function EffectBuffer(fDistanceCoefficient, iMinSpeed) {
    this.distanceCoefficient = fDistanceCoefficient;
    this.iMinSpeed = iMinSpeed
}
EffectBuffer.prototype.initMotion = function (aMotionData) { };
EffectBuffer.prototype.next = function (aMotionData) {
    var motion = null;
    var i = 0;
    var complete = true;
    for (i = 0; i < aMotionData.length; i++) {
        motion = aMotionData[i];
        motion.speed = (motion.target - motion.cur) / this.distanceCoefficient;
        motion.speed = ceilSpeed(motion.speed);
        if (Math.abs(motion.speed) < this.iMinSpeed) {
            motion.speed = this.iMinSpeed > 0 ? this.iMinSpeed : -this.iMinSpeed
        }
        if (Math.abs(motion.speed) > motion.speedMax) {
            motion.speed = (motion.speed > 0) ? motion.speedMax : -motion.speedMax
        }
        motion.cur += motion.speed;
        if (motion.cur != motion.target) {
            complete = false
        }
    }
    if (complete) {
        for (i = 0; i < aMotionData.length; i++) {
            aMotionData[i].cur = aMotionData[i].target;
            aMotionData[i].speed = 0
        }
        return true
    }
    return false
};
function EffectCollision(fScale, iAcc) {
    this.fScale = fScale;
    this.iAccDefault = iAcc
}
EffectCollision.prototype.initMotion = function (aMotionData) {
    var i = 0;
    for (i = 0; i < aMotionData.length; i++) {
        if (aMotionData[i].target > aMotionData[i].cur) {
            aMotionData[i].acc = this.iAccDefault
        } else {
            aMotionData[i].acc = -this.iAccDefault
        }
    }
};
EffectCollision.prototype.next = function (aMotionData) {
    var iTmp = 0;
    var motion = null;
    var complete = true;
    var i = 0;
    for (i = 0; i < aMotionData.length; i++) {
        motion = aMotionData[i];
        motion.cur += motion.speed;
        if ((motion.acc < 0 && motion.cur <= motion.target) || (motion.acc > 0 && motion.cur >= motion.target)) {
            motion.speed *= this.fScale;
            if (Math.abs(motion.speed) > Math.abs(motion.acc)) {
                complete = false
            }
            motion.cur = motion.target
        } else {
            complete = false
        }
        motion.speed += motion.acc;
        if (Math.abs(motion.speed) > motion.speedMax) {
            motion.speed = motion.speed > 0 ? motion.speedMax : -motion.speedMax
        }
    }
    if (complete) {
        for (i = 0; i < aMotionData.length; i++) {
            aMotionData[i].cur = aMotionData[i].target;
            aMotionData[i].speed = 0
        }
        return true
    }
    return false
};
function EffectDirect(fDistanceCoefficient) {
    this.distanceCoefficient = fDistanceCoefficient
}
EffectDirect.prototype.initMotion = function (aMotionData) {
    var motion = null;
    var i = 0;
    for (i = 0; i < aMotionData.length; i++) {
        motion = aMotionData[i];
        motion.speed = ceilSpeed((motion.target - motion.cur) / this.distanceCoefficient)
    }
};
EffectDirect.prototype.next = function (aMotionData) {
    var motion = null;
    var i = 0;
    var complete = true;
    for (i = 0; i < aMotionData.length; i++) {
        motion = aMotionData[i];
        if (Math.abs(motion.target - motion.cur) <= Math.abs(motion.speed)) {
            motion.cur = motion.target
        } else {
            motion.cur += motion.speed;
            complete = false
        }
    }
    if (complete) {
        for (i = 0; i < aMotionData.length; i++) {
            aMotionData[i].cur = aMotionData[i].target;
            aMotionData[i].speed = 0
        }
        return true
    }
    return false
};
function EffectElasticity(fDistanceCoefficient, fDampingCoefficient) {
    this.distanceCoefficient = fDistanceCoefficient;
    this.dampingCoefficient = fDampingCoefficient
}
EffectElasticity.prototype.initMotion = function (aMotionData) { };
EffectElasticity.prototype.next = function (aMotionData) {
    var motion = null;
    var i = 0;
    var complete = true;
    for (i = 0; i < aMotionData.length; i++) {
        motion = aMotionData[i];
        motion.speed += (motion.target - motion.cur) / this.distanceCoefficient;
        motion.speed *= this.dampingCoefficient;
        if (Math.abs(motion.speed) > motion.speedMax) {
            motion.speed = (motion.speed > 0) ? motion.speedMax : -motion.speedMax
        }
        motion.cur += motion.speed;
        if (Math.abs(motion.speed) >= 1 || Math.abs(motion.target - motion.cur) >= 1) {
            complete = false
        }
    }
    if (complete) {
        for (i = 0; i < aMotionData.length; i++) {
            aMotionData[i].cur = aMotionData[i].target;
            aMotionData[i].speed = 0
        }
        return true
    }
    return false
};
function FormVerifier(errorColor) {
    this.errorColor = errorColor;
    this.verifyItems = []
}
FormVerifier.prototype.addVerifyItem = function (elementsToVerify, arrTypes, arrErrorText) {
    var arrFn = [];
    var errorDiv = null;
    var i;
    for (i = 0; i < arrTypes.length; i++) {
        switch (arrTypes[i]) {
            case 'notnull':
                arrFn[i] = FormVerifier.verifyNotNull;
                break;
            case 'email':
                arrFn[i] = FormVerifier.verifyEmail;
                break;
            case 'tel':
                arrFn[i] = FormVerifier.verifyTel;
                break;
            default:
                arrFn[i] = FormVerifier.verifyNotNull;
                alert("unknow verify type:" + arrTypes[i])
        }
    }
    errorDiv = document.createElement("div");
    this.verifyItems.push({
        element: elementsToVerify,
        arrVerifyFn: arrFn,
        arrText: arrErrorText,
        isDefault: false,
        div: errorDiv
    });
    if (elementsToVerify.nextSibling()) {
        elementsToVerify.parentNode.insertChild(errorDiv, elementsToVerify.nextSibling())
    } else {
        elementsToVerify.parentNode.appendChild(errorDiv)
    }
    errorDiv.innerHTML = 'asdf'
};
FormVerifier.prototype.doCheck = function () {
    var i;
    var j;
    var isOk = true;
    for (i = 0; i < this.verifyItems.length; i++) {
        for (j = 0; j < this.verifyItems[i].arrVerifyFn.length; j++) {
            if (!this.verifyItems[i].arrVerifyFn[j](this.verifyItems[i].element)) {
                isOk = false;
                this.setError(this.verifyItems[i].element, this.verifyItems[i].arrErrorText[j], this.errorColor);
                break
            }
        }
    }
    return isOk
};
FormVerifier.prototype.setError = function (element, text, color) { };
FormVerifier.prototype.verifyNotNull = function (element) { };
FormVerifier.prototype.verifyEmail = function (element) { };
FormVerifier.prototype.verifyTel = function (element) { };
function ImgGallery(parent, sContainerId, sContentId, aImgDatas, iVSpace, iHSpace) {
    var obj = this;
    this.__aExpandDivs__ = [];
    this.__aShrinkDivs__ = [];
    this.__aDownBtn__ = [];
    this.oEMInfo = null;
    this.__iZIndexBase__ = 2;
    this.__iImgSmallWidth__ = 120;
    this.__iImgSmallHeight__ = 90;
    this.__iImgSmallMaxWidth__ = 150;
    this.__iImgSmallMaxHeight__ = 2 * this.__iImgSmallHeight__ - 70;
    this.__iImgBigMaxWidth__ = 4 * this.__iImgSmallWidth__;
    this.__iImgBigMaxHeight__ = 4 * this.__iImgSmallHeight__;
    this.__iWidth__ = 908;
    this.__iHeight__ = 520;
    this.__scrollBarHeight__ = 20;
    this.__aImgDatas__ = aImgDatas;
    this.iVSpace = iVSpace;
    this.iHSpace = iHSpace;
    this.__container__ = parent;
    this.__rowCount__ = 3;
    this.__colCount__ = 0;
    this.totalWidth = 0;
    this.totalHeight = 0;
    this.__oDivContainer__ = document.getElementById(sContainerId);
    this.__oDivContainer__.style.width = this.__iWidth__ + "px";
    this.__oDivContainer__.style.height = this.__iHeight__ - this.__scrollBarHeight__ + "px";
    this.__oDivContent__ = document.getElementById(sContentId);
    this.__oDivContent__.style.height = this.__iHeight__ - this.__scrollBarHeight__ + "px";
    this.__oDivContent__.style.top = "0px";
    this.__oDivContent__.style.left = "0px";
    this.__oDivOuter__ = document.createElement('div');
    this.__oDivOuter__.style.display = 'none';
    this.__oDivOuter__.style.background = 'white';
    this.__oDivOuter__.style.width = '100%';
    this.__oDivOuter__.style.filter = 'alpha(opacity=0)';
    this.__oDivOuter__.style.opacity = '0';
    this.__oDivOuter__.style.top = '0px';
    this.__oDivOuter__.style.left = '0px';
    this.__oDivOuter__.style.position = 'absolute';
    this.__oDivOuter__.style.zIndex = '3001';
    this.__oDivOuter__.style.overflow = 'hidden';
    this.__oDivOuter__.style.height = document.body.offsetHeight + "px";
    document.body.appendChild(this.__oDivOuter__);
    this.__imgElements__ = [];
    this.__activeBigEM__ = null;
    this.__disactiveBigEM__ = null;
    this.__lastActiveBigEMGalleryIndex__ = -1;
    this.__stopingActiveBigEMGalleryIndex__ = -1;
    this.__createImgs__();
    this.__oDivContent__.style.width = this.totalWidth + "px";
    this.__scrollBar__ = null;
    this.__mountScrollBar__();
    this.__oEm__ = new MoveLib([0], [40],
    function (arr) {
        obj.__oDivContent__.style.left = arr[0].cur + "px"
    },
    function (arr) { },
    MoveLibType.BUFFER);
    this.__oDraging__ = new PerfectDrag(this.__oDivContent__,
    function () {
        return {
            x: obj.__oDivContent__.offsetLeft,
            y: 0
        }
    },
    function (x, y) {
        var left = 0;
        if (x < -(obj.totalWidth - obj.__iWidth__)) {
            left = -(obj.totalWidth - obj.__iWidth__)
        } else if (x > 0) {
            left = 0
        } else {
            left = x
        }
        if (!obj.__scrollBar__.bDraging) {
            obj.__scrollBar__.setValue((-left) / (obj.totalWidth - obj.__iWidth__))
        }
    },
    function () {
        obj.__oDivOuter__.style.display = 'block';
        obj.__oEm__.stop();
        obj.stopActiveBig()
    },
    function (x, y) {
        setTimeout(function () {
            obj.__oDivOuter__.style.display = 'none'
        },
        0)
    })
}
ImgGallery.prototype.__setLowSrc__ = function (imgElement, divElement) {
    var l = divElement.offsetLeft;
    var t = divElement.offsetTop;
    var w = divElement.offsetWidth;
    var h = divElement.offsetHeight;
    var bl = 0;
    var bt = 0;
    var bw = 0;
    var bh = 0;
    var targetL = 0;
    var targetImgW = 0;
    var targetImgH = 0;
    var targetImgL = 0;
    var targetImgT = 0;
    var galleryIndex = imgElement.galleryIndex;
    var obj = this;
    if (imgElement.width / imgElement.height >= this.__iImgSmallWidth__ / this.__iImgSmallHeight__) {
        if (imgElement.width >= this.__iImgSmallMaxWidth__) {
            w = this.__iImgSmallMaxWidth__;
            h = this.__iImgSmallMaxWidth__ * imgElement.height / imgElement.width
        } else {
            w = imgElement.width;
            h = imgElement.height
        }
    } else {
        if (imgElement.height >= this.__iImgSmallMaxHeight__) {
            h = this.__iImgSmallMaxHeight__;
            w = this.__iImgSmallMaxHeight__ * imgElement.width / imgElement.height
        } else {
            w = imgElement.width;
            h = imgElement.height
        }
    }
    l += (divElement.offsetWidth - w) / 2;
    t += (divElement.offsetHeight - h) / 2;
    divElement.style.width = w + "px";
    divElement.style.height = h + "px";
    divElement.style.left = l + "px";
    divElement.style.top = t + "px";
    imgElement.style.width = w + "px";
    imgElement.style.height = h + "px";
    divElement.appendChild(imgElement);
    imgElement.onload = null;
    this.__imgElements__[galleryIndex].smallTop = t;
    this.__imgElements__[galleryIndex].smallLeft = l;
    this.__imgElements__[galleryIndex].smallWidth = w;
    this.__imgElements__[galleryIndex].smallHeight = h;
    targetImgL = this.__imgElements__[galleryIndex].smallLeft;
    targetImgT = this.__imgElements__[galleryIndex].smallTop;
    if (this.__imgElements__[galleryIndex].smallWidth / this.__imgElements__[galleryIndex].smallHeight >= this.__iImgBigMaxWidth__ / this.__iImgBigMaxHeight__) {
        targetImgW = this.__iImgBigMaxWidth__;
        targetImgH = this.__iImgBigMaxWidth__ * this.__imgElements__[galleryIndex].smallHeight / this.__imgElements__[galleryIndex].smallWidth
    } else {
        targetImgH = this.__iImgBigMaxHeight__;
        targetImgW = this.__iImgBigMaxHeight__ * this.__imgElements__[galleryIndex].smallWidth / this.__imgElements__[galleryIndex].smallHeight
    }
    targetImgT = (this.__iHeight__ - targetImgH) / 2 - 55;
    targetImgL -= (targetImgW - this.__imgElements__[galleryIndex].smallWidth) / 2;
    targetL = -(targetImgL + targetImgW / 2) + this.__iWidth__ / 2;
    this.__imgElements__[galleryIndex].bigTop = targetImgT;
    this.__imgElements__[galleryIndex].bigLeft = targetImgL;
    this.__imgElements__[galleryIndex].bigWidth = targetImgW;
    this.__imgElements__[galleryIndex].bigHeight = targetImgH;
    this.__imgElements__[galleryIndex].bigContentLeft = targetL;
    imgElement.onclick = function () {
        obj.activeBig(galleryIndex)
    };
    imgElement.onmousedown = function (ev) {
        var oEvent = window.event || ev;
        if (oEvent.stopPropagation) {
            oEvent.stopPropagation()
        } else {
            oEvent.cancelBubble = true
        }
        return false
    }
};
ImgGallery.prototype.showTips = function (galleryIndex) {
    this.__aExpandDivs__[galleryIndex].style.display = 'block';
    this.__aShrinkDivs__[galleryIndex].style.display = 'none';
    this.__aExpandDivs__[galleryIndex].style.width = this.__imgElements__[galleryIndex].img.offsetWidth - 10 + 'px';
    this.__aShrinkDivs__[galleryIndex].style.width = this.__imgElements__[galleryIndex].img.offsetWidth + 'px';
    this.__aDownBtn__[galleryIndex].style.width = this.__imgElements__[galleryIndex].img.offsetWidth + 'px';
    if (this.__aExpandDivs__[galleryIndex].initHeight == 0) {
        this.__aExpandDivs__[galleryIndex].initHeight = this.__aExpandDivs__[galleryIndex].offsetHeight
    }
    this.oEMInfo.emImgIndex = galleryIndex;
    this.oEMInfo.pause = false;
    this.oEMInfo.setCurrent([0]);
    this.oEMInfo.setTarget([this.__aExpandDivs__[galleryIndex].initHeight])
};
ImgGallery.prototype.hideTips = function (galleryIndex) {
    this.oEMInfo.pause = true;
    this.__aExpandDivs__[galleryIndex].style.display = 'none';
    this.__aShrinkDivs__[galleryIndex].style.display = 'none'
};
ImgGallery.prototype.activeBig = function (galleryIndex) {
    var obj = this;
    if (this.__lastActiveBigEMGalleryIndex__ == galleryIndex) {
        return
    }
    if (this.__stopingActiveBigEMGalleryIndex__ == galleryIndex) {
        this.__disactiveBigEM__.stop()
    }
    obj.stopActiveBig();
    this.__oEm__.stop();
    this.__imgElements__[galleryIndex].div.style.zIndex = this.__iZIndexBase__++;
    this.__activeBigEM__ = new MoveLib([this.__imgElements__[galleryIndex].div.offsetTop, this.__imgElements__[galleryIndex].div.offsetLeft, this.__imgElements__[galleryIndex].img.offsetWidth, this.__imgElements__[galleryIndex].img.offsetHeight, this.__oDivContent__.offsetLeft], [40, 40, 40, 40, 40],
    function (arr) {
        obj.__imgElements__[galleryIndex].div.style.top = arr[0].cur + "px";
        obj.__imgElements__[galleryIndex].div.style.left = arr[1].cur + "px";
        obj.__imgElements__[galleryIndex].div.style.width = arr[2].cur + "px";
        obj.__imgElements__[galleryIndex].div.style.height = arr[3].cur + "px";
        obj.__imgElements__[galleryIndex].img.style.width = arr[2].cur + "px";
        obj.__imgElements__[galleryIndex].img.style.height = arr[3].cur + "px";
        obj.__scrollBar__.setValue(-arr[4].cur / (obj.totalWidth - obj.__iWidth__))
    },
    function () {
        obj.showTips(galleryIndex);
        if (!obj.__imgElements__[galleryIndex].bigImg) {
            obj.__imgElements__[galleryIndex].bigImg = document.createElement('img');
            obj.__imgElements__[galleryIndex].bigImgLoaded = false;
            obj.__imgElements__[galleryIndex].bigImg.onload = function () {
                obj.__imgElements__[galleryIndex].bigImgLoaded = true;
                obj.__imgElements__[galleryIndex].img.src = obj.__imgElements__[galleryIndex].bigImg.src
            };
            obj.__imgElements__[galleryIndex].bigImg.src = obj.__aImgDatas__[galleryIndex].high
        } else {
            if (obj.__imgElements__[galleryIndex].bigImgLoaded) {
                obj.__imgElements__[galleryIndex].img.src = obj.__imgElements__[galleryIndex].bigImg.src
            }
        }
    },
    MoveLibType.ELASTICITY);
    this.__activeBigEM__.setTarget([this.__imgElements__[galleryIndex].bigTop, this.__imgElements__[galleryIndex].bigLeft, this.__imgElements__[galleryIndex].bigWidth, this.__imgElements__[galleryIndex].bigHeight, this.__imgElements__[galleryIndex].bigContentLeft]);
    this.__lastActiveBigEMGalleryIndex__ = galleryIndex
};
ImgGallery.prototype.stopActiveBig = function () {
    if (null == this.__activeBigEM__) {
        return
    }
    var obj = this;
    var galleryIndex = this.__lastActiveBigEMGalleryIndex__;
    this.__lastActiveBigEMGalleryIndex__ = -1;
    this.__activeBigEM__.stop();
    this.__activeBigEM__ = null;
    obj.__imgElements__[galleryIndex].img.src = this.__aImgDatas__[galleryIndex].low;
    this.__disactiveBigEM__ = new MoveLib([this.__imgElements__[galleryIndex].div.offsetTop, this.__imgElements__[galleryIndex].div.offsetLeft, this.__imgElements__[galleryIndex].img.offsetWidth, this.__imgElements__[galleryIndex].img.offsetHeight], [40, 40, 40, 40],
    function (arr) {
        obj.__imgElements__[galleryIndex].div.style.top = arr[0].cur + "px";
        obj.__imgElements__[galleryIndex].div.style.left = arr[1].cur + "px";
        obj.__imgElements__[galleryIndex].div.style.width = arr[2].cur + "px";
        obj.__imgElements__[galleryIndex].div.style.height = arr[3].cur + "px";
        obj.__imgElements__[galleryIndex].img.style.width = arr[2].cur + "px";
        obj.__imgElements__[galleryIndex].img.style.height = arr[3].cur + "px"
    },
    function () { },
    MoveLibType.ELASTICITY);
    this.__disactiveBigEM__.setTarget([this.__imgElements__[galleryIndex].smallTop, this.__imgElements__[galleryIndex].smallLeft, this.__imgElements__[galleryIndex].smallWidth, this.__imgElements__[galleryIndex].smallHeight]);
    this.__stopingActiveBigEMGalleryIndex__ = galleryIndex;
    this.hideTips(galleryIndex)
};
ImgGallery.prototype.__createImgs__ = function () {
    var imgIndex = 0;
    var row = 0;
    var col = 0;
    var obj = this;
    this.oEMInfo = new MoveLib([0], [40],
    function (arr) {
        var index = this.emImgIndex;
        if (arr[0].cur < 0) {
            obj.__aExpandDivs__[index].style.display = 'none';
            obj.__aShrinkDivs__[index].style.display = 'block';
            return
        }
        obj.__aExpandDivs__[index].style.height = arr[0].cur + 'px'
    },
    function (arr) {
        var index = this.emImgIndex;
        if (arr[0].target == 0) {
            obj.__aExpandDivs__[index].style.display = 'none';
            obj.__aShrinkDivs__[index].style.display = 'block'
        }
    },
    MoveLibType.ELASTICITY);
    this.oEMInfo.emImgIndex = 0;
    if (this.__aImgDatas__.length) {
        while (true) {
            for (row = 0; row < this.__rowCount__; row++) {
                this.__imgElements__[imgIndex] = {};
                this.__imgElements__[imgIndex].div = document.createElement("li");
                this.__imgElements__[imgIndex].div.style.position = 'absolute';
                this.__imgElements__[imgIndex].div.style.width = this.__iImgSmallWidth__ + 'px';
                this.__imgElements__[imgIndex].div.style.height = this.__iImgSmallHeight__ + 'px';
                this.__imgElements__[imgIndex].div.style.top = (row + 0.5) * (this.__iImgSmallMaxHeight__ + this.iVSpace) - this.__iImgSmallHeight__ / 2 + 'px';
                this.__imgElements__[imgIndex].div.style.left = (col + 0.5) * (this.__iImgSmallMaxWidth__ + this.iHSpace) - this.__iImgSmallWidth__ / 2 + 0.5 * this.__iImgBigMaxWidth__ + 'px';
                this.__imgElements__[imgIndex].div.className = 'galleryImgDivBeforeLoad';
                this.__imgElements__[imgIndex].div.style.zIndex = '1';
                this.__oDivContent__.appendChild(this.__imgElements__[imgIndex].div);
                this.__imgElements__[imgIndex].row = row;
                this.__imgElements__[imgIndex].col = col;
                this.__imgElements__[imgIndex].index = imgIndex;
                this.__imgElements__[imgIndex].smallTop = 0;
                this.__imgElements__[imgIndex].smallLeft = 0;
                this.__imgElements__[imgIndex].smallWidth = 0;
                this.__imgElements__[imgIndex].smallHeight = 0;
                this.__imgElements__[imgIndex].bigTop = 0;
                this.__imgElements__[imgIndex].bigLeft = 0;
                this.__imgElements__[imgIndex].bigWidth = 0;
                this.__imgElements__[imgIndex].bigHeight = 0;
                this.__imgElements__[imgIndex].img = document.createElement("img");
                this.__imgElements__[imgIndex].img.galleryIndex = imgIndex;
                this.__imgElements__[imgIndex].img.style.cursor = 'pointer';
                this.__imgElements__[imgIndex].bigImg = null;
                this.__aExpandDivs__[imgIndex] = document.createElement('div');
                this.__aExpandDivs__[imgIndex].className = 'pic_info';
                this.__aExpandDivs__[imgIndex].style.display = 'none';
                this.__aExpandDivs__[imgIndex].style.overflow = 'hidden';
                this.__aExpandDivs__[imgIndex].style.zIndex = '3';
                this.__imgElements__[imgIndex].div.appendChild(this.__aExpandDivs__[imgIndex]);
                this.__aDownBtn__[imgIndex] = document.createElement('div');
                this.__aDownBtn__[imgIndex].className = 'down_btn';
                this.__aDownBtn__[imgIndex].title = '收缩';
                this.__aExpandDivs__[imgIndex].appendChild(this.__aDownBtn__[imgIndex]);
                oTextBlock = document.createElement('p');
                oTextBlock.innerHTML = '<strong>' + this.__aImgDatas__[imgIndex].name + '</strong><br />' + this.__aImgDatas__[imgIndex].content;
                this.__aExpandDivs__[imgIndex].appendChild(oTextBlock);
                this.__aShrinkDivs__[imgIndex] = document.createElement('div');
                this.__aShrinkDivs__[imgIndex].className = 'up_btn';
                this.__aShrinkDivs__[imgIndex].title = '展开';
                this.__aShrinkDivs__[imgIndex].style.display = 'none';
                this.__aShrinkDivs__[imgIndex].style.zIndex = '3';
                this.__imgElements__[imgIndex].div.appendChild(this.__aShrinkDivs__[imgIndex]);
                this.__aExpandDivs__[imgIndex].initHeight = 0;
                this.__aDownBtn__[imgIndex].emImgIndex = imgIndex;
                this.__aDownBtn__[imgIndex].onmousedown = function (ev) {
                    var oEvent = window.event || ev;
                    if (oEvent.stopPropagation) {
                        oEvent.stopPropagation()
                    } else {
                        oEvent.cancelBubble = true
                    }
                    if (obj.__aExpandDivs__[this.emImgIndex].initHeight == 0) {
                        obj.__aExpandDivs__[this.emImgIndex].initHeight = obj.__aExpandDivs__[this.emImgIndex].offsetHeight
                    }
                    obj.oEMInfo.emImgIndex = this.emImgIndex;
                    obj.oEMInfo.setCurrent([obj.__aExpandDivs__[this.emImgIndex].offsetHeight - 10]);
                    obj.oEMInfo.setTarget([0]);
                    return false
                };
                this.__aShrinkDivs__[imgIndex].emImgIndex = imgIndex;
                this.__aShrinkDivs__[imgIndex].onmousedown = function (ev) {
                    var oEvent = window.event || ev;
                    if (oEvent.stopPropagation) {
                        oEvent.stopPropagation()
                    } else {
                        oEvent.cancelBubble = true
                    }
                    obj.__aExpandDivs__[this.emImgIndex].style.display = 'block';
                    obj.__aShrinkDivs__[this.emImgIndex].style.display = 'none';
                    obj.oEMInfo.emImgIndex = this.emImgIndex;
                    obj.oEMInfo.setCurrent([0]);
                    obj.oEMInfo.setTarget([obj.__aExpandDivs__[this.emImgIndex].initHeight]);
                    obj.oEMInfo.pause = false;
                    return false
                };
                this.__aExpandDivs__[imgIndex].emImgIndex = imgIndex;
                imgIndex++;
                if (imgIndex >= this.__aImgDatas__.length) {
                    break
                }
            }
            if (imgIndex >= this.__aImgDatas__.length) {
                break
            }
            col++
        }
    }
    this.__colCount__ = col + 1;
    this.totalWidth = (col + 1) * this.__iImgSmallMaxWidth__ + (col + 2) * this.iHSpace + this.__iImgBigMaxWidth__;
    this.totalHeight = this.__rowCount__ * this.__iImgSmallMaxHeight__ + (this.__rowCount__ - 1) * this.iVSpace;
    for (imgIndex = 0; imgIndex < this.__aImgDatas__.length; imgIndex++) {
        this.__imgElements__[imgIndex].img.onload = function () {
            obj.__setLowSrc__(obj.__imgElements__[this.galleryIndex].img, obj.__imgElements__[this.galleryIndex].div)
        };
        this.__imgElements__[imgIndex].img.src = this.__aImgDatas__[imgIndex].low
    }
};
ImgGallery.prototype.__mountScrollBar__ = function () {
    var w = this.totalWidth - this.__iWidth__;
    var obj = this;
    var vSpace = 20;
    this.__scrollBar__ = new MiaoVHScrollBar(this.__container__, vSpace, this.__iHeight__ - this.__scrollBarHeight__ - 55, this.__iWidth__ - 2 * vSpace, 17,
    function (value) {
        if (obj.__bDirectMove__) {
            obj.__oDivContent__.style.left = -w * value + "px";
            obj.__oEm__.setCurrent([-w * value])
        } else {
            obj.__oEm__.setTarget([-w * value])
        }
    },
    this.__iWidth__ * this.__iWidth__ / this.totalWidth,
    function () {
        obj.__oEm__.stop()
    });
    this.__scrollBar__.makeUp('scroll_right_normal', 'scroll_left_normal', 'ball_x_bg', 'ball_x')
};
ImgGallery.prototype.setValue = function (fPos) {
    this.__bDirectMove__ = true;
    this.__scrollBar__.setValue(fPos);
    this.__bDirectMove__ = false
};
function ImgViewer(aImgs, oContainer) {
    var obj = this;
    this.__aImgs__ = aImgs;
    this.__imgScaleLimit__ = 0.5;
    this.__distanceMax__ = 1000;
    this.__imgSpace__ = 160;
    this.__contentWidth__ = 800;
    this.__contentHeight__ = 490;
    this.__imgWidth__ = 266;
    this.__imgHeight__ = 334;
    this.__totalWidth__ = 0;
    this.__oImgViewer__ = oContainer;
    this.__iCurrentTop__ = -1;
    this.__oImgViewerContent__ = document.createElement('div');
    this.__oImgViewerContent__.style.height = this.__contentHeight__ + 'px';
    this.__oImgViewerContent__.style.position = 'relative';
    this.__oImgViewer__.appendChild(this.__oImgViewerContent__);
    this.__oWorkInfoTips__ = null;
    this.__oWorkInfoTipsText__ = null;
    this.__createTips__();
    this.__em__ = new MoveLib([0], [160],
    function (arr) {
        obj.__fixItems__(arr[0].cur)
    },
    function () { },
    MoveLibType.BUFFER);
    this.__createImages__();
    this.__fixItems__(0);
    this.__scrollBar__ = new MiaoVHScrollBar(obj.__oImgViewer__, 18, obj.__contentHeight__ - 80, obj.__contentWidth__, 17,
    function (value) {
        obj.__em__.setTarget([value * obj.__totalWidth__])
    },
    this.__contentWidth__ * obj.__oImgViewer__.offsetWidth / obj.__totalWidth__,
    function () { });
    this.__scrollBar__.makeUp('scroll_right_normal', 'scroll_left_normal', 'ball_x_bg', 'ball_x')
}
ImgViewer.prototype.__calcImagePos__ = function (scale, width, height) {
    var curWidth = scale * width;
    var curHeight = scale * height;
    var oResult = {};
    oResult.top = (height - curHeight) / 2;
    oResult.width = curWidth;
    oResult.height = curHeight;
    return oResult
};
ImgViewer.prototype.__calcImagesSize__ = function (width, limit, distanceMax, pos, imgCount) {
    var arrScale = new Array();
    var arrLeft = new Array();
    var arrZIndex = new Array();
    var sumWidth = width * imgCount;
    var i = 0;
    var j = 0;
    var x = 0;
    var distance = 0;
    var scale = 0;
    var w = 0;
    var zIndexBase = imgCount;
    var orgPos = pos;
    for (i = 0; i < imgCount; i++) {
        x = i * width + 0.5 * width;
        distance = pos - x;
        if (Math.abs(distance) <= distanceMax) {
            scale = 1 - Math.abs(distance) / distanceMax
        } else {
            scale = limit
        }
        if (scale < limit) {
            scale = limit
        }
        w = width * scale;
        arrScale[i] = scale;
        if (i > 0 && scale > arrScale[i - 1]) {
            j = i
        }
        arrLeft[i] = -distance - w / 2 + this.__contentWidth__ / 2
    }
    for (i = j; i >= 0; i--) {
        arrZIndex[i] = zIndexBase - (j - i)
    }
    for (i = j + 1; i < imgCount; i++) {
        arrZIndex[i] = zIndexBase - (i - j)
    }
    this.__totalWidth__ = sumWidth;
    return {
        sum_width: sumWidth,
        arr_width: arrScale,
        arr_left: arrLeft,
        arr_zIndex: arrZIndex,
        current_index: j
    }
};
ImgViewer.prototype.__fixItems__ = function (pos) {
    var objImageData = this.__calcImagesSize__(this.__imgSpace__, this.__imgScaleLimit__, this.__distanceMax__, pos, this.__aImgs__.length);
    var posImage = null;
    var opacity = 0;
    var i;
    this.__oImgViewerContent__.width = objImageData.sum_width + "px";
    for (i = 0; i < this.__aImgs__.length; i++) {
        posImage = this.__calcImagePos__(objImageData.arr_width[i], this.__imgWidth__, this.__imgHeight__);
        this.__aImgs__[i].oCtrl.style.top = posImage.top * 1 / 2 + "px";
        this.__aImgs__[i].oCtrl.style.left = objImageData.arr_left[i] + "px";
        this.__aImgs__[i].oCtrl.style.width = posImage.width + "px";
        this.__aImgs__[i].oCtrl.style.height = posImage.height + "px";
        this.__aImgs__[i].oCtrl.style.zIndex = objImageData.arr_zIndex[i];
        opacity = objImageData.arr_width[i];
        this.__aImgs__[i].oCtrl.style.filter = "alpha(opacity=" + Math.ceil(opacity * 100) + ")";
        this.__aImgs__[i].oCtrl.style.opacity = opacity
    }
    if (this.__iCurrentTop__ != objImageData.current_index) {
        this.__showTips__(objImageData.current_index);
        this.__iCurrentTop__ = objImageData.current_index
    }
    this.__oWorkInfoTips__.style.top = this.__aImgs__[this.__iCurrentTop__].oCtrl.offsetTop + this.__aImgs__[this.__iCurrentTop__].oCtrl.offsetHeight * 0.7 + 'px';
    this.__oWorkInfoTips__.style.left = this.__aImgs__[this.__iCurrentTop__].oCtrl.offsetLeft + (this.__aImgs__[this.__iCurrentTop__].oCtrl.offsetWidth - this.__oWorkInfoTips__.offsetWidth) / 2 + 'px'
};
ImgViewer.prototype.__createTips__ = function () {
    var oAdorn = null;
    var oBg = null;
    this.__oWorkInfoTips__ = document.createElement('div');
    this.__oWorkInfoTips__.id = 'photo_info';
    this.__oWorkInfoTips__.style.display = 'none';
    oAdorn = document.createElement('div');
    oAdorn.className = 'adorn';
    this.__oWorkInfoTipsText__ = document.createElement('p');
    oBg = document.createElement('div');
    oBg.className = 'bg';
    this.__oWorkInfoTips__.appendChild(oAdorn);
    this.__oWorkInfoTips__.appendChild(this.__oWorkInfoTipsText__);
    this.__oWorkInfoTips__.appendChild(oBg);
    this.__oImgViewerContent__.appendChild(this.__oWorkInfoTips__)
};
ImgViewer.prototype.__showTips__ = function (index) {
    this.__oWorkInfoTipsText__.innerHTML = this.__aImgs__[index].info;
    this.__oWorkInfoTips__.style.display = 'block'
};
ImgViewer.prototype.__createImages__ = function () {
    var img = null;
    var i = 0;
    var obj = this;
    for (i = 0; i < this.__aImgs__.length; i++) {
        this.__aImgs__[i].oImgOnPage = document.createElement("img");
        this.__aImgs__[i].oImgOnPage.src = 'images/lightbox-ico-loading.gif';
        this.__aImgs__[i].oImgOnPage.alt = this.__aImgs__[i].alt;
        this.__aImgs__[i].oImgOnPage.style.height = this.__imgHeight__ + "px";
        this.__aImgs__[i].oImgOnPage.style.position = "absolute";
        this.__aImgs__[i].oImgOnPage.style.left = "0px";
        this.__aImgs__[i].oImgOnPage.style.top = "0px";
        this.__aImgs__[i].oImgOnPage.style.cursor = "pointer";
        this.__aImgs__[i].oImgOnPage.imgIndex = i;
        this.__aImgs__[i].oImgOnPage.onclick = function () {
            obj.gotoImg(this.imgIndex)
        };
        this.__aImgs__[i].oDiv = document.createElement("div");
        this.__aImgs__[i].oDiv.style.background = 'url(images/lightbox-ico-loading.gif) no-repeat center center';
        this.__aImgs__[i].oDiv.style.height = this.__imgHeight__ + "px";
        this.__aImgs__[i].oDiv.style.position = "absolute";
        this.__aImgs__[i].oDiv.style.left = "0px";
        this.__aImgs__[i].oDiv.style.top = "0px";
        this.__aImgs__[i].oDiv.style.cursor = "pointer";
        this.__aImgs__[i].oCtrl = this.__aImgs__[i].oDiv;
        this.__oImgViewerContent__.appendChild(this.__aImgs__[i].oDiv);
        this.__aImgs__[i].oImg = document.createElement('img');
        this.__aImgs__[i].oImg.imgIndex = i;
        this.__aImgs__[i].oImg.onload = function () {
            var index = this.imgIndex;
            obj.__aImgs__[index].oImgOnPage.src = obj.__aImgs__[index].src;
            obj.__aImgs__[index].oImg = null;
            obj.__aImgs__[index].oImgOnPage.style.zIndex = obj.__aImgs__[index].oDiv.style.zIndex;
            obj.__aImgs__[index].oImgOnPage.style.position = obj.__aImgs__[index].oDiv.style.position;
            obj.__aImgs__[index].oImgOnPage.style.filter = obj.__aImgs__[index].oDiv.style.filter;
            obj.__aImgs__[index].oImgOnPage.style.width = obj.__aImgs__[index].oDiv.style.width;
            obj.__aImgs__[index].oImgOnPage.style.background = obj.__aImgs__[index].oDiv.style.background;
            obj.__aImgs__[index].oImgOnPage.style.height = obj.__aImgs__[index].oDiv.style.height;
            obj.__aImgs__[index].oImgOnPage.style.top = obj.__aImgs__[index].oDiv.style.top;
            obj.__aImgs__[index].oImgOnPage.style.cursor = obj.__aImgs__[index].oDiv.style.cursor;
            obj.__aImgs__[index].oImgOnPage.style.left = obj.__aImgs__[index].oDiv.style.left;
            obj.__aImgs__[index].oImgOnPage.style.opacity = obj.__aImgs__[index].oDiv.style.opacity;
            obj.__oImgViewerContent__.removeChild(obj.__aImgs__[index].oDiv);
            obj.__oImgViewerContent__.appendChild(obj.__aImgs__[index].oImgOnPage);
            obj.__aImgs__[index].oCtrl = obj.__aImgs__[index].oImgOnPage;
            obj.__aImgs__[index].oDiv = null
        };
        this.__aImgs__[i].oImg.src = this.__aImgs__[i].src
    }
};
ImgViewer.prototype.gotoImg = function (index) {
    var l = 0;
    if (index < 0) {
        index = 0
    } else if (index >= this.__aImgs__.length) {
        index = this.__aImgs__.length - 1
    }
    l = 95 + index * this.__imgSpace__;
    this.__scrollBar__.setValue(l / this.__totalWidth__)
};
function initPhoto(aImgs) {
    var oIndexPhotoContainer = document.getElementById('index_photo_container');
    var aIndexPhotoSmallImgs = [];
    var aIndexPhotoBigImgs = [];
    var aIndexPhotoSmallDivs = [];
    var aIndexPhotoBigDivs = [];
    var aIndexPhotoDds = [];
    var oIndexPhotoA = null;
    var aIndexPhotoStatus = [];
    var ImageStatus = {
        BIG: 1,
        SMALL: 2
    };
    var aEM = [];
    var iSmallWidth = 95;
    var iSmallHeight = 95;
    var iBigWidth = 151;
    var iBigHeight = 151;
    var fnChange = null;
    var oMapDuckType = [];
    var fnDuck = null;
    var oTimerRecover = null;
    var iNowRecoverIndex = 0;
    var bIdle = true;
    var oIdleTimer = null;
    var fnTimer = null;
    var fnMoveTo = null;
    var iZIndexBase = 2;
    var i;
    for (i = 0; i < aImgs.length; i++) {
        aIndexPhotoDds[i] = document.createElement('dd');
        aIndexPhotoDds[i].style.zIndex = '1';
        aIndexPhotoDds[i].style.position = 'relative';
        aIndexPhotoSmallDivs[i] = document.createElement('div');
        aIndexPhotoSmallDivs[i].className = 'jpg_normal';
        aIndexPhotoDds[i].appendChild(aIndexPhotoSmallDivs[i]);
        oIndexPhotoA = document.createElement('a');
        oIndexPhotoA.href = 'photo.html.php';
        oIndexPhotoA.target = '_self';
        aIndexPhotoSmallDivs[i].appendChild(oIndexPhotoA);
        aIndexPhotoSmallImgs[i] = document.createElement('img');
        aIndexPhotoSmallImgs[i].src = aImgs[i].smallSrc;
        aIndexPhotoSmallImgs[i].alt = aImgs[i].smallAlt;
        aIndexPhotoSmallImgs[i].style.width = iSmallWidth + 'px';
        aIndexPhotoSmallImgs[i].style.height = iSmallHeight + 'px';
        oIndexPhotoA.appendChild(aIndexPhotoSmallImgs[i]);
        aIndexPhotoBigDivs[i] = document.createElement('div');
        aIndexPhotoBigDivs[i].className = 'jpg_active';
        aIndexPhotoDds[i].appendChild(aIndexPhotoBigDivs[i]);
        oIndexPhotoA = document.createElement('a');
        oIndexPhotoA.href = 'photo.html.php';
        oIndexPhotoA.target = '_self';
        aIndexPhotoBigDivs[i].appendChild(oIndexPhotoA);
        aIndexPhotoBigImgs[i] = document.createElement('img');
        aIndexPhotoBigImgs[i].src = aImgs[i].bigSrc;
        aIndexPhotoBigImgs[i].alt = aImgs[i].bigAlt;
        aIndexPhotoBigImgs[i].style.width = iBigWidth + 'px';
        aIndexPhotoBigImgs[i].style.height = iBigHeight + 'px';
        oIndexPhotoA.appendChild(aIndexPhotoBigImgs[i]);
        oIndexPhotoContainer.appendChild(aIndexPhotoDds[i]);
        aIndexPhotoStatus[i] = ImageStatus.SMALL
    }
    fnChange = function (arr, imgIndex, sDirect, sDuckSide, bDuckBottom) {
        if (arr[0].cur > 0) {
            if (aIndexPhotoStatus[imgIndex] == ImageStatus.BIG) {
                aIndexPhotoStatus[imgIndex] = ImageStatus.SMALL;
                aIndexPhotoSmallDivs[imgIndex].style.display = 'block';
                aIndexPhotoBigDivs[imgIndex].style.display = 'none'
            }
            if (sDirect == 'h') {
                aIndexPhotoSmallImgs[imgIndex].style.width = arr[0].cur + 'px';
                aIndexPhotoSmallDivs[imgIndex].style.left = iSmallWidth / 2 - arr[0].cur / 2 + 'px'
            } else {
                aIndexPhotoSmallImgs[imgIndex].style.height = arr[1].cur + 'px';
                aIndexPhotoSmallDivs[imgIndex].style.top = iSmallHeight / 2 - arr[1].cur / 2 + 'px'
            }
        } else {
            if (aIndexPhotoStatus[imgIndex] == ImageStatus.SMALL) {
                aIndexPhotoStatus[imgIndex] = ImageStatus.BIG;
                aIndexPhotoSmallDivs[imgIndex].style.display = 'none';
                aIndexPhotoBigDivs[imgIndex].style.display = 'block';
                if (bDuckBottom) {
                    aIndexPhotoBigDivs[imgIndex].style.top = -iSmallHeight + 'px'
                }
            }
            if (sDirect == 'h') {
                if (sDuckSide == 'l') {
                    aIndexPhotoBigImgs[imgIndex].style.width = -arr[0].cur + 'px';
                    aIndexPhotoBigDivs[imgIndex].style.left = arr[0].cur / 2 + 'px'
                } else {
                    aIndexPhotoBigImgs[imgIndex].style.width = -arr[0].cur + 'px';
                    aIndexPhotoBigDivs[imgIndex].style.left = iSmallWidth + arr[0].cur / 2 + 'px'
                }
            } else {
                if (sDuckSide == 't') {
                    aIndexPhotoBigImgs[imgIndex].style.height = -arr[1].cur + 'px';
                    aIndexPhotoBigDivs[imgIndex].style.top = arr[1].cur / 2 + 'px'
                } else {
                    aIndexPhotoBigImgs[imgIndex].style.height = -arr[1].cur + 'px';
                    aIndexPhotoBigDivs[imgIndex].style.top = iSmallHeight + arr[1].cur / 2 + 'px'
                }
            }
        }
    };
    function freeChange(arr) {
        var imgIndex = this.imgIndex;
        if (arr[0].cur > 0) {
            if (aIndexPhotoStatus[imgIndex] == ImageStatus.BIG) {
                aIndexPhotoStatus[imgIndex] = ImageStatus.SMALL;
                aIndexPhotoSmallDivs[imgIndex].style.display = 'block';
                aIndexPhotoBigDivs[imgIndex].style.display = 'none'
            }
            aIndexPhotoSmallDivs[imgIndex].style.left = iSmallWidth / 2 - arr[0].cur / 2 + 'px';
            aIndexPhotoSmallDivs[imgIndex].style.top = iSmallHeight / 2 - arr[1].cur / 2 + 'px';
            aIndexPhotoSmallImgs[imgIndex].style.width = arr[0].cur + 'px';
            aIndexPhotoSmallImgs[imgIndex].style.height = arr[1].cur + 'px'
        } else {
            if (aIndexPhotoStatus[imgIndex] == ImageStatus.SMALL) {
                aIndexPhotoStatus[imgIndex] = ImageStatus.BIG;
                aIndexPhotoSmallDivs[imgIndex].style.display = 'none';
                aIndexPhotoBigDivs[imgIndex].style.display = 'block'
            }
            aIndexPhotoBigDivs[imgIndex].style.left = iSmallWidth / 2 + arr[0].cur / 2 + 'px';
            aIndexPhotoBigDivs[imgIndex].style.top = iSmallHeight / 2 + arr[1].cur / 2 + 'px';
            aIndexPhotoBigImgs[imgIndex].style.width = -arr[0].cur + 'px';
            aIndexPhotoBigImgs[imgIndex].style.height = -arr[1].cur + 'px'
        }
    };
    oMapDuckType['hl'] = function (arr) {
        fnChange(arr, this.imgIndex, 'h', 'l', false)
    };
    oMapDuckType['hr'] = function (arr) {
        fnChange(arr, this.imgIndex, 'h', 'r', false)
    };
    oMapDuckType['hlb'] = function (arr) {
        fnChange(arr, this.imgIndex, 'h', 'l', true)
    };
    oMapDuckType['hrb'] = function (arr) {
        fnChange(arr, this.imgIndex, 'h', 'r', true)
    };
    oMapDuckType['vt'] = function (arr) {
        fnChange(arr, this.imgIndex, 'v', 't', false)
    };
    oMapDuckType['vb'] = function (arr) {
        fnChange(arr, this.imgIndex, 'v', 'b', false)
    };
    oMapDuckType['free'] = freeChange;
    for (i = 0; i < aImgs.length; i++) {
        aIndexPhotoSmallImgs[i].imgIndex = i;
        aIndexPhotoBigImgs[i].imgIndex = i;
        if (!oMapDuckType[aImgs[i].duckType]) {
            alert('unknow duck type: ' + aImgs[i].duckType);
            fnDuck = fnChangeFree
        } else {
            fnDuck = oMapDuckType[aImgs[i].duckType]
        }
        aEM[i] = new MoveLib([iSmallWidth, iSmallHeight], [40, 40], fnDuck,
        function (arr) { },
        MoveLibType.BUFFER);
        aEM[i].imgIndex = i;
        fnMoveTo = function (index) {
            if (index >= aImgs.length) {
                index = aImgs.length
            }
            if (oTimerRecover) {
                clearTimeout(oTimerRecover);
                oTimerRecover = null
            }
            aIndexPhotoDds[index].style.zIndex = iZIndexBase++;
            aEM[index].setTarget([-iBigWidth, -iBigHeight]);
            for (j = 0; j < aEM.length; j++) {
                if (j != index) {
                    aEM[j].setTarget([iSmallWidth, iSmallHeight])
                }
            }
        };
        aIndexPhotoSmallImgs[i].onmouseover = function () {
            bIdle = false;
            fnMoveTo(this.imgIndex)
        };
        fnTimer = function () {
            aEM[iNowRecoverIndex].setTarget([iSmallWidth, iSmallHeight]);
            bIdle = true
        };
        aIndexPhotoBigImgs[i].onmouseout = function () {
            iNowRecoverIndex = this.imgIndex;
            oTimerRecover = setTimeout(fnTimer, 50)
        }
    }
}
function initQuirkyPopup() {
    var oDiv = document.getElementById('messageBoardContainer');
    var oDivContent = oDiv.getElementsByTagName('div')[0];
    var oText = oDiv.getElementsByTagName('div')[2];
    var aSpan = oText.getElementsByTagName('span');
    var oCloseBtn = oDiv.getElementsByTagName('a')[0];
    var oBtnShow = document.getElementById('quirkyPopupShowBtn');
    var w = 354;
    var h = 294;
    var i = 0;
    var t = document.body.scrollTop || document.documentElement.scrollTop;
    oDiv.style.left = (document.documentElement.clientWidth - w) / 2 + 'px';
    oDiv.style.top = t + (document.documentElement.clientHeight) / 2 + 'px';
    for (i = 0; i < aSpan.length; i++) {
        aSpan[i].onmousedown = function (ev) {
            miaovCancelBubble(window.event || ev);
            return false
        }
    }
    var oQP = new QuirkyPopup(oDiv, oDiv, oBtnShow, oCloseBtn, {
        x: w,
        y: h
    },
    function () {
        return {
            x: oDiv.offsetLeft,
            y: oDiv.offsetTop
        }
    },
    function () {
        return {
            x: oDiv.offsetWidth,
            y: oDiv.offsetHeight
        }
    },
    function (x, y) {
        oDiv.style.left = x + 'px';
        oDiv.style.top = y + 'px'
    },
    function (x, y) {
        oDivContent.style.top = (y - h) / 2 + 'px';
        oDivContent.style.left = (x - w) / 2 + 'px';
        oDiv.style.width = x + 'px';
        oDiv.style.height = y + 'px'
    });
    setTimeout(function () {
        oQP.initShow()
    },
    1000);
    if (/msie 6/i.test(navigator.userAgent) && !/msie 7/i.test(navigator.userAgent) && !/msie 8/i.test(navigator.userAgent)) {
        oBtnShow.style.position = 'absolute';
        miaovAppendEventListener(window, 'scroll',
        function () {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            oBtnShow.style.top = scrollTop + 'px'
        })
    }
}
function InputDefaultText(oInput, text, defaultColor) {
    var obj = this;
    this.input = oInput;
    this.text = text;
    this.defaultColor = defaultColor;
    this.timer = null;
    this.__doDefault__(this.input, text, defaultColor);
    this.onblur = function (ev) {
        var oEvent = window.event || ev;
        var oElement = oEvent.srcElement || oEvent.target;
        obj.__doDefault__(oElement);
        clearInterval(this.timer)
    };
    this.onfocus = function (ev) {
        var oEvent = window.event || ev;
        var oElement = oEvent.srcElement || oEvent.target;
        obj.__cancelDefault__(oElement);
        this.timer = setInterval(function () {
            obj.isDefault = obj.input.length == 0
        },
        30)
    };
    miaovAppendEventListener(this.input, 'blur', this.onblur);
    miaovAppendEventListener(this.input, 'focus', this.onfocus)
}
InputDefaultText.prototype.__doDefault__ = function (input) {
    if (input.value.length == 0) {
        this.isDefault = true;
        input.style.color = this.defaultColor;
        input.value = this.text
    } else {
        this.isDefault = false
    }
};
InputDefaultText.prototype.__cancelDefault__ = function (input) {
    if (this.isDefault) {
        input.style.color = '';
        input.value = ""
    }
};
InputDefaultText.prototype.remove = function () {
    miaovRemoveEventListener(this.input, 'blur', this.onblur);
    miaovRemoveEventListener(this.input, 'focus', this.onfocus);
    this.input.style.color = ''
};
function ScrollBar(o) {
    this.__obj__ = document.getElementById(o);
    if (!this.__obj__) return null;
    this.__aA__ = this.__obj__.getElementsByTagName("a");
    this.__oP__ = this.__obj__.getElementsByTagName("p")[0];
    this.__w__ = 0;
    this.__i__ = 0;
    this.__fontSize__ = 14;
    this.__aArr__ = [];
    this.__timer__ = null;
    this.__speed__ = 0;
    this.__oP__.innerHTML += this.__oP__.innerHTML;
    for (__i__ = 0; __i__ < this.__aA__.length; __i__ += 1) {
        this.__aArr__.push(this.__aA__[__i__])
    }
    for (__i__ = 0; __i__ < this.__aArr__.length; __i__ += 1) {
        this.__aA__[__i__].style.width = this.__aArr__[__i__].innerHTML.length * this.__fontSize__ + this.__fontSize__ + "px";
        this.__w__ += this.__aA__[__i__].offsetWidth
    }
    this.__oP__.style.width = this.__w__ + "px";
    this.__scrollMove__();
    var that = this;
    this.__oP__.onmouseover = function () {
        clearInterval(that.__timer__);
        that.__timer__ = null
    };
    this.__oP__.onmouseout = function () {
        that.__scrollMove__()
    }
}
ScrollBar.prototype.__scrollMove__ = function () {
    var that = this;
    this.__timer__ = setInterval(function () {
        that.__speed__ -= that.__fontSize__ / 7;
        if (Math.abs(that.__speed__) > that.__oP__.offsetWidth / 2) {
            that.__speed__ = 0
        }
        that.__oP__.style.left = that.__speed__ + "px"
    },
    35)
};

function initMessageBox() {
    var messageBox = document.getElementById('messageBox');
    var messageBoxTitle = document.getElementById('messageBoxTitle');
    var messageContent = document.getElementById('message_content');
    var messageContentSucc = document.getElementById('message_content_succ');
    var messageBoxEm = null;
    var messageBoxRecoverEm = null;
    var messageBoxCloseButton = document.getElementById('messageBoxCloseButton');
    var messageBoxDraging = null;
    var bMessageBoxDrog = false;
    var bMessageBoxSubmitBtn = document.getElementById('message_form_submit_btn');
    var messageBoxInitLeft = messageBox.offsetLeft;
    var messageBoxInitTop = messageBox.offsetTop;
    var messageBoxInitWidth = messageBox.offsetWidth;
    var messageBoxInitHeight = messageContent.offsetHeight;
    var inputMsgTitle = document.getElementById('msg_title');
    var inputMsgName = document.getElementById('msg_name');
    var inputMsgEmail = document.getElementById('msg_email');
    var inputMsgContent = document.getElementById('msg_content');
    var inputMsgVerify = document.getElementById('msg_verify');
    var messageBoxInputEm = null;
    var formVerifier = new FormVerifier('#F00');
    var messageSearchForm = document.getElementById('messageSearchForm');
    var aAutoExpandInput = [inputMsgName, inputMsgEmail, inputMsgContent, inputMsgVerify];
    var aAutoExpandHeight = [130, 218, 252, 278];
    var iMinAutoExpandHeight = messageBoxInitHeight;
    var oAutoExpandTimer = null;
    var oEMAutoShow = null;
    var i;
    oEMAutoShow = new MoveLib([0, 0], [40, 40],
    function (arr) {
        messageBox.style.left = arr[0].cur + "px";
        messageBox.style.top = arr[1].cur + "px"
    },
    function () { },
    MoveLibType.ELASTICITY);
    function addMessageDirect(title, name, content) {
        var messageContainer = document.getElementById('message_content_list');
        var aLi = messageContainer.getElementsByTagName('li');
        var oLi = document.createElement('li');
        var oDate = new Date();
        var sTime = oDate.pattern("yyyy-MM-dd HH:mm:ss");
        var iInitHeight = 0;
        var oLib = null;
        oLi.innerHTML = "<h3>" + htmlEncode(title) + "</h3>" + "<h4>[" + htmlEncode(name) + "] " + sTime + "</h4>" + "<p>" + htmlEncode(content) + "</p>" + "<p class=\"reply\">" + g_message_addMessageDirect1 + "<br />" + "</p>";
        oLi.onmouseover = function () {
            this.style.background = '#F6F6F6'
        };
        oLi.onmouseout = function () {
            this.style.background = ''
        };
        if (aLi.length > 0) {
            messageContainer.insertBefore(oLi, aLi[0])
        } else {
            messageContainer.innerHTML = '';
            messageContainer.appendChild(oLi);
            setTimeout(function () {
                window.location = '?'
            },
            3000)
        }
        iInitHeight = oLi.offsetHeight - 20;
        oLi.style.height = '0px';
        oLi.style.overflow = 'hidden';
        oLib = new MoveLib([0], [40],
        function (arr) {
            oLi.style.height = arr[0].cur + 'px'
        },
        function () { },
        MoveLibType.COLLISION);
        oLib.setTarget([iInitHeight])
    }
    messageBoxEm = new MoveLib([messageBoxInitWidth, messageBoxInitHeight], [40, 40],
    function (arr) {
        messageBox.style.width = arr[0].cur + "px";
        messageContent.style.width = arr[0].cur - 11 + "px";
        messageContentSucc.style.width = arr[0].cur + "px";
        inputMsgTitle.style.width = arr[0].cur - 80 + "px";
        inputMsgName.style.width = arr[0].cur - 80 + "px";
        inputMsgEmail.style.width = arr[0].cur - 80 + "px";
        inputMsgContent.style.width = arr[0].cur - 80 + "px";
        inputMsgTitle.parentNode.style.width = arr[0].cur - 80 + "px";
        inputMsgName.parentNode.style.width = arr[0].cur - 80 + "px";
        inputMsgEmail.parentNode.style.width = arr[0].cur - 80 + "px";
        inputMsgContent.parentNode.style.width = arr[0].cur - 80 + "px";
        inputMsgTitle.parentNode.parentNode.style.width = arr[0].cur + "px";
        inputMsgName.parentNode.parentNode.style.width = arr[0].cur + "px";
        inputMsgEmail.parentNode.parentNode.style.width = arr[0].cur + "px";
        inputMsgContent.parentNode.parentNode.style.width = arr[0].cur + "px";
        messageBoxTitle.style.width = arr[0].cur - 30 + "px";
        messageContent.style.height = arr[1].cur + "px";
        messageContentSucc.style.height = arr[1].cur + "px"
    },
    function () { },
    MoveLibType.ELASTICITY);
    messageBoxDraging = new PerfectDrag(messageBoxTitle,
    function () {
        return {
            x: messageBox.offsetLeft,
            y: messageBox.offsetTop
        }
    },
    function (x, y) {
        messageBox.style.left = x + 'px';
        messageBox.style.top = y + 'px'
    },
    function () {
        messageBoxEm.pause = true;
        messageBoxRecoverEm.pause = true
    },
    function (bChange) {
        if (!bChange) {
            return
        }
        showMessageBox(false)
    });
    messageBoxRecoverEm = new MoveLib([messageBoxInitLeft, messageBoxInitTop, messageBoxInitWidth, messageBoxInitHeight], [40, 40, 40, 40],
    function (arr) {
        var msg_title = document.getElementById('msg_title');
        messageBox.style.left = arr[0].cur + "px";
        messageBox.style.top = arr[1].cur + "px";
        messageBox.style.width = arr[2].cur + "px";
        messageContent.style.width = arr[2].cur - 11 + "px";
        messageContentSucc.style.width = arr[2].cur + "px";
        inputMsgTitle.style.width = arr[2].cur - 80 + "px";
        inputMsgName.style.width = arr[2].cur - 80 + "px";
        inputMsgEmail.style.width = arr[2].cur - 80 + "px";
        inputMsgContent.style.width = arr[2].cur - 80 + "px";
        inputMsgTitle.parentNode.style.width = arr[2].cur - 80 + "px";
        inputMsgName.parentNode.style.width = arr[2].cur - 80 + "px";
        inputMsgEmail.parentNode.style.width = arr[2].cur - 80 + "px";
        inputMsgContent.parentNode.style.width = arr[2].cur - 80 + "px";
        inputMsgTitle.parentNode.parentNode.style.width = arr[2].cur + "px";
        inputMsgName.parentNode.parentNode.style.width = arr[2].cur + "px";
        inputMsgEmail.parentNode.parentNode.style.width = arr[2].cur + "px";
        inputMsgContent.parentNode.parentNode.style.width = arr[2].cur + "px";
        messageBoxTitle.style.width = arr[2].cur - 30 + "px";
        messageContent.style.height = arr[3].cur + "px";
        messageContentSucc.style.height = arr[3].cur + "px"
    },
    function (arr) {
        messageBoxEm.stop();
        messageBoxEm.pause = false;
        messageBoxEm.setCurrent([arr[2].cur, arr[3].cur]);
        messageBoxEm.setTarget([arr[2].cur, arr[3].cur])
    },
    MoveLibType.ELASTICITY);
    showMessageBox = function (bOuter) {
        if (bOuter) {
            oEMAutoShow.setCurrent([messageBox.offsetLeft, messageContent.offsetTop]);
            oEMAutoShow.setTarget([-350, -50])
        }
        messageBoxEm.setCurrent([messageBox.offsetWidth, messageContent.offsetHeight]);
        messageBoxEm.setTarget([300, 280]);
        messageBoxRecoverEm.stop();
        messageBoxCloseButton.style.display = 'block';
        bMessageBoxDrog = true;
        messageBoxEm.pause = false;
        messageBoxRecoverEm.pause = false
    };
    messageBoxCloseButton.onmousedown = function (ev) {
        var oEvent = window.event || ev;
        var t = iMinAutoExpandHeight;
        miaovCancelBubble(oEvent);
        bMessageBoxDrog = false;
        messageBoxEm.pause = true;
        messageBoxCloseButton.style.display = 'none';
        messageBoxRecoverEm.setCurrent([messageBox.offsetLeft, messageBox.offsetTop, messageBox.offsetWidth, messageContent.offsetHeight]);
        for (i = 0; i < aAutoExpandInput.length; i++) {
            if (aAutoExpandInput[i].value.length != 0 && aAutoExpandHeight[i] > t) {
                t = aAutoExpandHeight[i]
            }
        }
        messageBoxRecoverEm.setTarget([messageBoxInitLeft, messageBoxInitTop, messageBoxInitWidth, t]);
        return false
    };
    var msgForm = document.getElementById('msg_pos_form');
    var aMsgFormCheckFaildText = [null, null, null, null];
    var oRemainTimeSpan = document.getElementById('remain_time');
    var oTimerRemainTimeSpan = null;
    var iRemainTime = 0;
    function doSubmit() {
        var url;
        var arrMsgFormInput = [inputMsgTitle, inputMsgName, inputMsgEmail, inputMsgContent, inputMsgVerify];
        var aMsgFormErrorText = [g_message_doSubmit1, g_message_doSubmit2, g_message_doSubmit3, g_message_doSubmit4];
        var ajax = null;
        var checkFaild = false;
        var i;
        for (i = 0; i < arrMsgFormInput.length; i++) {
            if (arrMsgFormInput[i].value.length == 0) {
                if (!aMsgFormCheckFaildText[i]) {
                    aMsgFormCheckFaildText[i] = new InputDefaultText(arrMsgFormInput[i], aMsgFormErrorText[i], '#C03')
                }
                checkFaild = true
            } else if (aMsgFormCheckFaildText[i] && aMsgFormCheckFaildText[i].isDefault) {
                checkFaild = true
            } else {
                if (aMsgFormCheckFaildText[i]) {
                    aMsgFormCheckFaildText[i].remove();
                    aMsgFormCheckFaildText[i] = null
                }
            }
        }
        if (checkFaild) {
            return false
        }
        url = msgForm.action;
        for (i = 0; i < arrMsgFormInput.length; i++) {
            if (i > 0) {
                url += "&"
            } else {
                url += "?"
            }
            url += arrMsgFormInput[i].name + "=" + encodeURIComponent(arrMsgFormInput[i].value)
        }
        ajax = InitAjax();
        bMessageBoxSubmitBtn.onclick = null;
        DoAjaxGet(ajax, url,
        function (msg) {
            var m = eval('(' + msg + ')');
            if (m.code == 0) {
                alert(m.msg);
                return false
            }
            if (m.code == 10) {
                alert(m.msg);
                var oImgVerify = document.getElementById('img_verify');
                oImgVerify.src = oImgVerify.src + '?' + new Date().getTime();
                return false
            }
            addMessageDirect(inputMsgTitle.value, inputMsgName.value, inputMsgContent.value);
            messageContent.style.display = 'none';
            messageContentSucc.style.display = 'block';
            for (i = 0; i < arrMsgFormInput.length; i++) {
                arrMsgFormInput[i].value = ''
            }
            setTimeout(function () {
                messageContent.style.display = 'block';
                messageContentSucc.style.display = 'none'
            },
            3000);
            iRemainTime = 3;
            oTimerRemainTimeSpan = setInterval(function () {
                iRemainTime--;
                oRemainTimeSpan.innerHTML = iRemainTime;
                if (iRemainTime == 0) {
                    clearInterval(oTimerRemainTimeSpan)
                }
            },
            1000);
            bMessageBoxSubmitBtn.onclick = doSubmit
        });
        return false
    };
    msgForm.onsubmit = doSubmit;
    bMessageBoxSubmitBtn.onclick = doSubmit;
    for (i = 0; i < aAutoExpandInput.length; i++) {
        aAutoExpandInput[i].autoExpandHeight = aAutoExpandHeight[i];
        miaovAppendEventListener(aAutoExpandInput[i], 'focus',
        function (ev) {
            var oEvent = window.event || ev;
            var obj = oEvent.srcElement || oEvent.target;
            var t = obj.autoExpandHeight;
            if (bMessageBoxDrog) {
                return
            }
            if (oAutoExpandTimer) {
                clearTimeout(oAutoExpandTimer)
            }
            for (i = 0; i < aAutoExpandInput.length; i++) {
                if (aAutoExpandInput[i].value.length != 0 && aAutoExpandHeight[i] > t) {
                    t = aAutoExpandHeight[i]
                }
            }
            messageBoxRecoverEm.setTarget([messageBoxInitLeft, messageBoxInitTop, messageBoxInitWidth, t])
        });
        miaovAppendEventListener(aAutoExpandInput[i], 'blur',
        function (ev) {
            var oEvent = window.event || ev;
            var obj = oEvent.srcElement || oEvent.target;
            var i;
            var t = iMinAutoExpandHeight;
            if (bMessageBoxDrog) {
                return
            }
            for (i = 0; i < aAutoExpandInput.length; i++) {
                if (aAutoExpandInput[i].value.length != 0) {
                    t = aAutoExpandHeight[i]
                }
            }
            oAutoExpandTimer = setTimeout(function () {
                messageBoxRecoverEm.setTarget([messageBoxInitLeft, messageBoxInitTop, messageBoxInitWidth, t])
            },
            200)
        })
    }
}
function css(obj, attr, value) {
    if (arguments.length == 2) {
        if (attr == 'alpha') {
            if (obj.myOpacity == undefined) obj.myOpacity = parseInt(100 * parseFloat(obj.currentStyle ? obj.currentStyle.opacity : getComputedStyle(obj, false).opacity));
            return obj.myOpacity
        } else {
            return parseInt(obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr])
        }
    } else if (arguments.length == 3) switch (attr) {
        case 'width':
        case 'height':
        case 'paddingLeft':
        case 'paddingTop':
        case 'paddingRight':
        case 'paddingBottom':
            value = Math.max(value, 0);
        case 'left':
        case 'right':
        case 'bottom':
        case 'top':
        case 'marginLeft':
        case 'marginTop':
        case 'marginRight':
        case 'marginBottom':
            obj.style[attr] = value + 'px';
            break;
        case 'alpha':
            obj.myOpacity = value;
            obj.style.filter = "alpha(opacity:" + value + ")";
            obj.style.opacity = value / 100;
            break;
        default:
            obj.style[attr] = value
    }
    return function (attr_in, value_in) {
        css(obj, attr_in, value_in)
    }
}
var MIAOV_MOVE_TYPE = {
    BUFFER: 1,
    FLEX: 2,
    BUFFER_FAST: 3
};
function miaovStartMove(obj, oTarget, iType, fnCallBack, fnDuring) {
    if (!iType) iType = MIAOV_MOVE_TYPE.BUFFER;
    var fnMove = null;
    if (obj.timer) {
        clearInterval(obj.timer)
    }
    switch (iType) {
        case MIAOV_MOVE_TYPE.BUFFER:
            fnMove = _miaovDoMoveBuffer(5);
            break;
        case MIAOV_MOVE_TYPE.FLEX:
            fnMove = miaovDoMoveFlex;
            break;
        case MIAOV_MOVE_TYPE.BUFFER_FAST:
            fnMove = _miaovDoMoveBuffer(3);
            break
    }
    obj.timer = setInterval(function () {
        fnMove(obj, oTarget, fnCallBack, fnDuring)
    },
    15)
}
function _miaovDoMoveBuffer(iScale) {
    return function (obj, oTarget, fnCallBack, fnDuring) {
        var bStop = true;
        var attr = '';
        var speed = 0;
        var cur = 0;
        for (attr in oTarget) {
            cur = css(obj, attr);
            if (oTarget[attr] != cur) {
                bStop = false;
                speed = (oTarget[attr] - cur) / iScale;
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                css(obj, attr, cur + speed)
            }
        }
        if (fnDuring) fnDuring.call(obj);
        if (bStop) {
            clearInterval(obj.timer);
            obj.timer = null;
            if (fnCallBack) fnCallBack.call(obj)
        }
    }
}
function miaovDoMoveFlex(obj, oTarget, fnCallBack, fnDuring) {
    var bStop = true;
    var attr = '';
    var speed = 0;
    var cur = 0;
    for (attr in oTarget) {
        if (!obj.oSpeed) obj.oSpeed = {};
        if (!obj.oSpeed[attr]) obj.oSpeed[attr] = 0;
        cur = css(obj, attr);
        if (Math.abs(oTarget[attr] - cur) > 1 || Math.abs(obj.oSpeed[attr]) > 1) {
            bStop = false;
            obj.oSpeed[attr] += (oTarget[attr] - cur) / 5;
            obj.oSpeed[attr] *= 0.7;
            var maxSpeed = 65;
            if (Math.abs(obj.oSpeed[attr]) > maxSpeed) {
                obj.oSpeed[attr] = obj.oSpeed[attr] > 0 ? maxSpeed : -maxSpeed
            }
            css(obj, attr, cur + obj.oSpeed[attr])
        }
    }
    if (fnDuring) fnDuring.call(obj);
    if (bStop) {
        clearInterval(obj.timer);
        obj.timer = null;
        if (fnCallBack) fnCallBack.call(obj)
    }
}
Array.prototype.has = function (vItem) {
    var i = 0;
    for (i = 0; i < this.length; i++) {
        if (this[i] === vItem) {
            return true
        }
    }
    return false
};
Array.prototype.append = function (aAny) {
    for (var i = 0, len = aAny.length; i < len; i++) this.push(aAny[i]);
    return this
};
function setCookie(name, value, iDay) {
    var oDate = new Date();
    oDate.setDate(oDate.getDate() + iDay);
    document.cookie = name + '=' + value + ';expires=' + oDate
}
function getCookie(name) {
    var arr = document.cookie.split('; ');
    var i = 0;
    for (i = 0; i < arr.length; i++) {
        var arr2 = arr[i].split('=');
        if (arr2[0] == name) {
            return arr2[1]
        }
    }
    return ''
}
function removeCookie(name) {
    setCookie(name, 'a', -1)
}
function sprintf(format) {
    var _arguments = arguments;
    return format.replace(/%\d+/g,
    function (str) {
        return _arguments[parseInt(str.substring(1))]
    })
}
Date.prototype.pattern = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    var week = {
        "0": "\u65e5",
        "1": "\u4e00",
        "2": "\u4e8c",
        "3": "\u4e09",
        "4": "\u56db",
        "5": "\u4e94",
        "6": "\u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""])
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
        }
    }
    return fmt
};
function getByClass(oParent, sClass) {
    var re = new RegExp('\\b' + sClass + '\\b', 'i');
    var aEle = oParent.getElementsByTagName('*');
    var aResult = [];
    var i = 0;
    for (i = 0; i < aEle.length; i++) {
        if (re.test(aEle[i].className)) {
            aResult.push(aEle[i])
        }
    }
    return aResult
}
function onLoad(fn) {
    var old = window.onload;
    window.onload = function () {
        old && old();
        fn()
    }
}
function pCss(vWho, attr, value) {
    var aWho = [];
    if (typeof vWho == 'object') {
        if (vWho instanceof Array) aWho = vWho;
        else aWho = [vWho]
    } else aWho = getEle(vWho);
    if (arguments.length == 2) {
        return (function (obj) {
            return (obj.currentStyle || getComputedStyle(obj, false))[attr]
        })(aWho[0])
    } else {
        for (var i = 0, len = aWho.length; i < len; i++) {
            aWho[i].style[attr] = value
        }
    }
}
function getEle(sExp, oParent) {  //获取某个 元素下的 指定id元素
    var aResult = [];
    var i = 0;
    oParent || (oParent = document);
    if (oParent instanceof Array) {
        for (i = 0; i < oParent.length; i++) aResult = aResult.concat(getEle(sExp, oParent[i]))
    } else if (typeof sExp == 'object') {
        if (sExp instanceof Array) {
            return sExp
        } else {
            return [sExp]
        }
    } else {
        if (/,/.test(sExp)) {
            var arr = sExp.split(/,+/);
            for (i = 0; i < arr.length; i++) aResult = aResult.concat(getEle(arr[i], oParent))
        } else if (/[ >]/.test(sExp)) {
            var aParent = [];
            var aChild = [];
            var arr = sExp.split(/[ >]+/);
            aChild = [oParent];
            for (i = 0; i < arr.length; i++) {
                aParent = aChild;
                aChild = [];
                for (j = 0; j < aParent.length; j++) {
                    aChild = aChild.concat(getEle(arr[i], aParent[j]))
                }
            }
            aResult = aChild
        } else {
            switch (sExp.charAt(0)) {
                case '#':
                    return [document.getElementById(sExp.substring(1))];
                case '.':
                    return getByClass(oParent, sExp.substring(1));
                default:
                    return [].append(oParent.getElementsByTagName(sExp))
            }
        }
    }
    return aResult
}
function static2Abs(vEle, _aPos) {
    var aEle = getEle(vEle);
    var aPos = [];
    var i = 0;
    if (_aPos) {
        aPos = _aPos
    } else {
        for (i = 0; i < aEle.length; i++) {
            aPos[i] = {
                x: aEle[i].offsetLeft,
                y: aEle[i].offsetTop
            }
        }
    }
    for (i = 0; i < aEle.length; i++) {
        aEle[i].style.position = 'absolute';
        aEle[i].style.left = aPos[i].x + 'px';
        aEle[i].style.top = aPos[i].y + 'px';
        aEle[i].style.margin = '0px'
    }
    return aPos
}
function getAbsPos(obj, oStop) {
    var pos = {
        x: 0,
        y: 0
    };
    while (obj && typeof obj.offsetLeft != 'undefined' && oStop != obj) {
        pos.x += obj.offsetLeft;
        pos.y += obj.offsetTop;
        obj = obj.offsetParent
    }
    return pos
}
function getRelPos(obj, obj2) {
    var oPos1 = getAbsPos(obj);
    var oPos2 = getAbsPos(obj2);
    return {
        x: oPos1.x - oPos2.x,
        y: oPos1.y - oPos2.y
    }
}
function formatTime(iMin) {
    var sResult = '';
    if (iMin >= 60 * 24) {
        sResult += parseInt(iMin / (60 * 24)) + '天';
        iMin %= 60 * 24
    }
    if (iMin >= 60) {
        sResult += parseInt(iMin / 60) + '小时';
        iMin %= 60
    }
    if (iMin > 0 || sResult == '') {
        sResult += iMin + '分钟'
    }
    return sResult
}
var ppt = null;
function initPpt() {
    var pptPrevButton = document.getElementById('prev');
    var pptNextButton = document.getElementById('next');
    var aPptImgs = [];
    for (i = 0; i < 5; i++) {
        aPptImgs[i] = {};
        aPptImgs[i].src = 'images/power_point_pic/' + (i + 1) + '.jpg'
    }
    aPptImgs[0].href = 'video.html.php?type=1';
    aPptImgs[0].target = '_self';
    aPptImgs[1].href = 'course.html.php';
    aPptImgs[1].target = '_self';
    aPptImgs[2].href = 'free_experience.html.php';
    aPptImgs[2].target = '_blank';
    aPptImgs[3].href = 'week_end.html.php';
    aPptImgs[3].target = '_blank';
    aPptImgs[4].href = 'video.html.php?type=2';
    aPptImgs[4].target = '_self';
    ppt = new Ppt('pptImg', aPptImgs);
    ppt.preloadImgs();
    ppt.enableAutoPlay();
    pptPrevButton.onclick = function () {
        ppt.playPrev()
    };
    pptNextButton.onclick = function () {
        ppt.playNext()
    }
}
function initNav() {
    var oNavEm = null;
    var oNavDiv = document.getElementById('nav_active');
    var oNavDivUl = document.getElementById('nav_ul');
    var aNavDivLis = oNavDivUl.getElementsByTagName('li');
    var oNavDivActiveUl = document.getElementById('nav_active_ul');
    var aNavDivActiveLis = oNavDivUl.getElementsByTagName('li');
    var iNavDivInitLeft = 0;
    var t = null;
    iNavDivInitLeft = oNavDiv.offsetLeft;
    oNavEm = new MoveLib([oNavDiv.offsetLeft], [60],
    function (arr) {
        oNavDiv.style.left = arr[0].cur + "px";
        oNavDivActiveUl.style.left = -arr[0].cur + "px"
    },
    function () { },
    MoveLibType.ELASTICITY);
    oNavDiv.onmouseout = function () {
        if (!t) {
            t = setTimeout(function () {
                oNavEm.setTarget([iNavDivInitLeft])
            },
            20)
        }
    };
    oNavDiv.onmouseover = function () {
        if (t) {
            clearTimeout(t);
            t = null
        }
    };
    for (i = 0; i < aNavDivLis.length; i++) {
        aNavDivLis[i].onmouseover = function () {
            oNavEm.setTarget([this.offsetLeft])
        };
        aNavDivActiveLis[i].onmouseover = function () {
            if (t) {
                clearTimeout(t);
                t = null
            }
            oNavEm.setTarget([this.offsetLeft])
        };
        aNavDivLis[i].onmouseout = function () {
            if (!t) {
                t = setTimeout(function () {
                    oNavEm.setTarget([iNavDivInitLeft])
                },
                20)
            }
        }; 
        {
            if (!t) {
                t = setTimeout(function () {
                    oNavEm.setTarget([iNavDivInitLeft])
                },
                20)
            }
        }
    }
}
var g_fnQuirkyPopupClose = null;
function initToTop(fn) {
    var bIsIe6 = false;
    var toTop = null;
    if (-1 != window.navigator.userAgent.indexOf('MSIE 6.0')) {
        if (-1 != window.navigator.userAgent.indexOf('MSIE 7.0') || -1 != window.navigator.userAgent.indexOf('MSIE 8.0')) {
            bIsIe6 = false
        } else {
            bIsIe6 = true
        }
    } else {
        bIsIe6 = false
    }
    toTop = new ScrollToTop(140, 54, !bIsIe6);
    if (fn) {
        toTop.setOnScroll(fn)
    }
}
var __oInputDebug__ = null;
function startDebug() {
    __oInputDebug__ = document.createElement('textarea');
    __oInputDebug__.rows = '10';
    __oInputDebug__.cols = '30';
    __oInputDebug__.style.position = 'fixed';
    __oInputDebug__.style.right = '0px';
    __oInputDebug__.style.top = '0px';
    document.body.appendChild(__oInputDebug__)
}
function debugLog(str) {
    __oInputDebug__.value += str + '\n'
}
function checkHost() {
    var arr1 = ['www.mi', 'mi', 'web.mi', 'localh'];
    var arr2 = ['aov.com', 'aov.com', 'aov.com', 'ost'];
    var aHost = [];
    var i = 0;
    for (i = 0; i < arr1.length; i++) {
        aHost[i] = arr1[i] + arr2[i];
        if (window.location.host.toLowerCase() == aHost[i]) {
            return
        }
    }
    window.location = 'http://' + aHost[0]
}
function miaovAppendEventListener(obj, sEventName, fnEvent) {
    if (obj.attachEvent) {
        obj.attachEvent('on' + sEventName, fnEvent)
    } else {
        obj.addEventListener(sEventName, fnEvent, false)
    }
}
function miaovRemoveEventListener(obj, sEventName, fnEvent) {
    if (obj.detachEvent) {
        obj.detachEvent('on' + sEventName, fnEvent)
    } else {
        obj.removeEventListener(sEventName, fnEvent, false)
    }
}
function miaovCancelBubble(oEvent) {
    if (oEvent.stopPropagation) {
        oEvent.stopPropagation()
    } else {
        oEvent.cancelBubble = true
    }
}
function htmlEncode(text) {
    return text.replace(/&/g, '&amp').replace(/\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
function htmlDecode(text) {
    return text.replace(/&amp;/g, '&').replace(/&quot;/g, '\"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}
var g_oPopup = null;
var g_oPopupBoxCourseType = null;
function initPopup() {
    var popupBox = document.getElementById('contact_popup');
    var popupBoxTitle = document.getElementById('contact_popup_box_title');
    var popupBoxContent = document.getElementById('contact_popup_box');
    var popupBoxBg = document.getElementById('contact_popup_bg');
    var oFormCourseType = document.getElementById('course_popup_form_course_type');
    if (oFormCourseType) {
        g_oPopupBoxCourseType = new MiaoVSelect(oFormCourseType)
    }
    g_oPopup = new Popup(popupBox, popupBoxTitle, 40,
    function (left, top, width, height, alpha) {
        popupBox.style.left = left + 'px';
        popupBox.style.top = top + 'px';
        popupBox.style.width = width + 18 + 'px';
        popupBox.style.height = height + 18 + 'px';
        popupBoxContent.style.width = width + 'px';
        popupBoxContent.style.height = height + 'px';
        popupBoxBg.style.width = width + 18 + 'px';
        popupBoxBg.style.height = height + 18 + 'px';
        popupBox.style.filter = 'alpha(opacity=' + alpha + ')';
        popupBoxContent.style.filter = 'alpha(opacity=' + alpha + ')';
        popupBox.style.opacity = alpha / 100
    },
    function () {
        return {
            width: 338,
            height: 288
        }
    })
}
var g_fnClearDatas = null;
function showPopupListen() {
    var oLiCourseType = document.getElementById('course_type');
    var oCoursePopupFormContent = document.getElementById('course_popup_form_content');
    oLiCourseType.style.display = 'none';
    oCoursePopupFormContent.style.height = '125px';
    oCoursePopupFormContent.style.background = 'url(images/a1.jpg)';
    oCoursePopupFormContent.onfocus = function () {
        this.style.background = 'url(images/text_bg.gif) #fff repeat-x 0px 0px'
    };
    __showPopup__(g_miaovCommon_showPopupListen1, 'l')
}
function showPopupConsulting() {
    var oLiCourseType = document.getElementById('course_type');
    var oCoursePopupFormContent = document.getElementById('course_popup_form_content');
    oLiCourseType.style.display = 'none';
    oCoursePopupFormContent.style.height = '125px';
    oCoursePopupFormContent.style.background = 'url(images/text_bg.gif) #fff repeat-x 0px 0px';
    __showPopup__(g_miaovCommon_showPopupConsulting1, 'c')
}
function showPopupSuggestion() {
    var oLiCourseType = document.getElementById('course_type');
    var oCoursePopupFormContent = document.getElementById('course_popup_form_content');
    oLiCourseType.style.display = 'none';
    oCoursePopupFormContent.style.height = '125px';
    oCoursePopupFormContent.style.background = 'url(images/text_bg.gif) #fff repeat-x 0px 0px';
    __showPopup__(g_miaovCommon_showPopupSuggestion1, 's')
}
function showPopupApply(sCourse) {
    var oCourseType = document.getElementById('course_popup_form_course_type');
    var oLiCourseType = document.getElementById('course_type');
    var oCoursePopupFormContent = document.getElementById('course_popup_form_content');
    oLiCourseType.style.display = 'block';
    oCoursePopupFormContent.style.height = '99px';
    oCoursePopupFormContent.style.background = 'url(images/text_bg.gif) #fff repeat-x 0px 0px';
    g_oPopupBoxCourseType.setValue(sCourse);
    __showPopup__(g_miaovCommon_showPopupApply1, 'a')
}
function __showPopup__(sText, sType) {
    var oContactPopupContentText = document.getElementById('contact_popup_content_text');
    var oCoursePopupFormType = document.getElementById('course_popup_form_type');
    oContactPopupContentText.innerHTML = sText;
    oCoursePopupFormType.value = sType;
    g_oPopup.show()
}
function hidePopup() {
    g_oPopup.hide();
    g_fnClearDatas()
}
function initPopupAjaxSubmit() {
    var msgForm = document.getElementById('course_popup_form');
    var aMsgFormCheckFaildText = [];
    var arrMsgFormInput = [document.getElementById('course_popup_form_name'), document.getElementById('course_popup_form_contact'), document.getElementById('course_popup_form_content'), document.getElementById('course_popup_form_type'), document.getElementById('course_popup_form_source')];
    var oRemainTimeSpan = document.getElementById('remain_time');
    var oBtnSubmit = document.getElementById('course_popup_form_submit');
    var oTimerRemainTimeSpan = null;
    var iRemainTime = 0;
    var i;
    g_fnClearDatas = function () {
        for (i = 0; i < aMsgFormCheckFaildText.length; i++) {
            if (aMsgFormCheckFaildText[i]) {
                aMsgFormCheckFaildText[i].remove();
                aMsgFormCheckFaildText[i] = null
            }
        }
        for (i = 0; i < arrMsgFormInput.length; i++) {
            arrMsgFormInput[i].value = ''
        }
    };
    msgForm.onsubmit = function () {
        var url;
        var aMsgFormErrorText = [g_miaovCommon_initPopupAjaxSubmit1, g_miaovCommon_initPopupAjaxSubmit2, g_miaovCommon_initPopupAjaxSubmit3, g_miaovCommon_initPopupAjaxSubmit4, g_miaovCommon_initPopupAjaxSubmit5];
        var ajax = null;
        var checkFaild = false;
        function enableBtn() {
            oBtnSubmit.value = g_miaovCommon_initPopupAjaxSubmit6;
            oBtnSubmit.style.filter = null;
            oBtnSubmit.style.opacity = null;
            oBtnSubmit.disabled = null
        };
        function disableBtn() {
            oBtnSubmit.value = g_miaovCommon_initPopupAjaxSubmit7;
            oBtnSubmit.style.filter = 'alpha(opacity=50)';
            oBtnSubmit.style.opacity = '0.5';
            oBtnSubmit.disabled = 'disabled'
        };
        disableBtn();
        for (i = 0; i < arrMsgFormInput.length; i++) {
            if (arrMsgFormInput[i].value.length == 0) {
                if (!aMsgFormCheckFaildText[i]) {
                    aMsgFormCheckFaildText[i] = new InputDefaultText(arrMsgFormInput[i], aMsgFormErrorText[i], '#C03')
                }
                checkFaild = true
            } else if (aMsgFormCheckFaildText[i] && aMsgFormCheckFaildText[i].isDefault) {
                checkFaild = true
            } else {
                if (aMsgFormCheckFaildText[i]) {
                    aMsgFormCheckFaildText[i].remove();
                    aMsgFormCheckFaildText[i] = null
                }
            }
        }
        if (checkFaild) {
            enableBtn();
            return false
        }
        url = msgForm.action;
        for (i = 0; i < arrMsgFormInput.length; i++) {
            if (i > 0) {
                url += "&"
            } else {
                url += "?"
            }
            url += arrMsgFormInput[i].name + "=" + encodeURIComponent(arrMsgFormInput[i].value)
        }
        ajax = InitAjax();
        DoAjaxGet(ajax, url,
        function () {
            for (i = 0; i < arrMsgFormInput.length; i++) {
                if (arrMsgFormInput[i].type != 'hidden') {
                    arrMsgFormInput[i].value = ''
                }
            }
            alert(g_miaovCommon_initPopupAjaxSubmit8);
            enableBtn();
            g_oPopup.hide()
        });
        return false
    }
}
function log(str) {
    var oValue = document.getElementById('log_test_text');
    if (!oValue) {
        oValue = document.createElement('textarea');
        document.body.appendChild(oValue);
        oValue.id = 'log_test_text';
        oValue.style.width = '200px';
        oValue.style.height = '400px';
        oValue.style.position = 'fixed';
        oValue.style.right = '0';
        oValue.style.top = '0';
        oValue.style.zIndex = '9999'
    }
    oValue.value += str + '\n'
}
function MiaoVHScrollBar(parent, left, top, width, height, fnOnScrollChange, slideSize, fnOnStartScroll) {
    var obj = this;
    this.iSlideWidth = slideSize;
    this.iButSize = 24;
    width -= 2 * this.iButSize;
    this.iBarWidth = width;
    this.fBigSlide = 1 / 3;
    this.fSmallSlide = 1 / 16;
    this.iSlideLeft = 0;
    this.bDragingChangeEvent = true;
    this.fnOnScrollChange = fnOnScrollChange;
    if (fnOnStartScroll) {
        this.fnOnStartScroll = fnOnStartScroll
    } else {
        this.fnOnStartScroll = null
    }
    this.__createElements__(left + this.iButSize, top, width, height, fnOnScrollChange, parent);
    this.__addEventListener__();
    this.__oDraging__ = new PerfectDrag(this.__oSlide__,
    function () {
        return {
            x: obj.__oSlide__.offsetLeft,
            y: 0
        }
    },
    function (x, y) {
        if (x < 0) {
            obj.iSlideLeft = 0
        } else if (x >= obj.iBarWidth - obj.iSlideWidth) {
            obj.iSlideLeft = obj.iBarWidth - obj.iSlideWidth
        } else {
            obj.iSlideLeft = x
        }
        obj.__oSlide__.style.left = obj.iSlideLeft + "px";
        if (obj.bDragingChangeEvent) {
            obj.fnOnScrollChange(obj.iSlideLeft / (obj.iBarWidth - obj.iSlideWidth))
        }
    },
    function () {
        obj.__oScrollBarOuter__.style.display = 'block';
        if (obj.fnOnStartScroll) {
            obj.fnOnStartScroll()
        }
    },
    function () {
        setTimeout(function () {
            obj.__oScrollBarOuter__.style.display = 'none'
        },
        0);
        obj.fnOnScrollChange(obj.iSlideLeft / (obj.iBarWidth - obj.iSlideWidth))
    })
}
MiaoVHScrollBar.prototype.__createElements__ = function (left, top, width, height, fnOnScrollChange, parent) {
    this.__oScrollBarContent__ = document.createElement("div");
    this.__oScrollBarContent__.className = 'scroll_ball_x';
    this.__oScrollBarContent__.style.width = width + "px";
    this.__oScrollBarContent__.style.height = height + "px";
    this.__oScrollBarContent__.style.left = left + "px";
    this.__oScrollBarContent__.style.top = top + "px";
    this.__oScrollBarMinusButton__ = document.createElement("div");
    this.__oScrollBarMinusButton__.className = 'scroll_top_normal';
    this.__oScrollBarMinusButton__.style.width = this.iButSize + "px";
    this.__oScrollBarMinusButton__.style.height = height + "px";
    this.__oScrollBarMinusButton__.style.left = -(this.iButSize - 4) + "px";
    this.__oScrollBarMinusButton__.style.lineHeight = height + "px";
    this.__oScrollBarContent__.appendChild(this.__oScrollBarMinusButton__);
    this.__oScrollBar__ = document.createElement("div");
    this.__oScrollBar__.className = "ball_y_bg";
    this.__oScrollBar__.style.width = width + "px";
    this.__oScrollBar__.style.height = height + "px";
    this.__oScrollBarContent__.appendChild(this.__oScrollBar__);
    this.__oSlide__ = document.createElement("div");
    this.__oSlide__.className = 'ball_y';
    this.__oSlide__.style.width = this.iSlideWidth + "px";
    this.__oSlide__.style.height = (height - 4) + "px";
    this.__oScrollBar__.appendChild(this.__oSlide__);
    this.__oScrollBarAddButton__ = document.createElement("div");
    this.__oScrollBarAddButton__.className = "scroll_bottom_normal";
    this.__oScrollBarAddButton__.style.width = this.iButSize + "px";
    this.__oScrollBarAddButton__.style.height = height + "px";
    this.__oScrollBarAddButton__.style.top = "0px";
    this.__oScrollBarAddButton__.style.right = -(this.iButSize - 4) + "px";
    this.__oScrollBarContent__.appendChild(this.__oScrollBarAddButton__);
    this.__oScrollBarOuter__ = document.createElement("div");
    this.__oScrollBarOuter__.className = "scrollBarOuter";
    this.__oScrollBarOuter__.style.display = 'none';
    this.__oScrollBarOuter__.style.height = document.body.offsetHeight + "px";
    parent.appendChild(this.__oScrollBarContent__);
    document.body.appendChild(this.__oScrollBarOuter__)
};
MiaoVHScrollBar.prototype.__addEventListener__ = function () {
    var obj = this;
    this.__oScrollBarMinusButton__.onmousedown = function () {
        obj.__oScrollBarMinusButton__.className = 'scroll_left_active';
        obj.doMinus();
        return false
    };
    this.__oScrollBarMinusButton__.onmouseover = function () {
        obj.__oScrollBarMinusButton__.className = 'scroll_left_active'
    };
    this.__oScrollBarMinusButton__.onmouseout = function () {
        obj.__oScrollBarMinusButton__.className = 'scroll_left_normal'
    };
    this.__oScrollBarMinusButton__.onmouseup = function () {
        obj.__oScrollBarMinusButton__.className = 'scroll_left_normal'
    };
    this.__oScrollBar__.onmousedown = function (ev) {
        obj.barClicked(window.event || ev);
        return false
    };
    this.__oScrollBarAddButton__.onmousedown = function () {
        obj.__oScrollBarAddButton__.className = 'scroll_right_active';
        obj.doAdd();
        return false
    };
    this.__oScrollBarAddButton__.onmouseover = function () {
        obj.__oScrollBarAddButton__.className = 'scroll_right_active'
    };
    this.__oScrollBarAddButton__.onmouseout = function () {
        obj.__oScrollBarAddButton__.className = 'scroll_right_normal'
    };
    this.__oScrollBarAddButton__.onmouseup = function () {
        obj.__oScrollBarAddButton__.className = 'scroll_right_normal'
    }
};
MiaoVHScrollBar.prototype.doAdd = function () {
    this.iSlideLeft += (this.iBarWidth - this.iSlideWidth) * this.fSmallSlide;
    if (this.iSlideLeft >= this.iBarWidth - this.iSlideWidth) {
        this.iSlideLeft = this.iBarWidth - this.iSlideWidth
    }
    this.__oSlide__.style.left = this.iSlideLeft + "px";
    this.fnOnScrollChange(this.iSlideLeft / (this.iBarWidth - this.iSlideWidth))
};
MiaoVHScrollBar.prototype.doMinus = function () {
    this.iSlideLeft -= (this.iBarWidth - this.iSlideWidth) * this.fSmallSlide;
    if (this.iSlideLeft < 0) {
        this.iSlideLeft = 0
    }
    this.__oSlide__.style.left = this.iSlideLeft + "px";
    this.fnOnScrollChange(this.iSlideLeft / (this.iBarWidth - this.iSlideWidth))
};
MiaoVHScrollBar.prototype.barClicked = function (oEvent) {
    var slide_left = 0;
    var slide_top = 0;
    if (!oEvent.offsetX) {
        var _ele = this.__oScrollBar__;
        var _left = _ele.offsetLeft;
        while (_ele) {
            if (_ele.offsetLeft) {
                _left += _ele.offsetLeft
            }
            _ele = _ele.parentNode
        }
        slide_left = oEvent.clientX - _left
    } else {
        slide_left = oEvent.offsetX;
        if (oEvent.srcElement == this.__oSlide__) {
            slide_left += this.__oSlide__.offsetLeft
        }
    }
    if (slide_left > this.iSlideLeft + this.iSlideWidth && slide_left < this.iBarWidth) {
        this.iSlideLeft += (this.iBarWidth - this.iSlideWidth) * this.fBigSlide;
        if (this.iSlideLeft >= this.iBarWidth - this.iSlideWidth) {
            this.iSlideLeft = this.iBarWidth - this.iSlideWidth
        }
    } else if (slide_left < this.iSlideLeft && slide_left >= 0) {
        this.iSlideLeft -= (this.iBarWidth - this.iSlideWidth) * this.fBigSlide;
        if (this.iSlideLeft < 0) {
            this.iSlideLeft = 0
        }
    } else {
        return
    }
    this.__oSlide__.style.left = this.iSlideLeft + "px";
    this.fnOnScrollChange(this.iSlideLeft / (this.iBarWidth - this.iSlideWidth))
};
MiaoVHScrollBar.prototype.getValue = function () {
    return this.iSlideLeft / (this.iBarWidth - this.iSlideWidth)
};
MiaoVHScrollBar.prototype.setValue = function (value) {
    if (value < 0) {
        value = 0
    } else if (value > 1) {
        value = 1
    }
    this.iSlideLeft = value * (this.iBarWidth - this.iSlideWidth);
    this.__oSlide__.style.left = this.iSlideLeft + "px";
    this.fnOnScrollChange(this.iSlideLeft / (this.iBarWidth - this.iSlideWidth))
};
MiaoVHScrollBar.prototype.resize = function (left, top, width, height) {
    var value = this.iSlideLeft / (this.iBarWidth - this.iSlideWidth);
    width -= 2 * this.iButSize;
    this.iBarWidth = width;
    this.iSlideLeft = value * (this.iBarWidth - this.iSlideWidth);
    if (width < 0) {
        width = this.iButSize * 3
    }
    if (height < 0) {
        height = this.iButSize
    }
    this.__oScrollBarContent__.style.left = left + this.iButSize + "px";
    this.__oScrollBarContent__.style.top = top + "px";
    this.__oScrollBarContent__.style.height = height + "px";
    this.__oScrollBarContent__.style.width = width + "px";
    this.__oScrollBar__.style.width = width + "px";
    this.__oScrollBar__.style.height = height + "px";
    this.__oScrollBarAddButton__.style.height = height + "px";
    this.__oScrollBarMinusButton__.style.height = height + "px";
    this.__oSlide__.style.height = height + "px";
    this.__oSlide__.style.left = this.iSlideLeft + "px"
};
MiaoVHScrollBar.prototype.makeUp = function (addClass, minusClass, barClass, slideClass) {
    this.__oScrollBarMinusButton__.className = minusClass;
    this.__oScrollBar__.className = barClass;
    this.__oSlide__.className = slideClass;
    this.__oScrollBarAddButton__.className = addClass
};
function MiaoVSelect(oSelect) {
    this.__iCurSelect__ = -1;
    this.__aItems__ = [];
    this.__oParent__ = null;
    this.__createElements__(oSelect)
}
MiaoVSelect.prototype.__createElements__ = function (oSelect) {
    var obj = this;
    var i = 0;
    this.__oContainer__ = document.createElement('div');
    this.__oContainer__.className = 'select';
    this.__oText__ = document.createElement('p');
    this.__oContainer__.appendChild(this.__oText__);
    this.__oBtn__ = document.createElement('a');
    this.__oBtn__.href = 'javascript:;';
    this.__oBtn__.className = 'select_btn';
    this.__oContainer__.appendChild(this.__oBtn__);
    this.__oBtn__.onclick = function () {
        if (obj.__oItemContainer__.style.display == 'none') {
            if (obj.__iCurSelect__ >= 0) {
                obj.__oItems__[obj.__iCurSelect__].className = 'active'
            }
            obj.show()
        } else {
            obj.hide()
        }
    };
    this.__oBtn__.onblur = function () {
        setTimeout(function () {
            obj.hide()
        },
        100)
    };
    this.__oItemContainer__ = document.createElement('ul');
    this.__oItemContainer__.style.display = 'none';
    this.__oContainer__.appendChild(this.__oItemContainer__);
    this.__oItems__ = [];
    for (i = 0; i < oSelect.options.length; i++) {
        this.__aItems__[i] = {
            key: oSelect.options[i].value,
            value: oSelect.options[i].text
        };
        this.__oItems__[i] = document.createElement('li');
        this.__oItems__[i].maiov_value = this.__aItems__[i].key;
        this.__oItems__[i].innerHTML = this.__aItems__[i].value;
        this.__oItems__[i].onmouseover = function () {
            this.className = 'active'
        };
        this.__oItems__[i].onmouseout = function () {
            this.className = ''
        };
        this.__oItems__[i].onclick = function () {
            obj.setValue(this.maiov_value);
            obj.hide()
        };
        this.__oItemContainer__.appendChild(this.__oItems__[i])
    }
    this.__oInputForServer__ = document.createElement('input');
    this.__oInputForServer__.name = oSelect.name;
    this.__oInputForServer__.type = 'hidden';
    this.__oInputForServer__.value = '';
    this.__oParent__ = oSelect.parentNode;
    this.__oParent__.appendChild(this.__oContainer__);
    this.__oParent__.appendChild(this.__oInputForServer__);
    this.__oParent__.removeChild(oSelect)
};
MiaoVSelect.prototype.show = function () {
    this.__oParent__.parentNode.style.zIndex = '3';
    this.__oItemContainer__.style.display = 'block'
};
MiaoVSelect.prototype.hide = function () {
    this.__oParent__.parentNode.style.zIndex = '1';
    this.__oItemContainer__.style.display = 'none'
};
MiaoVSelect.prototype.setValue = function (vKey) {
    var i = 0;
    for (i = 0; i < this.__aItems__.length; i++) {
        this.__oItems__[i].className = '';
        if (this.__aItems__[i].key == vKey) {
            this.__iCurSelect__ = i;
            this.__oText__.innerHTML = this.__aItems__[i].value;
            this.__oInputForServer__.value = this.__aItems__[i].key;
            this.__oItems__[i].className = 'select_btn'
        }
    }
};
function MiaoVVScrollBar(parent, left, top, width, height, fnOnScrollChange, slideSize, fnOnStartScroll) {
    var obj = this;
    this.iSlideHeight = slideSize;
    this.iButSize = 24;
    height -= 2 * this.iButSize;
    this.iBarHeight = height;
    this.fBigSlide = 1 / 3;
    this.fSmallSlide = 1 / 16;
    this.iSlideTop = 0;
    this.bDragingChangeEvent = true;
    this.fnOnScrollChange = fnOnScrollChange;
    if (fnOnStartScroll) {
        this.fnOnStartScroll = fnOnStartScroll
    } else {
        this.fnOnStartScroll = null
    }
    this.__createElements__(left, top + this.iButSize, width, height, fnOnScrollChange, parent);
    this.__addEventListener__();
    this.__oDraging__ = new PerfectDrag(this.__oSlide__,
    function () {
        return {
            x: 0,
            y: obj.__oSlide__.offsetTop
        }
    },
    function (x, y) {
        if (y < 0) {
            obj.iSlideTop = 0
        } else if (y >= obj.iBarHeight - obj.iSlideHeight) {
            obj.iSlideTop = obj.iBarHeight - obj.iSlideHeight
        } else {
            obj.iSlideTop = y
        }
        obj.__oSlide__.style.top = obj.iSlideTop + "px";
        if (obj.bDragingChangeEvent) {
            obj.fnOnScrollChange(obj.iSlideTop / (obj.iBarHeight - obj.iSlideHeight))
        }
    },
    function () {
        obj.__oScrollBarOuter__.style.display = 'block';
        if (obj.fnOnStartScroll) {
            obj.fnOnStartScroll()
        }
    },
    function () {
        setTimeout(function () {
            obj.__oScrollBarOuter__.style.display = 'none'
        },
        0);
        obj.fnOnScrollChange(obj.iSlideTop / (obj.iBarHeight - obj.iSlideHeight))
    })
}
MiaoVVScrollBar.prototype.__createElements__ = function (left, top, width, height, fnOnScrollChange, parent) {
    this.__oScrollBarContent__ = document.createElement("div");
    this.__oScrollBarContent__.className = 'scroll_ball_y';
    this.__oScrollBarContent__.style.width = width + "px";
    this.__oScrollBarContent__.style.height = height + "px";
    this.__oScrollBarContent__.style.left = left + "px";
    this.__oScrollBarContent__.style.top = top + "px";
    this.__oScrollBarMinusButton__ = document.createElement("div");
    this.__oScrollBarMinusButton__.className = 'scroll_top_normal';
    this.__oScrollBarMinusButton__.style.width = width + "px";
    this.__oScrollBarMinusButton__.style.height = this.iButSize + "px";
    this.__oScrollBarMinusButton__.style.top = -(this.iButSize - 4) + "px";
    this.__oScrollBarMinusButton__.style.lineHeight = this.iButSize + "px";
    this.__oScrollBarContent__.appendChild(this.__oScrollBarMinusButton__);
    this.__oScrollBar__ = document.createElement("div");
    this.__oScrollBar__.className = "ball_y_bg";
    this.__oScrollBar__.style.width = width + "px";
    this.__oScrollBar__.style.height = height + "px";
    this.__oScrollBarContent__.appendChild(this.__oScrollBar__);
    this.__oSlide__ = document.createElement("div");
    this.__oSlide__.className = 'ball_y';
    this.__oSlide__.style.width = width + "px";
    this.__oSlide__.style.height = this.iSlideHeight + "px";
    this.__oScrollBar__.appendChild(this.__oSlide__);
    this.__oScrollBarAddButton__ = document.createElement("div");
    this.__oScrollBarAddButton__.className = "scroll_bottom_normal";
    this.__oScrollBarAddButton__.style.width = width + "px";
    this.__oScrollBarAddButton__.style.height = this.iButSize + "px";
    this.__oScrollBarAddButton__.style.bottom = -(this.iButSize - 4) + "px";
    this.__oScrollBarContent__.appendChild(this.__oScrollBarAddButton__);
    this.__oScrollBarOuter__ = document.createElement("div");
    this.__oScrollBarOuter__.className = "scrollBarOuter";
    this.__oScrollBarOuter__.style.display = 'none';
    this.__oScrollBarOuter__.style.height = document.body.offsetHeight + "px";
    parent.appendChild(this.__oScrollBarContent__);
    document.body.appendChild(this.__oScrollBarOuter__)
};
MiaoVVScrollBar.prototype.__addEventListener__ = function () {
    var obj = this;
    this.__oScrollBarMinusButton__.onmousedown = function () {
        obj.__oScrollBarMinusButton__.className = 'scroll_top_down';
        obj.doMinus();
        return false
    };
    this.__oScrollBarMinusButton__.onmouseover = function () {
        obj.__oScrollBarMinusButton__.className = 'scroll_top_over'
    };
    this.__oScrollBarMinusButton__.onmouseout = function () {
        obj.__oScrollBarMinusButton__.className = 'scroll_top_normal'
    };
    this.__oScrollBarMinusButton__.onmouseup = function () {
        obj.__oScrollBarMinusButton__.className = 'scroll_top_over'
    };
    this.__oScrollBar__.onmousedown = function (ev) {
        obj.barClicked(window.event || ev);
        return false
    };
    this.__oScrollBarAddButton__.onmousedown = function () {
        obj.__oScrollBarAddButton__.className = 'scroll_bottom_down';
        obj.doAdd();
        return false
    };
    this.__oScrollBarAddButton__.onmouseover = function () {
        obj.__oScrollBarAddButton__.className = 'scroll_bottom_over'
    };
    this.__oScrollBarAddButton__.onmouseout = function () {
        obj.__oScrollBarAddButton__.className = 'scroll_bottom_normal'
    };
    this.__oScrollBarAddButton__.onmouseup = function () {
        obj.__oScrollBarAddButton__.className = 'scroll_bottom_over'
    }
};
MiaoVVScrollBar.prototype.doAdd = function () {
    this.iSlideTop += (this.iBarHeight - this.iSlideHeight) * this.fSmallSlide;
    if (this.iSlideTop >= this.iBarHeight - this.iSlideHeight) {
        this.iSlideTop = this.iBarHeight - this.iSlideHeight
    }
    this.__oSlide__.style.top = this.iSlideTop + "px";
    this.fnOnScrollChange(this.iSlideTop / (this.iBarHeight - this.iSlideHeight))
};
MiaoVVScrollBar.prototype.doMinus = function () {
    this.iSlideTop -= (this.iBarHeight - this.iSlideHeight) * this.fSmallSlide;
    if (this.iSlideTop < 0) {
        this.iSlideTop = 0
    }
    this.__oSlide__.style.top = this.iSlideTop + "px";
    this.fnOnScrollChange(this.iSlideTop / (this.iBarHeight - this.iSlideHeight))
};
MiaoVVScrollBar.prototype.barClicked = function (oEvent) {
    var slide_top = 0;
    if (!oEvent.offsetX) {
        var _ele = this.__oScrollBar__;
        var _top = _ele.offsetTop;
        while (_ele) {
            if (_ele.offsetTop) {
                _top += _ele.offsetTop
            }
            _ele = _ele.parentNode
        }
        slide_top = oEvent.clientX - _top
    } else {
        slide_top = oEvent.offsetY;
        if (oEvent.srcElement == this.__oSlide__) {
            slide_top += this.__oSlide__.offsetTop
        }
    }
    if (slide_top > this.iSlideTop + this.iSlideHeight && slide_top < this.iBarHeight) {
        this.iSlideTop += (this.iBarHeight - this.iSlideHeight) * this.fBigSlide;
        if (this.iSlideTop >= this.iBarHeight - this.iSlideHeight) {
            this.iSlideTop = this.iBarHeight - this.iSlideHeight
        }
    } else if (slide_top < this.iSlideTop && slide_top >= 0) {
        this.iSlideTop -= (this.iBarHeight - this.iSlideHeight) * this.fBigSlide;
        if (this.iSlideTop < 0) {
            this.iSlideTop = 0
        }
    } else {
        return
    }
    this.__oSlide__.style.top = this.iSlideTop + "px";
    this.fnOnScrollChange(this.iSlideTop / (this.iBarHeight - this.iSlideHeight))
};
MiaoVVScrollBar.prototype.getValue = function () {
    return this.iSlideTop / (this.iBarHeight - this.iSlideHeight)
};
MiaoVVScrollBar.prototype.setValue = function (value) {
    if (value < 0) {
        value = 0
    } else if (value > 1) {
        value = 1
    }
    this.iSlideTop = value * (this.iBarHeight - this.iSlideHeight);
    this.__oSlide__.style.top = this.iSlideTop + "px";
    this.fnOnScrollChange(this.iSlideTop / (this.iBarHeight - this.iSlideHeight))
};
MiaoVVScrollBar.prototype.resize = function (left, top, width, height) {
    var value = this.iSlideTop / (this.iBarHeight - this.iSlideHeight);
    height -= 2 * this.iButSize;
    this.iBarHeight = height;
    this.iSlideTop = value * (this.iBarHeight - this.iSlideHeight);
    if (height < 0) {
        height = this.iButSize * 3
    }
    if (width < 0) {
        width = this.iButSize
    }
    this.__oScrollBarContent__.style.left = left + "px";
    this.__oScrollBarContent__.style.top = top + this.iButSize + "px";
    this.__oScrollBarContent__.style.height = height + "px";
    this.__oScrollBarContent__.style.width = width + "px";
    this.__oScrollBar__.style.width = width + "px";
    this.__oScrollBar__.style.height = height + "px";
    this.__oScrollBarAddButton__.style.width = width + "px";
    this.__oScrollBarMinusButton__.style.width = width + "px";
    this.__oSlide__.style.width = width + "px";
    this.__oSlide__.style.top = this.iSlideTop + "px"
};
MiaoVVScrollBar.prototype.makeUp = function (addClass, minusClass, barClass, slideClass) {
    this.__oScrollBarMinusButton__.className = minusClass;
    this.__oScrollBar__.className = barClass;
    this.__oSlide__.className = slideClass;
    this.__oScrollBarAddButton__.className = addClass
};
function MotionQueue() {
    this._queue = []
}
MotionQueue.prototype.add = function (obj, oTarget, type, fnStart, fnDur) {
    if (!type) type = MIAOV_MOVE_TYPE.BUFFER;
    this._queue.push({
        obj: obj,
        oTarget: oTarget,
        type: type,
        fn: fnStart,
        fnDur: fnDur
    })
};
MotionQueue.prototype.play = function (fnEnd, bRev) {
    var _this = this;
    var i = bRev ? (this._queue.length - 1) : 0;
    function playInner() {
        if ((!bRev && i < _this._queue.length) || (bRev && i >= 0)) {
            var oMo = _this._queue[i];
            if (oMo.fn) {
                oMo.fn()
            }
            miaovStartMove(oMo.obj, oMo.oTarget, oMo.type, playInner, oMo.fnDur);
            i += bRev ? -1 : 1
        } else {
            if (fnEnd) fnEnd()
        }
    }
    playInner()
};
if (typeof MoveLibType == "undefined") {
    MoveLibType = {
        COLLISION: 1,
        ELASTICITY: 2,
        BUFFER: 3,
        DIRECT: 4,
        DIRECT_SLOW: 5,
        DIRECT_FAST: 6,
        BUFFER_CUSTOM: 7
    }
}
if (typeof ceilSpeed == "undefined") {
    ceilSpeed = function (fSpeed) {
        return fSpeed > 0 ? Math.ceil(fSpeed) : -Math.ceil(-fSpeed)
    }
}
function MoveLib(aCur, aSpeedMax, fnDoMove, fnMoveEnd, iEffectType) {
    var i = 0;
    switch (iEffectType) {
        case MoveLibType.COLLISION:
            this.__oEffect__ = new EffectCollision(-0.6, 3);
            break;
        case MoveLibType.ELASTICITY:
            this.__oEffect__ = new EffectElasticity(4, 0.65);
            break;
        case MoveLibType.BUFFER:
            this.__oEffect__ = new EffectBuffer(8);
            break;
        case MoveLibType.DIRECT:
            this.__oEffect__ = new EffectDirect(10);
            break;
        case MoveLibType.DIRECT_SLOW:
            this.__oEffect__ = new EffectDirect(20);
            break;
        case MoveLibType.DIRECT_FAST:
            this.__oEffect__ = new EffectDirect(5);
            break;
        case MoveLibType.BUFFER_CUSTOM:
            this.__oEffect__ = new EffectBuffer(parseInt(arguments[5]), parseInt(arguments[6]));
            break;
        default:
            alert('未知的类型' + iEffectType);
            return
    }
    this.motionDatas = [];
    for (i = 0; i < aCur.length; i++) {
        this.motionDatas[i] = {
            target: aCur[i],
            speed: 0,
            speedMax: aSpeedMax[i],
            cur: aCur[i]
        }
    }
    this.fnDoMove = fnDoMove;
    this.fnMoveEnd = fnMoveEnd;
    this.interval = 40;
    this.timer = null;
    this.lastTimer = 0;
    this.enabled = true;
    this.pause = false
}
MoveLib.prototype.setTarget = function (aValue) {
    var t = (new Date()).getTime();
    var allSame = true;
    var i = 0;
    for (i = 0; i < aValue.length; i++) {
        this.motionDatas[i].target = parseInt(aValue[i]);
        if (this.motionDatas[i].target != this.motionDatas[i].cur) {
            allSame = false
        }
    }
    if (allSame) {
        if (!this.timer) {
            this.start()
        }
        return
    }
    this.__oEffect__.initMotion(this.motionDatas);
    if (this.enabled) {
        if (!this.timer) {
            this.start()
        }
        if (t - this.lastTimer > this.interval) {
            this.__timerHandler__();
            this.lastTimer = t
        }
    }
};
MoveLib.prototype.setCurrent = function (aValue) {
    var i = 0;
    for (i = 0; i < aValue.length; i++) {
        this.motionDatas[i].cur = parseInt(aValue[i])
    }
};
MoveLib.prototype.start = function () {
    var obj = this;
    if (!this.enabled) {
        return
    }
    if (this.timer) {
        clearInterval(this.timer)
    } else {
        this.timer = setInterval(function () {
            obj.__timerHandler__()
        },
        this.interval)
    }
    this.iStartTime = ((new Date()).getTime());
    this.iCounter = 0
};
MoveLib.prototype.stop = function () {
    if (this.timer) {
        clearInterval(this.timer);
        this.timer = null
    }
};
MoveLib.prototype.__timerHandler__ = function () {
    var bEnd = false;
    if (this.pause) {
        return
    }
    bEnd = this.__oEffect__.next(this.motionDatas);
    if (bEnd) {
        if (this.fnMoveEnd) {
            this.fnMoveEnd(this.motionDatas)
        }
        this.fnDoMove(this.motionDatas);
        this.stop()
    } else {
        this.iCounter++;
        this.fnDoMove(this.motionDatas)
    }
    this.lastTimer = ((new Date()).getTime())
};
function initExpMsg() {
    (function () {
        var oInputQQ = getEle('#message_content>dd>input')[0];
        var oInputContent = getEle('#message_content>dd>textarea')[0];
        oInputQQ.value = oInputContent.value = '';
        var oDefaultQQ = new InputDefaultText(oInputQQ, '在这里填写QQ号码或其他联系方式...', '#CCC');
        var oDefaultContent = new InputDefaultText(oInputContent, '在这里输入你想对我们说的话...\n例如：我会套用JS代码，但不会自己写出来，熟悉CSS，之前学过后台，有PHP基础', '#CCC');
        var oForm = document.getElementById('msg_pos_form');
        oForm.onsubmit = submitForm;
        function submitForm() {
            var bFaild = false;
            var re = /^\s*$/;
            if (oDefaultQQ.isDefault || re.test(oInputQQ.value)) {
                oInputQQ.value = '';
                oDefaultQQ.remove();
                oDefaultQQ = new InputDefaultText(oInputQQ, '请填写您的QQ号或其他联系方式...', '#C03');
                bFaild = true
            }
            if (oDefaultContent.isDefault || re.test(oInputContent.value)) {
                oInputContent.value = '';
                oDefaultContent.remove();
                oDefaultContent = new InputDefaultText(oInputContent, '请填写您的留言信息...', '#C03');
                bFaild = true
            }
            if (!bFaild) {
                var url = oForm.action + '?msg_title=noTitle&msg_name=' + encodeURIComponent(oInputQQ.value) + '&msg_content=' + encodeURIComponent(oInputContent.value) + '&msg_email=noContact&type=3';
                ajaxGet(url,
                function (msg) {
                    var m = eval('(' + msg + ')');
                    if (m.code == 1) {
                        alert('感谢你的留言，我们会尽快与你取得联系')
                    } else {
                        alert('留言失败，请您稍后重试')
                    }
                })
            }
            return false
        }
        oInputQQ.onkeydown = oInputContent.onkeydown = function (ev) {
            var oEvent = ev || event;
            if (oEvent.keyCode == 13 && oEvent.ctrlKey) {
                submitForm();
                return false
            }
        }
    })(); (function () {
        var aLi = getEle('#miaov_photo>ul>li');
        var i = 0; (function () {
            var iNow = 0;
            setInterval(function () {
                for (i = 0; i < aLi.length; i++) {
                    miaovStartMove(aLi[i], {
                        alpha: i == iNow ? 100 : 0
                    })
                }
                iNow = (iNow + 1) % aLi.length
            },
            5000)
        })()
    })(); (function () {
        var aStrResult = ['这个没意思', '这个还凑合', '嗯，可以听一听', '这个蛮好的～', '我非常想听！'];
        var aUl = getEle('#interest>.star');
        var i = 0;
        for (i = 0; i < aUl.length; i++) {
            (function (oUl, oData) {
                var i = 0;
                var aLi = oUl.getElementsByTagName('li');
                var oInfo = getEle('.grade_info', oUl.parentNode)[0];
                for (i = 0; i < aLi.length; i++) {
                    aLi[i].index = i;
                    aLi[i].onmouseover = function () {
                        for (i = 0; i < aLi.length; i++) {
                            aLi[i].className = i <= this.index ? 'active' : ''
                        }
                        oInfo.innerHTML = aStrResult[this.index]
                    };
                    aLi[i].onmouseout = function () {
                        for (i = 1; i <= aLi.length; i++) {
                            aLi[i - 1].className = i <= oData.adv ? 'active' : ''
                        }
                        oInfo.innerHTML = aStrResult[oData.adv - 1]
                    };
                    aLi[i].onclick = function () {
                        for (i = 0; i < aLi.length; i++) {
                            aLi[i].onmouseout = aLi[i].onmouseover = null
                        }
                        var iRank = this.index + 1;
                        oInfo.style.color = '#C03';
                        oInfo.innerHTML = '感谢您的评分';
                        var url = 'rankPost.php?' + ['itemID=' + oData.ID, 'rank=' + iRank, 'type=1', 't=' + (new Date()).getTime()].join('&');
                        ajaxGet(url,
                        function (str) { })
                    }
                }
            })(aUl[i], eval('(' + getEle('input', aUl[i].parentNode)[0].value + ')'))
        }
    })(); (function () {
        var oTitleInfo = document.getElementById('title_info');
        var aDd = getEle('#interest>dd');
        var i = 0;
        for (i = 0; i < aDd.length; i++) {
            aDd[i].onmouseover = function () {
                var oData = eval('(' + getEle('input', this)[0].value + ')');
                var oPos = getAbsPos(this);
                oTitleInfo.style.display = 'block';
                oTitleInfo.style.left = oPos.x + this.offsetWidth - 60 + 'px';
                oTitleInfo.style.top = oPos.y - 6 + 'px'; (function () {
                    var aDd = oTitleInfo.getElementsByTagName('dd');
                    for (i = 0; i < aDd.length; i++) {
                        aDd[i].getElementsByTagName('strong')[1].innerHTML = oData.detail[i]
                    }
                })()
            };
            aDd[i].onmouseout = function () {
                oTitleInfo.style.display = 'none'
            }
        }
    })(); (function () {
        var aInput = getEle('#contact_info>input');
        for (var i = 0; i < aInput.length; i++) {
            aInput[i].onclick = function () {
                this.select()
            }
        }
    })(); (function () {
        var oBtn = getEle('#module_new>.course_button')[0];
        var oInputQQ = getEle('#message_content>dd>input')[0];
        oBtn.onclick = function () {
            var oPosBtn = getAbsPos(oBtn);
            var oPosInput = getAbsPos(oInputQQ);
            var oNewDiv = document.createElement('div');
            oNewDiv.style.width = oBtn.offsetWidth + 'px';
            oNewDiv.style.height = oBtn.offsetHeight + 'px';
            oNewDiv.style.left = oPosBtn.x + 'px';
            oNewDiv.style.top = oPosBtn.y + 'px';
            oNewDiv.style.position = 'absolute';
            oNewDiv.style.border = '1px solid #669';
            oNewDiv.style.opacity = '1';
            oNewDiv.style.zIndex = 999;
            document.body.appendChild(oNewDiv);
            miaovStartMove(oNewDiv, {
                left: oPosInput.x,
                top: oPosInput.y,
                width: oInputQQ.offsetWidth,
                height: oInputQQ.offsetHeight
            },
            MIAOV_MOVE_TYPE.BUFFER,
            function () {
                document.body.removeChild(oNewDiv);
                var i = 0;
                var timer = setInterval(function () {
                    oInputQQ.style.background = i % 2 ? 'url(../images/text_bg.gif) #fff repeat-x' : '#EEE';
                    i++;
                    if (i > 9) {
                        clearInterval(timer)
                    }
                },
                100)
            })
        }
    })()
}
function initVideoList(iNow, aData, iRow, iCol, iWidth, iHeight) { //(当前页,数据,行,列,高，宽)
    var oDiv = document.getElementById('new_module_list');   //视频父级 div
    var oPageBtnParent = getEle('.new_module_list_page', oDiv)[0];// 子级 pager div
    var aPageBtn = getEle('a', oPageBtnParent); //翻页按钮 a
    var oUl = getEle('.list', oDiv)[0]; //视频列表ul
    var aListItem = getEle('li', oUl);  //视频li集合
    var oInfo = document.getElementById('title_info');//视频信息提示及时浮动框(*)
    var bDoing = false;///?
    var aPos = [];//翻页按钮位置集合
    var i = 0, j = 0;
    
    var iInterval = 100;
    var iOpenMsg = 0;//及时浮动框数据条数初始值
    bindEventToLi(aListItem);
    static2Abs(oPageBtnParent, [{
        x: 0,
        y: type == 1 ? 430 : 620
    }]);
    pCss(oPageBtnParent, 'zIndex', '99');
    pCss(oUl, 'position', 'absolute');
    for (i = 0; i < iRow; i++) {
        for (j = 0; j < iCol; j++) {
            aPos.push({
                x: 36 + (36 + iWidth) * j,
                y: 32 + (32 + iHeight) * i
            })
        }
    }
    for (i = 0; i < aListItem.length; i++) aListItem[i].style.zIndex = iRow * iCol + 1 - i;
    static2Abs(aListItem, aPos);
    pCss(aListItem, 'opacity', '1');
    for (i = 0; i < aPageBtn.length; i++) {
        aPageBtn[i].onclick = (function (index) {
            return function () {
                changePage(index)
            }
        })(i)
    }
    var iItem = 0;
    function initNexter() {
        iItem = aListItem.length - 1
    }
    function calcNexter() {
        if (iItem-- == -1) return -1;
        else return iItem + 1
    }
    function changePage(iPage) {
        if (bDoing || iNow == iPage) return;
        bDoing = true;
        var iWating = 0;
        ppt.disableAutoPlay();
        if (aListItem.length) {
            var oBtn = aPageBtn[iPage];
            var oPosBtn = getRelPos(oBtn, aListItem[0].offsetParent);
            var oOldBtn = aPageBtn[iNow];
            var oOldPosBtn = getRelPos(oOldBtn, aListItem[0].offsetParent);
            initNexter();
            var timer = setInterval(function () {
                var next = calcNexter();
                if (next <= -1) {
                    clearInterval(timer);
                    timer = 0
                } else {
                    miaovStartMove(aListItem[next], {
                        left: oOldPosBtn.x,
                        top: oOldPosBtn.y,
                        alpha: 0,
                        width: oOldBtn.offsetWidth,
                        height: oOldBtn.offsetHeight
                    },
                    MIAOV_MOVE_TYPE.BUFFER,
                    function () {
                        iWating--;
                        oUl.removeChild(this);
                        if (0 == iWating && !timer) nextPage()
                    });
                    iWating++
                }
            },
            iInterval)
        }
        function nextPage() {
            for (i = 0; i < aPageBtn.length; i++) {
                aPageBtn[i].className = ''
            }
            aPageBtn[iPage].className = 'active';
            aListItem = [];
            for (i = iPage * iRow * iCol, j = 0; i < Math.min(aData.length, (iPage + 1) * iRow * iCol); i++, j++) {
                var oLi = document.createElement('li');
                oLi.innerHTML = sprintf('<input type="hidden" value="{ID: %1}" /><div class="pic"><a href="javascript:;"><img src="%2" alt="%3" longdesc="%3" width="120" height="90" /></a></div><h3><a href="javascript:;">%3</a></h3><p><span class="click_rate">%4</span></p>', aData[i].ID, aData[i].pic, aData[i].title, aData[i].count);
                oUl.appendChild(oLi);
                aListItem.push(oLi)
            }
            for (i = 0; i < aListItem.length; i++) {
                aListItem[i].style.margin = '0px';
                aListItem[i].style.position = 'absolute';
                aListItem[i].style.left = oPosBtn.x + 'px';
                aListItem[i].style.top = oPosBtn.y + 'px';
                aListItem[i].style.width = oBtn.offsetWidth + 'px';
                aListItem[i].style.height = oBtn.offsetHeight + 'px';
                aListItem[i].style.zIndex = iRow * iCol + 1 - i;
                aListItem[i].style.opacity = 0;
                aListItem[i].style.filter = 'alpha(opacity:0)'
            }
            initNexter();
            timer = setInterval(function () {
                var next = calcNexter();
                if (next <= -1) {
                    clearInterval(timer);
                    timer = 0
                } else {
                    aListItem[next].style.opacity = 0.3;
                    aListItem[next].style.filter = 'alpha(opacity:30)';
                    miaovStartMove(aListItem[next], {
                        left: aPos[next].x,
                        top: aPos[next].y,
                        alpha: 100,
                        width: iWidth,
                        height: iHeight
                    },
                    MIAOV_MOVE_TYPE.BUFFER,
                    function () {
                        iWating--;
                        if (0 == iWating && !timer) {
                            iNow = iPage;
                            bDoing = false;
                            ppt.enableAutoPlay();
                            bindEventToLi(aListItem)
                        }
                    });
                    iWating++
                }
            },
            iInterval);
            if (0 == aListItem.length) {
                iNow = iPage;
                bDoing = false
            }
        }
    }
    function bindEventToLi(aLi) {
        for (var i = 0; i < aLi.length; i++) {
            aLi[i].onmouseover = function () {
                clearTimeout(this._t_out);
                this.style.background = '#fff';
                oInfo.style.display = 'block';
                document.onmousemove = function (ev) {
                    var oEvent = ev || event;
                    var oAdorn = getEle('.adorn,.adorn_r', oInfo)[0];
                    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                    var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
                    var clientWidth = document.documentElement.clientWidth;
                    var l = oEvent.clientX + scrollLeft;
                    var t = oEvent.clientY + scrollTop;
                    if (l + oInfo.offsetWidth >= scrollLeft + clientWidth) {
                        l = l - 10 - oInfo.offsetWidth;
                        oAdorn.className = 'adorn_r'
                    } else {
                        l += 10;
                        oAdorn.className = 'adorn'
                    }
                    oInfo.style.left = l + 'px';
                    oInfo.style.top = t - 20 + 'px'
                };
                var oData = findDataFromLi(this);
                getEle('dl>dt', oInfo)[0].innerHTML = oData.title;
                getEle('dl>dd', oInfo)[0].innerHTML = '<strong>效果说明：</strong>' + oData.description;
                getEle('dl>dd', oInfo)[2].innerHTML = '<strong>预计学习时间：</strong>' + formatTime(parseInt(oData.length));
                var oFull = getEle('.star_parent>.full', oInfo)[0];
                var oRankCount = getEle('dl>.rank_count', oInfo)[0];
                oFull.style.width = oData.rank * oFull.parentNode.offsetWidth / 5 + 'px';
                oRankCount.innerHTML = oData.rank_count;
                getEle('#title_info>.bg')[0].style.height = getEle('#title_info>dl')[0].offsetHeight + 10 + 'px'
            };
            aLi[i].onmouseout = function () {
                var _this = this;
                this._t_out = setTimeout(function () {
                    _this.style.background = '#f3f3f3';
                    oInfo.style.display = 'none';
                    document.onmousemove = null;
                    _this._t_out = null
                },
                30)
            };
            aLi[i].onclick = function () {
                var oData = findDataFromLi(this);
                openVideo(oData.ID)
            }
        }
    }
    function findDataFromLi(oLi) {
        var oInput = oLi.getElementsByTagName('input')[0];
        var sID = eval('(' + oInput.value + ').ID');
        return findData(sID)
    }
    function findData(id) {
        for (i = 0; i < aData.length; i++) if (aData[i].ID == id) return aData[i]
    }
    var oClose = getEle('.float_layer_box>.close')[0];
    oClose.onclick = closeVideo;
    var scrollTop = 0;
    var clientHeight = 0;
    var openMsgVideoInner = null;
    function closeVideo() {
        ppt.enableAutoPlay();
        var oDiv = getEle('.float_layer')[0];
        var oBg = getEle('.float_layer_bg')[0];
        var oBoxInDiv = getEle('.float_layer_box', oDiv)[0];
        var oBgInDiv = getEle('.bg', oDiv)[0];
        var oBtnOpenMsg = getEle('.video_msg_wrap>.video_msg_down_btn', oBoxInDiv)[0];
        var oBtnOpenMsg2 = getEle('.video_msg_wrap>.video_msg_up_btn', oBoxInDiv)[0];
        var oBoxMsg = getEle('.video_msg_wrap>.msg_box', oBoxInDiv)[0];
        var oPlay = getEle('.play', oBoxInDiv)[0];
        function closeVideoInner() {
            oPlay.innerHTML = '';
            miaovStartMove(oBoxInDiv, {
                height: 0
            },
            MIAOV_MOVE_TYPE.BUFFER_FAST,
            function () {
                miaovStartMove(oBg, {
                    alpha: 0
                },
                MIAOV_MOVE_TYPE.BUFFER,
                function () {
                    oBg.style.display = 'none'
                });
                oDiv.style.display = 'none'
            },
            function () {
                var iHeightBg = oBoxInDiv.offsetHeight + 20;
                oDiv.style.top = scrollTop + (clientHeight - iHeightBg) / 2 + 'px';
                oBgInDiv.style.height = iHeightBg + 'px'
            })
        }
        if (iOpenMsg % 2) {
            openMsgVideoInner(closeVideoInner);
            oBtnOpenMsg.style.display = 'block';
            oBtnOpenMsg2.style.display = 'none'
        } else {
            closeVideoInner()
        }
        iOpenMsg = 0
    }
    function openVideo(id) {
        ppt.disableAutoPlay();
        var oDiv = getEle('.float_layer')[0];
        var oBg = getEle('.float_layer_bg')[0];
        var oData = findData(id);
        var oBoxInDiv = getEle('.float_layer_box', oDiv)[0];
        var oBgInDiv = getEle('.bg', oDiv)[0];
        var oBtnOpenMsg = getEle('.video_msg_wrap>.video_msg_down_btn', oBoxInDiv)[0];
        var oBtnOpenMsg2 = getEle('.video_msg_wrap>.video_msg_up_btn', oBoxInDiv)[0];
        var oBoxMsg = getEle('.video_msg_wrap>.msg_box', oBoxInDiv)[0];
        scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        clientHeight = document.documentElement.clientHeight;
        var oTitle = getEle('h2>span', oBoxInDiv)[0];
        oTitle.innerHTML = oData.title;
        if (type == 2) {
            var oDown = getEle('.fun>a', oBoxInDiv)[0];
            oDown.href = oData.addr
        }
        var url = 'videoPost.php?act=clk&id=' + id + '&t=' + (new Date()).getTime();
        ajaxGet(url);
        oBg.style.filter = 'alpha(opacity:0)';
        oBg.style.opacity = '0';
        oBg.style.display = 'block';
        oBg.style.top = scrollTop + 'px';
        oBg.style.display = 'block';
        oBg.style.height = clientHeight + 'px';
        miaovStartMove(oBg, {
            alpha: 30
        },
        MIAOV_MOVE_TYPE.BUFFER,
        function () {
            oBg.style.top = '0';
            oBg.style.height = document.body.offsetHeight + 'px';
            oDiv.style.display = 'block';
            oBoxInDiv.style.height = '';
            var iHeightBox = oBoxInDiv.offsetHeight - 4;
            oBoxInDiv.style.height = '0';
            oBgInDiv.style.height = '0';
            oDiv.style.top = scrollTop + clientHeight / 2 + 'px';
            oDiv.style.left = oBgInDiv.offsetWidth / 2 + 'px';
            miaovStartMove(oBoxInDiv, {
                height: iHeightBox
            },
            MIAOV_MOVE_TYPE.BUFFER_FAST,
            function () {
                var oPlay = getEle('.play', oBoxInDiv)[0];
                if (type == 1) {
                    oPlay.innerHTML = '<embed src="' + oData.addr + '" allowFullScreen="true" quality="high" width="550" height="400" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>'
                } else {
                    oPlay.innerHTML = '<image src="' + oData.bpic + '" width="550" height="400"/>'
                }
            },
            function () {
                var iHeightBg = oBoxInDiv.offsetHeight + 20;
                var top = Math.max(0, scrollTop + (clientHeight - iHeightBg) / 2);
                oDiv.style.top = top + 'px';
                oBgInDiv.style.height = iHeightBg + 'px'
            })
        });
        var oRank = getEle('.float_layer>.float_layer_box>.fun>.rank')[0];
        oRank.innerHTML = '<span></span><span></span><span></span><span></span><span></span><strong>我来评分</strong>';
        var aSpan = getEle('span', oRank);
        var i = 0;
        for (i = 0; i < aSpan.length; i++) {
            aSpan[i].index = i;
            aSpan[i].onmouseover = function () {
                for (i = 0; i < aSpan.length; i++) {
                    aSpan[i].className = i <= this.index ? 'active' : ''
                }
            };
            aSpan[i].onmouseout = function () {
                for (i = 0; i < aSpan.length; i++) {
                    aSpan[i].className = ''
                }
            };
            aSpan[i].onclick = function () {
                var iRank = this.index + 1;
                oRank.innerHTML = oRank.innerHTML;
                var oStrong = oRank.getElementsByTagName('strong')[0];
                oStrong.innerHTML = '感谢您的评分';
                oStrong.style.color = '#C03';
                var url = 'rankPost.php?' + ['itemID=' + id, 'rank=' + iRank, 'type=0', 't=' + (new Date()).getTime()].join('&');
                ajaxGet(url,
                function (str) { })
            }
        }
        openMsgVideoInner = function (fnEnd) {
            if (typeof fnEnd != 'function') fnEnd = null;
            if (iOpenMsg % 2 == 0) {
                oBoxMsg.style.height = '';
                oBtnOpenMsg.style.display = 'none';
                oBtnOpenMsg2.style.display = 'block'
            } else {
                oBoxMsg.style.height = '0px';
                oBtnOpenMsg.style.display = 'block';
                oBtnOpenMsg2.style.display = 'none'
            }
            iOpenMsg++;
            var iOldHeight = oBoxInDiv.offsetHeight;
            oBoxInDiv.style.height = '';
            var iHeight = oBoxInDiv.offsetHeight - 4;
            oBoxInDiv.style.height = iOldHeight + 'px';
            miaovStartMove(oBoxInDiv, {
                height: iHeight
            },
            MIAOV_MOVE_TYPE.BUFFER_FAST, fnEnd,
            function () {
                var iHeightBg = oBoxInDiv.offsetHeight + 20;
                var top = Math.max(0, scrollTop + (clientHeight - iHeightBg) / 2);
                oDiv.style.top = top + 'px';
                oBgInDiv.style.height = iHeightBg + 'px';
                oBg.style.height = document.body.scrollHeight + 'px'
            })
        };
        oBtnOpenMsg.onclick = openMsgVideoInner;
        oBtnOpenMsg2.onclick = openMsgVideoInner
    }
}
function initVideo() {
    var fName = type == 1 ? 'video' : 'fx';
    var iRow = type == 1 ? 2 : 3;
    ajaxGet('ext_data/' + fName + '.json?t=' + (new Date()).getTime(),
    function (str) {
        var aDatas = eval(str);
        aDatas.pop();
        var oBtnDiv = getEle('#new_module_list>.new_module_list_page')[0];
        var aBtn = oBtnDiv.getElementsByTagName('a');
        oBtnDiv.innerHTML = '';
        for (var i = 0; i < aDatas.length / (iRow * 5); i++) {
            oBtnDiv.innerHTML += '<a href="javascript:;">' + (i + 1) + '</a>'
        }
        if (aBtn.length) aBtn[iInitPage].className = 'active';
        initVideoList(iInitPage, aDatas, iRow, 5, 140, 148)
    });
    addForm(document.getElementById('msg_pos_form'), [document.getElementById('msg_name'), document.getElementById('msg_content')]);
    addForm(document.getElementById('msg_pos_form2'), [document.getElementById('msg_name2'), document.getElementById('msg_content2')]);
    function addForm(oForm, aInput) {
        var oName = aInput[0],
        oContent = aInput[1];
        var oDate = new Date();
        var aDefault = [];
        var aDefaultText = ['请输入你的姓名', '请输入留言的内容'];
        function toDouble(val) {
            val += '';
            return val.length == 1 ? '0' + val : val
        }
        oForm.onsubmit = function () {
            var i = 0;
            var sDate = oDate.getFullYear() + '-' + toDouble((oDate.getMonth() + 1)) + '-' + toDouble(oDate.getDate());
            var sTime = oDate.getHours() + ':' + toDouble(oDate.getMinutes()) + ':' + toDouble(oDate.getSeconds());
            var bFaild = false;
            for (i = 0; i < aInput.length; i++) {
                if (/^\s*$/.test(aInput[i].value)) {
                    if (!aDefault[i]) {
                        aDefault[i] = new InputDefaultText(aInput[i], aDefaultText[i], '#C03')
                    }
                    bFaild = true
                } else if (aDefault[i] && aDefault[i].isDefault) {
                    bFaild = true
                } else {
                    if (aDefault[i]) {
                        aDefault[i].remove();
                        aDefault[i] = null
                    }
                }
            }
            if (bFaild) {
                return false
            }
            var url = oForm.action + '?msg_title=noTitle&' + aInput[0].name + '=' + encodeURIComponent(aInput[0].value) + '&' + aInput[1].name + '=' + encodeURIComponent(aInput[1].value) + '&msg_email=noContact&type=' + type;
            ajaxGet(url,
            function (msg) {
                var str = eval('(' + msg + ')');
                if (str.code == 1) {
                    var aUl = getEle('.new_message_ul');
                    for (var i = 0; i < aUl.length; i++) {
                        var oData = {
                            name: oName.value,
                            date: sDate,
                            time: sTime,
                            content: oContent.value,
                            reply: ''
                        };
                        addLi(aUl[i], oData, MoveLibType.COLLISION);
                        aMsg.unshift(oDate);
                        while (aMsg.length > 50) {
                            aMsg.pop()
                        }
                    }
                    oContent.value = '';
                    setCookie('msg_name', oName.value, 30)
                } else {
                    alert('留言失败，请稍后重试，或使用右侧其他方法和我们取得联系')
                }
            });
            return false
        };
        function addLi(oUl, oData, iMoveType, fnEnd) {
            var oLi = document.createElement('li');
            var sReply = oData.reply ? ('<p class="reply">' + oData.reply + '</p>') : '';
            oLi.innerHTML = '<h3><span>[' + oData.name + ']</span><span>' + oData.date + '</span><span>' + oData.time + '</span></h3><div class="text_content"><p>' + oData.content + '</p>' + sReply + '</div>';
            oUl.insertBefore(oLi, oUl.firstChild);
            var iHeight = oLi.offsetHeight;
            if (iHeight) {
                oLi.style.height = '0px';
                var oMove = new MoveLib([0], [100],
                function (aCur) {
                    oLi.style.height = aCur[0].cur + 'px'
                },
                function () {
                    if (fnEnd) fnEnd.call(oLi)
                },
                iMoveType);
                oMove.setTarget([iHeight])
            }
            var aLi = oUl.getElementsByTagName('li');
            while (aLi.length > 10) {
                oUl.removeChild(aLi[aLi.length - 1])
            }
        }
        var obj = oForm;
        while (obj.parentNode != document.body) obj = obj.parentNode;
        var oPageDiv = getEle('.float_layer_page', obj)[0];
        oPageDiv.innerHTML = '';
        for (i = 0; i < aMsg.length / 5; i++) {
            if (i == 0) {
                oPageDiv.innerHTML += '<a href="javascript:;" class="active">' + (i + 1) + '</a>'
            } else {
                oPageDiv.innerHTML += '<a href="javascript:;">' + (i + 1) + '</a>'
            }
        }
        var aPageA = oPageDiv.getElementsByTagName('a');
        var aAllPage = getEle('.float_layer_page');
        var aUl = getEle('.new_message_ul'); (function () {
            var bMoving = false;
            for (i = 0; i < aPageA.length; i++) {
                aPageA[i].index = i;
                aPageA[i].onclick = function () {
                    if (bMoving) return;
                    bMoving = true;
                    var iNow = this.index;
                    for (var k = 0; k < aUl.length; k++) {
                        var aPageA = aAllPage[k].getElementsByTagName('a');
                        for (i = 0; i < aPageA.length; i++) {
                            aPageA[i].className = ''
                        }
                        aPageA[iNow].className = 'active'; (function (k, j) {
                            var i = 0;
                            function aaa() {
                                if (i < 5 && j >= 0) {
                                    addLi(aUl[k], aMsg[j], MIAOV_MOVE_TYPE.BUFFER_FAST, aaa);
                                    i++;
                                    j--
                                } else {
                                    bMoving = false
                                }
                            }
                            aaa()
                        })(k, Math.min((this.index + 1) * 5 - 1, aMsg.length - 1))
                    }
                }
            }
        })();
        oName.value = getCookie('msg_name')
    }
}
function initWeekEnd(sDataPath) {
    var oDiv = document.getElementById('course');
    var oTab = getEle('.curriculum_content', oDiv)[0];
    var oBtnOl = getEle('#number_bar>ol')[0];
    var aBtn = oBtnOl.getElementsByTagName('li');
    var oBtnNext = getEle('#number_bar>.next')[0];
    var aUl = [];
    var aTd = [];
    var bMoving = false;
    var iNowType = 0;
    var i = 0;
    var aTr = oTab.getElementsByTagName('tr');
    for (i = 0; i < 4; i++) {
        aTr[i].getElementsByTagName('td')[0].innerHTML = '<div><ul><li></li><li></li></ul></div>';
        aUl.push(aTr[i].getElementsByTagName('ul')[0]);
        aTd.push(aTr[i].getElementsByTagName('td')[0]);
        aUl[i].index = i
    }
    ajaxGet(sDataPath,
    function (str) {
        var aData = eval(str);
        function createData() {
            var iNow = 0;
            setDataToUl(0, aData[iNowType][0]);
            oBtnOl.innerHTML = '';
            for (i = 0; i < aData[iNowType].length; i++) oBtnOl.innerHTML += '<li></li>';
            if (aBtn[0]) aBtn[0].className = 'active';
            for (i = 0; i < aBtn.length; i++) {
                aBtn[i].index = i;
                aBtn[i].onclick = function () {
                    tab(this.index)
                }
            }
            oBtnNext.onclick = function () {
                tab((iNow + 1) % aBtn.length)
            };
            function tab(index) {
                if (bMoving) return;
                bMoving = true;
                iNow = index;
                for (i = 0; i < aBtn.length; i++) aBtn[i].className = '';
                changeItem(aData[iNowType][iNow]);
                if (aBtn[iNow]) aBtn[iNow].className = 'active'
            }
        }
        createData();
        var aA = getEle('#week_end_nav>li>.active');
        for (i = 0; i < aA.length; i++) {
            aA[i].index = i;
            aA[i].onclick = function () {
                if (this.index == iNowType) return;
                if (bMoving) return;
                iNowType = this.index;
                for (i = 0; i < aA.length; i++) {
                    var oA = aA[i].parentNode.getElementsByTagName('a')[0];
                    if (aA[i].index == iNowType) {
                        miaovStartMove(oA, {
                            alpha: 0
                        });
                        miaovStartMove(aA[i], {
                            alpha: 100
                        })
                    } else {
                        miaovStartMove(oA, {
                            alpha: 100
                        });
                        miaovStartMove(aA[i], {
                            alpha: 0
                        })
                    }
                }
                createData()
            }
        }
    },
    function () {
        alert('è¯»å–æ•°æ®å¤±è´¥')
    });
    function setDataToUl(iLi, oData) {
        if (!oData) {
            for (i = 0; i < aUl.length; i++) {
                var oLi = aUl[i].getElementsByTagName('li')[iLi];
                oLi.innerHTML = '--';
                aUl[i].style.height = 2 * oLi.offsetHeight + 'px';
                aTd[i].style.height = oLi.offsetHeight + 'px'
            }
            aUl[0].getElementsByTagName('li')[iLi].innerHTML = 'æ— æ­¤æ—¶é—´çš"è¯¾ç¨‹'
        } else {
            var aStr = [oData.name + '&mdash;' + oData.course, oData.time, oData.location, oData.content];
            var oAMap = getEle('#course_details>.curriculum_content>.miaov_map')[0];
            for (i = 0; i < aUl.length; i++) {
                var oLi = aUl[i].getElementsByTagName('li')[iLi];
                oLi.innerHTML = aStr[i];
                aUl[i].style.height = 2 * oLi.offsetHeight + 'px';
                aUl[i].style.top = '0'
            }
            oAMap.href = oData.location_href
        }
    }
    function changeItem(oData) {
        var __iNow = 0;
        setDataToUl(1, oData);
        var timer = setInterval(function () {
            miaovStartMove(aUl[__iNow], {
                top: -aUl[__iNow].getElementsByTagName('li')[0].offsetHeight
            },
            MIAOV_MOVE_TYPE.BUFFER,
            function () {
                var iHeight = this.getElementsByTagName('li')[1].offsetHeight;
                var _this = this;
                var aLi = this.getElementsByTagName('li');
                var iIndex = this.index;
                miaovStartMove(aTd[this.index], {
                    height: iHeight
                },
                MIAOV_MOVE_TYPE.BUFFER,
                function () {
                    aLi[0].innerHTML = aLi[1].innerHTML;
                    _this.style.top = '0';
                    if (iIndex == 3) {
                        bMoving = false
                    }
                })
            });
            __iNow++;
            if (__iNow >= aUl.length) {
                clearInterval(timer)
            }
        },
        100)
    }
}
function initNews() {
    var oDiv = document.getElementById('index_info');
    var oInfo = getByClass(oDiv, 'blue_info')[0];
    var oNews = getByClass(oDiv, 'blue_news')[0];
    var DATA_COUNT = 7;
    var aFnNext = [];
    initData(oInfo, 'info');
    initData(oNews, 'news');
    function initData(oDl, sData) {
        var iNowData = 0;
        ajaxGet('ext_data/' + sData + '.json?t=' + (new Date()).getTime(),
        function (sResult) {
            var i = 0;
            var aData = eval(sResult);
            var bTop = true;
            var aContainer = [];
            var aDd = [];
            aData.pop(); (function () {
                var aDd = oDl.getElementsByTagName('dd');
                while (aDd.length) oDl.removeChild(aDd[0])
            })();
            for (i = 0; i < 7; i++) {
                var oDd = document.createElement('dd');
                if (aData[iNowData]) {
                    oDd.innerHTML = '<div class="div_container"><div><a href="' + aData[iNowData].url + '" target="_blank">' + aData[iNowData].title + '</a><span>' + aData[iNowData].postTime + '</span></div><div></div></div>'
                }
                iNowData = (iNowData + 1) % aData.length;
                oDl.appendChild(oDd);
                aDd.push(oDd)
            }
            for (i = 0; i < aDd.length; i++) {
                var oBgDd = document.createElement('dd');
                oBgDd.className = 'bg';
                oBgDd.style.display = 'none';
                oBgDd.style.top = aDd[i].offsetTop + 'px'; (function (oDd, oBg) {
                    var oVis = new Visibility(oBg, VisibilityMode.MODE_DIRECTSHOW_OPACITYHIDE);
                    var oTimer = null;
                    oVis.setOpacityArg(10, 20);
                    oDd.onmouseover = function () {
                        clearTimeout(oTimer);
                        oVis.show()
                    };
                    oDd.onmouseout = function () {
                        clearTimeout(oTimer);
                        oTimer = setTimeout(function () {
                            oVis.hide()
                        },
                        0)
                    }
                })(aDd[i], oBgDd);
                oDl.appendChild(oBgDd)
            }
            aContainer = getByClass(oDl, 'div_container');
            aFnNext.push(function () {
                var i = 0;
                for (i = 0; i < aContainer.length; i++) {
                    aContainer[i].getElementsByTagName('div')[bTop ? 1 : 0].innerHTML = '<a href="' + aData[iNowData].url + '" target="_blank">' + aData[iNowData].title + '</a><span>' + aData[iNowData].postTime + '</span>';
                    iNowData = (iNowData + 1) % aData.length
                }
                i = 0;
                var innerTimer = setInterval(function () {
                    if (aContainer[i]) {
                        miaovStartMove(aContainer[i++], {
                            top: bTop ? -30 : 0
                        },
                        MIAOV_MOVE_TYPE.BUFFER)
                    }
                    if (i == 7) {
                        clearInterval(innerTimer);
                        bTop = !bTop
                    }
                },
                60)
            })
        })
    }
    i = 0;
    setInterval(function () {
        aFnNext[(i++) % aFnNext.length]()
    },
    5000)
}
function PerfectDrag(oElementDrag, fnGetPos, fnDoMove, fnOnDragStart, fnOnDragEnd) {
    var obj = this;
    this.oElement = oElementDrag;
    this.oElement.style.overflow = 'hidden';
    this.fnGetPos = fnGetPos;
    this.fnDoMove = fnDoMove;
    this.fnOnDragStart = fnOnDragStart;
    this.fnOnDragEnd = fnOnDragEnd;
    this.__oStartOffset__ = {
        x: 0,
        y: 0
    };
    this.oElement.onmousedown = function (ev) {
        obj.startDrag(window.event || ev);
        return false
    };
    this.fnOnMouseUp = function (ev) {
        obj.stopDrag(window.event || ev)
    };
    this.fnOnMouseMove = function (ev) {
        obj.doDrag(window.event || ev)
    }
}
PerfectDrag.prototype.enable = function () {
    var obj = this;
    this.oElement.onmousedown = function (ev) {
        obj.startDrag(window.event || ev);
        return false
    }
};
PerfectDrag.prototype.disable = function () {
    this.oElement.onmousedown = null
};
PerfectDrag.prototype.startDrag = function (oEvent) {
    var oPos = this.fnGetPos();
    var x = oEvent.clientX;
    var y = oEvent.clientY;
    if (this.fnOnDragStart) {
        this.fnOnDragStart()
    }
    this.__oStartOffset__.x = x - oPos.x;
    this.__oStartOffset__.y = y - oPos.y;
    if (this.oElement.setCapture) {
        this.oElement.setCapture();
        this.oElement.onmouseup = this.fnOnMouseUp;
        this.oElement.onmousemove = this.fnOnMouseMove
    } else {
        document.addEventListener("mouseup", this.fnOnMouseUp, true);
        document.addEventListener("mousemove", this.fnOnMouseMove, true);
        window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP)
    }
};
PerfectDrag.prototype.stopDrag = function (oEvent) {
    if (this.oElement.releaseCapture) {
        this.oElement.releaseCapture();
        this.oElement.onmouseup = null;
        this.oElement.onmousemove = null
    } else {
        document.removeEventListener("mouseup", this.fnOnMouseUp, true);
        document.removeEventListener("mousemove", this.fnOnMouseMove, true);
        window.releaseEvents(Event.MOUSE_MOVE | Event.MOUSE_UP)
    }
    if (this.fnOnDragEnd) {
        if (oEvent.clientX == this.__oStartOffset__.x && oEvent.clientY == this.__oStartOffset__.y) {
            this.fnOnDragEnd(false)
        } else {
            this.fnOnDragEnd(true)
        }
    }
};
PerfectDrag.prototype.doDrag = function (oEvent) {
    var x = oEvent.clientX;
    var y = oEvent.clientY;
    this.fnDoMove(x - this.__oStartOffset__.x, y - this.__oStartOffset__.y)
};
function Popup(oPopupElement, oElementForDrog, iMaxBGOpacity, fnResizeElement, fnGetElementSize) {
    var initSize = fnGetElementSize();
    var obj = this;
    this.__iMaxBGOpacity__ = iMaxBGOpacity;
    this.__oPopupElement__ = oPopupElement;
    this.__fnResize__ = fnResizeElement;
    this.onshowend = null;
    this.onhideend = null;
    this.__iInitElementWidth__ = initSize.width;
    this.__iInitElementHeight__ = initSize.height;
    this.__iInitBodyWidth__ = document.body.offsetWidth;
    this.__iInitBodyHeight__ = document.body.offsetHeight;
    this.__iElementLeft__ = 0;
    this.__iElementTop__ = 0;
    this.__iScrollTop__ = 0;
    this.__oMaskDiv__ = document.createElement('div');
    this.__oMaskDiv__.style.position = 'absolute';
    this.__oMaskDiv__.style.background = 'black';
    this.__oMaskDiv__.style.left = '0px';
    this.__oMaskDiv__.style.top = '0px';
    this.__oMaskDiv__.style.width = document.body.offsetWidth + 'px';
    this.__oMaskDiv__.style.height = document.body.offsetHeight + 'px';
    this.__oMaskDiv__.style.zIndex = '2900';
    this.__oMaskDiv__.style.display = 'none';
    document.body.appendChild(this.__oMaskDiv__);
    miaovAppendEventListener(window, "resize",
    function () {
        obj.__oMaskDiv__.style.width = document.body.offsetWidth + 'px'
    });
    oPopupElement.style.zIndex = '2901';
    this.__oDrag__ = new PerfectDrag(oElementForDrog,
    function () {
        return {
            x: oPopupElement.offsetLeft,
            y: oPopupElement.offsetTop
        }
    },
    function (x, y) {
        oPopupElement.style.left = x + 'px';
        oPopupElement.style.top = y + 'px'
    },
    function () {
        obj.__oEM__.pause = true
    },
    function (bChange) {
        obj.__iElementLeft__ = oPopupElement.offsetLeft;
        obj.__iElementTop__ = oPopupElement.offsetTop;
        obj.__oEM__.pause = false
    });
    this.__bEMShow__ = false;
    this.__oEM__ = new MoveLib([0, 0, 0], [40, 40, 20],
    function (arr) {
        obj.__fnResize__(obj.__iElementLeft__ + (obj.__iInitElementWidth__ - arr[0].cur) / 2, obj.__iElementTop__ + (obj.__iInitElementHeight__ - arr[1].cur) / 2, arr[0].cur, arr[1].cur, arr[2].cur)
    },
    function (arr) {
        if (obj.onshowend) {
            obj.onshowend()
        }
        obj.__oDrag__.enable()
    },
    MoveLibType.BUFFER_CUSTOM, 6);
    this.__oEMClose__ = new MoveLib([0, 0, 0], [40, 40, 20],
    function (arr) {
        obj.__fnResize__(obj.__iElementLeft__ + (obj.__iInitElementWidth__ - arr[0].cur) / 2, obj.__iElementTop__ + (obj.__iInitElementHeight__ - arr[1].cur) / 2, arr[0].cur, arr[1].cur, arr[2].cur)
    },
    function (arr) {
        obj.__oShowTimer__ = setInterval(function () {
            obj.__hideMaskInner__()
        },
        20);
        obj.__oPopupElement__.style.display = 'none';
        obj.__oDrag__.enable()
    },
    MoveLibType.DIRECT_FAST)
}
Popup.prototype.show = function () {
    var obj = this;
    var top = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.clientHeight;
    this.__iElementLeft__ = (this.__iInitBodyWidth__ - this.__iInitElementWidth__) / 2;
    this.__iElementTop__ = top + (height - this.__iInitElementHeight__) / 2;
    this.__oMaskDiv__.style.filter = 'alpha(opacity=0)';
    this.__oMaskDiv__.style.opacity = '0';
    this.__oMaskDiv__.style.display = 'block';
    this.__iMaskOpacity__ = 0;
    this.__oShowTimer__ = setInterval(function () {
        obj.__showMaskInner__()
    },
    20);
    this.__bEMShow__ = true
};
Popup.prototype.__showMaskInner__ = function () {
    var bShowOver = false;
    this.__iMaskOpacity__ += 5;
    if (this.__iMaskOpacity__ >= this.__iMaxBGOpacity__) {
        this.__iMaskOpacity__ = this.__iMaxBGOpacity__;
        bShowOver = true
    }
    this.__oMaskDiv__.style.filter = 'alpha(opacity=' + this.__iMaskOpacity__ + ')';
    this.__oMaskDiv__.style.opacity = this.__iMaskOpacity__ / 100;
    if (bShowOver) {
        clearInterval(this.__oShowTimer__);
        this.__oShowTimer__ = null;
        this.__showPopup__()
    }
};
Popup.prototype.__showPopup__ = function () {
    this.__oPopupElement__.style.display = 'block';
    this.__oEM__.setCurrent([0, 0, 0]);
    this.__oEM__.setTarget([this.__iInitElementWidth__, this.__iInitElementHeight__, 100]);
    this.__oEMClose__.stop();
    this.__oDrag__.disable()
};
Popup.prototype.hide = function () {
    this.__hidePopup__();
    this.__bEMShow__ = false
};
Popup.prototype.__hideMaskInner__ = function () {
    var bShowOver = false;
    this.__iMaskOpacity__ -= 5;
    if (this.__iMaskOpacity__ <= 0) {
        this.__iMaskOpacity__ = 0;
        bShowOver = true
    }
    this.__oMaskDiv__.style.filter = 'alpha(opacity=' + this.__iMaskOpacity__ + ')';
    this.__oMaskDiv__.style.opacity = this.__iMaskOpacity__ / 100;
    if (bShowOver) {
        clearInterval(this.__oShowTimer__);
        this.__oShowTimer__ = null;
        this.__oMaskDiv__.style.display = 'none';
        if (this.onhideend) {
            this.onhideend()
        }
    }
};
Popup.prototype.__hidePopup__ = function () {
    this.__oEMClose__.setCurrent([this.__iInitElementWidth__, this.__iInitElementHeight__, 100]);
    this.__oEMClose__.setTarget([0, 0, 0]);
    this.__oEM__.stop();
    this.__oDrag__.disable()
};
function Ppt(imgElementId, arrImgPath) {
    var obj = this;
    this.currentImgIndex = 0;
    this.arrImgPath = arrImgPath;
    this.timer = null;
    this.autoPlayInterval = 7000;
    this.autoPlayTimer = null;
    this.autoPlayEnabled = true;
    this.cur = 0;
    this.next = 1;
    this.imgElements = [];
    this.imgElements[0] = document.getElementById(imgElementId);
    this.imgElements[0].style.width = this.imgElements[0].offsetWidth + "px";
    this.imgElements[0].style.height = this.imgElements[0].offsetHeight + "px";
    this.imgElements[0].onmouseover = function () {
        obj.disableAutoPlay()
    };
    this.imgElements[0].onmouseout = function () {
        obj.enableAutoPlay()
    };
    this.imgElements[1] = document.createElement("img");
    this.imgElements[1].style.position = 'absolute';
    this.imgElements[1].style.left = this.imgElements[0].offsetLeft + "px";
    this.imgElements[1].style.top = this.imgElements[0].offsetTop + "px";
    this.imgElements[1].style.width = this.imgElements[0].offsetWidth + "px";
    this.imgElements[1].style.height = this.imgElements[0].offsetHeight + "px";
    this.imgElements[1].style.display = 'none';
    this.imgElements[1].onmouseover = function () {
        obj.disableAutoPlay()
    };
    this.imgElements[1].onmouseout = function () {
        obj.enableAutoPlay()
    };
    this.__oLinker__ = document.createElement("a");
    this.__oLinker__.href = this.arrImgPath[0].href;
    this.__oLinker__.target = this.arrImgPath[0].target;
    this.__page__ = null;
    this.__createPage__();
    if (this.imgElements[0].nextSibling) {
        this.imgElements[0].parentNode.insertBefore(this.__oLinker__, this.imgElements[0].nextSibling)
    } else {
        this.imgElements[0].parentNode.appendChild(this.__oLinker__)
    }
    this.__oLinker__.appendChild(this.imgElements[0]);
    this.__oLinker__.appendChild(this.imgElements[1])
}
Ppt.prototype.__createPage__ = function () {
    var oPptDiv = document.getElementById('power_point');
    var aDivs = oPptDiv.getElementsByTagName('div');
    var i;
    this.__page__ = document.createElement('div');
    this.__page__.id = 'num';
    this.__page__.innerHTML = '1/' + this.arrImgPath.length;
    for (i = 0; i < aDivs.length; i++) {
        if (aDivs[i].className = 'btn') {
            aDivs[i].appendChild(this.__page__);
            break
        }
    }
};
Ppt.prototype.__nextIndex__ = function () {
    return (this.currentImgIndex + 1) % this.arrImgPath.length
};
Ppt.prototype.__prevIndex__ = function () {
    return (this.currentImgIndex + this.arrImgPath.length - 1) % this.arrImgPath.length
};
Ppt.prototype.preloadImgs = function () {
    var i = 0;
    var j = 0;
    if (!document.MiaoVImagePreloader) {
        document.miaoVImagePreloader = new Array()
    }
    for (i = 0; i < this.arrImgPath.length; i++) {
        j = document.miaoVImagePreloader.length;
        document.miaoVImagePreloader[j] = new Image();
        document.miaoVImagePreloader[j].src = this.arrImgPath[i].src
    }
};
Ppt.prototype.enableAutoPlay = function () {
    var obj = this;
    this.autoPlayEnabled = true;
    if (!this.autoPlayTimer) {
        this.autoPlayTimer = setInterval(function () {
            obj.playNext()
        },
        this.autoPlayInterval)
    }
};
Ppt.prototype.disableAutoPlay = function () {
    var obj = this;
    this.autoPlayEnabled = false;
    if (this.autoPlayTimer) {
        clearInterval(this.autoPlayTimer);
        this.autoPlayTimer = null
    }
};
Ppt.prototype.resetAutoPlayTime = function () {
    if (!this.autoPlayEnabled) {
        return
    }
    if (this.autoPlayTimer) {
        clearInterval(this.autoPlayTimer);
        this.autoPlayTimer = null
    }
    this.enableAutoPlay()
};
Ppt.prototype.playNext = function () {
    this.changeImg(this.__nextIndex__())
};
Ppt.prototype.playPrev = function () {
    this.changeImg(this.__prevIndex__())
};
Ppt.prototype.changeImg = function (index) {
    var obj = this;
    if (this.timer) {
        return
    }
    this.resetAutoPlayTime();
    if (index >= this.arrImgPath.length) {
        index = this.arrImgPath.length - 1
    }
    if (index < 0) {
        index = 0
    }
    this.__oLinker__.href = this.arrImgPath[index].href;
    this.__oLinker__.target = this.arrImgPath[index].target;
    this.imgElements[this.next].src = this.arrImgPath[index].src;
    this.imgElements[this.next].style.filter = "alpha(opacity=0)";
    this.imgElements[this.next].style.opacity = "0";
    this.imgElements[this.next].style.display = 'block';
    this.curOpacity = 10;
    this.__timerNextIndex__ = index;
    this.timer = setInterval(function () {
        obj.__changeTimerInner__()
    },
    30);
    this.__page__.innerHTML = index + 1 + '/' + this.arrImgPath.length
};
Ppt.prototype.__changeTimerInner__ = function () {
    this.imgElements[this.next].style.filter = "alpha(opacity=" + this.curOpacity + ")";
    this.imgElements[this.next].style.opacity = this.curOpacity / 100;
    this.imgElements[this.cur].style.filter = "alpha(opacity=" + (100 - this.curOpacity) + ")";
    this.imgElements[this.cur].style.opacity = (100 - this.curOpacity) / 100;
    this.curOpacity += 10;
    if (this.curOpacity >= 100) {
        this.imgElements[this.next].style.filter = "";
        this.imgElements[this.next].style.opacity = "";
        this.imgElements[this.cur].style.display = 'none';
        this.currentImgIndex = this.__timerNextIndex__;
        if (this.cur == 1) {
            this.cur = 0;
            this.next = 1
        } else {
            this.cur = 1;
            this.next = 0
        }
        clearInterval(this.timer);
        this.timer = null
    }
};
function QuirkyPopup(oEleMove, oEleDrag, oEleBtn, oCloseBtn, oMaxSize, fnGetPos, fnGetSize, fnDoMove, fnDoResize, fnOnShowEnd, fnOnHideEnd) {
    var obj = this;
    var oSize = fnGetSize();
    var oPos = fnGetPos();
    this.__oEleMove__ = oEleMove;
    this.__oEleDrag__ = oEleDrag;
    this.__oEleBtn__ = oEleBtn;
    this.__oMaxSize__ = oMaxSize;
    this.__fnGetPos__ = fnGetPos;
    this.__fnGetSize__ = fnGetSize;
    this.__fnDoMove__ = fnDoMove;
    this.__fnDoResize__ = fnDoResize;
    this.__fnOnShowEnd__ = fnOnShowEnd;
    this.__fnOnHideEnd__ = fnOnHideEnd;
    this.__oDivOuter__ = document.createElement('div');
    this.__oDivOuter__.style.display = 'none';
    this.__oDivOuter__.style.background = 'white';
    this.__oDivOuter__.style.width = '100%';
    this.__oDivOuter__.style.filter = 'alpha(opacity=0)';
    this.__oDivOuter__.style.opacity = '0';
    this.__oDivOuter__.style.top = '0px';
    this.__oDivOuter__.style.left = '0px';
    this.__oDivOuter__.style.position = 'absolute';
    this.__oDivOuter__.style.zIndex = '3003';
    this.__oDivOuter__.style.overflow = 'hidden';
    this.__oDivOuter__.style.height = document.body.offsetHeight + "px";
    document.body.appendChild(this.__oDivOuter__);
    this.__oDrag__ = new PerfectDrag(oEleDrag, fnGetPos,
    function (x, y) {
        var top = document.body.scrollTop || document.documentElement.scrollTop;
        if (x < 0) {
            x = 0
        } else if (x + obj.__oMaxSize__.x > document.body.offsetWidth) {
            x = document.body.offsetWidth - obj.__oMaxSize__.x
        }
        if (y < top) {
            y = top
        } else if (y + obj.__oMaxSize__.y > top + document.documentElement.clientHeight) {
            y = top + document.documentElement.clientHeight - obj.__oMaxSize__.y
        }
        oEleMove.style.left = x + 'px';
        oEleMove.style.top = y + 'px';
        obj.__oSpeed__.x = x - obj.__oLastPos__.x;
        obj.__oSpeed__.y = y - obj.__oLastPos__.y;
        obj.__oLastPos__.x = x;
        obj.__oLastPos__.y = y
    },
    function () {
        obj.__oLastPos__ = obj.__fnGetPos__();
        obj.stopMove();
        obj.__oDivOuter__.style.display = 'block'
    },
    function () {
        obj.startMove();
        obj.__oDivOuter__.style.display = 'none'
    });
    this.__oDrag__.disable();
    this.__oLastPos__ = {
        x: 0,
        y: 0
    };
    this.__oSpeed__ = {
        x: 0,
        y: 0
    };
    this.__oMoveTimer__ = null;
    this.__oMLResize__ = new MoveLib([oSize.x, oSize.y], [60, 60],
    function (arr) {
        obj.__fnDoMove__(oPos.x, oPos.y - arr[1].cur / 2);
        obj.__fnDoResize__(arr[0].cur, arr[1].cur)
    },
    function () {
        obj.__oDrag__.enable();
        obj.startMove();
        oCloseBtn.onmousedown = function () {
            obj.hide();
            return false
        }
    },
    MoveLibType.BUFFER);
    this.__oMLMove__ = new MoveLib([0, 0], [40, 40],
    function (arr) {
        obj.__fnDoMove__(arr[0].cur, arr[1].cur)
    },
    function () {
        obj.startShowBtn();
        obj.__oDock__.fnOnResizeOrScroll = function (oPos) {
            obj.__oEleMove__.left = -obj.__oMaxSize__.x + 'px'
        }
    },
    MoveLibType.BUFFER);
    this.__oMLBtn__ = new MoveLib([0], [40],
    function (arr) {
        obj.__oDock__.move({
            left: arr[0].cur,
            top: 0
        })
    },
    function () {
        if (this.isOpening) {
            obj.__oSpeed__.x = 150 + Math.ceil(Math.random() * 150);
            obj.__oSpeed__.y = 0;
            obj.startMove();
            obj.__oDrag__.enable();
            this.isOpening = false
        }
    },
    MoveLibType.BUFFER);
    this.__oMLBtn__.isOpening = false;
    this.iAcc = 3;
    this.fScale = -0.7;
    this.__oEleBtn__.style.display = 'block';
    this.__oDock__ = new Dock(oEleBtn, DockType.LEFT | DockType.TOP, {
        left: -oEleBtn.offsetWidth,
        top: 0
    },
    null, null);
    this.__oEleBtn__.onclick = function () {
        var top = document.body.scrollTop || document.documentElement.scrollTop;
        oEleMove.style.top = top + 'px';
        obj.show()
    }
}
QuirkyPopup.prototype.initShow = function () {
    var obj = this;
    this.__oMLResize__.setTarget([this.__oMaxSize__.x, this.__oMaxSize__.y])
};
QuirkyPopup.prototype.show = function () {
    this.__oDrag__.disable();
    this.stopMove();
    this.__oMLBtn__.setCurrent([0]);
    this.__oMLBtn__.setTarget([-this.__oEleBtn__.offsetWidth]);
    this.__oMLBtn__.isOpening = true
};
QuirkyPopup.prototype.hide = function () {
    var obj = this;
    var oPos = this.__fnGetPos__();
    var oSize = this.__oDock__.getScreen();
    var top = document.body.scrollTop || document.documentElement.scrollTop;
    this.__oDrag__.disable();
    this.stopMove();
    this.__oMLMove__.setCurrent([oPos.x, oPos.y]);
    this.__oMLMove__.setTarget([-this.__oMaxSize__.x, oSize.top]);
    this.__oDock__.fnOnResizeOrScroll = function (oSize) {
        obj.__oMLMove__.setTarget([-obj.__oMaxSize__.x, oSize.top])
    }
};
QuirkyPopup.prototype.startShowBtn = function () {
    this.__oMLBtn__.setCurrent([-this.__oEleBtn__.offsetWidth]);
    this.__oMLBtn__.setTarget([0])
};
QuirkyPopup.prototype.startMove = function () {
    var obj = this;
    if (this.__oMoveTimer__) {
        clearInterval(this.__oMoveTimer__)
    }
    this.__oMoveTimer__ = setInterval(function () {
        obj.__doMove__()
    },
    30)
};
QuirkyPopup.prototype.stopMove = function () {
    clearInterval(this.__oMoveTimer__);
    this.__oMoveTimer__ = null
};
QuirkyPopup.prototype.__doMove__ = function () {
    var oPos = this.__fnGetPos__();
    var r = document.body.offsetWidth - this.__oMaxSize__.x;
    var t = document.body.scrollTop || document.documentElement.scrollTop;
    var b = t + document.documentElement.clientHeight - this.__oMaxSize__.y;
    this.__oSpeed__.y += this.iAcc;
    oPos.x += this.__oSpeed__.x;
    oPos.y += this.__oSpeed__.y;
    if (Math.abs(this.__oSpeed__.x) < 1) {
        this.__oSpeed__.x = 0
    }
    if (Math.abs(this.__oSpeed__.y) < 1) {
        this.__oSpeed__.y = 0
    }
    if (oPos.x <= 0) {
        oPos.x = 0;
        this.__oSpeed__.x *= this.fScale
    } else if (oPos.x >= r) {
        oPos.x = r;
        this.__oSpeed__.x *= this.fScale
    }
    if (oPos.y <= t) {
        oPos.y = t;
        this.__oSpeed__.y *= this.fScale
    } else if (oPos.y >= b) {
        oPos.y = b;
        this.__oSpeed__.y *= this.fScale;
        this.__oSpeed__.x *= -this.fScale
    }
    if (Math.abs(this.__oSpeed__.x) > 0 || Math.abs(this.__oSpeed__.y) > 0) {
        this.__fnDoMove__(oPos.x, oPos.y)
    }
};
function ScrollToTop(iRight, iBottom, useFixed) {
    var obj = this;
    var top = document.body.scrollTop || document.documentElement.scrollTop;
    var obj = this;
    this.__useFixed__ = useFixed;
    this.__iBottom__ = iBottom;
    this.__iRight__ = iRight;
    this.__fnOnScroll__ = null;
    this.__iLastScrollTop__ = top;
    this.__em__ = new MoveLib([0], [100],
    function (arr) {
        var height = document.documentElement.clientHeight;
        if (document.body.scrollTop) {
            document.body.scrollTop = arr[0].cur
        } else {
            document.documentElement.scrollTop = arr[0].cur
        }
        if (!obj.__useFixed__) {
            obj.__oDiv__.style.top = arr[0].cur + height - obj.__iBottom__ + 'px'
        }
    },
    function () { },
    MoveLibType.BUFFER);
    if (useFixed) {
        this.__oDiv__ = document.createElement('div');
        this.__oDiv__.className = 'to_top';
        this.__oDiv__.style.position = 'fixed';
        this.__oDiv__.style.display = 'none';
        this.__oDiv__.onclick = function () {
            obj.toTop()
        };
        this.fixButtonFixed();
        this.__visibility__ = new Visibility(this.__oDiv__, VisibilityMode.MODE_OPACITY);
        document.body.appendChild(this.__oDiv__);
        this.__makeUpEventFixed__();
        if (top > 0) {
            this.__visibility__.show()
        }
    } else {
        this.__oDiv__ = document.createElement('div');
        this.__oDiv__.className = 'to_top_ie6';
        this.__oDiv__.style.position = 'absolute';
        this.__oDiv__.style.display = 'none';
        this.__oDiv__.onclick = function () {
            obj.toTop()
        };
        this.__visibility__ = new Visibility(this.__oDiv__, VisibilityMode.MODE_DIRECT);
        document.body.appendChild(this.__oDiv__);
        this.__makeUpEvent__();
        this.fixButton()
    }
}
ScrollToTop.prototype.toTop = function () {
    var obj = this;
    var top = document.body.scrollTop || document.documentElement.scrollTop;
    this.__em__.setCurrent([top]);
    this.__em__.setTarget([0])
};
ScrollToTop.prototype.cancelToTop = function () {
    this.__em__.stop()
};
ScrollToTop.prototype.show = function () {
    this.__visibility__.show()
};
ScrollToTop.prototype.hide = function () {
    this.__visibility__.hide()
};
ScrollToTop.prototype.setOnScroll = function (fn) {
    this.__fnOnScroll__ = fn
};
ScrollToTop.prototype.fixButtonFixed = function () {
    var top = document.body.scrollTop || document.documentElement.scrollTop;
    this.__oDiv__.style.left = document.documentElement.clientWidth - this.__iRight__ + 'px';
    this.__oDiv__.style.top = document.documentElement.clientHeight - this.__iBottom__ + 'px';
    if (this.__fnOnScroll__) {
        if (this.__fnOnScroll__(top - this.__iLastScrollTop__)) {
            if (document.body.scrollTop) {
                document.body.scrollTop = this.__iLastScrollTop__
            } else {
                document.documentElement.scrollTop = this.__iLastScrollTop__
            }
        }
    }
    if (top > this.__iLastScrollTop__) {
        this.cancelToTop()
    }
    this.__iLastScrollTop__ = top
};
ScrollToTop.prototype.fixButton = function () {
    var top = document.body.scrollTop || document.documentElement.scrollTop;
    var t;
    var r;
    var width = document.documentElement.clientWidth;
    r = width - this.__iRight__;
    var height = document.documentElement.clientHeight;
    t = top + height - this.__iBottom__;
    this.__oDiv__.style.top = t + 'px';
    this.__oDiv__.style.left = r + 'px';
    if (top > 0) {
        this.show()
    } else {
        this.hide()
    }
    if (this.__fnOnScroll__) {
        if (this.__fnOnScroll__(top - this.__iLastScrollTop__)) {
            if (document.body.scrollTop) {
                document.body.scrollTop = this.__iLastScrollTop__
            } else {
                document.documentElement.scrollTop = this.__iLastScrollTop__
            }
        }
    }
    if (top > this.__iLastScrollTop__) {
        this.cancelToTop()
    }
    this.__iLastScrollTop__ = top
};
ScrollToTop.prototype.__makeUpEvent__ = function () {
    var obj = this;
    var i = 0;
    miaovAppendEventListener(window, "scroll",
    function () {
        obj.fixButton()
    });
    miaovAppendEventListener(window, "resize",
    function () {
        obj.fixButton()
    })
};
ScrollToTop.prototype.__makeUpEventFixed__ = function () {
    var obj = this;
    miaovAppendEventListener(window, "scroll",
    function () {
        var top = document.body.scrollTop || document.documentElement.scrollTop;
        if (top > 0) {
            obj.__visibility__.show()
        } else {
            obj.__visibility__.hide()
        }
        obj.fixButtonFixed()
    });
    miaovAppendEventListener(window, "resize",
    function () {
        obj.fixButtonFixed()
    })
};
function attachStudentPicEffect(aImgPath) {
    var aExpandDivs = [];
    var aShrinkDivs = [];
    var aDownBtn = [];
    var oUlStudentPicList = document.getElementById('student_pic_list');
    var oImg = null;
    var oLi = null;
    var oTextBlock = null;
    var aTimerOnMouseOut = [];
    var aEMStudentInfoClose = [];
    var aEMStudentInfoOpen = [];
    var oUlStudentPicList = document.getElementById('student_pic_list');
    var aLiStudentInfo = oUlStudentPicList.getElementsByTagName('li');
    var aImgStudentInfo = oUlStudentPicList.getElementsByTagName('img');
    var aImgStudentInfoOrgPos = [];
    var aDivStudentInfoForDrag = [];
    var oDivStudentInfo = document.getElementById('student_info');
    var aDragStudentImg = [];
    var oBtnRndPhoto = document.getElementById('rnd_photo_button');
    var iImgStudentZIndexBase = 2;
    var fnRandomPhotoPosition = null;
    var aEMLayout = [];
    var i;
    g_fnShowStudentName = function (index) {
        if (aExpandDivs[index].style.display == 'block') {
            aEMStudentInfoClose[index].setCurrent([aExpandDivs[index].offsetHeight - 15]);
            aEMStudentInfoClose[index].setTarget([0]);
            aEMStudentInfoOpen[index].stop()
        } else {
            aExpandDivs[index].style.display = 'block';
            aShrinkDivs[index].style.display = 'none';
            aEMStudentInfoOpen[index].setCurrent([0]);
            aEMStudentInfoOpen[index].setTarget([aExpandDivs[index].initHeight]);
            aEMStudentInfoClose[index].stop()
        }
    };
    aTimerOnMouseOut[i] = null;
    function findNearest(oLi) {
        var iNearestIndex = -1;
        var iMinDistance = Number.MAX_VALUE;
        var iDistance = 0;
        var h = 0;
        var v = 0;
        for (i = 0; i < aLiStudentInfo.length; i++) {
            if (oLi == aLiStudentInfo[i] || oLi.offsetLeft + oLi.offsetWidth < aLiStudentInfo[i].offsetLeft || oLi.offsetTop + oLi.offsetHeight < aLiStudentInfo[i].offsetTop || oLi.offsetTop > aLiStudentInfo[i].offsetTop + aLiStudentInfo[i].offsetHeight || oLi.offsetLeft > aLiStudentInfo[i].offsetLeft + aLiStudentInfo[i].offsetWidth) {
                continue
            }
            h = (oLi.offsetLeft + oLi.offsetWidth / 2) - (aLiStudentInfo[i].offsetLeft + aLiStudentInfo[i].offsetWidth / 2);
            v = (oLi.offsetTop + oLi.offsetHeight / 2) - (aLiStudentInfo[i].offsetTop + aLiStudentInfo[i].offsetHeight / 2);
            iDistance = Math.ceil(Math.sqrt(h * h + v * v));
            if (iDistance < iMinDistance) {
                iNearestIndex = i;
                iMinDistance = iDistance
            }
        }
        return iNearestIndex
    }
    for (i = 0; i < aImgPath.length; i++) {
        oLi = document.createElement('li');
        oImg = document.createElement('img');
        oImg.src = aImgPath[i].low_src;
        oImg.alt = aImgPath[i].alt;
        oLi.appendChild(oImg);
        aExpandDivs[i] = document.createElement('div');
        aExpandDivs[i].className = 'pic_info';
        aExpandDivs[i].style.display = 'none';
        aExpandDivs[i].style.overflow = 'hidden';
        aExpandDivs[i].style.zIndex = '3';
        oLi.appendChild(aExpandDivs[i]);
        aDownBtn[i] = document.createElement('div');
        aDownBtn[i].className = 'down_btn';
        aDownBtn[i].title = '收缩';
        aExpandDivs[i].appendChild(aDownBtn[i]);
        oTextBlock = document.createElement('p');
        oTextBlock.innerHTML = aImgPath[i].info;
        aExpandDivs[i].appendChild(oTextBlock);
        aShrinkDivs[i] = document.createElement('div');
        aShrinkDivs[i].className = 'up_btn';
        aShrinkDivs[i].title = '展开';
        aShrinkDivs[i].style.display = 'block';
        aShrinkDivs[i].style.zIndex = '3';
        oLi.appendChild(aShrinkDivs[i]);
        aExpandDivs[i].initHeight = 25;
        aExpandDivs[i].emImgIndex = i;
        aDownBtn[i].emImgIndex = i;
        aDownBtn[i].onmousedown = function (ev) {
            var oEvent = window.event || ev;
            if (oEvent.stopPropagation) {
                oEvent.stopPropagation()
            } else {
                oEvent.cancelBubble = true
            }
            aEMStudentInfoClose[this.emImgIndex].setCurrent([aExpandDivs[this.emImgIndex].offsetHeight - 15]);
            aEMStudentInfoClose[this.emImgIndex].setTarget([0]);
            aEMStudentInfoOpen[this.emImgIndex].stop();
            return false
        };
        aShrinkDivs[i].emImgIndex = i;
        aShrinkDivs[i].onmousedown = function (ev) {
            var oEvent = window.event || ev;
            if (oEvent.stopPropagation) {
                oEvent.stopPropagation()
            } else {
                oEvent.cancelBubble = true
            }
            aExpandDivs[this.emImgIndex].style.display = 'block';
            aShrinkDivs[this.emImgIndex].style.display = 'none';
            aEMStudentInfoOpen[this.emImgIndex].setCurrent([0]);
            aEMStudentInfoOpen[this.emImgIndex].setTarget([aExpandDivs[this.emImgIndex].initHeight]);
            aEMStudentInfoClose[this.emImgIndex].stop();
            return false
        };
        oUlStudentPicList.appendChild(oLi);
        aExpandDivs[i].emImgIndex = i;
        aEMLayout[i] = new MoveLib([aLiStudentInfo[i].offsetLeft, aLiStudentInfo[i].offsetTop], [40, 40],
        function (arr) {
            aLiStudentInfo[this.index].style.left = arr[0].cur + 'px';
            aLiStudentInfo[this.index].style.top = arr[1].cur + 'px'
        },
        function () {
            aEMStudentInfoOpen[this.index].pause = false;
            aEMStudentInfoClose[this.index].pause = false
        },
        MoveLibType.ELASTICITY);
        aEMLayout[i].index = i;
        aEMStudentInfoClose[i] = new MoveLib([0], [40],
        function (arr) {
            var index = this.emImgIndex;
            if (arr[0].cur < 0) {
                aExpandDivs[index].style.display = 'none';
                aShrinkDivs[index].style.display = 'block';
                return
            }
            aExpandDivs[index].style.height = arr[0].cur + 'px'
        },
        function (arr) {
            var index = this.emImgIndex;
            if (arr[0].target == 0) {
                aExpandDivs[index].style.display = 'none';
                aShrinkDivs[index].style.display = 'block'
            }
        },
        MoveLibType.COLLISION);
        aEMStudentInfoClose[i].emImgIndex = i;
        aEMStudentInfoOpen[i] = new MoveLib([0], [40],
        function (arr) {
            var index = this.emImgIndex;
            if (arr[0].cur < 0) {
                aExpandDivs[index].style.display = 'none';
                aShrinkDivs[index].style.display = 'block';
                return
            }
            aExpandDivs[index].style.height = arr[0].cur + 'px'
        },
        function (arr) {
            var index = this.emImgIndex;
            if (arr[0].target == 0) {
                aExpandDivs[index].style.display = 'none';
                aShrinkDivs[index].style.display = 'block'
            }
        },
        MoveLibType.BUFFER);
        aEMStudentInfoOpen[i].emImgIndex = i
    }
    for (i = 0; i < aLiStudentInfo.length; i++) {
        aExpandDivs[i].style.width = aImgStudentInfo[i].offsetWidth - 10 + 'px';
        aDownBtn[i].style.width = aImgStudentInfo[i].offsetWidth + 'px';
        aShrinkDivs[i].style.width = aImgStudentInfo[i].offsetWidth + 'px';
        aImgStudentInfo[i].style.position = 'relative';
        aImgStudentInfoOrgPos[i] = [];
        aImgStudentInfoOrgPos[i][0] = aLiStudentInfo[i].offsetLeft;
        aImgStudentInfoOrgPos[i][1] = aLiStudentInfo[i].offsetTop
    }
    for (i = 0; i < aLiStudentInfo.length; i++) {
        aLiStudentInfo[i].style.left = aImgStudentInfoOrgPos[i][0] + 'px';
        aLiStudentInfo[i].style.top = aImgStudentInfoOrgPos[i][1] + 'px';
        aLiStudentInfo[i].style.position = 'absolute'
    }
    fnRandomPhotoPosition = function () {
        var newIndex = [];
        var aNewImgPos = [];
        var index = 0;
        var i = 0;
        while (newIndex.length < aImgStudentInfoOrgPos.length) {
            index = Math.floor(Math.random() * aImgStudentInfoOrgPos.length);
            if (index > aImgStudentInfoOrgPos.length - 1 || newIndex.has(index)) {
                continue
            }
            newIndex.push(index)
        }
        for (i = 0; i < aImgStudentInfoOrgPos.length; i++) {
            aNewImgPos[i] = aImgStudentInfoOrgPos[newIndex[i]];
            aEMLayout[i].setCurrent([aLiStudentInfo[i].offsetLeft, aLiStudentInfo[i].offsetTop]);
            aEMLayout[i].setTarget(aNewImgPos[i])
        }
        aImgStudentInfoOrgPos = aNewImgPos
    };
    if (oBtnRndPhoto.attachEvent) {
        oBtnRndPhoto.attachEvent('onclick', fnRandomPhotoPosition)
    } else {
        oBtnRndPhoto.addEventListener('click', fnRandomPhotoPosition, true)
    }
    for (i = 0; i < aImgStudentInfo.length; i++) {
        aLiStudentInfo[i].style.zIndex = '1';
        aDivStudentInfoForDrag[i] = document.createElement('div');
        aDivStudentInfoForDrag[i].style.position = 'absolute';
        aDivStudentInfoForDrag[i].style.left = aImgStudentInfo[i].offsetLeft + 'px';
        aDivStudentInfoForDrag[i].style.top = aImgStudentInfo[i].offsetTop + 'px';
        aDivStudentInfoForDrag[i].style.width = aImgStudentInfo[i].offsetWidth + 'px';
        aDivStudentInfoForDrag[i].style.height = aImgStudentInfo[i].offsetHeight + 'px';
        aDivStudentInfoForDrag[i].style.zIndex = '2';
        aDivStudentInfoForDrag[i].style.filter = 'alpha(opacity=0)';
        aDivStudentInfoForDrag[i].style.opacity = '0';
        aDivStudentInfoForDrag[i].style.background = 'white';
        aDivStudentInfoForDrag[i].style.cursor = 'move';
        aDivStudentInfoForDrag[i].emImgIndex = i;
        aLiStudentInfo[i].appendChild(aDivStudentInfoForDrag[i]);
        aDragStudentImg[i] = new PerfectDrag(aDivStudentInfoForDrag[i],
        function () {
            return {
                x: aLiStudentInfo[this.emImgIndex].offsetLeft,
                y: aLiStudentInfo[this.emImgIndex].offsetTop
            }
        },
        function (x, y) {
            var iNearIndex = 0;
            aLiStudentInfo[this.emImgIndex].style.left = x + 'px';
            aLiStudentInfo[this.emImgIndex].style.top = y + 'px';
            iNearIndex = findNearest(aLiStudentInfo[this.emImgIndex]);
            for (i = 0; i < aLiStudentInfo.length; i++) {
                aLiStudentInfo[i].style.border = "1px solid #FFF";
                aImgStudentInfo[i].style.top = "0px";
                aImgStudentInfo[i].style.left = "0px"
            }
            if (-1 != iNearIndex) {
                aLiStudentInfo[iNearIndex].style.border = "1px dashed #666";
                aImgStudentInfo[iNearIndex].style.top = "-2px";
                aImgStudentInfo[iNearIndex].style.left = "2px"
            }
        },
        function () {
            aLiStudentInfo[this.emImgIndex].style.zIndex = iImgStudentZIndexBase++;
            aEMLayout[this.emImgIndex].pause = true
        },
        function (bChange) {
            if (!bChange) {
                return
            }
            var iNearIndex = findNearest(aLiStudentInfo[this.emImgIndex]);
            var vTmp = 0;
            for (i = 0; i < aLiStudentInfo.length; i++) {
                aLiStudentInfo[i].style.border = "1px solid #FFF";
                aImgStudentInfo[i].style.top = "0px";
                aImgStudentInfo[i].style.left = "0px"
            }
            if (-1 != iNearIndex) {
                aEMLayout[this.emImgIndex].setCurrent([aLiStudentInfo[this.emImgIndex].offsetLeft, aLiStudentInfo[this.emImgIndex].offsetTop]);
                aEMLayout[iNearIndex].setCurrent(aImgStudentInfoOrgPos[iNearIndex]);
                aEMLayout[this.emImgIndex].setTarget(aImgStudentInfoOrgPos[iNearIndex]);
                aEMLayout[iNearIndex].setTarget(aImgStudentInfoOrgPos[this.emImgIndex]);
                aLiStudentInfo[iNearIndex].style.zIndex = iImgStudentZIndexBase++;
                aLiStudentInfo[this.emImgIndex].style.zIndex = iImgStudentZIndexBase++;
                aEMStudentInfoClose[this.emImgIndex].pause = true;
                aEMStudentInfoClose[iNearIndex].pause = true;
                aEMStudentInfoOpen[this.emImgIndex].pause = true;
                aEMStudentInfoOpen[iNearIndex].pause = true;
                vTmp = aImgStudentInfoOrgPos[this.emImgIndex];
                aImgStudentInfoOrgPos[this.emImgIndex] = aImgStudentInfoOrgPos[iNearIndex];
                aImgStudentInfoOrgPos[iNearIndex] = vTmp
            } else {
                aEMLayout[this.emImgIndex].setCurrent([aLiStudentInfo[this.emImgIndex].offsetLeft, aLiStudentInfo[this.emImgIndex].offsetTop]);
                aEMLayout[this.emImgIndex].setTarget(aImgStudentInfoOrgPos[this.emImgIndex]);
                aEMStudentInfoClose[this.emImgIndex].pause = true;
                aEMStudentInfoOpen[this.emImgIndex].pause = true
            }
            aEMLayout[this.emImgIndex].pause = false
        });
        aDragStudentImg[i].emImgIndex = i
    }
}
function Visibility(oElement, mode) {
    this.oElement = oElement;
    switch (mode) {
        case VisibilityMode.MODE_OPACITY:
            this.show = this.__opacityShow__;
            this.hide = this.__opacityHide__;
            this.setOpacityArg(20, 45);
            this.__opacity__ = 0;
            this.__timer__ = null;
            break;
        case VisibilityMode.MODE_DIRECT:
            this.show = this.__directShow__;
            this.hide = this.__directHide__;
            break;
        case VisibilityMode.MODE_DIRECTSHOW_OPACITYHIDE:
            this.show = this.__opacityDirectShow__;
            this.hide = this.__opacityHide__;
            this.setOpacityArg(20, 45);
            this.__opacity__ = 0;
            this.__timer__ = null;
            break;
        default:
            alert('mode unknow')
    }
}
var VisibilityMode = {
    MODE_DIRECT: 1,
    MODE_OPACITY: 2,
    MODE_DIRECTSHOW_OPACITYHIDE: 3
};
Visibility.prototype.setOpacityArg = function (iStepLength, iInterval) {
    this.__iOpacityStepLength__ = iStepLength;
    this.__iOpacityInterval__ = iInterval
};
Visibility.prototype.__opacityShow__ = function () {
    var obj = this;
    if (this.__opacity__ == 100) {
        return
    }
    if (this.__timer__) {
        clearInterval(this.__timer__)
    }
    this.__timer__ = setInterval(function () {
        obj.__opacityShowInner__()
    },
    this.__iOpacityInterval__);
    this.__opacityShowInner__()
};
Visibility.prototype.__opacityHide__ = function () {
    var obj = this;
    if (this.__opacity__ == 0) {
        return
    }
    if (this.__timer__) {
        clearInterval(this.__timer__)
    }
    this.__timer__ = setInterval(function () {
        obj.__opacityHideInner__()
    },
    this.__iOpacityInterval__);
    this.__opacityHideInner__()
};
Visibility.prototype.__opacityShowInner__ = function () {
    if (this.__opacity__ == 0) {
        this.oElement.style.display = 'block'
    }
    this.__opacity__ += this.__iOpacityStepLength__;
    if (this.__opacity__ >= 100) {
        this.__opacity__ = 100;
        this.oElement.style.filter = null;
        this.oElement.style.opacity = null;
        clearInterval(this.__timer__);
        this.__timer__ = null
    } else {
        this.oElement.style.filter = 'alpha(opacity=' + this.__opacity__ + ')';
        this.oElement.style.opacity = this.__opacity__ / 100
    }
};
Visibility.prototype.__opacityHideInner__ = function () {
    this.__opacity__ -= this.__iOpacityStepLength__;
    if (this.__opacity__ <= 0) {
        this.__opacity__ = 0;
        clearInterval(this.__timer__);
        this.__timer__ = null;
        this.oElement.style.display = 'none';
        this.oElement.style.filter = null;
        this.oElement.style.opacity = null
    } else {
        this.oElement.style.filter = 'alpha(opacity=' + this.__opacity__ + ')';
        this.oElement.style.opacity = this.__opacity__ / 100
    }
};
Visibility.prototype.__opacityDirectShow__ = function () {
    clearInterval(this.__timer__);
    this.__timer__ = null;
    this.oElement.style.filter = '';
    this.oElement.style.opacity = '1';
    this.__opacity__ = 100;
    this.oElement.style.display = 'block'
};
Visibility.prototype.__directShow__ = function () {
    this.oElement.style.display = 'block'
};
Visibility.prototype.__directHide__ = function () {
    this.oElement.style.display = 'none'
};
function initCountDown(curTime, nextTime) {
    var bIE6 = (/msie 6/i.test(navigator.userAgent)) && !(/msie 7/i.test(navigator.userAgent)) && !(/msie 8/i.test(navigator.userAgent)); (function () {
        function now() {
            return parseInt(new Date().getTime() / 1000)
        }
        function toDouble(num) {
            return num >= 10 ? num + '' : '0' + num
        }
        var oCountDown = document.getElementById('count_down');
        nextTime = now() + (nextTime - curTime);
        var timer = setInterval(inner, 1000);
        function inner() {
            var iRemain = nextTime - now();
            if (iRemain <= 0) {
                iRemain = 0;
                clearInterval(timer)
            }
            var iDay = parseInt(iRemain / (24 * 3600));
            iRemain %= 24 * 3600;
            var sHour = toDouble(parseInt(iRemain / 3600));
            iRemain %= 3600;
            var sMin = toDouble(parseInt(iRemain / 60));
            var sSex = toDouble(iRemain % 60);
            oCountDown.innerHTML = iDay + '<span>天</span><br />' + sHour + ':' + sMin + ':' + sSex
        }
        inner()
    })();
    if (bIE6) {
        (function () {
            var oBtn = document.getElementById('count_down');
            var oDiv = document.getElementById('main_list');
            var oClose = getEle('.list_content>a', oDiv)[0];
            oBtn.onclick = function () {
                oBtn.style.display = 'none';
                oDiv.style.display = 'block'
            };
            oClose.onclick = function () {
                oBtn.style.display = 'block';
                oDiv.style.display = 'none'
            }
        })()
    } else {
        (function () {
            var oBtnCountDown = document.getElementById('count_down');
            var oDiv = document.getElementById('main_list');
            var oUl = getEle('.list_content>ul', oDiv)[0];
            var oH2 = getEle('.list_content>h2', oDiv)[0];
            var oMt = getEle('.mt', oDiv)[0];
            var oQu1 = new MotionQueue();
            var oQu2 = new MotionQueue();
            oDiv.style.filter = 'alpha(opacity:0)';
            oDiv.style.opacity = 0;
            oDiv.style.display = 'block';
            var iH2Width = oH2.offsetWidth;
            var iUlHeight = oUl.offsetHeight;
            var iMtWidth = oMt.offsetWidth;
            oDiv.style.display = 'none';
            oQu1.add(oBtnCountDown, {
                alpha: 0
            },
            0,
            function () {
                oBtnCountDown.style.filter = 'alpha(opacity:100)';
                oBtnCountDown.style.opacity = '1'
            });
            oQu1.add(oMt, {
                width: iMtWidth
            },
            MIAOV_MOVE_TYPE.FLEX,
            function () {
                oBtnCountDown.style.display = 'none';
                oDiv.style.filter = '';
                oDiv.style.opacity = '';
                oDiv.style.display = 'block';
                oH2.style.width = '26px';
                oUl.style.display = 'none';
                oUl.style.height = '0px';
                oMt.style.width = '50px'
            },
            function () {
                oH2.style.left = oMt.offsetWidth - 50 + 'px'
            });
            oQu1.add(oH2, {
                width: iH2Width
            },
            0, null,
            function () {
                oH2.style.left = oMt.offsetWidth - oH2.offsetWidth - 24 + 'px'
            });
            oQu1.add(oUl, {
                height: iUlHeight
            },
            MIAOV_MOVE_TYPE.FLEX,
            function () {
                oUl.style.display = 'block'
            });
            oBtnCountDown.onclick = function () {
                ppt.disableAutoPlay();
                oQu1.play(function () {
                    ppt.enableAutoPlay()
                })
            };
            oQu2.add(oUl, {
                height: 0
            });
            oQu2.add(oH2, {
                width: 26
            },
            0,
            function () {
                oUl.style.display = 'none'
            },
            function () {
                oH2.style.left = oMt.offsetWidth - oH2.offsetWidth - 24 + 'px'
            });
            oQu2.add(oMt, {
                width: 50
            },
            0, null,
            function () {
                oH2.style.left = oMt.offsetWidth - 50 + 'px'
            });
            oQu2.add(oBtnCountDown, {
                alpha: 100
            },
            0,
            function () {
                oBtnCountDown.style.display = 'block';
                oDiv.style.display = 'none'
            });
            var oBtnClose = getEle('.list_content>a', oDiv)[0];
            oBtnClose.onclick = function () {
                ppt.disableAutoPlay();
                oQu2.play(function () {
                    ppt.enableAutoPlay()
                })
            }
        })()
    } (function () {
        var oBtn = document.getElementById('count_down');
        var oDiv = document.getElementById('main_list');
        if (bIE6) {
            var oPosBtn = {
                x: oBtn.offsetLeft,
                y: oBtn.offsetTop
            };
            var oPosDiv = {
                x: oDiv.offsetLeft,
                y: oDiv.offsetTop
            };
            miaovAppendEventListener(window, 'scroll',
            function () {
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
                oBtn.style.top = scrollTop + oPosBtn.y + 'px';
                oBtn.style.left = scrollLeft + oPosBtn.x + 'px';
                oDiv.style.top = scrollTop + oPosDiv.y + 'px';
                oDiv.style.left = scrollLeft + oPosDiv.x + 'px'
            })
        } else {
            oBtn.style.position = 'fixed';
            oDiv.style.position = 'fixed'
        }
    })()
}