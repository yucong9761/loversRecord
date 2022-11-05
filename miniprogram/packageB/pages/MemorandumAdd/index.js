Page({
  //保存正在编辑的任务
  data: {
    submit: {
      title: '',
      desc: '',
      location:'',
      date:'',
      maxCredit: getApp().globalData.maxCredit,
      condition: 'new',
      presetIndex: 0,
      type: 'memorandum',
      list: getApp().globalData.collectionRemarkList,
      user:'',
      name:'',
    },
    location:'',
    date:'点击选择时间',
    user:'点击选取指派人',
    shows: false,
    userList: [getApp().globalData.userA, getApp().globalData.userB]
  },

  // 点击下拉显示框
  selectTaps() {
    this.setData({
      shows: !this.data.shows,
    });
  },
  // 点击下拉列表
  optionTaps(e) {
    let Indexs = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    console.log(Indexs)
    this.setData({
      indexs: Indexs,
      user: this.data.userList[Indexs],
      shows: !this.data.shows
    }); 
  },

  //数据输入填写表单
  onTitleInput(e) {
    this.setData({
      title: e.detail.value
    })
  },
  onLocationInput(e) {
    this.setData({
      location: e.detail.value
    })
  },
  onDescInput(e) {
    this.setData({
      desc: e.detail.value
    })
  },

  selectDateMinuteChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  //保存任务
  async saveRemark() {
    // 对输入框内容进行校验
    this.data.submit.title = this.data.title;
    this.data.submit.desc = this.data.desc;
    this.data.submit.location = this.data.location;
    if (this.data.submit.title === '') {
      wx.showToast({
        title: '标题未填写',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.submit.location === '') {
      wx.showToast({
        title: '地点未填写',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.submit.title.length > 12) {
      wx.showToast({
        title: '标题过长',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.submit.desc.length > 100) {
      wx.showToast({
        title: '描述过长',
        icon: 'error',
        duration: 2000
      })
      return
    }
    this.data.submit.date = this.data.date;
    if (this.data.submit.date === '') {
      wx.showToast({
        title: '提醒时间未填写',
        icon: 'error',
        duration: 2000
      })
      return
    }
    this.data.submit.name = this.data.user;
    if (this.data.user === getApp().globalData.userA) {
      this.data.submit.user = getApp().globalData._openidA;
    } else if(this.data.user === getApp().globalData.userB) {
      this.data.submit.user = getApp().globalData._openidB;
    }
    console.log(this.data.submit)
    if (this.data.submit.user === '') {
      wx.showToast({
        title: '提醒人未填写',
        icon: 'error',
        duration: 2000
      })
      return
    }
    else{
        console.log(this.data.submit);
        await wx.cloud.callFunction({name: 'addRemark', data: this.data.submit}).then(
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
      location: '',
      date: '点击选取时间',
      user: '点击选取指派人',
      presetIndex: 0,
      condition: 'new',
    })
  }
})