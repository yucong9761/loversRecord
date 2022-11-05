Page({
  // 保存任务的 _id 和详细信息
  data: {
    _id: '',
    remark: null,
    dateStr: '',
    timeStr: '',
    creditPercent: 0,
    condition: '',
    from: '',
    to: '',
    maxCredit: getApp().globalData.maxCredit,
    list: getApp().globalData.collectionRemarkList,
  },

  onLoad(options) {
    // 保存上一页传来的 _id 字段，用于查询任务
    if (options.id !== undefined) {
      this.setData({
        _id: options.id
      })
    }
  },
  
  getDate(dateStr){
    const milliseconds = Date.parse(dateStr)
    const date = new Date()
    date.setTime(milliseconds)
    return date
  },

  getCondition(condition){
    switch(condition){
      case 'new':
        return '初始';
        break;
      case 'finished':
        return '完成';
      case 'commited':
        return '确认';
      case 'canceled':
        return '已取消';
    }
  },
  deleteRemark(){
    wx.cloud.callFunction({name: 'getOpenId'}).then(async openid => {
      // if(this.data.remark._openid !== openid.result){
      //   wx.showToast({
      //     title: '非本人不能取消',
      //     icon: 'error',
      //     duration: 2000
      //   })
      //   return
      // } else {
        this.data.remark.condition = "canceled";
        console.log(this.data._id)
        wx.cloud.callFunction({name: 'deleteRemark', data: {_id: this.data._id, list: getApp().globalData.collectionRemarkList}}).then(data =>{
          wx.navigateBack({
            delta: 0,
          })
          // console.log(data)
          // if(data.result !== null){
          //   wx.showToast({
          //     title: '修改成功',
          //     icon: 'success',
          //     duration: 2000
          //   })
          // } else {
          //   wx.showToast({
          //     title: '修改失败',
          //     icon: 'error',
          //     duration: 2000
          //   })
          // }
        })
      // }
      wx.navigateBack({
        delta: 0,
      })
    })
  },
  commitRemark(){
    wx.cloud.callFunction({name: 'getOpenId'}).then(async openid => {
      if(this.data.remark._openid === openid.result){
        wx.showToast({
          title: '本人不能确认',
          icon: 'error',
          duration: 2000
        })
        return
      } else {
        this.data.remark.condition = "commited";
        wx.cloud.callFunction({name: 'editRemark', data: {_id: this.data._id, condition: this.data.remark.condition, list: getApp().globalData.collectionRemarkList}}).then(data =>{
          if(data.result.stats.updated === 1){
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '修改失败',
              icon: 'error',
              duration: 2000
            })
          }
        })
      }
    })
  },

  finishRemark(){
    if(this.data.remark.condition === "new"){
      wx.showToast({
        title: '状态需确认/取消',
        icon: 'error',
        duration: 2000
      })
      return
    } else {
      this.data.remark.condition = "finished";
      wx.cloud.callFunction({name: 'editRemark', data: {_id: this.data._id, condition: this.data.remark.condition, list: getApp().globalData.collectionRemarkList}}).then(data =>{
        if(data.result.stats.updated === 1){
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '修改失败',
            icon: 'error',
            duration: 2000
          })
        }
      })
    }
  },
  // 根据 _id 值查询并显示任务
  async onShow() {
    if (this.data._id.length > 0) {
      // 根据 _id 拿到任务
      await wx.cloud.callFunction({name: 'getElementById', data: this.data}).then(data => {
        // 将任务保存到本地，更新显示
        this.setData({
          remark: data.result.data[0],
          condition: this.getCondition(data.result.data[0].condition),
          dateStr: this.getDate(data.result.data[0].date).toDateString(),
          timeStr: this.getDate(data.result.data[0].date).toTimeString(),
          creditPercent: (data.result.data[0].credit / getApp().globalData.maxCredit) * 100,
        })

        //确定任务关系并保存到本地
        if(this.data.remark.user === getApp().globalData._openidA){
          this.setData({
            from: getApp().globalData.userA,
          })
        }else if(this.data.remark.user === getApp().globalData._openidB){
          this.setData({
            from: getApp().globalData.userB,
          })
        }
      })
    }
  },
})