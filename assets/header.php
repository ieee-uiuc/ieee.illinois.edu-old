<?php 
	$path = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH);

	$arr = Array("/about/contact/" => "Contact",
				 "/about/" => "About",
				 "/news/" => "News",
				 "/projects/" => "Projects",
				 "/spark/" => "Spark",
				 "/awards/" => "Awards",
				 "/corporate/" => "Corporate Relations",
				 "/join/" => "Join",
				 "/" => "Home");

	foreach($arr as $folder => $target)
	{
		$pos = strpos($path, $folder);

		if ($pos !== false)
		{
			$found = $target;
			break;
		}
	}

?>


<div class="pure-u-1 pure-u-md-1-4">
	<div class="pure-menu">
		<a href="/" class="pure-menu-heading" style="width:50%;"><img class="logo" src="/assets/img/logo.png"></a>
		<a href="javascript:void(0)" class="navbar-toggle" id="toggle"><s class="bar"></s><s class="bar"></s></a>
	</div>
</div>

<div class="pure-u-1 pure-u-md-3-4 flex-nav">
	<div class="pure-menu pure-menu-horizontal navbar-menu menu-can-transform">
		<ul class="pure-menu-list">
			<li class="pure-menu-item ieee-menu-item">
				<?php

				echo "<a href=\"/about/\" class=\"pure-menu-link navbar-link";

				if ($found == "About")
					echo " navbar-link-active\">About</a>\n<hr class=\"navbar-active\" />";

				else
					echo "\">About</a>"

				?>
			</li>

			<li class="pure-menu-item ieee-menu-item">
				<?php

				echo "<a href=\"/news/\" class=\"pure-menu-link navbar-link";

				if ($found == "News")
					echo " navbar-link-active\">News</a>\n<hr class=\"navbar-active\" />";

				else
					echo "\">News</a>"

				?>
			</li>	

			<li class="pure-menu-item ieee-menu-item">
				<?php

				echo "<a href=\"/projects/\" class=\"pure-menu-link navbar-link";

				if ($found == "Projects")
					echo " navbar-link-active\">Projects</a>\n<hr class=\"navbar-active\" />";

				else
					echo "\">Projects</a>"

				?>
			</li>

			<li class="pure-menu-item ieee-menu-item">
				<?php

				echo "<a href=\"/spark/\" class=\"pure-menu-link navbar-link";

				if ($found == "Spark")
					echo " navbar-link-active\">Spark</a>\n<hr class=\"navbar-active\" />";

				else
					echo "\">Spark</a>"

				?>
			</li>

			<li class="pure-menu-item ieee-menu-item">
				<?php

				echo "<a href=\"/awards/\" class=\"pure-menu-link navbar-link";

				if ($found == "Awards")
					echo " navbar-link-active\">Awards</a>\n<hr class=\"navbar-active\" />";

				else
					echo "\">Awards</a>"

				?>
			</li>

			<li class="pure-menu-item ieee-menu-item">
				<?php

				echo "<a href=\"/corporate/\" class=\"pure-menu-link navbar-link";

				if ($found == "Corporate Relations")
					echo " navbar-link-active\">Corporate</a>\n<hr class=\"navbar-active\" />";

				else
					echo "\">Corporate</a>"

				?>
			</li>

			<li class="pure-menu-item ieee-menu-item">
				<?php

				echo "<a href=\"/about/contact/\" class=\"pure-menu-link navbar-link";

				if ($found == "Contact")
					echo " navbar-link-active\">Contact</a>\n<hr class=\"navbar-active\" />";

				else
					echo "\">Contact</a>"

				?>
			</li>

			<li class="pure-menu-item ieee-menu-item">
				<?php

				echo "<a href=\"/join/\" class=\"pure-menu-link navbar-link";

				if ($found == "Join")
					echo " navbar-link-active\"><b>Join</b></a>\n<hr class=\"navbar-active\" />";

				else
					echo "\"><b>Join</b></a>"

				?>
			</li>
		</ul>
	</div>
</div>