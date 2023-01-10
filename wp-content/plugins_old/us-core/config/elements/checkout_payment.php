<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Configuration for shortcode: checkout_payment
 */

$misc = us_config( 'elements_misc' );
$design_options_params = us_config( 'elements_design_options' );

return array(
	'title' => us_translate( 'Checkout', 'woocommerce' ) . ' - ' . us_translate( 'Payment', 'woocommerce' ),
	'category' => 'WooCommerce',
	'icon' => 'fas fa-money-check-alt',
	'place_if' => class_exists( 'woocommerce' ),
	'params' => us_set_params_weight(

		array(
			'payments_style' => array(
				'title' => __( 'Payment Methods Style', 'us' ),
				'type' => 'radio',
				'options' => array(
					'1' => '1',
					'2' => '2',
					'3' => '3',
				),
				'std' => '1',
				'usb_preview' => array(
					'mod' => 'payments-style',
				),
			),
			'btn_label' => array(
				'title' => __( 'Button Label', 'us' ),
				'type' => 'text',
				'std' => us_translate( 'Place order', 'woocommerce' ),
				'usb_preview' => array(
					'attr' => 'text',
					'elm' => '.w-btn',
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
					'elm' => '.w-btn',
				),
			),
			'btn_size' => array(
				'title' => __( 'Button Size', 'us' ),
				'description' => $misc['desc_font_size'],
				'type' => 'text',
				'std' => '',
				'usb_preview' => array(
					'css' => '--btn-size',
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
	)
);
