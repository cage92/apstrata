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

dojo.provide("surveyWidget.widgets.SurveyField");

dojo.require("dijit._Templated");
dojo.require("dijit.InlineEditBox");

dojo.require("dojo.html");

dojo.declare("surveyWidget.widgets.SurveyField",
	[dijit._Widget, dijit._Templated],
	{
		widgetsInTemplate: true,
		templateString: null,
		templatePath: dojo.moduleUrl("surveyWidget.widgets", "templates/SurveyField.html"),
		
		title: "Set a question title here",
		fieldType: "text",
		fieldName: "",
		fieldMandatory: false,
		fieldChoices: "choice1, choice2, choice3",
		defaultFieldValue: "",
		selected: false,
		parentSurvey: null,
		fieldDataModel: null,
		editMode:false,
		dummyField:false,
		serialNumber: 0,
		initialState: null,	
		/**
		 * 		attrs is a JSON object containing some info about the survey fields: 
		 * 			dataModel: dojo object containing the details of the question to create
		 * 			editMode: When set to true, the suvey is in edit mode and it allows user to edit the current question. 
		 * 			serialNumber: Integer representing the index of the current field    
		 */
		attrs: {},	
		
		/**
		 * Constructor of the SurveyField widget.
		 */
		constructor: function() {
			
		},
		
		/**
		 * Function called by the constructor, used to set properties that are referenced in the widget
		 */
		postMixInProperties: function() {
			
			if(this.attrs.dataModel)
				this.fieldDataModel = this.attrs.dataModel
			
			if(this.attrs.editMode) 
				this.editMode = this.attrs.editMode
				
			if(this.attrs.serialNumber)
				this.serialNumber = this.attrs.serialNumber				
			
			if (this.fieldDataModel != null) {
				if (this.fieldDataModel.title != null) 
					this.title = this.fieldDataModel.title;
				if (this.fieldDataModel.type != null) 
					this.fieldType = this.fieldDataModel.type;
				if (this.fieldDataModel.mandatory != null) 
					this.fieldMandatory = this.fieldDataModel.mandatory;
				if (this.fieldDataModel.choices != null) 
					this.fieldChoices = this.fieldDataModel.choices;
				if (this.fieldDataModel.name != null) 
					this.fieldName = this.fieldDataModel.name;
				if (this.fieldDataModel.defaultValue != null) 
					this.defaultFieldValue = this.fieldDataModel.defaultValue;
			} else
				this.dummyField = true;

			if(!this.editMode)
				this.templatePath = dojo.moduleUrl("surveyWidget.widgets", "templates/SurveyFieldRun.html");
		},

		/**
		 * Link the current question to its Survey object.
		 * 
		 * @param parentSurvey
		 * 		Object of type Survey that contains all the questions
		 *  
		 */
		setParent: function(parentSurvey) {
			this.parentSurvey = parentSurvey;
			if(this.editMode)
				this.parentSurvey.questionContainer.sync();
		},
		
		/**
		 * Function called after the constructor, used to construct and display the SurveyField widget.
		 * 
		 */
		postCreate: function(){
			this.inherited(arguments);
			
			if(this.editMode){
				this.connect(this.btnDelete, "onclick", "deleteField");
				this.connect(this.btnSave, "onclick",
					function() {
						if (this.title == null) 
							this.deleteField();
						else {
							this.unselect();
						}
					});
				this.connect(this.lstType, "onchange", "changeType");
				this.connect(this.fldTitle, "onClick", function() {if (this.title != null){ this.saveInitialState(); this.fieldModified();}});
				this.connect(this.fldTitle, "onChange", function() {this.title = this.fldTitle.value; this.fieldModified()});
				this.connect(this.fldName, "onChange", function() {this.fieldName = this.fldName.value; this.changeType();});
				this.connect(this.txtChoices, "onchange", function() {this.changeType();});
				this.connect(this.btnCancel, "onclick", "restoreInitialState");
				
			}
			
			if(this.fieldDataModel != null){
				// Create the field using the field schema if it was sent 
				if(this.editMode){
					this.lstType.value = this.fieldType;
					this.chkMandatory.checked = this.fieldMandatory;
					this.txtChoices.value = this.fieldChoices;
					this.fldName.value = this.fieldName;
				}
				this.changeType();
			}
		},
		
		/**
		 *	Called after a widget's children, and other widgets on the page, have been created.
		 *	Provides an opportunity to manipulate any children before they are displayed.
		 *	This is useful for composite widgets that need to control or layout sub-widgets.
		 *	Many layout widgets can use this as a wiring phase.
		 */
		startup: function(){
			this.inherited(arguments);
		},
		 
		/**
		 *	Deletes the selected question
		 */
		deleteField: function() {
			this.destroy();
		},
		
		/**
		 *	Function called when a question is selected
		 */
		selectedEvent: function() {
		},
			
		/**
		 *	Sets the current question to be in edit mode
		 */	
		select: function() {
			if (this.parentSurvey.editMode) {
				
				this.editor.style.position = "absolute";
				this.editor.style.top = (this.surveyField.offsetTop - 20) + "px";
				this.editor.style.left = this.surveyField.offsetWidth + "px";
				this.editor.style.display = "";
				//rgba doesn't work in IE
				//this.surveyField.style.backgroundColor = "rgba(255, 255, 130, .9)";
				this.surveyField.style.backgroundColor = "#FFFF8E";
				this.handle.style.display = "none";
				this.selected = true;
				
				if(this.fieldName == "")
				{
					var constructedFieldName = this.constructFieldName();
					this.fieldName = constructedFieldName;
					this.fldName.value = constructedFieldName;
					this.changeType();
				}
			}
		},
		
		/**
		 *	Sets the current question to be in unselected
		 */			
		unselect: function() {
			this.editor.style.display = "none";	
			this.surveyField.style.backgroundColor = "";
			this.handle.style.display = "";

			this.selected = false;
		},
		
		/**
		 *	Function called when a the initial state of a question is saved, before editing it
		 */	
		saveInitialState: function() {
		},
		
		/**
		 *	Restores the initial state of a question before it was edited
		 */	
		restoreInitialState: function() {
			this.title = this.initialState.title;
			this.fldTitle.setValue(this.initialState.title);
			this.lstType.value = this.initialState.type;
			this.txtChoices.value = this.initialState.choices;
			this.chkMandatory.checked = this.initialState.mandatory;
			this.defaultFieldValue = this.initialState.fieldValue;
			this.changeType();
			
			if (this.initialState.type == "checkbox") {
				this.spnValue.style.display = "none";
				this.checkBoxValue.style.display = "";
			}
			else {
				this.checkBoxValue.style.display = "none";
				this.spnValue.style.display = "";
			}
			
			this.unselect();
		},
		
		/**
		 *	Creates and displays the current question based on its type
		 */	
		changeType: function() {

			if(this.editMode){
				this.fieldModified();
				this.fieldType = this.lstType.value;
				this.fieldMandatory = this.lstType.value;
			}

			var newField = '';

			switch(this.fieldType)
			{	
				case 'checkbox':
					if(this.editMode){
						this.divChoices.style.display = "none";			
						this.fieldName = this.fldName.value;
					}
					this.spnValue.style.display = "none";
					this.checkBoxValue.style.display = "";	
					currentField = this;
					newField = '<input dojoType="dijit.form.CheckBox" value="checked" dojoAttachPoint="fldValue"  name="'+this.fieldName+'" '+ this.defaultFieldValue +'/>';	
					this.checkBoxValue.innerHTML = newField;
					dojo.parser.parse(this.checkBoxValue);
					break;
				case 'list':
					if(this.editMode){
						this.divChoices.style.display = "";
						this.fieldName = this.fldName.value;
					}

					newField = this.createSelectTag();	
					this.spnValue.innerHTML = newField;
					dojo.parser.parse(this.spnValue);
					break;
				case 'radio button':
					if(this.editMode){
						this.divChoices.style.display = "";
						this.fieldName = this.fldName.value;
					}

					newField = this.createRadioButtonsTag();	
					this.spnValue.innerHTML = newField;
					dojo.parser.parse(this.spnValue);
					break;
				case 'multiple choice':
					if(this.editMode){
						this.divChoices.style.display = "";
						this.fieldName = this.fldName.value;
					}

					newField = this.createMultipleChoiceTag();	
					this.spnValue.innerHTML = newField;
					dojo.parser.parse(this.spnValue);
					break;
				case 'text area':
					if(this.editMode){
						this.divChoices.style.display = "none";	
						var required = false;
						this.fieldName = this.fldName.value;
					} else
						var required = this.fieldMandatory;						
					
					var defaultValue = "";
					if(typeof(this.defaultFieldValue) != "undefined") 
						defaultValue = this.defaultFieldValue;
					
					newField = '<br/><textarea name="'+this.fieldName+'" dojoType="dijit.form.SimpleTextarea" rows="2" style="width:190px;" required="'+ required +'" invalidMessage="Required." dojoAttachPoint="fldValue">'+defaultValue+'</textarea>';

					this.spnValue.innerHTML = newField;
					dojo.parser.parse(this.spnValue);
					break;
				default:
					if(this.editMode){
						this.divChoices.style.display = "none";	
						var required = false;
						this.fieldName = this.fldName.value;
					} else
						var required = this.fieldMandatory;		
						
					var defaultValue = "";
					if(typeof(this.defaultFieldValue) != "undefined") 
						defaultValue = this.defaultFieldValue;

					newField = '<br/><input dojoType="dijit.form.ValidationTextBox" trim=true required="'+ required +'" invalidMessage="Required." dojoAttachPoint="fldValue"  value="'+defaultValue+'" name="'+this.fieldName+'">';	
					this.spnValue.innerHTML = newField;
					dojo.parser.parse(this.spnValue);
					break;
			}
		},
		
		/**
		 *	Creates a question of type list
		 */	
		createSelectTag: function() {
			var optionsTags = "";
			var newField = "";
			if(this.editMode)
				var choiceValues = this.txtChoices.value;
			else
				var choiceValues = this.fieldChoices;
			
			dojo.forEach(eval(choiceValues.split(",")),
				function(choice) {
					optionsTags = optionsTags + '<option value="' + choice + '">' + choice + '</option>';
				});
			
			newField = '<br/><select value="' + this.defaultFieldValue + '" required="'+ this.fieldMandatory +'" invalidMessage="Required." dojoType="dijit.form.FilteringSelect" dojoAttachPoint="fldValue" name="'+this.fieldName+'">'+optionsTags+'</select>';
			return newField;
		},
		
		/**
		 *	Creates a question of type radio button
		 */	
		createRadioButtonsTag: function() {
			var newField = "<br/>";
			var checked = "";
			var survey = this;
			if(this.editMode)
				var choiceValues = this.txtChoices.value;
			else
				var choiceValues = this.fieldChoices;
			
			dojo.forEach(eval(choiceValues.split(",")),
				function(choice) {
					if(survey.defaultFieldValue == choice)
						checked = "checked";
					else
						checked = "";
					newField = newField + '<span><input dojoType="dijit.form.RadioButton" dojoAttachPoint="fldValue" name="'+survey.fieldName+'" value="' + choice + '" '+ checked +'>' + choice + '</span><br/>';
				});
			
			return newField;
		},

		/**
		 *	Creates a question of type multiple choice
		 */	
		createMultipleChoiceTag: function() {
			var newField = "<br/>";
			var checked = "";
			var survey = this;
			var i;
			if(this.editMode)
				var choiceValues = this.txtChoices.value;
			else
				var choiceValues = this.fieldChoices;
			
			dojo.forEach(eval(choiceValues.split(",")),
				function(choice) {
					for (i=0; i < survey.defaultFieldValue.length; i++) 
					{
						if (survey.defaultFieldValue[i] == choice){
							checked = "checked";
							break;
						}else
							checked = "";
					}

					newField = newField + '<span><input dojoType="dijit.form.CheckBox" dojoAttachPoint="fldValue" name="'+survey.fieldName+'" value="' + choice + '" '+ checked +'>' + choice + '</span><br/>';
				});
			
			return newField;
		},

		/**
		 *	Displays a field box or a check box depending on the type of the current question
		 */	
		fieldModified: function() {
				if (this.lstType.value == "checkbox") {
					this.spnValue.style.display = "none";
					this.checkBoxValue.style.display = "";
				}
				else {
					this.checkBoxValue.style.display = "none";
					this.spnValue.style.display = "";
				}
			
				if(!this.selected)
					this.selectedEvent();
		},
		
		/**
		 *	Creates a JSON object containing the current question's information
		 *
		 * @return The created JSON object
		 */	
		getModel: function() {
			var survey = this;
			var fieldValue = "";
			var type = survey.lstType.value;

			var constructedFieldName = this.fldName.value;

			var model = {
				title: survey.title,
				type: survey.lstType.value,
				choices: survey.txtChoices.value,
				mandatory: survey.chkMandatory.checked,
				name: constructedFieldName
			}
			return model;
		},

		/**
		 *  Construct the field name from the survey title by removing any non-alphanumeric characters and using the first 15 characters, then adding this field's serial number
		 *
		 * @return The constructed field name
		 */
		constructFieldName: function () {
			var survey = this;
			
			var constructedFieldName = this.parentSurvey.title.value; 
			constructedFieldName = constructedFieldName.replace(/&amp;/g, '');
			constructedFieldName = constructedFieldName.replace(/[^a-zA-Z0-9]+/g, '');
			constructedFieldName = constructedFieldName.substring(0, (constructedFieldName.length > 15) ? 15 : constructedFieldName.length);
			if(constructedFieldName == "")
				constructedFieldName = "Survey";
			constructedFieldName = constructedFieldName + '_' + survey.serialNumber;

			return constructedFieldName;
		}
	});
