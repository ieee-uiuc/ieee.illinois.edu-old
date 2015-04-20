<?php

// the user data variable names match the "name" attributes in the html join page

// Include the php mailer
require_once(__DIR__ . "/../common/php/PHPMailer.php");

// Save all the user information into local variables
parse_str($_POST["userData"]);

// Set up the mailing information
$mail = new PHPMailer;

$mail->From = "resume@ieee.illinois.edu";
$mail->FromName = "IEEE UIUC Resume Mailer";
$mail->addAddress("ieee.uiuc@gmail.com");

// Attach the resume file
if (isset($_FILES['resume']) &&
    $_FILES['resume']['error'] == UPLOAD_ERR_OK) {
    $mail->AddAttachment($_FILES['resume']['tmp_name'], $_FILES['resume']['name']);
}

$mail->isHTML(true);
$mail->Subject = "{$member_name}\'s Resume";
$mail->Body = "Here is the resume of <b>{$member_name}</b>";

// Send the email, saving status
if (!$mail->send())
{
	$mail_status = $mail->ErrorInfo;
}
else
{
	$mail_status .= "success";
}

if ($mail_status != "success")
{
	echo $mail_status;
}

print_r($committees);

// if the netid is in the db already, echo saying that


/* This script should do one of three things, after checking if the user already exists

1. Store the new user's data, responding with "Thank you for becoming a member. You've joined the following mailing lists: <list the mailing lists they are a member of>"
2. Update an existing user's data
3. Or, do nothing 

*/

?>