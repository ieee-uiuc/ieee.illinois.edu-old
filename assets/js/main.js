var logo, nav, toggle, content;

/* ------------->>> Navbar <<<--------------*/

function toggleMenu()
{
	// set timeout so that the panel has a chance to roll up before the menu switches states
	if (nav.hasClass('open'))
	{
		// this delay isn't actually doing anything, same with setTimeout
		$('.menu-can-transform').delay(500).addClass('pure-menu-horizontal');
	}
	else
	{
		$('.menu-can-transform').removeClass('pure-menu-horizontal');
	}

	nav.toggleClass('open');
	toggle.toggleClass('x');
};

/* ------------->>> Join Page <<<--------------*/

// Sets the email input box's default value to the netid@illinois.edu
function setEmail()
{
	$("[name='member_email']").val( $("[name='member_netid']").val() + "@illinois.edu" );
}

// Collects the join form info, including the resume file and submits it
function submitJoin()
{
	// Gather the form data and serialize it
	var userData = $("#join_form .pure-u-1 .pure-form .pure-control-group input").serialize();

	// The file element
	var resumeFile = $("input[name='member_resume']")[0].files[0];

	// Create the FormData object. Note that I don't care for supporting IE9 or below.
	var fd = new FormData();
	fd.append("userData", userData);
	fd.append("resume", resumeFile);

	// Send it over, and fill the response the response
	$.ajax({
	  url: "/assets/php/join.php",
	  type: "POST",
	  data: fd,
	  processData: false,
	  contentType: false,
	  success: function(data, textStatus, jqXHR)
	  {
	  	$('#join_form').fadeOut("slow", function(){
		    var div = $("<div class='pure-g' id='join_results'><div class='pure-u-1'>" + data + "</div></div>").hide();
		    $(this).replaceWith(div);
		    $('#join_results').fadeIn("slow");
		});
	  }
	});
}

/* ------------->>> News <<<--------------*/

// Note: data from getNews.php comes in as a string, holding either "error: <error code>" or json

// Load all news items
function loadNews()
{
	var news = $("#news-container");
	var err_str = '<h4>Could not load news items. Please try refreshing the page.</h4>';
	var no_posts_str = '<h4>There are no posts to display.</h4>';

	$.get( "/assets/php/getNews.php?type=news", function( data )
	{
		// if it errored out, put in the error string
		if (data.indexOf("error: ") >= 0)
		{
			news.append(err_str);
			return;
		}

		else if (data == "none")
		{
			news.append(no_posts_str);
			return;
		}

		// else if it was a json output
		var data_arr = $.parseJSON(data);

		$(data_arr).each(function(index, curr)
		{
			var imageURL = curr.post_image;

			// only set the pic if url is present
			var div = '<div class="pure-g">';
			var title = '<div class="pure-u-1"><h3 class="news-title">' + curr.post_title + '</h3></div>';
			
			var pic = '';
			var x = 4;

			// if there is an image, add it and set the description size to 3/4ths width
			if (imageURL !== "")
			{
				pic = '<div class="pure-u-1 pure-u-md-1-4"><img class="pure-img" src="' + imageURL + '"></div>';
				x = 3;
			}

			var desc = '<div class="pure-u-1 pure-u-md-' + x + '-4"><p>' + curr.post_description + '</p></div>';

			news.append(div + title + pic + desc);
		});
	});
}

// Load front page news items only
function loadFrontNews()
{
	var slides = $(".slides");
	var err_str = '<li><h3>Could not load news items. Please try refreshing the page.</h3></li>';
	var no_posts_str = '<li><h3>There are no posts to display.</h3><li>';

	$.get( "/assets/php/getNews.php?type=front", function( data )
	{
		// if it errored out, put in the error string
		if (data.indexOf("error: ") >= 0)
		{
			slides.append(err_str);
			return;
		}

		else if (data == "none")
		{
			slides.append(no_posts_str);
			return;
		}

		// else if it was a json output
		var data_arr = $.parseJSON(data);

		$(data_arr).each(function(index, curr)
		{
			var title = curr.post_title;
			var description = curr.post_description;
			var imageURL = curr.post_image;

			slides.append('<li><h3>' + title + '</h3>' + '<h4>' + description + '</h4></li>');
		});

		// now that it's all loaded, call the flexslider stuff
		$('.flexslider').flexslider({
	    	slideshowSpeed : 7500,
	    	animation : "slide",
	    	maxItems : 5,
	    });
	});
}

/* ------------->>> Spark <<<--------------*/

/* Displays the correct spark pdf in the viewer */
function viewSpark(edition)
{
	$('#spark-viewer').html('<object data="Spark - sp10.pdf" type="application/pdf"><p>Alternative text - include a link <a href="Spark - sp10.pdf">to the PDF!</a></p></object>');
}

/* ------------->>> About <<<--------------*/

function loadCommittees()
{
	var committees = $('#committees');

	// for each thing in committees.json, make a section, alternating the color
	$.getJSON( "/about/committees/committees.json", function(data, status, jqXHR) {
		var highlight = false;

		$.each( data, function( branch, subcommittees )
		{

			var append = '<section';

			if (highlight)
				append += ' class="highlight"';

			append += '><h2>' + branch + '</h2><div class="pure-g">'
			$.each(subcommittees, function(key, committee) 
			{
				append += '<div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-3 center-align"><h3 class="orange-text" id="projects">' + committee.name + '</h3><p>' + committee.description + '</p></div>';
			});
			append += '</div></section>';
			committees.append(append);

			// Alternate highlight
			highlight = !highlight;

		});
	});
}

function loadExecBoard()
{
	var execBoard = $('#exec-board');

	// for each thing in execBoard.json, make a section, alternating the color
	$.getJSON( "/about/exec-board/exec-board.json", function(data, status, jqXHR) {
		var highlight = false;

		$.each( data, function( branch, branchMembers )
		{

			var append = '<section';

			if (highlight)
				append += ' class="highlight"';

			append += '><h2>' + branch + '</h2><div class="pure-g">'
			$.each(branchMembers, function(key, member) 
			{
				// append += '<div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-3 center-align"><img class="headshot pure-img" src="' + member.imageUrl + '"></img><h3 class="orange-text" id="projects">' + member.name + '</h3><p>' + member.description + '</p></div>';

				append += '<div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-3 center-align"><img class="headshot pure-img" src="' + member.imageUrl + '"></img><h3>' + member.name+ '</h3><h4>' + member.title + '</h4><a href="' + member.email + '">ieee-president@illinois.edu</a><p>' + member.description + '</p></div>';
			});
			append += '</div></section>';
			execBoard.append(append);

			// Alternate highlight
			highlight = !highlight;

		});
	});
}


/* ------------->>> Global <<<--------------*/

// jQuery to make the navbar solid color on scroll
$(window).scroll(function()
{
	// if the menu is open and you scroll, close the menu
	if (nav.hasClass('open'))
	{
		nav.toggleClass('open');
		$('.menu-can-transform').delay(500).addClass('pure-menu-horizontal');
		toggle.toggleClass('x');
	}

	// get the computed height of the navbar
	var navHeight = parseFloat(window.getComputedStyle(nav[0]).getPropertyValue("height").replace(/[^0-9\,\.\-]/g, ''));

	// On scroll, make the navbar solid, and the logo smaller
	if (nav.offset().top > content.offset().top-navHeight)
	{
		nav.addClass("solid-nav");
		logo.addClass("small-logo");
	}
	else
	{
		nav.removeClass("solid-nav");
		logo.removeClass("small-logo");		
	}
});

// After page content is loaded, fill in header and footer, then do initial things;
$(".navbar-wrapper").load("/assets/header.php", function() {
	$("#footer").load("/assets/footer.html", function() {
		// Now that all DOM content is loaded, fill in the global variables
		logo = $(".logo");
		nav = $(".navbar-wrapper");
		toggle = $("#toggle");
		content = $(".content-wrapper");

		// Bind the hamburger toggle to the menu toggle function
		toggle.click(toggleMenu);

		// If the window resizes or changes orientation and menu is open, close the menu
		window.addEventListener( ('onorientationchange' in window) ? 'orientationchange':'resize' , function(){
			if (nav.hasClass('open'))
			{
				toggleMenu();
			}
		});

		$('#twitter-wrapper').click(function () {
		    $('#twitter-wrapper iframe').css("pointer-events", "auto");
		});
	});
});

