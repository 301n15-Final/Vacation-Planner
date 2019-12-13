const $summerSlider = $('#summer-low');
const $summerOutput = $('#summer-temp');
const $winterSlider = $('#winter-high');
const $winterOutput = $('#winter-temp');
let summerTemp = $summerSlider.val();
let winterTemp = $winterSlider.val();

// EVENT HANDLERS
function changeSummerTemp() {
  $summerOutput.html( $(this).val() );
  summerTemp = $(this).val();
}

function changeWinterTemp() {
  $winterOutput.html( $(this).val() );
  winterTemp = $(this).val();
}

function sendTemperature() {
  $('<input />').attr('type', 'hidden')
    .attr('name', `summerTemp`)
    .attr('value', `${summerTemp}`)
    .appendTo('.register');
  $('<input />').attr('type', 'hidden')
    .attr('name', `winterTemp`)
    .attr('value', `${winterTemp}`)
    .appendTo('.register');
}


// EVENT LISTENERS
$summerSlider.on('input', changeSummerTemp);
$winterSlider.on('input', changeWinterTemp);
$('button').on('click', sendTemperature);

// ON PAGE LOAD
$( () => {
  $summerOutput.html( $summerSlider.val() );
  $winterOutput.html( $winterSlider.val() );
});
