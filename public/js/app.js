var summerLowTempSlider = document.getElementById('summer-low');
var summerOutput = document.getElementById('summer-starts-at');
summerOutput.innerHTML = summerLowTempSlider.value;

summerLowTempSlider.oninput = function() {
  summerOutput.innerHTML = this.value;
};

var winterHighTempSlider = document.getElementById('winter-high');
var winterOutput = document.getElementById('winter-ends-at');
winterOutput.innerHTML = winterHighTempSlider.value;

winterHighTempSlider.oninput = function() {
  winterOutput.innerHTML = this.value;
};
