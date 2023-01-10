<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Configuration for shortcode: cart_totals
 */

$misc = us_config( 'elements_misc' );
$design_options_params = us_config( 'elements_design_options' );

return array(
	'title' => us_translate( 'Cart', 'woocommerce' ) . ' - ' . us_translate( 'Totals', 'woocommerce' ),
	'category' => 'WooCommerce',
	'icon' => 'fas fa-shopping-cart',
	'place_if' => class_exists( 'woocommerce' ),
	'params' => us_set_params_weight(

		// General section
		array(
			'title' => array(
				'title' => us_translate( 'Title' ),
				'type' => 'text',
				'std' => us_translate( 'Cart totals', 'woocommerce' ),
				'usb_preview' => array(
					'elm' => '> h2:first',
					'attr' => 'text',
				),
			),
			'title_size' => array(
				'title' => __( 'Title Size', 'us' ),
				'description' => $misc['desc_font_size'],
				'type' => 'text',
				'std' => '1.5rem',
				'show_if' => array( 'title', '!=', '' ),
				'usb_preview' => array(
					'css' => '--title-size',
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
				'std' => '1.2rem',
				'usb_preview' => array(
					'css' => '--total-size',
				),
			),
			'btn_label' => array(
				'title' => __( 'Button Label', 'us' ),
				'type' => 'text',
				'std' => us_translate( 'Proceed to checkout', 'woocommerce' ),
				'usb_preview' => array(
					'elm' => '.wc-proceed-to-checkout > .w-btn',
					'attr' => 'text',
				),
			),
			'btn_style' => array(
				'title' => __( 'Button Style', 'us' ),
				'description' => $misc['desc_btn_styles'],
				'type' => 'select',
				'options' => us_get_btn_styles(),
				'std' => '1',
				'usb_preview' => array(
					'mod' => 'us-btn-style',
					'elm' => '.wc-proceed-to-checkout > .w-btn',
				),
			),
			'btn_size' => array(
				'title' => __( 'Button Size', 'us' ),
				'description' => $misc['desc_font_size'],
				'type' => 'text',
				'std' => '',
				'usb_preview' => array(
					'css' => '--checkout-btn-size',
				),
			),
			'btn_fullwidth' => array(
				'type' => 'switch',
				'switch_text' => __( 'Stretch to the full width', 'us' ),
				'std' => 0,
				'usb_preview' => array(
					'toggle_class' => 'btn_fullwidth',
				),
			),
		),

		$design_options_params
	),
);
