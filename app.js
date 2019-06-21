//Whenever we need to call a package
const express = require('express');
const path = require('path');

//For put request
var methodOverride = require('method-override');

const flash = require('connect-flash');
const session = require('express-session');

const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

//This starts our application
const app = express();

//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);

//DB config
const db = require('./config/database');

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//First start the mongo db from cmd
//Connect to mongoose(database);
//We are using local database first with name vidjot.dev
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true
})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));
    


// //How middleware works
// app.use(function(req, res, next){
//     // console.log(Date.now());
//     req.name = 'Muneeb Ahmed Khan'
//     next();
// });

//Handlebars Middleware
//Every template has its own middleware 
//basically telling the system about the template and setting default layout to 'main';
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body-Parser middleware
//It allows us to access what is submitted
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Static folder
//It sets the public folder to static 
app.use(express.static(path.join(__dirname,'public')));

//Express session-middleware
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

// Passport Middleware
//Put this after express-session
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

// Global Variables
app.use(function(req, res, next){
    //success_msg is the variable name here
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    //When we are logged in, we have access to users
    res.locals.user = req.user || null ;
    next();
});


//Method override middleware
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

//How to create a route to a particular page
//Index Route
//handling a get request
app.get('/', (req, res) =>{
    const title = 'Welcome';
    res.render('index',{
        title: title
    });
});

//About Route
app.get('/about', (req, res) =>{
    res.render('about');
});

//Use routes
//Anything that goes to /ideas should pertain to ideas.js file
app.use('/ideas', ideas);
app.use('/users', users);


const port = process.env.PORT || 5000; 

//listen sets the app to a port
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});

