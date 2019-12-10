'use strict';

const $tripName = $('#trip-name').text();
const items = [];

$('.items li').each(function() {
  items.push( $(this).text() );
});

console.table($tripName, items);
