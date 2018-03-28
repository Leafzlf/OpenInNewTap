setTimeout(() => {
	// localStorage.removeItem('exclude')
	var tid = null, _last = null;
	var foreorback;
	var fore = false;
	var isOn;
	var exclude = localStorage.exclude;
	chrome.storage.local.get({ 'foreorback': 'foreground' }, function (result) {
		foreorback = result.foreorback;
		if (foreorback == 'foreground') {
			fore = true;
		}
		$("foreorback").val(foreorback);
	});
	chrome.storage.local.get({ 'status': 'on' }, function (result) {
		if (result.status === 'off')
			isOn = true;  //isOn的值跟BadgeTextde相反
		else
			isOn = false;
	})
	function isHtmlLink(aNode) {
		return ((aNode instanceof HTMLAnchorElement && aNode.href) || (aNode instanceof HTMLAreaElement && aNode.href) || aNode instanceof HTMLLinkElement);
	};
	chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
		if (sender.id == chrome.runtime.id) {
			console.log("message: " + message);
			if (message === 'on') {
				isOn = true;
			} else if (message === 'off') {
				isOn = false;
			} else if (message === 'e') {
				localStorage.exclude = 'e';
				exclude = message;
				return;
			} else if (message === 'i') {
				localStorage.exclude = 'i';
				exclude = message;
				return;
			} else {
				fore = !fore;
			}
		}
	});
	function onClick(e) {
		if (isOn || exclude === 'e') {
			return;
		}
		if (!e.isTrusted || e.button != 0 || e.shiftKey || e.altKey || e.metaKey) {
			return;
		}
		// if (String(e.target.host).search("pan.baidu.com") >= 0 || String(e.target.baseURI).search("pan.baidu.com") >= 0){
		// console.log("isBaiduPan: " + true);
		// return;
		// }
		console.log(e);
		if (e.detail == 1) {
			for (var node = e.target; node && !isHtmlLink(node); node = node.parentNode);
			// console.log("isLinkNode: " + !!node);
			if (node && (node.getAttribute("href")).search(/#.*$/) < 0) {
				// console.log("href: " + node.getAttribute("href"));
				// console.log("detail==1: " + true);
				_last = e.target;
				console.log('foreorback: ' + fore);
				var evt = new MouseEvent("click", Object.defineProperties(e, { detail: { value: 1 }, ctrlKey: { value: true }, shiftKey: { value: fore } }));
				console.log(evt);
				e.preventDefault();
				e.stopPropagation();
				tid = setTimeout(() => e.target.dispatchEvent(evt), 250);
			}
		}
		if (e.detail == 2 && _last == e.target) {
			console.log("detail==2: " + true);
			// e.preventDefault();
			// e.stopPropagation();
			clearTimeout(tid);

			// var evt = new MouseEvent(e.type,e);
			// evt.stopPropagation();
			// e.target.dispatchEvent(evt);
		}
	};
	addEventListener("click", onClick, true);
}, location.href != "about:srcdoc" ? 0 : 2000);
console.log("location.href: " + location.href);