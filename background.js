"use strict";
var status;
var foreorback;
var color_on = '#80c342';
var color_off = '#e94242';
var contextMenu_id1 = '5556';
var contextMenu_id2 = '5557';
chrome.storage.local.get({ 'status': 'on', 'foreorback': 'foreground' }, function (result) {
	status = result.status;
	foreorback = result.foreorback;
	var object = change();
	updateToolbarBadgeText({ text: object.status }, { color: object.color });
	addContextMenu();
});
chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.storage.local.set({ 'status': status }, function () {
		var result = change();
		updateToolbarBadgeText({ text: result.status }, { color: result.color });
		chrome.tabs.query({}, function (tabs) {
			for (let i = 0; i < tabs.length; i++) {
				chrome.tabs.sendMessage(tabs[i].id, status);
			}
			if (status === 'on') {
				removeAllContextMenu();
			} else if (status === 'off') {
				addContextMenu();
			} 
		});
	});
});
// chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){	
// });
function change() {
	var object = new Object();
	if (status == 'on') {
		object.status = ' on ';
		status = 'off';
		object.color = color_on;
	} else {
		object.status = ' off';
		status = 'on';
		object.color = color_off;
	}
	return object;
};
function onOptionChange(fb) {
	console.log('onOptionChange');
	foreorback = fb;
	updateContextMenu(contextMenu_id2, fb);
	chrome.tabs.query({}, function (tabs) {
		console.log(tabs);
		for (let i = 0; i < tabs.length; i++) {
			chrome.tabs.sendMessage(tabs[i].id, fb);
		}
	});
};
function updateToolbarBadgeText(text, color) {
	chrome.browserAction.setBadgeText(text);
	chrome.browserAction.setBadgeBackgroundColor(color);
};
function addContextMenu() {
	// chrome.contextMenus.removeAll();
	var c1 = { id: contextMenu_id1, title: '(Ex/in)clude this page.', contexts: ['page'], onclick: contextMenusClick };
	var c2 = { id: contextMenu_id2, title: 'Current: ' + foreorback, contexts: ['page'], onclick: contextMenusClick };
	chrome.contextMenus.create(c1);
	chrome.contextMenus.create(c2);
};
function updateContextMenu(id, title) {
	chrome.contextMenus.update(id, { title: 'Current: ' + title });
};
function removeAllContextMenu(){
	chrome.contextMenus.removeAll();
}
function contextMenusClick(info, tab) {
	if (info.menuItemId == contextMenu_id1) {
		changeWhiteList(info.pageUrl, tab.id);
	} else if (info.menuItemId == contextMenu_id2) {
		changeOption();
	}
	// let my=function(){
	// this.menu=new ContextMenus();
	// };
	// let ContextMenus =function(){
	// console.log(info);
	// console.log(tab);
	// }
	// var object=new my();
	// console.log(object.menu);
	// chrome.storage.local.get({'status': 'not'},function(result){
	// console.log(result);
	// });
};
function changeOption() {
	let fb;
	if (foreorback == 'foreground')
		fb = 'background';
	else
		fb = 'foreground';
	chrome.storage.local.set({ 'foreorback': fb });
	onOptionChange(fb);
};
function changeWhiteList(url, tabId) {
	// chrome.storage.local.remove('list');
	chrome.storage.local.get({ 'list': [] }, function (result) {
		let u = getPageUrl(url);
		let excludes = result.list;
		let index = excludes.indexOf(u);
		if (index < 0) {
			excludes.push(u);
			chrome.tabs.sendMessage(tabId, 'e');
		} else {
			excludes.splice(index, 1);
			chrome.tabs.sendMessage(tabId, 'i');
		}
		console.log(excludes.toString());
		chrome.storage.local.set({ 'list': excludes });
	});
};
function getPageUrl(url) {
	console.log(url.toString());
	var parts/* =url.match(/(#.*$)/) */;
	// parts=url.match(/[A-Za-z0-9]+\.[^#|?]*/g);
	parts = url.match(/[A-Za-z0-9]+\.[^/]*\//g);
	console.log(parts.toString());
	return parts.toString();
};
function getDomain(url) {
}