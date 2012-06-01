//Expanding Flash Template
import flash.net.URLRequest;

flash.system.Security.allowDomain("*");
flash.system.Security.allowInsecureDomain("*");

var paramObj:Object=LoaderInfo(this.root.loaderInfo).parameters;

if(ExternalInterface.available){
	ExternalInterface.call('function(){ try{ wpAd["expanding_' + paramObj['adid'] + '"].onLoadCallback() }catch(e){}}');
	stage.addEventListener(Event.MOUSE_LEAVE, doCollapse);
	
	if(getChildByName('expand')){
		getChildByName('expand').addEventListener(MouseEvent.MOUSE_OVER, doExpand);
	}
}

if(getChildByName('clickTag') && paramObj['clickTag']){
	getChildByName('clickTag').addEventListener(MouseEvent.CLICK, function(e){changePage(paramObj['clickTag'])});
}
if(getChildByName('clickTag2') && paramObj['clickTag2']){
	getChildByName('clickTag2').addEventListener(MouseEvent.CLICK, function(e){changePage(paramObj['clickTag2'])});
}
if(getChildByName('clickTag3') && paramObj['clickTag3']){
	getChildByName('clickTag3').addEventListener(MouseEvent.CLICK, function(e){changePage(paramObj['clickTag3'])});
}
if(getChildByName('clickTag4') && paramObj['clickTag4']){
	getChildByName('clickTag4').addEventListener(MouseEvent.CLICK, function(e){changePage(paramObj['clickTag4'])});
}
if(getChildByName('clickTag5') && paramObj['clickTag5']){
	getChildByName('clickTag5').addEventListener(MouseEvent.CLICK, function(e){changePage(paramObj['clickTag5'])});
}
if(getChildByName('clickTag6') && paramObj['clickTag6']){
	getChildByName('clickTag6').addEventListener(MouseEvent.CLICK, function(e){changePage(paramObj['clickTag6'])});
}


function doCollapse(e):void{
	ExternalInterface.call('wpAd.expanding_' + paramObj['adid'] + '.collapse');
}

function doExpand(e):void{
	ExternalInterface.call('wpAd.expanding_' + paramObj['adid'] + '.expand');
}

function loadMe(url:String):Loader{
	var loader:Loader = new Loader();
	loader.load(new URLRequest(url));
	return loader;
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