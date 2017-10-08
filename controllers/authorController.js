var Author = require('../models/author');
var Book = require('../models/book');
var async = require("async");
var moment = require("moment");

// Display list of all Authors
exports.author_list = function(req, res, next) {
    Author.find().sort([['family_name', 'ascending']]).exec(function(err, author_list){
        if(err){
            next(err);
        }else{
            res.render("author_list", {title: "Author List", author_list: author_list});
        }
    });
};

// Display detail page for a specific Author
exports.author_detail = function(req, res) {
    var author_id = req.params.id.trim();
    async.parallel({
        author: function(callback){
            Author.findById(author_id).exec(callback);
        },
        author_books: function(callback){
            Book.find({author: author_id}, 'title summary').exec(callback);
        }
    }, function(err, results){
        if(err){
            next(err);
        }else{
            res.render("author_detail", {title: "Author Detail", author: results.author, author_books: results.author_books});
        }
    });
};

// Display Author create form on GET
exports.author_create_get = function(req, res) {
    res.render('author_form', {title: "Create Author"});
};

// Handle Author create on POST
exports.author_create_post = function(req, res, next) {
    req.checkBody('first_name', 'First Name must be specified.').notEmpty();
    req.checkBody('family_name', 'Family Name must be specified.').notEmpty();
    req.checkBody('family_name', 'Family Name must be alphenumeric.').isAlpha();
    req.checkBody('date_of_birth', 'Invalid Date').optional({checkFalsy: true}).custom(value => {
        var d = moment(value, "DD-MM-YYYY");
        if(d.isValid()){
            return true;
        }else{
            return false;
        }
    });
    req.checkBody('date_of_death', 'Invalid Date').optional({checkFalsy: true}).custom(value => {
        var d = moment(value, "DD-MM-YYYY");
        if(d.isValid()){
            return true;
        }else{
            return false;
        }
    });

    req.sanitize('first_name').escape();
    req.sanitize('family_name').escape();
    req.sanitize('first_name').trim();     
    req.sanitize('family_name').trim();
    req.sanitize('date_of_birth').toDate();
    req.sanitize('date_of_death').toDate();

    var errors = req.validationErrors();
    
    var author = new Author({
        first_name: req.body.first_name, 
        family_name: req.body.family_name, 
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death
    });

    if(errors){
        res.render("author_form", {title: "Create Author", errors: errors, author: author});
    }else{
        author.save(function(err){
            if(err){
                return next(err);
            }else{
                res.redirect(author.url);
            }
        });
    }
};

// Display Author delete form on GET
exports.author_delete_get = function(req, res, next) {
    async.parallel({
        author: function(callback) {     
            Author.findById(req.params.id).exec(callback);
        },
        authors_books: function(callback) {
          Book.find({ 'author': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books } );
    });
};

// Handle Author delete on POST
exports.author_delete_post = function(req, res) {
    req.checkBody('authorid', 'Author id must exist').notEmpty();  
    
    async.parallel({
        author: function(callback) {     
            Author.findById(req.body.authorid).exec(callback);
        },
        authors_books: function(callback) {
          Book.find({ 'author': req.body.authorid },'title summary').exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //Success
        if (results.authors_books.length > 0) {
            //Author has books. Render in same way as for GET route.
            res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books } );
            return;
        }
        else {
            //Author has no books. Delete object and redirect to the list of authors.
            Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
                if (err) { return next(err); }
                //Success - got to author list
                res.redirect('/catalog/authors');
            });

        }
    });
};

// Display Author update form on GET
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};