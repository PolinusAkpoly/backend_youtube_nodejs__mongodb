/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 14/07/2023 18:08:54
 */
const moment = require('moment')
const bcrypt = require('bcrypt')
const UserModel = require('../models/userModel.js');
const profileModel = require('../models/profileModel.js');
const randomToken = require('random-token')
const jwt = require('jsonwebtoken')


/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * userController.signupUser()
     */
    signupUser: async (req, res, next) => {

        try {
            let { firstname, lastname, full_name, receivePromoMessage, email, password, created_at } = req.body

            firstname = firstname ? firstname.toUpperCase() : null
            lastname = lastname ? lastname[0].toUpperCase() + lastname.slice(1) : null
            full_name = full_name ? full_name[0].toUpperCase() + full_name.slice(1) : null
            // REGEX for E-mail validation
            const reg = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/

            if (full_name === '' || full_name == null) {
                return res.status(422).json({
                    status: 422,
                    isSuccess: false,
                    'error': 'full_nameError',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                })
            }
            if (email === '' || email == null || !reg.test(email)) {
                return res.status(422).json({
                    status: 422,
                    isSuccess: false,
                    'error': 'emailError',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                })
            }
            if (password.length < 6 || password == null) {
                return res.status(422).json({
                    status: 422,
                    isSuccess: false,
                    'error': 'passwordError',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                })
            }

            const userEmailExist = await UserModel.findOne({ email: email })

            if (userEmailExist) {
                return res.status(422).json({
                    status: 422,
                    isSuccess: false,
                    'error': 'Cet email est déjà utilisé, Merci de le changer.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                })
            }
            // If username or email is not used
            bcrypt.hash(password, 10, async (err, password) => {
                if (err) {
                    return res.status(500).json({
                        status: 500,
                        isSuccess: false,
                        'message': "Erreur serveur. Veuillez réessayer plus tard.",
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    })
                }

                const profile = new profileModel({ firstname, full_name, lastname, email, created_at })
                const user = new UserModel({ firstname, full_name, lastname, email, password, created_at })
                // const networkInformation = await getIpData(req)

                // if (receivePromoMessage) {
                //     user.receivePromoMessage = receivePromoMessage
                // }

                profile.userId = user._id
                user.profile = profile._id

                const token = randomToken(152);
                user.verifyAccountToken = token
                user.verifyAccountExpires = Date.now() + 3600000

                // if (networkInformation.status !== "fail") {
                //     user.networkInformation = networkInformation
                // }
                await user.save()
                await profile.save()

                // Welcome Email
                // const data = await getClientData(req)
                // emailSender.welcomeuser(user, data)

                // ///verify Account
                // emailSender.verifyEmail(user, data)

                res.status(200).json({
                    status: 200,
                    isSuccess: true,
                    'message': 'Inscription réussie.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                })

            })



        } catch (error) {

            console.log(error)

            res.status(500).json({
                status: 500,
                isSuccess: false,
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })
        }
    },

    signinUser: async (req, res) => {
        console.log(req.body);
        try {
            const user = await UserModel.findOne({ email: req.body.email })
            if (!user) {
                return res.status(404).json({
                    status: 404,
                    isSuccess: false,
                    'message': 'User not found !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            bcrypt.compare(req.body.password, user.password, (err, valid) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        status: 500,
                        isSuccess: false,
                        'message': err.message,
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }
                if (!valid) {
                    return res.status(401).json({
                        status: 401,
                        isSuccess: false,
                        'message': "Bad Password !",
                        request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                    });
                }

                return res.status(200).json({
                    isSuccess: true,
                    userId: user._id,
                    email: user.email,
                    token: jwt.sign(
                        { userId: user._id },
                        process.env.TOKEN_SECRET,
                        { expiresIn: process.env.TOKEN_EXPIRATION }
                    )
                })

            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                status: 500,
                isSuccess: false,
                'message': err.message,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
      
    },
    /**
  * Generate By Mudey Formation (https://mudey.fr)
  * userController.getUsers()
  */
    getUsersByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await UserModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let users = await UserModel.find({})
                // .populate("name")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            users = users.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                allCount: allCount,
                resultCount: users.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: users.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting user.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * userController.getUsers()
     */
    getUsers: async (req, res) => {
        try {
            const users = await UserModel.find({})

            return res.json({
                isSuccess: true,
                status: 200,
                resultCount: users.length,
                results: users,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting user.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * userController.showUserById()
     */
    searchUserByTag: async (req, res) => {
        try {

            let filter = {}
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5



            const email = req.query?.email ? new RegExp(req.query.email, 'i') : null
            const name = req.query?.name ? new RegExp(req.query.name, 'i') : null
            const content = req.query?.content ? new RegExp(req.query.content, 'i') : null
            const description = req.query?.description ? new RegExp(req.query.content, 'i') : null
            const startDate = req.query?.startDate ? new Date(req.query?.startDate) : null
            const endDate = req.query?.endDate ? new Date(req.query?.endDate) : null

            if (email) {
                filter.email = email
            }
            if (name) {
                filter.name = name
            }
            if (content) {
                filter.content = content
            }
            if (description) {
                filter.description = description
            }
            if (startDate) {
                filter.created_at = { $gt: startDate }
            }

            if (endDate) {
                if (filter.created_at) {
                    filter.created_at = { ...filter.created_at, $lt: endDate }
                } else {
                    filter.created_at = { $lt: endDate }
                }
            }

            let allCount = await UserModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let users = await UserModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            users = users.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                filter: req.query,
                resultCount: allCount,
                allCount: allCount,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: users.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting user.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * userController.showUserById()
     */
    showUserById: async (req, res) => {
        try {
            const id = req.params.id;
            const user = await UserModel.findOne({ _id: id })

            if (!user) {
                return res.status(404).json({
                    isSuccess: false,
                    status: 404,
                    message: 'No such user',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                result: user,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting user.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * userController.createUser()
     */
    createUser: async (req, res) => {
        try {


            if (req.file) {
                var user = JSON.parse(req.body.user)
            } else {
                var { user } = req.body
            }

            if (!user) {
                return res.status(500).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Missing params of user.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys(user).length) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Empty user !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            // if (req.file) {
            //     user.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/${req.file.filename}`
            // }

            user = new UserModel({ ...user })

            user.created_at = user?.created_at ? user.created_at : new Date()

            await user.save()

            return res.status(201).json({
                isSuccess: true,
                status: 201,
                message: "user is saved !",
                user,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when creating user.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * userController. updateUserById()
     */
    updateUserById: async (req, res) => {
        try {
            const id = req.params.id;
            if (req.file) {
                var user = JSON.parse(req.body.user)
            } else {
                var { user } = req.body
            }

            if (!user) {
                return res.status(500).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Missing params of user.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(user).length) {
                return res.status(500).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Empty user !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            // if (req.file) {
            //     console.log({ imageUrl: user.imageUrl });
            //     const old_image = user.imageUrl
            //     user.imageUrl = `${req.protocol}://${req.get('host')}/assets/files/${req.file.filename}`

            //     if (old_image) {
            //         const filename = "public/assets/" + old_image.split('/assets/')[1];
            //         console.log({ filename });
            //         fs.unlink(filename, (err) => {
            //             if (err) {
            //                 console.log(err.message);
            //             }
            //         });
            //     }
            // }

            user.updated_at = user?.updated_at ? user.updated_at : new Date()

            delete user?._id
            await UserModel.updateOne({ _id: id }, { ...user })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                message: "user is updated !",
                user,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when updating user.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * userController.sortUserByPosition
     */
    sortUserByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await UserModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                status: 200,
                isSuccess: true,
                message: "user sorted !",
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                status: 500,
                isSuccess: false,
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })

        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * userController.removeUserById()
     */
    removeUserById: async (req, res) => {
        try {
            var id = req.params.id;

            const user = await UserModel.findOne({ _id: id }, { imageUrl: true })
            if (user) {
                // const old_image = user.imageUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await UserModel.deleteOne({ _id: id })


                return res.status(204).json({
                    // 204 No Content
                    // isSuccess: true,
                    // status: 204,
                    // message: 'Data deleted ! .',
                });

            }

            return res.status(204).json({
                // 204 No Content
                // isSuccess: true,
                // status: 204,
                // message: 'Data deleted ! .',
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when deleting user.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
