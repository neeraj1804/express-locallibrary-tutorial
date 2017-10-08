var mongoose = require("mongoose");

//Define a schema
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    title: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'Author', required: true},
    summary: {type: String, required: true},
    isbn: {type: String, required: true},
    genre: [{type: Schema.Types.ObjectId, ref: "Genre"}]
});

bookSchema.virtual("url").get(function(){
    return "/catalog/book/" + this._id;
});

var BookModel = mongoose.model("Book", bookSchema, "BookModel");

module.exports = BookModel;

//compile model from Schema
//var AuthorModel = mongoose.model("Author", authorSchema, "AuthorModel");
//var BookModel = mongoose.model("Book", bookSchema, "BookModel");

//create a instance of model SomeModel
/*var author_instance = new AuthorModel({
    name: "Krishnakant Jain"
});

BookModel.findOne({title: "How to train a dragon"}).populate("book").exec(function(err, book){
    if(err){
        console.log("error in getting a book",err);
    }else{
        console.log("Author name of the book is",book.author);
    }
});

author_instance.save(function(err, done){
    if(err){
        console.log("error in saving author",err);
    }else{
        console.log("author saved");
        var book_instance = new BookModel({
            title: "How to train a dragon",
            author: author_instance._id
        });

        book_instance.save(function(e){
            if(e){
                console.log("there is some error in saving book");
            }else{
                console.log("book saved");
            }
        });
    }
});*/



/*SomeModel.find({name: "Nitin Jain"}, "name", function(err, arr){
    console.log(arr);
});*/

/*awesome_instance.save(function(err){
    if(err){
        console.log("error while saving model instance");
    }
});

SomeModel.create({
    name: "Nitin Jain"
}, function(err, done){
    if(err){
        console.log("error while creating model instance");
    }else{
        console.log("new model instance created");
    }
});

DiffModel.create({
    name: "Jay Jain",
    mobile: 9898989898
}, function(err, done){
    if(err){
        console.log("error while creating model instance");
    }else{
        console.log("new model instance created");
    }
});*/