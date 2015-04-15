function readyToGo()
{
	var logo = $(".logo");
	var nav = $("#menu");
	var menu = nav[0];

	

	
	WINDOW_CHANGE_EVENT = ('onorientationchange' in window) ? 'orientationchange':'resize';

	function toggleHorizontal() {
		[].forEach.call(
			document.getElementById('menu').querySelectorAll('.custom-can-transform'),
			function(el){
				el.classList.toggle('pure-menu-horizontal');
			}
		);
	};

	function toggleMenu() {
		// set timeout so that the panel has a chance to roll up
		// before the menu switches states
		if (menu.classList.contains('open')) {
			setTimeout(toggleHorizontal, 500);
		}
		else {
			toggleHorizontal();
		}

		menu.classList.toggle('open');

		document.getElementById('toggle').classList.toggle('x');

		// when the menu is opened on mobile it should also set the color as solid
		//setTimeout(function(){menu.classList.toggle('solid-nav');} , 500);

		// on menu close it's changing back to transparent before it closes
	};

	function closeMenu() {
		if (menu.classList.contains('open')) {
			toggleMenu();
		}
	}

	document.getElementById('toggle').addEventListener('click', function (e) {
		toggleMenu();
	});

	window.addEventListener(WINDOW_CHANGE_EVENT, closeMenu);

  /* Collapsible sections
  $('#tech-link').click(function(){
	$('#tech-content').slideToggle('slow');
	});
  */

}

// jQuery to make the navbar solid color on scroll
$(window).scroll(function()
{
	var logo = $(".logo");
	var nav = $("#menu");

	// if the menu is open and you scroll, close the menu
	if (nav[0].classList.contains('open'))
	{
		nav[0].classList.toggle('open');
		$("#toggle")[0].classList.toggle('x');
	}

	var content = $(".content-wrapper");

	// get the computed height of the navbar
	var navHeight = parseFloat(window.getComputedStyle(nav[0]).getPropertyValue("height").replace(/[^0-9\,\.\-]/g, ''));

	// On scroll, make the navbar solid, and the logo smaller
	// have to use jquery animate since css can't do height
	if (nav.offset().top > content.offset().top-navHeight)
	{
		nav.addClass("solid-nav");
		logo.addClass("small-logo");

		// need to do this only on desktop, and I don't care about IE9.
		if (window.matchMedia('(min-width: 48em)').matches)
		{
			$(".custom-menu-3").css("transform", "translateY(35%)");
		}
	}
	else
	{
		nav.removeClass("solid-nav");
		logo.removeClass("small-logo");

		if (window.matchMedia('(min-width: 48em)').matches)
		{
			$(".custom-menu-3").css("transform", "translateY(55%)");
		}
		
	}
});

// Sidebar nav scrolling animation
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


function submitJoin()
{
	var data = $("#join_form .pure-g .pure-u-1 .pure-form .pure-control-group input").serialize();

	alert("data: " + data);
}