Page({
  data: {
    screenWidth: 1000,
    screenHeight: 1000,

    search: "",

    allRemarks: [],
    unfinishedRemarks: [],
    finishedRemarks: [],

    _openidA : getApp().globalData._openidA,
    _openidB : getApp().globalData._openidB,

    type:'remark',

    slideButtons: [
      {extClass: 'markBtn', text: '标记', src: "Images/icon_mark.svg"},
      {extClass: 'starBtn', text: '星标', src: "Images/icon_star.svg"},
      // {extClass: 'removeBtn', text: '删除', src: 'Images/icon_del.svg'}
    ],
  },

  //页面加载时运行
  async onShow(){
    await wx.cloud.callFunction({name: 'getRemarkListByType', data: {list: getApp().globalData.collectionRemarkList,type: this.data.type}}).then(data => {
      this.setData({allRemarks: data.result.data})
      console.log(this.data.allRemarks)
      this.filterRemark()
      this.getScreenSize()
    })
  },

  //获取页面大小
  async getScreenSize(){
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          screenWidth: res.windowWidth,
          screenHeight: res.windowHeight
        })
      }
    })
  },

  //转到任务详情
  async toDetailPage(element, isUpper) {
    const remarkIndex = element.currentTarget.dataset.index
    const remark = isUpper ? this.data.unfinishedRemarks[remarkIndex] : this.data.finishedRemarks[remarkIndex]
    wx.navigateTo({url: '../../packageB/pages/RemarkDetail/index?id=' + remark._id})
  },
  //转到任务详情[上]
  async toDetailPageUpper(element) {
    this.toDetailPage(element, true)
  },  
  //转到任务详情[下]
  async toDetailPageLower(element) {
    this.toDetailPage(element, false)
  },
  //转到添加任务
  async toAddPage() {
    wx.navigateTo({url: '../../packageB/pages/RemarkAdd/index'})
  },

  //设置搜索
  onSearch(element){
    this.setData({
      search: element.detail.value
    })
    this.filterRemark()
  },

  //将任务划分为：完成，未完成
  filterRemark(){
    let remarkList = []
    if(this.data.search != ""){
      for(let i in this.data.allRemarks){
        if(this.data.allRemarks[i].title.match(this.data.search) != null){
          remarkList.push(this.data.allRemarks[i])
        }
      }
    }else{
      remarkList = this.data.allRemarks
    }

    this.setData({
      unfinishedRemarks: remarkList.filter(item => item.condition !== 'finished'),
      finishedRemarks: remarkList.filter(item => item.condition === 'finished'),
    })
  },

  //响应左划按钮事件[上]
  async slideButtonTapUpper(element) {
    this.slideButtonTap(element, true)
  },

  //响应左划按钮事件[下]
  async slideButtonTapLower(element) {
    this.slideButtonTap(element, false)
  },

  //响应左划按钮事件逻辑
  async slideButtonTap(element, isUpper){
    //得到UI序号
    const {index} = element.detail

    //根据序号获得任务
    const remarkIndex = element.currentTarget.dataset.index
    const remark = isUpper === true ? this.data.unfinishedRemarks[remarkIndex] : this.data.finishedRemarks[remarkIndex]

    await wx.cloud.callFunction({name: 'getOpenId'}).then(async openid => {

        //处理完成点击事件
        if (index === 0) {
            if(isUpper) {
                this.finishRemark(element)
            }else{
                wx.showToast({
                    title: '任务已经完成',
                    icon: 'error',
                    duration: 2000
                })
            }

        }else if(remark._openid === openid.result){
            //处理星标按钮点击事件
            if (index === 1) {
                wx.cloud.callFunction({name: 'editStar', data: {_id: remark._id, list: getApp().globalData.collectionRemarkList, value: !remark.star}})
                //更新本地数据
                remark.star = !remark.star
            }
            
            //处理删除按钮点击事件
            else if (index === 2) {
                wx.cloud.callFunction({name: 'deleteElement', data: {_id: remark._id, list: getApp().globalData.collectionRemarkList}})
                //更新本地数据
                if(isUpper) this.data.unfinishedRemarks.splice(remarkIndex, 1) 
                else this.data.finishedRemarks.splice(remarkIndex, 1) 
                //如果删除完所有事项，刷新数据，让页面显示无事项图片
                if (this.data.unfinishedRemarks.length === 0 && this.data.finishedRemarks.length === 0) {
                    this.setData({
                    allRemarks: [],
                    unfinishedRemarks: [],
                    finishedRemarks: []
                    })
                }
            }

            //触发显示更新
            this.setData({finishedRemarks: this.data.finishedRemarks, unfinishedRemarks: this.data.unfinishedRemarks})

        //如果编辑的不是自己的任务，显示提醒
        }else{
            wx.showToast({
            title: '只能编辑自己的任务',
            icon: 'error',
            duration: 2000
            })
        }
    })
  },

  //完成任务
  async finishRemark(element) {
    //根据序号获得触发切换事件的待办
    const remarkIndex = element.currentTarget.dataset.index
    const remark = this.data.unfinishedRemarks[remarkIndex]

    await wx.cloud.callFunction({name: 'getOpenId'}).then(async openid => {
      if(remark._openid != openid.result){
        //完成对方任务，奖金打入对方账号
        wx.cloud.callFunction({name: 'editAvailable', data: {_id: remark._id, value: false, list: getApp().globalData.collectionRemarkList}})
        wx.cloud.callFunction({name: 'editCredit', data: {_openid: remark._openid, value: remark.credit, list: getApp().globalData.collectionUserList}})

        //触发显示更新
        remark.available = false
        this.filterRemark()

        //显示提示
        wx.showToast({
            title: '任务完成',
            icon: 'success',
            duration: 2000
        })

      }else{
        wx.showToast({
          title: '不能完成自己的任务',
          icon: 'error',
          duration: 2000
        })
      }
    })
  },
})