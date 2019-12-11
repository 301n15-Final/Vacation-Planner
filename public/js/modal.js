'use strict';

let $modalEl = $('.modal');
let today = new Date().toISOString().split('T')[0];

$('.open-modal').on('click', () => {
  $modalEl.fadeIn(300);

  $(window).on('click', (event) => {
    if($(event.target).is($modalEl)) { 
      let leaveForm = confirm('Are you sure you want to cancel this form?', 'Yes', 'Cancel');
      if(leaveForm === true) $modalEl.fadeOut(300);
    }
  });
});

$('#start-date').on('focusout', checkStartDate);

function checkStartDate(){
  
}

// });
console.log('today: ', today);

$('#start-date').on('load', $('#start-date').attr('min', today));
