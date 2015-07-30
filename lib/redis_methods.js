module.exports = {

	addUserToDB: function(classAttributes){
		//check for "username/ID"-hash in DB(, if it doesnt exist create it)
		client.exists("ListOfUsers", function(err, replies) {
			if (err) {
				console.log(err);
				return;
			} else {
				console.log(replies);
				return replies;
			}
		});
		//check if username is taken, if it is return error
		//if not, create a username-ID key-value pair ( ID has to be a random unique ID, if ID is taken generate new one) and return ID
		//
		//create hash with role:ID, containing name, username, password, role, 
	},


};