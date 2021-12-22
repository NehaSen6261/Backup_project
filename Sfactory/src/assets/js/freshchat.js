function initFreshChat() {
  window.fcWidget.init({
    token: "bdfd7c0a-5442-4d3d-b86c-cdb3688faa1b",
    host: "https://wchat.freshchat.com",

  });
    window.fcWidget.setExternalId(localStorage.getItem('setEmail'));
    window.fcWidget.user.setFirstName(localStorage.getItem('setFirstName'));
    window.fcWidget.user.setEmail(localStorage.getItem('setEmail'));

}

function initialize(i,t){
  var e;i.getElementById(t)?initFreshChat():((e=i.createElement("script")).id=t,e.async=!0,e.src="https://wchat.freshchat.com/js/widget.js",e.onload=initFreshChat,i.head.appendChild(e))}function initiateCall(){initialize(document,"freshchat-js-sdk")}window.addEventListener?window.addEventListener("load",initiateCall,!1):window.attachEvent("load",initiateCall,!1);
