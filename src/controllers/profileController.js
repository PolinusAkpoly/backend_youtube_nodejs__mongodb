

const fs = require('fs')
const moment = require('moment')
const profileModel = require('../models/profileModel.js');
// const { profile } = require('console');




module.exports = {
     
    getProfile: async (req, res) => {
        try {
            const profile = await profileModel.find({})

            return res.json({
                isSuccess: true,
                status: 200,
                resultCount: profile.length,
                results: profile,
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