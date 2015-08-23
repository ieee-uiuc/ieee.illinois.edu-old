<?php

include_once('simple_html_dom.php');

// Build Sympa POST request
$url = "https://lists.illinois.edu/lists";

$fields = array('email' => $_POST['email'],
				'list' => 'ieee-announce',
				'action' => 'subrequest');

$query = http_build_query($fields);

// Send request, saving into $response
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec ($ch);
curl_close ($ch);

$dom = str_get_html( $response );
$sympa_response = $dom->find('.ContentBlock')[0]->plaintext;

$subscribe_success = false;

// Check if they're already subscribed
if (strpos($sympa_response, "You are already subscribed") !== false) {
	$subscribe_success = true;
	echo 'You are already subscribed to IEEE Announce!';
}

// Otherwise they successfully subscribed just now
else if (strpos($sympa_response, "You've made a subscription request") !== false) {
	$subscribe_success = true;
	echo 'Thanks for subscribing to IEEE Announce! You will receive an email shortly with more instructions.';
}

?>