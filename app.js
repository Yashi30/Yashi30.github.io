var express=require("express");
var app=express();
var bodyparser=require("body-parser");
var passport=require("passport");
var localstrategy=require("passport-local");
var mongoose=require("mongoose");
var flash=require("connect-flash");
var methodoverride=require("method-override");
//mongoose.connect('mongodb+srv://myusername:darsh@25@cluster0-tk6xp.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true});
  var url=process.env.databaseurl||"mongodb://localhost/yelp_camp_v12";
  mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true});
//another method for writing this without using var
//var express    =require("express"),
   // app        =express(),
    //bodyparser =require("body-parser"), 
    //mongoose   =require("mongoose");

app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodoverride("_method"));
app.use(flash());
var Campground=require("./models/campground");
var Comment=require("./models/comment");
var User=require("./models/user");
var seedDB=require("./seed");


var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var indexRoutes=require("./routes/index");


//seedDB();//seed the database

//passport config
app.use(require("express-session")({
    secret:"can be anything",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser=req.user,
    res.locals.error=req.flash("error"),
    res.locals.success=req.flash("success"),
    next();
});
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(process.env.PORT || 3000,function(){
    console.log("server started");
});