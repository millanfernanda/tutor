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

/* ------------------------------ motion ------------------------------ */

/* wraps each letter in <span class="char" style="--i:n"> so CSS can stagger
   them; a continuous index means TUTOR keeps cascading on from SPANISH */
function splitLetters(root) {
	let i = 0
	let lines = root.querySelectorAll('.line')
	let targets = lines.length ? lines : [root]

	Array.prototype.forEach.call(targets, function (line) {
		let text = line.textContent
		line.textContent = ''
		Array.prototype.forEach.call(text, function (character) {
			let span = document.createElement('span')
			span.className = 'char'
			span.style.setProperty('--i', i++)
			// a plain space would collapse once the char is inline-block
			span.textContent = character === ' ' ? ' ' : character
			line.appendChild(span)
		})
	})
}

/* one observer drives the entrances: the headline letters, the hero photo, and
   the About Me / Schedule a Meeting blocks */
function initReveals() {
	let items = document.querySelectorAll('[data-reveal],[data-letters]')

	if (!('IntersectionObserver' in window)) {
		Array.prototype.forEach.call(items, function (el) {
			el.classList.add('is-in')
		})
		return
	}

	let observer = new IntersectionObserver(
		function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return
				entry.target.classList.add('is-in')
				observer.unobserve(entry.target)
			})
		},
		{ threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
	)

	Array.prototype.forEach.call(items, function (el) {
		observer.observe(el)
	})
}

/* The hero photo panel keeps riding up for as long as you scroll down, half a
   pixel for every pixel of page scroll, and comes back down as you scroll up.
   It moves the panel rather than the image inside it: the photo's aspect ratio
   matches its frame almost exactly, so there is no spare crop to pan through
   and anything else would mean scaling the photo up. */
const HERO_RATE = 0.5

function initHeroScroll() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

	let frame = document.querySelector('.hero-img')
	if (!frame) return

	let queued = false
	const apply = function () {
		let offset = Math.max(window.scrollY, 0) * HERO_RATE
		frame.style.setProperty('--py', -offset.toFixed(1) + 'px')
		queued = false
	}

	window.addEventListener(
		'scroll',
		function () {
			if (queued) return
			queued = true
			window.requestAnimationFrame(apply)
		},
		{ passive: true }
	)
	apply()
}

function initMotion() {
	Array.prototype.forEach.call(
		document.querySelectorAll('[data-letters]'),
		splitLetters
	)
	initReveals()
	initHeroScroll()
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
	initMotion()
}

document.addEventListener('DOMContentLoaded', init)
