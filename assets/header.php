<?php 
	$path = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH);

	$arr = Array("/about/" => "About",
				 "/news/" => "News",
				 "/projects/" => "Projects",
				 "/spark/" => "Spark",
				 "/awards/" => "Awards",
				 "/corporate/" => "Corporate",
				 "/contact/" => "Contact",
				 "/join/" => "Join");

	foreach($arr as $folder => $target)
	{
		$pos = strpos($path, $folder);

		if ($pos !== false)
		{
			$found = $target;
			break;
		}
	}

	// Generates a menu item based on the $section argument, referring to the global $arr
	function genMenuItem($section)
	{
		global $arr, $found;

		// Whether the current one is active
		$active = ($found == $section ? ' navbar-link-active' : '');

		// We want Join to be bold
		$join = ($section == "Join" ? '<b>' . $section . '</b>' : $section);

		return '<a href="' . array_search($section, $arr) . '"class="pure-menu-link navbar-link' . $active . '">'. $join . '</a>';
	}

?>

<div class="pure-u-1 pure-u-md-1-4">
	<div class="pure-menu">
		<a href="/" class="pure-menu-heading" style="width:50%;"><img class="logo" src="/assets/img/logo.png"></a>
		<div class="navbar-toggle" id="toggle"><span class="bar"></span><span class="bar"></span><span class="bar"></span></div>
	</div>
</div>

<div class="pure-u-1 pure-u-md-3-4 flex-nav">
	<div class="pure-menu pure-menu-horizontal navbar-menu menu-can-transform">
		<ul class="pure-menu-list">
			<?php 
				foreach($arr as $folder => $target) {
					echo '<li class="pure-menu-item ieee-menu-item">' . genMenuItem($target) . '</li>';
				}
			?>
		</ul>
	</div>
</div>