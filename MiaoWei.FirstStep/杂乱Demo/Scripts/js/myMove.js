function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    }
    else {
        return getComputedStyle(obj, false)[attr];
    }
}

function setStyle(obj, json) {
    for (attr in json) {
        obj.style[attr] = json[attr];
    }
}

function startMove(obj, json, fn) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {

        var bStop = true; //假设都到达

        for (var attr in json) {

            //var iCur = parseInt(getStyle(obj, attr)); //用getStyle替换offsetWidth
            //1.当前位置
            var iCur = 0;
            //2.兼容opacity
            if (attr == 'opacity') {
                iCur = parseInt(parseFloat(getStyle(obj, attr)) * 100); //避免计算机浮点精确问题(干掉16位浮点小数)
            }
            else {
                iCur = parseInt(getStyle(obj, attr));
            }
            //3.计算速度
            var iSpeed = (json[attr] - iCur) / 8; //obj.offsetWidth
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

            //4.检测停止
            //运动结束时,清掉定时器
            if (iCur != json[attr]) {//iCur == json[attr]当一个属性运动停止,则整个停止
                //5.检测所有属性是否到达
                bStop = false;
            }

            if (attr == 'opacity') {
                obj.style.filter = 'alpha(opacity:' + (iCur + iSpeed) + ')';
                obj.style.opacity = (iCur + iSpeed) / 100;
            }
            else {
                obj.style[attr] = iCur + iSpeed + 'px'; //obj.offsetWidth
            }
        }

        if (bStop) {
            //6.都到达执行回调
            clearInterval(obj.timer); //obj.offsetWidth=iCur
            if (fn) {
                fn.call(obj);//转换this句柄到obj
            }
        }
    }, 30);
}