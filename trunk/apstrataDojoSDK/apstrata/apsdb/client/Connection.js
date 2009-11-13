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

dojo.provide("apstrata.apsdb.client.Connection")
//dojo.provide("apstrata.apsdb.client.URLSignerMD5")

dojo.require("dojox.encoding.digests.MD5");
dojo.require("dojo.cookie");

dojo.require("apstrata.apsdb.client.ListStores");
dojo.require("apstrata.util.logger.Loggable")

// An activity object is used by operations to register the sending of requests and
//  receipt of responses.
//  Activity will keep track of the first request and the last response to generate proper events
//  that can be trapped by the UI to indicate communication activity (start, stop) or errors (timeout)
dojo.declare("apstrata.apsdb.client.Activity",
	[apstrata.util.logger.Loggable],
	{
		constructor: function() {
			this.counter = 0;
			this.activity = {}
		},
		
		start: function(operation) {
			this.activity[operation.url] = operation
			this.counter++
			this.busy();
//			this.debug("active operations:", this.counter)
		},
		
		stop: function(operation) {
			if (this.activity[operation.url]!=undefined) {
				delete this.activity[operation.signature]
				this.counter--
			}
			
			if (this.counter==0) this.free() //setTimeout (dojo.hitch(this, "free"), 3000)  
//			this.debug("active operations:", this.counter)
		},
		
		timeout: function(operation) {
//			this.stop(operation)
		},
		
		busy: function() {},
		free: function() {}
	})


dojo.declare("apstrata.apsdb.client.URLSignerMD5", [], {
  /**
	 *  Signs the request URL using the connection credentials (key and secret) that were sent. If the
	 * credentials were not sent, then the request is not signed.
	 *
	 * @param connection The connection Object that will be used to send the request
	 * @param operation The name of the operation being called
	 * @param params The URL parameter string before signing the request
	 * @param responseType JSON or XML
	 */
	sign: function (connection, operation, params, responseType) {
		var timestamp = new Date().getTime() + '';

		responseType = responseType || "json"

		var apswsReqUrl = connection.serviceUrl
				+ "?apsdb.action=" + operation
				+ "&apsws.authKey=" + connection.credentials.key
				+ "&apsws.responseType=" + responseType
				+ "&apsws.authMode=simple"
				+ ((params!="")?"&":"") + params

		var signature = '';
		
		var returnValue = null;

		// Sign with the username and password if they are passed
		if (connection.credentials.username && connection.credentials.password) {
			if (connection.credentials.username != '' && connection.credentials.password != '') {
				var valueToHash = timestamp + connection.credentials.username + operation
					+ dojox.encoding.digests.MD5(connection.credentials.password, dojox.encoding.digests.outputTypes.Hex).toUpperCase()
				signature = dojox.encoding.digests.MD5(valueToHash, dojox.encoding.digests.outputTypes.Hex)
				apswsReqUrl += "&apsws.user=" + connection.credentials.username
					+ "&apsws.time=" + timestamp
					+ "&apsws.authSig=" + signature
					
				returnValue = {url: apswsReqUrl, signature: signature}
			}
		}

		// Otherwise, sign with the secret		
		if (!returnValue && connection.credentials.secret != '') {
			var valueToHash = timestamp + connection.credentials.key + operation + connection.credentials.secret
			signature = dojox.encoding.digests.MD5(valueToHash, dojox.encoding.digests.outputTypes.Hex)
			apswsReqUrl += "&apsws.time=" + timestamp
				+ "&apsws.authSig=" + signature

			returnValue = {url: apswsReqUrl, signature: signature}
		}
		// If no signing was made, then this is an anonymous call
		else if (!returnValue) {
			returnValue = {url: apswsReqUrl, signature: ''};
		}

		return returnValue;
	}
})


dojo.declare("apstrata.apsdb.client.Connection",
	[apstrata.util.logger.Loggable],
	{
		// Private attributes
		_KEY_APSDB_ID: "@key",
		_COOKIE_NAME: "apstrata.apsdb.client",
		_COOKIE_EXPIRY: 15,

		// Public attributes
		LOGIN_MASTER: 1,
		LOGIN_USER: 2,
		totalConnectionTime: 0,
		numberOfConnections: 0,
		statusWidget: null,
		
		constructor: function(attr) {
			var self = this
			
			this._DEFAULT_SERVICE_URL= "http://apsdb.apstrata.com/sandbox-apsdb/rest"
			this.timeout = 10000
			this.serviceUrl= this._DEFAULT_SERVICE_URL;
			this.credentials= {key: "", secret: "", username: "", password: ""}
			this.defaultStore = ''
			this._ongoingLogin = false
			this._urlSigner = new apstrata.apsdb.client.URLSignerMD5()				

			this.activity= new apstrata.apsdb.client.Activity()

			if (attr) {
			/*
				if (attr.URLSigner) {
					this._urlSigner = attr.URLSigner
				}
			*/

				if (attr.statusWidget) {
					// TODO: this should be replaced by dynamic instantiation
					if (attr.statusWidget == "apstrata.apsdb.client.widgets.ConnectionStatus") {
						dojo.require("apstrata.apsdb.client.widgets.ConnectionStatus")
						var sw = new apstrata.apsdb.client.widgets.ConnectionStatus(self)
					}
				}

			} 
			
			if (attr && attr.credentials) {
				// If the credentials are passed to the connection object constructor
				//  use them
					this.credentials = attr.credentials
			} else {
				// Otherwise try to load the credentials from the cookie
				this.loadFromCookie()				
			}

			// if present apstrata.apConfig overrides
			if (apstrata.apConfig) {
				if (apstrata.apConfig.key != undefined) this.credentials.key = apstrata.apConfig.key
				if (apstrata.apConfig.secret != undefined) this.credentials.secret = apstrata.apConfig.secret
				if (apstrata.apConfig.username != undefined) this.credentials.username = apstrata.apConfig.username
				if (apstrata.apConfig.password != undefined) this.credentials.password = apstrata.apConfig.password


				if (apstrata.apConfig.defaultStore != undefined) this.defaultStore = apstrata.apConfig.defaultStore
				if (apstrata.apConfig.timeout != undefined) this.timeout =  apstrata.apConfig.timeout
				if (apstrata.apConfig.serviceURL != undefined) this.serviceUrl = apstrata.apConfig.serviceURL
			}

			// Make sure that the auth key has been loaded into the credentials or we won't be able to make requests to apstrata database
//			if (this.credentials.key == null || this.credentials.key == '') {
//				throw "The apstrata database auth key is required. Please set it in the apConfig attribute of your apstrata.js script tag";
//			}

			// TODO: Investigate why this is not working: dojo.parser.instantiate
			/*
			if (attr!=undefined) {
				if (attr.statusWidget!=undefined) {
					dojo.require(attr.statusWidget)
					var sw = dojo.parser.instantiate(this, {dojoType: attr.statusWidget});
				}
			}
			*/
			

		},
		
		hasCredentials: function() {
			// Assume that we have a session if either the secret or password are present
			return (this.credentials.secret != "") || (this.credentials.password != "")
		},
		
	    /**
	     * @function getAccountId returns the account identifier (key) for master login or (username) for user logins
	     * 
	     */
		getAccountId: function() {
			if (this.credentials.password && this.credentials.password!="") return this.credentials.username
			if (this.credentials.secret && this.credentials.secret!="") return this.credentials.key
			return ""
		},
		
		getLoginType: function() {
			if (this.credentials.password && this.credentials.password!="") return this.LOGIN_USER
			if (this.credentials.secret && this.credentials.secret!="") return this.LOGIN_MASTER
			return undefined			
		},

		registerConnectionTime: function(t) {
			this.numberOfConnections++
			this.totalConnectionTime += t
			this.averageConnectionTime = this.totalConnectionTime/this.numberOfConnections 

			this.debug("average connection time", this.averageConnectionTime)
		},

		signUrl: function(operation, params, responseType) {
			return this._urlSigner.sign(this, operation, params, responseType)
		},
		
		// Set here the default timeout value for all apstrata operations
		// a value of 0 disables timeout
		getTimeout: function() {
			return this.timeout
		},
		
		saveToCookie: function(saveObject) {
			var self = this
			
			if (typeof saveObject == undefined) {
				saveObject: {}
			}

			var o = {
				credentials: self.credentials,
				serviceUrl: self.serviceUrl,
				defaultStore: self.defaultStore,
				saveObject: saveObject
			}
			
			this.debug("saving connection to cookie:", dojo.toJson(o))
			
			dojo.cookie(self._COOKIE_NAME, dojo.toJson(o), {expires: self._COOKIE_EXPIRY})			
		},
		
		loadFromCookie: function() {
			var json = dojo.cookie(this._COOKIE_NAME)

			this.debug("Loading connection from cookie:", json)
			
			if ((!json) || (json == "")) {
				this.serviceUrl = this._DEFAULT_SERVICE_URL
				
				var o = {
					key: "",
					secret: "",
					username: "",
					password: ""
				}
				
				this.credentials = o
				this.defaultStore = ""
				return {}
			} else {
				var o = dojo.fromJson(json) 
				
				// In case the cookie is corrupted
				if (!o.credentials.key) o.credentials.key=""
				if (!o.credentials.secret) o.credentials.secret=""
				if (!o.credentials.username) o.credentials.username=""
				if (!o.credentials.password) o.credentials.password=""
	
				this.debug("Loading connection from cookie", o)
					
				this.credentials = o.credentials
				this.serviceUrl = o.serviceUrl
				this.defaultStore = o.defaultStore

				if (o.saveObject != undefined) return o.saveObject
			}
		},

		fakelogin: function(handlers) {
			var self = this
			
					self._ongoingLogin = false
					this.debug("logging in: saving credentials to cookie")
					self.saveToCookie()
					handlers.success()
		},
		
		login: function(handlers) {
			var self = this
			
			self._ongoingLogin = true
			this.debug("logging in: attemting an operation to apstrata to validate credentials")
			
			var listStores = new apstrata.apsdb.client.ListStores(self)
			dojo.connect(listStores, "handleResult", function() {
				self._ongoingLogin = false
				self.debug("logging in: saving credentials to cookie")
				self.saveToCookie()

				handlers.success()
			})
			dojo.connect(listStores, "handleError", function() {
				// Clear the secret and password so hasCredentials() functions
				self.credentials.secret=""
				self.credentials.password=""
				handlers.failure(listStores.errorCode, listStores.errorMessage)
			})
			
			listStores.execute();
		},

		logout: function() {
			this.debug("logging out: erasing credentials from cookie")
			// Erase secret and password
			this.credentials.secret = ""
			this.credentials.password = ""
			
			// Make sure key/username are not null/undefined
			if (!this.credentials.key) this.credentials.key=""
			if (!this.credentials.username) this.credentials.username=""

			this.saveToCookie()
		},

		_credentialsError: function() {
//			if (!this._ongoingLogin) this.clearCookies()
// clear credentials from cookies
		},

		credentialsError: function() {}
	});
	
/*


		execute: function(operation, params) {
			function instantiateDynamic(className, attributes) {
			    var tmp = "dojo.declare('wrapper', [], {\n"
				tmp+= "     constructor: function(obj){"
				tmp+= "         var o = new " + className + "(obj);"
				tmp+= "         o._dynamicInstantiation = true;"
				tmp+= "         this.wrapped = o;"
				tmp+= "     }"
				tmp+= "})"            
		
			    eval(tmp)
		
			    var o = new wrapper(attributes)
			    return o.wrapped
			};
			
			var operationClass = "apstrata.apsdb.client." + operation
			var operation = instantiateDynamic(operationClass, this);
			
			var executionObject = {
				execute: function() {
					// substitute the operation timeout handler
					//  install our own, so we can retry operations
					//  without the application getting a signal
					this.operation.execute(params)
				}
			}

//			executionObject.operation = operation;
//			executionObject.timeoutHandler = this.operation.timeout;
//			operation.timeout = function() {console.dir("trapped timeout")};

//			this.registerRetryOperation(executionObject);
			
			executionObject.execute();

			return operation
		},

		registerRetryOperation: function(executionObject) {},	// Trapped by ConnectionError to allow for retrying latest operation
		

 */