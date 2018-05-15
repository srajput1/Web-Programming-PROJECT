var mongoose = require('mongoose');
console.log("working");
//Recipe Schema
var RecipeSchema = mongoose.Schema({
    recipeID:{ type: Number, index: true},
    recipeCategory: { type: String},
    userName: { type: String},
    recipeTitle: { type: String},
    recipeDescrip: { type: String},
    recipeMethod: {type: String}
});

var Recipe = module.exports = mongoose.model('Recipe', RecipeSchema);

module.exports.createRecipe = function(newRecipe, callback){
    newRecipe.save(callback);
};

module.exports.getRecipeByTitle = function(recipeTitle, callback){
    var query = {recipeTitle: recipeTitle};
    return(Recipe.findOne(query, callback));
};

module.exports.getRecipeByID = function(recipeID, callback){
    var query = {recipeID: recipeID};
    return(Recipe.findOne(query, callback));
};

module.exports.getAllRecipes = function(){
    let i = 0;
    let x = [];
    Recipe.find({}, function(err, recipes){
        if(err)
            throw (err);
        else{
            //console.log(recipes);
            x[i] = recipes;
            i++;
    }});
    return x;
};