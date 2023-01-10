<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'zimconnections_com_2');

/** MySQL database username */
define('DB_USER', 'lqymtw7x');

/** MySQL database password */
define('DB_PASSWORD', 'SU4PrmwH');

/** MySQL hostname */
define('DB_HOST', 'mysql.zimconnections.com');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '1(2~fpkfFac6)vp1A9gX:@&#"9FBIB&JaXoCHgHIv)l;^K&_s2q@M9k_cEu2w2$E');
define('SECURE_AUTH_KEY',  'FRgSI+0OE0M&xktpeZHL"MO7j_b~8zwDiXYXcjSm%KrU*!^~Bg"Tv@q+ozq&5D$G');
define('LOGGED_IN_KEY',    'iE`Kh"YH#qD7$UA4`F+W~NF9np70$0EBv"ydO"N$dttVKiuq:1#;YigbnT8JIGV%');
define('NONCE_KEY',        'MMx$`ClJfLT6MGhYMEx((ONekkCq5@?Jt17F9m|k!oO7:2P&aDjQ2qqzLs!mtDY@');
define('AUTH_SALT',        'qS@HzKch;1SMSmEaGe"3UHB59ngN7fJDnEG@91!T@Xrae`l!Vmf+ap)t0**_;I%A');
define('SECURE_AUTH_SALT', 'Y^db4Q;ynGA?@|RQpNqA*HF*4A3"wZae;ki%TjYV89ixD!(arv%zS/eMAyFr%uS:');
define('LOGGED_IN_SALT',   'uLHJkej&o3yNmikXFN;o*2CC|aqiLbqdS&iM*wscQ#N!8~gxdryGUG+adR_#aQvr');
define('NONCE_SALT',       'WA/!M+Y$+0iLV~rE"O$VO3LG4@PzZy)_/Fu*Z@Bv?vPF*E0#w7YH0AbnpqhPs9U@');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_akfzjp_';

/**
 * Limits total Post Revisions saved per Post/Page.
 * Change or comment this line out if you would like to increase or remove the limit.
 */
define('WP_POST_REVISIONS',  10);

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', true);

/**
 * Removing this could cause issues with your experience in the DreamHost panel
 */

if (preg_match("/^(.*)\.dream\.website$/", $_SERVER['HTTP_HOST'])) {
        $proto = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https" : "http";
        define('WP_SITEURL', $proto . '://' . $_SERVER['HTTP_HOST']);
        define('WP_HOME',    $proto . '://' . $_SERVER['HTTP_HOST']);
        define('JETPACK_STAGING_MODE', true);
}

define('WP_CACHE', true);
define('WPCACHEHOME', '/home/dh_xnq64x/zimconnections.com/wp-content/plugins/wp-super-cache/');

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
