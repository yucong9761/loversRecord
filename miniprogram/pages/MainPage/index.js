/* Main page of the app */
Page({
    data: {
        creditA: 0,
        creditB: 0,
        resultTime: {
            dd: 0,
            hh: 0,
            mm: 0,
            ss: 0
        },
        userA: '',
        userB: '',
    },
    onShow(){
        this.getCreditA()
        this.getCreditB()
        this.calcTimeLen()
        this.setData({
            userA: getApp().globalData.userA,
            userB: getApp().globalData.userB,
        })
        setTimeout(()=>{
            this.setData({
                resultTime: this.calcTimeLen(),
            })
        },1000)
    },

    calcTimeLen() {
        var resultDate = {
            dd: 0,
            hh: 0,
            mm: 0,
            ss: 0
        };
        var startStr = '2018-02-15 00:00:00:000';
        var startDate = new Date(startStr.replace(/-/g, '/'));
        var nowDate = new Date();
        if (nowDate < startDate) {
            return;
        }
        var timeLen = (nowDate - startDate) / 1000;
        resultDate.dd = parseInt(timeLen / (24 * 60 * 60));
        timeLen = timeLen % (24 * 60 * 60);
        resultDate.hh = parseInt(timeLen / (60 * 60));
        timeLen = timeLen % (60 * 60);
        resultDate.mm = parseInt(timeLen / 60);
        resultDate.ss = parseInt(timeLen % 60);
        // 如果字符串长度不足两位数，则在字符串前面补上字符'0'
        resultDate.hh = resultDate.hh.toString().padStart(2, '0');
        resultDate.mm = resultDate.mm.toString().padStart(2, '0');
        resultDate.ss = resultDate.ss.toString().padStart(2, '0');
        this.setData({
            resultTime: resultDate
          })
        setTimeout(this.calcTimeLen, 1000);
    },

    getCreditA(){
        wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidA}})
        .then(res => {
          this.setData({creditA: res.result.data[0].credit})
        })
    },
    
    getCreditB(){
        wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidB}})
        .then(res => {
            this.setData({creditB: res.result.data[0].credit})
        })
    },
})