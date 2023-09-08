var ffmpeg = require('ffmpeg');
var fs = require('fs');


module.exports = {
    extractVideoPosterImages: (fileUrl, videoId) => {
        return new Promise((resolve, reject) => {
            console.log("===============  extractVideoPosterImages ===================");
            console.log({ fileUrl });
            var result = []
            // console.log(result);
            if (fileUrl) {
                // traitement 
                try {
                    var process = new ffmpeg(fileUrl);
                    process.then(function (video) {
                        // Callback mode
                        ;
                        fs.mkdir("./public/assets/images/poster_"+videoId, (err) => {
                            // if (err) console.log(err)
                            var name = Math.floor(Math.random() * Math.floor(152524521325)).toString();
                            name += Math.floor(Math.random() * Math.floor(1552252325)).toString();
                            name += Math.floor(Math.random() * Math.floor(85455458652325)).toString();
                            name += Math.floor(Math.random() * Math.floor(8544652325)).toString();
                            video.fnExtractFrameToJPG("./public/assets/images/poster_"+videoId, {
                                frame_rate: 1,
                                number: 5,
                                file_name: name
                            }, function (error, files) {
                                if (error) {
                                    console.log({ "error fnExtractFrameToJPG": error });
                                    return result
                                }
                                result = files
                                //   console.log(result);
                                //  console.log({files});
                                console.log('Frames: ' + files);
                                resolve(result)
                            });
                        })
                       
                    }, function (err) {
                        console.log('Error: ' + err);
                        resolve(result)
                    });
                } catch (err) {
                    console.log({ err });
                    resolve(result)
                }
            }
        })


    }
}