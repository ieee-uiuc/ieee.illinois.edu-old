var logo, nav, toggle, content;

/* need to change this to jquery */
function toggleHorizontal()
{
	[].forEach.call(
		$(".custom-wrapper")[0].querySelectorAll('.custom-can-transform'),
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
function readyToGo()
{
	// Now that all DOM content is loaded, fill in the global variables
	logo = $(".logo");
	nav = $(".custom-wrapper");
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