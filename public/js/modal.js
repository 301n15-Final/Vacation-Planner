'use strict';

let $modalEl = $('.modal');

$('.open-modal').on('click', () => {
  $modalEl.fadeIn(300);
  $('input[name=city]').focus();

  $(window).on('click', (event) => {
    if($(event.target).is($modalEl)){ 
      let leaveForm = confirm('Are you sure you want to cancel this form?');
      if(leaveForm === true) $modalEl.fadeOut(300);
    }
  });
});

$('#start-date').focusout(() => {
  if($('#start-date').val()){
    // let startDate = new Date($('#start-date').val());
    let startDate = $('#start-date').val() + ' 23:59:59';
    let today = new Date();
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    console.log('startDate: ', startDate);
    console.log('today: ', today);
    let validStartDate = compareDate(today, startDate);
    console.log('valid start date? ', validStartDate);
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    if(!validStartDate){
      alert('The start date must be today\'s date or later.\nPlease re-enter your trip\'s start date.');
      $('#start-date').val('');
      $('#start-date').focus();
    }
  }
});

$('#end-date').focusout(() => {
  if($('#end-date').val()){
    let startDate = $('#start-date').val() + ' 23:59:59';
    let endDate = $('#end-date').val() + ' 23:59:59';
    console.log('startDate: ', startDate);
    console.log('endDate: ', endDate);
    let validEndDate = compareDate(startDate, endDate);
    if(!validEndDate){
      alert('The start date must be later than the end date.\nPlease re-enter your trip\'s start and end dates.');
      $('input[type=date]').val('');
      $('#start-date').focus();
    }
  }
});

function compareDate(date1, date2){
  return Date.parse(date2) >= Date.parse(date1);
}
