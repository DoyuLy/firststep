/*
  1.弹性运动：
            速度 += (目标点 - 当前值) / 系数
            速度 *= 摩擦系数
  2.缓冲运动
            速度 = (目标点 - 当前值) / 系数
            速度取整

*/

/*
    速度版问题：
    问题1.某个属性到达终点,其他属性可能没到达,造成视觉差 (无法解决)
    问题2.切换页面 / 放缩页面 会造成定时器放缓 或 暂停 造成bug (window.onfocus / window.onblur 解决切换页面bug, 但无法解决放缩页面问题)
*/
function startMove(obj, attrs, fn) {

    obj.iTimer && clearInterval(obj.iTimer);

    var iCur = 0;
    var iSpeed = 0;

    obj.iTimer = setInterval(function () {
        //是否所有属性到达目标点
        var isDown = true;
        //定时器每走一次,每个属性都要推进一次
        for (var attr in attrs) {

            var iTarget = attrs[attr];

            //获取当前样式值
            if (attr == 'opacity') {
                if (Math.round(parseFloat(getStyle(obj, attr)) * 100) == 0) {
                    iCur = Math.round(getStyle(obj, 'opacity') * 100); //精度问题
                } else {
                    iCur = Math.round(parseFloat(getStyle(obj, attr)) * 100) || 100;
                }
            } else {
                iCur = parseInt(getStyle(obj, attr)) || 0; //样式有单位
            }

            //缓冲运动（不同速度,不同效果*）
            iSpeed = (iTarget - iCur) / 20;//目标点-当前值
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);


            //处理样式赋值
            if (iCur != iTarget) {
                isDown = false;
                if (attr == 'opacity') {
                    obj.style.opacity = (iCur + iSpeed) / 100;
                    obj.style.filter = 'alpha(opacity=' + (iCur + iSpeed) + ')';
                } else {
                    obj.style[attr] = iCur + iSpeed + 'px';
                }
            }
        }
        //查看所有属性是否到达目标点
        if (isDown) {
            clearInterval(obj.iTimer);
            obj.iTimer = null;
            //运动完毕执行回调
            fn && fn.call(obj);
        }
    }, 10);
}

/*
    时间版运动(解决速度版问题)
    t : current time    (当前时间)
    b : beginning value (初始值)
    c : change in value (变化量)
    d : duration        (持续时间)
    return :            (目标点)
*/
function startMoveT(obj, attrs, times, fx, fn) {
    var iCur = {};
    var iSpeed = 0;
    //保存初始值
    for (var attr in attrs) {
        iCur[attr] = 0;
        if (attr == 'opacity') {
            iCur[attr] = Math.round(parseFloat(getStyle(obj, attr)) * 100);
        } else {
            iCur[attr] = parseInt(getStyle(obj, attr));
        }
    }

    var startTime = Now();

    obj.iTimer && clearInterval(obj.iTimer);
    obj.iTimer = setInterval(function () {

        var changeTime = Now();
        var durationTime = times - Math.max(0, startTime - changeTime + times);//0~times

        for (var attr in attrs) {
            var value = Tween[fx](durationTime, iCur[attr], attrs[attr] - iCur[attr], times);//t,b,c,d
            if (attr == 'opacity') {
                obj.style.opacity = value / 100;
                obj.style.filter = 'alpha(opacity=' + value + ')';
            } else {
                obj.style[attr] = value + 'px';
            }
        }

        if (durationTime == times) {
            clearInterval(obj.iTimer);
            obj.iTimer = null;

            fn && fn.call(obj);
        }
    }, 13);
};

var zIndex = 1;
function drag(obj) {
    obj.onmousedown = function (ev) {
        obj.style.zIndex = zIndex++;
        //要移动必须在鼠标按下之后,采用回调方式同步
        var ev = ev || event;
        //alert(this.id);
        //找到鼠标按下点 到div的相对位置
        var disX = ev.clientX - this.offsetLeft;
        var disY = ev.clientY - this.offsetTop;

        //setCapture 拦截其他元素的事件
        if (this.setCapture)
            this.setCapture();

        //若一旦拖动过快,会移出oDiv,改为document
        document.onmousemove = function (ev) {//以时间间隔计算
            var ev = ev || event;
            console.log(this);//document
            obj.style.cursor = 'pointer';

            //限制拖动范围
            var L = ev.clientX - disX;
            var T = ev.clientY - disY;
            
            //九宫格碰撞检测
            //此处封装需要考虑碰撞检测的其他物体

            /*
            //若要做磁性吸附,请更改L和Top的阀值 如 5
            if (L < 0) {//限制左边
                L = 0;
            } else if (L > document.documentElement.clientWidth - obj.offsetWidth) {//限制右边(可视宽-文档宽)
                L = document.documentElement.clientWidth - obj.offsetWidth;
            }

            if (T < 0) {//限制上边
                T = 0;
            } else if (T > document.documentElement.clientHeight - obj.offsetHeight) {//限制下边(可视高-文档高)
                T = document.documentElement.clientHeight - obj.offsetHeight;
            }
            */

            obj.style.left = L + 'px';
            obj.style.top = T + 'px';

        };

        //若有其他元素层级覆盖住,则不会释放掉oDiv的up事件,因此改为document
        document.onmouseup = function () {
            //每次down重新生成move事件,抬起清空
            document.onmousemove = document.onmouseup = null;

            //释放全局拦截
            if (obj.releaseCapture)
                obj.releaseCapture();
        };

        //阻止选中文字触发默认行为
        return false;
    };
}

//碰撞检测：注意此处方法是有定位父级的情况下
function ColDetection(obj1, obj2) {
    //九宫格碰撞检测
    var L1 = obj1.offsetLeft;
    var R1 = obj1.offsetLeft + obj1.offsetWidth;
    var T1 = obj1.offsetTop;
    var B1 = obj1.offsetTop + obj1.offsetHeight;

    var L2 = obj2.offsetLeft;
    var R2 = obj2.offsetLeft + obj2.offsetWidth;
    var T2 = obj2.offsetTop;
    var B2 = obj2.offsetTop + obj2.offsetHeight;

    if (R1 < L2 || R2 < L1 || B1 < T2 || B2 < T1) {
        return false;//没碰上
    } else {
        return true; //碰上了
    }
};

function Now() {
    return (new Date()).getTime();
};

function getStyle(obj, attr) {
    //ie下
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        //标准下
        return getComputedStyle(obj, false)[attr];
    }
};

//设置有滚动条时元素top值
function setTop(obj) {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    obj.style.top = scrollTop + document.documentElement.clientHeight - obj.offsetHeight + 'px';
};

function getTop(obj) {
    /*此方式会有bug,有可能有定位父级
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    return (scrollTop + document.documentElement.clientHeight - obj.offsetHeight);
    */
    var iTop = 0;
    while (obj) {
        iTop += obj.offsetTop;
        obj = obj.offsetParent;
    }
    return iTop;
};



//兼容封装(注意清掉body margin值)
function getPos(obj) {
    var pos = { left: 0, top: 0 };
    while (obj) {
        pos.left += obj.offsetLeft;
        pos.top += obj.offsetTop;
        obj = obj.offsetParent;
    }
    return pos;
};

//深度对象拷贝减缩版
function extend(obj1, obj2) {
    for (var attr in obj2) {
        obj1[attr] = obj2[attr];
    }
};

//判断两个元素是否嵌套
function e1Contains(a, b) {
    return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16);
};

function bindEvent(obj, events, fn) {
    //obj:        楼层
    //events：    书架
    //fn:         具体某本书
    obj.listeners = obj.listeners || {};
    obj.listeners[events] = obj.listeners[events] || [];

    obj.listeners[events].push(fn);

    if (obj.addEventListener) {
        obj.addEventListener(events, fn, false);
    } else {
        obj.attachEvent('on' + events, fn);
    }
};

//主动触发
function fireEvent(obj, events) {
    for (var i = 0; i < obj.listeners[events].length; i++) {
        obj.listeners[events][i]();
    }
};

var Tween = {
    linear: function (t, b, c, d) { //匀速
        return c * t / d + b;
    },
    easeIn: function (t, b, c, d) { //加速曲线
        return c * (t /= d) * t + b;
    },
    easeOut: function (t, b, c, d) { //减速曲线
        return -c * (t /= d) * (t - 2) + b;
    },
    easeBoth: function (t, b, c, d) { //加速减速曲线
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    easeInStrong: function (t, b, c, d) { //加加速曲线
        return c * (t /= d) * t * t * t + b;
    },
    easeOutStrong: function (t, b, c, d) { //减减速曲线
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeBothStrong: function (t, b, c, d) { //加加速减减速曲线
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    elasticIn: function (t, b, c, d, a, p) { //正弦衰减曲线（弹动渐入）
        if (t === 0) {
            return b;
        }
        if ((t /= d) == 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    elasticOut: function (t, b, c, d, a, p) { //正弦增强曲线（弹动渐出）
        if (t === 0) {
            return b;
        }
        if ((t /= d) == 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    elasticBoth: function (t, b, c, d, a, p) {
        if (t === 0) {
            return b;
        }
        if ((t /= d / 2) == 2) {
            return b + c;
        }
        if (!p) {
            p = d * (0.3 * 1.5);
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) {
            return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) *
                Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        return a * Math.pow(2, -10 * (t -= 1)) *
            Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    },
    backIn: function (t, b, c, d, s) { //回退加速（回退渐入）
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    backOut: function (t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 3.70158; //回缩的距离
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    backBoth: function (t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    bounceIn: function (t, b, c, d) { //弹球减振（弹球渐出）
        return c - Tween['bounceOut'](d - t, 0, c, d) + b;
    },
    bounceOut: function (t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
        }
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
    },
    bounceBoth: function (t, b, c, d) {
        if (t < d / 2) {
            return Tween['bounceIn'](t * 2, 0, c, d) * 0.5 + b;
        }
        return Tween['bounceOut'](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
};

/* 
 注意：以下均相对于文档
       若是Element则没有body兼容问题

 1.可视区尺寸
    document.documentElement.clientWidth
    document.documentElement.clientHeight
 2.滚动距离
    document.body.scrollTop/scrollLeft   (谷歌)
    document.documentElement.scrollTop/srollLeft
 3.内容高度
    document.body.scrollHeight
 4.文档高度
    document.documentElement.offsetHeight //IE下会认为是可视区的高
    document.body.offsetHeight //推荐

 5. onScroll \ onResize
*/


/*
一.
    1.DOM.childNodes:只读子节点集合(获取第一级子节点)
    附注：节点12种/常用3种
    标准下： 元素节点+文本节点,也会包含非法嵌套的子节点 （11个）
    非标准下：元素节点,IE7及以下不会包含非法子节点 （4个）
                       IE8也为非标准,但不会认非法标签,但不包含文本节点
    2.nodeType:1 元素类型 2 attribute类型 3 文本类型

    3.DOM.attributes 元素属性集合

    4.DOM.children :和childNodes类似,但不会包含文本节点(推荐)
                    非标准：IE7及以下,非法标签不会包含,会解析到子级的孙节点


二.
    1.firstChild;第一个字节点(都有此属性)
                标准： 会包含文本节点
                非标准：不包含文本节点
      推荐：firstElementChild:IE7及以下没有此属性(标准下的获取元素节点属性)
    
    2.lastElementChild||lastChild 同理上

    3.nextSibling  \ previousSibling    下\上一个兄弟节点

 三.
    1.parentNode :基本没有兼容问题

    2.offsetParent:离当前元素最近的一个定位父级
      ①如果没有定位父级,默认是body
      ②IE7及以下:若自身有定位,默认是到HTML
      ③IE下 Zoom独有属性 触发当前元素layout特性,处理浮动问题
         dom.currentStyle.hasLayout (bool返回)

 四.
    1.offsetTop\offsetLeft : 当前元素到定位父级的距离
      ①若无定位父级：
              offsetParent -> body(IE7及以下是html)
              offsetLeft   -> html
        若有定位父级：
              ie7级以下：自己没有定位 -->body
                         自己有定位   -->定位父级(正常)
        其他： -->到定位父级距离
      ②...
   
  五. width \ clientWidth \ offsetWidth
      ①width(样式宽)：是多少就是多少(px单位)
        eg: oDiv.style.width
      ②clientWidth(可视宽) ：width + padding (无单位)
        eg: oDiv.clientWidth
      ③offsetWidth(占位宽)：width + padding + border (无单位)
        eg: oDiv.offsetWidth
   
   
  六. document.creatElement(标签名)
      
      oUl.appendChild(oLi);
      //ie下若第二个参数不存在,会报错,其他浏览器则默认为appendChild
      oUl.insertBefore(oLi,oUl.chilren[0]);
      
      oUl.removeChild(this.parentNode)
      oUl.replaceChild(新节点,被替换的节点)
   
   
   总结：
    1.childNodes\children 获取第一级子节点（空白节点兼容问题,推荐使用children）
    2.
*/


/*
1.绑定事件处理函数
  ①方式1：
    oDiv.onclick=fn1;
    oDov.onclick=fn2;//由于是赋值形式绑定事件,因此会覆盖事件函数fn1
  ②方式2：
    ie：obj.attachEvent(事件名,事件函数) //注意事件名有前缀 on
    标准：obj.addEventListener(事件名,事件函数,是否捕获);//无前缀 on
          是否捕获：   false:冒泡\ true：捕获

   区别：attachEvent
             ①没有捕获
             ②事件名前缀 on
             ③事件执行顺序：标准ie -->正序  \ ie9及以下 --> 反序
             ④事件函数里面的this指向window;而标准下this指向触发事件的对象document
          addEventListener
             ①最后一个参数 false：冒泡(从里面出去) \ true：通道(从外面进来)
   
   2.事件取消
        ①document.onclick = null;
        ② ie : obj.detachEvent(事件名, 事件函数);
           标准：obj.removeEventListener(事件名, 事件函数, 是否捕获);//最后一个参数也代表事件取消是独立的
   3.键盘事件
       onkeydowm ：键盘按下(得到是之前的值)\注意：连续输入的第一个是有间隔时间的(用户体验)
       onkeyup： 键盘抬起
       event.keyCode：数字类型 键值ASCII
       ctrlKey,shiftKey,altKey 布尔值(功能键)


   解决：call \ apply
         ①call是函数下的内置方法
           第一个函数内部this的指向obj ,后面的参数是方法的参数列表（即改变执行中内部this的指向）
         ②apply和call性质一样;但第二个参数形式是数组,效率更高
*/