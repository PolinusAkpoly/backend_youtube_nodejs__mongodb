/**
 * Generate with Mudey Formation (https://mudey.fr)
 * Created at : 14/07/2023 18:02:22
 */

const fs = require('fs')
const moment = require('moment')
const VideoModel = require('../models/videoModel.js');
const { extractVideoPosterImages } = require('../helpers/videoHelpers.js');


/**
 * videoController.js
 *
 * @description :: Server-side logic for managing videos.
 */
module.exports = {

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * videoController.getVideos()
     */
    getVideosByPage: async (req, res) => {
        try {
            let pageNumber = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1
            let pageLimit = req.query?.pageLimit ? parseInt(req.query?.pageLimit) : 5

            let allCount = await VideoModel.find({}).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }

            let videos = await VideoModel.find({})
                // .populate("name")
                .sort("-created_at")
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            videos = videos.map((item) => {
                item.created_formatted_with_time_since = moment(item?.created_at).fromNow()
                return item
            })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                allCount: allCount,
                resultCount: videos.length,
                current: pageNumber,
                next: allCount > (pageNumber * pageLimit) ? pageNumber + 1 : null,
                previous: pageNumber - 1 > 0 ? pageNumber - 1 : null,
                results: videos.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            })


        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting video.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * videoController.getVideos()
     */
    getVideos: async (req, res) => {
        try {
            const videos = await VideoModel.find({
                // visibility: "PUBLIC"
            })
                .populate({
                    path: "userId",
                    select: "full_name email"
                })

            return res.json({
                isSuccess: true,
                status: 200,
                resultCount: videos.length,
                results: videos,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting video.',
                error: error,

                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * videoController.showVideoById()
     */
    searchVideoByTag: async (req, res) => {
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

            let allCount = await VideoModel.find(filter).count()

            if (pageNumber > Math.ceil(allCount / pageLimit)) {
                const value = Math.ceil(allCount / pageLimit)
                pageNumber = value > 0 ? value : 1
            }
            // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
            // .sort('-created_at')
            // .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            let videos = await VideoModel.find(filter)
                // .populate({ path: "account", options: { sort: { 'created_at': -1 } } })
                .sort('-created_at')
                .skip((pageNumber - 1) * pageLimit).limit(pageLimit)

            videos = videos.map((item) => {
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
                results: videos.slice(0, pageLimit),
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting video.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * videoController.showVideoById()
     */
    showVideoById: async (req, res) => {
        try {
            const id = req.params.id;
            const video = await VideoModel.findOne({ _id: id }).populate({
                path: "userId",
                select: "full_name email"
            })

            if (!video) {
                return res.status(404).json({
                    isSuccess: false,
                    status: 404,
                    message: 'No such video',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                result: video,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting video.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * videoController.showVideoById()
     */
    showVideoBySlug: async (req, res) => {
        try {
            const id = req.params.slug;
            const video = await VideoModel.findOne({ slug: slug })

            if (!video) {
                return res.status(404).json({
                    isSuccess: false,
                    status: 404,
                    message: 'No such video',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                result: video,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when getting video.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * videoController.createVideo()
     */
    createVideo: async (req, res) => {
        try {



            if (req?.files?.length) {
                var video = JSON.parse(req.body.video)
            } else {
                var { video } = req.body
            }

            video = typeof (video) === "string" ? JSON.parse(video) : video

            console.log(video.video);

            if (!video) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Missing params of video.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (!Object.keys(video).length) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Empty video !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/videos", (err) => {
                    // if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/videos/${file.filename}`, function (err) {
                    if (err) {
                        console.log(err);
                        return
                    }
                    console.log('Successfully renamed - moved!')
                })

                video.fileUrl = `${req.protocol}://${req.get('host')}/assets/files/videos/${file.filename}`

            }

            video = new VideoModel({ ...video })
            const fileUrl = `./public/assets/files/videos/${req?.files[0].filename}`
            const imagesVideoPosters = await extractVideoPosterImages(fileUrl, video._id)

            // video.poster_images = imagesVideoPosters


            video.poster_images = []
            imagesVideoPosters.forEach(imagesVideoPoster => {
                const posterImage = `${req.protocol}://${req.get('host')}` + imagesVideoPoster.split("./public")[1]
                console.log({posterImage})
                video.poster_images.push(posterImage)
            });



            video.created_at = video?.created_at ? video.created_at : new Date()

            // console.log(video);
            await video.save()




            return res.status(201).json({
                isSuccess: true,
                status: 201,
                message: "video is saved !",
                video,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when creating video.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },

    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * videoController. updateVideoById()
     */
    updateVideoById: async (req, res) => {
        try {
            const id = req.params.id;
            if (req?.files?.length) {
                var video = JSON.parse(req.body.video)
            } else {
                var { video } = req.body
            }
            try {
                var deleteFiles = JSON.parse(req.body?.deleteFiles)

            } catch (error) {
                var deleteFiles = []

            }
            video = typeof (video) == "string" ? JSON.parse(video) : video

            if (!video) {
                return res.status(422).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Missing params of video.',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }
            if (!Object.keys(video).length) {
                return res.status(500).json({
                    isSuccess: false,
                    status: 422,
                    message: 'Empty video !',
                    request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
                });
            }

            if (req?.files?.length) {
                const file = req?.files[0]
                fs.mkdir(process.cwd() + "/public/assets/files/videos", (err) => {
                    if (err) console.log(err)
                })
                fs.rename(process.cwd() + `/public/assets/files/${file.filename}`, process.cwd() + `/public/assets/files/video/${file.filename}`, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - moved!')
                })

                video.fileUrl = `${req.protocol}://${req.get('host')}/assets/files/videos/${file.filename}`

            }

            if (deleteFiles?.length) {
                deleteFiles.forEach(currentFileUrl => {
                    const filename = "public/assets/" + currentFileUrl.split('/assets/')[1];
                    console.log({ filename });
                    fs.unlink(filename, (err) => {
                        if (err) {
                            console.log(err.message);
                        }
                    });

                })
            }

            video.updated_at = video?.updated_at ? video.updated_at : new Date()

            delete video?._id
            await VideoModel.updateOne({ _id: id }, { ...video })

            return res.status(200).json({
                isSuccess: true,
                status: 200,
                message: "video is updated !",
                video,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                isSuccess: false,
                status: 500,
                message: 'Error when updating video.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });
        }
    },
    /**
     * Generate By Mudey Formation (https://mudey.fr)
     * videoController.sortVideoByPosition
     */
    sortVideoByPosition: (req, res) => {
        try {

            const { datas } = req.body

            datas.forEach(async (elt) => {
                await VideoModel.updateOne({ _id: elt._id }, {
                    $set: { position: elt.position }
                })
            });


            return res.status(200).json({
                status: 200,
                isSuccess: true,
                message: "video sorted !",
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
     * videoController.removeVideoById()
     */
    removeVideoById: async (req, res) => {
        try {
            var id = req.params.id;

            const video = await VideoModel.findOne({ _id: id }, { fileUrl: true })
            if (video) {
                // const old_image = video.fileUrl
                // if (old_image) {
                //     const filename = "public/assets/" + old_image.split('/assets/')[1];
                //     console.log({ filename });
                //     fs.unlink(filename, (err) => {
                //         if (err) {
                //             console.log(err.message);
                //         }
                //     });
                // }
                await VideoModel.deleteOne({ _id: id })


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
                message: 'Error when deleting video.',
                error: error,
                request_time: moment(new Date()).format("DD/MM/YY HH:mm:ss")
            });

        }
    }
};
