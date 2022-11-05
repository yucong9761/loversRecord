// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ // 初始化云开发环境
  env: cloud.DYNAMIC_CURRENT_ENV // 当前环境的常量
})
const db = cloud.database()
const db_date =  db.serverDate()

// 云函数入口函数
exports.main = async (context) => {
  return await db.collection(context.list).add({
    data: {
      _openid: cloud.getWXContext().OPENID,
      date: context.date,    
      title: context.title,
      desc: context.desc,
      condition: context.condition,
      type: context.type,
      location: context.location,
      user: context.user,
      name: context.name,
    }
  })
}