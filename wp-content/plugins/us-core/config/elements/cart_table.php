<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Configuration for shortcode: cart_table
 * Note: All classes and key elements from WooCommerce are retained
 */

$misc = us_config( 'elements_misc' );
$design_options_params = us_config( 'elements_design_options' );

return array(
	'title' => us_translate( 'Cart', 'woocommerce' ) . ' - ' . __( 'Product Table', 'us' ),
	'category' => 'WooCommerce',
	'icon' => 'fas fa-shopping-cart',
	'place_if' => class_exists( 'woocommerce' ),
	'params' => us_set_params_weight(

		// General section
		array(
			'table_head' => array(
				'type' => 'switch',
				'switch_text' => __( 'Table Head', 'us' ),
				'std' => 0,
				'usb_preview' => TRUE,
			),
			'table_lines' => array(
				'title' => __( 'Table Lines', 'us' ),
				'type' => 'radio',
				'options' => array(
					'all' => __( 'All', 'us' ),
					'between' => __( 'Between', 'us' ),
					'none' => us_translate( 'None' ),
				),
				'std' => 'all',
				'usb_preview' => array(
					'mod' => 'table-lines',
				),
			),
			'valign_middle' => array(
				'type' => 'switch',
				'switch_text' => __( 'Center items vertically', 'us' ),
				'std' => 1,
				'usb_preview' => array(
					'toggle_class' => 'valign_middle',
				),
			),
			'thumbnail' => array(
				'type' => 'switch',
				'switch_text' => us_translate( 'Thumbnail' ),
				'std' => 1,
				'usb_preview' => TRUE,
			),
			'thumbnail_width' => array(
				'title' => us_translate( 'Thumbnail Width' ),
				'description' => $misc['desc_font_size'],
				'type' => 'text',
				'std' => '90px',
				'show_if' => array( 'thumbnail', '=', '1' ),
				'usb_preview' => array(
					'css' => '--thumbnail-width',
				),
			),
			'price_before_qty' => array(
				'type' => 'switch',
				'switch_text' => __( 'Price Before Quantity', 'us' ),
				'std' => 0,
				'usb_preview' => TRUE,
			),
			'qty_btn_style' => array(
				'title' => __( 'Quantity Buttons Style', 'us' ),
				'type' => 'radio',
				'options' => array(
					'1' => '1',
					'2' => '2',
					'3' => '3',
				),
				'std' => '1',
				'usb_preview' => array(
					'mod' => 'qty-btn-style',
				),
			),
			'qty_btn_size' => array(
				'title' => __( 'Quantity Buttons Size', 'us' ),
				'description' => $misc['desc_font_size'],
				'type' => 'text',
				'std' => '1rem',
				'usb_preview' => array(
					'css' => '--qty-btn-size',
				),
			),
			'subtotal_size' => array(
				'title' => __( 'Size of Subtotal Price', 'us' ),
				'description' => $misc['desc_font_size'],
				'type' => 'text',
				'std' => '1rem',
				'usb_preview' => array(
					'css' => '--subtotal-size',
				),
			),
			'removing_link' => array(
				'title' => __( 'Show Removing Link', 'us' ),
				'type' => 'radio',
				'options' => array(
					'after_subtotal' => __( 'After Subtotal', 'us' ),
					'below_qty' => __( 'Below Quantity', 'us' ),
				),
				'std' => 'after_subtotal',
				'usb_preview' => TRUE,
			),
		),

		$design_options_params
	),
);
