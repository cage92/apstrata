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

dojo.provide("apstrata.mForms.Campaigns")
dojo.provide("apstrata.mForms.CampaignForm")

dojo.require("dijit.form.ValidationTextBox")
dojo.require("dijit.form.Button")
dojo.require("dojox.widget.Calendar")
dojo.require("dijit.form.TimeTextBox")
dojo.require("dijit.form.DateTextBox")
dojo.require("dijit.form.SimpleTextarea")
dojo.require('dijit.form.FilteringSelect')

dojo.require('dijit.Editor')
dojo.require("dojo.data.ItemFileReadStore")
dojo.require("dijit.form.ComboBox")

dojo.require("apstrata.util.DocumentUtils")

dojo.declare('apstrata.mForms.Campaigns',
[apstrata.horizon.HStackableList],
{
	data: [],
	storeName: "DefaultStore",
	editable: true,
		
	constructor: function() {
	},
	
	postCreate: function() {
		this.refresh()
		this.inherited(arguments)
	},
	
	refresh: function(){
		var self = this
		
		this.getContainer().client.call({
			action: "Query",
			request: {
				apsdb: {
					store: self.storeName,
					query: "formType=\"campaign\"",
					queryFields: "apsdb.documentKey,campaignName,target,formId,sms,email,startDate,startTime,endDate,endTime"
				}
			},
			load: function(operation){
				// Rearrange the result to suite the template
				
				self.data = []
				dojo.forEach(operation.response.result.documents, function(document) {
					var o = {
						'apsdb.documentKey': '',
						campaignName: '',
						formId: '',
						target: '',
						sms: '',
						email: '',
/*
						startDate: '',
						startTime: '',
						endDate: '',
						endTime: ''
*/
					}
					
					//var ohoh = apstrata.documentUtils.copyToObject(o, document)

					self.data.push({
						label: document.campaignName,
						iconSrc: "",
						attrs: {
							documentKey: document.key,
							targetName: document.campaignName,
							document: document//apstrata.documentUtils.copyToObject(o, document)
						}
					})
				})
				
				// Cause the DTL to rerender with the fresh self.data
				self.render()
			},
			error: function(operation){
			}
		});
		
		this.inherited(arguments)
	},

	newItem: function() {
		this.openPanel(apstrata.mForms.CampaignForm)
	
		this.inherited(arguments)
	},

	onClick: function(index, label, attrs) {
		var self = this
		this.openPanel(apstrata.mForms.CampaignForm, {document: attrs.document, storeName: self.storeName});
	},

	onDeleteItem: function(index, label, attrs) {
		var self = this
		this.getContainer().client.call({
				action: "DeleteDocument",
				request: {
					apsdb: {
						store : self.storeName,
						documentKey : attrs.documentKey
					}
				},
				load: function(operation) {
					self.refresh();
				},
				error: function(operation) {
				}
			});
	}
	
})

dojo.declare("apstrata.mForms.CampaignForm", 
[dijit._Widget, dojox.dtl._Templated, apstrata.horizon._HStackableMixin], 
{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl("apstrata.mForms", "templates/ScheduleForm.html"),
	maximizePanel: true,
	
	update: false,
	
	storeName: "DefaultStore",
	phoneNumbers: "",
	surveyName: "",
	
	constructor: function(attrs) {
		if (attrs) this.attrs = attrs
	},
	
	_getTargetsStore: function(onLoad) {
		var self = this

		this.getContainer().client.call({
			action: "Query",
			request: {
				apsdb: {
					store: self.storeName,
					query: "formType=\"targetGroup\"",
					queryFields: "apsdb.documentKey,targetName"
				}
			},
			load: function(operation){
				// Rearrange the result to suite the template
				
				var data = {label: "targetName", identifier: "documentKey"}
				data.items = []
				
				dojo.forEach(operation.response.result.documents, function(document){
					data.items.push({
						documentKey: document.key,
						targetName: document.targetName
					})
				})

		        var store = new dojo.data.ItemFileReadStore({
					data: data
		        });
				
				onLoad(store)
			},
			error: function(operation){
			}
		});
	},

	_getFormsStore: function(onLoad) {
		var self = this
		this.getContainer().client.call({
				action: "Query",
				request: {
					apsdb: {
						store: self.storeName,
						query: "apsdb.creator=\"" + connection.credentials.username+ "\" and isSurveyMetadata=\"true\"",
						queryFields: "surveyName,apsdb.documentKey"
					}
				},
				load: function(operation) {
					// Rearrange the result to suite the template

					self.data = []
					dojo.forEach(operation.response.result.documents, function(document) {
						self.data.push({label: document.surveyName, iconSrc: "", attrs:{documentKey: document.key}})
					})

					var data = {label: "formId", identifier: "documentKey"}
					data.items = []
					
					dojo.forEach(operation.response.result.documents, function(document){
						data.items.push({
							documentKey: document.key,
							formId: document.surveyName
						})
					})
	
			        var store = new dojo.data.ItemFileReadStore({
						data: data
			        });
					
					onLoad(store)
				},
				error: function(operation) {
				}
			});
	},
	
	postCreate: function() {
		var self = this
		this.update = false
		var targets

		self._getTargetsStore(function(t) {
			targetsStore = t
			self._getFormsStore(function(formsStore) {
				if (self.attrs) {
					console.dir(self.attrs)
					if (self.attrs.document) {
						self.update = true
						self.render()
						self.schedule.setValues(self.attrs.document)
					}
				}
				
				var targetName = ""
				if (self.attrs.document) targetName = self.attrs.document.target

				var formId = ""
				if (self.attrs.document) formId = self.attrs.document.formId

		        new dijit.form.FilteringSelect({
		            name: "target",
		            value: targetName,
		            store: targetsStore,
		            searchAttr: "targetName"
		        },
		        self.dvSelectTarget);

		        new dijit.form.FilteringSelect({
		            name: "formId",
		            value: formId,
		            store: formsStore,
		            searchAttr: "formId"
		        },
		        self.dvSelectForm);
			})
		})
		
//		this.refreshTargetsList(function() {})
		this.inherited(arguments)
	},
	
	save: function() {
		var self = this
		
		console.dir(this.schedule.attr("value"))
		
		request = dojo.mixin(this.schedule.attr("value"), {
			formType: "campaign",
			"email.apsdb.fieldType": "text",
			
			apsdb: {
				store: self.getParent().storeName
			}
		})
		
		if (this.update) request.apsdb.documentKey = this.attrs.document['apsdb.documentKey']

		this.getContainer().client.call({
				action: "SaveDocument",
				request: request,
//				formNode: self.schedule.domNode,
				load: function(operation) {
					self.getContainer().client.call({
						action: "Query",
						request: {
							apsdb: {
								store: self.getParent().storeName,
								query: "apsdb.documentKey=\"" + self.schedule.attr("value").target + "\"",
								queryFields: "targetMembers"
							}
						},
						load: function(operation){
		
							var runScriptletRequest = dojo.mixin({
								phoneNumbers: operation.response.result.documents[0].targetMembers,
								surveyName: self.schedule.attr("value").formId,
								smsText: self.schedule.attr("value").sms
							}, {
								apsdb: {
									scriptName: 'sendSms'
								}
							});
							
							// Run the send sms script 
							self.getContainer().client.call({
								action: "RunScript",
								request: runScriptletRequest,
								load: function(operation) {
								},
								error: function(operation) {
								}
							})
						},
						error: function(operation){
						}
					});
					self.getParent().refresh()
				},
				error: function(operation) {
				}
		});
	}
})

