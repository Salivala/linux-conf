var domain = "https://button.copymethat.com";

var ext_number = 11;

var css = '.copy_me_that_outer div, .copy_me_that_outer span, .copy_me_that_outer a, .copy_me_that_outer a:visited, .copy_me_that_outer a:link, .copy_me_that_outer a:hover{background-image:none;background-color:white;border:none;box-shadow:none;box-sizing: content-box;clear:none;color:black;cursor:auto;direction:ltr;display:block;float:none;font-family:arial;font-size:15px;font-style:normal;font-variant: normal;font-weight: normal;letter-spacing: normal;line-height: normal;margin:0;max-width: none;opacity: 1;padding:0;position: relative;text-align: start;text-anchor: start;text-decoration: none;text-indent: 0px;text-overflow: clip;text-rendering: auto;text-shadow: none;text-transform: none;top: 0px;vertical-align: baseline;visibility: visible;white-space: normal;word-spacing: 0px;word-wrap: normal;}\
.copy_me_that_outer span, .copy_me_that_outer a, .copy_me_that_outer a:visited,  .copy_me_that_outer a:link, .copy_me_that_outer a:hover{display:inline;} \
#copy_me_that_container{width:169px;background:white;border:solid #9b2840 3px; \
box-shadow: 0 0 0 2px  white; position:fixed;z-index:3000000000;top:7px;right:7px;padding-bottom:0px;} #copy_me_that_spinner{background:white; background-image:url("https://copymethat.blob.core.windows.net/static/spinner_25.gif");height:25px;width:25px;margin-left:auto;margin-right:auto; margin-top:4px;/*preloaders.net/*/} #copy_me_that_title{background:#9b2840;border:solid white 1px;height:26px;color:white;font-size:18px;font-family:arial;text-align:center;line-height:26px;} #copy_me_that_msg{font-size:17px;padding-right:5px;padding-left:5px;text-align:center;font-family:arial;margin-top:5px;} #copy_me_that_recipe_link, #copy_me_that_home_link, #copy_me_that_orig_src_link, #copy_me_that_cookie_link{text-decoration:underline !important;color:#0000D4 !important;font-size:17px !important;text-align:center !important;font-family:arial !important; cursor:pointer !important;}  #copy_me_that_highlight{color:blue; font-size:17px;font-family:arial;font-weight:bold;} #copy_me_that_remove_x{float:right;width:22px;font-size:12px;text-align:right;line-height:11px;padding-right:2px;padding-bottom:0px;cursor:pointer;margin-top:-8px;color:#9b2840}';

var html_container = '<div id = "copy_me_that_container" onclick="var e = arguments[0] || window.event;e.stopPropagation();"> <div id = "copy_me_that_title">Copy Me That</div> <div id = "copy_me_that_msg">&nbsp;</div><div id = "copy_me_that_remove_x">x</div></div>'

var html_error = 'We\'re sorry. <br/> An error occured.'; // bookmarklet
var html_waiting = '<div id = "copy_me_that_spinner"></div>';
var html_selection_error = 'You have highlighted too much text. Either highlight no text or highlight an <b>ingredient word </b>from the recipe that you want to copy.';
var html_no_connection = 'It seems that you are not connected to the internet.<br/> Please connect and then try again. <br/> <br/>  <a href = "https://www.copymethat.com/button_connect_info/?c=1" id = "copy_me_that_recipe_link" target = "_blank">But I am connected!</a><br/><br/>';
var html_facebook_selection_error = 'When copying from Facebook, please highlight an <b>ingredient word</b> from the recipe that you wish to copy,<br/> and then click <br/>the button.';
var html_reddit_selection_error = 'When copying from reddit, please highlight an <b>ingredient word</b> from the recipe that you wish to copy,<br/> and then click <br/>the button.';
var html_facebook_weird_selection_error = 'We are sorry, an error occurred. If you haven\'t already done so, please highlight an <b>ingredient word</b> from the recipe that you wish to copy. This is necessary when copying from Facebook.';
var html_reddit_weird_selection_error = 'We are sorry, an error occurred. If you haven\'t already done so, please highlight an <b>ingredient word</b> from the recipe that you wish to copy. This is necessary when copying from reddit.';

function handle_img(element){
    computedStyle =  window.getComputedStyle(element);
    width = computedStyle.getPropertyValue("width").replace("px","");
    height = computedStyle.getPropertyValue("height").replace("px","");
    
    try{
        natural_height = element.naturalHeight;
        natural_width = element.naturalWidth;
    } catch(e){
        natural_height = 0; // browser does not have naturalHeight. Will also be 0 if not loaded
        natural_width = 0;
    }

    if (height >= 100 && width >= 100 && (natural_height == 0 || natural_height > 100) && (natural_width == 0 || natural_width > 100) ){
        var rect = element.getBoundingClientRect();
        img_position = Math.round(rect.top) +","+Math.round(rect.left); 

        l_type = 0;
        if (element.parentNode.hasAttribute("href") && element.parentNode.nodeName == "A" ){
            phref = element.parentNode.href.toLowerCase();
            if(phref.indexOf("http") == 0 && phref.indexOf(".jpg") == -1 && phref.indexOf(".jpeg") == -1 && phref.indexOf(".gif") == -1 && phref.indexOf(".png") == -1 && phref.indexOf(".tif") == -1 && phref.indexOf("pinterest") == -1 && phref.indexOf("smugmug") == -1 && phref.indexOf("picasa") == -1 && phref.indexOf("flickr") == -1 && phref.indexOf("video") == -1 && element.src != phref ){
                if ( element.parentNode.hostname != url_hostname){l_type = 1;}
                else if (phref == url){l_type = 3;}            
                else {l_type = 2;}
            } 
        } 
        else if (element.parentNode.parentNode.hasAttribute("href") && element.parentNode.parentNode.nodeName == "A" ){
            phref = element.parentNode.parentNode.href.toLowerCase();
             if(phref.indexOf("http") == 0 && phref.indexOf(".jpg") == -1 && phref.indexOf(".jpeg") == -1 && phref.indexOf(".gif") == -1 && phref.indexOf(".png") == -1 && phref.indexOf(".tif") == -1 && phref.indexOf("pinterest") == -1 && phref.indexOf("smugmug") == -1 && phref.indexOf("picasa") == -1 && phref.indexOf("flickr") == -1 && phref.indexOf("video") == -1 && element.src != phref ){
                if ( element.parentNode.parentNode.hostname != url_hostname){ l_type = 1;} 
                else if (phref == url){l_type = 3;}   
                else{l_type = 2;}
            }
        }
        
        src = element.src;
        
        if( window.HTMLPictureElement && element.complete){
            try{
                src = element.currentSrc; // picture elements. But don't wait if not loaded
            } catch(e){
            }
        } 
        if (src == ""){
           try{
                 srcset = element.srcset;
                 if (srcset.indexOf(",") == -1){ 
                    e = srcset.length;
                 }else{ 
                    e = srcset.indexOf(",");
                }
                src = srcset.slice(0, e);
            } catch(err){ // was causing errors in ie
            }
        } 
        
        if (src.indexOf("http") == 0){
            img_list.push({"src":src,"h":Math.round(height),"w":Math.round(width),"p":img_position,"l":l_type});
            return img_list.length -1
        } else{return -1;}
    }
    return -1;
}

function handle_img_as_background(element, computedStyle){
    b_img = element.style.backgroundImage; // want inline only
    
    if (b_img == "" ){return; }
    
    width = computedStyle.getPropertyValue("width").replace("px","");
    height = computedStyle.getPropertyValue("height").replace("px","");
    if (height >= 100 && width >= 100){
        var rect = element.getBoundingClientRect();
        img_position = Math.round(rect.top) +","+Math.round(rect.left); 
        s = b_img.indexOf("url");
        src = b_img.slice(s+4, b_img.slice(s).indexOf(")")+s).replace(/"/g, ''); //ff includes the parentheses
        if (src.indexOf("http") == 0){
            img_list.push({"src":src,"h":Math.round(height),"w":Math.round(width),"p":img_position, "b":1});
        }
    }
}

function get_if_text_img(element){
    computedStyle =  window.getComputedStyle(element);
    width = computedStyle.getPropertyValue("width").replace("px","");
    height = computedStyle.getPropertyValue("height").replace("px","");
    
    if (height < 26 && height > 14 && width < 26 && width > 14){
        alt_text = element.alt;
        lower_alt_text = alt_text.toLowerCase();
        text_to_use = "";
        
        if (lower_alt_text.indexOf("teigstufe") != -1 || lower_alt_text.indexOf("knead") != -1 || lower_alt_text.indexOf("kneading") != -1 || lower_alt_text.indexOf("dough mode") != -1){
            text_to_use = "dough mode";
        }else if (lower_alt_text.indexOf("soft spoon") != -1 || lower_alt_text.indexOf("butterfly") != -1 || lower_alt_text.indexOf("gentle stir") != -1){
            text_to_use = "gentle stir";
        } else if (lower_alt_text.indexOf("counter-clockwise") != -1 || lower_alt_text.indexOf("reverse") != -1){
            text_to_use = "reverse";
        }else if (lower_alt_text.indexOf("closed lid") != -1 || lower_alt_text.indexOf("open lid") != -1 || lower_alt_text.indexOf("no counter-clockwise") != -1){
            text_to_use = lower_alt_text;
        }
        
        if ( text_to_use !=  ""){
            img_text_equivalent = "[" + text_to_use + "]";
            return img_text_equivalent;
        }          
    }
    return "";
}

function getAttributes(element){
attributes = {};
for (var i = 0; i < element.attributes.length; i++) {
  var attrib = element.attributes[i];
  if (attrib.specified == true) {
    if (attrib.name == "class"){
        if (attrib.value == "quantity"){
             attributes[attrib.name] = attrib.value;
        } 
        else if(attrib.value.indexOf("promotionDiv") != -1 || attrib.value.indexOf("swoop-container") != -1){
            attributes[attrib.name] = "promo";
        } 
    }
    else if (attrib.name =="href"){
        if ( attrib.value.charAt(0) != "#" ){
            attributes[attrib.name] = "x";
        }
    }
    if (attrib.name == "src" && element.nodeName == "IFRAME" ){
        attributes[attrib.name] = element.src.substring(0,35);
    }
  }
} 
return attributes;
}

function getStyles(element){ // also handles image as background
    styles = [];  
    var computedStyle =  window.getComputedStyle(element);
    style_list = [["text-align","start"], ["font-size","0px"], 
                   ["width","auto"], ["height","auto"], ["display","block"],["list-style-type","none"], ["float","none"], ["color", "rgb(0, 0, 0)"], ["overflow-x","visible"],["overflow-y","visible"],["font-weight","normal"], ["font-style","normal"], ["position","static"], ["text-transform","none"],
                   ["margin-top","0px"],["margin-right","0px"],["margin-bottom","0px"],["margin-left","0px"],
                   ["padding-top","0px"],["padding-right","0px"],["padding-bottom","0px"],["padding-left","0px"], 
                   ["clear","none"],["text-decoration","none"], ["background-color","rgba(0, 0, 0, 0)"], 
                   ["border-bottom-style","none"], ["border-top-style","none"], ["border-left-style","none"], ["border-right-style","none"]
                   ,["white-space","normal"], ["text-indent", "0px"]
                   ]; 
                   
    if(computedStyle.getPropertyValue("background-image") != "none"  ){
        handle_img_as_background(element, computedStyle);
    }
    
    for(var i=0; i<style_list.length; i++){
          c_key = style_list[i][0];
          c_style = computedStyle.getPropertyValue(style_list[i][0]);
          
          if (element.nodeName == "HTML" && c_key == "height"){ // set html height to document height
            var body = document.body, html = document.documentElement;
            x = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
            c_style = x.toString();
          }
          if (element.nodeName == "HTML" && c_key == "width"){ // set html width to document width
            var body = document.body, html = document.documentElement;
            x = Math.max( body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth );
            c_style = x.toString();
          }
          if(c_key == "overflow-y" && c_style == "hidden" && (element.className.indexOf("jspContainer") != -1 )){
              c_style = "jspscrollable";
          }
          if((c_key == "height" || c_key == "width") && c_style == "auto"){
               try{
                    rect = element.getBoundingClientRect();
                    padding_top = computedStyle.getPropertyValue("padding-top");
                    padding_bottom = computedStyle.getPropertyValue("padding-bottom");
                    x = Math.round(rect.bottom) - Math.round(rect.top) - parseFloat(padding_top.replace("px", "")) - parseFloat(padding_bottom.replace("px", ""));
                    c_style = x.toString();
                  }catch(e){}
          }

           if(c_key == "text-decoration" && c_style != style_list[i][1]){ // because sometimes will be like "none solid red"
                if(c_style.indexOf("none") != -1){styles.push(0);}
                else{styles.push(c_style);}
           }
          else if (c_style != style_list[i][1]  && (c_style != "transparent" || c_key != "background-color")  ){ // chrome has different default than ie/firefox
                  c_style = c_style.replace("px", "");
                  if(! isNaN(c_style)){
                    c_style = parseInt(c_style);
                  }
                  styles.push(c_style);
               }
               else{
                  styles.push(0);
               }
     }

     if (element.nodeName == "LI"){
        if (computedStyle.getPropertyValue("list-style-image") != "none"){
            styles.push("true");
        } else{styles.push(0);}
        if (computedStyle.getPropertyValue("background-image") != "none" && computedStyle.getPropertyValue("background-repeat") == "no-repeat" ){
            styles.push("true");
        }else{styles.push(0);}
     }
     else{styles.push(0);styles.push(0);}

    var split_i = styles.length;
    for (var i = styles.length-1; i >= 0; i--) {
        if (styles[i] == 0) {split_i = i}    
         else{break;}
     }
    
    styles = styles.splice(0,split_i);
    return styles;
}

var hid_comments = false;
var comments_ele;
function hide_known_comments(){
    var comments_found = false;
    var found_comments_ele = document.getElementsByClassName("commentlist");
    if (found_comments_ele.length>0){
        found_comments_ele = found_comments_ele[0];
        comments_found = true;
    } else{
        var found_comments_ele = document.getElementsByClassName("comment-list");
        if (found_comments_ele.length>0){
            found_comments_ele = found_comments_ele[0];
            comments_found = true;
        } else{
            var found_comments_ele = document.getElementById("comments");
            if (found_comments_ele){
                comments_found = true;
            } else{
                var found_comments_ele = document.getElementById("CurrentComments");
                if (found_comments_ele ){
                    comments_found = true;
                }
            }
       }
    }
    if ( comments_found ){
        comments_ele = found_comments_ele;
        comments_ele.style.display='none';
        hid_comments = true;                    
    }  
}

function reshow_known_comments(){
    if ( hid_comments){
        comments_ele.style.display='block';
    }                
}      

function get_meta_image(){
   var metas = document.getElementsByTagName('meta'); 
   for (var i=0; i<metas.length; i++) { 
      if (metas[i].getAttribute("property") == "og:image" || metas[i].getAttribute("itemprop") == "image") { 
         src = metas[i].getAttribute("content");
         img_list.push({"src":src,"m":"1"});
         break;
      } 
   }  
}      

var changed_tab;
var changed_tab_orig_display;
var changed_tab_orig_opacity;

function rehide_hidden_tab(){
    if (changed_tab != null){
        changed_tab.style.display = changed_tab_orig_display;
        changed_tab.style.opacity = changed_tab_orig_opacity;
    }
}

function unhide_hidden_tab(){
    function do_unhide_hidden_tab(tab_list){
        for (var i = 0; i < tab_list.length; i++) {
            tab = tab_list[i];
            if (tab != null && window.getComputedStyle(tab).getPropertyValue("display") == "none"){
                changed_tab_orig_display = tab.style.display;
                changed_tab_orig_opacity = tab.style.opacity;
                changed_tab = tab;
                tab.style.setProperty ("display", "block", "important");
                tab.style.opacity = "1";
                return;
            } 
        }
    }
    function nl_to_a(nl){
        var arr = [];
        for(var i = nl.length; i--; arr.unshift(nl[i]));
        return arr;
    }
    url_str = url.toString();
    if (url_str.indexOf("jamieoliver.com") != -1){
        do_unhide_hidden_tab( nl_to_a(document.getElementsByClassName("recipe-instructions")) );
    } else if (url_str.indexOf("bbcgoodfood.com") != -1){
        do_unhide_hidden_tab( nl_to_a(document.getElementsByClassName("responsive-tabs__pane")) );
    } else if (url_str.indexOf("canadianliving.com") != -1){
        do_unhide_hidden_tab(nl_to_a(document.getElementsByClassName("method")).concat(nl_to_a(document.getElementsByClassName("ingredients"))) );
    } else if (url_str.indexOf("abc.go.com") != -1){
        do_unhide_hidden_tab( nl_to_a(document.getElementsByClassName("tab-content")) );
    } else if (url_str.indexOf("donnahay.com.au") != -1){
        do_unhide_hidden_tab( nl_to_a(document.getElementsByClassName("tab-pane")) );
    } else if (url_str.indexOf("foodnetwork.co.uk") != -1){
        do_unhide_hidden_tab( nl_to_a(document.getElementsByClassName("ingredient-list-panel")).concat(nl_to_a(document.getElementsByClassName("cooking-method-panel"))) );
    } else if (url_str.indexOf("chatelaine.com") != -1){
        do_unhide_hidden_tab( nl_to_a(document.getElementsByClassName("recipe_toggle_display_container")) );
    }  else if (url_str.indexOf("bulla.com.au") != -1){
        do_unhide_hidden_tab( nl_to_a(document.getElementsByClassName("method-wrapper")).concat(nl_to_a(document.getElementsByClassName("ingredients-wrapper"))) );
    } else if (url_str.indexOf("kitchen.nine.com") != -1){
        do_unhide_hidden_tab( nl_to_a(document.getElementsByClassName("recipe__ingredients")).concat(nl_to_a(document.getElementsByClassName("recipe__method"))) );
    } else if (url_str.indexOf("tasteofhome.com") != -1){
        do_unhide_hidden_tab( [ document.getElementById("Ingredients"), document.getElementById("Directions")] );
    } else if (url_str.indexOf("www.perfection.com") != -1){
        do_unhide_hidden_tab( [ document.getElementById("ingredients"), document.getElementById("method")] );
    }  else if (url_str.indexOf("www.ricardocuisine.com") != -1){
        do_unhide_hidden_tab( [ document.getElementById("ingredients"), document.getElementById("preparation")] );
    } else if (url_str.indexOf("wholefoodsmarket.com") != -1){
        do_unhide_hidden_tab( [ document.getElementById("quicktabs-tabpage-mobile_recipe_details-1"), document.getElementById("quicktabs-tabpage-mobile_recipe_details-2")] );
    } 
}


function getPage(element,p_count_siblings, selected_element, prev_sib_display){ 
    var display = "";
    var tag_dict = {};
    var is_selected = 0;
    var img_text_equivalent = "";
    var text_nondisplay = false; // was used with range.selectNodeContents(element) when exception.
    if (element.nodeName == "#comment" || element.nodeName == "NOSCRIPT" || element.nodeName == "svg") {
        return [tag_dict, prev_sib_display];
    }
    if(prev_sib_display == "block" &&  element.nodeName == "#text"  && element.nodeValue.replace(/\u00a0/g, "x").trim().length == 0 ) {
            return [tag_dict, "block"]; // prevent extra blank text nodes   
    } 
    if (element.nodeName != "#text") {
        display = window.getComputedStyle(element).getPropertyValue("display"); 
        visibility = window.getComputedStyle(element).getPropertyValue("visibility"); 
    } 
    // if element is displayed, get information
    if (display != "none") { 
        var nodeValue = "";
        var img_index = -1;
        if (element.nodeName == "IMG") {
            img_text_equivalent = get_if_text_img(element); // thermomix symbols sometimes used instead of text for speed modes
            if (img_text_equivalent == ""){ 
                img_index = handle_img(element);
            }
        } 
        else if (element.nodeName == "#text") {
            nodeValue = element.nodeValue;
            // Check if the user selected this element            
            if (selected_element != null){
                if (element == selected_element){
                    is_selected = 1;
                    }
            } 
            // for text elements that are not directly inside parent: add parent span to get position // solution using range.selectNodeContents(element) broke in iOS 11.
            if (p_count_siblings >1) {
                if (element.nodeValue.replace("\r","").replace("\n","").replace("\t","").trim().length != 0){
                     var wrapper = document.createElement('span');
                     element.parentNode.insertBefore(wrapper, element);
                     wrapper.appendChild(element);
                     var rect = wrapper.getBoundingClientRect();
                     position = Math.round(rect.top) +","+Math.round(rect.left);
                     wrapper.parentNode.replaceChild(element, wrapper);
                }
            } 
        }
        else{
            styles = getStyles(element);
            attributes = getAttributes(element);
            var rect = element.getBoundingClientRect();
            position = Math.round(rect.top) +","+Math.round(rect.left);
        }   
        if (text_nondisplay){
            tag_dict = {};
            tag_dict["text_nondisplay"] = 1;
        }        
        else if (p_count_siblings == 1 && element.nodeName == "#text") {
                 //if parent element only has this text as child then no need to re-create the text node. Put text directly inside the parent. 
                tag_dict = {};
                tag_dict["single_text"] = 1;
                tag_dict["text"] = nodeValue;
                if (is_selected == 1){
                    tag_dict["selected"] = 1;
                }
         } else if(img_text_equivalent != ""){
             tag_dict = {};
             tag_dict["tag"] = "#text";
             tag_dict["text"] = img_text_equivalent;
         }
         else {
               tag_dict = {};
               tag_dict["tag"] = element.nodeName;
               if (element.nodeName != "#text"){
                     tag_dict["s"] =  styles;
                     tag_dict["a"]  = attributes;
                     
                     if(element.nodeName == "INPUT" && (element.type.toLowerCase() == "text" || element.type.toLowerCase() == "number")){
                        tag_dict["text"]  = element.value;
                     }
                     
                     if (element.nodeName == "IMG"  && img_index != -1) {
                        tag_dict["ii"] = img_index;
                     } 
                }
                else{
                    tag_dict["text"]  = nodeValue;
                }
                tag_dict["p"] = position;
                if (is_selected == 1){
                    tag_dict["selected"] = 1;
                }
        }
    //Only want children, including text, if not hidden. We do want hidden element itself, though, because styles can be relevant (eg clear:both) or can cause newline
        if (visibility != "hidden" && element.nodeName != "IFRAME") { // will we miss out on same-src iframes?
            var kids = element.childNodes;
            var count_children = kids.length;
            var s_display = prev_sib_display;
            tag_dict["c"] = [];
            for(var i=0; i<kids.length; i++){
                dict_display = getPage(kids[i], count_children, selected_element, s_display);
                if (Object.keys(dict_display[0]).length !== 0){
                    if( "text_nondisplay" in dict_display[0]){ }
                    else if ("single_text" in dict_display[0]){
                        tag_dict["text"] =  dict_display[0]["text"];
                        tag_dict["selected"] =  dict_display[0]["selected"];
                    }
                    else{
                         tag_dict["c"].push(dict_display[0]);
                        s_display = dict_display[1];
                    }
                }
            }
        }
    }
    
    var s_display = display; 
    if (element.nodeName == "#text") { var s_display = "block"; } // prevent > 1 in a row due to display:none siblings.
    else if ( display == "none") {s_display = prev_sib_display ;}

    return [tag_dict,s_display];
}

function display_server_response(response_data){
    document.getElementById('copy_me_that_outer').style.display = "block";
    if (response_data == ""){
        document.getElementById('copy_me_that_msg').innerHTML = html_no_connection;
    }
    else if (response_data == "potential_cookie_settings_error"){ /* only chrome ext gets here */ 
        function got_response2(){ 
                   if (xmlHttp2.readyState == 4){
                        display_server_response(xmlHttp2.responseText);
                    }
        }
        var xmlHttp2=new XMLHttpRequest();
        xmlHttp2.open("GET", domain+"/verify_cookies/?e="+ext_number.toString(),true);
        xmlHttp2.onreadystatechange = got_response2;
        xmlHttp2.send();
    }     
    else{
       document.getElementById('copy_me_that_msg').innerHTML = response_data;
    }

    chrome.runtime.sendMessage({}, function(response) {}); 
 
    window.copy_me_that_in_progress = 0;
    window.copy_me_that_in_progress2 = 0;    
}
     
function display_response(response_data){ // msg before any calls
    document.getElementById('copy_me_that_outer').style.display = "block";

    if (response_data == "selection_error"){
        document.getElementById('copy_me_that_msg').innerHTML = html_selection_error;
    }
    else if (response_data == "facebook_selection_error"){
        document.getElementById('copy_me_that_msg').innerHTML = html_facebook_selection_error;
    }
    else if (response_data == "facebook_weird_selection_error"){
        document.getElementById('copy_me_that_msg').innerHTML = html_facebook_weird_selection_error;
    } 
    else if (response_data == "reddit_selection_error"){
        document.getElementById('copy_me_that_msg').innerHTML = html_reddit_selection_error;
    }
    else if (response_data == "reddit_weird_selection_error"){
        document.getElementById('copy_me_that_msg').innerHTML = html_reddit_weird_selection_error;
    } 
    else if (response_data == "error"){
        document.getElementById('copy_me_that_msg').innerHTML = html_error;
    } 

    chrome.runtime.sendMessage({}, function(response) {}); 
    
    window.copy_me_that_in_progress = 0;  
    window.copy_me_that_in_progress2 = 0;   
}
 
function get_page_hostname(){
    a = document.createElement('a');
    a.href = window.location;
  return a.hostname;
}

function get_urls(firstEle){
    var pp_url = "";
    var url;
    if( String(window.location).indexOf("reddit.com") != -1){
        url = get_reddit_permalink(firstEle);
    }
    else if(firstEle.nodeName != "HTML" && String(window.location).indexOf("https://www.facebook.com") != -1){
        url = get_facebook_permalink(firstEle);
    } else if( String(window.location).indexOf("pepperplate.com") != -1){
        try{
            url = document.getElementById("cphMiddle_cphMain_hlSource").href;
            pp_url = window.location;
        } catch(e){
            url =  window.location;
        }
    } else{
        url =  window.location;
    }
    return [url, pp_url];
 }
 
function getCountSelectedNodes() {
    var count = 0;
    
    function countTextNodes(element){
        var kids = element.childNodes;
        for(var i=0; i<kids.length; i++){
            countTextNodes(kids[i]);
        }
        if (element.nodeName == "#text" && element.nodeValue.trim() != "")
             {count += 1;}
        return count;
    }  

    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
        }
    }
    return countTextNodes(container);
}

function get_facebook_permalink(firstEle){
    function loop(ele){
		var kids = ele.childNodes;
		for(var i=0; i<kids.length; i++){
			e = kids[i];
			class_name = e.className;
			if(  typeof class_name != "undefined" && class_name.indexOf("_5pcq") != -1 && e.hasAttribute("href") ){
				return e.href;
			}	
            h = loop(e);
            if (h != ""){return h;}
	    }
        return "";
	}

	h = loop(firstEle);
	if (h != "" ){
		return h;
	}else{
		return window.location;
	}
}

function get_reddit_permalink(firstEle){
    function loop(ele){
		var kids = ele.childNodes;
		for(var i=0; i<kids.length; i++){
			e = kids[i];
			class_name = e.className;
			if(  typeof class_name != "undefined" && class_name.indexOf("bylink") != -1 ){
				return e.href;
			}
			x = loop(e);
			if ( typeof x != "undefined" && x.indexOf("reddit.com") != -1 ){
				return x;
			} 
	  }
	}
	y = loop(firstEle);
	if (typeof y != "undefined" && y.indexOf("reddit.com") != -1){
		return y;
	}else{
		return window.location;
	}
}

function get_reddit_entry_unit(selected_element){
    ele = selected_element;
    while (true) {
        var ele_class = String(ele.className).toLowerCase();
        if ( typeof ele_class != "undefined" && ele_class.indexOf("entry") != -1 ){
            return ele; 
        }
        else{
            ele = ele.parentNode;
            if (ele.nodeName == "HTML"){
                return null;
            }  
        }
    }
}

function get_facebook_timeline_unit(selected_element){ 
    if ( String(window.location).indexOf("m.facebook.com") != -1 ){ 
        classesArray = ["fbxPhoto","userContentWrapper","fbPhotoAlbumHeader","webMessengerMessageGroup"];
    }  
    else{
        var classesArray = ["fbUserStory","fbuserpost", "fbusercontent", "fbtimelineunit","fbPhotoSnowliftContainer", "fbxPhoto", "uiunifiedstory","webmessengermessagegroup","fbphotocaption fbphotoalbumheadertext", "usercontentwrapper", "_4-u3 _5cla","_4lmi"]; // _4lmi is file
    }
    function ele_has_post_class(ele_class_lower){
        var arrayLength = classesArray.length;
        for (var i = 0; i < arrayLength; i++) {
            if(ele_class_lower.indexOf(classesArray[i].toLowerCase()) != -1){
                return true;
            }
        }
        return false;
    }
    ele = selected_element;
    while (true) {
        var ele_class_lower = String(ele.className).toLowerCase();
        if ( typeof ele_class_lower != "undefined" && ele_has_post_class(ele_class_lower)){
            if (ele_class_lower.indexOf("userContentWrapper".toLowerCase()) != -1){
                ele_gp = ele.parentNode.parentNode;
                if (ele_gp.getAttribute("role") == "article"){
                    return ele_gp;
                }
                ele_ggp = ele_gp.parentNode;
                if (ele_ggp.getAttribute("role") == "article" ){
                    return ele_ggp;
                }
            } 
            return ele; 
        }
        else{
            ele = ele.parentNode;
            if (ele.nodeName == "HTML"){
                return null;
            }  
        }
    } 
}

function get_thumbnail_link_if_reddit(){
    var thumbnail_link = "";

    if ( String(window.location).indexOf("reddit.com") != -1 ){
        try{ 
              var thumbnail_link = document.getElementsByClassName('preview')[0].src;
        } catch(e){}
        if ( thumbnail_link == ""){
            try{ 
                 var thumb_ele = document.getElementsByClassName('thumbnail')[0];
                 if (thumb_ele){  
                    var kids = thumb_ele.childNodes;
                    for(var i=0; i<kids.length; i++){
                        if (kids[i].nodeName == "IMG"){
                            thumbnail_link = kids[i].src;
                            break;
                        } 
                    }
                 }
            } catch(e){}
        }
        if ( thumbnail_link == ""){
            try{ 
                  var preview_img =  document.getElementsByClassName('PostContent__image-link')[0];
                  if (preview_img.href.indexOf("out.reddit.com")){
                      var b_img = preview_img.style.backgroundImage;
                      var s = b_img.indexOf("url");
                      thumbnail_link = b_img.slice(s+4, b_img.slice(s).indexOf(")")+s).replace(/"/g, '');
                  } else{
                     thumbnail_link = preview_img.href;
                  }
            } catch(e){thumbnail_link = "";}

        }
    }
   
    
    if(thumbnail_link === null){
        thumbnail_link = "";
    }
    return thumbnail_link;
}
    
function show_initial_msg(){
    // insert css
    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet){ style.styleSheet.cssText = css;} 
    else { style.appendChild(document.createTextNode(css));}
    head.appendChild(style);

    try{
        el = document.getElementById("copy_me_that_outer");
        el.parentNode.removeChild(el); // in case already copied once
    }catch(e){}

    var node=document.createElement("DIV");
    node.id = "copy_me_that_outer";
    node.className = "copy_me_that_outer";
    node.innerHTML = html_container;
    document.getElementsByTagName("body")[0].appendChild(node); 
    document.getElementById('copy_me_that_msg').innerHTML = html_waiting;

    document.getElementById('copy_me_that_remove_x').onclick = function(){this.parentNode.parentNode.style.display = "none"; };
}

function get_user_selected_ele(){
    // returns ele selected by user. Is null if nothing selected. Stops execution and displays msg if too much selected
    var userSelection = window.getSelection();
    var startNode = userSelection.anchorNode;
    var endNode = userSelection.focusNode; 
    var user_selected_too_much = false;
    
    if (("" + userSelection).length > 0){
        var has_selection = true;
    }else{
        var has_selection = false;
    }

    if (has_selection){
         if (startNode.compareDocumentPosition(endNode) == 4){ 
          var selected_element = startNode;
         }else{ var selected_element = endNode;}

         if (getCountSelectedNodes()  > 1){
            user_selected_too_much = true;
         }
    }else{
        selected_element = null;
    }
    if (user_selected_too_much){
        throw new CmtStopError("selection_error");
    }
        
    return selected_element;
}

function get_firstEle(){
    // no need to handle touch cases for chrome extension
    function get_is_fb(){
        if (String(window.location).indexOf("https://www.facebook.com") != -1 
           || String(window.location).indexOf("https://m.facebook.com") != -1 ){
            return true;   
        } else{
            return false;
        }
    }

    if ( get_is_fb() ){
        if (selected_element == null){
            throw new CmtStopError("facebook_selection_error");
        } else{
            firstEle = get_facebook_timeline_unit(selected_element);
            if (firstEle == null){
                throw new CmtStopError("facebook_weird_selection_error");
            }
        }
    }
    
    else if( String(window.location).indexOf("reddit.com") != -1 ){
        if (selected_element == null){
            throw new CmtStopError("reddit_selection_error");
        }
        else{
            var firstEle = get_reddit_entry_unit(selected_element);            
            if (firstEle == null){
                throw new CmtStopError("reddit_weird_selection_error");
            }
        }
    }
    
    else if( String(window.location).indexOf("docs.google.com") != -1 ){
         var firstEle =  document.getElementById("docs-editor");           
         if (firstEle == null){
            var firstEle = document.getElementsByTagName("html")[0];;
        }
    }
    
    else{
        var firstEle = document.getElementsByTagName("html")[0];
    }
    
    return firstEle;
}

function CmtStopError(message){
    this.message = message;
}
CmtStopError.prototype = new Error();

function handle_cmt_stop_error(err){
    if (err.message != ""){
        display_response(err.message);
    }
    window.copy_me_that_in_progress = 0; 
    window.copy_me_that_in_progress2 = 0;   
}

// **************** Actual execution starts here  ************************

var img_list;
var pageHTML;
var title;
var url_hostname;
var url;
var pp_url;

var cmt_recipe_pattern = new RegExp('^https?://www.copymethat.com/r/');

if (! window.copy_me_that_in_progress || window.copy_me_that_in_progress != 1){
    
    window.copy_me_that_in_progress = 1;
    
    show_initial_msg();
}


setTimeout(function(){ // makes corner message appear a bit faster 

try{

if (! window.copy_me_that_in_progress2 || window.copy_me_that_in_progress2 != 1){
    
    window.copy_me_that_in_progress2 = 1;

    // null if nothing selected. Throws CmtStopError and displays msg if too much selected
    selected_element = get_user_selected_ele(); 
    
    var firstEle = get_firstEle();

    try {title = document.title; }
    catch(err){title = ""}
    
    url_hostname = get_page_hostname();
    
    urls = get_urls(firstEle);
    url = urls[0];
    pp_url = urls[1];
    
    img_list = [];
    if ( ! cmt_recipe_pattern.test( String(window.location)) ){
        
        unhide_hidden_tab();
        hide_known_comments();
        get_meta_image() // inserts into img_list
        
        pageHTML = getPage(firstEle, firstEle.childNodes.length, selected_element, "block")[0]; // this also inserts into img_list
        
        rehide_hidden_tab();
        reshow_known_comments();
        
    } else{
        pageHTML = "";
    }
    
    function got_response(){ 
        if (xmlHttp.readyState == 4){
            display_server_response(xmlHttp.responseText);  
        }
    }

    var xmlHttp=new XMLHttpRequest();
    xmlHttp.open("POST", domain+"/button/",true);
    xmlHttp.onreadystatechange = got_response;
    var formData = new FormData();  
    formData.append("tree", JSON.stringify(pageHTML));
    formData.append("url", url);
    formData.append("title", title);
    formData.append("images", JSON.stringify(img_list));
    formData.append("reddit_tn_link", get_thumbnail_link_if_reddit());
    formData.append("ext_number", ext_number);
    formData.append("pp_url", pp_url);

    xmlHttp.send(formData); 
   
}


} catch(err){
    if (err instanceof CmtStopError){
       handle_cmt_stop_error(err);
    }else{
       handle_cmt_stop_error("error");
    }
}   

}, 30); 