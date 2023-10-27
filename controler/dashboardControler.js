const User = require('../model/User');
const Note = require('../model/Note');
const mongoose = require('mongoose');

//View dashboard
const dashboard = async(req,res)=>{
    try {
        var name = req.user.name;
        let perPage = 8;
        let pageCurrent = req.query.page || 1;
        const notes = await Note.aggregate([
            {$match: {userId: new mongoose.Types.ObjectId(req.user.id)}},
            {$sort: {timestamps: -1}},
            {$project: {
                title: {$substr: ["$title",0,25]},
                body: {$substr: ["$body",0,100]}
                },
            },
            {$skip: perPage*(pageCurrent-1)},
            {$limit: perPage},
        ])
        const count = await Note.count(); 
        const locals = {
            title: 'Dashboard '
        }
        res.render('dashboard/dashboard',{
            locals,
            layout: './layouts/dashboardlayout',
            notes,  
            pages: Math.ceil(count/perPage),
            pageCurrent,
            name,
        })
    } catch (error) {
        console.log(error)
    }
    
}

//View add-note page + create note
const viewAddNote = async (req,res) => {
    try {
        res.render('dashboard/add-note',{
            layout: './layouts/dashboardlayout',
        })
    } catch (error) {
        console.log(error)
    }
}

const createNotes = async (req,res) => {
    try {
    const userId = req.session.passport.user;
    const note = await Note.create({
        userId: new mongoose.Types.ObjectId(userId),
        title: req.body.title,
        body: req.body.body,
    })
    res.redirect('/dashboard/dashboard')
    } catch (error) {
        console.log(error)
    }
}

//delete note
const deleteNote = async (req,res) => {
    const noteId = req.params.id;
    await Note.findByIdAndDelete(noteId);
    res.redirect('/dashboard/dashboard');
}

//view one notes and update that note
const viewNote = async (req,res)=>{
    try {
    const noteId = req.params.id;
    const note = await Note.findById(noteId);
    res.render('dashboard/note',{
        note,
        layout: './layouts/dashboardlayout',
    })
    } catch (error) {
        console.log(error)
    }
}

const updateNote = async (req,res) => {
    try {
        const noteId = req.params.id;
        await Note.findByIdAndUpdate(noteId,{
            title: req.body.title,
            body: req.body.body
        });
        res.redirect('/dashboard/dashboard');
    } catch (error) {
        console.log(error)
    }
}

//Search
const searchNote = async (req,res) => {
    try {
        let searchSubmit = req.body.search;
        const searchNoSpecialChar = searchSubmit.replace(/[^a-zA-Z0-9]/g,"");
        const result = await Note.find({
          $or: [
            {title: {$regex: new RegExp(searchNoSpecialChar,'i')}},
            {body: {$regex: new RegExp(searchNoSpecialChar,'i')}}
          ]
        })
        res.render('dashboard/search',{
          result,
          layout: './layouts/dashboardlayout'
        })
      } catch (error) {
        console.log(error)
      }
}



module.exports = {dashboard, createNotes, deleteNote, viewNote, viewAddNote, updateNote, searchNote};