/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 14/07/2023 18:08:54
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const profileSchema = new Schema({
    'picture' : String,
	'description' : String,
	'created_at' : {type: Date, default: new Date()},
	'userId' : {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	 'created_formatted_with_time_since' : String,
	 'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('profile', profileSchema);
