// 事前準備
// スクリプトプロパティに
// {
//   slack_incoming_webhook:  'https://hooks.slack.com/services/xxxxxx'
// }
// の形で設定しておく

const run = ()=>{
  postToSlack('辞めるのだロコちゃん')
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
  UrlFetchApp.fetch(getIncomingWebhookUrl(), options);
}

const getIncomingWebhookUrl = ()=> {
  const scriptProperties = PropertiesService.getScriptProperties();
  return scriptProperties.getProperty('slack_incoming_webhook')
}