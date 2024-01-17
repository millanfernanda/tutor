let lastKnownScrollPosition = 0
let ticking = false

function tabsPage(event, tabOption) {
	sessionStorage.setItem('event', tabOption + '-tab')

	tabcontent = document.getElementsByClassName('tabcontent')
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = 'none'
	}
	tablinks = document.getElementsByClassName('tablinks')
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(' active', '')
	}
	event.currentTarget.className += ' active'
	document.getElementById(tabOption).style.display = 'block'
}

function sendEmail() {
	let email = document.getElementById('email').value
	let name = document.getElementById('name').value
	let message = document.getElementById('Inputbody').value
	let level = document.getElementById('level').value
	let date = document.getElementById('date').value

	console.log(email, name, message, level, date)

	var params = {
		name: document.getElementById('name').value,
		email: document.getElementById('email').value,
		message: document.getElementById('Inputbody').value,
		level: document.getElementById('level').value,
		date: document.getElementById('date').value,
	}

	const serviceID = 'service_zd9x9xm'
	const templateID = 'template_xr1vmoc'

	emailjs
		.send(serviceID, templateID, params)
		.then((res) => {
			document.getElementById('name').value = ''
			document.getElementById('email').value = ''
			document.getElementById('Inputbody').value = ''
			document.getElementById('level').value = ''
			document.getElementById('date').value = ''
			console.log(res)
			alert('Your message sent successfully!!')
		})
		.catch((err) => console.log(err))
}

function buttonClick(pointer, level = null) {
	if (pointer === 'contact') {
		let tabId = 'contact-tab'
		let temp = document.getElementById(tabId)
		temp.click()
		if (level) {
			console.log(level)
			document.getElementById('level').value = level
			console.log(document.getElementById('level').value)
		}
	} else if (pointer === 'experience') {
		let tabId = 'experience-tab'
		let temp = document.getElementById(tabId)
		temp.click()
	}
}

function init() {
	console.log('INIT')
	let tabId = sessionStorage.getItem('event')
	console.log(tabId)
	if (tabId == null) {
		tabId = 'home-tab'
	}
	let temp = document.getElementById(tabId)
	if (temp) {
		temp.click()
	} else {
		setTimeout(init, 200)
	}
}

setTimeout(init, 200)
