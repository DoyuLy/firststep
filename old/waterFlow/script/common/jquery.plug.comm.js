/// <reference path="jquery-1.5.1.min.js" />

jQuery.fn.NewGuid = function () {
    function G() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    var guid = (G() + G() + "-" + G() + "-" + G() + "-" + G() + "-" + G() + G() + G()).toUpperCase();
    return guid;
};

jQuery.fn.isDate = function (value) {//形如 2008-07-22
    if (!value) return false;
    var r = value.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/); //形如 2008-07-22
    if (r == null) return false;
    var d = new Date(r[1], r[3] - 1, r[4]);
    return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
};

jQuery.fn.compareDate = function (value1, value2) {
    if (!value1 || !value2) return false;
    var r1 = value1.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    var r2 = value2.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (r1 == null || r2 == null) return false;
    var d1 = new Date(r1[1], r1[3] - 1, r1[4]);
    var d2 = new Date(r2[1], r2[3] - 1, r2[4]);
    return (d1<=d2);
};

jQuery.fn.isDateTime = function (str) {//形如 (2008-07-22 13:04:06)
    if (!str) return false;
    var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
    var r = str.match(reg);
    if (r == null) return false;
    var d = new Date(r[1], r[3] - 1, r[4], r[5], r[6], r[7]);
    return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4] && d.getHours() == r[5] && d.getMinutes() == r[6] && d.getSeconds() == r[7]);
};

jQuery.fn.isIpAddress = function (ip) {
    if (ip == "")
        return false;
   var  ip_ip = '(25[0-5]|2[0-4]\\d|1\\d\\d|\\d\\d|\\d)';
   var ip_ipdot = ip_ip + '\\.';
   var isIPaddress = new RegExp('^' + ip_ipdot + ip_ipdot + ip_ipdot + ip_ip + '$');
    if (ip.match(isIPaddress) == null) {
        return false;
    }
    return true;
};

//获取hash值
jQuery.fn.getHashValue = function(name) {
    var nameRegExp = new RegExp("(?:\#|&|^)" + name + "=([^&]*)");
    var value = location.hash.match(nameRegExp);
    return value === null ? '' : decodeURI(value[1]);
};

jQuery.fn.cutString = function (str, len) { //截取
    if (typeof (str) != "string") { return null; };
    if (!(/^[0-9]*[1-9][0-9]*$/).test(len)) { return str; };
    if (len == 0) { return str; };
    var sum = 0, newStr = "";
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
            sum += 2;
        } else {
            sum++;
        };
        if (sum <= len - 2) {
            newStr += str.charAt(i);
        } else {
            if (i == str.length - 1) {
                newStr += str.charAt(i);
            } else {
                newStr += "...";
            };
            break;
        };
    };
    return newStr;
};

//获取url参数
jQuery.fn.QueryString = function (val) { //截取
    var uri = window.location.search;
    var re = new RegExp("" + val + "=([^&?]*)", "ig");
    return ((uri.match(re)) ? (uri.match(re)[0].substr(val.length + 1)) : "");
};

//获取素材RestValue值
jQuery.fn.GetRestValue = function (restValues, code) {
    var retValue = "";
    if (!restValues)
        return retValue;
    if ($.isArray(restValues.item)) {
        $(restValues.item).each(function() {
            if ($(this).attr("code").toLowerCase() == code.toLowerCase())
                retValue = $(this).attr("value");
        });
    }
    return retValue;
};

//获取素材RestValue值
jQuery.fn.GetValueByKey = function (keyAndValueVOs, code) {
    var retValue = "";
    if (!keyAndValueVOs)
        return retValue;
    if ($.isArray(keyAndValueVOs)) {
        $(keyAndValueVOs).each(function () {
            if ($(this).attr("key").toLowerCase() == code.toLowerCase())
                retValue = $(this).attr("value");
        });
    }
    return retValue;
};

//获取输入关键字，根据规则解析成数组  如果存在被双引号包裹的视为一个关键字，其他的按空格划分成不同关键字
jQuery.fn.GetKeywordsArray = function (inputKeywords) {
    var retArray = new Array();
    inputKeywords = $.trim(inputKeywords);
    retArray = inputKeywords.split(" ");
    //    var tempIndex = inputKeywords.indexOf("'");
    //    if (tempIndex==-1) {
    //        tempIndex = inputKeywords.indexOf("\"");
    //    }
    return retArray;
};

jQuery.fn.TransferSize = function (size) {
    if (isNaN(size) || size < 0) return "0 bytes";
    var val = parseFloat(1.0 * size / 1024);
    if (val > 1024) {
        val = parseFloat(1.0 * val / 1024);
        if (val > 1024) {
            val = parseFloat(1.0 * val / 1024);
            return Math.round(val * Math.pow(10, 2)) / Math.pow(10, 2) + " GB";
        }
        return Math.round(val * Math.pow(10, 2)) / Math.pow(10, 2) + " MB";
    }
    return Math.round(val * Math.pow(10, 2)) / Math.pow(10, 2) + " KB";
};

//检查浏览器是否支持html5本地存储
jQuery.fn.checkSupport = function(){
	if(typeof localStorage != "undefined") {
		return true;
	}else if(typeof sessionStorage != "undefined"){
		return true;
	}else{
		return false;
	}
};
//sessionStorage
//存值
jQuery.fn.sessionSaveOrUpdate = function(key,value){
	var hasValue = sessionStorage.getItem(key);
	if(hasValue == null || typeof hasValue == "undefined"){
		sessionStorage.setItem(key,value);
	}else{
		sessionStorage.removeItem(key);
		sessionStorage.setItem(key,value);
	}
};
//取值
jQuery.fn.sessionGetValue = function(key){
	var result = sessionStorage.getItem(key);
	if(result == null || typeof result == "undefined"){
		return "";
	}else{
		return result;
	}
};
//删除 
jQuery.fn.sessionRemove = function(key){
	var result = sessionStorage.getItem(key);
	if(result == null || typeof result == "undefined"){
		return;
	}else{
		sessionStorage.removeItem(key);
	}
};
//lovalStorage
//存值或更新
jQuery.fn.localSaveOrUpdate = function(key,value){
	var hasValue = localStorage.getItem(key);
	if(hasValue == null || typeof hasValue == "undefined"){
		localStorage.setItem(key,value);
	}else{
		localStorage.removeItem(key);
		localStorage.setItem(key,value);
	}
};
//取值
jQuery.fn.localGetValue = function(key,value){
	var result = localStorage.getItem(key);
	if(result == null || typeof result == "undefined"){
		return "";
	}else{
		return result;
	}
};

//删除
jQuery.fn.localRemove = function(key){
	var result = localStorage.getItem(key);
	if(result == null || typeof result == "undefined"){
		return;
	}else{
		localStorage.removeItem(key);
	}
};
//清除本地存储
jQuery.fn.localClose = function() {
    localStorage.clear();
};

//经度转换
jQuery.fn.TransformLongitude = function (longitude) {
    var longitudeSuffix = longitude > 0 ? "E" : "W";
    longitude = Math.abs(longitude);
    //度
    var degreex = Math.floor(longitude);
    //分
    var pointsx = Math.floor((longitude - degreex) * 60);
    //秒
    var secondsx = Math.round(((longitude - degreex) * 60 - pointsx) * 60, 2);
    return degreex + '°' + pointsx + "'" + secondsx + '\"' + longitudeSuffix;
};

//纬度换算
jQuery.fn.TransformLatitude = function (latitude) {
    var latitudeSuffix = latitude > 0 ? "N" : "S";
    latitude = Math.abs(latitude);
    //度
    var degreey = Math.floor(latitude);
    //分
    var pointsy = Math.floor((latitude - degreey) * 60);
    //秒
    var secondsy = Math.round(((latitude - degreey) * 60 - pointsy) * 60, 2);
    return degreey + '°' + pointsy + "'" + pointsy + '\"' + latitudeSuffix;

};

//设置框架文件路径
$.fn.setFrameSrc = function (frameId, src) {
    frameId = $.fn.getJqueryId(frameId);
    $(frameId).attr("src", src);
    $(window.parent.document).find(frameId).load(function () {
        var frame = $(window.parent.document).find(frameId);
        var thisheight = $(document).height() + 20;
        frame.height(thisheight);
    });
};

//在嵌入页面中设置框架的高度
$.fn.setParentFrameHeight = function (frameId) {
    frameId = $.fn.getJqueryId(frameId);
    var frame = $(window.parent.document).find(frameId);
    var thisheight = $(document).height() + 20;
    frame.height(thisheight);
};

$.fn.invokeParentPageFn = function(fnName, objParms) {
    if ($.isFunction(window.parent.window[fnName])) {
        eval(window.parent.window[fnName](objParms));
    }
};

$.fn.getJqueryId = function (objId) {
    var elementId = objId;
    if (elementId.indexOf("#") == -1)
        elementId = "#" + elementId;
    return elementId;
};

jQuery.fn.breakNtoBr = function (str) {
    if (!str) return str;
    str = str.replace(/\\\\n/g, "⊕₰▆₮～");
    str = str.replace(/\n/g, "<br/>");
    str = str.replace(/\⊕₰▆₮～/g, "\n");
    return str;
};


$.fn.ToChinese = function (str) {
    var cn = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    var result = "";
    for (var i = 0; i < str.length; i++) {
        var n = str.charCodeAt(i) - 48;
        result = result + cn[Number(n)];
    }
    return result;
};

String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d{1})}/g, function () {
        return args[arguments[1]];
    });
};