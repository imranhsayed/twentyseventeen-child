<?php
/**
 * Twenty Seventeen Child theme functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package WordPress
 * @subpackage Twenty_Seventeen_Child
 * @since 1.0
 */


add_action( 'rest_api_init', 'tschild_register_fields' );

function tschild_register_fields() {
	register_rest_field( 'post',
		'previous_post_ID',
		array(
			'get_callback'    => 'tschild_get_previous_post_ID',
			'update_callback' => null,
			'schema'          => null,
		)
	);
	register_rest_field( 'post',
		'previous_post_title',
		array(
			'get_callback'    => 'tschild_get_previous_post_title',
			'update_callback' => null,
			'schema'          => null,
		)
	);
	register_rest_field( 'post',
		'previous_post_link',
		array(
			'get_callback'    => 'tschild_get_previous_post_link',
			'update_callback' => null,
			'schema'          => null,
		)
	);
}
function tschild_get_previous_post_ID() {
	return get_previous_post()->ID;
}
function tschild_get_previous_post_title() {
	return get_previous_post()->post_title;
}
function tschild_get_previous_post_link() {
	return get_permalink( get_previous_post()->link );
}


function tst_child_enqueue_styles() {
	wp_enqueue_style( 'twentyseventeen-style', get_template_directory_uri() . '/style.css' );
	wp_enqueue_style( 'twentyseventeen-child-style', get_theme_file_uri() . '/style.css' );

	if ( is_single() ) {
		wp_enqueue_script( 'ajax_js', get_theme_file_uri() . '/js/previous.ajax.js', array( 'jquery' ), '', true );
	}

	wp_localize_script( 'ajax_js', 'postdata', array(
		'post_id' => get_the_ID(),
		'theme_uri' => get_stylesheet_directory_uri(),
		'rest_uri' => rest_url( 'wp/v2/' ),
	) );
}

add_action( 'wp_enqueue_scripts', 'tst_child_enqueue_styles' );