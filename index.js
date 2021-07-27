const express = require('express')
const bodyParser = require('body-parser')
const flash = require('connect-flash');
const dotenv = require('dotenv')
const session = require('express-session')
const passport = require('passport')
dotenv.config({ path: './config/config.env' })
const authMiddle = require('./middleware/auth')

const app = express()
const port = process.env.PORT || 5001

const userController = require('./controllers/user')
const commentController = require('./controllers/comment')
app.set('view engine', 'ejs')

app.use(express.static("public"));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(flash())

// passport middleware
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)


app.use((req, res, next) => {
	res.locals.user = req.user
	res.locals.isAuthenticated = req.isAuthenticated()
	res.locals.username = req.session.username
	res.locals.errorMessage = req.flash('errorMessage')
	next()
})

app.get('/', commentController.index)

function redirectBack(req, res) {
	res.redirect('back')
}

app.get('/login', userController.login)
app.post('/login', userController.handleLogin, redirectBack)
app.get('/logout', userController.logout)
app.get('/register' , userController.register)
app.post('/register', userController.handleRegister, redirectBack)

app.post('/comments', commentController.add)
app.get('/delete_comments/:id', commentController.delete)
app.get('/update_comments/:id', commentController.update)
app.post('/update_comments/:id', commentController.handleUpdate)

app.use(require('./controllers/index'))
app.use('/auth', require('./controllers/auth'))

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})