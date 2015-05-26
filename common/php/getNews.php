<?php

require_once("mysql_credentials.php");
 
// Connect to the mysql server, and check if it was successful
$con = mysqli_connect($mysqli_server, $mysqli_username, $mysqli_password, $mysqli_db);
if (!$con)
{
	die("error: db connection");
}

// change query depending on the type of thing we want
// the type is either news, or front page items

$query = "SELECT * FROM blog";

// If the front page is requesting news, then only return those that should be only those
if ($_GET["type"] == "front")
	$query .= " WHERE front_page=1";

$result = mysqli_query($con, $query);

// check if the query failed
if (!$result)
{
	die("error: query failed");
}

// If there are no posts to display, die outputting "none".
if (mysqli_num_rows($result) == 0)
{
	die("none");
}

echo json_encode(mysqli_fetch_all($result, MYSQLI_ASSOC));

// Close the connection
mysqli_close($con);

?>