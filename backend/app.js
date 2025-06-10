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

// active when I ren the test so I deactivate isLoggedIn
const isTestMode = process.env.NODE_ENV === "test"
const authenticate = isTestMode ? (req, res, next) => next() : isLoggedIn;


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

app.get('/dashboard', authenticate, (req, res) => {
  res.render('dashboard', { user: req.user });
});

app.get('/index', authenticate, async (req, res) => {
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

app.get('/settings', authenticate, async (req, res) => {
    const userProfile = await UserProfile.findOne({ userId: req.user.userId })
    res.render('settings', {
        user: req.user,
        userProfile: userProfile
    });
});

app.post('/settings', authenticate, async (req, res) => {
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

app.get('/about', authenticate, (req, res) => {
    res.render('about', {
        user: req.user
    });
});

app.get('/stats', authenticate, async (req, res) => {
    try {
      const totalNotes = await Note.countDocuments({ owner: req.user.userId})

      const categoryCounts = await Note.aggregate([
        { $match: { owner: req.user.userId } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

      const recentNotes = await Note.find({ owner: req.user.id })
        .sort({ createdAt: -1 })
        .limit(5)

      res.render('stats', {
        user: req.user,
        totalNotes,
        categoryCounts,
        recentNotes
    });

    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).send("Error fetching stats.");
    }
});

app.get('/session', (req, res) => {
  res.json({ session: req.session, user: req.user });
});


const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// I export it to use it for the tests
module.exports = app;
// module.exports = {isLoggedIn}