// jQuery to make the navbar solid color on scroll
function readyToGo()
{
	var logo = $("#logo");

    $(window).scroll(function()
    {
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
        if (nav.offset().top > content.offset().top-navHeight)
        {
            nav.addClass("solid-nav");
            logo.css("height", "50px");
        }
        else
        {
            nav.removeClass("solid-nav");
            logo.css("height", "initial");
        }
    });

    var menu = document.getElementById('menu'),
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

}