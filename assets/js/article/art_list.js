$(function () {

    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //定义一个补零函数
    function padZero(n) {
        return n > 0 ? n : '0' + n
    }

    //定义一个查询参数对象，将来请求数据的时候
    //需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示几条数据，默认是两条
        cate_id: '', //文章分类的ID
        state: '' // 文章的发布状态
    }
    initTable()
    initCate()

    //获取文章列表的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg('获取列表失败！')
                }
                //使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }



    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败！')
                }
                //调用模板引擎
                var htmlStr = template('tpl-cate', res)
                // console.log(htmlStr)
                $('[name=cate_id]').html(htmlStr)
                //通知layui重新渲染表单区的结构
                form.render()
            }
        })
    }

    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //为查询参数对象中q对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        //根据最新的筛选条件重新渲染表格
        initTable()
    })


    //定义渲染分页的方法
    function renderPage(total) {
        //调用laypage.render方法渲染分页的结构
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            limits: [2, 3, 5, 10, 15],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 分页发生切换的时候，触发jump回调
            jump: function (obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                //根据最新的Q更新列表
                // initTable()
                if (!first) {
                    initTable()
                }
            }
        })
    }

    //通过代理的方式，为删除按钮绑定点击处理函数
    $('tbody').on('click', '.btn-del', function () {

        var len = $('.btn-del').length
        var id = $(this).attr('data-id')
        //询问是否在删除
        layer.confirm('确认要删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    console.log(res)
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    if (len === 1) {
                        //如果len等于1，证明删完就没有数据了
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()

                }
            })
            layer.close(index)
        })
    })
})