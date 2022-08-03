window.onload=function() {

    if (document.cookie.indexOf("ModalShown=true")<0) {
        console.log('no hay cookie');
         //open modal
            const modal = document.getElementsByClassName('c-modal')[0];
            setTimeout(function(){
                modal.classList.add('visible');
            },1500)

            //close modal
            document.addEventListener(
                "click",
                function(event) {
                // If user either clicks X button OR clicks outside the modal window, then close modal by calling closeModal()
                if (
                    !event.target.closest(".c-modal__content")
                ) {
                    closeModal()
                    console.log('close');
                }else {
                    
                    console.log('not close');
                }
                },
                false
            )
            
            function closeModal() {
                document.querySelector(".c-modal").classList.remove('visible');
            }
        document.cookie = "ModalShown=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
    }else {
        console.log('ya hay cookie');
    }

    //mobile search code

    let openMobileSearch = document.getElementsByClassName('js-header-mobile-search')[0];
    let closeMobileSearch = document.getElementsByClassName('js-close-mobile-search')[0];
    let searchForm = document.getElementsByClassName('js-mobile-search-form')[0];
    
    openMobileSearch.onclick=function(e) {
        console.log('ok');
        e.preventDefault();
        searchForm.classList.add('visible');
        openMobileSearch.classList.add('hidden');

        closeMobileSearch.onclick=function(e) {
            e.preventDefault();
            searchForm.classList.remove('visible');
            openMobileSearch.classList.remove('hidden');
        }
    }

    //end mobile search code

    const plansTab = document.getElementsByClassName('js-open-table');
    const plansTables = document.getElementsByClassName('js-table');

    const input = document.getElementsByClassName('js-input-acordeon');
    const tab = document.getElementsByClassName('js-acordeon-tab');

    for(let i = 0; i < plansTab.length; i++) {
        plansTab[i].onclick=function(e) {
            e.preventDefault();
            for(let j = 0; j < plansTables.length; j++) {
                plansTables[j].classList.remove('is-visible');
                plansTab[j].classList.remove('is-selected');
            }
            plansTables[i].classList.add('is-visible');
            plansTab[i].classList.add('is-selected');
        }
    } 

    function openTab(input,tab) {
        for(let i = 0; i < input.length; i++) {
            input[i].onchange=function() {
                for(let k = 0; k < tab.length; k++) {
                    tab[k].classList.remove('active');
                }
                tab[i].classList.add('active');
            }
        }
    }
    openTab(input,tab);
    
    jQuery('.js-trusted-carousel').owlCarousel({
        loop:true,
        margin:10,
        nav:false,
        dots: true,
        responsive:{
            0:{
                items:3
            },
            600:{
                items:3
            },
            1000:{
                items:5
            }
        }
    })
    jQuery('.partners-carousel').owlCarousel({
        loop:true,
        margin:10,
        nav:false,
        dots: false,
        responsive:{
            0:{
                items:3
            },
            600:{
                items:6
            },
            1000:{
                items:6
            }
        }
    })
    jQuery('.partners-carousel .owl-dots').remove();
    
    //plans carousel
    
    jQuery('.js-plans-carousel').owlCarousel({
        loop:false,
        margin:10,
        nav:false,
        dots: true,
        responsive:{
            0:{
                items:2
            },
            600:{
                items:3
            },
            1000:{
                items:5
            }
        }
    })

    //history carousel about us
     jQuery('.js-history-carousel').owlCarousel({
        loop:true,
        margin:10,
        nav:false,
        dots: false,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:2
            },
            1000:{
                items:3
            }
        }
    
    })

    

    //faqs carousel about us
    jQuery('.js-faqs-carousel').owlCarousel({
        loop:true,
        margin:10,
        nav:false,
        dots: true,
        responsive:{
            0:{
                items:2
            },
            600:{
                items:3
            },
            1000:{
                items:5
            }
        }
    
    })

    //history card

    let hCard = document.getElementsByClassName('c-story-card');

    for(let i = 0; i < hCard.length; i++) {
        hCard[i].onclick=function() {
                for(let k = 0; k < hCard.length; k++) {
                    hCard[k].classList.remove('active');
                }

           hCard[i].classList.add('active');        
        }
        
    }
    
    //plans tabs
    const openArea = function(areaButton,areaTab,inner,innerClass) {
        for(let i = 0; i < areaButton.length; i++) {
            areaButton[i].onclick=function(e) {
                e.preventDefault();
                let dataTabB = areaButton[i].getAttribute('data-tab');
    
                if(inner == true) {
                    let buttonText = areaButton[i].innerHTML;
                    innerClass.innerHTML = buttonText;
                }
    
                for(let k = 0; k < areaTab.length; k++) {
                    let dataTabO = areaTab[k].getAttribute('data-tab');
    
                    if(dataTabB == dataTabO) {
                        for(z = 0; z < areaTab.length; z++) {
                            areaTab[z].classList.remove('visible');
                            areaButton[z].classList.remove('active');
                        }
                        areaTab[k].classList.add('visible');
                        areaButton[i].classList.add('active');
                    }
                }
            }
        }
    }
    
    const areaButtonArea = document.getElementsByClassName('js-area-button');
    const areaTabArea = document.getElementsByClassName('js-area-tab');
    const regionalButtons = document.getElementsByClassName('js-regional-button');
    const regionalTabs = document.getElementsByClassName('js-regional-tab');
    const regionalInnerClass = document.getElementsByClassName('js-regional-name')[0];
    const localButtons = document.getElementsByClassName('js-local-button');
    const localTabs = document.getElementsByClassName('js-local-tab');
    const innerLocal = document.getElementsByClassName('js-local-name')[0];

   
    
   

    openArea(areaButtonArea, areaTabArea, false);
    openArea(regionalButtons, regionalTabs, true, regionalInnerClass);
    openArea(localButtons, localTabs, true, innerLocal);

    function faqs(caller,opened,block,rotateIcon) {
        for(let i = 0; i < block.length; i++) {
            caller[i].onclick=function() {
                let dataOpen = opened[i].getAttribute('data-open');
                if(dataOpen == 'false') {
                    block[i].classList.add('selected');
                    opened[i].setAttribute('data-open', 'true');

                    rotateIcon[i].classList.add('rotate-icon');
                }else {
                    block[i].classList.remove('selected');

                    opened[i].setAttribute('data-open', 'false');

                    rotateIcon[i].classList.remove('rotate-icon');
                }
            }
        }
    }

    const caller = document.getElementsByClassName('js-open-faq');
    const block = document.getElementsByClassName('js-support-block');
    const opened = document.getElementsByClassName('js-faq-answer');
    const rotateIcon = document.getElementsByClassName('js-faq-icon');
    faqs(caller,opened,block,rotateIcon);

    const faqsOpener = document.getElementsByClassName('js-open-faq-tab');
    const faqTab = document.getElementsByClassName('js-faqs-tab');
    const innerClass = document.getElementsByClassName('js-faqs-title')[0];
    openArea(faqsOpener,faqTab,true,innerClass);

    //contact form options opener
    const openAreaInput = function(areaButton,areaTab) {
        for(let i = 0; i < areaButton.length; i++) {
            areaButton[i].onchange=function() {
                let dataTabB = areaButton[i].getAttribute('data-tab');
                console.log(dataTabB);

                for(let k = 0; k < areaTab.length; k++) {
                    let dataTabO = areaTab[k].getAttribute('data-tab');

                    if(dataTabB == dataTabO) {
                        for(z = 0; z < areaTab.length; z++) {
                            areaTab[z].classList.remove('visible');
                            areaButton[z].classList.remove('active');
                        }
                        areaTab[k].classList.add('visible');
                        areaButton[i].classList.add('active');
                    }
                }
            }
        }
    }
    const formRadio = document.getElementsByClassName('js-form-acordeon');
    const formTab = document.getElementsByClassName('js-form-tab');
    openAreaInput(formRadio,formTab);

    //step carousel home
    jQuery('.js-steps-carousel').owlCarousel({
        merge: false,
        loop:true,
        nav:false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 3000,
        touchDrag: false,
        mouseDrag: false,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:1
            },
            1000:{
                items:1
            }
        }
    })

    let noActive = document.getElementsByClassName('js-no-active-card');

    for(let i = 0; i < noActive.length; i++) {
        noActive[i].onclick=function(e){
            e.preventDefault();
        }
    }

    function handlePlans(data) {
        console.log(data);

        let appendEl = document.getElementsByClassName('js-local-country-tab')[0];

        for(let i = 0; i < data.length; i++) {
            console.log(data[i]);

            //dom
            let plansCard = document.createElement('div');
            plansCard.classList.add('c-plans-card');

            let plansCardTop = document.createElement('div');
            plansCardTop.classList.add('c-plans-card__top');
            let title = document.createElement('p');
            title.classList.add('c-plans-card__title');
            title.innerHTML = data[i]['data'] + ' ' + data[i]['data_unit'];

            plansCardTop.append(title);

            let plansLogo = document.createElement('p');
            plansLogo.classList.add('c-plans-card__logo');
            let img = document.createElement('img');
            img.setAttribute('src','https://www.zimconnections.com/wp-content/uploads/2022/05/logo-truphone-small.png');
            plansLogo.append(img);

            plansCardTop.append(plansLogo);

            plansCard.append(plansCardTop);


            let plansText = document.createElement('div');
            plansText.classList.add('c-plans-card__text');
            let plansDuration = document.createElement('p');
            plansDuration.classList.add('c-plans-card__duration');
            plansDuration.innerHTML = data[i]['duration'] + ' ' + data[i]['duration_unit'];
            plansText.append(plansDuration);
            let plansPrice = document.createElement('p');
            plansPrice.classList.add('c-plans-card__price');
            plansPrice.innerHTML = data[i]['price_currency'] + ' ' + data[i]['price'];

            plansText.append(plansDuration);
            plansText.append(plansPrice);

            let plansButtons = document.createElement('div');
            plansButtons.classList.add('c-plans-card__buttons');
            let link1 = document.createElement('a');
            link1.innerHTML = 'Apple Store';
            link1.setAttribute('href','https://apps.apple.com/es/app/zim/id1611244114');
            link1.classList.add('c-button');
            link1.classList.add('c-button--primary');
            link1.classList.add('c-button--sm');

            plansButtons.append(link1);

            let link2 = document.createElement('a');
 
            link2.innerHTML = 'Play Store';
            link2.setAttribute('href','https://play.google.com/store/apps/details?id=com.zim_cli');
            link2.classList.add('c-button');
            link2.classList.add('c-button--sm');
            link2.classList.add('c-button--secondary');

            plansButtons.append(link2);

            plansCard.append(plansText);

            plansCard.append(plansButtons);

            appendEl.append(plansCard);
        }
    }

    async function getPlans(country) {
        const baseURL = 'https://zimconnections-api.xyz/truphone/products/'+country;
        try {
          const response = await fetch(baseURL, {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "Application/json",
              Accept: "Application/json",
            },
          });
          const data = await response.json();
          handlePlans(data);
        } catch (error) {
          console.log("error: ", error);
        }
    }

    function openLocalTab() {
        let localTabButton = document.getElementsByClassName('js-plans-country');
        let localTab = document.getElementsByClassName('js-local-country-tab');
        let titleSpace = document.getElementsByClassName('js-local-name')[1];

        for(let i = 0; i < localTabButton.length; i++) {
            localTabButton[i].onclick=function() {
                let dataTabB = localTabButton[i].getAttribute('data-country');
                let titleText = localTabButton[i].getAttribute('data-name');

                titleSpace.innerHTML = titleText;

                for(let k = 0; k < localTab.length; k++) {
                    let dataTabT = localTab[k].getAttribute('data-country');

                    if(dataTabT == dataTabB) {
                        
                        for(let z = 0; z < localTab.length; z++) {

                            localTab[z].classList.remove('visible');
                            
                        }

                        localTab[i].classList.add('visible');
                    }
                }
            }
        }
    }

    function openLocalTabFaster() {
        let localTabButton = document.getElementsByClassName('js-faster-plan-country');
        let localName = document.getElementsByClassName('js-local-name-faster')[0];
        let localTab = document.getElementsByClassName('js-local-country-tab')[0];
        let area = document.getElementsByClassName('c-plans__local-countries--fast')[0];

        for(let i = 0; i < localTabButton.length; i++) {
            localTabButton[i].onclick=function() {
                let dataTabB = localTabButton[i].getAttribute('data-country');
                let titleText = localTabButton[i].getAttribute('data-name');
                area.classList.add('visible');

                localName.innerHTML = titleText;
                localTab.innerHTML = '';

                console.log(dataTabB);

               getPlans(dataTabB);
            }
        }
    }

    openLocalTab();
    openLocalTabFaster();

    console.log('not-min');
}