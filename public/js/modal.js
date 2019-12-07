'use strict';

let $modalEl = $('.modal');

$('#start').on('click', () => {
  $modalEl.fadeIn(300);
  $(window).on('click', (event) => {
    if($(event.target).is($modalEl)) { $modalEl.fadeOut(300) }
  });
});