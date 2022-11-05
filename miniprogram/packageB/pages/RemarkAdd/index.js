Page({
  //保存正在编辑的任务
  data: {
    date:'点击选择时间',
    title: '',
    desc: '',
    maxCredit: getApp().globalData.maxCredit,
    condition: 'new',
    presetIndex: 0,
    type: 'remark',
    list: getApp().globalData.collectionRemarkList,
  },


  selectDateMinuteChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  //数据输入填写表单
  onTitleInput(e) {
    this.setData({
      title: e.detail.value
    })
  },
  onDescInput(e) {
    this.setData({
      desc: e.detail.value
    })
  },

  //保存任务
  async saveRemark() {
    // 对输入框内容进行校验
    if (this.data.title === '') {
      wx.showToast({
        title: '标题未填写',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.title.length > 12) {
      wx.showToast({
        title: '标题过长',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.desc.length > 100) {
      wx.showToast({
        title: '描述过长',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if(this.data.date === '点击选择时间'){
      this.data.date = new Date();
    }
    else{
        console.log(this.data);
        await wx.cloud.callFunction({name: 'addRemark', data: this.data}).then(
            () => {
                wx.showToast({
                    title: '添加成功',
                    icon: 'success',
                    duration: 1000
                })
            }
        )
        setTimeout(function () {
            wx.navigateBack()
        }, 1000)
    }
  },

  // 重置所有表单项
  resetRemark() {
    this.setData({
      title: '',
      desc: '',
      presetIndex: 0,
      condition: 'new',
    })
  }
})