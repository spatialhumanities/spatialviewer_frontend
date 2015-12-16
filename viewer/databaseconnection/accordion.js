/* Some settings for the accordion */
var accord_fade = true;
var accord_dynamic = 3; //The dynamic of the accordion animation. 1 = not dynamic, more = more dynamic
var accord_steps = 12;

/* Now some useful tools*/

pmde_isIE=false;
pmde_isIE=(navigator.appVersion.indexOf("MSIE")!=-1);

pmde_isSafari=false;
pmde_isSafari=(navigator.appVersion.indexOf("Safari")!=-1);

pmde_isGecko=false;
pmde_isGecko=(navigator.userAgent.indexOf("Gecko")!=-1);

pmde_isKonqui=false;
pmde_isKonqui=(navigator.appVersion.indexOf("Konqueror")!=-1);

pmde_isWin=false;
if(navigator.appVersion.indexOf("Windows")!=-1) pmde_isWin=true;
pmde_isMac=false;
if(navigator.appVersion.indexOf("Mac")!=-1) pmde_isMac=true;

pmde_isIElt7=false;
pmde_isIElt6=false;
pmde_isIElt5=false;
if(pmde_isIE) {
	if(navigator.appVersion.indexOf("MSIE 5")!=-1) { pmde_isIElt7=true; pmde_isIElt6=true; }
	else if(navigator.appVersion.indexOf("MSIE 6")!=-1) pmde_isIElt7=true;
	else if(navigator.appVersion.indexOf("MSIE 4")!=-1) { pmde_isIElt7=true; pmde_isIElt6=true; pmde_isIElt5=true; }
}
	
function pmde_addEvtHnd(obj, evt, funct) {
   if(pmde_isIE) {
      obj.attachEvent('on'+evt, funct);   
   } else {   
      obj.addEventListener(evt, funct, false);
   }
}
function pmde_remEvtHnd(obj, evt, funct) {
   if(pmde_isIE) {
      obj.detachEvent('on'+evt, funct);
   } else {   
      obj.removeEventListener(evt, funct, false);
   }
}
function pmde_prevDef(evt) {
   if(pmde_isIE) evt.returnValue=false; else evt.preventDefault();
}
function pmde_stopProp(evt) {
   if(pmde_isIE) evt.cancelBubble=true; else evt.stopPropagation();
}

function pmde_vwHei(elem) {
   if(pmde_isIE) {
      return elem.offsetHeight;
   } else {
      var he =getComputedStyle(elem, null).height;
      return parseInt(he.substring(0,he.length-2));
   }
}

function pmde_vwWid(elem) {
   if(pmde_isIE) {
      return elem.offsetWidth;
   } else {
      var wi =getComputedStyle(elem, null).width;
      return parseInt(wi.substring(0,wi.length-2));
   }
}

function pmde_absLeft(elem) {
	if (elem.offsetParent) {
      var obj=elem;
      var wsleft;
	   wsleft = obj.offsetLeft;
	   while (obj = obj.offsetParent) wsleft += obj.offsetLeft;
	   return wsleft;
   } else return 0;
}

function pmde_absTop(elem) {
	if (elem.offsetParent) {
      var obj=elem;
      var wstop;
	   wstop = obj.offsetTop
	   while (obj = obj.offsetParent) wstop += obj.offsetTop;
      return wstop;
   } else return 0;
}

function pmde_cliWid() {
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    return window.innerWidth;
  } else if( document.documentElement && document.documentElement.clientWidth ) {
    //IE 6+ in 'standards compliant mode'
    return document.documentElement.clientWidth;
  } else if( document.body && document.body.clientWidth ) {
    //IE 4 compatible
    return document.body.clientWidth;
  }
}

function pmde_cliHei() {
  if( typeof( window.innerHeight ) == 'number' ) {
    //Non-IE
    return window.innerHeight;
  } else if( document.documentElement && document.documentElement.clientHeight ) {
    //IE 6+ in 'standards compliant mode'
    return document.documentElement.clientHeight;
  } else if( document.body && document.body.clientHeight ) {
    //IE 4 compatible
    return document.body.clientHeight;
  }
}


/* Now the real accordion magic. Yeah! */

var accord_lastWid = 0;
var accord_sliderCount = 0;
var accord_sliderCurrPos;
var accord_sliderDestPos;
var accord_animationInterval = null;
var accord_sliders = new Array(0);
var accord_aniVal = new Array(accord_steps+1);
for(var i = 0; i<=accord_steps; i++) {
	var x = i/accord_steps;
	
	if(x<.5) {
		accord_aniVal[i]=.5*Math.pow(2*x,accord_dynamic);
	} else {
		accord_aniVal[i]=1-.5*Math.pow(2-2*x,accord_dynamic);
	}

}

function accord_step(firstCall) {
	var wid=pmde_cliWid();
	var changedSomething = false;
	if(wid!=accord_lastWid) {
		accord_lastWid = wid;
		changedSomething = true;
	}
	for(var i = 0; i<accord_sliderCount; i++) {
			if(accord_sliderCurrPos[i]<accord_sliderDestPos[i]) {
				accord_sliderCurrPos[i]+=1;
				changedSomething=true;
			} else if(accord_sliderCurrPos[i]>accord_sliderDestPos[i]) {
				accord_sliderCurrPos[i]-=1;
				changedSomething=true;
			}
	}
	if(changedSomething || firstCall) {
		for(var i = 0; i<accord_sliderCount; i++) {

			var prefHeight = pmde_vwHei(accord_sliders[i].childNodes[1].firstChild) - 1;
			var heightValue = accord_aniVal[accord_sliderCurrPos[i+1]]-accord_aniVal[accord_sliderCurrPos[i]];
			var useHeight=Math.ceil(prefHeight*accord_aniVal[accord_sliderCurrPos[i+1]])-Math.ceil(prefHeight*accord_aniVal[accord_sliderCurrPos[i]]) + 1;
			accord_sliders[i].childNodes[1].style.height=useHeight+"px";
			
			if(accord_fade) {
				var fadeVal = accord_aniVal[accord_sliderCurrPos[i+1]]-accord_aniVal[accord_sliderCurrPos[i]];
	   	   if(!pmde_isIE) {
		         accord_sliders[i].childNodes[1].style.opacity=fadeVal;
      		} else {
        			accord_sliders[i].childNodes[1].style.filter="alpha(opacity = " + Math.round((fadeVal)*100) + ");";
      		}
			}
		}
	}


}

function accord_loader(evt) {

	var allDivs = document.getElementsByTagName("div");
	accord_sliders = new Array();
	var j = 0;
   for(var i = 0; i<allDivs.length; i++) {
      if(allDivs[i].className=="accordionSlider") {
         accord_sliders[j++] = allDivs[i];
      }
   }	
	accord_sliderCount = accord_sliders.length;
	accord_sliderCurrPos = new Array(accord_sliderCount+1);
	accord_sliderDestPos = new Array(accord_sliderCount+1);
	for(var i = 0; i<accord_sliderCount; i++) {
		accord_sliderCurrPos[i] = accord_sliderDestPos[i] = (i==0?0:accord_steps);
		pmde_addEvtHnd(accord_sliders[i],"click",sliderHover);
	}
	accord_sliderCurrPos[accord_sliderCount] = accord_steps;	
	accord_sliderDestPos[accord_sliderCount] = accord_steps;	

//	for(var i = 0; i<accord_sliders.length; i++) {
//	}
	accord_step(true);
	accord_animationInterval = setInterval("accord_step(false);", 50);
}

function sliderHover(evt) {
	var selected = 0;
	var sender;
   if(pmde_isIE) sender = evt.srcElement; else sender = evt.target;
   while(sender.className != "accordionSlider") {
   	sender = sender.parentNode;
   }  
	for(var i = 0; i<accord_sliderCount; i++) {
		if(accord_sliders[i]==sender) {
			selected = i;
			break;
		}
	}
	for(var i=0; i<accord_sliderCount; i++) {
		if(i<=selected) accord_sliderDestPos[i]=0; else accord_sliderDestPos[i]=accord_steps;
	}
}

//spmde_addEvtHnd(document.body, "load", accord_loader);
