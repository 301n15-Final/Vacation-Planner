'use strict';

const tripId = $('input[name=tripId]').val();
const $checkboxes = $('input[type=checkbox]');
const checked = [];
let buttonsHidden = true;

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

function toggleDeleteItems() {
  if(buttonsHidden) {
    $('.delete').fadeIn(100).css('display', 'inline-block');
    buttonsHidden = false;
  } else {
    $('.delete').fadeOut(100).css('display', 'none');
    buttonsHidden = true;
  }
}

// Delete items when user clicks on 'X'
function deleteItem(e) {
  if( $(e.target).is( $('.delete') )) {
    $(e.target).parent().remove();
  }
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
$('.items').on('click', deleteItem);
$('.edit').on('click', toggleDeleteItems);
$('.export').submit(saveCurrentItems);
$( () => restoreFromLocalStorage() );


