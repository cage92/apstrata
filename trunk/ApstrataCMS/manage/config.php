<?php

	$config = array (
		// 
		// Apstrata backend connection parameters
		//
		"apstrataServiceURL" => "https://varick.apstrata.com/apsdb/rest",
		"apstrataConnectionTimeout" => 30000,
		"apstrataKey" => "E83D22E93F",
		"apstrataSecret" => "",		

		//
		// Apstrata stores used by code
		//
		"contentStore" => "apstrata",

		//
		// Config params useful during development
		//
		"developmentMode" => false,
		"useStub" => false,
		"autoLogin" => false,
		
		//
		// Config params for jsConnect in order to establish SSO with apstrata forum
		//
		"jsConnectClientID" => "953217106",
		"jsConnectSecret" => "9f57204826f2830b8969e1e67f1cb401",

		//
		// URLs and other related values used to compose paths by the php CMS code 
		//
		//"baseUrl" => "http://localhost/ApstrataCMS",
		"baseUrl" => "http://www.apstrata.com",
		"urlPrefix" => "page.php?pageId=",
		"loginUrl" => "dashboard",
		"docroot" => $_SERVER["DOCUMENT_ROOT"],
   		"workbenchUrl" => "http://workbench.apstrata.com",
		"targetClusterUrl" => "https://varick.apstrata.com/apsdb/rest",

		//
		// Controls caching parameters in /page.php
		//
		"cachingHeaders" => "false",
		"cachingAge" => 3000,

		//
		// Controls the template folder and CSS root class used by the site
		//
		"template" => "min"
	);
	
	// Dublin Core meta-data site-wide init
	$config["DC"] = array (
		"Title" => "apstrata",
		"Type" => "cloud, back end as a service, BaaS, mobile cloud, HTML5 cloud",
		"Description" => "HTML5 and mobile cloud Back-end as a Service",
		"Subject.keyword" => "apstrata, html5, BaaS, SaaS, PaaS, cloud computing, rich client, RIA, iOS, android",
		"Version" => "1",
		"Publisher" => "apstrata",
		"Creator" => "apstrata",
		"Creator.Address" => "apstrata",
		"Identifier" => "http://www.apstrata.com/",
		"Rights" => "Copyright, Copyright Statement (http://www.apstrata.com/terms)."
	);
?>

