var MIN_RECTANGLE_SIZE=10,LEFT_MOUSE_BUTTON=0,GREEN="rgba(0,255,0,0.7)",YELLOW="rgba(255,255,0,0.7)",RED="rgba(255,0,0,0.7)",rectangleColor=GREEN,pauseRectangleColor=YELLOW,reconnectingRectangleColor=RED,RECTANGLE_ELEMENT_IDS=["screenleapShareRectangleTop","screenleapShareRectangleRight","screenleapShareRectangleBottom","screenleapShareRectangleLeft"],dispatch=new ScreenleapDispatch;function getScreenShareEndStateMessage(e){switch(e){case"EXCEEDED_TIME":return"You have reached the daily time limit for your account.";case"STALE":case"LOST_CONNECTION":return"We lost the connection to your computer. Please check your internet connection.";case"LOCKED":return"This screen share has already ended. Please start a new session.";case"CONFLICT":return"Your screen share has been ended because another screen share has been started from the same user account. Each account is only allowed to have one active screen share running at the same time.";case"FAILED_CONNECTION":return"An unexpected error occurred, and we were unable to make a connection with the servers. Please try again later or contact support for assistance.";case"WRONG_PRESENTER":return screenleap.redirectToViewer(),"";case"TIMEOUT":return"Your screen share has been running without any viewers for more than an hour so it has been ended.";case"SERVER_CLEANUP":return"The screen share has been ended by the server.";case"API_CALL":case"USER_ACTION":default:return""}}function getEvent(e){return e||window.event}function setElemDimensions(e,t,n,i,s){if(e){var r=e.style;void 0!==t&&(r.top=t+"px"),void 0!==n&&(r.left=n+"px"),void 0!==i&&(r.width=i+"px"),void 0!==s&&(r.height=s+"px")}}function getWindowWidth(){return document.body&&document.body.offsetWidth?document.body.offsetWidth:"CSS1Compat"==document.compatMode&&document.documentElement&&document.documentElement.offsetWidth?document.documentElement.offsetWidth:window.innerWidth}function getWindowHeight(){return document.body&&document.body.offsetHeight?document.body.offsetHeight:"CSS1Compat"==document.compatMode&&document.documentElement&&document.documentElement.offsetHeight?document.documentElement.offsetHeight:window.innerHeight}function getPageScrollWidth(){return document.documentElement&&document.documentElement.scrollWidth?document.documentElement.scrollWidth:document.body.scrollWidth}function getPageScrollHeight(){return document.documentElement&&document.documentElement.scrollHeight?document.documentElement.scrollHeight:document.body.scrollHeight}function isShowingDialog(){var e=document.getElementById("screenleapExtensionDialog");return null!==e&&"none"!==window.getComputedStyle(e).display}var screenleapDialog=null;function showScreenleapExtensionDialog(e,t,n,i,s){if(showShade(s),!screenleapDialog&&!(screenleapDialog=document.getElementById("screenleapExtensionDialog"))){var r=document.createElement("div");r.id="screenleapExtensionDialog",document.body.appendChild(r),screenleapDialog=r}screenleapDialog.className="screenleap-extension-dialog"+(i?" "+i:"");var o="<h2"+(t?' class="'+t+'"':"")+">"+e+"</h2><br>"+n+'<div class="screenleap-extension-dialog-button-row">';o+=s?'<button id="screenleapExtensionDialogConfirmLink" class="screenleap-flat-button screenleap-green">'+s.label+"</button>":'<button id="screenleapExtensionDialogConfirmLink" class="screenleap-flat-button screenleap-green">Close</button>',o+="</div>",screenleapDialog.innerHTML=o,document.getElementById("screenleapExtensionDialogConfirmLink").onclick=function(){s&&s.onClick&&s.click(),hideScreenleapExtensionDialog()},screenleapDialog.style.display=""}function showPromptDialog(e,t,n,i,s,r){if(!isShowingDialog()){if(showPromptShade(),!screenleapDialog&&!(screenleapDialog=document.getElementById("screenleapExtensionDialog"))){var o=document.createElement("div");o.id="screenleapExtensionDialog",document.body.appendChild(o),screenleapDialog=o}screenleapDialog.className="screenleap-extension-dialog"+(i?" "+i:"");var a="<h2"+(t?' class="'+t+'">':">")+e+"</h2><br>"+n+'<div class="screenleap-extension-dialog-button-row">';s&&(a+='<button id="screenleapExtensionDialogConfirmLink" class="screenleap-flat-button screenleap-green">'+s.label+"</button>"),s&&r&&(a+="&nbsp;&nbsp;&nbsp;"),r&&(a+='<button id="screenleapExtensionDialogCancelLink" class="screenleap-flat-button screenleap-green">'+r.label+"</button>"),a+="</div>",screenleapDialog.innerHTML=a,s&&(document.getElementById("screenleapExtensionDialogConfirmLink").onclick=function(){s.click&&s.click(),hideScreenleapExtensionDialog()}),r&&(document.getElementById("screenleapExtensionDialogCancelLink").onclick=function(){r.click&&r.click(),hideScreenleapExtensionDialog()}),screenleapDialog.style.display=""}}function hideScreenleapExtensionDialog(){screenleapDialog&&"none"!=screenleapDialog.style.display&&(screenleapDialog.style.display="none",screenleapDialog.innerHTML="",hideShade(),updateScreenleapExtensionProperty("dialog-confirmation",(new Date).getTime()))}function showShade(e){var t=document.getElementById("screenleapShade");t||((t=document.createElement("div")).id="screenleapShade",document.body.appendChild(t),e&&e.onClick?t.onclick=function(){hideScreenleapExtensionDialog(),e.click()}:t.onclick=hideScreenleapExtensionDialog),resizeClickableShade(),t.style.display="",document.addEventListener("resize",resizeClickableShade)}function showPromptShade(){var e=document.getElementById("screenleapPromptShade");e||((e=document.createElement("div")).id="screenleapPromptShade",e.onclick=function(){hideScreenleapExtensionDialog()},document.body.appendChild(e)),resizePromptShade(),e.style.display="",document.addEventListener("resize",resizePromptShade)}function resizeShade(e){var t=document.getElementById(e);if(t){var n=getWindowHeight(),i=getWindowWidth();t.style.minHeight=(document.documentElement.scrollHeight>n?document.documentElement.scrollHeight:n)+"px",t.style.minWidth=(document.documentElement.scrollWidth>i?document.documentElement.scrollWidth:i)+"px"}}function resizeClickableShade(){resizeShade("screenleapShade")}function resizePromptShade(){resizeShade("screenleapPromptShade")}function hideShade(){var e=document.getElementById("screenleapShade");e&&(e.style.display="none"),(e=document.getElementById("screenleapPromptShade"))&&(e.style.display="none"),document.removeEventListener("resize",resizeClickableShade),document.removeEventListener("resize",resizePromptShade)}var autoCapture=!0,mode=null,resizerDown=null,lastMouseMoveEvent=null;function startCrop(){overlay.startCrop(),document.addEventListener("keyup",screenCaptureListeners.cancelCropListener,!0)}function stopCrop(){overlay.stopCrop(),document.removeEventListener("keyup",screenCaptureListeners.cancelCropListener,!0),document.removeEventListener("keydown",screenCaptureListeners.moveRectangle,!0)}function cancelClippingRectangle(e){return e=getEvent(e),stopCrop(),e.preventDefault(),e.stopPropagation(),removeControlsAndRectangle(),!1}function removeControlsAndRectangle(){mode=null,overlay.remove(),overlay=null,rectangle=null}function sendCropRegion(){stopCrop();var e=rectangle.getDimensionsWithBorderWidth();return removeControlsAndRectangle(),setTimeout(function(){dispatch.trigger("captureRegion",{rectangle:e})},100),!1}function Controls(e){this.element=null,this.rectangle=e,this.locationY="s",this.locationX="e",this.initialize=function(){this.element||(this.element=document.createElement("div"),this.element.id="screenleapControls",this.element.innerHTML='<div class="screenleap-flat-button screenleap-green">Capture</div><div class="screenleap-flat-button screenleap-red">Cancel</div><div id="screenleapDimensions"></div>',this.element.children[0].onclick=sendCropRegion,this.element.children[1].onclick=cancelClippingRectangle)},this.setLocation=function(e,t){this.locationX=e>this.rectangle.x?"e":"w",this.locationY=t>this.rectangle.y?"s":"n"},this.reposition=function(){var e="n"==this.locationY,t=e&&parseInt(this.rectangle.element.style.top)<36||!e&&window.innerHeight-parseInt(this.rectangle.element.style.top)-parseInt(this.rectangle.element.style.height)<36,n="w"==this.locationX;this.element.className="controls-at-"+(t?"inside-":"")+(e?"top":"bottom")+"-"+(n?"left":"right")},this.show=function(){this.reposition(),this.element.style.display="block"},this.hide=function(){this.element.style.display="none"},this.remove=function(){this.rectangle.element.removeChild(this.element),this.rectangle=null,this.element=null},this.initialize()}function Rectangle(){this.element=null,this.controls=null,this.borderWidth=1,this.resizers=[],this.initialize=function(){if(this.controls=new Controls(this),!this.element){this.element=document.createElement("div"),this.element.id="screenleapRectangle",this.element.innerHTML='<div id="screenleapResizeTopLeft"></div><div id="screenleapResizeTop"></div><div id="screenleapResizeTopRight"></div><div id="screenleapResizeRight"></div><div id="screenleapResizeBottomRight"></div><div id="screenleapResizeBottom"></div><div id="screenleapResizeBottomLeft"></div><div id="screenleapResizeLeft"></div>';for(var e=0;e<this.element.children.length;e++)this.resizers.push(this.element.children[e]);this.element.appendChild(this.controls.element)}},this.startCrop=function(){this.element.style.cursor="crosshair",this.element.addEventListener("keyup",screenCaptureListeners.cancelCropListener,!0)},this.stopCrop=function(){this.element.style.cursor="default";var e=document.createEvent("MouseEvent");e.initMouseEvent("mouseup",!0,!0,window,0,this.element.offsetLeft,this.element.offsetTop,0,0,!1,!1,!1,!1,0,null),this.element.dispatchEvent(e),this.element.removeEventListener("keyup",screenCaptureListeners.cancelCropListener,!0)},this.dragStart=function(e,t){this.controls.hide(),this.x=e,this.y=t,setElemDimensions(this.element,t+document.body.scrollTop,e,0,0),this.element.style.cursor="crosshair",this.element.style.display="",this.overlay.overlayTop.style.display="",this.overlay.overlayRight.style.display="",this.overlay.overlayBottom.style.display="",this.overlay.overlayLeft.style.display="",this.hideResizers(),this.controls.hide()},this.showResizers=function(){for(var e=0;e<this.resizers.length;e++)this.resizers[e].style.display="block"},this.checkResizersHidden=function(){for(var e=!0,t=0;t<this.resizers.length;t++)if("none"!=this.resizers[t].style.display){e=!1;break}return e},this.moveResizer=function(e,t,n){var i=this.getDimensions();if(0!=n){var s=i.height;-1!=e.indexOf("Top")?i.y+n>0?((s-=n)<MIN_RECTANGLE_SIZE&&(s=MIN_RECTANGLE_SIZE),i.y+=i.height-s,i.height=s):(i.height+=i.y,i.y=0):-1!=e.indexOf("Bottom")&&((s+=n)<MIN_RECTANGLE_SIZE&&(s=MIN_RECTANGLE_SIZE),s+i.y>window.innerHeight?i.height=window.innerHeight-i.y:i.height=s)}var r=i.width;return-1!=e.indexOf("Right")?((r+=t)<MIN_RECTANGLE_SIZE&&(r=MIN_RECTANGLE_SIZE),r+i.x>window.innerWidth?i.width=window.innerWidth-i.x:i.width=r):-1!=e.indexOf("Left")&&(i.x+t>0?((r-=t)<MIN_RECTANGLE_SIZE&&(r=MIN_RECTANGLE_SIZE),i.x+=i.width-r,i.width=r):(i.width+=i.x,i.x=0)),i},this.hideResizers=function(){for(var e=0;e<this.resizers.length;e++)this.resizers[e].style.display="none"},this.getMiddleX=function(e){return e.x+e.width/2+4},this.getMiddleY=function(e){return e.y+e.height/2+4},this.draw=function(e){document.getElementById("screenleapDimensions").innerHTML=e.width+" X "+e.height,this.controls.reposition()},this.getDimensions=function(){var e={};if(this.element){var t=this.element.style;e.x=parseInt(t.left),e.y=parseInt(t.top),e.width=parseInt(t.width),e.height=parseInt(t.height)}return e},this.getDimensionsWithBorderWidth=function(){var e={};if(this.element){var t=this.element.style;e.x=parseInt(t.left)+this.borderWidth,e.y=parseInt(t.top)+this.borderWidth,e.width=parseInt(t.width),e.height=parseInt(t.height)}return e},this.checkX=function(e,t){return e<0?0:e+t>window.innerWidth?window.innerWidth-t-1:e},this.checkY=function(e,t){return e<0?0:e+t>=window.innerHeight?window.innerHeight-t-1:e},this.setDimensions=function(e,t){var n,i=0;e>this.x&&t>this.y?(n=2*this.borderWidth,i=2*this.borderWidth):e<this.x&&t<this.y?(n=2*-this.borderWidth,i=2*-this.borderWidth):e>this.x&&t<this.y?(n=2*this.borderWidth,i=2*-this.borderWidth):(n=2*-this.borderWidth,i=2*this.borderWidth),this.controls.setLocation(e,t),setElemDimensions(this.element,t<=this.y?t:this.y,e<=this.x?e:this.x,Math.abs(e-this.x-n),Math.abs(t-this.y-i))},this.hide=function(){this.hideResizers(),this.controls.hide(),this.element.style.display="none",this.overlay.overlayTop.style.display="none",this.overlay.overlayRight.style.display="none",this.overlay.overlayBottom.style.display="none",this.overlay.overlayLeft.style.display="none"},this.remove=function(){this.controls.remove(),this.controls=null,this.element.innerHTML="",this.overlay.element.removeChild(this.element),this.element=null,this.resizers=[]},this.isVisible=function(){return this.element.style.width},this.initialize()}function Overlay(e){this.element=null,this.rectangle=e,this.rectangle.overlay=this,this.overlayTop=null,this.overlayRight=null,this.overlayBottom=null,this.overlayLeft=null,this.initialize=function(){this.element=document.getElementById("screenleapOverlay"),this.element&&document.body.removeChild(this.element),this.element=document.createElement("div"),this.element.id="screenleapOverlay",this.element.innerHTML='<div id="screenOverlayTop"></div><div id="screenOverlayRight"></div><div id="screenOverlayBottom"></div><div id="screenOverlayLeft"></div>',this.element.appendChild(e.element),document.body.appendChild(this.element),this.overlayTop=document.getElementById("screenOverlayTop"),this.overlayRight=document.getElementById("screenOverlayRight"),this.overlayBottom=document.getElementById("screenOverlayBottom"),this.overlayLeft=document.getElementById("screenOverlayLeft")},this.onScroll=function(){var e=Math.max(window.innerHeight,getPageScrollHeight()),t=Math.max(window.innerWidth,getPageScrollWidth()),n=document.body.scrollTop+window.innerHeight<e?document.body.scrollTop:e-window.innerHeight,i=document.body.scrollLeft+window.innerWidth<t?document.body.scrollLeft:t-window.innerWidth;setElemDimensions(this.element,n,i,t-i,e-n)},this.draw=function(e){this.overlayTop.style.width=e.x+e.width+2+"px",this.overlayTop.style.height=e.y+"px",this.overlayRight.style.height=e.y+e.height+2+"px",this.overlayRight.style.left=e.x+e.width+2+"px",this.overlayBottom.style.top=e.y+e.height+2+"px",this.overlayBottom.style.left=e.x+"px",this.overlayLeft.style.top=e.y+"px",this.overlayLeft.style.width=e.x+"px",this.rectangle.draw(e)},this.dragStart=function(e,t){this.rectangle.dragStart(e,t),this.draw(this.rectangle.getDimensions())},this.startCrop=function(){this.element.style.display="",this.element.addEventListener("mousedown",screenCaptureListeners.mouseDown,!0),this.element.addEventListener("keyup",screenCaptureListeners.cancelCropListener,!0),window.addEventListener("resize",screenCaptureListeners.onResize,!0),this.rectangle.startCrop()},this.stopCrop=function(){this.rectangle.stopCrop(),this.element.removeEventListener("mousedown",screenCaptureListeners.mouseDown,!0),this.element.removeEventListener("keyup",screenCaptureListeners.cancelCropListener,!0),window.removeEventListener("resize",screenCaptureListeners.onResize,!0)},this.hide=function(){this.rectangle.hide(),this.element.style.display="none"},this.remove=function(){this.rectangle.remove(),this.rectangle=null,this.element.innerHTML="",document.body.removeChild(this.element),this.element=null},this.initialize()}var overlay,rectangle,screenCaptureListeners={addListenersOnMouseDown:function(){document.addEventListener("mousemove",screenCaptureListeners.mouseMove,!0),overlay.element.addEventListener("mousemove",screenCaptureListeners.mouseMove,!0),document.addEventListener("mouseup",screenCaptureListeners.mouseUp,!0)},removeListenersOnMouseUp:function(){document.removeEventListener("mousemove",screenCaptureListeners.mouseMove,!0),overlay.element.removeEventListener("mousemove",screenCaptureListeners.mouseMove,!0),document.removeEventListener("mouseup",screenCaptureListeners.mouseUp,!0)},mouseDown:function(e){(e=getEvent(e)).button==LEFT_MOUSE_BUTTON&&(e.target.className&&-1!=e.target.className.indexOf("screenleap-flat-button")||(e.preventDefault(),e.stopPropagation(),"crop"==mode?(rectangle.dragStart(e.clientX,e.clientY),mode="drag"):0==e.target.id.indexOf("screenleapResize")?(resizerDown=e.target,lastMouseMoveEvent=e,mode="resizerMove"):0==e.target.id.indexOf("screenleapRectangle")?(lastMouseMoveEvent=e,mode="rectangleMove"):(overlay.dragStart(e.clientX,e.clientY),mode="drag"),screenCaptureListeners.addListenersOnMouseDown()))},mouseMove:function(e){(e=getEvent(e)).preventDefault();var t=null;if("drag"==mode){mode="dragging";var n=e.clientX,i=e.clientY;n<0?n=0:n>window.innerWidth&&(n=window.innerWidth),i<0?i=0:i>window.innerHeight&&(i=window.innerHeight),rectangle.setDimensions(n,i),overlay.draw(rectangle.getDimensions()),mode="drag"}else"resizerMove"==mode?(mode="moving",t=rectangle.moveResizer(resizerDown.id,e.clientX-lastMouseMoveEvent.clientX,e.clientY-lastMouseMoveEvent.clientY),mode="resizerMove"):"rectangleMove"==mode&&(mode="moving",(t=rectangle.getDimensions()).x+=e.clientX-lastMouseMoveEvent.clientX,t.y+=e.clientY-lastMouseMoveEvent.clientY,t.x=rectangle.checkX(t.x,t.width),t.y=rectangle.checkY(t.y,t.height),mode="rectangleMove");t&&(lastMouseMoveEvent=e,setElemDimensions(rectangle.element,t.y,t.x,t.width,t.height),t=rectangle.getDimensions(),overlay.draw(t))},mouseUp:function(e){if(0==(e=getEvent(e)).button&&(e.preventDefault(),screenCaptureListeners.removeListenersOnMouseUp(),"drag"==mode)){var t=rectangle.getDimensions();t.width>MIN_RECTANGLE_SIZE&&t.height>MIN_RECTANGLE_SIZE?autoCapture?sendCropRegion():(rectangle.draw(t),rectangle.element.style.cursor="move",rectangle.showResizers(),rectangle.controls.show(),document.addEventListener("keydown",screenCaptureListeners.moveRectangle,!0)):(stopCrop(),removeControlsAndRectangle())}},cancelCropListener:function(e){27==(e=getEvent(e)).keyCode?(stopCrop(),removeControlsAndRectangle()):13==e.keyCode&&rectangle&&rectangle.isVisible()&&sendCropRegion()},moveRectangle:function(e){e=getEvent(e);var t=rectangle.getDimensions(),n=null,i=null;37==e.keyCode?n=t.x-1:38==e.keyCode?i=t.y-1:39==e.keyCode?n=t.x+1:40==e.keyCode&&(i=t.y+1),null==n&&null==i||(e.preventDefault(),e.stopPropagation(),n=rectangle.checkX(n,t.width),i=rectangle.checkY(i,t.height),(null!=n&&n!=t.x||null!=i&&i!=t.y)&&(setElemDimensions(rectangle.element,i,n,t.width,t.height),t=rectangle.getDimensions(),overlay.draw(t)))},onScroll:function(e){e=getEvent(e),overlay.onScroll(e)},onResize:function(){overlay&&(overlay.element.style.width=getWindowWidth()+"px",overlay.element.style.height=getWindowHeight()+"px")}};document.defaultView.top===document.defaultView&&0!=window.location.href.indexOf("chrome")&&(dispatch.on("startRegionCapture",function(e){mode="crop",autoCapture=e.autoCapture,rectangle||(rectangle=new Rectangle),overlay||(overlay=new Overlay(rectangle)),startCrop()}),dispatch.on("stopRegionCapture",function(){overlay&&(stopCrop(),removeControlsAndRectangle())}));var viewerMouseCursor=null,pageConfiguredForSharing=!1,screenShareListeners={activateWindow:function(e,t,n,i,s,r){(i||s||r)&&chat.refresh(i,s,r),!t||"sharing"!=t&&"paused"!=t||screenShareListeners.configurePageForSharing(t,n)},calculateIframeOffsets:function(e){for(var t=null,n=document.getElementsByTagName("iframe"),i=0;i<n.length;i++)if(n[i].origin==e){t=n[i];break}if(!t)return null;for(var s=0,r=0,o=t;o;)s+=o.offsetLeft,r+=o.offsetTop,o=o.offsetParent;var a=document.body.scrollTop||document.documentElement.scrollTop,c=document.body.scrollLeft||document.documentElement.scrollLeft;return c&&(s-=c),a&&(r-=a),{x:s,y:r}},iframeMessage:function(e){if(e.data.x){var t=e.data.x,n=e.data.y,i=screenShareListeners.calculateIframeOffsets(e.data.origin);i?(t+=i.x,n+=i.y):console.warn("could not get iframe offset for iframe with origin "+e.data.origin),dispatch.trigger("mousemove",{x:t,y:n,screenX:window.screenX,screenY:window.screenY,devicePixelRatio:window.devicePixelRatio})}},configurePageForSharing:function(e,t){screenShareListeners.updateSharingState(e,t),screenShareListeners.showViewerMouseCursor(),pageConfiguredForSharing||(window.addEventListener("mousemove",screenShareListeners.presenterMouseMove),window.addEventListener("message",screenShareListeners.iframeMessage),t||document.body.addEventListener("mouseleave",screenShareListeners.presenterMouseOut),updateScreenleapExtensionProperty("sharing",!0),pageConfiguredForSharing=!0)},updateSharingState:function(e,t){t||showScreenShareRectangle(e)},configurePageForNotSharing:function(){hideScreenShareRectangle(),pageConfiguredForSharing&&(window.removeEventListener("mousemove",screenShareListeners.presenterMouseMove),window.removeEventListener("message",screenShareListeners.iframeMessage),document.body.removeEventListener("mouseleave",screenShareListeners.presenterMouseOut),updateScreenleapExtensionProperty("sharing",!1),pageConfiguredForSharing=!1)},showViewerMouseCursor:function(){viewerMouseCursor&&(viewerMouseCursor.style.display="")},updateViewerMouseCursor:function(e,t){if((viewerMouseCursor=document.getElementById("screenleapSupportCursor"))||((viewerMouseCursor=document.createElement("div")).id="screenleapSupportCursor",document.body.appendChild(viewerMouseCursor)),e<0||t<0)viewerMouseCursor.style.display="none";else{var n=document.body.scrollTop||document.documentElement.scrollTop,i=document.body.scrollLeft||document.documentElement.scrollLeft;viewerMouseCursor.style.cssText="top:"+(screenShareListeners.checkWindowYBounds(parseInt(t),21)+n)+"px;left:"+(screenShareListeners.checkWindowXBounds(parseInt(e),15)+i)+"px"}},checkWindowXBounds:function(e,t){return e<0?0:e+t>window.innerWidth?window.innerWidth-t-1:e},checkWindowYBounds:function(e,t){return e<0?0:e+t>=window.innerHeight?window.innerHeight-t-1:e},hideViewerMouseCursor:function(){viewerMouseCursor&&(viewerMouseCursor.style.display="none")},formatScreenShareCode:function(e){for(var t="",n=0;n<e.length/3;n++)n>0&&(t+="   "),t+=e.substring(3*n,3*n+3);return t},presenterMouseMove:function(e){return(e=getEvent(e)).clientX>0&&e.clientY>0&&(console.log("mousemove: position = "+e.clientX+","+e.clientY),dispatch.trigger("mousemove",{x:e.clientX,y:e.clientY,screenX:window.screenX,screenY:window.screenY,devicePixelRatio:window.devicePixelRatio})),!0},presenterMouseOut:function(){return dispatch.trigger("mousemove",{x:-100,y:-100,mouseOut:!0}),!0},deactivateWindow:function(){hideScreenShareRectangle(),screenShareListeners.hideViewerMouseCursor()}},chat={chatWindow:null,chatIsVisible:!1,chatIsOpen:!1,chatConversation:"<div>&nbsp;</div>",createChatWindow:function(){var e=document.getElementById("screenleapChatBox");if(!e){(e=document.createElement("div")).id="screenleapChatBox",e.style.bottom="-500px",e.className="screenleap-hidden-window",e.innerHTML='<div id="screenleapChatBoxHeader">    <a id="screenleapCollapse">&#9660;</a>    <a id="screenleapExpand">&#9650;</a></div><div id="screenleapChatConversation"></div><textarea id="screenleapChatMessage"></textarea>',document.body.appendChild(e),e.style.bottom="-"+(e.offsetHeight-16)+"px";var t=this;document.getElementById("screenleapCollapse").addEventListener("click",function(){chat.hideChatWindow(),chat.saveChatProperties()}),document.getElementById("screenleapExpand").addEventListener("click",function(){chat.showChatWindow(),chat.saveChatProperties()}),document.getElementById("screenleapChatMessage").addEventListener("keyup",function(e){if(13==e.keyCode&&e.target.value){var n=e.target.value;(n=n.replace(/[\n\r]/g,""))?(dispatch.trigger("sendChatMessage",{message:n}),t.addToConversation("<b>you:</b> "+n),e.target.value=""):e.target.value=""}})}this.chatWindow=e},showChatWindow:function(){return this.chatWindow||this.createChatWindow(),this.chatWindow.className="screenleap-visible-window",this.chatIsVisible=!0,this.chatIsOpen=!0,!1},hideChatWindow:function(){return this.chatWindow&&(this.chatWindow.className="screenleap-hidden-window",this.chatIsOpen=!1),!1},setConversation:function(e){this.setOrAppendToConversation(e,!1)},addToConversation:function(e){this.setOrAppendToConversation(e,!0)},setOrAppendToConversation:function(e,t){if(e){var n=document.getElementById("screenleapChatConversation");n||(this.createChatWindow(),n=document.getElementById("screenleapChatConversation")),this.isUpdating||(this.isUpdating=!0,this.chatConversation=t?this.chatConversation+"<div>"+e+"</div>":e,n.innerHTML=this.chatConversation,n.scrollTop=n.scrollHeight,this.saveChatProperties(),this.isUpdating=!1)}},isOpen:function(){return!!this.chatWindow&&(!!this.chatWindow&&"screenleap-visible-window"==this.chatWindow.className)},refresh:function(e,t,n){this.chatWindow||this.createChatWindow(),this.chatIsVisible=e,this.chatIsOpen=t,this.chatConversation=n,this.setConversation(n),this.chatIsOpen?this.showChatWindow():this.hideChatWindow()},saveChatProperties:function(){dispatch.trigger("chatUpdate",{chatIsVisible:this.chatIsVisible,chatIsOpen:this.chatIsOpen,chatConversation:this.chatConversation})},clear:function(){this.chatIsVisible=!1,this.chatIsOpen=!1,this.chatConversation="<div>&nbsp;</div>";var e=document.getElementById("screenleapChatBox");e&&e.parentNode.removeChild(e),this.chatWindow=null}};function showScreenShareRectangle(e){var t=document.getElementById("screenleapShareRectangleTop");t||((t=document.createElement("div")).id="screenleapShareRectangleTop",document.body.appendChild(t)),t.style.display="block";var n=document.getElementById("screenleapShareRectangleRight");n||((n=document.createElement("div")).id="screenleapShareRectangleRight",document.body.appendChild(n)),n.style.display="block";var i=document.getElementById("screenleapShareRectangleBottom");i||((i=document.createElement("div")).id="screenleapShareRectangleBottom",document.body.appendChild(i)),i.style.display="block";var s=document.getElementById("screenleapShareRectangleLeft");s||((s=document.createElement("div")).id="screenleapShareRectangleLeft",document.body.appendChild(s)),s.style.display="block",updateRectangleColor("reconnecting"==e?reconnectingRectangleColor:"paused"==e?pauseRectangleColor:rectangleColor)}function updateRectangleColor(e){for(var t=0;t<RECTANGLE_ELEMENT_IDS.length;t++)document.getElementById(RECTANGLE_ELEMENT_IDS[t])&&(document.getElementById(RECTANGLE_ELEMENT_IDS[t]).style.backgroundColor=e)}function hideScreenShareRectangle(){for(var e=0;e<RECTANGLE_ELEMENT_IDS.length;e++)document.getElementById(RECTANGLE_ELEMENT_IDS[e])&&(document.getElementById(RECTANGLE_ELEMENT_IDS[e]).style.display="none");chat.hideChatWindow(!0)}function sendMessageToWebPage(e,t){var n=document.getElementById("screenleapDiv");if(n){t||(t={}),t.event=e;var i=document.createEvent("CustomEvent");i.initCustomEvent("screenleapExtensionEvent",!0,!0,t),n.dispatchEvent(i)}}var screenleapVideoElem=null,screenleapVideoCanvasElem=null;if(document.defaultView.top===document.defaultView&&0!=window.location.href.indexOf("chrome")){dispatch.on("checkIsAuthenticatedResult",function(e){sendMessageToWebPage("checkIsAuthenticatedResult",e)}),dispatch.on("signinSuccessful",function(e){sendMessageToWebPage("signinSuccessful",e)}),dispatch.on("showError",function(e){showScreenleapExtensionDialog(e.title,void 0!==e.titleCssClass?e.titleCssClass:"screenleap-red",e.body,void 0!==e.bodyCssClass?e.bodyCssClass:null),dispatch.trigger("closePopup",{sharingState:"none"})}),dispatch.on("showSignInSuccessfulDialog",function(){var e={label:"Close",click:function(){}};showPromptDialog("Sign-In Successful","screenleap-green","You have successfully signed in to your Screenleap account.<br><br>You can start sharing your screen by clicking on the Screenleap icon and selecting a sharing method.",null,e,null)}),dispatch.on("startScreenShareUpdateUI",function(e){screenShareListeners.configurePageForSharing("sharing",e.captureEntireScreen)}),dispatch.on("clearChat",function(){chat.clear()}),dispatch.on("showLockedTab",function(){showScreenShareRectangle("tab-locked")}),dispatch.on("clearLockedTab",function(){console.log("clear locked tab triggered"),hideScreenShareRectangle()}),dispatch.on("takeDesktopCapture",function(e){var t=screenleapVideoElem;t.width!=window.screen.width&&(t.width=window.screen.width),t.height!=window.screen.height&&(t.height=window.screen.height);var n=screenleapVideoCanvasElem;n.width!=window.screen.width&&(n.width=window.screen.width),n.height!=window.screen.height&&(n.height=window.screen.height),n.getContext("2d").drawImage(t,0,0,t.width,t.height);var i=n.toDataURL("image/png");dispatch.trigger("takeDesktopCaptureData",{intervalCounter:e.intervalCounter,dataUrl:i})}),dispatch.on("startScreenShareSuccessful",function(e){sendMessageToWebPage("screenShareStarted",e)}),dispatch.on("showSharingInstructions",function(e){var t,n=screenShareListeners.formatScreenShareCode(e.screenShareCode),i=null!=e.handle;t='<p class="screenleap-share-dialog-label">Send your viewers this link:</p><p><input id="screenleapScreenShareUrl" type="text" readonly="readonly" value="'+e.viewerUrl+'"/>&nbsp;&nbsp;<span style="position:relative"><button id="screenleapScreenShareUrlCopyButton" class="primary primary-gray" style="width:93px">Copy</button><span id="screenleapScreenShareUrlCopiedMessage" style="display:none">(copied to clipboard)</span></span></p>',i||(t+='<p class="screenleap-share-dialog-or-label">OR</p><p class="screenleap-share-dialog-label">Tell them to go to <b>'+e.webServerHostname+'</b> and enter:</p><p><input id="screenleapScreenShareCode" type="text" readonly="readonly" value="'+n+'"/>&nbsp;&nbsp;<span style="position:relative"><button id="screenleapScreenShareCodeCopyButton" class="primary primary-gray" style="width:93px">Copy</button><span id="screenleapScreenShareCodeCopiedMessage" style="display:none">(copied to clipboard)</span></span></p><br>'),e.activeViewers&&(t+='<p class="screenleap-share-dialog-label">Number of viewers is '+e.activeViewers+".</p>");var s={label:"Hide instructions"};showScreenleapExtensionDialog("Your browser window is being shared","screenleap-green",t,null,s);{function r(){return document.getElementById("screenleapScreenShareUrlCopiedMessage").style.display="block",dispatch.trigger("processMessage",{message:"cl"}),setTimeout(function(){document.getElementById("screenleapScreenShareUrlCopiedMessage").style.display="none"},3e3),!0}function o(){return document.getElementById("screenleapScreenShareCodeCopiedMessage").style.display="block",dispatch.trigger("processMessage",{message:"cs"}),setTimeout(function(){document.getElementById("screenleapScreenShareCodeCopiedMessage").style.display="none"},3e3),!0}document.getElementById("screenleapScreenShareUrl").onclick=r,document.getElementById("screenleapScreenShareUrlCopyButton").onclick=r,i||(document.getElementById("screenleapScreenShareCode").onclick=o,document.getElementById("screenleapScreenShareCodeCopyButton").onclick=o)}}),dispatch.on("startScreenShareUnsuccessful",function(e){sendMessageToWebPage("screenShareStartFailed",e)}),dispatch.on("showShareFailed",function(e){showScreenleapExtensionDialog("Unable to share your browser window","screenleap-red",e&&401==e.status?"<p>You have been signed out of your session.  Please sign in again to start sharing your screen.</p>":e&&403==e.status?'<p>We could not find your Screenleap account. If you don\'t have one, please go to <a href="https://www.screenleap.com/pricing" target="_blank">http://www.screenleap.com</a> and create an account and then try again.</p>':404==e.status?"<p>The share code you entered is not valid.</p>":409==e.status?"<p>Your screen is already being shared.</p>":410==e.status?"<p>The share code you entered has already expired or the screen share has ended.</p>":e&&5!=parseInt(e.status/100)&&e.responseText?"<p>"+e.responseText.replace("<h1>","").replace("</h1>","")+"</p>":"<p>The Screenleap service is currently unavailable. Please try again in a few minutes.</p><br><p>If the problem persists, please contact us for support at support@screenleap.com.</p>")}),dispatch.on("sendWebPageMessage",function(e){sendMessageToWebPage("webPageMessage",e)}),dispatch.on("hideDialog",function(){hideScreenleapExtensionDialog()}),dispatch.on("showScreenSwapDialog",function(){var e={label:"View other person's screen",click:function(){dispatch.trigger("confirmScreenSwap")}},t={label:"Continue sharing your screen",click:function(){dispatch.trigger("denyScreenSwap")}};showPromptDialog("Change Presenter Request","screenleap-green","One of your viewers wants to share his screen with you.  Allow?",null,e,t)}),dispatch.on("showNoViewersDialog",function(){var e={label:"Continue sharing",click:function(){dispatch.trigger("continueSharing")}},t={label:"Stop sharing",click:function(){dispatch.trigger("stopSharing")}};showPromptDialog("Idle Screen Share","screenleap-green","You have had no viewers for 15 minutes. Continue sharing?",null,e,t)}),dispatch.on("showLongPauseDialog",function(){var e={label:"Continue pausing",click:function(){dispatch.trigger("continueSharing")}},t={label:"Stop sharing",click:function(){dispatch.trigger("stopSharing")}};showPromptDialog("Confirm","screenleap-green","Screen has been paused for 60 minutes. Continue pausing?",null,e,t)}),dispatch.on("showDisconnectDialog",function(){var e={label:"Continue sharing",click:function(){dispatch.trigger("continueSharing")}},t={label:"Stop sharing",click:function(){dispatch.trigger("stopSharing")}};showPromptDialog("Idle Screen Share","screenleap-green","All of your viewers have disconnected. Continue sharing your screen?",null,e,t)}),dispatch.on("showDailyTimeLimitFreebieDialog",function(e){var t={label:"Continue sharing",click:function(){dispatch.trigger("continueSharingWithFreebie")}},n={label:"Stop sharing",click:function(){dispatch.trigger("stopSharing")}};showPromptDialog("Daily Time Limit Reached","screenleap-red",e.message,null,t,n)}),dispatch.on("showDailyTimeLimitDialog",function(e){var t={label:"Continue sharing",click:function(){dispatch.trigger("continueSharing")}},n={label:"Stop sharing",click:function(){dispatch.trigger("stopSharing")}};showPromptDialog("Daily Time Limit Reached","screenleap-red",e.message,null,t,n)}),dispatch.on("updateViewerMouseCursor",function(e){screenShareListeners.updateViewerMouseCursor(e.x,e.y)}),dispatch.on("pauseScreenShare",function(e){screenShareListeners.updateSharingState("paused",e.captureEntireScreen)}),dispatch.on("unpauseScreenShare",function(e){screenShareListeners.updateSharingState("sharing",e.captureEntireScreen)}),dispatch.on("updateSharingState",function(e){screenShareListeners.updateSharingState(e.sharingState,e.captureEntireScreen)}),dispatch.on("deactivateWindow",function(){screenShareListeners.deactivateWindow()}),dispatch.on("stopScreenShare",function(e){chat.clear(),screenShareListeners.deactivateWindow(),hideScreenleapExtensionDialog(),screenShareListeners.configurePageForNotSharing(),sendMessageToWebPage("screenShareStopped",e),rectangleColor=GREEN,pauseRectangleColor=YELLOW,screenleapVideoElem&&(document.body.removeChild(screenleapVideoElem),screenleapVideoElem=null),screenleapVideoCanvasElem&&(document.body.removeChild(screenleapVideoCanvasElem),screenleapVideoCanvasElem=null),sendMessageToWebPage("onScreenShareEnd")}),dispatch.on("viewerConnected",function(e){sendMessageToWebPage("viewerConnected",e)}),dispatch.on("viewerDisconnected",function(e){sendMessageToWebPage("viewerDisconnected",e)}),dispatch.on("receiveMessage",function(e){chat.isOpen()||chat.showChatWindow(),chat.addToConversation(e.message)}),dispatch.on("disableUnload",function(){var e=document.getElementById("screenleapDiv");if(e){var t=document.getElementById("disableUnload");t||((t=document.createElement("div")).setAttribute("id","disableUnload"),t.setAttribute("style","display:none"),e.appendChild(t))}}),onloadSetup(),dispatch.on("activateWindow",function(e){screenShareListeners.activateWindow(e.windowId,e.sharingState,e.captureEntireScreen,e.chatIsVisible,e.chatIsOpen,e.chatConversation)});var parts=window.location.href.split("slIntegrationTest=");2==parts.length&&setTimeout(function(){dispatch.trigger("startIntegrationTest",{port:parts[1]})},1e3)}function onloadSetup(){if("topsites://"!=window.location.href&&window.top===window.self){dispatch.trigger("initOnLoad");var e=document.getElementById("screenleapDiv");e||((e=document.createElement("div")).id="screenleapDiv",e.setAttribute("style","position:fixed;right:1px;bottom:1px;visibility:hidden;width:1px;height:1px"),document.body.appendChild(e)),e&&(e.setAttribute("installed","true"),e.setAttribute("sharing","false"),e.addEventListener("screenleapTrigger",function(e){var t=e.detail;if(t){var n=t.action,i=t.screenShareCode;switch(n){case"checkIsAuthenticated":dispatch.trigger("checkIsAuthenticated");break;case"authenticate":dispatch.trigger("authenticate",{emailAddress:t.emailAddress,password:t.password});break;case"share":if(i=i.replace(/\s+/g,"")){chat.clear(),t.rectangleColor&&(rectangleColor="rgba("+parseInt(t.rectangleColor.substr(2,2),16)+","+parseInt(t.rectangleColor.substr(4,2),16)+","+parseInt(t.rectangleColor.substr(6,2),16)+","+parseInt(t.rectangleColor.substr(0,2),16)/255+")",pauseRectangleColor=rectangleColor);var s={screenShareCode:i,origin:t.origin,accountId:t.accountId,isCaptureEntireScreen:void 0===t.isCaptureEntireScreen||t.isCaptureEntireScreen};"PRESENTER_SWAP"==t.origin&&(s.viewerId=t.viewerId,s.ctrlHost=t.ctrlHost),void 0!==t.presenterParams&&(s.presenterParams=t.presenterParams),void 0!==t.disableShareInstructions&&(s.disableShareInstructions=t.disableShareInstructions),dispatch.trigger("startScreenShareWithData",s)}break;case"newShare":void 0===t.isCaptureEntireScreen&&(t.isCaptureEntireScreen=!0),dispatch.trigger("startNewShare",t);break;case"newBroadcast":void 0===t.isCaptureEntireScreen&&(t.isCaptureEntireScreen=!0),dispatch.trigger("startNewBroadcast",t);break;case"copyToClipboard":dispatch.trigger("copyToClipboard",{text:t.text});break;case"sendMessageFromWebPage":dispatch.trigger("processMessage",{message:t.message});break;case"startRecording":dispatch.trigger("startRecording");break;case"stopRecording":dispatch.trigger("stopRecording");break;case"stop":dispatch.trigger("stopSharing")}}}),e.setAttribute("eventListenerAdded","true"),e.screenleapEvent&&(e.dispatchEvent(e.screenleapEvent),delete e.screenleapEvent))}}function updateScreenleapExtensionProperty(e,t){var n=document.getElementById("screenleapDiv");n&&n.setAttribute(e,t)}chrome.runtime.onMessage.addListener(function(e,t,n){"hello"==e.greeting&&n({message:"hi"})});