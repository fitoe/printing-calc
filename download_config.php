<?php
@$data=$_POST['data'];
@$filename=$_POST['filename'].".ini";
$ua = $_SERVER["HTTP_USER_AGENT"];  
$encoded_filename = urlencode($filename);  
$encoded_filename = str_replace("+", "%20", $encoded_filename);  
header("Content-Type: application/octet-stream");  
	if (preg_match("/MSIE/", $_SERVER['HTTP_USER_AGENT']) ) {  
		header('Content-Disposition:  attachment; filename="' . $encoded_filename . '"');  
	} elseif (preg_match("/Firefox/", $_SERVER['HTTP_USER_AGENT'])) {  
		header('Content-Disposition: attachment; filename*="ASCII' .  $filename . '"');  
	} else {  
		header('Content-Disposition: attachment; filename="' .  $filename . '"');  
	}
	echo $data;
?>