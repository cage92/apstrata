/*******************************************************************************
 *  Copyright 2009 Apstrata
 *  
 *  This file is part of Apstrata Database Javascript Client.
 *  
 *  Apstrata Database Javascript Client is free software: you can redistribute it
 *  and/or modify it under the terms of the GNU Lesser General Public License as
 *  published by the Free Software Foundation, either version 3 of the License,
 *  or (at your option) any later version.
 *  
 *  Apstrata Database Javascript Client is distributed in the hope that it will be
 *  useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *  
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with Apstrata Database Javascript Client.  If not, see <http://www.gnu.org/licenses/>.
 * *****************************************************************************
 */
dojo.provide("apstrata.devConsole.DevConsole")

dojo.require("apstrata.horizon.Login")

dojo.require("apstrata.devConsole.HomePanel")
dojo.require("apstrata.devConsole.StoresPanel")
dojo.require("apstrata.devConsole.SchemasPanel")
dojo.require("apstrata.devConsole.ScriptsPanel")
dojo.require("apstrata.devConsole.PreferencesPanel")
dojo.require("apstrata.devConsole.GroupsPanel")
dojo.require("apstrata.devConsole.UsersPanel")

dojo.declare("apstrata.devConsole.MainPanel", 
[apstrata.horizon.HStackableList], 
{
	data: [
		{label: "home", iconSrc: "../../apstrata/resources/images/pencil-icons/home.png"},
		{label: "stores", iconSrc: "../../apstrata/resources/images/pencil-icons/datebase.png"},
		{label: "schemas", iconSrc: "../../apstrata/resources/images/pencil-icons/schema.png"},
		{label: "scripts", iconSrc: "../../apstrata/resources/images/pencil-icons/configuration.png"},
		{label: "groups", iconSrc: "../../apstrata/resources/images/pencil-icons/users.png"},
		{label: "users", iconSrc: "../../apstrata/resources/images/pencil-icons/user-man.png"},
		{label: "favourites", iconSrc: "../../apstrata/resources/images/pencil-icons/favourites.png"},
		{label: "preferences", iconSrc: "../../apstrata/resources/images/pencil-icons/tick.png"},
//		{label: "logout", iconSrc: "../../apstrata/resources/images/pencil-icons/left.png"}
	],
	
	postCreate: function() {
		var self = this
		
		dojo.subscribe("/apstrata/connection/login/success", function(data) {
			self.data.push({label: "logout", iconSrc: "../../apstrata/resources/images/pencil-icons/left.png"})
			self.render()
			
			if (self.openTarget) self.open(self.openTarget)
			delete self.openTarget
		})
		
		dojo.subscribe("/apstrata/connection/logout", function(data) {
			self.data.pop()
			self.render()
			self.open("home")
		})
	},

	onClick: function(index, label) {
		var self = this
		
		this.closePanel()
		
		switch (label) {
			case 'home': this.openPanel(apstrata.devConsole.HomePanel); break;
			case 'stores': this.openPanel(apstrata.devConsole.StoresPanel); break;
			case 'schemas': this.openPanel(apstrata.devConsole.SchemasPanel); break;
			case 'scripts': this.openPanel(apstrata.devConsole.ScriptsPanel); break;
			case 'groups': this.openPanel(apstrata.devConsole.GroupsPanel); break;
			case 'users': this.openPanel(apstrata.devConsole.UsersPanel); break;
			case 'favourites': this.openPanel(apstrata.devConsole.FavouritesPanel); break;
			case 'preferences': this.openPanel(apstrata.devConsole.PreferencesPanel); break;
			case 'logout':  this.container.connection.logout(); break;
		}
	},
	
	startup: function() {
		this.home()		
	},
	
	home: function() {
		this.closePanel()
		this.openPanel(apstrata.devConsole.HomePanel)
	}
})

dojo.declare("apstrata.devConsole.DevConsole",
[apstrata.horizon.HStackableContainer], 
{
	connection: null,
	
	constructor: function(attrs) {
		var self = this
		
		if (attrs) {
			if (attrs.connection) {
				this.connection = attrs.connection
			} 
		}

		if (!attrs.connection) this.connection = new apstrata.StickyConnection()

		this.client = new apstrata.Client({
			connection: self.connection,
			handleResult: function(operation) {},
			handleError: function(operation) {
				var errMsg 
				if (operation.response.metadata.errorDetail=="") {
					errMsg = operation.response.metadata.errorCode
				} else {
					errMsg = operation.response.metadata.errorDetail
				}
				
				var msg = 'Oops, there seems to be a problem:<br><br><b>' + errMsg + '</b>'
				self.alert(msg, self.domNode)
			}
		})
		
		this.margin = {}
		this.margin.w = 50
		this.margin.h = 145

/*
		this.margin.topH = 70
		this.margin.bottomH = 40
		this.margin.leftW = 25
		this.margin.rightW = 25
*/
		this.width = 450
		this.height = 250
	},
	
	postCreate: function() {
		var self = this

		dojo.addClass(this.domNode, 'horizon')

		// Create the background transparent div
		this.background = dojo.create("div", null, dojo.body())
		dojo.addClass(this.background, "horizonBackground")
		dojo.addClass(this.background, "rounded-sml")

		// Create the leftMost Panel
		this.main = new apstrata.devConsole.MainPanel({container: self})
		this.addChild(this.main)
		
		this.inherited(arguments)
	},
	
	alert: function(msg, origin) {
		var dialog = new apstrata.widgets.Alert({width: 300, 
												height: 250, 
												actions: "close", 
												message: msg, 
												clazz: "rounded-sml Alert", 
												iconSrc: apstrata.baseUrl + "/resources/images/pencil-icons/alert.png", 
												animation: {from: origin}, 
												modal: true })

		dialog.show()
		dojo.connect(dialog, "buttonPressed", function(label) {
			dialog.hide()
		})
	}
})