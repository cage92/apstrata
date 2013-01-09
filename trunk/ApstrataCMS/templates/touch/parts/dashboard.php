	<style type="text/css">
	<?php 
			if ($config["developmentMode"]) { 
		?>
		@import "lib/dojo/dojo/resources/dojo.css";
	    @import "lib/dojo/dijit/themes/claro/claro.css";
	    @import "lib/dojo/dojox/grid/resources/Grid.css";
	    @import "lib/dojo/dojox/grid/resources/claroGrid.css";
		@import "lib/dojo/dojox/grid/enhanced/resources/claro/EnhancedGrid.css";
		@import "lib/dojo/dojox/form/resources/FileInput.css";
		@import "lib/dojo/dojox/highlight/resources/highlight.css";
		@import "lib/dojo/dojox/highlight/resources/pygments/colorful.css";
	
	    @import "lib/ApstrataSDK/apstrata/ui/themes/apstrata/FormGenerator.css";
	    @import "lib/ApstrataSDK/apstrata/ui/themes/apstrata/Curtain.css";
	    @import "lib/ApstrataSDK/apstrata/ui/themes/apstrata/FlashAlert.css";
	    @import "lib/ApstrataSDK/apstrata/ui/themes/apstrata/ApstrataAnimation.css";
	
	    @import "lib/ApstrataSDK/apstrata/horizon/themes/horizon.css";
	<?php 
			} 
		?>
		.blueHorizon {
			font-family: sans-serif;
			font-size: 1.2em;
	
			top: 44px;
			left: 70px;
			width: 700px;
			height: 400px;
		}
	</style>
	<!-- begin side menu -->
    <div class="side-menu">
    	<h1>tools</h1>
    	<!-- begin navigation -->
        <div class="navigation">
        	<div class="top"></div>
            <div class="middle">
                <ul>           
                    <li><a href="#" id="manageAccountLink" class="selected">manage accounts</a></li>
                    <li><a href="#" id="userProfileLink">user profile</a></li>                
                    <li><a href="#" id="workbenchLink">workbench</a></li>                   
                    <li><a href="#" id="logoutLink">logout</a></li>
                </ul>
        	</div>
            <div class="bottom"></div>
        </div>
        <!-- end navigation -->
    	
    	
    </div>
    <!-- end side menu -->
	<div class="editorial">
    	<h1 class="marB20">Hello</h1>      
    	<div class="dashboard">
		This is your dashboard. <br />
		This is where you control your apps, your settings and stuff.
		</div>
		<div id="linkedContent">    
		<script>
		
		    /*
		     * Global variables defining templates that will overload the default templates of Account.js and Profile.js
		     */
			accountsTemplate =  "../../../templates/touch/widgets/Accounts.html";
			profileTemplate = "../../../../templates/touch/widgets/Profile.html";
			dojo.addOnLoad(function() {
		<?php 
				if ($config["developmentMode"]) { 
			?>
				dojo.registerModulePath("apstrata", "../../ApstrataSDK/apstrata")
				dojo.registerModulePath("apstrata.cms", "../../../src/cms")
				<?php 
				} 
			?>
				dojo.require("dijit._Widget");
				dojo.extend(dijit._Widget, {
					_apstrataRoot: apstrata.baseUrl,
					_horizonRoot: apstrata.baseUrl + "/../horizon"
				})
								
				dojo.require("apstrata.sdk.Connection");
				dojo.require("apstrata.sdk.Client");
				dojo.require("apstrata.home.dashboard.Dashboard");
				dojo.require("dojo.parser");
				dojo.require("apstrata.ui.widgets.LoginWidget");
				dojo.require("apstrata.home.dashboard.Accounts");
				dojo.require("apstrata.home.dashboard.Profile");
															 
				// These are visual properties used by the application that can not fit in a CSS file yet 			
				apstrata.horizon.magicUIdimensions = {
					"panel.finalAlpha": .95
				}
				
				/*
				 * the current connection instance
				 */
				 var connection = null;
				
				/*
				 * this variable is regularly updated with a reference to the menu link node that was last selected 
				 */
				var lastSelected = dojo.byId("manageAccountLink");
					
				//loginWidget = new apstrata.ui.widgets.LoginWidget({useToken: true, type: "user"})
				loginWidget = new apstrata.ui.widgets.LoginWidget({type: "user"});		
				dojo.parser.parse();
				var dashboard = dijit.byId("dashboard");				
				
				/*
				 * the linkedContent node contains the content to display when clicking on some of the menu links
				 */
				var linkedContent = dojo.byId("linkedContent");
				
				/*
				 * Login successful event handler, triggers the display of the accounts info
				 */ 
				var userCredentials = null;		
				dojo.connect(dashboard, "onCredentials", function(credentials){	
					connection = dashboard.connection;
					userCredentials = credentials;
					manageAccountFct(credentials);	
				})
				
				/*
				 * manage account link event handler, displays the accounts of the looged in user
				 */
				var manageAccountLink = dojo.byId("manageAccountLink");
				dojo.connect(manageAccountLink, "onclick", function(event) {
					dojo.empty(linkedContent);
					manageAccountFct(userCredentials);
				})
				
				/*
				 * user Profile event handler, displays the profile of the logged in user
				 */
				var userProfileLink = dojo.byId("userProfileLink");
				dojo.connect(userProfileLink, "onclick", function(event) {	
					if (userCredentials) {						
						var userProfile = new apstrata.home.dashboard.Profile({container: dashboard, useClass: "dashboard"});
						dojo.empty(linkedContent);					
						dojo.place(userProfile.domNode, linkedContent);	
						toggleSelected(userProfileLink);
					}			
				})
				
				/*
				 * workbench link on click event handler
				 */
				var workbenchLink = dojo.byId("workbenchLink");
				dojo.connect(workbenchLink, "onclick", function(event) {
					toggleSelected(workbenchLink);
					window.open('<?php echo $config["workbenchUrl"]; ?>', '_blank');
  					window.focus();
				});	
				
				/*
				 * log out link on click event handler
				 */	
				 var logoutLink = dojo.byId("logoutLink");
				 dojo.connect(logoutLink, "onclick", function(event) {
					if (connection) {
						toggleSelected(logoutLink);
						connection.logout();
						window.open('<?php echo $config["baseUrl"]."/page.php?pageId=home"; ?>');					
					}
				});	
				
				/*
				 * this function factors out the logic that is shared by the login successful and manage account event handler
				 */
				var manageAccountFct = function(credentials) {
					var helloUserNode = dojo.query(".marB20")[0];
					helloUserNode.innerHTML = "Hello " + (credentials ? credentials.user : "");
					var account = null;
					if (credentials) { 		
						account = new apstrata.home.dashboard.Accounts({container: dashboard, credentials: credentials});
						account.container = dashboard;								
						dojo.place(account.domNode, linkedContent);						
						toggleSelected(manageAccountLink);
					}				
				}
				
				/*
				 * this function factors out the logic to toggle the selected element on the menu				 
				 */
				var toggleSelected = function(newLinkNode) {					
					dojo.toggleClass(lastSelected, "selected");					
					dojo.toggleClass(newLinkNode, "selected");
					lastSelected = newLinkNode;
				}
				
			})		
			
		</script>
		</div>
		<div 
			dojoType="apstrata.home.dashboard.Dashboard"
			loginWidget='loginWidget'
			class= "dashboard"
			id="dashboard"
		>
		</div>
	</div>
