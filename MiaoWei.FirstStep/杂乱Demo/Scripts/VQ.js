function myAddEvent(obj, sEv, fn)
{
	if(obj.attachEvent)
	{
		obj.attachEvent('on'+sEv, function (){
			if(false==fn.call(obj))
			{
				event.cancelBubble=true;
				return false;
			}
		});
	}
	else
	{
		obj.addEventListener(sEv, function (ev){
			if(false==fn.call(obj))
			{
				ev.cancelBubble=true;
				ev.preventDefault();
			}
		}, false);
	}
}

function getByClass(oParent, sClass)
{
	var aEle=oParent.getElementsByTagName('*');
	var aResult=[];
	var i=0;
	
	for(i=0;i<aEle.length;i++)
	{
		if(aEle[i].className==sClass)
		{
			aResult.push(aEle[i]);
		}
	}
	
	return aResult;
}

function getStyle(obj, attr)
{
	if(obj.currentStyle)
	{
		return obj.currentStyle[attr];
	}
	else
	{
		return getComputedStyle(obj, false)[attr];
	}
}

//获取ID
var $ = function (id) { return typeof id === "string" ? document.getElementById(id) : id };

//获取tagName
var $$ = function (tagName, oParent) { return (oParent || document).getElementsByTagName(tagName) };

//获取class
var $$$ = function (sClass, oParent) {
    var aClass = [],
	i = 0,
	reClass = new RegExp("(\\s|^)" + sClass + "($|\\s)"),
	aElement = $$("*", oParent);
    for (i = 0; i < aElement.length; i++) reClass.test(aElement[i].className) && aClass.push(aElement[i]);
    return aClass
};

//获取元素位置
function getPos(obj) {
    var iTop = obj.offsetTop;
    var iLeft = obj.offsetLeft;
    while (obj.offsetParent) {
        iTop += obj.offsetParent.offsetTop;
        iLeft += obj.offsetParent.offsetLeft;
        obj = obj.offsetParent;
    }
    return { top: iTop, left: iLeft }
};

function VQuery(vArg)
{
	//用来保存选中的元素
	this.elements=[];
	
	switch(typeof vArg)
	{
		case 'function':
			//window.onload=vArg;
			myAddEvent(window, 'load', vArg);
			break;
		case 'string':
			switch(vArg.charAt(0))
			{
				case '#':	//ID
					var obj=document.getElementById(vArg.substring(1));
					
					this.elements.push(obj);
					break;
				case '.':	//class
					this.elements=getByClass(document, vArg.substring(1));
					break;
				default:	//tagName
					this.elements=document.getElementsByTagName(vArg);
			}
			break;
		case 'object':
			this.elements.push(vArg);
	}
}

VQuery.prototype.click=function (fn)
{
	var i=0;
	
	for(i=0;i<this.elements.length;i++)
	{
		myAddEvent(this.elements[i], 'click', fn);
	}
	
	return this;
};

VQuery.prototype.show=function ()
{
	var i=0;
	
	for(i=0;i<this.elements.length;i++)
	{
		this.elements[i].style.display='block';
	}
	
	return this;
};

VQuery.prototype.hide=function ()
{
	var i=0;
	
	for(i=0;i<this.elements.length;i++)
	{
		this.elements[i].style.display='none';
	}
	
	return this;
};

VQuery.prototype.hover=function (fnOver, fnOut)
{
	var i=0;
	
	for(i=0;i<this.elements.length;i++)
	{
		myAddEvent(this.elements[i], 'mouseover', fnOver);
		myAddEvent(this.elements[i], 'mouseout', fnOut);
	}
	
	return this;
};

VQuery.prototype.css=function (attr, value)
{
	if(arguments.length==2)	//设置样式
	{
		var i=0;
		
		for(i=0;i<this.elements.length;i++)
		{
			this.elements[i].style[attr]=value;
		}
	}
	else	//获取样式
	{
		if(typeof attr=='string')
		{
		//return this.elements[0].style[attr];
			return getStyle(this.elements[0], attr);
		}
		else
		{
			for(i=0;i<this.elements.length;i++)
			{
				var k='';
				
				for(k in attr)
				{
					this.elements[i].style[k]=attr[k];
				}
			}
		}
	}
	
	return this;
};

VQuery.prototype.attr=function (attr, value)
{
	if(arguments.length==2)
	{
		var i=0;
		
		for(i=0;i<this.elements.length;i++)
		{
			this.elements[i][attr]=value;
		}
	}
	else
	{
		return this.elements[0][attr];
	}
	
	return this;
};

VQuery.prototype.toggle=function ()
{
	var i=0;
	var _arguments=arguments;
	
	for(i=0;i<this.elements.length;i++)
	{
		addToggle(this.elements[i]);
	}
	
	function addToggle(obj)
	{
		var count=0;
		myAddEvent(obj, 'click', function (){
			_arguments[count++%_arguments.length].call(obj);
		});
	}
	
	return this;
};

VQuery.prototype.eq=function (n)
{
	return $(this.elements[n]);
};

function appendArr(arr1, arr2)
{
	var i=0;
	
	for(i=0;i<arr2.length;i++)
	{
		arr1.push(arr2[i]);
	}
}

VQuery.prototype.find=function (str)
{
	var i=0;
	var aResult=[];
	
	for(i=0;i<this.elements.length;i++)
	{
		switch(str.charAt(0))
		{
			case '.':	//class
				var aEle=getByClass(this.elements[i], str.substring(1));
				
				aResult=aResult.concat(aEle);
				break;
			default:	//标签
				var aEle=this.elements[i].getElementsByTagName(str);
				
				//aResult=aResult.concat(aEle);
				appendArr(aResult, aEle);
		}
	}
	
	var newVquery=$();
	
	newVquery.elements=aResult;
	
	return newVquery;
};

function getIndex(obj)
{
	var aBrother=obj.parentNode.children;
	var i=0;
	
	for(i=0;i<aBrother.length;i++)
	{
		if(aBrother[i]==obj)
		{
			return i;
		}
	}
}

VQuery.prototype.index=function ()
{
	return getIndex(this.elements[0]);
};

VQuery.prototype.bind=function (sEv, fn)
{
	var i=0;
	
	for(i=0;i<this.elements.length;i++)
	{
		myAddEvent(this.elements[i], sEv, fn);
	}
};

VQuery.prototype.extend=function (name, fn)
{
	VQuery.prototype[name]=fn;
};

function VQ(vArg)
{
	return new VQuery(vArg);
}


VQ().extend('animate', function (json) {
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


VQ().extend('drag', function () {//空对象扩展
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

//-----------popho wall-------------
var PhotoWall = function () { this.initialize.apply(this, arguments) };

PhotoWall.prototype = {
    initialize: function (obj, aData) {
        var oThis = this;
        this.oParent = $(obj);
        this.oUl = $$("ul", this.oParent)[0];
        this.oBtn = $$("a", this.oParent)[0];
        this.zIndex = 1;
        this.aPos = [];
        this.aData = aData;
        this.dom = document.documentElement || document.body;
        this.create();
        this.oBtn.onclick = function () { oThis.randomOrder() }
    },
    create: function () {
        var aFrag = document.createDocumentFragment();
        var i = 0;
        for (i = 0; i < this.aData.length; i++) {
            var oLi = document.createElement("li");
            var oImg = document.createElement("img");
            oImg.src = this.aData[i];
            oLi.appendChild(oImg);
            aFrag.appendChild(oLi)
        }
        this.oUl.appendChild(aFrag);
        this.aLi = $$("li", this.oParent);
        this.changeLayout()
    },
    changeLayout: function () {
        var i = 0;
        this.oParent.style.height = this.oParent.offsetHeight - 2 + "px";
        this.aPos.length = 0;
        for (i = 0; i < this.aLi.length; i++) this.aLi[i].style.cssText = "";
        for (i = 0; i < this.aLi.length; i++) {
            this.aLi[i].index = i;
            this.aLi[i].style.top = getPos(this.aLi[i]).top + "px";
            this.aLi[i].style.left = getPos(this.aLi[i]).left + "px";
            this.aPos.push({ left: getPos(this.aLi[i]).left, top: getPos(this.aLi[i]).top })
        }
        for (i = 0; i < this.aLi.length; i++) {
            this.aLi[i].style.position = "absolute";
            this.aLi[i].style.margin = "0";
            this.drag(this.aLi[i])
        }
    },
    drag: function (obj, handle) {
        var oThis = this;
        var handle = handle || obj;
        handle.style.cursor = "move";
        handle.onmousedown = function (event) {
            var event = event || window.event;
            var disX = event.clientX - this.offsetLeft;
            var disY = event.clientY - this.offsetTop;
            var oNear = null;
            handle.style.zIndex = oThis.zIndex++;

            document.onmousemove = function (event) {
                var event = event || window.event;
                var iL = event.clientX - disX;
                var iT = event.clientY - disY;
                var maxL = Math.max(oThis.dom.clientWidth, oThis.dom.scrollWidth) - handle.offsetWidth;
                var maxT = Math.max(oThis.dom.clientHeight, oThis.dom.scrollHeight) - handle.offsetHeight;

                iL < 0 && (iL = 0);
                iT < 0 && (iT = 0);
                iL > maxL && (iL = maxL);
                iT > maxT && (iT = maxT);

                handle.style.left = iL + "px";
                handle.style.top = iT + "px";

                oNear = oThis.findNearest(obj);

                for (var i = 0; i < oThis.aLi.length; i++) oThis.aLi[i].className = "";

                oNear && (oNear.className = "hig");

                return false
            };
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;

                if (oNear) {
                    handle.index = [handle.index, oNear.index];
                    oNear.index = handle.index[0];
                    handle.index = handle.index[1];
                    oNear.style.zIndex = oThis.zIndex++;
                    oThis.doMove(handle, oThis.aPos[handle.index]);
                    oThis.doMove(oNear, oThis.aPos[oNear.index]);
                    oNear.className = "";
                }
                else {
                    oThis.doMove(handle, oThis.aPos[handle.index])
                }

                handle.releaseCapture && handle.releaseCapture()
            };
            this.setCapture && this.setCapture();
            return false
        };
    },
    doMove: function (obj, iTarget, callback) {
        var oThis = this;
        clearInterval(obj.timer);
        obj.timer = setInterval(function () {
            var iCurL = getPos(obj).left;
            var iCurT = getPos(obj).top;
            var iSpeedL = (iTarget.left - iCurL) / 5;
            var iSpeedT = (iTarget.top - iCurT) / 5;
            iSpeedL = iSpeedL > 0 ? Math.ceil(iSpeedL) : Math.floor(iSpeedL);
            iSpeedT = iSpeedT > 0 ? Math.ceil(iSpeedT) : Math.floor(iSpeedT);

            if (iCurL == iTarget.left && iCurT == iTarget.top) {
                clearInterval(obj.timer);
                callback && callback()
            }
            else {
                obj.style.left = iCurL + iSpeedL + "px";
                obj.style.top = iCurT + iSpeedT + "px"
            }
        }, 30)
    },
    findNearest: function (obj) {
        var aDistance = [];
        var i = 0;
        for (i = 0; i < this.aLi.length; i++) aDistance[i] = this.aLi[i] == obj ? Number.MAX_VALUE : this.getDistance(obj, this.aLi[i]);

        var minNum = Number.MAX_VALUE;
        var minIndex = -1;
        for (i = 0; i < aDistance.length; i++) aDistance[i] < minNum && (minNum = aDistance[i], minIndex = i);

        return this.isButt(obj, this.aLi[minIndex]) ? this.aLi[minIndex] : null
    },
    getDistance: function (obj1, obj2) {
        var a = (obj1.offsetLeft + obj1.offsetWidth / 2) - (obj2.offsetLeft + obj2.offsetWidth / 2);
        var b = (obj1.offsetTop + obj1.offsetTop / 2) - (obj2.offsetTop + obj2.offsetTop / 2);
        return Math.sqrt(a * a + b * b)
    },
    isButt: function (obj1, obj2) {
        var l1 = obj1.offsetLeft;
        var t1 = obj1.offsetTop;
        var r1 = l1 + obj1.offsetWidth;
        var b1 = t1 + obj1.offsetHeight;

        var l2 = obj2.offsetLeft;
        var t2 = obj2.offsetTop;
        var r2 = l2 + obj2.offsetWidth;
        var b2 = t2 + obj2.offsetHeight;

        return !(r1 < l2 || b1 < t2 || r2 < l1 || b2 < t1)
    },
    randomOrder: function () {
        this.aPos.sort(function () { return Math.random() > 0.5 ? 1 : -1 });
        for (var i = 0; i < this.aLi.length; i++) {
            this.aLi[i].index = i;
            this.doMove(this.aLi[i], this.aPos[i])
        }
    }
};
/*
window.onload = function ()
{
	var aBox = $$$("box");
	var aData = [];
	var aExample = [];
	var i = 0;
	for (i = 0; i < 20; i++) aData[aData.length] = "img/photo/" + i + ".jpg";
	for (i = 0; i < aBox.length; i++)
	{
		var oExample = new PhotoWall(aBox[i], aData);
		aExample.push(oExample)
	}
	this.onresize = function ()
	{
		for (var p in aExample) aExample[p].changeLayout()	
	};
	this.onresize()
};
*/
//--------------OOA Move------------------
var Animate = function (oElement, options, callback) { this.initialize.apply(this, arguments) };

Animate.prototype = {

    initialize: function (oElement, options, callback) {

        var oThis = this;

        this.options = options;

        this.callback = callback;

        this.oElement = typeof oElement === "string" ? document.getElementById(oElement) : oElement;

        clearInterval(this.timer);

        this.timer = setInterval(function () {

            oThis.doMove()

        }, 30)

    },

    css: function (attr, value) {

        if (arguments.length == 1) {

            return parseFloat(this.oElement.currentStyle ? this.oElement.currentStyle[attr] : getComputedStyle(this.oElement, null)[attr])

        }

        else if (arguments.length == 2) {

            attr == "opacity" ? (this.oElement.style.filter = "alpha(opacity=" + value + ")", this.oElement.style.opacity = value / 100) : this.oElement.style[attr] = value + "px"

        }

    },

    doMove: function () {

        var opt = this.options;

        var bComplete = true;

        for (var p in opt) {

            var iCur = p == "opacity" ? parseInt(this.css(p).toFixed(2) * 100) : this.css(p);

            var iSpeed = (opt[p] - iCur) / 5;

            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

            opt[p] == iCur || (bComplete = false, this.css(p, iCur + iSpeed))

        }

        bComplete && (clearInterval(this.timer), this.callback && this.callback.call(this))

    }

};

//-------------OOA Drag------------------
function Drag() {

    //初始化

    this.initialize.apply(this, arguments)

}

Drag.prototype = {

    //初始化

    initialize: function (drag, options) {

        this.drag = this.$(drag);

        this._x = this._y = 0;

        this._moveDrag = this.bind(this, this.moveDrag);

        this._stopDrag = this.bind(this, this.stopDrag);



        this.setOptions(options);



        this.handle = this.$(this.options.handle);

        this.maxContainer = this.$(this.options.maxContainer);



        this.maxTop = Math.max(this.maxContainer.clientHeight, this.maxContainer.scrollHeight) - this.drag.offsetHeight;

        this.maxLeft = Math.max(this.maxContainer.clientWidth, this.maxContainer.scrollWidth) - this.drag.offsetWidth;



        this.limit = this.options.limit;

        this.lockX = this.options.lockX;

        this.lockY = this.options.lockY;

        this.lock = this.options.lock;



        this.onStart = this.options.onStart;

        this.onMove = this.options.onMove;

        this.onStop = this.options.onStop;



        this.handle.style.cursor = "move";



        this.changeLayout();



        this.addHandler(this.handle, "mousedown", this.bind(this, this.startDrag))

    },

    changeLayout: function () {

        this.drag.style.top = this.drag.offsetTop + "px";

        this.drag.style.left = this.drag.offsetLeft + "px";

        this.drag.style.position = "absolute";

        this.drag.style.margin = "0"

    },

    startDrag: function (event) {

        var event = event || window.event;



        this._x = event.clientX - this.drag.offsetLeft;

        this._y = event.clientY - this.drag.offsetTop;



        this.addHandler(document, "mousemove", this._moveDrag);

        this.addHandler(document, "mouseup", this._stopDrag);



        event.preventDefault && event.preventDefault();

        this.handle.setCapture && this.handle.setCapture();



        this.onStart()

    },

    moveDrag: function (event) {

        var event = event || window.event;



        var iTop = event.clientY - this._y;

        var iLeft = event.clientX - this._x;



        if (this.lock) return;



        this.limit && (iTop < 0 && (iTop = 0), iLeft < 0 && (iLeft = 0), iTop > this.maxTop && (iTop = this.maxTop), iLeft > this.maxLeft && (iLeft = this.maxLeft));



        this.lockY || (this.drag.style.top = iTop + "px");

        this.lockX || (this.drag.style.left = iLeft + "px");



        event.preventDefault && event.preventDefault();



        this.onMove()

    },

    stopDrag: function () {

        this.removeHandler(document, "mousemove", this._moveDrag);

        this.removeHandler(document, "mouseup", this._stopDrag);



        this.handle.releaseCapture && this.handle.releaseCapture();



        this.onStop()

    },

    //参数设置

    setOptions: function (options) {

        this.options =

		{

		    handle: this.drag, //事件对象

		    limit: true, //锁定范围

		    lock: false, //锁定位置

		    lockX: false, //锁定水平位置

		    lockY: false, //锁定垂直位置

		    maxContainer: document.documentElement || document.body, //指定限制容器

		    onStart: function () { }, //开始时回调函数

		    onMove: function () { }, //拖拽时回调函数

		    onStop: function () { }  //停止时回调函数

		};

        for (var p in options) this.options[p] = options[p]

    },

    //获取id

    $: function (id) {

        return typeof id === "string" ? document.getElementById(id) : id

    },

    //添加绑定事件

    addHandler: function (oElement, sEventType, fnHandler) {

        return oElement.addEventListener ? oElement.addEventListener(sEventType, fnHandler, false) : oElement.attachEvent("on" + sEventType, fnHandler)

    },

    //删除绑定事件

    removeHandler: function (oElement, sEventType, fnHandler) {

        return oElement.removeEventListener ? oElement.removeEventListener(sEventType, fnHandler, false) : oElement.detachEvent("on" + sEventType, fnHandler)

    },

    //绑定事件到对象

    bind: function (object, fnHandler) {

        return function () {

            return fnHandler.apply(object, arguments)

        }

    }

};

//eg.
/*
window.onload = function () {

    var oBox = document.getElementById("box");

    var oTitle = oBox.getElementsByTagName("h2")[0];

    var oSpan = document.getElementsByTagName("span")[0];

    var oDrag = new Drag(oBox, { handle: oTitle, limit: false });
    var aInput = document.getElementsByTagName("input");

    //锁定范围接口
    aInput[0].onclick = function () {

        oDrag.limit = !oDrag.limit;

        this.value = oDrag.limit ? "取消锁定范围" : "锁定范围"

    };
    //水平锁定接口

    aInput[1].onclick = function () {
        oDrag.lockX = !oDrag.lockX;
        this.value = oDrag.lockX ? "取消水平锁定" : "水平锁定"
    };
    //垂直锁定接口

    aInput[2].onclick = function () {
        oDrag.lockY = !oDrag.lockY;
        this.value = oDrag.lockY ? "取消垂直锁定" : "垂直锁定"
    };
    //锁定位置接口
    aInput[3].onclick = function () {

        oDrag.lock = !oDrag.lock;

        this.value = oDrag.lock ? "取消锁定位置" : "锁定位置"
    };
    //开始拖拽时方法

    oDrag.onStart = function () {
        oSpan.innerHTML = "开始拖拽"
    };
    //开始拖拽时方法

    oDrag.onMove = function () {

        oSpan.innerHTML = "left:" + this.drag.offsetLeft + ", top:" + this.drag.offsetTop
    };
    //开始拖拽时方法
    oDrag.onStop = function () {
        oSpan.innerHTML = "结束拖拽"
    };

};*/
