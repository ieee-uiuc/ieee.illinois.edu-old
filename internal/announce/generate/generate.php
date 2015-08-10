<?php 

$curr_date = date('F j, Y');
$file_name = $curr_date . '.html';

// Top part
ob_start();
include 'announce-template-top.html';
file_put_contents($file_name, ob_get_clean());

// News Items part
$posts = array( array(
					'image_url' => 'http://www.ieee.org/about/toolkit/masterbrand/20040816',
					'title' => 'Welcome to IEEE UIUC',
					'description' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
					),
				array(
					'image_url' => 'http://www.ieee.org/about/toolkit/masterbrand/20040816',
					'title' => 'Welcome to IEEE UIUC',
					'description' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
					)
			  );

$button_html = '<a style="color: #F3F3F3;background-color: #FF7400;padding: 10px 16px;cursor: pointer;display: inline-block;font-family:sans-serif;font-weight:200;">Clickity Click</a>';

// TODO : only insert image if the url is present
foreach ($posts as $key => $post) {
	$post_image_url = $post['image_url'];
	$post_title = $post['title'];
	$post_description = $post['description'];

	ob_start();
	include 'announce-template-news-item.html';
	file_put_contents($file_name, ob_get_clean(), FILE_APPEND);
}

// Bottom part
ob_start();
include 'announce-template-bottom.html';
file_put_contents($file_name, ob_get_clean(), FILE_APPEND);

?>