var foreorback;
document.addEventListener('DOMContentLoaded', function () {
	restore_options();
	enableEvents();
});
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (sender.id == chrome.runtime.id) {
		document.getElementById(message).selected = true;
	}
});
function restore_options() {
	chrome.storage.local.get({ 'foreorback': 'background' }, function (result) {
		foreorback = result.foreorback;
		document.getElementById(foreorback).selected = true;
		// let index;
		// if(foreorback==='background')
		// index=0;
		// else
		// index=1;
		// document.getElementById("right_click")[index].selected=true;
	});
}

function right_click_changed() {
	var foreorback = document.getElementById("right_click").value;
	chrome.storage.local.set({ 'foreorback': foreorback });
	chrome.runtime.getBackgroundPage(function (backgroundPage) {
		backgroundPage.onOptionChange(foreorback);
	});
}

function enableEvents() {
	document.getElementById('right_click').onchange = function () { right_click_changed(); };
}