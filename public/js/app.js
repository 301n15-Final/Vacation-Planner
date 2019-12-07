var summerSlider = document.getElementById('summer-low');
var summerOutput = document.getElementById('summer-temp');
summerOutput.innerHTML = summerSlider.value;

summerSlider.oninput = function() {
  summerOutput.innerHTML = this.value;
  console.log('summer low temp: ', this.value);
};

var winterSlider = document.getElementById('winter-high');
var winterOutput = document.getElementById('winter-temp');
winterOutput.innerHTML = winterSlider.value;

winterSlider.oninput = function() {
  winterOutput.innerHTML = this.value;
  console.log('winter high temp: ', this.value);
};
