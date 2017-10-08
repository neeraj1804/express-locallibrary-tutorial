var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var genreSchema = new Schema({
    name: {type: String, required: true, min: 3, max: 100}
});

genreSchema.virtual("url").get(function(){
    return "/catalog/genre/" + this._id;
});

var GenreModel = mongoose.model("Genre", genreSchema, "GenreModel");

module.exports = GenreModel;