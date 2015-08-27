var logo, nav, toggle, content;

/* ------------->>> Navbar <<<--------------*/

function toggleMenu() {
	// set timeout so that the panel has a chance to roll up before the menu switches states
	if (nav.hasClass('open')) {
		setTimeout( function() {
			$('.menu-can-transform').addClass('pure-menu-horizontal');
		}, 500);
	}
	else {
		$('.menu-can-transform').removeClass('pure-menu-horizontal');
	}

	nav.toggleClass('open');
	toggle.toggleClass('x');
};

// Makes the navbar solid
function solidNav() {
	// if the menu is open and you scroll, close the menu
	if (nav.hasClass('open')) {
		setTimeout( function() {
			$('.menu-can-transform').addClass('pure-menu-horizontal');
		}, 500);
		nav.toggleClass('open');
		toggle.toggleClass('x');
	}

	var navBottom = $('#navBottom');

	// get the computed height of the navbar
	var navHeight = parseFloat(window.getComputedStyle(navBottom[0]).getPropertyValue("height").replace(/[^0-9\,\.\-]/g, ''));

	// On scroll, make the navbar solid, and the logo smaller
	if (navBottom.offset().top > content.offset().top-navHeight) {
		nav.addClass("solid-nav");
		logo.addClass("small-logo");
	}
	else {
		nav.removeClass("solid-nav");
		logo.removeClass("small-logo");		
	}
}

function validateInternal(password) {
	// Need to change this to an asynchronous method that still returns from validateInternal

	var data = $.ajax({
	  url: "/internal/validate.php",
	  type: "POST",
	  data: {"password" : password},
	  async: false,
	}).responseText;


	if (data === "allowed")
		return true;
	else
		return false;
}

/* ------------->>> Announce <<<--------------*/
function showGeneratedAnnounce() {
	var attempted = $('#internalPassword').val();
	var allowed = validateInternal(attempted);

	if (allowed) {
		$('#generatedAnnounce').append('<h3>Here is the generated Announce file. Either download or send.</h3>');
		$('#generatedAnnounce').append('<iframe style="width:100%; height:100%" src="generate.php"></iframe>');
	}
	else {
		$('#generatedAnnounce').append('<h3>Incorrect password. Please try again.</h3>');
	}

	
}


/* ------------->>> Join Page <<<--------------*/

// Sets the email input box's default value to the netid@illinois.edu
function setEmail() {
	$("[name='member_email']").val( $("[name='member_netid']").val() + "@illinois.edu" );
}

// Collects the join form info, including the resume file and submits it
function submitJoin() {
	alert("Sorry the join form is not ready yet. Please check back soon!");
	return;
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
	  success: function(data, textStatus, jqXHR) {
		$('#join_form').fadeOut("slow", function() {
			var div = $("<div class='pure-g' id='join_results'><div class='pure-u-1'>" + data + "</div></div>").hide();
			$(this).replaceWith(div);
			$('#join_results').fadeIn("slow");
		});
	  }
	});
}

/* ------------->>> News <<<--------------*/

// Load all news items
function loadNews() {
	var news = $("#news-container");
	var no_posts_str = '<h4>There are no posts to display.</h4>';

	$.get( "/assets/php/getNews.php?type=news", function( data ) {
		try {
			data = $.parseJSON(data);
		}
		
		catch(e) {
			news.append(no_posts_str);
			return;
		}

		// if it errored out, put in the error string
		if (!data.success) {
			news.append('<h4>' + data.message + '</h4>');
		}

		// If no posts found
		else if (!data.numResults) {
			news.append(no_posts_str);
		}

		// Otherwise, draw all the posts
		else {
			$(data.results).each(function(index, curr) {
				var imageURL = curr.post_image;

				// only set the pic if url is present
				var div = '<div class="pure-u-1"><div class="pure-g">';
				var title = '<div class="pure-u-1"><h3 class="news-title">' + curr.post_title + '</h3></div>';
				
				var pic = '';
				var x = 4;

				// if there is an image, add it and set the description size to 3/4ths width
				if (imageURL !== "")
				{
					pic = '<div class="pure-u-1 pure-u-md-1-4"><img class="pure-img" src="' + imageURL + '"></div>';
					x = 3;
				}

				var desc = '<div class="pure-u-1 pure-u-md-' + x + '-4"><p>' + curr.post_description.replace(/\n/g,"<br>") + '</p></div></div><hr></div>';

				news.append(div + title + pic + desc);
			});
		}
	});
}

// Load front page news items only
function loadFrontNews() {
	var slides = $(".slides");
	var no_posts_str = '<li><h3>There are no posts to display.</h3><li>';

	$.get( "/assets/php/getNews.php?type=front", function( data ) {
		try {
			data = $.parseJSON(data);
		}
		
		catch(e) {
			slides.append(no_posts_str);
			return;
		}

		// if it errored out, put in the error string
		if (!data.success) {
			slides.append('<h4>' + data.message + '</h4>');
		}

		// If no posts found
		else if (!data.numResults) {
			slides.append(no_posts_str);
		}

		// Otherwise, draw all the posts
		else {
			$(data.results).each(function(index, curr) {
				slides.append('<li><h3>' + curr.post_title + '</h3>' + '<h4>' + curr.post_description.replace(/\n/g,"<br>") + '</h4></li>');
			});
		}

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
function viewSpark(edition) {
	$('#spark-viewer').html('<object data="Spark - sp10.pdf" type="application/pdf"><p>Alternative text - include a link <a href="Spark - sp10.pdf">to the PDF!</a></p></object>');
}

/* ------------->>> Global <<<--------------*/

function pickSplash() {
	var path = window.location.pathname;

	// Maps page (by URL path) to a specific image
	// Make sure to use the trailing slash!
	var splashURLs = {
		'/' : 'eceb.jpg',
		'/about/' : 'grainger.jpg',
		'/about/exec-board/': 'exec-board.jpg',
		'/news/' : 'quad.jpg',
		'/projects/' : 'grainger-2.jpg',
		'/awards/' : 'foellinger.jpg'
		
	}

	var splash = splashURLs[path];

	// Get the URL, default to eceb.jpg
	if (splash === undefined) {
		splash = "eceb.jpg";
	}

	$('.splash-wrapper').css('background-image', 'url("/assets/img/splash/' + splash + '")');
}

// After page content is loaded
$(document).ready(function() {
	// Load header and footer
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
			window.addEventListener( ('onorientationchange' in window) ? 'orientationchange':'resize' , function() {
				if (nav.hasClass('open')) {
					toggleMenu();
				}
			});


			// Run the solid nav function in case we've refreshed to a non-top part of the screen
			solidNav();

			// Attach the solid nav function to the scroll event
			$(window).scroll(solidNav);
		});
	});

	// Pick a splash image
	pickSplash();

	// Twitter box styling
	$('#twitter-wrapper').click(function () {
		$('#twitter-wrapper iframe').css("pointer-events", "auto");
	});
});

// Smooth anchor scrolling animation, with the -50 offset to prevent hiding behind the navbar
$(function() {
	if (location.hash) {
		$('html, body').animate({
			scrollTop: $(location.hash).offset().top - 50
		}, 1000);
		return false;
	}
});

// Close the nav on mobile (or small desktop) if you click outside of it and it's already open
$(document).on("mouseup touchend", function (e) {
    if ( nav.hasClass('open') && !nav.is(e.target) && nav.has(e.target).length === 0 ) 
    {
        toggleMenu();
    }
});
