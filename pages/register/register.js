// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    Idcard:"",
    phoneNumber:'',
    addr:'',
    openId:"",

    userdata:''

  },
  onLoad: function (e) {
    console.log("注册界面");
    console.log(e);
    this.setData({
      openId: e.openid
    })
  
  },

 //获取用户输入的用户名
 userNameInput:function(e)
 {
   this.setData({
     userName: e.detail.value
   })
 },
 IdcardInput:function(e)
 {
   this.setData({
     Idcard: e.detail.value
   })
 },
 PhoneNumberInput:function(e)
 {
   this.setData({
     phoneNumber: e.detail.value
   })
 },

 AddrInput:function(e)
 {
   this.setData({
     addr: e.detail.value
   })
 },

 //获取用户输入的密码
 loginBtnClick: function (e) {
   console.log("姓名："+this.data.userName+" 身份证号：" +this.data.Idcard+" 手机号："+this.data.phoneNumber+"\n地址："+this.data.addr);


   var temp_json = {"addr":this.data.addr,"userName":this.data.userName,"IDcard":this.data.Idcard,"phoneNumber":this.data.phoneNumber,"openId":this.data.openId}
   console.log("注册信息");
   console.log(tenp_json);

   wx.request({
    url: 'http://119.45.181.212:8081/register',
    method: "POST",
    data: temp_json,
    success: (res) => {
        console.log(res)
    }
})

 },
})