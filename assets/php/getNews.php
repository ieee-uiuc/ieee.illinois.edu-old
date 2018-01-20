<?php

//require_once("mysql_credentials.php");
$mysqli_server = "localhost";
$mysqli_username  = "ieeeatill_temp";
$mysqli_password = "1Ya#!m%^R00;";
$mysqli_db = "ieeeatill_main";

// Connect to the mysql server, and check if it was successful
$con = mysqli_connect($mysqli_server, $mysqli_username, $mysqli_password, $mysqli_db, "3306");
if (!$con)
{
	$ret = array("success" => false,
				 "message" => "<h4>Could not load news items. Please try refreshing the page.</h4>",
				 "error" => "Database connection error."
				 );
	die(json_encode($ret));
}

// change query depending on the type of thing we want
// the type is either news, or front page items

$query = "SELECT * FROM news";

// If the front page is requesting news, then only return those that should be only those
if ($_GET["type"] == "front")
	$query = " WHERE front_page=1";

$result = mysqli_query($con, $query);

// If the query failed, we're done
if (!$result)
{
	$ret = array("success" => false,
				 "message" => "Could not load the news items. Please try refreshing the page.",
				 "error" => "Query failed."
				 );
}

else {
	$numResults = mysqli_num_rows($result);
	$results = mysqli_fetch_all($result, MYSQLI_ASSOC);

	/* Strip any html from the descriptions except for <a> tags and line breaks */
	foreach ($results as $key => $post) {
		$results[$key]["post_description_short"] = strip_tags($post["post_description_short"], "<a></a><br><br/>");
	}

	// Reverse the $results array so it's newest to oldest
	$results = array_reverse($results);

	$ret = array("success" => true,
				 "message" => "Posts found.",
				 "numResults" => $numResults,
				 "results" => $results
				);
}

// Respond with the output
echo json_encode($ret);

// Close the connection
mysqli_close($con);

?>
