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
dojo.provide("apstrata.apsdb.client.SaveUser");

dojo.require("apstrata.apsdb.client.Get");

dojo.declare("apstrata.apsdb.client.SaveUser", [apstrata.apsdb.client.Get], {
    constructor: function(){
        this.apsdbOperation = "SaveUser"
    },
    
    execute: function(attrs){
    
        if ((attrs != undefined) &&
        (attrs.login != undefined) &&
        (attrs.password != undefined) &&
        (attrs.name != undefined)) {
            this.request.apsim.user = attrs.login;
            this.request.apsim.password = attrs.password;
            this.request.apsim.name = attrs.name;
            if (attrs.update != undefined) 
                this.request.apsim.update = attrs.update;
            if (attrs.email != undefined) 
                this.request.apsim.email = attrs.email;
            
            this.inherited(arguments);
        }
        else 
            throw new Error("SaveUser: attribtues login and password are mandatory")
    }
});
