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
dojo.provide("apstrata.apsdb.client.GetUser");

dojo.require("apstrata.apsdb.client.Get");

/**
 * Allows getting the description of a user in apstrata database
 * @class apstrata.apsdb.client.GetUser
 * @extends apstrata.apsdb.client.Get
*/
dojo.declare("apstrata.apsdb.client.GetUser",
[apstrata.apsdb.client.Get],
{
    /**
     * @constructor GetUser Does not require any parameters
    */
    constructor: function(){
        this.apsdbOperation = "GetUser"
    },

    /**
     * @function execute Gets the user with the passed username
     * @param attrs An array of parameters that must contain the 'user' parameter
     */
    execute: function(attrs){
        if ((attrs != undefined) &&
        (attrs.user != undefined)) {
            this.request.apsim.user = attrs.user;
            this.inherited(arguments);
        }
        else 
            throw new Error("apstrata.apsdb.client.GetUser: missing user login .")
    }
});

