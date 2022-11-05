// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ // 初始化云开发环境
  env: cloud.DYNAMIC_CURRENT_ENV // 当前环境的常量
})
const db = cloud.database()
const db_date =  db.serverDate()

exports.main = async () => {

  

  try {
    /**
     * tourser：不可空  用户openid
     * templateId：不可空 订阅模板id
     * data：不可空  模板参数
     */
    const result = await cloud.openapi.subscribeMessage.send({
        "touser": 'oTzHF5KG5t8MddVckruo-rqOzoCo',  
        // "page": 'index',     
        "lang": 'zh_CN',
        "data": {
          "thing17": {
            "value": '张三'
          },
          "thing10": {
            "value": '博学楼'
          },
          "thing2": {
            "value": '啊啊'
          },
          "time3": {
            "value": '2019-10-25 10:10'
          },
          "thing11": {
            "value": '广州市'
          }
        },
        "templateId": '36gzxjuEuUhaRlPfW4y_ZcmLf8-tOO5tJCKZ0I3a3ik',  
        "miniprogramState": 'trial'
      })
    return result
  } catch (err) {
    return err
  }
}