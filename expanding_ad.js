(function(){

  "use strict";
  
  window.wpAd = window.wpAd || {};
  
  function ExpandingAd(atts){
  
    for(var key in atts){
      this[key] = atts[key];
    }

    var dimensions = {
      'leaderboard' : [['728', '90'], ['728', '360']],
      'bigbox' : [['300', '250'], ['600', '250']],
      'halfpage' : [['336', '850'], ['600', '850']]
    }
    
    this.size = {
      width : dimensions[this.type][0][0],
      height : dimensions[this.type][0][1],
      expWidth : dimensions[this.type][1][0],
      expHeight : dimensions[this.type][1][1]
    }
    this.expanded = false;
    this.container = document.getElementById(this.adid + '_expanding_ad_container');
    this.outerContainer = this.container.parentNode;
    this.exec();

    return this;
  }

  ExpandingAd.prototype.exec = function(){
    if(this.getFlashVer() >= this.minFlashVer){
      this.flashVars = this.buildFlashVars();
      this.styleOuterContainer().styleContainer().swfDrop();
    } else {
      this.writeBackupImage();
    }
  }

  //ExpandingAd.prototype.iframeBreakout = function(){
    //will need to do this inside of the creative code window... including writing this script outside of the fif
  //}
  
  ExpandingAd.prototype.writeBackupImage = function(){
    var a = document.createElement('a'),
      img = document.createElement('img');
    
    a.href = this.clickTracker + this.clickTags.clickTag;
    a.target = '_blank';
    a.appendChild(img);
    
    img.src = this.backupImage;
    img.alt = 'Click here for more information';
    img.style.border = '0';
    img.width = this.size.width;
    img.height = this.size.height;
    
    this.container.appendChild(a);
    
    return this;
  }

  ExpandingAd.prototype.styleOuterContainer = function(){
    var c = this.outerContainer;
    c.style.width = this.size.width + 'px';
    c.style.height = this.size.height + 'px';
    c.style.overflow = 'visible';
    c.style.position = 'relative';
    c.style.zIndex = '1999999';  //IAB max z-index value for expanding ads
    return this;
  }

  ExpandingAd.prototype.styleContainer = function(){
    var c = this.container;
    c.style.top = '0';
    c.style.position = 'relative';
    c.style.right = '0';
    return this;
  }

  ExpandingAd.prototype.swfDrop = function(){
    var movie = this.expanded ? this.expSWF : this.colSWF,
      width = this.expanded ? this.size.expWidth : this.size.width,
      height = this.expanded ? this.size.expHeight : this.size.height,
      params = '<param name="movie" value="'+movie+'"/><param name="quality" value="high"/><param name="bgcolor" value="#ffffff"/><param name="play" value="true"/><param name="loop" value="true"/>	<param name="allowFullScreen" value="true"/><param name="wmode" value="transparent"/><param name="devicefont" value="false"/><param name="menu" value="false"/><param name="allowScriptAccess" value="always"/><param name="flashVars" value="'+this.flashVars+'"/>';
    
    this.container.innerHTML = '<object id="FlashID" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+width+'" height="'+height+'" style="outline:none;">'+params+'<!--[if !IE]>--><object type="application/x-shockwave-flash" data="'+ movie +'" width="'+ width +'" height="'+ height +'"  style="outline:none;">'+params+'</object><!--<![endif]--></object>';
    
    return this;
  } 
  
  ExpandingAd.prototype.buildFlashVars = function(){
    var rv = '',
      key;

    for(key in this.clickTags){
      if(this.clickTags.hasOwnProperty(key) && this.clickTags[key]){
        if(rv){
          rv = rv + '&';
        }
        rv = rv + key + '=' + this.clickTracker + encodeURIComponent(this.clickTags[key]);
      }
    }
    return rv;
  }

  ExpandingAd.prototype.expand = function(){
    if(!this.expanded){
      this.expanded = true;
      this.empty().swfDrop().resize();
      if(this.pixels.expand){
        this.addPixel(this.pixels.expand);
      }
    }
    return this;
  }

  ExpandingAd.prototype.collapse = function(){
    console.time('t');
    if(this.expanded){
      this.expanded = false;
      this.empty().resize().swfDrop();
      if(this.pixels.collapse){
        this.addPixel(this.pixels.collpase);
      }
    }
    console.timeEnd('t');
    return this;
  }
  
  ExpandingAd.prototype.resize = function(){
    if(this.expanded){
      this.container.style.width = this.size.expWidth + 'px';
      this.container.style.height = this.size.expHeight + 'px';
    } else {
      this.container.style.width = this.size.width + 'px';
      this.container.style.height = this.size.height + 'px';
    }
    return this;
  }
  
  ExpandingAd.prototype.empty = function(){
    if(this.container && this.container.hasChildNodes()){
      var l = this.container.childNodes.length;
      while(l--) {
        this.container.removeChild(this.container.childNodes[l]);
      }
    }
    return this;
  }

  ExpandingAd.prototype.addPixel = function(url){
    var i = document.createElement('img');
    i.src= url;
    i.width = '1';
    i.height = '1';
    i.style.display = 'none';
    i.style.border = '0';
    i.alt= '';
    this.outerContainer.appendChild(i);
  }
  
  ExpandingAd.prototype.getFlashVer = function(){
    var i,a,o,p,s="Shockwave",f="Flash",t=" 2.0",u=s+" "+f,v=s+f+".",rSW=RegExp("^"+u+" (\\d+)");
    if((o=navigator.plugins)&&(p=o[u]||o[u+t])&&(a=p.description.match(rSW)))return a[1];
    else if(!!(window.ActiveXObject))for(i=10;i>0;i--)try{if(!!(new ActiveXObject(v+v+i)))return i}catch(e){}
    return 0;
  }
  
  wpAd.ExpandingAd = ExpandingAd;
  
})();