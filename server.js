
const express = require('express');
const app = express();

app.use(express.static(__dirname));

require('dotenv').config()

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + "/public"))

//app.use(require('morgan')('combined')); -logging software

const bodyParser = require('body-parser');
const expressSession = require('express-session')({
  secret: 'blah3blah2blah1',
  resave: false,
  saveUninitialized: false
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);

/*  PASSPORT SETUP  */

const passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());

/* MONGOOSE SETUP */

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// uri = // removed URI as REPO is public

mongoose.connect( uri, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
console.log("connected"));    
mongoose.set('useFindAndModify', false);//https://mongoosejs.com/docs/deprecations.html#findandmodify

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + "/public"))

const userDB = require('./dbConfig')

var passportLocalMongooseOptions = {
    maxAttempts : 3
}
userDB.UserDetail.plugin(passportLocalMongoose,passportLocalMongooseOptions); // passportLocalMongoose is a plugin to schema which does hashing and username/password management 
const UserDetails = mongoose.model('userInfo', userDB.UserDetail, 'userInfo'); // first parameter: name of collection in db; second = reference to schema;  name assiging to collection inside mOngoose ?

/* PASSPORT LOCAL AUTHENTICATION */

passport.use(UserDetails.createStrategy());

passport.serializeUser(UserDetails.serializeUser());
passport.deserializeUser(UserDetails.deserializeUser());

/* ROUTES */

const connectEnsureLogin = require('connect-ensure-login',passportLocalMongooseOptions);

app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
});

app.get('/health',
function(req,res){
  res.render('health')
})

app.get('/tutorial', 
    function(req, res){ 
    res.render('tutorial'); 
}); 


app.get('/signup',function(req,res){ 
    res.set({ 
        'Access-control-Allow-Origin': '*'
        }); 
    return res.render('signUp')
    })

app.use(express.static('public')); // middleware for registration

app.post('/sign_up', function(req,res,next){ 
    var displayNameInput = req.body.name; 
    var email =req.body.email; 
    var pass = req.body.password; 
  
    /* var data = { 
        "name": displayNameInput, 
        "email":email, 
    } the way to add a document to the mongodb*/

    UserDetails.register({username:email,active:false},pass,function(err){
      if(err){
        console.log(err)
        return res.redirect('/signup')
      }else{
        return res.redirect('/register')
      }
    })

});

app.get('/register',
function(req,res){
  res.render('register', { user: req.user })
})

app.post('/register', (req, res, next) => {
  passport.authenticate('local',
  (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.redirect('/login?info=' + info);
    }

    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }

      return res.redirect('tutorial');
    });
  })(req, res, next);

  
  const filter = {username:req.body.username};
  const update = {firstname:req.body.firstname,surname:req.body.surname,height:req.body.height,company:req.body.company,DoB:req.body.DoB}; 

  UserDetails.findOneAndUpdate(filter,update,{
        new:true
    },function(err){
        if (err) {
            console.log(err)
        }
    }) 
    return
});


app.get('/login',
    function(req, res){
    res.render('login');
});
app.post('/login', (req, res, next) => {
  expiryDay=0
  expiryMonth=0
  expired = false;
  //more efficient to set up expiry in register & compare in login route.

    passport.authenticate('local',
    (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.redirect('/login?info=' + info);
      }

      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }else{
          UserDetails.findOneAndUpdate({username:req.body.username},{ $inc: {noOfLogins:1} },function(err,document){
            if (err){
              console.log(err)
            }else{
              expired = false;
              if (document.premium == false){
                  var today = new Date();
                  var mm = today.getMonth() + 1; // dates from 0 - 11 
                  var dd = today.getDate();
          
                  db_Created_str = JSON.stringify(document.created_at)
                  expiryMonth = (parseInt(db_Created_str.substr(6,2),10) % 12) + 1 // parans substr= index + count && params parseInt = str & base
                    
                  if (parseInt(db_Created_str.substr(9,2),10) == 31){
                    expiryDay = 30
                  }else{
                    expiryDay = parseInt(db_Created_str.substr(9,2),10)
                  }
                  if( (parseInt(db_Created_str.substr(6,2),10) == 1) && (parseInt(db_Created_str.substr(9,2),10) > 28)){
                    expiryDay = 28;
                  }
          
                  if ((expiryMonth == mm)&&(expiryDay == dd)){
                    expired = true;
                    document.expired = "true"
                    UserDetails.findOneAndUpdate({username:req.body.username},{expired:true},function(err){
                      if (err){
                        console.log(err)
                      }
                    })
                  }

                if ((expired == true) || (document.expired == true)){
                  return res.redirect('pay')
                }else{ 
                  return res.redirect('tool')
                }

              }else{
                return res.redirect('tool')
              }
            }
          })
        }
       
      });
    
    })(req, res, next);

});


app.get('/user',
  //connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.send({user: req.user}) //couldn't you just add this line to the tool get route
); // have to setup this route to access information via ajax requests 

app.get('/logout',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => {
        req.logout()
        res.redirect('/')}

);

app.get('/tool', 
    require('connect-ensure-login').ensureLoggedIn(), 
    function(req, res){ 
    res.render('tool',{user:req.user}); 
}); 

app.get('/pay',
function(req,res){
  res.render('pay', { user: req.user })
})


app.post('/updateDB',function(req,res,next){
  //console.log(req.body)
  //console.log(req.body.totalMinutes)
  usernameFilter= {
    username:req.body.username
  }
    
  dbUpdate = {
    $inc: {
      totalMinutes:req.body.totalMinutes,
      faceTouch_totalUse:req.body.faceTouch_totalUse,
      faceMask_totalUse:req.body.faceMask_totalUse,
      postureTracker_totalUse:req.body.postureTracker_totalUse,
      screenTimer_totalUse : req.body.screenTimer_totalUse,
      hydrationTracker_totalUse: req.body.hydrationTracker_totalUse
    },
    $push : {history:{
      date:req.body.dateToday,
      nomoiScore:req.body.nomoiScoreToday,
      ergonomicScore:req.body.ergonomicScoreToday,
      covid19Score:req.body.covid19ScoreToday,
      postureTrackerScore:req.body.postureScoreToday,
      screenDistanceScore:req.body.screenDistanceScoreToday,
      hydrationTrackerScore:req.body.hydrationTrackerScoreToday,
      screenTimerScore:req.body.screenTimerScoreToday,
      faceTouchScore:req.body.faceTouchScoreToday,
      faceMaskScore:req.body.faceMaskScoreToday
    }}
  }

  UserDetails.findOneAndUpdate(usernameFilter,dbUpdate,function(err){
    if (err){
      console.log(err)
    }else{
      console.log('updated')
    }
  })

})

app.post('/cutDB',function(req,res,next){
  //console.log(req.body)
  //console.log(req.body.totalMinutes)
  usernameFilter= {
    username:req.body.username
  }
    
  cutDB = {
    $pop:{history:-1}
  }

  UserDetails.findOneAndUpdate(usernameFilter,cutDB,function(err){
    if (err){
      console.log(err)
    }else{
      console.log('cut')
    }
  })

})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listening on port ' + port));

