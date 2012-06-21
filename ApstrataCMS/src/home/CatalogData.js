dojo.provide("apstrata.home.CatalogData")

dojo.require("dojox.dtl._Templated")
dojo.require("dojo.store.Memory")

dojo.declare("apstrata.home.CatalogData",
null, 
{
	
	scripts: [
//		{icon: "DatabaseAPI.png", name: "Database API"},
//		{icon: "AppleICloudAPI.png", name: "Apple iCloud API"},
//		{icon: "GoogleDocs.png", name: "Google docs"},
//		{icon: "MailAPI.png", name: "Mail API"},
//		{icon: "FullTextSearchAPI.png", name: "FullText search API"},
//		{icon: "behance_128px.png", name: "Behance post"},
//		{icon: "lastfm_128px.png", name: "Last FM data"},
//		{icon: "vimeo_128px.png", name: "Vimeo post"},
//		{icon: "UserManagementAPI.png", name: "User management API"},
//		{icon: "vimeo_128px.png", name: "Vimeo data"},
//		{icon: "delicious_128px.png", name: "Delicious post"},
//		{icon: "rss.png", name: "Create feed"},
//		{icon: "linkedin_128px.png", name: "Linkedin post"},
//		{icon: "digg_128px.png", name: "Digg post"},
//		{icon: "YoutubeData.png", name: "Youtube data"},
//		{icon: "YoutubePost.png", name: "Youtube post"},
//		{icon: "FacebookStatus.png", name: "Facebook status"},
//		{icon: "FacebookQuery.png", name: "Facebook query"},
//		{icon: "FacebookPhoto.png", name: "Facebook photo"},
//		{icon: "FacebookLogin.png", name: "Facebook login"},
//		{icon: "flickr_128px.png", name: "Flickr data"},
//		{icon: "flickr_128px.png", name: "Flickr post"}
	],
	
	social: [
	 	{icon: "TwitterLogin.png", name: "Twitter Login", wikiDoc: "Twitter", tryIt: "false", getSampleCode: "false" },
		{icon: "TwitterTimeline.png", name: "Twitter TimeLine", wikiDoc: "Twitter", tryIt: "false", getSampleCode: "false" },
		{icon: "TwitterPost.png", name: "Twitter Post", wikiDoc: "Twitter", tryIt: "false", getSampleCode: "false" },
		{icon: "FacebookLogin.png", name: "Facebook Login", wikiDoc: "Facebook", tryIt: "false", getSampleCode: "false" },
		{icon: "Facebook.png", name: "Facebook", wikiDoc: "Facebook"}//,
//		{icon: "LinkedinLogin.png", name: "LinkedIn Login", wikiDoc: "LinkedIn"},
//		{icon: "Linkedin.png", name: "LinkedIn", wikiDoc: "LinkedIn"},
//		{icon: "google_128px.png", name: "Google", wikiDoc: "Google"},
//		{icon: "youtube_128px.png", name: "YouTube", wikiDoc: "Google"}
	],
	
	apis: [ 
			{ name: "AddCertificate", apiType: "push notification", icon: "Push-AddCertificate", getSampleCode: "false" },
			{ name: "CreateChannel", apiType: "push notification", icon: "Push-CreateChannel", getSampleCode: "false" },
			{ name: "CreateStore", apiType: "persistence", icon: "Create", getSampleCode: "false" }, 

			{ name: "DeleteDocument", apiType: "persistence", getSampleCode: "false" }, 
			{ name: "DeleteGroup", apiType: "identity", getSampleCode: "false" }, 
			{ name: "DeleteSavedQuery", apiType: "persistence", getSampleCode: "false" }, 


			{ name: "DeleteSchema", apiType: "persistence", getSampleCode: "false" }, 
			{ name: "DeleteScript", apiType: "orchestration", getSampleCode: "false" }, 
			{ name: "DeleteStore", apiType: "persistence", getSampleCode: "false" }, 
			{ name: "DeleteToken", apiType: "identity", getSampleCode: "false" }, 
			{ name: "DeleteUser", apiType: "identity", getSampleCode: "false" }, 
			{ name: "GetChannel", apiType: "push notification", getSampleCode: "false" },
			{ name: "GetFile", apiType: "persistence", getSampleCode: "false" }, 
			{ name: "GetInvalidTokens", apiType: "push notification", getSampleCode: "false" },
			{ name: "GetSavedQuery", apiType: "persistence", getSampleCode: "false" }, 
			{ name: "GetSchema", apiType: "persistence", getSampleCode: "false" }, 
			{ name: "GetScript", apiType: "orchestration", getSampleCode: "false" }, 
			{ name: "GetScriptLogs", apiType: "orchestration", getSampleCode: "false" },
			{ name: "GetUser", apiType: "identity", getSampleCode: "false" }, 
			{ name: "ListConfiguration", apiType: "configuration", getSampleCode: "false" }, 
			{ name: "ListGroups", apiType: "identity", getSampleCode: "false" }, 
			{ name: "ListSavedQueries", apiType: "persistence", getSampleCode: "false" }, 
			{ name: "ListSchemas", apiType: "persistence", getSampleCode: "false" }, 
			{ name: "ListScripts", apiType: "orchestration", getSampleCode: "false" }, 
			{ name: "ListStores", apiType: "persistence", getSampleCode: "false" }, 
			{ name: "ListUsers", apiType: "identity", getSampleCode: "false" }, 
			{ name: "PushNotification", apiType: "push notification", getSampleCode: "false" },
			{ name: "Query", apiType: "persistence", getSampleCode: "false" }, 
			{ name: "RemoveCertificate", apiType: "push notification", getSampleCode: "false" },
			{ name: "RemoveChannel", apiType: "push notification", getSampleCode: "false" },
			{ name: "RunScript", apiType: "orchestration", getSampleCode: "false" }, 
			{ name: "SaveConfiguration", apiType: "configuration", getSampleCode: "false" }, 
			{ name: "SaveDocument", apiType: "persistence", getSampleCode: "false" }, 
			{ name: "SaveGroup", apiType: "identity", getSampleCode: "false" }, 
			{ name: "SaveQuery", apiType: "persistence", getSampleCode: "false" }, 
			{ name: "SaveSchema", apiType: "persistence", getSampleCode: "false" }, 
			{ name: "SaveScript", apiType: "orchestration", getSampleCode: "false" }, 
			{ name: "SaveUser", apiType: "identity", getSampleCode: "false" }, 
			{ name: "SendEmail", apiType: "messaging", getSampleCode: "false" }, 
			{ name: "SubscribeTokens", apiType: "push notification", getSampleCode: "false" },
			{ name: "TagTokensAsInvalid", apiType: "push notification", getSampleCode: "false" },
			{ name: "Transaction", apiType: "persistence", getSampleCode: "false" }, 
			{ name: "UnsubscribeTokens", apiType: "push notification", getSampleCode: "false" },
			{ name: "UpdateCertificate", apiType: "push notification", getSampleCode: "false" },
			{ name: "UpdateChannel", apiType: "push notification", getSampleCode: "false" },
			{ name: "VerifyCredentials", apiType: "identity", getSampleCode: "false" } 

		],
		
		widgets: [
			{ icon: "Login.png", name: "Login", iconClass: "userManagement", tryIt: "false", getSampleCode: "false"  }, 
			{ icon: "Registration.png", name: "Registration", iconClass: "userManagement", tryIt: "false", getSampleCode: "false" }//, 
			//{ name: "User profile", iconClass: "userManagement" }, 
			//{ name: "Data form", iconClass: "form" }, 
			//{ name: "Data Grid", iconClass: "grid" }
		],
		
		sdks: [
			{ icon: "JavascriptSDK.png", name: "Javascript SDK", iconClass: "userManagement", wikiDoc: "Javascript+SDK", tryIt: "false", getSampleCode: "false" }, 
			{ icon: "AndroidSDK.png", name: "Android SDK", iconClass: "userManagement", wikiDoc: "Android", tryIt: "false", getSampleCode: "false" }
		],
		
		addTags: function(object, tags) {
			var t
			var tagLabel = "tags"
			if (dojo.isArray(tags)) t = tags; else t=[tags]
			
			if (object[tagLabel]) {
				if (dojo.isArray(object[tagLabel])) object[tagLabel].push(t)
			} else {
				object[tagLabel] = t
			}
		},
		
		getServices: function() {
			var self = this
			var services = []
			
			var iconClasses = {
				userManagement: "user-boss.png",
				form: "survey.png",
				grid: "draft.png",
				persistence: "savedQuery.png",
				orchestration: "configuration.png",
				configuration: "configuration.png",
				identity: "user-boss.png",
				messaging: "mail.png",
				pushNotification: "alert.png",
				social: "social.png"
			}
			
			var i = 0
			
			dojo.forEach(this.apis, function(api) {
/*				
				if (!api.icon) if (iconClasses[api.apiType]) {
					api.icon = iconClasses[api.apiType]
				} else {
					api.icon = "Peristence-CreateStore.png"
				}
*/					
				api.label = api.name
				api.type = "REST API"
				if (!api.wikiDoc) api.wikiDoc = api.name
				api.id = i++

				api.icon = "REST/" + api.name + ".png"			
				self.addTags(api, ["REST API", api.apiType])
				
				services.push(api)
			})			

			dojo.forEach(this.scripts, function(service) {
				
				if (!service.icon) {
					service.icon = iconClasses[service.iconClass]
				}else {
					service.icon = "/Scripts/" + service.icon;
				}
				service.label = service.name
				service.type = "script"
				if (!service.wikiDoc) service.wikiDoc = service.name
				service.id = i++
				
				self.addTags(service, "script")
				
				services.push(service)
			})			


			dojo.forEach(this.widgets, function(widget) {

				if (!widget.icon) {
					widget.icon = iconClasses[widget.iconClass]
				}else {
					widget.icon = "/Widgets/" + widget.icon;
				}
				widget.label = widget.name
				widget.type = "widget"
				if (!widget.wikiDoc) widget.wikiDoc = widget.name
				widget.id = i++

				self.addTags(widget, ["widget", "HTML5"])
				
				services.push(widget)
			})		
			
			dojo.forEach(this.sdks, function(sdk) {
				
				if (!sdk.icon) {
					sdk.icon = iconClasses[iconClass];
				}else  {
					sdk.icon = "/Sdk/" + sdk.icon;
				}
				sdk.label = sdk.name
				sdk.type = "sdk"
				if (!sdk.wikiDoc) sdk.wikiDoc = sdk.name
				sdk.id = i++

				self.addTags(sdk, ["sdk", "mobile"])
				
				services.push(sdk)
			})	
			
			dojo.forEach(this.social, function(network) {
				var iconClass = network.iconClass;
				if(!network.iconClass){
					iconClass = "social";
				}
				if (!network.icon) {
					network.icon = iconClasses[iconClass];
				}else  {
					network.icon = "/Social/" + network.icon;
				}
				network.label = network.name;
				network.type = "social";
				if (!network.wikiDoc) network.wikiDoc = network.name
				network.id = i++;

				self.addTags(network, ["social", "HTML5"]);
				
				services.push(network);
			})	
			
			return services
		}
})