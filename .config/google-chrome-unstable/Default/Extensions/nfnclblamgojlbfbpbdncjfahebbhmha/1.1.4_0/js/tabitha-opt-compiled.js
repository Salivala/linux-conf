function save_opt(){var a={},b=document.getElementById("sorting").value,c=document.getElementById("recent").checked,d=document.getElementById("combine").checked;a.sort_choice=b;a.clr_recent=c;a.clr_combine=d;chrome.storage.sync.set(a);chrome.runtime.sendMessage({command:"update_settings",data:a})}
function restore_options(){chrome.storage.sync.get({sort_choice:"descending",clr_recent:!0,clr_combine:!0},function(a){document.getElementById("sorting").value=a.sort_choice;document.getElementById("recent").checked=a.clr_recent;document.getElementById("combine").checked=a.clr_combine})}var par=document.getElementById("opt");par.addEventListener("click",eventDelToChildren,!1);function eventDelToChildren(a){a.target!==a.currentTarget&&save_opt();a.stopPropagation()}
function restoreDefault(){var a={sort_choice:"descending",clr_recent:!0,clr_combine:!0};chrome.storage.sync.set(a);chrome.runtime.sendMessage({command:"update_settings",data:a});document.getElementById("sorting").value="descending";document.getElementById("recent").checked=!0;document.getElementById("combine").checked=!0}var reset=document.getElementById("restore"),done=document.getElementById("done");done.addEventListener("click",function(){window.close()},!1);
reset.addEventListener("click",restoreDefault,!1);document.addEventListener("DOMContentLoaded",restore_options);
