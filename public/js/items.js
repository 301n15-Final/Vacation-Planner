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
  if( $(e.target).is( $('input[type=checkbox]') )) {
    let areChecked = 0;
    $('.items li').each(function() {
      if($(this).find( $('input[type=checkbox]') ).prop('checked') === true) {
        areChecked ++;
      }
    });
    if(areChecked > 0) {
      $('.edit').show();
      $('.add').hide();
    } else {
      $('.edit').hide();
      $('.add').show();
    }
  }
}

// Delete selected items
function deleteItems() {
  $('.items li').each(function() {
    if($(this).find( $('input[type=checkbox]') ).prop('checked') === true) {
      $(this).find( $('input[type=checkbox]') ).parent().remove();
      $('.edit').hide();
      $('.add').show();
    }
  });
}

function enterItem() {
  const $enterItem = $('.enter-item');
  $enterItem.empty();

  $('<input />', {
    type: 'text',
    name: 'item',
    placeholder: 'Enter item name',
    class: 'add-item'
  }).appendTo($enterItem);

  $('<button />', {
    text: 'add',
    class: 'button-small',
    click: addItem
  }).appendTo($enterItem);

}

function addItem() {
  let $class;
  tripId ? $class = 'select' : $class = 'delete';


  let labelEl = $('<label />', {
    text: `${$('.add-item').val()}`
  });
  let checkboxEl = $('<input />', {
    type: 'checkbox'
  });
  let liEl = $('<li />', {
    class: `packing-item ${$class}`
  });

  checkboxEl.appendTo(liEl);
  labelEl.appendTo(liEl);
  liEl.appendTo('.items');

  console.log( $('.add-item').val() );
  $('.enter-item').empty();
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
$('.add').on('click', enterItem);
$('.export').submit(saveCurrentItems);
$( () => restoreFromLocalStorage() );


