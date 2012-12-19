<?php
	class CMS {
	
	    public function __construct($config, $pageId) {
	        $this->config = $config;
			$this->pageId = $pageId;
	    }
	
		public function getMenu() {
			if ($GLOBALS["config"]["useStub"]) return $GLOBALS["testData"]["menu"];
			
			$url = $GLOBALS["config"]["apstrataServiceURL"] . "/" . $GLOBALS["config"]["apstrataKey"] . '/RunScript?apsdb.scriptName=apstrata.getMenu';
			$result = file_get_contents ($url); 

			if ($result != FALSE) {
				eval("\$menu =" . $result);				
				if ($menu["pageFound"]=="1") {
					return $menu;
				} else {
					return array (
						"menuPhp" => array(),
						"leftFooterPhp" => array(),
						"rightFooterPhp" => array()
					);
				}
			} else {
				return array (
					"title" => "internal server error",
					"template" => "internalError"
				);
			}
		
		}
		
		public function getPage($id) {
						
			if ($GLOBALS["config"]["useStub"]) {
				if ($id == "home") return $GLOBALS["testData"]["home"];
				
				if ($id == "catalog") return $GLOBALS["testData"]["collection"];
				else return $GLOBALS["testData"]["page"];
			}

			// apstrata dockey can't contain forward slashes(/), replace them with dots (.)
			$id = str_replace("/", ".", $id);
		
			$url = $GLOBALS["config"]["apstrataServiceURL"] . "/" . $GLOBALS["config"]["apstrataKey"] . '/RunScript?apsdb.scriptName=apstrata.getPageJSon&page=' . $id;
			$result = file_get_contents ($url); 
			
			//Page content as associative array
			$page = json_decode($result, true);
			
			if ($result != FALSE) {
				//$error = eval("\$page =" . $result);				
				
				if ($page["pageFound"]=="1") {							
					return $page;
				} else {
					return array (
						"title" => "page not found",
						"template" => "pageNotFound"
					);
				}
			} else {
				return array (
					"title" => "internal server error",
					"template" => "internalError"
				);
			}
			
			return $page;
		}
		
		public function getLink($item) {
			$url='';
			$class='';
			$link='';

			if (isset($item['link']) && ($item['link'] != "")) { 
				$url = $item['link'];
			} else if (isset($item['id'])) { 
				$url = $this->getUrl($item['id']);
				if ($item['id'] == $this->pageId) $class="class='selected'";
			}

			if (isset($item['target'])) {
				$url = $url . "' target='" . $item['target'];
			}

			if (isset($item['type'])) {
				if ($item['type']=='external') {
					$url = $item['url'] . "' target='_new";
				}
			} 
			
			
			if (isset($item['title'])) $link = "<a " . $class . " href='" . $url . "'>" .  $item['title'] . "</a>";
			
			return $link;
		}

		public function getUrl($path) {
			return $this->config['baseUrl']."/".$this->config['urlPrefix'] . $path;
			
		}
	}
?>
