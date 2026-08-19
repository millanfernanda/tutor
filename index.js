let ticking = false

/* ---------------------------- navigation ---------------------------- */

function scrollToSection(id) {
	let target = document.getElementById(id)
	if (target) {
		target.scrollIntoView({ behavior: 'smooth', block: 'start' })
	}
}

/* plan cards + the two call-to-action buttons.
   passing a level also preselects it in the contact form. */
function buttonClick(pointer, level = null) {
	if (level) {
		let select = document.getElementById('level')
		if (select) {
			select.value = level
		}
	}
	scrollToSection(pointer)
}

/* lights up the nav link for whichever section is on screen */
function highlightNav() {
	let links = document.querySelectorAll('.navlink')
	let marker = window.scrollY + 160
	let currentId = 'home'

	links.forEach(function (link) {
		let id = link.getAttribute('href').slice(1)
		let section = document.getElementById(id)
		if (section && section.offsetTop <= marker) {
			currentId = id
		}
	})

	// at the very bottom of the page, always light the last section
	if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
		currentId = 'contact'
	}

	links.forEach(function (link) {
		if (link.getAttribute('href') === '#' + currentId) {
			link.classList.add('active')
		} else {
			link.classList.remove('active')
		}
	})
}

function onScroll() {
	if (ticking) return
	ticking = true
	window.requestAnimationFrame(function () {
		highlightNav()
		ticking = false
	})
}

/* ------------------------------ email ------------------------------ */

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

/* ------------------------------- init ------------------------------- */

function init() {
	// default the date field to today (<input type="date"> needs YYYY-MM-DD)
	var now = new Date()
	var today = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
		.toISOString()
		.slice(0, 10)
	var dateField = document.getElementById('date')
	if (dateField) {
		dateField.value = today
		dateField.min = today
	}

	window.addEventListener('scroll', onScroll, { passive: true })
	highlightNav()
}

document.addEventListener('DOMContentLoaded', init)
