/// <reference path="common/jquery-2.0.0.js" />
/// <reference path="jquery.wookmark.js" />
/// <reference path="common/jquery.tmpl.min.js" />
/// <reference path="common/json2.js" />

$(function () { MainView.Init(); });
var MainView = {
    href: "http://assets.wookmark.com/lukas.png",
    handler: null,
    page: 1,
    isLoading: false,
    apiURL:'http://www.wookmark.com/api/json/popular',
    options:null,

    Init: function () {
        MainView.options = { autoResize: true, container: $('#tiles'), offset: 2, itemWidth: 210 };
        var app = [
            { liClass: "logo", data_id: "popular", href: "#1", imgSrc: MainView.href, name: "Wookmark" },
            { liClass: "popular active", data_id: "popular", href: "#2", imgSrc: MainView.href, name: "popular" },
            { liClass: "recent", data_id: "", href: "#3", imgSrc: MainView.href, name: "New" },
            { liClass: "categories", data_id: "", href: "#4", imgSrc: MainView.href, name: "categories" },
            { liClass: "search", data_id: "", href: "#5", imgSrc: MainView.href, name: "search" },
            { liClass: "login", data_id: "", href: "#6", imgSrc: MainView.href, name: "Log in" },
            { liClass: "arrow", data_id: "popular", href: "#7", imgSrc: MainView.href, name: "More" },
            { liClass: "surprise hidden", data_id: "surprise", href: "#8", imgSrc: MainView.href, name: "surprise" },
            { liClass: "videos hidden", data_id: "videos", href: "#9", imgSrc: MainView.href, name: "videos" },
            { liClass: "colors hidden", data_id: "colors", href: "#10", imgSrc: MainView.href, name: "colors" },
            { liClass: "help hidden", data_id: "help", href: "#11", imgSrc: MainView.href, name: "help" }
        ]
        MainView.ApendAppBar(app);
        MainView.BindPageEvent();
    },

    ApendAppBar: function (app) {
        $("#appBarTemplate").tmpl(app).appendTo("#ol_left_bar");
    },

    BindPageEvent: function () {
        MainView.LoadData();
        $(document).bind('scroll', MainView.onScroll);
        $(".search-box").hover(function () { $(this).css('border', '1px solid orange'); }, function () { $(this).css('border', 'none'); });

        $('#tiles li').hover(function () { $(this).find('.options').removeClass('none'); }, function () { $(this).find('.options').addClass('none'); })
        //$('#tiles li').mouseover(function () { $(this).find('.options').removeClass('none'); }).mouseout(function () { $(this).find('.options').addClass('none'); })
        
    },

    onScroll: function (e) {
        var e = e || event;
        if (!MainView.isLoading){
            var closeToBotton = ($(window).scrollTop() + $(window).height() > $(document).height() - 100);//($(window).scrollTop() + $(window).height()) > ($(window).height() - 100);
            if (closeToBotton)
                MainView.LoadData();
        }
    },

    LoadData: function () {
        MainView.isLoading = true;
        $('#loader').show();
        MainView.RequestHelper();
    },

    onLoadData: function (data) {
        MainView.isLoading = false;
        $('#loader').hide();
         
        MainView.page++;
        var html = '';
        var i = 0, length = data.length, image;
        for (; i < length; i++) {
            image = data[i];
            html += '<li>';

            // Image tag (preview in Wookmark are 200px wide, so we calculate the height based on that).
            html += '<div class="options ">';
            html += '   <div class="save" title="Save image"><a href="#"><em></em><span>Save</span></a></div>';
            html += '   <div class="like" title="Like image"><a href="#"><em></em><span>Like</span></a></div>';
            html += '</div>';
            html += '<a href="#" class="imageLink">';
            html += '<img src="' + image.preview + '" width="200" height="' + Math.round(image.height / image.width * 200) + '">';
            html += '</a>';
            html += '<p>' + image.title + '</p>';
            html += '</li>';
        }

        $('#tiles').append(html);
        MainView.ApplyLayout();
    },

    ApplyLayout: function () {
        if (MainView.handler)
            MainView.handler.wookmarkClear();
        MainView.handler = $('#tiles li');
        MainView.handler.wookmark(MainView.options);
    },

    RequestHelper: function () {
        $.ajax({
            url: MainView.apiURL,
            dataType: 'JSONP',
            data: { page: MainView.page },
            success: MainView.onLoadData
            
        });
    },
    CreateRequest: function () {

    }
}