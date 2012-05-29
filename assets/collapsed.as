expand.addEventListener(MouseEvent.MOUSE_OVER, doExpand);
function doExpand(e):void{
	if(ExternalInterface.available){
		ExternalInterface.call('wpAd.expanding_' + paramObj['adid'] + '.expand');
	}
}