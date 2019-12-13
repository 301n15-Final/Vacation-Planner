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

// Get current items from the DOM
function getCurrentItems() {
  const items = [];
  $('.items li').each(function() {
    items.push( $(this).find('label').text() );
  });
  return items;
}

// Show Delete button when user selects checkbox
function showButton(e) {
  if( $(e.target).is( $checkboxes )) {
    let areChecked = 0;
    $('.items li').each(function() {
      if($(this).find($checkboxes).prop('checked') === true) {
        areChecked ++;
      }
    });
    areChecked > 0 ? $('.edit').show() : $('.edit').hide();
  }
}

// Delete selected items
function deleteItems() {
  $('.items li').each(function() {
    if($(this).find($checkboxes).prop('checked') === true) {
      $(this).find($checkboxes).parent().remove();
      $('.edit').hide();
    }
  });
}

// Append current items to the form
function saveCurrentItems() {
  const items = getCurrentItems();
  $('<input />').attr('type', 'hidden')
    .attr('name', `items`)
    .attr('value', `${items}`)
    .appendTo('.export');
}

// EVENT LISTENERS
$('.items').on('click', saveToLocalStorage);
$('.items').on('click', showButton);
$('.edit').on('click', deleteItems);
$('.export').submit(saveCurrentItems);
$( () => restoreFromLocalStorage() );


