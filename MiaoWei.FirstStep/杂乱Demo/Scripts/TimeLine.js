/// <reference path="jquery-1.9.1-vsdoc.js" />
(function () {
    var year = $(".foryear").toArray();
    var month = $("#selectorbox ul").toArray();
    var timeswitch = 1;
    //var check=0;  //判断用户是否选择了年份，如果选择了，值为1；
    var len = year.length;//返回多少年
    var yearnum = null;   //确定选择了哪一个年份，如果没选择则为null
    function timeact() {
        //    if(check==0){
        for (var i = 0; i < len; i++) {
            (function (elem) {
                year[elem].onclick = function () {
                    if (timeswitch == 1) {
                        change(elem);
                        timeswitch = 0;
                        showmonth(elem)
                        yearnum = elem;
                    }
                    else if (timeswitch == 0) {
                        dechange(elem);
                        timeswitch = 1;
                        deshowmonth(elem);
                        yearnum = null;
                    }
                }
            })(i)
        }
    }
    //    if(check==1){
    //       change(yearnum);
    //       timeswitch=0;
    //        showmonth(yearnum);
    //    }
    //}
    function init_time() {
        if ($("#keyword").val() == '_date') {
            var elem = $("#selectorbox ul").index($("#selectedyear").parent());
            change(elem);
            timeswitch = 0;
            showmonth_fast(elem);
            yearnum = elem;
        }
    }
    function change(elem) {
        for (i = 0; i < len; i++) {
            if (i != elem) {
                $(year[i]).hide();
            }
        }
    }
    function dechange(elem) {
        for (i = 0; i < len; i++) {
            if (i != elem) {
                $(year[i]).show();
            }
        }
    }
    function showmonth_fast(elem) {
        for (i = 0; i < len; i++) {
            if (i == elem) {
                $(month[i]).children("li").show();
            }
        }
    }
    function showmonth(elem) {
        for (i = 0; i < len; i++) {
            if (i == elem) {
                $(month[i]).children("li").show("slow");
            }
        }
    }
    function deshowmonth(elem) {
        for (i = 0; i < len; i++) {
            if (i == elem) {
                $(month[i]).children("li").hide("slow");
            }
        }
    }
    $("#album li").mouseenter(function () { $(this).children('a').children(".picture").css('box-shadow', '0px 0px 0px #777'); $(this).children("div").filter(":not(:animated)").animate({ height: '44px' }); }).mouseleave(function () {
        $(this).children("div").animate({ height: '0px' }, function () { $(this).prev('a').children(".picture").css('box-shadow', '0px 0px 7px #777'); });
    });
    /*$("#album li").mouseenter(function(){
          $(this).children("div").animate({height:'45px'});
      }).mouseleave(function(){
          $(this).children("div").animate({height:'0px'});
      });*/
    /*================================================评论框自适应==========================*/

    $.fn.extend({
        textareaAutoHeight: function (options) {
            this._options = {
                minHeight: 0,
                maxHeight: 1000
            }

            this.init = function () {
                for (var p in options) {
                    this._options[p] = options[p];
                }
                if (this._options.minHeight == 0) {
                    this._options.minHeight = parseFloat($(this).height());
                }
                for (var p in this._options) {
                    if ($(this).attr(p) == null) {
                        $(this).attr(p, this._options[p]);
                    }
                }
                $(this).keyup(this.resetHeight).change(this.resetHeight)
                .focus(this.resetHeight);
            }
            this.resetHeight = function () {
                var _minHeight = parseFloat($(this).attr("minHeight"));
                var _maxHeight = parseFloat($(this).attr("maxHeight"));

                if (!$.browser.msie) {
                    $(this).height(0);
                }
                var h = parseFloat(this.scrollHeight);
                h = h < _minHeight ? _minHeight :
                h > _maxHeight ? _maxHeight : h;
                $(this).height(h).scrollTop(h);
                if (h >= _maxHeight) {
                    $(this).css("overflow-y", "scroll");
                }
                else {
                    $(this).css("overflow-y", "hidden");
                }
            }
            this.init();
        }
    });
    //评论框的动作响应
    $("#comment").textareaAutoHeight({ minHeight: 30, maxHeight: 70 });
    var comment_box = document.getElementById("comment_box");
    if ((getCookie("comment") == "hide") || (getCookie("comment") == null)) {
        $('#comment_box').css('left', '-310px');
    } else {
        $('#comment_box').css('left', '0px');
    }
    $('#comment_btn').click(function () {
        if (comment_box.style.left != '-310px') {
            $('#comment_box').animate({ left: '-310px' });
            setCookie("comment", "hide");
        }
        else {
            $('#comment_box').animate({ left: '0px' });
            setCookie("comment", "show");
        }
    });
    $('#comment_function').click(function () {
        if (comment_box.style.left != '-310px') {
            $('#comment_box').animate({ left: '-310px' });
            setCookie("comment", "hide");
        }
        else {
            $('#comment_box').animate({ left: '0px' });
            setCookie("comment", "show");
        }
    });

    //大图片响应
    $('#huge_picture').css({
        "height": "100%",
        "width": "auto",
        "top": "0px"
    });
    $('#comment_page').toggle(function () {
        $('#huge_picture').css({
            "cursor": "move",
            "width": "100%",
            "height": "auto",
            "top": "0px"
        });
        $(this).removeClass("type2").addClass("type1").attr("title", "完整浏览");
    }, function () {
        $('#huge_picture').css({
            "cursor": "auto",
            "height": "100%",
            "width": "auto",
            "top": "0px"
        });
        $(this).removeClass("type1").addClass("type2").attr("title", "全屏浏览");
    }).attr("title", "全屏浏览");
    timeact();
    init_time();

    //信息框的内容
    if ($("#information_box").length > 0) {
        var ie = document.all;
        var nn6 = document.getElementById && !document.all;
        var isdrag = false;
        var holdmouse = false;
        var x, y;
        var high;
        var dobj = document.getElementById('information_box');
        var picture = document.getElementById('huge_picture');
        var window_height = document.body.clientHeight;
        var picture_height = picture.clientHeight;
        //var x_left=$("body input")[1].value;
        //var y_top=$("body input")[2].value;
        var x_left = (getCookie("x_left") == null) ? "800px" : getCookie("x_left");
        var y_top = (getCookie("y_top") == null) ? "110px" : getCookie("y_top");
        dobj.style.left = x_left;
        dobj.style.top = y_top;
        function movemouse(e) //鼠标移动图片
        {
            if (isdrag) {
                dobj.style.left = nn6 ? tx + e.clientX - x + 'px' : tx + event.clientX - x + 'px';
                dobj.style.top = nn6 ? ty + e.clientY - y + 'px' : ty + event.clientY - y + 'px';
                setCookie("x_left", dobj.style.left);
                setCookie("y_top", dobj.style.top);
                return false;
            }
        }
        function movepic(e) {
            var window_height = wallpic.clientHeight;
            var picture_height = picture.clientHeight;
            if (holdmouse && picture_height > window_height) {
                var t = picture_height - window_height;
                if ((ty + e.clientY - y <= 0 || ty + event.cilentY - y <= 0) && (ty + e.clientY - y >= -t || ty + event.cilentY - y >= -t)) {
                    picture.style.top = nn6 ? ty + e.clientY - y + 'px' : ty + event.clientY - y + 'px';
                    return false;
                }
                return false;
            }
            return false;
        }
        function selectmouse(e) {
            var fobj = nn6 ? e.target : event.srcElement;
            var topelement = nn6 ? "HTML" : "BODY";
            while (fobj.tagName != topelement && fobj.className != "dragme") {
                fobj = nn6 ? fobj.parentNode : fobj.parentElement;
            }
            if (fobj.className == "dragme") {
                isdrag = true;
                tx = parseInt(dobj.style.left + 0);
                ty = parseInt(dobj.style.top + 0);
                x = nn6 ? e.clientX : event.clientX;
                y = nn6 ? e.clientY : event.clientY;
                document.onmousemove = movemouse;
                return false;
            }
            var fobj = nn6 ? e.target : event.srcElement;
            while (fobj.tagName != topelement && fobj.id != "huge_picture") {
                fobj = nn6 ? fobj.parentNode : fobj.parentElement;
            }
            if (fobj.id == "huge_picture") {
                holdmouse = true;
                ty = parseInt(picture.style.top + 0);
                y = nn6 ? e.clientY : event.clientY;
                document.onmousemove = movepic;
                return false;
            }
        }

        document.onmousedown = selectmouse;
        //鼠标移动图片1
        document.onmouseup = function () { isdrag = false; holdmouse = false };
    }
    if ($(".edit_it") != null) {
        $(".edit_it").click(function () {
            //加载数据
            var picid = $(this).parent().attr("name");
            $("#modifyid").val(picid);
            $("#time").val($("#hidden" + picid + " .time").html());
            $("#username").val($("#hidden" + picid + " .username").html());
            $("#userid1").val($("#hidden" + picid + " .uid").html());
            $("#title").val($("#hidden" + picid + " .title").html());
            $("#desc").val($("#hidden" + picid + " .desc").html());
            $("#picClass").val($("#hidden" + picid + " .class").html());
            $("#overlay_left img").attr("src", "/pic/nav/" + picid + ".jpg");
            $("#delete").attr("href", "/manage/delete_pic?picid=" + picid);
            $("#overlay").css("display", "block");
        });
        $("#edit_cancel").click(function () {
            $("#overlay").css("display", "none");
        });
    }
    if ((getCookie("information") == null) || (getCookie("information") == "show")) {
        $('#information_box').css('display', 'block');
    } else {
        $('#information_box').css('display', 'none');
    }
    $('#information_top a').click(function () {
        $('#information_box').css("display", "none");
        setCookie("information", "hide");
    });
    $("#information_top").mousedown(function () {
        $("#information_top").css("cursor", "move");
    }).mouseup(function () {
        $("#information_top").css("cursor", "auto");
    });

    //==========================================以下为暑期补充的代码=============
    (function aboutuser() {
        $('#logined_box a').first().mouseenter(function () {
            $('#logined_box ul').first().css("display", "block");
            $('#logined_box ul').first().mouseleave(function () {
                $('#logined_box ul').first().css("display", "none");
            });
        });
        /*
        $('#msg_notice').mouseenter(function(){
            $('#msg_notice_box').css("display","block");
            $('#msg_notice_box').mouseleave(function(){
                $('#msg_notice_box').css("display","none");    
            });
        });
        */
        $('#recom').click(function () {
            $('#recom_window').css("display", "block");
        });
        $('#recom_cancel').click(function () {
            $('#recom_window').css("display", "none");
        });
        $('.question').click(function () {
            var i = $(this).index('.question');
            $('.answer').css("display", "none");
            $('.answer')[i].style.display = "block";
        });
        $('.licon').hover(function () {
            $(this).animate({ marginLeft: '0px' }, 'fast');
        }).mouseleave(function () {
            $(this).animate({ marginLeft: '50px' }, 'fast');
        });
    })()
    if ($('#ppt_img li').length > 0) {
        function ppt_show(num) {
            $('#ppt_title h2').eq(num).animate({ 'top': '0px' }, 'slow');
            $('.ppt_box').eq(num).show('slow');
            $('#ppt_link a').eq(num).animate({ 'top': '0px' }, 'slow');

            $('#ppt_square li').eq(num).css({ 'background': '#357086' });
        }
        function ppt_disappear(num) {
            $('#ppt_title h2').eq(num).animate({ 'top': '32px' });
            $('.ppt_box').eq(num).hide('slow');
            $('#ppt_link a').eq(num).animate({ 'top': '-25px' }, 'slow', function () {
                $(this).css({ 'top': '32px' });
            });

            $('#ppt_square li').eq(num).css({ 'background': 'white' });
        }
        function ppt_img() {
            $('#ppt_img').animate({ 'marginLeft': '-1060px' }, function () {
                $('#ppt_img li').first().insertAfter('#ppt_img li:eq(2)');
                $(this).css({ 'marginLeft': '-530px' });
            });
        }
        var ppt_num = 2;
        setInterval(function () {
            ppt(ppt_num);
            if (ppt_num == 2) {
                ppt_num = 0;
            }
            else {
                ppt_num++;
            }
        }, 5000);

        function ppt(elem) {
            ppt_disappear(elem);
            ppt_img();
            if (elem == 2) {
                elem = 0;
            }
            else {
                elem++;
            }
            ppt_show(elem);
        }
        ppt(1);

        $('#ppt_square li').click(function () {
            var get = $(this).index('#ppt_square li');
            ppt_disappear(ppt_num);
            var yu;
            if (get > ppt_num) {
                yu = get - ppt_num;
            }
            else if (ppt_num > get) {
                yu = 3 + get - ppt_num;
            }
            for (i = 0; i < yu; i++) {
                ppt_img();
            }
            ppt_show(get);
            ppt_num = get;
        });
    }//end of ppt_img

    /*    $('#mori_top').delay(2000).animate({
            'height': '50px'
        }).delay(2000).animate({
            'height': '100px'
        }).delay(2000).animate({
            'height': '0px'
        });*/

})()

$(function () {
    $("#infolink").click(function () {
        if ($("#information_box").css("display") == "block") {
            $("#information_box").css("display", "none");
            setCookie("information", "hide");
        } else {
            $("#information_box").css("display", "block");
            setCookie("information", "show");
        }
    })
})

