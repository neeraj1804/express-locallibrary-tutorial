var mongoose = require("mongoose");
var moment = require("moment");

var Schema = mongoose.Schema;

var bookInstanceSchema = new Schema({
    book: {type: Schema.Types.ObjectId, ref: "Book", required: true},
    imprint: {type: String, required: true},
    status: {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
    due_back: {type: Date, default: Date.now}
});

bookInstanceSchema.virtual("url").get(function(){
    return "/catalog/bookinstance/" + this._id;
});

bookInstanceSchema.virtual("due_date_formatted").get(function(){
    return moment(this.due_back).format('MMMM Do, YYYY');
});

var BookInstanceModel = mongoose.model("BookInstance", bookInstanceSchema, "BookInstanceModel");

module.exports = BookInstanceModel;