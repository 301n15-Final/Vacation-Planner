'use strict';

const $navEl = $('nav');
let menuIsHidden = true;

function menuHandler(event) {
  if($(event.target).is('#menu') && menuIsHidden) {
    $navEl.slideDown(300);
    menuIsHidden = false;
  } else {
    $navEl.slideUp(300);
    menuIsHidden = true;
  }
}

$( () => $(window).on('click', menuHandler) );