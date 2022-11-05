// cloudfunctions/pushNotify/index.js

const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  // 不加此参数就默认为第一个创建的云环境
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const kTableName = 'RemarkList'

// 云函数入口函数
exports.main = async (event, context) => {
  var myDate = new Date(+new Date() + 8 * 3600 * 1000);
  var day = myDate.getDate();
  var month = myDate.getMonth();
  month++
  var year = myDate.getFullYear();
  var hour = myDate.getHours();
  var minute = myDate.getMinutes();
  var endMinute = minute;
  var endHour = hour;
  var endYear = year;
  var endMonth = month;
  var endDay = day;
  if (minute<50){
    endMinute = endMinute+10;
  }
  else {
    if(hour<23){
      endHour++;
      endMinute = 10-60-endMinute;
    } else {
      endHour = 23;
      endMinute = 59;
    }
  }
  if(month<10) 
    {month="0"+month}
  if(day<10)
    {day="0"+day;}
  if(minute<10)
    {minute="0"+minute;}
  if(endMinute<10)
    {endMinute="0"+endMinute;}
  if(hour<10)
    {hour="0"+hour;}
  if(endHour<10)
    {endHour="0"+endHour;}
  var startTime = year+"-"+month+"-"+day+" "+hour+":"+minute;
  var endTime = year+"-"+month+"-"+day+" "+endHour+":"+endMinute;
  try {
    // --- 步骤1 ---
    // 从云开发数据库中查询等待发送的消息列表
    const msgArr = await db
      .collection(kTableName)
      // 查询条件
      .where({
        type: "memorandum",
        date: db.command.gte(startTime),
        date: db.command.lte(endTime),
        condition: "new",
      })
      .get()

    console.log(msgArr.data)

    // --- 步骤2 ---
    for (const msgData of msgArr.data) {
      console.log("msgData.date>=")
      if(msgData.condition!=="new"){
        continue;
      }
      // if(msgData.date>=startTime && msgData.date<=endTime){
        console.log("send")
      // 发送订阅消息
        cloud.openapi.subscribeMessage.send({
        touser: msgData.user, // 要发送用户的openid
        page: 'pages/Memorandum/index', // 用户通过消息通知点击进入小程序的页面
        lang: 'zh_CN',
        // 订阅消息模板ID
        // 替换为你的模板id!
        templateId: '36gzxjuEuUhaRlPfW4y_ZcmLf8-tOO5tJCKZ0I3a3ik',
        // 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
        // 正式版删除此行
        miniprogramState: 'formal',
        // 要发送的数据，要和模板一致
        "data": {
          "thing17": {
            "value": msgData.name
          },
          "thing10": {
            "value": msgData.location
          },
          "thing2": {
            "value": msgData.title
          },
          "time3": {
            "value": msgData.date
          },
          "thing11": {
            "value": msgData.desc
          }
        },
      })

      console.log("ok")
      // --- 步骤3 ---
      // 发送成功后将pushed数据状态重置
        db
          .collection(kTableName)
          .doc(msgData._id)
          .update({
            data: {
              condition: "pushed"
            },
          })
      // }
    }

    // --- 步骤4 ---
    return msgArr
  } catch (e) {
    return e
  }
}

// 将太长的文本截短
function sliceBodyStr(str, length) {
  if (str.length <= length) {
    return str
  } else {
    return str.slice(0, length) + '...'
  }
}