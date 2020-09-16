//获取应用实例
const app = getApp()

Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isHide: false,
        user_openid: '',
        user_code:'',
        user_data:''

    },

    onLoad: function() {
        var that = this;
        // 查看是否授权
        wx.getSetting({
            success: function(res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function(res) {
                            // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
                            // 根据自己的需求有其他操作再补充
                            // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
                            wx.login({
                                success: res => {
                                    // 获取到用户的 code 之后：res.code
                                    that.setData({
                                        user_code:res.code
                                    })
                                    console.log("用户的code:" + res.code);
                                    // 可以传给后台，再经过解析获取用户的 openid
                                    // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
                                    wx.request({
                                        // 自行补上自己的 APPID 和 SECRET
                                        url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx481b52df9767e9e2&secret=d2c5e6cef9c939c9ac4a22615a08db1e&js_code=' + res.code + '&grant_type=authorization_code',
                                        success: res => {
                                            // 获取到用户的 openid
                                            that.setData({
                                                user_openid:res.data.openid
                                            })
                                            console.log("用户的openid:" + res.data.openid);
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    // 用户没有授权
                    // 改变 isHide 的值，显示授权页面
                    that.setData({
                        isHide: true
                    });
                }
            }
        });
    },

    bindGetUserInfo: function(e) {
        if (e.detail.userInfo) {
            //用户按了允许授权按钮
            var that = this;
            e.detail.userInfo.code = this.data.user_code; 
            e.detail.userInfo.openId = this.data.user_openid;
           this.data.user_data  = e.detail.userInfo;
            // 获取到用户的信息了，打印到控制台上看下
            console.log("组合后用户信息：");
            console.log(this.data.user_data);
            //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
            that.setData({
                isHide: true
            });
            that.UserLogin();
            // 跳转
            wx.navigateTo({
                url: '/pages/index/index',
              })
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                showCancel: false,
                confirmText: '返回授权',
                success: function(res) {
                    // 用户没有授权成功，不需要改变 isHide 的值
                    if (res.confirm) {
                        console.log('用户点击了“返回授权”');
                    }
                }
            });
        }
    },
    UserLogin: function () {
        var temp_send_data = this.data.user_data;
        console.log("发送到后端的用户信息： ");
        console.log(temp_send_data);
        wx.request({
          url: 'http://119.45.181.212:8081/login',
          method: "POST",
          data: temp_send_data,
          success: (res) => {
            console.log(res)
          }
        })
      }
})
