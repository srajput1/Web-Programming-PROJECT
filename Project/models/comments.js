var mongoose = require('mongoose');
console.log("working");
//Recipe Schema
var CommentsSchema = mongoose.Schema({
    commentsID:{type: Number, index: true},
    commentsDescrip:{type:String},
    userName:{type:String},
    recipeTitle: {type:String}
});

var Comments = module.exports = mongoose.model('Comments', CommentsSchema);

module.exports.createComment = function(newComment, callback){
    newComment.save(callback);
};

module.exports.getCommentByTitle = function(recipeTitle, callback){
    var query = {recipeTitle: recipeTitle};
    Comments.findOne(query, callback);
};

module.exports.getCommentByID = function(commentID, callback){
    var query = {commentsID: commentID};
    Comments.findOne(query, callback);
};

module.exports.getAllComments = function(recipeTitle, callback){
    var query = {recipeTitle: recipeTitle};
    Comments.find({}, callback).where(query);
};