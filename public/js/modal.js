'use strict';

let $modalEl = $('.modal');

$('.open-modal').on('click', () => {
  $modalEl.fadeIn(300);
  $(window).on('click', (event) => {
    if($(event.target).is($modalEl)) { $modalEl.fadeOut(300); }
  });
});
