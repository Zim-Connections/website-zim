<?php 
/**
 * Blockquote
 *
 * Create a Blockquote in WPBakery
 *
 * @category   Wordpress
 * @since      Class available since Release 1.0.0
 */


if ( ! defined( 'ABSPATH' ) ) { exit; // Exit if accessed directly.
}
if ( ! class_exists( 'vcDownloadApp' ) ) {

    class vcDownloadApp extends WPBakeryShortCode {

        function __construct() {
            add_action( 'init', array( $this, 'create_shortcode' ), 999 );            
            add_shortcode( 'vc_zim_download_app', array( $this, 'render_shortcode_two' ) );

        }        

        public function create_shortcode() {
            // Stop all if VC is not enabled
            if ( !defined( 'WPB_VC_VERSION' ) ) {
                return;
            }        

            // Map blockquote with vc_map()
            vc_map( array(
                'name'          => __('Download app', 'sodawebmedia'),
                'base'          => 'vc_zim_download_app',
                'description'  	=> __( '', 'sodawebmedia' ),
                'category'      => __( 'ZIM Modules', 'sodawebmedia'),                
                'params' => array(    

                    array(
                        'type'          => 'textfield',
                        'holder'        => 'div',
                        'heading'       => __( 'Title', 'sodawebmedia' ),
                        'param_name'    => 'card-title',
                        'value'         => __( '', 'sodawebmedia' ),
                        'description'   => __( 'Add block title.', 'sodawebmedia' ),
                    ),

                    array(
                        "type" => "textarea_html",
                        "holder" => "div",
                        "class" => "",                     
                        "heading" => __( "Text content", 'sodawebmedia' ),
                        "param_name" => "content", // Important: Only one textarea_html param per content element allowed and it should have "content" as a "param_name"
                        "value" => __( "<ul><li>Enter</li><li>Here</li><li>Element</li><li>List</li></ul>", 'sodawebmedia' ),
                        "description" => __( "Enter content.", 'sodawebmedia' )
                    ),  


                    array(
                        "type" => "attach_image",
                        "class" => "",
                        "heading" => __( "Screenshot", 'sodawebmedia' ),
                        "param_name" => "card-image",
                        "description" => __( "Add app screenshot", 'sodawebmedia' ),                                                
                    ),    

                    array(
                        'type'          => 'textfield',
                        'heading'       => __( 'Element ID', 'sodawebmedia' ),
                        'param_name'    => 'element_id',
                        'value'             => __( '', 'sodawebmedia' ),
                        'description'   => __( 'Enter element ID (Note: make sure it is unique and valid).', 'sodawebmedia' ),
                        'group'         => __( 'Extra', 'sodawebmedia'),
                    ),

                    array(
                        'type'          => 'textfield',
                        'heading'       => __( 'Extra class name', 'sodawebmedia' ),
                        'param_name'    => 'extra_class',
                        'value'             => __( '', 'sodawebmedia' ),
                        'description'   => __( 'Style particular content element differently - add a class name and refer to it in custom CSS.', 'sodawebmedia' ),
                        'group'         => __( 'Extra', 'sodawebmedia'),
                    ),               
                ),
            ));             

        }

        public function render_shortcode_two( $atts, $content, $tag ) {
            $atts = (shortcode_atts(array(
                'card-title'      => '',
                'card-image'             => '',
                'content'             => '',
                'extra_class'       => '',
                'element_id'        => ''
            ), $atts));


            //Content 
            $content            = wpb_js_remove_wpautop($content, true);
            $card_title       = esc_attr($atts['card-title']);
            $img_card     =  esc_attr($atts['card-image']);
            $img = wpb_getImageBySize( array(
				'attach_id' => (int) $img_card,
				'thumb_size' => 'full',
			) );

            //Class and Id
            $extra_class        = esc_attr($atts['extra_class']);
            $element_id         = esc_attr($atts['element_id']); 
            
            $output = '
                <div class="c-download-app '.$extra_class.'" id="'.$element_id.'">
                    <div class="c-download-app__wrapper">
                        <div class="c-download-app__texts">
                            <div class="c-title">
                                <h2 class="c-title__title">
                                    '.$card_title.'
                                </h2>
                            </div>
                            <p class="c-download-app__subtitle">
                               '.$content.'
                            </p>
                            <div class="c-download-app__buttons">
                                <a href="https://play.google.com/store/apps/details?id=com.zim_cli" target="_blank"><img src="https://www.zimconnections.com/wp-content/uploads/2022/05/apple-button.png" alt=""></a>
                                <a href="https://apps.apple.com/es/app/zim/id1611244114" target="_blank"><img src="https://www.zimconnections.com/wp-content/uploads/2022/05/playstore-button.png" alt=""></a>
                            </div>
                        </div>
                        <div class="c-download-app__img">
                        '.$img['thumbnail'].'
                        </div>
                    </div>
                </div>
            ';

            return $output;

        }

    }

    new vcDownloadApp();

}
?>