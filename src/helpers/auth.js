/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 14/07/2023 18:08:54
 */

/**
 * Please : Install package jsonwebtoken => npm i jsonwebtoken
 */
const jwt = require('jsonwebtoken');
const moment = require('moment');
const UserModel = require('../models/userModel.js');

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await UserModel.findOne({ email: decodeToken.email }, {
            password: 0,
            verifyAccountToken: 0,
            verifyAccountExpires: 0,
            resetPasswordExpires: 0,
            resetPasswordToken: 0
        })

        if (req.body.userId && req.body.userId !== decodeToken._id) {
            return res.status(401).json({
                status: 401,
                message: 'Invalid User ID',
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })
        } else {
            req.userId = decodeToken?._id
            req.user = user
            next()
        }

    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: "Token not found !",
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        })
    }
}

const admin =  async (req, res, next) => {
    try {
        //console.log("req.headers.authorization ",req.headers);
        const token = req.headers.authorization.split(' ')[1];
        const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET);


        const user = await UserModel.findOne({ email: decodeToken.email }, {
            password: 0,
            verifyAccountToken: 0,
            verifyAccountExpires: 0,
            resetPasswordExpires: 0,
            resetPasswordToken: 0
        })

        const ip = requestIp.getClientIp(req)
        // let isAuthorizedIps = await authorizedIpModel.findOne({ ip: ip })

        // console.log(isAuthorizedIps);
        if (process.env.NODE_ENV !== "development") {
            // if (!isAuthorizedIps) {
            //     return res.status(401).json({
            //         status: 401,
            //         message: 'Not Authorization !'
            //     })
            // }

        }

        // console.log(user.roles);
        
        if (!user.roles.includes("ROLE_ADMIN")) {
            return res.status(401).json({
                status: 401,
                message: 'Not Authorization !',
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })
        } else {
            console.log("next");
            req.userId = decodeToken?._id
            req.userStatus = "ADMIN"
            next()
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 500,
            message: "Not Authorization !",
            request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
        })
    }
}

module.exports = {
    auth,
    admin
}