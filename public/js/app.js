var summerLowTempSlider = document.getElementById('summer-low');
var summerOutput = document.getElementById('summer-low');
summerOutput.innerHTML = summerLowTempSlider.value;

summerLowTempSlider.oninput = function() {
  summerOutput.innerHTML = this.value;
  console.log('summer low temp: ', this.value);
};

var winterHighTempSlider = document.getElementById('winter-high');
var winterOutput = document.getElementById('winter-high');
winterOutput.innerHTML = winterHighTempSlider.value;

winterHighTempSlider.oninput = function() {
  winterOutput.innerHTML = this.value;
  console.log('winter high temp: ', this.value);
};
