/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 14/07/2023 18:08:54
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const profileSchema = new Schema({
    'content' : String,
	'videoId' : {
		type: Schema.Types.ObjectId,
		ref: 'Video'
	},
	'userId' : {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
    'created_at' : {type: Date, default: new Date()},
	 'created_formatted_with_time_since' : String,
	 'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('comment', profileSchema);
