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

dojo.provide("apstrata.explorer.Blog")
dojo.provide("apstrata.explorer.BlogPost")
dojo.provide("apstrata.explorer.BlogPosts")
dojo.provide("apstrata.explorer.BlogGallery")

dojo.declare("apstrata.explorer.Blog",
[apstrata.widgets.layout.HStackableList], 
{
	data: [
		{label: "Posts", iconSrc: "../../apstrata/resources/images/pencil-icons/file.png"},
		{label: "Gallery", iconSrc: "../../apstrata/resources/images/pencil-icons/picture.png"},
		{label: "Favourites", iconSrc: "../../apstrata/resources/images/pencil-icons/star.png"},
		{label: "Tags", iconSrc: "../../apstrata/resources/images/pencil-icons/tag.png"},
		{label: "New Post", iconSrc: "../../apstrata/resources/images/pencil-icons/notepad.png"},
		
	],
	
	onClick: function(index, label) {
		var self = this
		var w
		
		this.closePanel()
		
		if (label=='Posts') this.openPanel(apstrata.explorer.BlogPosts)
		if (label=='New Post') this.openPanel(apstrata.explorer.BlogPost)
		if (label=='Gallery') this.openPanel(apstrata.explorer.BlogGallery)
	}
})

dojo.require("dijit.form.Form")
dojo.require("dijit.form.ValidationTextBox")
dojo.require("dijit.Editor")
dojo.require("dojox.form.FileInput")
dojo.require("dijit.form.Button")

dojo.require("apstrata.widgets.PageNumberSelector")
dojo.require("apstrata.ItemApsdbReadStore")
dojo.require("apstrata.GetFile")

dojo.declare("apstrata.explorer.BlogPost", 
[dijit._Widget, dojox.dtl._Templated, apstrata.widgets.layout._HStackableMixin], 
{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl("apstrata.explorer", "templates/BlogPost.html"),

	maximizePanel: true,
	
	constructor: function() {
		
	},
	
	postCreate: function() {
		var self = this
		
		dojo.addClass(this.domNode, 'blogPost')

		this.inherited(arguments)
	},
	
	SavePost: function() {
		var self = this

		if (this.blogForm.validate()) {
			var attrs = {
				action: "SaveDocument",
				formNode: self.blogForm.domNode,
				fields: {
					"blogPost.apsdb.fieldType": "text",
					formType: "blog",
					blogPost: self.edtrPost.getValue(),
					hasImage: (self.upldPhoto.fileInput.value!="")
				},
				apsdb: {
					store: "wiki",
				},
				load: function(operation) {
					console.dir(operation)
				},
				error: function(operation) {
					console.dir(operation)
					console.debug("error")
				}
			}
			
			this.getContainer().client.call(attrs)
		}
	},
	
	destroy: function() {
		this.inherited(arguments)
	}
})

dojo.declare("apstrata.explorer.BlogPosts", 
[dijit._Widget, dojox.dtl._Templated, apstrata.widgets.layout._HStackableMixin], 
{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl("apstrata.explorer", "templates/BlogPosts.html"),
	
	items: [],
	maximizePanel: true,
	query: "formType=\"blog\"",
	
	constructor: function() {
	},

	fetch: function() {
		var self = this
		
		var getFile = new apstrata.GetFile(this.getContainer().client.connection)
		
		var args = {
			onComplete: function(items, request) {
				self.items = []
				dojo.forEach(items, function(item) {
					var o = {
						documentKey: item.documentKey,
						creationTime: item.getValue('apsdb.creationTime'),
						title: item.getValue('title')?item.getValue('title'):"",
						blogPost: item.getValue('blogPost')?item.getValue('blogPost'):"",
						hasImage: item.getValue('hasImage')?item.getValue('hasImage'):false,
					}
					
					if (item.getValue("apsdb_attachments")) {
						var attrs = {
								store: "wiki",
								documentKey: item.documentKey,
								fieldName: "apsdb_attachments",
								fileName: item.getValue("apsdb_attachments"),
								setContentDisposition: "false"
							}
						
						o.image = getFile.getUrl(attrs)
					} 

					self.items.push(o)
				})
				
				self.render()
			},
			
			onError: function(errorData, request) {
			},
			
            query: {
				query: self.query,
				sort: "apsdb.creationTime[date]: DESC",
				count: true,
				pageNumber: 1
			}
		}
		
		this.store.fetch(args)
	},

	postCreate: function() {
		var self = this
		
		var args = {client: self.getContainer().client, apsdbStoreName: "wiki", fields:"apsdb.documentKey, apsdb.creationTime, formType, title, blogPost, apsdb_attachments, hasImage", label: "title", resultsPerPage: 50}
		this.store = new apstrata.ItemApsdbReadStore(args)

		this.fetch()

		this.inherited(arguments)
	},
	
	render: function() {
		this.inherited(arguments)		
	}
})

dojo.declare("apstrata.explorer.BlogGallery", 
[apstrata.explorer.BlogPosts], 
{
	templatePath: dojo.moduleUrl("apstrata.explorer", "templates/BlogGallery.html"),
	query: "(formType=\"blog\") AND (hasImage=\"true\")"

})