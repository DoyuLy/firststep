

function getChildElement(sExp, oParent) {  
    /// <summary>
    ///   获取某个元素下的指定id元素  eg:getChildElement('.class',objParent)
    /// </summary>
    /// <param name="sExp" type="string/object">
    ///   .class/#id/object 支持各种复合选择器
    /// </param>
    /// <param name="oParent" type="object/Array">
    ///  父级对象
    /// </param>
    /// <returns type="object" />
    var aResult = [];
    var i = 0;
    oParent || (oParent = document);
    if (oParent instanceof Array) {
        for (i = 0; i < oParent.length; i++) aResult = aResult.concat(getChildElement(sExp, oParent[i]))
    } else if (typeof sExp == 'object') {
        if (sExp instanceof Array) {
            return sExp
        } else {
            return [sExp]
        }
    } else {
        if (/,/.test(sExp)) {
            var arr = sExp.split(/,+/);
            for (i = 0; i < arr.length; i++) aResult = aResult.concat(getChildElement(arr[i], oParent))
        } else if (/[ >]/.test(sExp)) {
            var aParent = [];
            var aChild = [];
            var arr = sExp.split(/[ >]+/);
            aChild = [oParent];
            for (i = 0; i < arr.length; i++) {
                aParent = aChild;
                aChild = [];
                for (j = 0; j < aParent.length; j++) {
                    aChild = aChild.concat(getChildElement(arr[i], aParent[j]))
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
function bindEventToLi(aLi,oInfo) {
    /// <summary>
    ///   绑定事件到li数组集合 (自动弹出内容预览浮动框)
    /// </summary>
    /// <param name="aLi" type="Array">
    ///  Li_Array
    /// </param>
    /// <returns type="null" />
    for (var i = 0; i < aLi.length; i++) {
        aLi[i].onmouseover = function () {
            clearTimeout(this._t_out);
            this.style.background = '#fff';
            oInfo.style.display = 'block';
            document.onmousemove = function (ev) {  //移入
                var oEvent = ev || event;
                var oAdorn = getChildElement('.adorn,.adorn_r', oInfo)[0];//获取提示浮动框左右的"指向"小图标 (oInfo为包装 指向小图标的父级,位于调用方)
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
                var clientWidth = document.documentElement.clientWidth;
                var l = oEvent.clientX + scrollLeft;//真实距左
                var t = oEvent.clientY + scrollTop; //真实距右
                if (l + oInfo.offsetWidth >= scrollLeft + clientWidth) {
                    l = l - 10 - oInfo.offsetWidth;
                    oAdorn.className = 'adorn_r'//->
                } else {
                    l += 10;
                    oAdorn.className = 'adorn'// <-
                }
                oInfo.style.left = l + 'px';
                oInfo.style.top = t - 20 + 'px'
            };
            /*
            var oData = findDataFromLi(this);
            getChildElement('dl>dt', oInfo)[0].innerHTML = oData.title;
            getChildElement('dl>dd', oInfo)[0].innerHTML = '<strong>xx：</strong>' + oData.description;
            getChildElement('dl>dd', oInfo)[2].innerHTML = '<strong>xx：</strong>' + formatTime(parseInt(oData.length));
            
            var oFull = getChildElement('.star_parent>.full', oInfo)[0];
            var oRankCount = getChildElement('dl>.rank_count', oInfo)[0];
            oFull.style.width = oData.rank * oFull.parentNode.offsetWidth / 5 + 'px';
            oRankCount.innerHTML = oData.rank_count;
            getChildElement('#title_info>.bg')[0].style.height = getChildElement('#title_info>dl')[0].offsetHeight + 10 + 'px'
            */
        };
        aLi[i].onmouseout = function () {
            var _this = this;
            this._t_out = setTimeout(function () {
                _this.style.background = '#f3f3f3';
                oInfo.style.display = 'none';
                document.onmousemove = null;
                _this._t_out = null
            },
                10)
        };
        aLi[i].onclick = function () {  //open clip
            var oData = findDataFromLi(this);
            openVideo(oData.ID)
        }
    }
}

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