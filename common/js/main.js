var logo, nav, toggle, content;

/* need to change this to jquery */
function toggleHorizontal()
{
	[].forEach.call(
		$(".navbar-wrapper")[0].querySelectorAll('.menu-can-transform'),
		function(el){
			el.classList.toggle('pure-menu-horizontal');
		}
	);
};

// Toggles the navbar
function toggleMenu()
{
	// set timeout so that the panel has a chance to roll up before the menu switches states
	if (nav.hasClass('open'))
	{
		setTimeout(toggleHorizontal, 500);
	}
	else
	{
		toggleHorizontal();
	}

	nav.toggleClass('open');
	toggle.toggleClass('x');
};

// Called whenever page is loaded
function init()
{
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

}

// jQuery to make the navbar solid color on scroll
$(window).scroll(function()
{
	// if the menu is open and you scroll, close the menu
	if (nav.hasClass('open'))
	{
		nav.toggleClass('open');
		setTimeout(toggleHorizontal, 500);
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

// Smooth anchor scrolling animation
$(function() {
	$('a[href*=#]:not([href=#])').click(function() {
	  if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {

		var target = $(this.hash);
		target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
		if (target.length) {
		  $('html,body').animate({
			scrollTop: target.offset().top
		  }, 1000);
		  return false;
		}
	  }
	});
});

function setEmail()
{
	$("[name='member_email']").val( $("[name='member_netid']").val() + "@illinois.edu" );
}

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
	  url: "join.php",
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

// make an ajax call to the news.php, parse the json response
function loadNews()
{
	var news = $("#news-container");
	var err_str = '<h4>Could not load news items. Please try refreshing the page.</h4>';
	var no_posts_str = '<h4>There are no posts to display.</h4>';

	$.get( "/common/php/getNews.php?type=news", function( data )
	{
		// data comes in as a string, holding either "error: <error code>" or json
		
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

			// if there is an image
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

// for the front page news
function loadFrontNews()
{
	var slides = $(".slides");

	$.get( "/common/php/getNews.php?type=front", function( data )
	{
		// data comes in as a string, holding either "error: <error code>" or json
		
		// if it errored out, put in the error string
		if (data.indexOf("error: ") >= 0)
		{
			slides.append('<li><h3>Could not load news items. Please try refreshing the page.</h3></li>');
			return;
		}

		else if (data == "none")
		{
			slides.append('<li><h3>There are no posts to display.</h3><li>');
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

// After page content is loaded, fill in header and footer, and call init();
$(".navbar-wrapper").load("/common/header.php", function() {
	$("#footer").load("/common/footer.html", function() {
		init();
	});
});

/* displays the correct spark pdf in the viewer */
function viewSpark(edition)
{
	$('#spark-viewer').html('<object data="Spark - sp10.pdf" type="application/pdf"><p>Alternative text - include a link <a href="Spark - sp10.pdf">to the PDF!</a></p></object>');
}