const router = require("express").Router();
const User = require('../models/User.model')
const bcrypt = require('bcryptjs')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post('/signup', async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(req.body.password, salt)

    await User.create({
      username: req.body.username,
      password: hashedPassword,
    })
    res.redirect('/login')
  } catch (error) {
    console.log(error.message)
    res.render('signup', { errorMessage: error.message, isConnected: false })
  }
})

router.get('/login', (req, res) => {
  res.render('login', { isConnected: false })
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const currentUser = await User.findOne({ username })
  if (!currentUser) {
    // What to do if I don't have a user with this username
    res.render('login', { errorMessage: 'No user with this username', isConnected: false })
  } else {
    // console.log('Found User', currentUser)
    if (bcrypt.compareSync(password, currentUser.password)) {
      console.log('Correct password')
      // What to do if I have a user and the correct password
      /* const sessionUser = structuredClone(currentUser)
      delete sessionUser.password */
      req.session.user = currentUser
      res.redirect('/profile')
    } else {
      // What to do if I have a user and an incorrect password
      res.render('login', { errorMessage: 'Incorrect password !!!', isConnected: false })
    }
  }
})






module.exports = router;
