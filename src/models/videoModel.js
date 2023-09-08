/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 14/07/2023 18:02:22
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({

	'name': { type: String, required: false },
	'description': { type: String, required: false },
	'fileUrl': { type: String, required: true },
	'created_at': { type: Date, default: new Date(), required: true },
	'userId': {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	'poster_images' : {type: Array, default: []},
	'visibility': { type: String, default: "PUBLIC" }, // PUBLIC ou PRIVATE ou UNLISTED
	'views': { type: Number, default: 0 }





	// 'name' : String,
	// 'description' : String,
	
	// 'fileUrl' : String,
	// 'created_at' : {type: Date, default: new Date()},
	// 'userId' : {
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'User'
	// },
	// 'created_formatted_with_time_since' : String,
	// 'updated_formatted_with_time_since' : String



});

module.exports = mongoose.model('video', videoSchema);
