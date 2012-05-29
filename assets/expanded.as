stage.addEventListener(Event.MOUSE_LEAVE, doCollapse);
function doCollapse(e):void{
	if(ExternalInterface.available){
		ExternalInterface.call('wpAd.expanding_' + paramObj['adid'] + '.collapse');
	}
}
