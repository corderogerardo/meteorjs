/// routing


/// end routing

///infintescroll
	Session.set("websiteLimit",20);
	lastScrollTop = 0;
	$(window).scroll(function(event){
		//probamos si estamos cerca del final de la ventana
		if($(window).scrollTop() + (window).height() > $(document).height() - 100){
			//donde estamos en la pagina?
			var scrollTop = $(this).scrollTop();
			// probamos si estamos bajando?
			if(scrollTop > lastScrollTop){
				Session.set("websiteLimit", Session.get("websiteLimit") + 4);
			}
			lastScrollTop = scrollTop;
		}
	})

///accounts config
Accounts.ui.config({
	passwordSignupFields: 'USERNAME_AND_EMAIL' //  One of 'USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'USERNAME_ONLY', or 'EMAIL_ONLY' (default).
});
///



	/////
	// template helpers 
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			if(Session.get("voteFilter")){ //Filtros
				return Websites.find({createdBy:Session.get("voteFilter")},{sort:{createdOn:-1,votes:-1}},{reactive:true});
			} else{
				return Websites.find({}, {sort:{createdOn:-1,votes:-1}, limit:Session.get("websiteLimit")});			
			}
		},
		filtering_websites:function(){
			if(Session.get("voteFilter")){ //they set a filter
				return true;
			}else{
				return false;
			}
		},
		getFilterUser:function(){
			if(Session.get("userFilter")){
				var user = Meteor.users.findOne({_id:Session.get("userFilter")});
				return user.username;
			}
			else{
				return false;
			}
		},
		getUser:function(user_id){
			var user = Meteor.users.findOne({_id:user_id});
			if(user){
				return user.username;
			} else{
				return "guest";
			}
		}
	});


	/////
	// template events 
	/////

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Up voting website with id "+website_id);
			// put the code in here to add a vote to a website!
			Websites.update({_id:website_id}, 
					{$inc: {votes: 1}}
					);
			return false;// prevent the button from reloading the page
		}, 
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Down voting website with id "+website_id);

			// put the code in here to remove a vote from a website!
			Websites.update({_id:website_id}, {$inc: {votes: -1}}
				);
			return false;// prevent the button from reloading the page
		}
	})

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		}, 
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
			var url = $("#url").val();
			var title = $("#title").val();
			var description = $("#description").val();

			console.log("The url they entered is: "+url);
			
			//  put your website saving code in here!
			if(Meteor.user()){
				Websites.insert({
					url:url,
					title:title,
					description:description,
					createdOn: new Date(),
					createdBy:Meteor.user()._id
				});
			}	
			$("#website_form").toggle('slow');
			return false;// stop the form submit from reloading the page

		}
	});

