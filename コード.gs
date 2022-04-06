// 事前準備
// スクリプトプロパティに
// {
//   slack_incoming_webhook:  'https://hooks.slack.com/services/xxxxxx'
//   user_oauth_token: 'xoxp-xxxxxxxx'
// }
// の形で設定しておく

const run = ()=>{
  const files = getOldFiles()
  deleteFiles(files)

  const date = new Date();
  date.setFullYear(date.getFullYear()-1)
  postToSlack(`${Utilities.formatDate(date, 'JST', 'yyyy-MM-dd')} までのファイルをおそうじしたよ～`)
}

const postToSlack = (text) => {
  const options =
  {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : JSON.stringify(
      {
        "text" : text
      }
    )
  };
  UrlFetchApp.fetch(getIncomingWebhookUrl(), options)
}

const getOldFiles = () => {
  //1年前以前のファイルが対象
  const timestamp = elapsedDaysToUnixTime(365)

  const options =
    {
      "method" : "post",
      "contentType" : "application/json",
      "headers": {"Authorization": `Bearer ${getUserOauthToken()}`}
    }

  try{
    // 1ヶ月に1000件以上あればcount=1000じゃ対応できないが、小さなコミュニティだったらこれで事足りる
    const raw = UrlFetchApp.fetch(`https://slack.com/api/files.list?count=1000&ts_to=${timestamp}`, options).getContentText()
    const { files } = JSON.parse(raw)
    return files
  }
  catch(e){
    Logger.log(e)
  }
}

const deleteFiles = (files) => {
  files.forEach(file => {
    const options =
    {
      "method" : "post",
      "contentType" : "application/json; charset=utf-8",
      "headers": {"Authorization": `Bearer ${getUserOauthToken()}`},
      "payload" : JSON.stringify(
      {
        "file" : file.id
      }
    )
    }
    try {
      const result = UrlFetchApp.fetch(`https://slack.com/api/files.delete`, options)
      Logger.log(`${file.id} ${result}`)
    } catch (e) {
      Logger.log(e)
    }
  })
}

const getIncomingWebhookUrl = ()=> {
  const scriptProperties = PropertiesService.getScriptProperties()
  return scriptProperties.getProperty('slack_incoming_webhook')
}

const getUserOauthToken = ()=> {
  const scriptProperties = PropertiesService.getScriptProperties()
  return scriptProperties.getProperty('user_oauth_token')
}

const elapsedDaysToUnixTime = (days) => {  
  var date = new Date();
  var now = Math.floor(date.getTime()/ 1000); // unixtime[sec]
  return now - 8.64e4 * days + '' // 8.64e4[sec] = 1[day] 文字列じゃないと動かないので型変換している
}


// スクリプトプロパティを設定するだけに使う開発用メソッド
const registScriptProperty = () =>{
  const key = ''
  const value = ''
  const scriptProperties = PropertiesService.getScriptProperties()
  scriptProperties.setProperty(key, value)
  const result = scriptProperties.getProperty(key)
  Logger.log(scriptProperties)
}