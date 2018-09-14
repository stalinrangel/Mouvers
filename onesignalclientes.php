<?PHP


	function sendMessage(){

		$token_notificacion=$_GET['token_notificacion'];
		$contenido=$_GET['contenido'];
		$pedido_id=$_GET['pedido_id'];
		$accion=$_GET['accion'];
		//$obj=$_REQUEST["obj"];
		$obj=$_GET['obj'];
		
		print_r($_GET);
		 
			$content = array(
				"en" => $contenido
				);
			
			$fields = array(
				'app_id' => "32500e5f-2def-4a7a-96bf-541ceb67df76",
				'include_player_ids' => array($token_notificacion),
	      		'data' => array("contenido" => $contenido,"pedido_id"=>$pedido_id,"accion"=>$accion, "obj"=>$obj),
				'contents' => $content/*,
				'small_icon'=>'http://shopper.internow.com.mx/assets/img/logo-symbol.png',
				'adm_small_icon'=>'http://mouvers.mx/terminos/imgs/mouver.png',
				'chrome_web_icon'=>'http://mouvers.mx/terminos/imgs/mouver.png',
				'chrome_web_image'=>'http://mouvers.mx/terminos/imgs/mouver.png',
				'firefox_icon'=>'http://mouvers.mx/terminos/imgs/mouver.png',
				'chrome_icon'=>'http://mouvers.mx/terminos/imgs/mouver.png',
				'chrome_web_default_notification_icon'=>'http://mouvers.mx/terminos/imgs/mouver.png',
				'onesignal_bgimage_default_image'=>'http://mouvers.mx/terminos/imgs/mouver.png'*/
			);
			
			$fields = json_encode($fields);
	    	print("\nJSON sent:\n");
	    	print($fields);
			
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
			curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
														'Authorization: Basic YmEwZDMwMDMtODY0YS00ZTYxLTk1MjYtMGI3Nzk3N2Q1YzNi'));
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
			curl_setopt($ch, CURLOPT_HEADER, FALSE);
			curl_setopt($ch, CURLOPT_POST, TRUE);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

			$response = curl_exec($ch);
			curl_close($ch);
			$pushes=$pushes.'"'.$server_output[$i]->push.'",';

		$pushes=substr($pushes, 0,-1);
		echo $pushes;
		
		return $response;
	}
	
	$response = sendMessage();
	$return["allresponses"] = $response;
	$return = json_encode( $return);
	
  print("\n\nJSON received:\n");
	print($return);
  print("\n");
?>