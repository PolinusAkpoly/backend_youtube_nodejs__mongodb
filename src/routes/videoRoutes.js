/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 14/07/2023 18:02:22
 */
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController.js');
const uploadFileConfig = require('../../config/upload.file.config.js');
// const videoValidator = require('../../config/video.validator.js');

/*
 * GET 
 */
router.get('/', /*auth.admin,*/ videoController.getVideos);

/*
 * GET 
 */
router.get('/by/page', /*auth.admin,*/ videoController.getVideosByPage);

/*
 * GET 
 */
router.get('/search', /*auth.admin,*/ videoController.searchVideoByTag);

/*
 * GET
 */
router.get('/:id', /*auth.admin,*/ videoController.showVideoById);

/*
 * POST
 */
router.post('/', uploadFileConfig , /*auth.admin,*/ videoController.createVideo);
/*
 * POST
 */
router.post('/sort', /*auth.admin,*/ videoController.sortVideoByPosition);

/*
 * PUT
 */
router.put('/:id', uploadFileConfig, /*auth.admin,*/ videoController.updateVideoById);

/*
 * DELETE
 */
router.delete('/:id', /*auth.admin,*/ videoController.removeVideoById);

module.exports = router;
