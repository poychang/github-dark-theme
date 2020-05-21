chrome.storage.sync.get('isEnabled', function(result){

	console.log('getting isEnabled value');

	var isEnabled = result.isEnabled || "true";

	if(isEnabled == "true") {
		console.log('isEnabled is true');
		document.getElementById('isEnabled').checked = true;
	}else{
		console.log('isEnabled is false');
	}
	console.log(isEnabled);
});



document.getElementById('isEnabled').addEventListener('click', (event) => {
	console.log('isEnabled was clicked');
	chrome.storage.sync.set({'isEnabled' : (!!event.target.checked).toString()});
});
