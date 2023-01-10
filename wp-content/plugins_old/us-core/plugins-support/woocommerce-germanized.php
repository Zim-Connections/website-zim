<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Germanized for WooCommerce.
 *
 * Germanized extends WooCommerce to technically match specific german legal conditions.
 * The objective of this plugin is to adapt WooCommerce to the special requirements of german market.
 *
 * @link https://wordpress.org/plugins/woocommerce-germanized
 */
if ( ! class_exists( 'WooCommerce_Germanized' ) ) {
	return FALSE;
}

if ( ! function_exists( 'us_woocommerce_gzd_add_to_cart_variation_params' ) ) {
	/**
	 * Assign a handler to the param filter.
	 */
	add_filter( 'woocommerce_gzd_add_to_cart_variation_params', 'us_woocommerce_gzd_add_to_cart_variation_params', 1, 501 );
	/**
	 * Plugin params for modified variation page.
	 *
	 * @link https://github.com/vendidero/woocommerce-germanized/blob/master/woocommerce-germanized.php#L1076
	 *
	 * @param array $params The params.
	 * @return array Returns an array of modified params.
	 */
	function us_woocommerce_gzd_add_to_cart_variation_params( array $params ) {
		// Changes to the selector for finding price elements on the page on the frontend side.
		$params[ 'price_selector' ] = '.w-post-elm.price:first';
		return $params;
	}
}
