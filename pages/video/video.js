Page({
  data: {
    src: 'https://tx1.yunchuanglive.com/live/SSAA-147833-DFFEC.m3u8',
    status:''
  },

  /**
   * 当发生错误时触发error事件，event.detail = {errMsg: 'something wrong'}
   */

  videoErrorCallback: function (e) {
    console.log('视频错误信息:')
    this.data.status=e.detail.errMsg
    console.log(e.detail.errMsg)
   
var error_code = e.detail.errMsg.substring(e.detail.errMsg.indexOf('{'),e.detail.errMsg.length)
console.log(error_code)
var code_json = JSON.parse(error_code)
var code  =code_json.code
var text =code_json.text
       
    this.change_status(code,text);
  },
  change_status:function(  code="" ,text=""){
  this.setData({status:code+" : "+text})
}


})