'use strict';

let $modalEl = $('.modal');
let today = new Date().toJSON().slice(0, 10);

$('.open-modal').on('click', () => {
  $modalEl.fadeIn(300);

  $(window).on('click', (event) => {
    if($(event.target).is($modalEl)){ 
      let leaveForm = confirm('Are you sure you want to cancel this form?');
      if(leaveForm === true) $modalEl.fadeOut(300);
    }
  });
});

$('#start-date').focusout(() => {
  let startDate = new Date($('#start-date').val()).toJSON().slice(0, 10);
  console.log('startDate: ', startDate);

  let validStartDate = compareDate(today, startDate);
  console.log('valid start date? ', validStartDate);
  if(!validStartDate){
    alert('The start date must be today\'s date or later.\nPlease re-enter your trip\'s start date.');
    $('#start-date').val('');
    $('#start-date').focus();
  }
});

$('#end-date').focusout(() => {
  let startDate = new Date($('#start-date').val()).toJSON().slice(0, 10);
  let endDate = new Date($('#end-date').val()).toJSON().slice(0, 10);
  console.log('startDate: ', endDate);

  let validEndDate = compareDate(startDate, endDate);
  if(!validEndDate){
    alert('The start date must be later than the end date.\nPlease re-enter your trip\'s start and end dates.');
    $('input[type=date]').val('');
    $('#start-date').focus();
  }
});

function compareDate(date1, date2){
  return date2 > date1;
}
