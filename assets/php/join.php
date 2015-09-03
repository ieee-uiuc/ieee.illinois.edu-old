<?php

/* This script should do one of three things, after checking if the user already exists

1. Store the new user's data and send their resume, responding with "Thank you for becoming a member. You've joined the following mailing lists: <list the mailing lists they are a member of>"
2. Update an existing user's data and resume
3. Or, do nothing 

*/

// Subscribes to a CITES Sympa mailing list, testing the output
// Returns 0 if the email was already subscribed or if it just subscribed

// TODO: convert this to a more asynchronous or parallel way
function subscribe($mailingList, $subscribeEmail) {
	include_once('simple_html_dom.php');

	// Build Sympa POST request
	$url = "https://lists.illinois.edu/lists";

	$fields = array('email' => $subscribeEmail,
					'list' => $mailingList,
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

	// Check if they're already subscribed or if they successfully subscribed justnow
	if ( (strpos($sympa_response, "You are already subscribed") !== false) || (strpos($sympa_response, "You've made a subscription request") !== false) ) {
		return 0;
	}

	return -1;
}

/* BEGIN PROCESSING */

// If the request type isn't POST or the userData isn't given, exit saying it failed
if ( ($_SERVER['REQUEST_METHOD'] != 'POST') || !(isset($_POST["userData"])) ) {
	$ret = array("success" => false,
				 "message" => "Sorry, we couldn't process your request. Please try again.",
				 "error" => "Bad request method or no data provided"
				 );
	die(json_encode($ret));
}

// Save all the user information into local variables, which match the input tag name attributes
$userData = array();
parse_str($_POST["userData"], $userData);

// Check if netid exists in db already. If so, update their info in db and resume


// Store in database (one field is resume_name)


// Send resume if present
if (isset($_FILES['resume']) && $_FILES['resume']['error'] == UPLOAD_ERR_OK) {
	include_once('PHPMailer.php');

    // Set up the mailing information
	$mail = new PHPMailer;

	$mail->From = "resume@ieee.illinois.edu";
	$mail->FromName = "IEEE UIUC Resume Mailer";
	$mail->addAddress("ieee.uiuc@gmail.com");

	$mail->isHTML(true);
	$mail->Subject = "{$member_name}'s Resume";
	$mail->Body = "Here is the resume of <b>{$member_name}</b>";

	// Following "<Name> - <NetID> - Resume" naming scheme
	$resumeName = $member_name . " - " . $member_netid . " - " . "Resume";
    $mail->AddAttachment($_FILES['resume']['tmp_name'], $resumeName);

    // Send the mail, saving the status messsage
    $mail_success = $mail->send();

    return $mail_success;
}

?>