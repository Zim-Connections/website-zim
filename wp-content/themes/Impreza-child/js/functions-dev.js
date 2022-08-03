let fasterButton = document.getElementsByClassName('js-faster-plan-country');

for(let i = 0; i < fasterButton.length; i++) {
    fasterButton[i].onclick=function() {

        console.log('click');
    }
}