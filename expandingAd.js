(function(){

  "use strict";
  
  function ExpandingAd(atts){
    
    for(var key in atts){
      this[key] = atts[key];
    }

    var dimensions = {
      'leaderboard' : [['728', '90'], ['728', '360']],
      'bigbox' : [['300', '250'], ['600', '250']],
      'halfpage' : [['336', '850'], ['600', '850']]
    }

    if(!this.size){
      this.size = {
        width : dimensions[this.type][0][0],
        height : dimensions[this.type][0][1],
        expWidth : dimensions[this.type][1][0],
        expHeight : dimensions[this.type][1][1]
      }
    }
    
    this.expanded = false;
    this.loading = false;
    this.container = document.getElementById(this.adid + '_expanding_ad_container');
    this.outerContainer = this.container.parentNode;
    this.exec();

    return this;
  }

  ExpandingAd.prototype.exec = function(){
    if(this.getFlashVer() >= this.minFlashVer){
      this.flashVars = this.buildFlashVars();
      this.styleOuterContainer().styleContainer().buildCollapsed().addCollapsed().resize();
    } else {
      this.noFlash = true;
      this.writeBackupImage();
    }
    if(this.pixels.main){
      this.addPixel(this.pixels.main);
    }
  }

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
  }

  ExpandingAd.prototype.styleOuterContainer = function(){
    var c = this.outerContainer;
    c.style.width = this.size.width + 'px';
    c.style.height = this.size.height + 'px';
    c.style.overflow = 'visible';
    c.style.position = 'relative';
    c.style.margin = '0 auto';
    return this;
  }

  ExpandingAd.prototype.styleContainer = function(){
    var c = this.container;
    c.style.top = '0';
    c.style.position = 'absolute';
    c.style.right = '0';
    c.style.backgroundColor = '#fff';
    c.style.overflow = 'hidden';
    c.style.cursor = 'pointer';
    return this;
  }

  ExpandingAd.prototype.swfDrop = function(){
    var movie = this.expanded ? this.expSWF : this.colSWF,
      width = this.expanded ? this.size.expWidth : this.size.width,
      height = this.expanded ? this.size.expHeight : this.size.height,
      params = '<param name="movie" value="'+movie+'"/><param name="quality" value="high"/><param name="bgcolor" value="#ffffff"/><param name="wmode" value="transparent"/><param name="allowScriptAccess" value="always"/><param name="flashVars" value="'+this.flashVars+'"/>';

    return '<object id="'+this.adid+(this.expanded ? '_expanded' : '_collapsed')+'_creative" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+width+'" height="'+height+'" style="outline:none;">'+params+'<!--[if !IE]>--><object type="application/x-shockwave-flash" data="'+ movie +'" width="'+ width +'" height="'+ height +'"  style="outline:none;">'+params+'</object><!--<![endif]--></object>';
  } 
  
  ExpandingAd.prototype.buildFlashVars = function(){
    var rv = '',
      key;

    if(this.adid){
      rv = rv + 'adid=' + this.adid;
    }

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
  
  ExpandingAd.prototype.buildExpanded = function(){
    this.expandedDiv = document.createElement('div');
    this.expandedDiv.innerHTML = this.swfDrop();
    return this;
  }
  
  ExpandingAd.prototype.buildCollapsed = function(){
    this.collapsedDiv = document.createElement('div');
    this.collapsedDiv.innerHTML = this.swfDrop();
    return this;
  }
  
  ExpandingAd.prototype.addExpanded = function(){
    this.container.appendChild(this.expandedDiv);
    return this;
  }

  ExpandingAd.prototype.addCollapsed = function(){
    this.container.appendChild(this.collapsedDiv);
    return this;
  }
  
  ExpandingAd.prototype.expand = function(){
    if(!this.noFlash && !this.expanded && !this.loading){
      this.loading = true;
      this.expanded = true;
      this.buildExpanded().addExpanded().resize().cleanUp();
      if(this.pixels.expand){
        this.addPixel(this.pixels.expand);
      }
      this.loading = false;
    }
  }

  ExpandingAd.prototype.collapse = function(){
    if(!this.noFlash && this.expanded && !this.loading){
      this.loading = true;
      this.expanded = false;
      this.buildCollapsed().addCollapsed().resize().cleanUp();
      if(this.pixels.collapse){
        this.addPixel(this.pixels.collapse);
      }
      this.loading = false;
    }
  }

  ExpandingAd.prototype.resize = function(){
    //IAB max z-index value for expanding ads
    this.outerContainer.style.zIndex = this.expanded ? '1999999' : '1';
    this.container.style.zIndex = this.expanded ? '1999999' : '1';
    
    this.container.style.width = (this.expanded ? this.size.expWidth : this.size.width) + 'px';
    this.container.style.height = (this.expanded ? this.size.expHeight : this.size.height) + 'px';
    
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
  
  ExpandingAd.prototype.cleanUp = function(){
    try{
      this.container.removeChild(this.expanded ? this.collapsedDiv : this.expandedDiv);
    } catch (e){}
  }

  ExpandingAd.prototype.addPixel = function(url){
    var i = document.createElement('img');
    i.src= url.replace(/\[timestamp\]|%n/ig, Math.floor(Math.random()*1E9));
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
  
  window.wpAd = window.wpAd || {};
  window.wpAd.ExpandingAd = ExpandingAd;
})();