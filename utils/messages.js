const moment = require('moment');//1

//2
function formatMessage(username, text){
	return{
		username,
		text,
		time: moment().format('h:mm a')
	}
}

module.exports = formatMessage; //3