/**
 * Template stub for the Obschy.Ru web site.
 * Node.js + Express version (OLD, won't update)
 * @param localiz = json object with interface labels localized for different languages
 * @param user	= json object for the current user
 * @param lang	= json object for the current language
 * @param langs	= array of languages ['en'] = 'English' etc.
 *
 * @exports head(), foot(), dialog(), alert()
 */
// Document Headings & Header div
exports.head = ( localiz, user, lang, langs ) => {
	const	bg = user.bg,
		leadingZero = (bg < 10)? '0' : ''
	var	options = '', selected
	langs.forEach(e => {
		if (e[0] === lang) selected = 'selected'
		else selected = ''
		options += '<option value="' + e[0] + '"' + selected + '>' + e[1] + '</option>'
	})
	var realname = user.realname, head = []
	if (typeof realname == 'object') realname = realname[lang]

	// Login / logout form

	if (user.name && (user.name != 'guest'))
		var loginForm = '<a class="fa-sign-out-alt">' + localiz.userPref.exit + '</a>'
	else {
		var loginForm = `<form class="helped" id="login" method="post"><label for="email" class="fa-envelope">
<input id="email" name="email" type="email" placeholder="` + localiz.email + `" required></label>
<label for="pass" class="fa-key"><input id="pass" name="pass" type="password" placeholder="`
+ localiz.password + `" required></label><input type="submit" value="` + localiz.submit + `" class="fa-door-open">
<div class="help">` + localiz.loginH + `</div>
</form>`
	}

	// The Header

	 head[0] = `<!DOCTYPE html><html>
<head>
	<title>` + localiz.title + `</title>
	<meta http-equiv="content-type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" type="text/css" href="css/a.css">
	<link rel="stylesheet" type="text/css" href="css/_icons.css">
	<script type="text/javascript" src="js/main.js"></script>
</head>
<body class="bg20" data-bg="20">
<div id="head" class="head">`

	// The 'head' div inner HTML

	head[1] = `
	<h1 id="title" class="m0 p05">` + localiz.title + `</h1>
	<div id="gen-menu" class="abs-top-left3 drop fa">
		<button class="btn fa-bars" aria-label="` + localiz.menu.button + `"></button>
		<ul class="dropdown">
		<li><a class="fa-th-list">`+ localiz.menu.texts +`</a></li>
		<li><a class="fa-mug-hot">`+ localiz.menu.commun +`</a></li>
		<li><a class="fa-universal-access">`+ localiz.menu.strategy +`</a></li>
		<li><a class="fa-cogs">`+ localiz.menu.options +`</a></li>
		<li><a class="fa-question-circle">`+ localiz.menu.help +`</a></li>
	</ul></div>
	<div id="user-pref" class="abs-top-right3 drop fa">
		<button class="btn fa-user-astronaut" aria-label="` + localiz.userPref.button + `"></button>
		<ul class="dropdown">
		<li><a class="fa-snowman" data-get="/user/this" id="realname">` + realname + `</a></li>
		<li><label class="fa-language" aria-label="select language">
		<select aria-label="language" id="set-user-pref-lang">` + options + `
		</select></label></li>
		<li><label for="set-user-pref-bg" class="helped fa-image nowrap">`
			+ localiz.userPref.wallpaper + `
			<button class="minus fa-minus-square" aria-label="minus"></button>
    		<input id="set-user-pref-bg" class="white note c666" data-type="number" value="` + bg + `">
			<button class="plus fa-plus-square" aria-label="plus"></button>
			<div class="help wrap">` + localiz.userPref.wallpaperH + `</div></label></li>
		<li>` + loginForm + `</li>
	</ul></div>
`
	// The last part of the header

	head[2] = '</div><div id="messbox"></div>'

	return head
}

// The footer

exports.foot = () => `	</body>
</html>`

// Dialog boxes etc.

exports.dialog = (localiz, message, classList = '') => '<div class="dialog ' + classList + '">' + message
	+ '<br><button>' + localiz.cancel + '</button><button>' + localiz.ok + '</button></div>'
exports.alert = (localiz, message, classList = '') => '<div class="alert ' + classList + '">' + message
	+ '<br><button>' + localiz.ok + '</button></div>'
