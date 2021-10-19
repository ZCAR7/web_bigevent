//注意每次调用
$.ajaxPrefilter(function (options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
})