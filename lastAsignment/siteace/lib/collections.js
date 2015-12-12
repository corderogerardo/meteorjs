Websites = new Mongo.Collection("websites");

//set up security on siteace
Websites.allow({
	insert: function (userId, doc) {
		//...
		console.log("testing security on image insert");
		if(Meteor.user()){
			if(userId != doc.createdBy){
				return false;
			}
			else{
				return true;
			}
		}
		else{
			return false;
		}
	},
	update: function (userId, doc, fields, modifier) {
		//...
		console.log("testing security on image update");
		if(Meteor.user()){
			return true; // they are logged in
		}
		else{
			return false;//user not logged in - do not let them update (rate) the image.
		}
	},
	remove: function (userId, doc) {
		//...
		return true;
	},
	
});