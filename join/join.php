<?php

/* This script should do one of three things, after checking if the user already exists

1. Store the new user's data and send their resume, responding with "Thank you for becoming a member. You've joined the following mailing lists: <list the mailing lists they are a member of>"
2. Update an existing user's data and resume
3. Or, do nothing 

*/

$subscribeResults = array("ieee-announce" => false,
						  "ieee-projects" => false,
						  "ieee-technical-events" => false,
						  "ieee-jsdc" => false,
						  "ieee-corporate" => false,
						  "ieee-networking" => false,
						  "ieee-external" => false,
						  "ieee-social" => false,
						  "ieee-spark" => false,
						  "ieee-tag-circuits" => false,
						  "ieee-tag-dsp" => false,
						  "ieee-tag-cps" => false,
						  "ieee-tag-bot" => false,
						  "ieee-tag-energy" => false,
						  "ieee-tag-vr" => false
						  );

$mailingLists = array("ieee-announce" => 'IEEE Announce (Weekly Newsletter)',
					  "ieee-projects" => 'IEEE Projects Committee',
					  "ieee-technical-events" => 'IEEE Technical Events Committee',
					  "ieee-jsdc" => 'IEEE JSDC Team',
					  "ieee-corporate" => 'IEEE Corporate Committee',
					  "ieee-networking" => 'IEEE Networking Committee',
					  "ieee-external" => 'IEEE External Relations Committee',
					  "ieee-social" => 'IEEE Social Committee',
					  "ieee-spark" => 'IEEE Spark Committee',
					  "ieee-tag-circuits" => 'IEEE TAG-Circuits',
					  "ieee-tag-dsp" => 'IEEE TAG-DSP',
					  "ieee-tag-cps" => 'IEEE TAG-CPS',
					  "ieee-tag-bot" => 'IEEE TAG-Bot',
					  "ieee-tag-energy" => 'IEEE TAG-Energy',
					  "ieee-tag-vr" => 'IEEE TAG-VR'
					  );

/*
Description: Subscribes to a CITES Sympa mailing list
Return: 0 if the email was already subscribed or if it just subscribed, -1 if subscription failed
TODO: convert this to a more asynchronous or parallel way
*/
function subscribe($mailingList, $subscribeEmail) {
	include_once('../assets/php/simple_html_dom.php');

	global $subscribeResults;

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
		$subscribeResults[$mailingList] = true;
		return 0;
	}

	return -1;
}

function subscribeMultiple($committees, $tags, $subscribeEmail) {
	// Subscribe the user to their choices of committees
	foreach ($committees as $key => $value) {
		subscribe($value, $subscribeEmail);
	}

	// Subscribe the user to their choices of TAGs
	foreach ($tags as $key => $value) {
		subscribe($value, $subscribeEmail);
	}
}

/*
Description: Sends the user's resume to our database in Google Drive
Return: true if mail sent successfully, false if not
*/
function sendResume($resumeName, $member_name) {
	// Send resume if present
	if (isset($_FILES['resume']) && $_FILES['resume']['error'] == UPLOAD_ERR_OK) {
		include_once('../assets/php/PHPMailer.php');

	    // Set up the mailing information
		$mail = new PHPMailer;

		$mail->From = "resume@ieee.illinois.edu";
		$mail->FromName = "IEEE UIUC Resume Mailer";
		$mail->addAddress("ieee.uiuc@gmail.com");

		$mail->isHTML(true);
		$mail->Subject = "{$member_name}'s Resume";
		$mail->Body = "Here is the resume of <b>{$member_name}</b>";

	    $mail->AddAttachment($_FILES['resume']['tmp_name'], $resumeName);

	    // Send the mail, saving the status messsage
	    return $mail->send();
	}
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

// Include MySQL credentials and connect
require_once("../assets/php/mysql_credentials.php");

$con = new mysqli($mysqli_server, $mysqli_username, $mysqli_password, $mysqli_db);

// Check connection
if ($con->connect_error) {
    $ret = array("success" => false,
				 "message" => "<h4>Could not submit form. Please try again later.</h4>",
				 "error" => "Database connection error."
				 );
	die(json_encode($ret));
}

// Save all the user information into local variables, which match the input tag name attributes
$userData = array();
parse_str($_POST["userData"], $userData);

// Following "<Name> - <NetID> - Resume" naming scheme
if (isset($_FILES['resume']) && $_FILES['resume']['error'] == UPLOAD_ERR_OK) {
	$resumeName = $userData["member_name"] . " - " . $userData["member_netid"] . " - " . "Resume.pdf";
}
else {
	$resumeName = '';
}

// Since National ID is optional, if it's not set, set it to empty string
if (!isset($userData["member_national_id"])) {
	$userData["member_national_id"] = 0;
}

// Check if the member exists already based on the NetID primary key
$stmt = $con->prepare("SELECT * FROM members WHERE member_netid=?");
$stmt->bind_param('s', $userData["member_netid"]);
$stmt->execute();
$stmt->store_result();

$exists = false;
if ($stmt->num_rows) {
	$exists = true;
}

$stmt->close();

// For existing users: Update Email, National ID, Resume Name | WHERE=netid
// Both NetID AND UIN are checked to reduce the chance of someone overwriting someone else's data (since most people don't know other people's UINs)
if ($exists) {
	$stmt = $con->prepare("UPDATE members
					   	   SET member_email=?,
					   	   	   member_national_id=?,
					   	       member_resume_name=?
					   	   WHERE member_netid=? AND member_uin=?");

	$stmt->bind_param('sissi', $userData["member_email"], $userData["member_national_id"], $resumeName, $userData["member_netid"], $userData["member_uin"]);
}

// For new users: Insert Name, NetID, UIN, Email, National ID, Resume File Name
else {
	$stmt = $con->prepare("INSERT INTO members (member_name, member_netid, member_uin, member_email, member_national_id, member_resume_name) VALUES (?,?,?,?,?,?)");

	$stmt->bind_param('ssisis', $userData["member_name"], $userData["member_netid"], $userData["member_uin"], $userData["member_email"], $userData["member_national_id"], $resumeName);
}

// Insert/Update the DB, checking if there are any errors
if (!$stmt->execute()) {
    $ret = array("success" => false,
				 "message" => "<h4>Could not submit form. Please try again later.</h4>",
				 "error" => "Insert/Update failed."
				 );
	die(json_encode($ret));
}

// Close the connection
$stmt->close();

/* For both existing and new users: 
	1. Subscribe to Announce, if they chose to
	2. Subscribe to their chosen committees and TAGs
	3. Send Resume 
*/
if (isset($userData["announce"])) {
	$announce = "ieee-announce";
	subscribe($announce, $userData["member_email"]);
}

// Kind of a jank way of doing it, but in the event the user doesn't choose any committees or TAGs, then make sure the subscribeMultiple call doesn't fail
if (!isset($userData["committees"]))
	$userData["committees"] = array();

if (!isset($userData["tags"]))
	$userData["tags"] = array();

subscribeMultiple($userData["committees"], $userData["tags"], $userData["member_email"]);
sendResume($resumeName, $userData["member_name"]);

$html = '<h4>Thanks for joining IEEE UIUC! Here are the mailing lists you just signed up for. You will receive emails for confirming subscription momentarily. Please note that you will have to confirm your subscription in order to receive any future emails.';

// Tell them which ones they subscribed for
foreach ($subscribeResults as $list => $status) {
	if ($status) {
		$html .= '<li>' . $mailingLists[$list] . '</li>';
	}
}

$html .= '</h4>';

$ret = array("success" => true,
			 "message" => $html,
			 );

echo json_encode($ret);

?>