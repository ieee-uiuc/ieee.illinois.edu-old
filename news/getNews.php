<?php

require_once(__DIR__ . "/../common/php/mysql_credentials.php");

$news_items = array
(
	array(
		"post_title" => "Hello world",
		"post_description" => "Lorem Ipsum. Lorem Ipsum. Lorem Ipsum. Lorem Ipsum. ",
		"post_image" => "/about/exec-board/bs.jpg"
		),

	array(
		"post_title" => "Hello world",
		"post_description" => "Lorem Ipsum. Lorem Ipsum. Lorem Ipsum. Lorem Ipsum. ",
		"post_image" => "/about/exec-board/bs.jpg"
		)
);
 
// Connect to the mysql server, and check if it was successful
$con = mysqli_connect($mysqli_server, $mysqli_username, $mysqli_password, $mysqli_db);
if (!$con)
{
	die("error: db connection");
}

$query = "SELECT * FROM blog";

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

//echo json_encode($news_items);


?>