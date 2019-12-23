var	bodyBgMax = 50, link, divHead, bodyBgNum;

function ajax(receiver, type, url, method, params, callback) {
	var x = new XMLHttpRequest();
	x.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			switch (type) {
				case 'html': receiver.innerHTML = this.responseText; break
				case 'text': receiver.innerText = this.responseText; break
				case 'value': receiver.value = this.responseText; break
				default:
            }
			if (callback) callback()
		}
	};
	x.open( (method? method : 'GET'), url);
	x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
	x.send( (params? params : '') );
}

window.onload = () => {
//----------------------------------------------
var	bodyBgNum = parseInt(document.body.dataset.bg, 10);
	if ( isNaN(bodyBgNum) ) bodyBgNum = 0;
	divHead = document.getElementById('head');

// Switch the background picture on Alt-ArrowUp/Alt-ArrowDown & Alt-PgUp/PgDn
document.addEventListener('keydown', function(event) {
	var key = event.code;
	if (!key) {
    	key = event.keyCode;
		switch (key) {
			case 33: key = 'PageUp'; break;
			case 34: key = 'PageDown'; break;
			case 38: key = 'ArrowUp'; break;
			case 40: key = 'ArrowDown'; break;
        }
    }
   	if (key !== 'PageUp' && key !== 'PageDown' && key !== 'ArrowUp' && key !== 'ArrowDown' ) return;
	if (event.shiftKey || event.ctrlKey) return;
	if (event.altKey) {
		event.stopImmediatePropagation();
		event.preventDefault();
		switch (key) {
			case 'ArrowDown':			// Arrow Down = next background pic
				if (bodyBgNum === bodyBgMax) {
					bodyBgNum = 0;
				} else {
					bodyBgNum++;
				}
				break;
			case 'PageDown':			// PgDn = ten background pics down
				bodyBgNum += 10;
				break;
			case 'ArrowUp':			// Arrow Up = prev background pic
				if (bodyBgNum === 0) {
					bodyBgNum = bodyBgMax;
				} else {
					bodyBgNum--;
				}
				break;
			case 'PageUp':			// PgUp = ten background pics up
				bodyBgNum -= 10;
		}
		updateBgNum()
		return false;
	}
})

function docTitle() {
	const dTitle = document.querySelector('title')
	dTitle.innerHTML = document.getElementById('title').innerHTML
}

document.addEventListener('input', function(e) {
	var aInput = e.target
	switch (aInput.id) {
    case  'set-user-pref-bg':
		e.stopImmediatePropagation();
    	if (!aInput.value) return
    	var aValue = parseInt(aInput.value, 10)
        if ( !isNaN(aValue) ) bodyBgNum = aValue
		updateBgNum()
		return
    case  'set-user-pref-lang':
		e.stopImmediatePropagation();
		ajax(divHead, 'html', '/'+ e.target.id +'='+ e.target.value, 'POST', '', docTitle)
		return
    default:
		console.log(e.target)
		return
    }
})

document.addEventListener('click', function(e) {
	if (e.target.classList.contains('toggle')) {
    	e.stopImmediatePropagation();
    	e.target.classList.toggle('on');
		console.log(e.target.classList);
	}
	if (e.target.classList.contains('minus')) {
		e.stopImmediatePropagation();
		numberControl(e.target, -1);
	}
	if (e.target.classList.contains('plus')) {
		e.stopImmediatePropagation();
		numberControl(e.target, 1);
	}
})

document.addEventListener('submit', function(e) {
	var aInput = e.target
	console.log(aInput)
	switch (aInput.id) {
    case  'login':
		e.stopImmediatePropagation()
		e.preventDefault()
		const aBox = document.getElementById('messbox')
		const aEmail = document.getElementById('email').value
		const aPass = document.getElementById('pass').value
        ajax(aBox, 'html', window.location.href, 'POST', 'email='+encodeURIComponent(aEmail)+'&pass='
             +encodeURIComponent(aPass))
		return
    default:
		console.log(aInput)
		return
    }
})

function updateBgNum() {
	while (bodyBgNum > bodyBgMax) bodyBgNum -= (bodyBgMax + 1);
	while (bodyBgNum < 0) bodyBgNum += (bodyBgMax + 1);
	const bgInput = document.getElementById('set-user-pref-bg')
	document.body.dataset.bg = bodyBgNum;
	bgClass = 'bg' + ((bodyBgNum < 10)? '0' : '') + bodyBgNum;
	document.querySelector('html').className = bgClass
	document.querySelector('body').className = bgClass
	bgInput.value = bodyBgNum
	ajax(bgInput, 'value', '/'+ bgInput.id +'='+ bodyBgNum, 'POST')
}

function numberControl(aButton, add) {
	var	aParent = aButton.parentElement,
		aInput = aParent.querySelector('input[data-type="number"]'),
		aValue = parseInt(aInput.value, 10);
	if (aInput.id === 'set-user-pref-bg') {
		if ( isNaN(aValue) ) aValue = bodyBgNum
		bodyBgNum = aValue + add;
		updateBgNum()
		return
	}
	if ( isNaN(aValue) ) aValue = 0;
	aValue += add;
	aInput.value = aValue;
}

////-----------------------------------------------
}
