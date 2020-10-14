const mqtt = require('../../utils/mqtt.min.js');
const clientId = "wx_test";
var url = 'wx://119.45.181.212:8083/mqtt';
var client = mqtt.connect(url, {
  clientId: clientId
});
Page({
  data: {
    topic_y2m: "chargingpile_lock_y2m",
    topic_s2y: "chargingpile_lock_s2y",
    open_id:"",
    client_id:""
  },
  onLoad: function () {
    this.get_openid();
    this.initSocket();
    this.getScancode();
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 关闭连接
    client.end();
  },
  getScancode:function() {
    wx.scanCode({
      success: (res) => {
        var result = res.result;
        var sta_obj = JSON.parse(result)
        this.data.client_id = sta_obj.client_id

        var temp_code={"client_id":this.data.client_id,"open_id":this.data.open_id,"code":"open"}
        var str = JSON.stringify(temp_code);
        console.log(str);
        client.publish(this.data.topic_y2m, str);
      }
    })
  },
  initSocket: function () {
    //小程序中只能用wxs://开头

    this.setData.cc = client;
    var topic_y2m = this.data.topic_y2m;
    var topic_s2y = this.data.topic_s2y;
    var that = this;

    client.on('connect', function () {
      console.log('连接成功');
      //订阅
      client.subscribe(topic_s2y);
      client.publish("chargingpile_lock_status", '小程序上线');
    })
    
    client.on('message', function (topic, payload) {
      console.log(topic.toString());
    console.log(payload.toString());
      var status = payload.toString();
      var sta_obj = JSON.parse(status)
      var result = sta_obj.status
      var temp_client_id=sta_obj.client_id
      var temp_open_id=sta_obj.open_id
      // 身份验证
       console.log(status)
      if (that.data.client_id.toString()==(temp_client_id) && that.data.open_id.toString()==(temp_open_id) )
      {
        if(result == 'opened') {
          that.opened_lock('开锁成功！', 'success')
        }
      }
     
      
    })
  },
  opened_lock:function(isOpened, status){
    wx.showToast({
      title: isOpened, // 标题
      icon: status,  // 图标类型，默认success
      duration: 2000  // 提示窗停留时间，默认1500ms
    })
  },
  send_open: function () {
    var topic = this.data.topic_y2m;
    var code = '{"client_id":"entrance_230603001","open_id":"test","code": "open"}'
    client.publish(topic,code);

  },
  send_close: function () {
    var topic = this.data.topic_y2m;
    var code = '{"client_id":"entrance_230603001","open_id":"test","code": "close"}'
    client.publish(topic,code);
  },
get_openid:function (){
  var that = this;
  // 查看是否授权
  wx.getSetting({
      success: function (res) {
          if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                  success: function (res) {
                      // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
                      // 根据自己的需求有其他操作再补充
                      // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
                      wx.login({
                          success: res => {
                              // 获取到用户的 code 之后：res.code
                              that.setData({
                                  user_code: res.code
                              })
                              console.log("用户的code:" + res.code);
                              // 可以传给后台，再经过解析获取用户的 openid
                              // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
                              wx.request({
                                  // 自行补上自己的 APPID 和 SECRET
                                  url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx7914fb57922f9fe0&secret=f3e581686ae7cc6bbe0f2b912896cf5a&js_code=' + res.code + '&grant_type=authorization_code',
                                  success: res => {
                                      // 获取到用户的 openid
                                      that.setData({
                                          open_id: res.data.openid
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
}



})