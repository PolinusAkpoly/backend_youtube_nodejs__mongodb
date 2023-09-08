/**
 * Generate By Mudey Formation (https://mudey.fr)
 * Created at : 14/07/2023 18:08:54
 */
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
	'full_name' : String,
	'email' : String,
	'password' : String,
	'created_at' : {type: Date, default: new Date()},
	
	// 'created_formatted_with_time_since' : String,
	// 'updated_formatted_with_time_since' : String
});

module.exports = mongoose.model('user', userSchema);
