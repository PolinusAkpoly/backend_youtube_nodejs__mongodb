/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 14/07/2023 18:08:54
 */
const express = require('express');
const { admin, auth } = require('../helpers/auth');
const router = express.Router();
const userController = require('../controllers/userController.js');

/*
 * GET 
 * Get all Users
 */
router.get('/', /*auth.admin,*/ userController.getUsers);

/*
 * GET 
 * Get all Users by page
 */
router.get('/by/page', /*auth.admin,*/ userController.getUsersByPage);

/*
 * GET 
 * Get one User
 */
router.get('/:id', /*auth.admin,*/ userController.showUserById);

/*
 * POST  
 * Create one Users
 */
router.post('/', /*auth.admin,*/ userController.createUser);

/*
 * POST
 * Signin one User
 */
router.post('/signin', userController.signinUser);

/*
 * POST
 * Signup one User
 */
router.post('/signup', userController.signupUser);

/*
 * POST
 * Sort Users data by position
 */
router.post('/sort', auth, userController.sortUserByPosition);

/*
 * PUT
 * Update one User
 */
router.put('/:id', auth, userController.updateUserById);

/*
 * DELETE
 * Delete one User
 */
router.delete('/:id', admin, userController.removeUserById);

module.exports = router;
