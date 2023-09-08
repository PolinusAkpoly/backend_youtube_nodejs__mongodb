

const fs = require('fs')
const moment = require('moment')
const commentModel = require('../models/commentModel.js');
// const { profile } = require('console');




module.exports = {
     
    getComment: async (req, res) => {
        try {
            const comment = await commentModel.find({})

            return res.json({
                isSuccess: true,
                status: 200,
                resultCount: comment.length,
                results: comment,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting profile.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },







}