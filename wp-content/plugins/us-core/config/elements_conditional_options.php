<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Conditional Settings for elements
 */

// User roles
$user_roles = array();

// Months
$_months = array();

// Avoid DB queries on the frontend
if (
	wp_doing_ajax()
	OR is_admin()
	OR usb_is_builder_page()
) {
	foreach( get_editable_roles() as $_slug => $_data ) {
		$user_roles[ $_slug ] = translate_user_role( $_data['name'] );
	}
	for ( $i = 1; $i < 13; $i++ ) {
		global $wp_locale;
		$monthnum = zeroise( $i, 2 );
		$monthtext = $wp_locale->get_month_abbrev( $wp_locale->get_month( $i ) );
		$_months[ $monthnum ] = $monthtext;
	}
}

// Days
$_days = array();
for ( $i = 1; $i < 32; $i++ ) {
	$_day = zeroise( $i, 2 );
	$_days[ $_day ] = $_day;
}

// Years
$_years = array();
for ( $i = 0; $i < 11; $i++ ) {
	$_year = (int) current_time( 'Y' ) + $i;
	$_years[ $_year ] = (string) $_year;
}

// Hours
$_hours = array();
for ( $i = 0; $i < 24; $i++ ) {
	$_hour = zeroise( $i, 2 );
	$_hours[ $_hour ] = $_hour;
}

// Minutes
$_minutes = array();
for ( $i = 0; $i < 60; $i = $i + 5 ) {
	$_minute = zeroise( $i, 2 );
	$_minutes[ $_minute ] = $_minute;
}

return array(

	'conditions_operator' => array(
		'title' => __( 'Display this Element', 'us' ),
		'type' => 'select',
		'options' => array(
			'always' => __( 'Always', 'us' ),
			'and' => __( 'If EVERY condition below is met', 'us' ),
			'or' => __( 'If ANY condition below is met', 'us' ),
		),
		'std' => 'always',
		'group' => __( 'Display Logic', 'us' ),
	),

	'conditions' => array(
		'type' => 'group',
		'group' => __( 'Display Logic', 'us' ),
		'show_controls' => TRUE,
		'is_sortable' => FALSE,
		'is_accordion' => TRUE,
		'accordion_title' => 'param',
		'std' => array(),
		'show_if' => array( 'conditions_operator', '!=', 'always' ),
		'params' => array(

			'param' => array(
				'type' => 'select',
				'options' => array(
					'time' => us_translate( 'Date/time' ),
					'post_type' => __( 'Post Type', 'us' ),
					'post_id' => __( 'Post ID', 'us' ),
					'tax_term' => __( 'Taxonomy Term', 'us' ),
					'user_role' => __( 'User Role', 'us' ),
					'user_state' => __( 'User State', 'us' ),
					'custom_field' => __( 'Custom Field', 'us' ),
					'cart_status' => __( 'Cart State', 'us' ),
				),
				'std' => 'time',
				'admin_label' => TRUE,
			),
			'cf_name' => array(
				'placeholder' => __( 'Field Name', 'us' ),
				'type' => 'text',
				'std' => '',
				'show_if' => array( 'param', '=', 'custom_field' ),
			),
			'tax' => array(
				'type' => 'select',
				'options' => us_get_taxonomies(),
				'std' => 'category',
				'show_if' => array( 'param', '=', 'tax_term' ),
			),

			'mode' => array(
				'type' => 'radio',
				'options' => array(
					'=' => __( 'Includes', 'us' ),
					'!=' => __( 'Excludes', 'us' ),
				),
				'std' => '=',
				'show_if' => array( 'param', '!=', array( 'time', 'user_state', 'cart_status' ) ),
			),

			'cf_value' => array(
				'placeholder' => us_translate( 'Value' ),
				'type' => 'text',
				'std' => '',
				'show_if' => array( 'param', '=', 'custom_field' ),
			),
			'post_value' => array(
				'placeholder' => __( 'Post ID', 'us' ),
				'description' => __( 'For several values use commas', 'us' ),
				'type' => 'text',
				'std' => '',
				'show_if' => array( 'param', '=', 'post_id' ),
			),
			'term_value' => array(
				'placeholder' => us_translate( 'Value' ),
				'description' => __( 'Use ID or slug.', 'us' ) . ' ' . __( 'For several values use commas', 'us' ),
				'type' => 'text',
				'std' => '',
				'show_if' => array( 'param', '=', 'tax_term' ),
			),
			'time_operator' => array(
				'description' => sprintf( us_translate( 'Local time is %s.' ), '<strong>' . wp_date( 'M d Y H:i' ) . '</strong>' ),
				'type' => 'radio',
				'options' => array(
					'since' => _x( 'Since', 'specified date', 'us' ),
					'until' => _x( 'Until', 'specified date', 'us' ),
				),
				'std' => 'since',
				'show_if' => array( 'param', '=', 'time' ),
			),
			'time_month' => array(
				'type' => 'select',
				'options' => $_months,
				'std' => current_time( 'm' ),
				'cols' => 4,
				'show_if' => array( 'param', '=', 'time' ),
			),
			'time_day' => array(
				'type' => 'select',
				'options' => $_days,
				'std' => current_time( 'd' ),
				'cols' => 6,
				'show_if' => array( 'param', '=', 'time' ),
			),
			'time_year' => array(
				'type' => 'select',
				'options' => $_years,
				'std' => current_time( 'Y' ),
				'cols' => 4,
				'show_if' => array( 'param', '=', 'time' ),
			),
			'time_hour' => array(
				'type' => 'select',
				'options' => $_hours,
				'std' => '00',
				'cols' => 6,
				'show_if' => array( 'param', '=', 'time' ),
			),
			'time_minute' => array(
				'type' => 'select',
				'options' => $_minutes,
				'std' => '00',
				'cols' => 6,
				'show_if' => array( 'param', '=', 'time' ),
			),
			'cart_status' => array(
				'type' => 'radio',
				'options' => array(
					'empty' => _x( 'Empty', 'Cart State', 'us' ),
					'not_empty' => _x( 'Not Empty', 'Cart State', 'us' ),
				),
				'std' => 'empty',
				'show_if' => array( 'param', '=', 'cart_status' ),
			),
			'post_type' => array(
				'type' => 'select',
				'options' => us_grid_available_post_types( TRUE ),
				'std' => 'post',
				'show_if' => array( 'param', '=', 'post_type' ),
			),
			'user_state' => array(
				'type' => 'radio',
				'options' => array(
					'logged_in' => __( 'Logged in', 'us' ),
					'logged_out' => __( 'Logged out', 'us' ),
				),
				'std' => 'logged_in',
				'show_if' => array( 'param', '=', 'user_state' ),
			),
			'user_role' => array(
				'type' => 'select',
				'options' => $user_roles,
				'std' => 'administrator',
				'show_if' => array( 'param', '=', 'user_role' ),
			),

		),
	),
);
