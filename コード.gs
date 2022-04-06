// 事前準備
// スクリプトプロパティに
// {
//   slack_incoming_webhook:  'https://hooks.slack.com/services/xxxxxx'
//   user_oauth_token: 'xoxp-xxxxxxxx'
// }
// の形で設定しておく

// TODO: ファイルの期限切れ確認

const run = ()=>{
  // const today = Utilities.formatDate( new Date(), 'Asia/Tokyo', 'yyyy/MM/dd')
  // postToSlack(`${today}`)
  const files = getFiles()
  deleteFiles(files)
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

const getFiles = () => {
   const options =
    {
      "method" : "post",
      "contentType" : "application/json",
      "headers": {"Authorization": `Bearer ${getUserOauthToken()}`}
    }
  const raw = UrlFetchApp.fetch(`https://slack.com/api/files.list?count=2&user=U010KCQJ1N3`, options).getContentText()
  const { files } = JSON.parse(raw) 
  return files
}

const deleteFiles = (files) => {
  files.forEach(file => {
    Logger.log(file.id)
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
    const result = UrlFetchApp.fetch(`https://slack.com/api/files.delete`, options)
    Logger.log(result)
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


// スクリプトプロパティを設定するだけに使う開発用メソッド
const registScriptProperty = () =>{
  const key = ''
  const value = ''
  const scriptProperties = PropertiesService.getScriptProperties()
  scriptProperties.setProperty(key, value)
  const result = scriptProperties.getProperty(key)
  Logger.log(scriptProperties)
}