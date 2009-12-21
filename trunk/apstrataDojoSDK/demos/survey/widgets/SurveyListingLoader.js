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
/*
 * This file is used to require the needed class for the tabular results listing widget.
 */

var schema = null // The global variable schema is set by the embed code and contains the detailed schema of the survey needed to load its results

function loadjscssfile(filename, filetype){
	 if (filetype=="js"){ //if filename is a external JavaScript file
	  var fileref=document.createElement('script')
	  fileref.setAttribute("type","text/javascript")
	  fileref.setAttribute("src", filename)
	 }
	 else if (filetype=="css"){ //if filename is an external CSS file
	  var fileref=document.createElement("link")
	  fileref.setAttribute("rel", "stylesheet")
	  fileref.setAttribute("type", "text/css")
	  fileref.setAttribute("href", filename)
	 }
	 if (typeof fileref!="undefined")
	  document.getElementsByTagName("head")[0].appendChild(fileref)
}

loadjscssfile("http://o.aolcdn.com/dojo/1.3/dojo/resources/dojo.css", "css");

dojo.require("dijit.Declaration");
//dojo.registerModulePath("surveyWidget","../../../../demos/survey");
//dojo.registerModulePath("apstrata","../../../../apstrata");
dojo.require("apstrata.util.schema.Schema");
dojo.require("surveyWidget.widgets.SurveyListing");
dojo.require("apstrata.Connection")
dojo.require("apstrata.Client")

//The global variable connection contains the credentials information to be used by the survey. They are set from the apConfig tag found in the html page using the surveyListing widget
var connection = new apstrata.Connection({
		credentials: {
			key: apstrata.apConfig.key,
			username: apstrata.apConfig.username,
			password: apstrata.apConfig.password
		},
		serviceUrl: apstrata.apConfig.serviceURL
})