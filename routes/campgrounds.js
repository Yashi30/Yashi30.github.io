var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");
//INDEX ROUTE-show all campgrounds
router.get("/",function(req,res){
    //console.log(req.user);
    Campground.find({},function(err,allCampgrounds){
     if(err){
         res.send(err);
     }
     else{
        res.render("campgrounds/index",{campgrounds:allCampgrounds});
     }
    });
   
    
});
//CREATE-add new campground
router.post("/",middleware.isLoggedIn,function(req,res){
    var name=req.body.name;
    var price=req.body.price;
    var image=req.body.image;
    var desc=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newCampground={name:name,price:price,image:image,description:desc,author:author};
    Campground.create(newCampground,function(err,newlyCreated){
            if(err){
                console.log(err);
            }
            else{
                res.redirect("/campgrounds");
            }
    });
    

});
//NEW- create to form to add new campgrounds
router.get("/new",middleware.isLoggedIn,function(req,res){
      res.render("campgrounds/new");
});
// SHOW:this will show more about a particular campground
router.get("/:id",function(req,res){
       Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
       if(err){
           console.log(err);
       }
       else{
        res.render("campgrounds/show",{campground:foundCampground});
          }
        });
     
    
});
//Edit route
router.get("/:id/edit",middleware.checkUserOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundcampground){
       res.render("campgrounds/edit",{campground:foundcampground});
  });
});
//update
router.put("/:id",middleware.checkUserOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedcampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});
router.delete("/:id",middleware.checkUserOwnership,function(req,res){
     Campground.findByIdAndRemove(req.params.id,function(err){
         if(err){
             res.redirect("/campgrounds");
         }
         else{
             res.redirect("/campgrounds");
         }
     });
});


module.exports=router;