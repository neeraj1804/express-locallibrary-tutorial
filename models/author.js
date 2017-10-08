var mongoose = require("mongoose");
var moment = require("moment");

var Schema = mongoose.Schema;

var authorSchema = new Schema({
    "first_name": {type: String, required: true, max: 100},
    "family_name": {type: String, required: true, max: 100},
    "date_of_birth": {type: Date},
    "date_of_death": {type: Date}
});

authorSchema.virtual("name").get(function(){
    return this.first_name + " " + this.family_name;
});

authorSchema.virtual("formatted_dob").get(function(){
    var dob = this.date_of_birth;
    if(dob){
        return moment(dob).format("MMMM Do, YYYY");
    }
    return dob;
});

authorSchema.virtual("formatted_dod").get(function(){
    var dod = this.date_of_death;
    if(dod){
        return moment(dod).format("MMMM Do, YYYY");
    }
    return dod;
});

authorSchema.virtual("url").get(function(){
    return '/catalog/author/' + this._id;
});

var AuthorModel = mongoose.model("Author", authorSchema, "AuthorModel");

module.exports = AuthorModel;