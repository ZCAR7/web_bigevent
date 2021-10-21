$(function () {
    //调用getUserInfo函数获取用户的基本信息
    getUserInfo()

    var layer = layui.layer
    //点击按钮实现退出的功能
    $('#btnLogout').on('click', function () {
        //弹出提示框
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 1.清空本地存储的token
            localStorage.removeItem('token')
            // 2.重新跳转到login
            location.href = '/login.html'
            // 这是关闭询问框的代码
            layer.close(index)
        })
    })
})


//获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //请求头
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取信息失败！')
            }
            //调用renderAvatar函数来渲染用户的头像
            renderAvatar(res.data)
        }
        //无论成功还是失败，都会调用complete回调函数
        // complete: function (res) {
        // console.log('123');
        // console.log(res);
        //在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        // if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //     //1.强制清空 token  
        //     localStorage.removeItem('token')
        //     //2.强制跳转回login
        //     location.href = '/login.html'
        // }
        //
        // }
    })
}

//渲染用户的头像
function renderAvatar(user) {
    //1.获取用户的名称
    var name = user.nickname || user.username
    //2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp&nbsp' + name)
    // 3.按需渲染用户的头像
    if (user.user_pic !== null) {
        //3.1渲染图片图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        console.log(123456);
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}