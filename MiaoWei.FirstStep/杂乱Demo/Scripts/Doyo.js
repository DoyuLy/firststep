
//注意不要绑定匿名函数,aa=new Function('alert("a")'); 匿名函数调用一次就new一次
//绑定与解除会不是同一个函数
function myAddEvent(obj, sEv, fn) {  //jQuery为事件队列
    if (obj.attachEvent) {//IE,会将函数绑定至window  this=window
        obj.attachEvent('on' + sEv, function () {  //js默认事件规范为on开头
            fn.call(obj);//or fn.apply(obj);
        });
    }
    else {  //DOM
        obj.addEventListener(sEv, fn, false);//一般不需捕获
    }
}

//注意不要绑定匿名函数(jQuery unbind利用事件队列)
function myRemoveEvent(obj, sEv, fn) {
    if (obj.detachEvent) {
        obj.detachEvent('on' + sEv, function () {
            fn.call(obj);
        })
    }
    else {
        obj.removeEventListener(sEv, fn, false);
    }
} 

function getByClass(oParent, sClass) {
    var aEle = oParent.getElementsByTagName('*');
    var aResult = [];
    var i = 0;

    for (i = 0; i < aEle.length; i++) {
        if (aEle[i].className == sClass) {//正则过滤
            aResult.push(aEle[i]);
        }
    }

    return aResult;
}

function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    }
    else {
        return getComputedStyle(obj, false)[attr];//第二个参为任意
    }
}

function DoyoQuery(vArg) {
    this.elements = [];
    switch (typeof vArg) {
        case 'function':
            myAddEvent(window, 'load', vArg);
            break;
        case 'string':
            switch (vArg.charAt(0)) {
                case '#': //ID
                    var obj = document.getElementById(vArg.substring(1));
                    this.elements.push(obj);
                    break;
                case '.': //class
                    this.elements = getByClass(document, vArg.substring(1));
                    break;
                default: //tagName
                    this.elements = document.getElementsByTagName(vArg);
                    //break;
            }
            break;
        case 'object':
            this.elements.push(vArg);//对象直接push
        default:
            break;
    }
}

DoyoQuery.prototype.click = function (fn) {
    var i = 0;
    for (i = 0; i < this.elements.length; i++) {
        myAddEvent(this.elements[i], 'click', fn);
    }
    return this;
}

DoyoQuery.prototype.show = function () {
    var i = 0;
    for (i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'block';
    }
    return this;
}
DoyoQuery.prototype.hide = function () {
    var i = 0;
    for (i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'none';
    }
}

DoyoQuery.prototype.hover = function (fnOver, fnOut) {
    var i = 0;
    for (i = 0; i < this.elements.length; i++) {

        //四个地方不能用this：1.行间 2.套一层 3.定时器 4.绑定
        //此处是绑定将2个函数绑定至元素上的,不兼容IE
        myAddEvent(this.elements[i], 'mouseover', fnOver);
        myAddEvent(this.elements[i], 'mouseout', fnOut);
    }
    return this;
}

DoyoQuery.prototype.css = function (attr, value) { //可以设置为json
    if (arguments.length == 2) { //设置样式
        var i = 0;
        for (i = 0; i < this.elements.length; i++) {
            this.elements[i].style[attr] = value;
        }
    }
    else {   //获取样式
        //return this.elements[i].style[attr];//只能获取行间样式
        return getStyle(this.elements[0], attr); //获取第0个
    }
    return this;
}

DoyoQuery.prototype.toggle = function () {//存动态参数
    var i = 0;
    var _arguments = arguments;
    for (i = 0; i < this.elements.length; i++) {
        addToggle(this.elements[i]);
    }

    function addToggle(obj) {
        var count = 0; //每一个元素都有一个计数器变量
        myAddEvent(obj, 'click', function () {
            _arguments[count % _arguments.length].call(obj); //求模循环
            count++;
        });
    }
    return this;
}

DoyoQuery.prototype.attr = function (attr, value) {
    if (arguments.length == 2) {
        var i = 0;
        for (i = 0; i < this.elements.length; i++) {
            this.elements[i][attr] = value;
        }
    }
    else {
        return this.elements[0][attr];//返回第一个DOM的指定属性值
    }
    return this;
}

//扩展函数
DoyoQuery.prototype.extend = function (name, fn) {
    VQuery.prototype[name] = fn;
};

function $$(vArg) {  //意为:$
    return new DoyoQuery(vArg);
}
function DoQuery(vArg) { //意为:jQuery
    return new DoyoQuery(vArg);
}


//扩展
$$().extend('drag', function () {//空对象扩展
    var i = 0;

    for (i = 0; i < this.elements.length; i++) {
        drag(this.elements[i]);
    }

    function drag(oDiv) {
        oDiv.onmousedown = function (ev) {
            var oEvent = ev || event;
            var disX = oEvent.clientX - oDiv.offsetLeft;
            var disY = oEvent.clientY - oDiv.offsetTop;

            document.onmousemove = function (ev) {
                var oEvent = ev || event;

                oDiv.style.left = oEvent.clientX - disX + 'px';
                oDiv.style.top = oEvent.clientY - disY + 'px';
            };

            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
    }
});

$$().extend('animate', function (json) {
    var i = 0;

    for (i = 0; i < this.elements.length; i++) {
        startMove(this.elements[i], json);
    }

    function getStyle(obj, attr) {
        if (obj.currentStyle) {
            return obj.currentStyle[attr];
        }
        else {
            return getComputedStyle(obj, false)[attr];
        }
    }

    function startMove(obj, json, fn) {
        clearInterval(obj.timer);
        obj.timer = setInterval(function () {
            var bStop = true; 	//这一次运动就结束了——所有的值都到达了
            for (var attr in json) {
                //1.取当前的值
                var iCur = 0;

                if (attr == 'opacity') {
                    iCur = parseInt(parseFloat(getStyle(obj, attr)) * 100);
                }
                else {
                    iCur = parseInt(getStyle(obj, attr));
                }

                //2.算速度
                var iSpeed = (json[attr] - iCur) / 8;
                iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

                //3.检测停止
                if (iCur != json[attr]) {
                    bStop = false;
                }

                if (attr == 'opacity') {
                    obj.style.filter = 'alpha(opacity:' + (iCur + iSpeed) + ')';
                    obj.style.opacity = (iCur + iSpeed) / 100;
                }
                else {
                    obj.style[attr] = iCur + iSpeed + 'px';
                }
            }

            if (bStop) {
                clearInterval(obj.timer);

                if (fn) {
                    fn.call(obj);
                }
            }
        }, 30)
    }
});