<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Configuration for shortcode: checkout_order_review
 */

$misc = us_config( 'elements_misc' );
$design_options_params = us_config( 'elements_design_options' );

return array(
	'title' => us_translate( 'Checkout', 'woocommerce' ) . ' - ' . us_translate( 'Order Total', 'woocommerce' ),
	'category' => 'WooCommerce',
	'icon' => 'fas fa-money-check-alt',
	'place_if' => class_exists( 'woocommerce' ),
	'params' => us_set_params_weight(

		array(
			'title' => array(
				'title' => us_translate( 'Title' ),
				'type' => 'text',
				'std' => us_translate( 'Your order', 'woocommerce' ),
				'usb_preview' => array(
					'attr' => 'text',
					'elm' => '> h3',
				),
			),
			'title_size' => array(
				'title' => __( 'Title Size', 'us' ),
				'description' => $misc['desc_font_size'],
				'type' => 'text',
				'std' => '',
				'show_if' => array( 'title', '!=', '' ),
				'usb_preview' => array(
					'css' => '--title-size',
				),
			),
			'products_list' => array(
				'type' => 'switch',
				'switch_text' => __( 'Show Products List', 'us' ),
				'std' => 1,
				'usb_preview' => array(
					'toggle_class_inverse' => 'hide_products_list',
				),
			),
			'subtotal' => array(
				'type' => 'switch',
				'switch_text' => __( 'Show Subtotal', 'us' ),
				'std' => 1,
				'usb_preview' => array(
					'toggle_class_inverse' => 'hide_subtotal',
				),
			),
			'total_size' => array(
				'title' => __( 'Total Font Size', 'us' ),
				'description' => $misc['desc_font_size'],
				'type' => 'text',
				'std' => '1.4rem',
				'usb_preview' => array(
					'css' => '--total-size',
				),
			),
		),

		$design_options_params
	)
);
