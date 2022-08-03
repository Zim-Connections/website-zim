<?php
add_shortcode('get_plans_faster', 'obtener_planes_faster');

function obtener_planes_faster() {
    
    $url_global = 'https://zimconnections-api.live/truphone/products/GLOBAL';
    $url_europe = 'https://zimconnections-api.live/truphone/products/EUROPE';
    $url_usa = 'https://zimconnections-api.live/truphone/products/USAPLUS';
    $url_apac = 'https://zimconnections-api.live/truphone/products/APAC';

    $response_global = wp_safe_remote_get( 
        $url_global, 
        array(
            'headers'     => array(
                'Content-Type' => 'application/json; charset=utf-8'
            )
        ),
    );

    $response_europe = wp_safe_remote_get( 
        $url_europe, 
        array(
            'headers'     => array(
                'Content-Type' => 'application/json; charset=utf-8'
            )
        ),
    );

    $response_usa = wp_safe_remote_get( 
        $url_usa, 
        array(
            'headers'     => array(
                'Content-Type' => 'application/json; charset=utf-8'
            )
        ),
    );

    $response_apac = wp_safe_remote_get( 
        $url_apac, 
        array(
            'headers'     => array(
                'Content-Type' => 'application/json; charset=utf-8'
            )
        ),
    );

    
    $body_global = wp_remote_retrieve_body($response_global);
    $data_global = json_decode($body_global);

    
    $body_europe = wp_remote_retrieve_body($response_europe);
    $data_europe = json_decode($body_europe);

    
    $body_usa = wp_remote_retrieve_body($response_usa);
    $data_usa = json_decode($body_usa);

    
    $body_apac = wp_remote_retrieve_body($response_apac);
    $data_apac = json_decode($body_apac);

    $template = '';

    $template .= '
    <div class="c-plans">
        <div class="c-title">
            <p class="c-title__title">
                ZIM plans and coverage areas
            </p>
        </div>
        <div class="c-plans__wrapper">
            <nav class="c-plans__nav">
            <a href="#" class="js-area-button active" data-tab="global">Global</a>  
            <a href="#" class="js-area-button" data-tab="regional">Regional</a>  
            <a href="#" class="js-area-button" data-tab="local">Local</a>  
            </nav>
            <div class="c-plans__tabs js-area-tab visible" data-tab="global">
                <div class="c-plans__tabs-wrapper">';
            
                foreach($data_global as $plan_global) {
                    $template .= '
                    <div class="c-plans-card">
                        <div class="c-plans-card__top">
                            <p class="c-plans-card__title">
                                '.$plan_global->data.' '.$plan_global->data_unit.'
                            </p>
                            <p class="c-plans-card__logo">
                                <img src="https://www.zimconnections.com/des/wp-content/uploads/2022/03/logo-truphone-small.png" alt="">
                            </p>
                        </div>
                        <div class="c-plans-card__text">
                            <p class="c-plans-card__duration">'.$plan_global->duration.' '.$plan_global->duration_unit.'</p>
                            <p class="c-plans-card__price">'.$plan_global->price_currency.' '.$plan_global->price.'</p>
                        </div>
                        <div class="c-plans-card__buttons">
                            <a href="https://apps.apple.com/es/app/zim/id1611244114" target="_blank" class="c-button c-button--sm c-button--primary">Apple Store</a>
                            <a href="https://play.google.com/store/apps/details?id=com.zim_cli" target="_blank" class="c-button c-button--sm c-button--secondary">Play Store</a>
                        </div>
                    </div> 
                    ';
                }

                $template .= '
                </div>
            </div><!--fin data tab global-->
            <div class="c-plans__tabs js-area-tab" data-tab="regional">
                <nav class="c-plans__subnav">
                    <a href="#" class="active js-regional-button" data-tab="europe-regional">Europe</a>
                    <a href="#" class="js-regional-button" data-tab="usa-regional">USA</a>
                    <a href="#" class="js-regional-button" data-tab="asia-pacific-regional">Asia Pacific</a>
                </nav>
                <div class="c-title mb-4">
                    <h2 class="c-title__title">Available plans <span class="js-regional-name">Europe</span></h2>
                </div>                
                <div class="c-plans__tabs-wrapper js-regional-tab visible" data-tab="europe-regional">';

                    foreach($data_europe as $plan_eu) {                   
                        $template .=  '
                            <div class="c-plans-card">
                                <div class="c-plans-card__top">
                                    <p class="c-plans-card__title">
                                        '.$plan_eu->data.' '.$plan_eu->data_unit.'
                                    </p>
                                    <p class="c-plans-card__logo">
                                        <img src="https://www.zimconnections.com/des/wp-content/uploads/2022/03/logo-truphone-small.png" alt="">
                                    </p>
                                </div>
                                <div class="c-plans-card__text">
                                    <p class="c-plans-card__duration">'.$plan_eu->duration.' '.$plan_eu->duration_unit.'</p>
                                    <p class="c-plans-card__price">'.$plan_eu->price_currency.' '.$plan_eu->price.'</p>
                                </div>
                                
                                <div class="c-plans-card__buttons">
                                    <a href="https://apps.apple.com/es/app/zim/id1611244114" target="_blank" class="c-button c-button--sm c-button--primary">Apple Store</a>
                                    <a href="https://play.google.com/store/apps/details?id=com.zim_cli" target="_blank" class="c-button c-button--sm c-button--secondary">Play Store</a>
                                </div>
                            </div>';
                    }
                    
                    $template .= '
                </div>
                <div class="c-plans__tabs-wrapper js-regional-tab visible" data-tab="usa-regional">';
                    foreach($data_usa as $plan_usa) {                   
                        $template .=  '
                            <div class="c-plans-card">
                                <div class="c-plans-card__top">
                                    <p class="c-plans-card__title">
                                        '.$plan_usa->data.' '.$plan_usa->data_unit.'
                                    </p>
                                    <p class="c-plans-card__logo">
                                        <img src="https://www.zimconnections.com/des/wp-content/uploads/2022/03/logo-truphone-small.png" alt="">
                                    </p>
                                </div>
                                <div class="c-plans-card__text">
                                    <p class="c-plans-card__duration">'.$plan_usa->duration.' '.$plan_usa->duration_unit.'</p>
                                    <p class="c-plans-card__price">'.$plan_usa->price_currency.' '.$plan_usa->price.'</p>
                                </div>
                                
                                <div class="c-plans-card__buttons">
                                    <a href="https://apps.apple.com/es/app/zim/id1611244114" target="_blank" class="c-button c-button--sm c-button--primary">Apple Store</a>
                                    <a href="https://play.google.com/store/apps/details?id=com.zim_cli" target="_blank" class="c-button c-button--sm c-button--secondary">Play Store</a>
                                </div>
                            </div>';
                    }
                    $template .= '
                </div>
                <div class="c-plans__tabs-wrapper js-regional-tab" data-tab="asia-pacific-regional">';
                    foreach($data_apac as $plan_apac) {                   
                        $template .=  '
                            <div class="c-plans-card">
                                <div class="c-plans-card__top">
                                    <p class="c-plans-card__title">
                                        '.$plan_apac->data.' '.$plan_apac->data_unit.'
                                    </p>
                                    <p class="c-plans-card__logo">
                                        <img src="https://www.zimconnections.com/des/wp-content/uploads/2022/03/logo-truphone-small.png" alt="">
                                    </p>
                                </div>
                                <div class="c-plans-card__text">
                                    <p class="c-plans-card__duration">'.$plan_apac->duration.' '.$plan_apac->duration_unit.'</p>
                                    <p class="c-plans-card__price">'.$plan_apac->price_currency.' '.$plan_apac->price.'</p>
                                </div>
                                
                                <div class="c-plans-card__buttons">
                                    <a href="https://apps.apple.com/es/app/zim/id1611244114" target="_blank" class="c-button c-button--sm c-button--primary">Apple Store</a>
                                    <a href="https://play.google.com/store/apps/details?id=com.zim_cli" target="_blank" class="c-button c-button--sm c-button--secondary">Play Store</a>
                                </div>
                            </div>';
                    }
                    $template .=  '
                </div>
            </div>
            
            <div class="c-plans__tabs js-area-tab" data-tab="local">
                <nav class="c-plans__subnav">
                    <a href="#" class="js-local-button active" data-tab="europe">Europe</a>
                    <a href="#" class="js-local-button" data-tab="america">America</a>
                    <a href="#" class="js-local-button" data-tab="asia">Asia</a>
                    <a href="#" class="js-local-button" data-tab="oceania">Oceania</a>
                    <a href="#" class="js-local-button" data-tab="africa">Africa</a>
                </nav>        
                <div class="c-title mb-4">
                    <h2 class="c-title__title">Plans in <span class="js-local-name">Europe</span></h2>
                </div>
                
                <div class="c-plans__tabs-carousels">
                    <div class="c-plans-carousel js-local-tab visible" data-tab="europe">
                        <div class="c-plans-carousel__carousel">
                            <div class="owl-carousel owl-theme js-plans-carousel">
                                <a href="#plansIn" class="item js-plans-country" data-country="austria" data-name="Austria">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/aut.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Austria</p>
                                    </div>
                                </a>      
                                <a href="#plansIn" class="item js-plans-country" data-country="belgium" data-name="Belgium">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/bel.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Belgium</p>
                                    </div>
                                </a>      
                                <a href="#plansIn" class="item js-plans-country" data-country="croatia" data-name="Croatia">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/hrv.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Croatia</p>
                                    </div>
                                </a>      
                                <a href="#plansIn" class="item js-plans-country" data-country="cyprus" data-name="Cyprus">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/cyp.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Cyprus</p>
                                    </div>
                                </a>      
                                <a href="#plansIn" class="item js-plans-country" data-country="c_r" data-name="Czech Republic">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/cze.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Czech Republic</p>
                                    </div>
                                </a>      
                                <a href="#plansIn" class="item js-plans-country" data-country="germany" data-name="Germany">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/deu.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Germany</p>
                                    </div>
                                </a>      
                                <a href="#plansIn" data-country="greece" class="item js-plans-country" data-name="Greece">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/grc.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Greece</p>
                                    </div>
                                </a>   
                                <a href="#plansIn" class="item js-plans-country" data-country="hungary" data-name="Hungary">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/hun.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Hungary</p>
                                    </div>
                                </a>

                                <a href="#plansIn" class="item js-plans-country" data-country="ireland" data-name="Ireland">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/irl.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Ireland</p>
                                    </div>
                                </a>   
                                <a href="#plansIn" class="item js-plans-country" data-country="italy" data-name="Italy">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/ita.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Italy</p>
                                    </div>
                                </a>    
                                <a href="#plansIn" class="item js-plans-country" data-country="ntr" data-name="Netherlands">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/nld.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Netherlands</p>
                                    </div>
                                </a>  
                                <a href="#plansIn" class="item js-plans-country" data-country="norway" data-name="Norway">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/nor.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Norway</p>
                                    </div>
                                </a>     
                                <a href="#plansIn" class="item js-plans-country" data-country="poland" data-name="Poland">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/pol.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Poland</p>
                                    </div>
                                </a>       
                                <a href="#plansIn" class="item js-plans-country" data-country="portugal" data-name="Portugal">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/prt.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Portugal</p>
                                    </div>
                                </a>         
                                <a href="#plansIn" class="item js-plans-country" data-name="Sweden">
                                    <div class="c-plans-carousel-card" data-country="sweden">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/swe.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Sweden</p>
                                    </div>
                                </a>   
                                <a href="#plansIn" class="item js-plans-country" data-country="switz" data-name="Switzerland">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/che.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Switzerland</p>
                                    </div>
                                </a>   
                                <a href="#plansIn" class="item js-plans-country" data-country="uk" data-name="UK">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/gbr.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">UK</p>
                                    </div>
                                </a>   
                                <a href="#plansIn" class="item js-plans-country" data-country="fr" data-name="France">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/fra.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">France</p>
                                    </div>
                                </a>  
                                 
                                <a href="#plansIn" class="item js-plans-country" data-country="esp" data-name="Spain">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/esp.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Spain</p>
                                    </div>
                                </a> 
                                 
                                <a href="#plansIn" class="item js-no-active-card" data-country="albania">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/alb.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Albania</p>
                                    </div>
                                </a>   
                            </div>
                        </div>
                    </div> 
                    <div class="c-plans-carousel js-local-tab" data-tab="america">
                        <div class="c-plans-carousel__carousel">
                            <div class="owl-carousel owl-theme js-plans-carousel">        
                                <a href="#plansIn" class="item js-plans-country" data-name="USA">
                                    <div class="c-plans-carousel-card" data-country="usa">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/usa.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">USA</p>
                                    </div>
                                </a> 
                                <a href="#" class="item  js-no-active-card">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/per.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Peru</p>
                                    </div>
                                </a>      
                                <a href="#" class="item  js-no-active-card">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/br.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Brazil</p>
                                    </div>
                                </a>      
                                <a href="#" class="item  js-no-active-card">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/arg.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Argentina</p>
                                    </div>
                                </a>      
                                <a href="#" class="item  js-no-active-card">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/abw.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Aruba</p>
                                    </div>
                                </a>      
                                <a href="#" class="item  js-no-active-card">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/ury.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Uruguay</p>
                                    </div>
                                </a>      
                                <a href="#" class="item  js-no-active-card">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/tto.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Trinidad</p>
                                    </div>
                                </a>      
                                <a href="#" class="item  js-no-active-card">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/sur.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Suriname</p>
                                    </div>
                                </a>     
                                <a href="#" class="item  js-no-active-card">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/jam.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Jamaica</p>
                                    </div>
                                </a>      
                                <a href="#" class="item  js-no-active-card">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/aia.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Anguilla</p>
                                    </div>
                                </a>          
                                
                            </div>
                        </div>
                    </div> 
                    <div class="c-plans-carousel js-local-tab" data-tab="asia">
                        <div class="c-plans-carousel__carousel">
                            <div class="owl-carousel owl-theme js-plans-carousel">
                                <a href="#plansIn" class="item js-plans-country" data-name="Hong Kong">
                                    <div class="c-plans-carousel-card" data-country="hong_k">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/hkg.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Hong Kong</p>
                                    </div>
                                </a>      
                                <a href="#plansIn" class="item js-plans-country" data-country="israel" data-name="Israel">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/isr.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Israel</p>
                                    </div>
                                </a>      
                                <a href="#plansIn" class="item js-plans-country" data-country="japan" data-name="Japan">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/jpn.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Japan</p>
                                    </div>
                                </a>      
                                <a href="#" class="item  js-no-active-card">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/chn.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">China</p>
                                    </div>
                                </a>      
                                <a href="#" class="item  js-no-active-card">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/ind.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">India</p>
                                    </div>
                                </a>      
                                <a href="#" class="item  js-no-active-card">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/idn.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Indonesia</p>
                                    </div>
                                </a>      
                                <a href="#" class="item  js-no-active-card">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/mys.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Malaysia</p>
                                    </div>
                                </a>       
                                <a href="#" class="item  js-no-active-card">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/sgp.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Singapore</p>
                                    </div>
                                </a>        
                                <a href="#" class="item  js-no-active-card">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/twn.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Taiwan </p>
                                    </div>
                                </a>          
                                <a href="#" class="item  js-no-active-card">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/tha.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Thailand</p>
                                    </div>
                                </a>     
                                <a href="#" class="item  js-no-active-card">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/kor.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">South Korea</p>
                                    </div>
                                </a>              
                                <a href="#" class="item  js-no-active-card">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/tur.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Turkey</p>
                                    </div>
                                </a>      
                                
                            </div>
                        </div>
                    </div>  
                    <div class="c-plans-carousel js-local-tab" data-tab="oceania">
                        <div class="c-plans-carousel__carousel">
                            <div class="owl-carousel owl-theme js-plans-carousel">
                                <a href="#plansIn" class="item js-plans-country" data-country="australia"  data-name="Australia">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/aus.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Australia</p>
                                    </div>
                                </a>               
                                
                            </div>
                        </div>
                    </div>
                    <div class="c-plans-carousel js-local-tab" data-tab="africa">
                        <div class="c-plans-carousel__carousel">
                            <div class="owl-carousel owl-theme js-plans-carousel">
                                <a href="#" class="item  js-no-active-card">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/zaf.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">South Africa</p>
                                    </div>
                                </a>      
                                <a href="#" class="item  js-no-active-card">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/ken.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Kenya</p>
                                    </div>
                                </a>      
                                <a href="#" class="item  js-no-active-card">
                                    <div class="c-plans-carousel-card">
                                        <figure>
                                            <img src="https://zimconnections-api.live/destinationsImgs/gha.jpg" alt=""> 
                                        </figure>
                                        <p class="c-plans-carousel-card__title">Ghana</p>
                                    </div>
                                </a>              
                                
                            </div>
                        </div>
                    </div>     
                </div>         
                <div class="c-plans__local-countries" id="plansIn">        
                    <div class="c-title">
                        <h2 class="c-title__title">Plans in <span class="js-local-name">Austria</span></h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
        ';

    return $template;
}
