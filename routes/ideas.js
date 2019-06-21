const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');


//Load Idea Models
require('../models/Idea');

//Mapping ideas model to Idea
const Idea = mongoose.model('ideas');

//Idea Index Page
router.get('/', ensureAuthenticated, (req, res) => {
    //We want all of the ideas so we pass empty curly brace
    //Idea coming from the user should match the logged in user id
    Idea.find({user: req.user.id})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index',{
                ideas:ideas
            });
        });
});

//Add Idea Form
router.get('/add', ensureAuthenticated, (req, res) =>{ 
    res.render('ideas/add');
});

//Edit Idea Form
router.get('/edit/:id', (req, res) =>{
    //it will find one parameter i.e ID, not an array
    Idea.findOne({
        //It will get whatever is passed in the url
        _id: req.params.id
    })
    .then(idea => {
        if(idea.user != req.user.id){
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/ideas');
        }
        else{
            res.render('ideas/edit', {
                idea: idea
            });
        }
    })
    
});

//Process Form on add idea page
router.post('/', (req, res)=>{
    //After form is submitted
    let errors = [];

    if (!req.body.title){
        errors.push({text: 'Please add title'});
    }
    if (!req.body.details){
        errors.push({text: 'Please add some details'});
    }

    if(errors.length > 0){
        //Passing values to ideas/add
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                console.log(idea);
                req.flash('success_msg', 'Video idea added');
                res.redirect('/ideas');
            })
    }
});

//Edit Form Process
router.put('/:id',ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        //new values
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
            .then(idea =>{
                req.flash('success_msg','Video idea updated');
                res.redirect('/ideas');
            })
    }); 
});

router.delete('/:id',ensureAuthenticated, (req, res)=>{
    Idea.remove({
        _id: req.params.id
    })
        .then(()=>{
            req.flash('success_msg', 'Video idea removed');
            res.redirect('/ideas');
        });
});


module.exports = router ;