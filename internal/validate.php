<?php

if (!isset($_POST["password"])) {
	die("denied");
}

$password = hash('sha256', $_POST["password"]);

if ($password === "4e8507558c8d6d31fff71585156ac5d70ea5d21f9a8b5538beeeed2d39950af7") {
	echo "allowed";
}

else {
	echo "denied";
}

?>