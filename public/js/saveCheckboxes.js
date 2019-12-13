'use strict';

const tripId = $('input[name=tripId]').val();
const $checkboxes = $('input[type=checkbox]');
const checked = [];

// EVENT HANDLERS
// After every click save checked checkboxes to local storage
function saveToLocalStorage(e) {
  checked.length = 0;
  if($(e.target).is($checkboxes)) {
    $('.items li').each(function() {
      if($(this).find($checkboxes).prop('checked') === true) {
        checked.push($(this).find('label').text());
      }
    });
  }
  const checkedToJSON = JSON.stringify(checked);
  localStorage.setItem(`trip${tripId}`, checkedToJSON);
}

// Restore saved checkboxes from local storage
function restoreFromLocalStorage() {
  if(localStorage.getItem(`trip${tripId}`) && tripId) {
    const savedCheckboxesJSON = localStorage.getItem(`trip${tripId}`);
    const savedCheckboxes = JSON.parse(savedCheckboxesJSON);
    $('.items li').each(function() {
      if(savedCheckboxes.includes( $(this).find('label').text() )) {
        $(this).find($checkboxes).prop('checked', true);
      }
    });
  }
}

function getCurrentItems() {
  const items = [];
  $('.items li').each(function() {
    items.push( $(this).find('label').text() );
  });
  return items;
}

function saveCurrentItems() {
  const items = getCurrentItems();
  $('<input />').attr('type', 'hidden')
    .attr('name', `items`)
    .attr('value', `${items}`)
    .appendTo('.export');
}

// EVENT LISTENERS
$('.items').on('click', saveToLocalStorage);
$('.export').submit(saveCurrentItems);
$( () => restoreFromLocalStorage() );


