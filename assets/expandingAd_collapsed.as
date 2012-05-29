//Expanding Flash Template - collapsed
import flash.net.URLRequest;

var paramObj:Object=LoaderInfo(this.root.loaderInfo).parameters;

//add the clickthrus:
for(var key in paramObj){
	if(getChildByName(paramObj[key])){
		getChildByName(paramObj[key]).addEventListener(MouseEvent.CLICK, function(e){changePage(paramObj[e.target.name])})	
	}
}

expand.addEventListener(MouseEvent.MOUSE_OVER, doExpand);
function doExpand(e):void{
	if(ExternalInterface.available){
		ExternalInterface.call('wpAd.expanding_' + paramObj['adid'] + '.expand');
	}
}

function changePage(url:*, window:String = "_blank"):void {
	var req:URLRequest = url is String ? new URLRequest(url) : url;
	
	if (!ExternalInterface.available) {
		navigateToURL(req, window);
	} else {
		var strUserAgent:String = String(ExternalInterface.call("function() {return navigator.userAgent;}")).toLowerCase();
		if (strUserAgent.indexOf("firefox") != -1 || (strUserAgent.indexOf("msie") != -1 && uint(strUserAgent.substr(strUserAgent.indexOf("msie") + 5, 3)) >= 6)) {
			ExternalInterface.call("window.open", req.url, window);
		} else {
			navigateToURL(req, window);
		}
	}
}