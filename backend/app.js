const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const path = require('path');
require('dotenv').config();
require('./config/passport');
const app = express();
const isLoggedIn = require('./middleware/isLoggedIn')

const Note = require("./models/noteSchema")
const UserProfile = require('./models/userProfile');

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
const {marked} = require("marked")
const sanitizeHtml = require("sanitize-html")


app.locals.markdownToHtml = (markDownContent) => {
  if (!markDownContent){
    return ""
  }
  const dirtyHtml = marked.parse(markDownContent)
  const cleanHtml = sanitizeHtml(dirtyHtml)
  return cleanHtml
}


app.set('view engine', 'ejs');
// if you delete this line, it will default to 'views' folder
app.set('views', path.join(__dirname, '../frontend')); 

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 14 * 24 * 60 * 60 // 14 days
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    sameSite: 'strict'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./routes/auth'));
app.use('/api', require('./routes/notes'));

app.get('/', (req, res) => {
  res.render('login', { user: req.user });
});

app.get('/dashboard', isLoggedIn, (req, res) => {
  res.render('dashboard', { user: req.user });
});

app.get('/index', isLoggedIn, async (req, res) => {
  const notes = await Note.find({ owner: req.user.userId })
                          .sort({ createdAt: -1}).lean()
  const userProfile = await UserProfile.findOne({ userId: req.user.userId })
                          
  res.render('index', { 
    user: {
        name: userProfile.displayName,
        id: userProfile.userId,
        preferences: userProfile.preferences
    },
    notes: notes
  });
});

app.get('/settings', isLoggedIn, async (req, res) => {
    const userProfile = await UserProfile.findOne({ userId: req.user.userId })
    res.render('settings', {
        user: req.user,
        userProfile: userProfile
    });
});

app.post('/settings', isLoggedIn, async (req, res) => {
    const { name, email, noteBackground, fontColor, fontSize, fontFamily, theme } = req.body;
    const userId = req.user.userId

    try {
      const updatedUser = await UserProfile.findOneAndUpdate({userId : userId}, {
        name:name,
        email: email,
        preferences: {
          fontSize: fontSize,
          fontColor: fontColor,
          fontFamily: fontFamily,
          noteBackground: noteBackground,
          theme: theme
        },
      }, {new : true})

      res.redirect('/settings')
    } catch (err) {
      console.error(err)

    }
});

app.get('/session', (req, res) => {
  console.log(req.session); // Affiche la session
  console.log(req.user); // Doit être défini si connecté
  res.json({ session: req.session, user: req.user });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see the app`);
});

// module.exports = {isLoggedIn}