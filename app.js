/////////////////////START BY REQUIRING IN PACKAGES/////////////////////
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var express = require("express");
var PORT = process.env.PORT || 3000;
var ejs = require("ejs");
app = express();

//////////////////BOILER PLATE CODE FOR SETTING UP APP.JS//////////////////
mongoose.connect("mongodb://localhost/workoutDB");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
////////////////////////////////////////////////////////////////////////

//SCHEMA FOR DB
var workoutSchema = new mongoose.Schema({
    name: String,
    activity: String,
    duration: String,
    weights: String,
    reps: String,
    notes:String,
    created: { type: Date, default: Date.now }
});
//COMPILE INTO MODEL
var Workout = mongoose.model("Workout", workoutSchema);

///IF WE NEED TO MAKE SOME TEST DATA UNCOMMENT THIS////////////////////
/*Workout.create(
    {
    name: "Yoga",
    activity: "Bridge + Wheel",
    duration: "45 mins",
    weights: "body weight",
    reps: "na",
    notes: "Able to find a good flow through strong breath, holding each pose for longer than I've ever been able to before"
}, function (err, workout) {
    if (err) {
        console.log(err)
    } else {
        console.log("NEW WORKOUT HAS BEEN POSTED!!");
        console.log(workout)
    }
}
); */

/////////////////////////////RESTFUL ROUTES//////////////////////////////
//INDEX ROUTE WITH REDIRECT
app.get("/", function (req, res) {
    res.redirect("/workouts");
})
app.get("/workouts", function (req, res) {
    //retrieve workouts from db
    Workout.find({}, function (err, workouts) {
        if (err) {
            console.log(err)
        } else {
            res.render("index", { workouts: workouts });
        }
    });
});

//NEW ROUTE
app.get("/workouts/new", function (req, res) {
    res.render("new");
});

//CREATE ROUTE
app.post("/workouts", function (req, res) {
    //create workout (mongoose method)
    Workout.create(req.body.workout, function (err, newWorkout) {
        if (err) {
            res.render("new");
        } else {
            //then, redirect 
            res.redirect("/workouts");
        }
    });
});


//EDIT ROUTE
app.get("/workouts/:id/edit", function(req, res){
    //find the selected workout (mongoose method)
    Workout.findById(req.params.id, function(err, foundWorkout){
        if(err){
            res.redirect("/workouts");
        } else {
            res.render("edit", {workout: foundWorkout});
        }
    });
});

////UPDATE ROUTE
app.put("/workouts/:id", function(req, res){
    //update the database by taking the id and url and find the existing post (mongoose method)
    //id, newData, callback <--parameters for find by id and update
    Workout.findByIdAndUpdate(req.params.id, req.body.workout, function(err, updatedBlog ){
        if(err){
            res.redirect("/workouts");
        } else {
            res.redirect("/workouts/" + req.params.id);
        }
    });
});

/////DELETE ROUTE///////
//delete from table (mongoose method)
app.delete("/workouts/:id", function(req, res){
    Workout.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/workouts");
        } else {
            res.redirect("/workouts");
        }
    });
});



//SHOW ROUTE
//show a selected record (mongoose method)
app.get("/workouts/:id", function(req, res){
    Workout.findById(req.params.id, function(err, foundWorkout){
        if(err) {
            res.redirect("/workouts");
        } else {
            res.render("show", {workout: foundWorkout});
        }
    });
});



////////////////////////////////////////////////////////////////////////
//shhhh the server is listening...
app.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT);
});