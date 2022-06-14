!(async () => {
let traffic = (await httpAPI("/v1/traffic","GET"));
let dateNow = new Date();
let dateTime = Math.floor(traffic.startTime*1000);
let startTime = timeTransform(dateNow,dateTime);
let mitm_status = (await httpAPI("/v1/features/mitm","GET"));
let rewrite_status = (await httpAPI("/v1/features/rewrite","GET"));
let scripting_status = (await httpAPI("/v1/features/scripting","GET"));
let icon_s = mitm_status.enabled&&rewrite_status.enabled&&scripting_status.enabled;
//点击按钮，刷新dns
//if ($trigger == "button") await httpAPI("/v1/dns/flush");
//点击按钮，重载配置（同时刷新dns）
if ($trigger == "button") {
	await httpAPI("/v1/profiles/reload");
	$notification.post("Reload configuration","Reload configuration succeeded","")
};
$done({
    title:"Surge has run ➢ "+startTime,
    content:"Mitm:"+icon_status(mitm_status.enabled)+"  Rewrite:"+icon_status(rewrite_status.enabled)+"  Scripting:"+icon_status(scripting_status.enabled),
    icon: icon_s?"hand.thumbsup.circle":"exclamationmark.triangle",
   "icon-color":icon_s?"#144a2a":"#FF7500"
});
})();
function icon_status(status){
  if (status){
    return "\u2611";
  } else {
      return "\u2612"
    }
}
function timeTransform(dateNow,dateTime) {
let dateDiff = dateNow - dateTime;
let days = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
let leave1=dateDiff%(24*3600*1000)    //计算天数后剩余的毫秒数
let hours=Math.floor(leave1/(3600*1000))//计算出小时数
//计算相差分钟数
let leave2=leave1%(3600*1000)    //计算小时数后剩余的毫秒数
let minutes=Math.floor(leave2/(60*1000))//计算相差分钟数
//计算相差秒数
let leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
let seconds=Math.round(leave3/1000)

if(days==0){
  if(hours==0){
    if(minutes==0)return(`${seconds} Sec`);
      return(`${minutes} : ${seconds}`)
    }
    return(`${hours} : ${minutes} : ${seconds}`)
  }else {
        return(`${days}Day ${hours} : ${minutes} : `)
	}
}
function httpAPI(path = "", method = "POST", body = null) {
  return new Promise((resolve) => {
    $httpAPI(method, path, body, (result) => {
      resolve(result);
    });
  });
}
