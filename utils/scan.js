const app = getApp();
   //扫码功能
function scanAction() {
  wx.scanCode({
    onlyFromCamera: true,
    scanType: ['qrCode', 'barCode', 'datamatrix', 'pdf417'],
       //结果处理
    success: res => {
      dealScanCode(res.result)
      console.log(res.result)
    },
    fail: (e) => {
        if (e && e.errMsg && e.errMsg.indexOf('scanCode:fail cancel') != -1) {
            return;
        }
        wx.showToast({ title: '扫码失败', icon: 'none', })
    }
  });
}


 // 判断连接
 function dealScanCode(result) {
   if (!result || !result.lastIndexOf()) {
       wx.showToast({ title: '二维码错误', icon: 'none', duration: 2000 })
      return;
    }

    // 具体的连接处理
      if (result.lastIndexOf('synthetical=') != -1) {
       bindAccount(result);
       return;
      }
  
 //无效的二维码
  wx.showToast({ title: '二维码错误', icon: 'none', duration: 2000 })
 }


   //处理连接
   function bindAccount(param){
    // 截取字符串
    let groupNum = getUrlParam(param, 'chatID')
   let groupType = getUrlParam(param, 'type');
   }

   


  // 正则表达式截取字符串的方法
    function getUrlParam(url, name) {
       // 正则筛选地址栏
       let reg = new RegExp("(^|&|/?|//)" + name + "=([^&]*)(&|$)");
      // 匹配目标参数
     let result = url.substr(1).match(reg);
     //返回参数值
      return result ? decodeURIComponent(result[2]) : null;
  }
  // 提供外部的接口
  module.exports = {
    scanAction:scanAction,
    dealScanCode:dealScanCode,
    getUrlParam:getUrlParam
 }