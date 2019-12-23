/**
 * Main server for Obschy.Ru web site. (Stub, just an example of working with Express)
 * Node.js + Express version
 */
const server = async function () {
//==========================================================
const	express = require('express'),
	conf = require('./conf/config'),	// My config
	hlp = require('./inc/helpers'),		// My helper functions
	d = require('./inc/data'),		// - connection for MongoDB database
	tpl = require('./tpl'),			// - Site template
	session = require('express-session'),
	Redis = require('ioredis'),
	RedisStore = require('connect-redis')(session),
	app = express()

app.disable('x-powered-by')
var	message = '',
	client = new Redis(6381) // client
client.on('error', console.error)	// setting callback for errors

// Localization strings:
const labels = await d.getAll('site', 'labels', {})

// List languages:
var langs = [], i, langs_n = labels.length
for (i = 0; i < langs_n; i++)

	langs[i] = [
		labels[i]['lang'],
		labels[i]['name']
	]

// Authenticate user (stub; don't do that without crypto hashing):

const validate = async (user, pass) => {
	if (user.pass === pass) return true
	return false
}

const sessionFill = (req, next) => {
	console.log(`==== User ====`)
	console.log(req.session.user)
	if (!req.session.lang) req.session.lang = req.session.user.lang
	console.log(`==== Lang ====`)
	console.log(req.session.lang)
	next()
}

// Get/set the user:

const currentUser = async (req, res, next) => {
	try {
		console.log(`==== Sess ====`)
		console.log(req.session)

		if (!req.session.user) d.get('site', 'user', {'name': 'guest'}).then( result => {
			req.session.user = result
			sessionFill(req, next)
		})
		else {
			sessionFill(req, next)
		}
	} catch (err) {
		console.error('==== currentUser erreur ====')
		console.error(err)
	}
}

const getLocaliz = (lang) => {
	return labels.find(l => l.lang === lang)
}

app.use(
	session({
		store: new RedisStore({ client }),
		secret: conf.cookieSalt,
		resave: false,
		saveUninitialized: false,
		name: 'session',
		cookie: {
			httpOnly: true,
			//secure: true,
			sameSite: true,
			maxAge: 24 * 60 * 60 * 1000
		},
	}),
	express.urlencoded({ extended: true }),
	currentUser
)

app.get('/', (req, res) => {
	try {
		localiz = getLocaliz(req.session.lang)
		const ht = tpl.head(localiz, req.session.user, req.session.lang, langs)
		res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
		res.write(ht[0] + ht[1] + ht[2] + tpl.foot())
		res.end()

	} catch (err) {
		console.error('==== App GET erreur ====')
		console.error(err)
	}
})

app.post('/', async (req, res) => {
	try {
		localiz = getLocaliz(req.session.lang)
		console.log(`==== req.body ====`)
		console.log(req.body)
		console.log(`==== Params ====`)
		console.log(req.params)
		console.log(`==== Query ====`)
		console.log(req.query)
		var mess = ''
		if ((req.body.email) && (req.body.pass)) {
			d.get('site', 'user', {'email': req.body.email}).then(user => {
				if (!user) mess = tpl.dialog(localiz, localiz.register)
				else if (validate(user, req.body.pass)) req.session.user = user
				else mess = tpl.alert(localiz, localiz.wrongPassword)
				res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
				res.end(mess)
			})
		} else {	// put here other POST requests
			res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
			res.end(mess)
        }
	} catch (err) {
		console.error('==== App POST erreur ====')
		console.error(err)
	}
})

app.post('/set-user-pref-bg=:bg', /* async */ (req, res) => {
	var bg = parseInt(req.params.bg, 10)
	if (isNaN(bg)) bg = req.session.user.bg
//	else if (bg !== req.session.user.bg) d.update('user', 'pref', where, {bg: bg})
	req.session.user.bg = bg
	res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
	res.end(bg.toString())
})

app.post('/set-user-pref-lang=:lang', /* async */ (req, res) => {
	var lang = req.params.lang
//	d.update('user', 'pref', where, {lang: lang})
	req.session.lang = lang
	const ht = tpl.head(getLocaliz(req.session.lang), req.session.user, lang, langs)
	res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
	res.end(ht[1]);
})

app.listen(8080, () => console.log('Node.js app listening on port 8080. ' + hlp.hhmm() ))

//==========================================================
}

server()
