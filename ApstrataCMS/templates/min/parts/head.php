<!-- start: head.php -->		
		
	    <link rel="shortcut icon" href="themes/<?php print $config['template'] ?>/resources/favicon.png" type="image/png" />

		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		
		<!-- Generic Metadata -->
		<meta name="description" content="web technology and e-services company" />
		<meta name="author" content="element&circ;n" />
		
		<!-- Dublin Core Metadata -->
		
		<meta name="DC.Version" content="<?php print $config['DC']['Version'] ?>" />
		<meta name="DC.Publisher" content="<?php print $config['DC']['Publisher'] ?>" />
		<meta name="DC.Creator" content="<?php print $config['DC']['Creator'] ?>" />
		<meta name="DC.Creator.Address" content="<?php print $config['DC']['Creator.Address'] ?>" />
		<meta name="DC.Identifier" content="<?php print $config['DC']['Identifier'] ?>" />
		<meta name="DC.Rights" content="<?php print $config['DC']['Rights'] ?>" />
		
		<meta name="DC.Title" content="elementn: <?php print $page["title"]; ?>" />
		<meta name="DC.Type" content="<?php print $config['DC']['Type'] ?>" />
		<meta name="DC.Description" content="<?php print $config['DC']['Description'] ?>" />
		<meta name="DC.Subject.keyword" content="<?php print $config['DC']['Subject.keyword'] ?>" />
		
		<meta name="DC.Date.Created" content="<?php print $page['apsdb.creationTime'] ?>" />
		<meta name="DC.Date.Modified" content="<?php print $page['apsdb.lastModifiedTime'] ?>" />
		<meta name="DC.Language" content="English" />
		
		<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />

	    <link rel="shortcut icon" href="workbench/images/favicon.png" type="image/png" />
	
		<script type="text/javascript" src="lib/dojo/dojo/dojo.js" djConfig="parseOnLoad: false, isDebug: true"></script>
		<script type="text/javascript" src="lib/ApstrataSDK/apstrata/sdk/apstrata.js"></script>

		<style type="text/css">
			@import "lib/dojo/dojo/resources/dojo.css";
		    @import "lib/dojo/dijit/themes/claro/claro.css";
		    @import "lib/dojo/dojox/widget/Dialog/Dialog.css";

	        @import "lib/ApstrataSDK/apstrata/ui/themes/apstrata/apstrata.css";
	        @import "themes/<?php print $config['template'] ?>/<?php print $config['template'] ?>.css";
        </style>
		
		<script type="text/javascript">
			dojo.require("dojo.parser")
			
			dojo.ready(function() {
				dojo.registerModulePath("apstrata", "../../../lib/ApstrataSDK/apstrata")
				dojo.registerModulePath("apstrata.home", "../../../src/home")
				dojo.registerModulePath("apstrata.cms", "../../../src/cms")
				
//				dojo.require("apstrata.home.ApConfig")

				//
				// Get apstrata configuration from config.php
				//
				dojo.setObject("apstrata.apConfig", {
					"apstrata.cms": {
						urlPrefix: '<?php print $GLOBALS["config"]["urlPrefix"]; ?>'						
					},
					
				    // apstrata.ui related
				    "apstrata.ui": {
				        "widgets.Login" : {
				            autoLogin: true
				        }
				    },
				 
				    // apstrata.sdk related
				    "apstrata.sdk": {
				        "Connection" : {
							credentials: {
								key: '<?php print $GLOBALS["config"]["apstrataKey"]; ?>'								
							},
							serviceURL: '<?php print $GLOBALS["config"]["apstrataServiceURL"]; ?>',
							defaultStore: '<?php print $GLOBALS["config"]["contentStore"]; ?>',
							timeout: parseInt('<?php print $GLOBALS["config"]["apstrataConnectionTimeout"]; ?>')
				        }
				    },
				    
				    // dashboard specific
				    "apstrata.services" : {
				    	targetClusterUrl: '<?php print $GLOBALS["config"]["targetClusterUrl"]; ?>',
    					worbenchUrl: '<?php print $GLOBALS["config"]["worbenchUrl"]; ?>' 
				    }
				})
				//
				//
				//


			})
		</script>


<!-- end: head.php -->