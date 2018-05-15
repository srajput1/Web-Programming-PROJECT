var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var path = require("path");
var User = require('../models/user');
var Recipe = require('../models/recipes');
var Comments = require('../models/comments');
var file = require("fs");

let temp = [];
let temp1 = [];
let k = 0;
let l = 0;


// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

router.get('/recipes',function(req,res){
    res.render('recipes');
});

router.get('/recipesDetails',function(req,res){
    res.render('recipesDetails');
});

router.post('/recipes', function(req, res){
    var recipeID = req.body.id;
    var recipeCategory = req.body.cat;
    var userName = req.body.name1;
    var recipeTitle = req.body.recipeTitle1;
    var recipeDescrip = req.body.descrip;
    var recipeMethod = req.body.recipeMethod;

    temp+=recipeTitle;
    k++;
    temp1[l]=recipeID+"\r\n\b"+recipeTitle+"\r\n\b"+recipeCategory+"\r\n\b"+userName+"\r\n\b"+recipeDescrip+"\r\n\b"+recipeMethod;
    /*l++;
    temp1[l]=recipeCategory;
    l++;
    temp1[l]=recipeTitle;
    l++;
    temp1[l]=userName;
    l++;
    temp1[l]=recipeDescrip;
    l++;
    temp1[l] = "|||||||";*/
    l++;
    console.log(recipeTitle+"\r\n"+recipeDescrip+"\r\n"+recipeID);

    req.checkBody('id', 'id is required').notEmpty();
    req.checkBody('cat', 'category is required').notEmpty();
    req.checkBody('name1', 'name is required').notEmpty();
    req.checkBody('recipeTitle1', 'title is required').notEmpty();
    req.checkBody('descrip', 'descrip is required').notEmpty();
    req.checkBody('recipeMethod', 'recipe method is not mentioned');

    var errors = req.validationErrors();

    if(errors) {
    	req.flash('error_msg','Input is invalid');
        res.render("recipes",{
            errors:errors
        });
    }
    else{
        var newRecipe = new Recipe({
            recipeID: recipeID,
            recipeCategory: recipeCategory,
            userName: userName,
            recipeTitle: recipeTitle,
            recipeDescrip: recipeDescrip,
            recipeMethod: recipeMethod
        });
        Recipe.createRecipe(newRecipe, function(err, recipe){
            if(err) throw err;
            console.log(recipe);
        });
        req.flash('success_msg', 'Your recipe is added');

        res.redirect('/users/recipes');
    }
});

router.post("/recipesDetails", function(req,res){
	var recipeTitle = req.body.title1;

	req.checkBody("title1", "title is required").notEmpty();

	var error = req.validationErrors();

	if(error){
		req.flash("error-msg","Input is invalid");
		res.render("recipesDetails",{
			errors:error
        });
	}
	else{
		Recipe.getRecipeByTitle(recipeTitle, function(err, recipe){
			if(err) throw err;

            Comments.getAllComments(recipeTitle, function(err,comment){
                if(err) throw err;
                req.flash('success-msg','Your recipe is found');
                res.render('search',{recipe:recipe,comment:comment});
            });
		});
	}
});

router.get("/commentsearch", function(req,res){
    res.render("commentsearch");
});

router.post("/commentsearch", function(req,res){
    var commentID = req.body.commentID;

    req.checkBody("commentID", "comment id is required").notEmpty();

    var error = req.validationErrors();

    if(error){
        req.flash("error-msg","Input is invalid");
        res.render("commentsearch",{
            errors:error
        });
    }
    else{
        Comments.getCommentByID(commentID, function(err,comment){
           if(err) throw err;
           req.flash('success-msg','Your comment is found');
           res.render('comment',{comment:comment});
        });
    }
});



router.get("/commentsDetails", function(req, res){
	res.render('commentsDetails');
});

router.post("/commentsDetails", function(req,res){
    var commentsID = req.body.id;
    var commentsDecrip = req.body.commentsDescrip;
    var userName = req.body.name1;
    var recipeTitle = req.body.title1;

    req.checkBody('id', 'id is required').notEmpty();
    req.checkBody('commentsDescrip', 'commentsDescrip is required').notEmpty();
    req.checkBody('name1', 'name is required').notEmpty();
    req.checkBody('title1', 'title is required').notEmpty();

    var errors = req.validationErrors();

    if(errors) {
        req.flash('error_msg','Input is invalid');
        res.render("recipes",{
            errors:errors
        });
    }
    else{
        var newComment = new Comments({
            commentsID: commentsID,
            commentsDescrip: commentsDecrip,
            userName: userName,
			recipeTitle: recipeTitle
        });
        Comments.createComment(newComment, function(err, comment){
            if(err) throw err;
            console.log(comment);
        });
        req.flash('success_msg', 'Your comment is added');

        res.redirect('/users/commentsDetails');
    }
});

router.get("/temp", function(req,res){
    /*let recipe1 = [];
    console.log(k);
    console.log(temp);
    for(let i = 0; i < k ; i++){
        Recipe.getRecipeByTitle(temp[i], function(err, recipe){
            recipe1[i] += recipe;
            console.log(recipe);
            console.log(recipe1[i]);
        });
    }*/
	res.render('temp', {recipe:temp1});
});
module.exports = router;