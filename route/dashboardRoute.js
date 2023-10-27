const express = require('express');
const router = express.Router();
const isLogin = require ('../middleware/isLogin')
const dashboardController = require('../controler/dashboardControler');

//Dashboard routes
router.get('/dashboard', isLogin.isLogin, dashboardController.dashboard)

//Create note
router.get('/dashboard/add-note', isLogin.isLogin, dashboardController.viewAddNote)
router.post('/dashboard/add-note', isLogin.isLogin, dashboardController.createNotes)

//Delete note
router.delete('/delete-note/:id',isLogin.isLogin,dashboardController.deleteNote)

//View one note and update that note
router.get('/dashboard/note/:id', isLogin.isLogin, dashboardController.viewNote)
router.put('/dashboard/note/:id', isLogin.isLogin, dashboardController.updateNote)

//Search note
router.post('/dashboard/search', isLogin.isLogin, dashboardController.searchNote)

module.exports = router;