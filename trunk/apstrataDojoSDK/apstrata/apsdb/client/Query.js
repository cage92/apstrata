/*******************************************************************************
 *  Copyright 2009 apstrata
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *
 *  You may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at: http://www.apache.org/licenses/LICENSE-2.0.html
 *  This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 *  CONDITIONS OF ANY KIND, either express or implied. See the License for the
 *  specific language governing permissions and limitations under the License.
 * *****************************************************************************
 */

dojo.provide("apstrata.apsdb.client.Query");

dojo.require("apstrata.apsdb.client.Get");

/**
 * Allows querying the apstrata database documents of an account
 * @class apstrata.apsdb.client.Query
 * @extends apstrata.apsdb.client.Get
*/
dojo.declare("apstrata.apsdb.client.Query",
[apstrata.apsdb.client.Get],
{
	//_DEFAULT_PAGE_NUMBER: 1, // TODO: Not in use, should b removed
	//_DEFAULT_RESULTS_PER_PAGE: 10, // TODO: Not in use, should b removed

    /**
     * @constructor Query Does not require any parameters
    */
    constructor: function() {
        this.apsdbOperation= "Query"
    },

    /**
     * @function execute Queries the apstrata database documents of an account
     * @param attrs An array of parameters that must contain these parameters: 'store', 'query', 'queryFields'. These parameters are optional: 'resultsPerPage', 'pageNumber', 'count', 'sort'
     */
    execute: function(attrs) {
		var self = this
		
		if (attrs.store) this.request.apsdb.store = attrs.store	
		if (attrs.query) this.request.apsdb.query = attrs.query
		if (attrs.queryFields) this.request.apsdb.queryFields = attrs.queryFields
		if (attrs.resultsPerPage) this.request.apsdb.resultsPerPage = attrs.resultsPerPage
		if (attrs.pageNumber) this.request.apsdb.pageNumber = attrs.pageNumber
		if (attrs.count) this.request.apsdb.count = attrs.count
		if (attrs.sort) this.request.apsdb.sort = attrs.sort
		if (attrs.runAs) this.request.apsim.runAs = attrs.runAs
		
		if (attrs.aggregates) {
			this.request.apsdb.aggregateExpression = attrs.aggregates
			this.request.apsdb.aggregateGlobal = 'true'; // Add the aggregateGlobal parameter because the aggregate is only allowed globally for now
		}
		
		if (attrs.ftsQuery) this.request.apsdb.ftsQuery = attrs.ftsQuery
		if (attrs.queryName) this.request.apsdb.queryName = attrs.queryName
		
		
		for (prop in attrs.fields) {
				this.request[prop] = attrs.fields[prop];
		}
		
		this.inherited(arguments);
    }
})