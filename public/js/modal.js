'use strict';

let $modalEl = $('.modal');

function closeModal(event) {
  if($(event.target).is($modalEl)){
    if(confirm('Are you sure you want to cancel this form?')){
      $modalEl.fadeOut(300);
      $(window).off('click', closeModal);
    }
  }
}

$('.open-modal').on('click', () => {
  $modalEl.fadeIn(300);
  $('input[name=city]').focus();
  $(window).on('click', closeModal);
});

$('#start-date').focusout(() => {
  if($('#start-date').val()){
    let startDate = $('#start-date').val() + ' 23:59:59';
    let today = new Date();
    let validStartDate = compareDate(today, startDate);

    if(!validStartDate){
      alert('The start date must be today\'s date or later.\nPlease re-enter your trip\'s start date.');
      $('#start-date').val('');
      $('#start-date').focus();
    } else {
      $('#end-date').val( $('#start-date').val() );
    }
  }
});

$('#end-date').focusout(() => {
  if($('#end-date').val()){
    let startDate = $('#start-date').val() + ' 23:59:59';
    let endDate = $('#end-date').val() + ' 23:59:59';
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
