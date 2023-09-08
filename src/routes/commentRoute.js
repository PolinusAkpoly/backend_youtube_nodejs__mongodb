const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController.js');



router.get('/', /*auth.admin,*/ commentController.getComment);





module.exports = router;