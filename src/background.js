const opt_extraInfoSpec = ['requestHeaders', 'blocking']

if (chrome && chrome.webRequest.OnBeforeSendHeadersOptions.hasOwnProperty('EXTRA_HEADERS')) {
  opt_extraInfoSpec.push('extraHeaders')
}

chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
  var gotAcceptLanguage = false;
  for (var n in details.requestHeaders) {
    if (details.requestHeaders[n].name.toLowerCase() === "accept-language") {
      details.requestHeaders[n].value = 'en'
      gotAcceptLanguage = true
      break
    }
  }
  if(!gotAcceptLanguage){
    details.requestHeaders.push({name:"accept-language",value:'en'});
  }
  return {requestHeaders:details.requestHeaders};
},{
  urls:["https://oauth.reddit.com/*.json*", "https://oauth.reddit.com/api/info*"]
}, opt_extraInfoSpec);
