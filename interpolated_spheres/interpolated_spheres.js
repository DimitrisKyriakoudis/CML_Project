//import regression from 'regression';

var image1, image2, image3;
var resized1, resized2, resized3;
var slider1, slider2, slider3;
var button1, button2, button3;
var model1, model2, model3;

var dataset1 = [], dataset2 = [], dataset3 = [];
var coefficients;

var testCoeff = [1, 1, 1, 0];

var lerpedEquation;


var stage = 0;

var degreeSlider;
var polyDegree = 7;
var u_coeffs = [];
for(let i = 0; i < polyDegree; i++) u_coeffs.push(0);

var resizedX = 200;
var resizedY = 200;

var isReady = false;

//THREEjs variables
var container;
var camera, scene, renderer;
var uniforms;


function preload(){
  loadImages();
}

function setup() {
  setupCanvas();
  initUI();

  //sliders.push(createSlider(0, 1, 0.5));
  //LoadImage with callback
}

var pct = 0;
function draw() {
  background(255);

  if(stage == 0){
    drawImages();
  }
  else if(stage == 1){
    drawImages();
    drawPolynomials();
    lerpedEquation = lerpPolynomials(model1.equation, model2.equation, pct)
    //let newPoly = lerpPolynomials(model1.equation, model2.equation, 0.5+0.5*Math.sin(millis()/1000));
    drawPolynomial(lerpedEquation);
  }

  else if(stage == 2){
    uniforms.time.value = millis()/1000;
    uniforms.coeffs.value = model1.equation; //u_coeffs;
    // uniforms.resolution.value = [window.innerWidth]
    renderer.render( scene, camera );
  }
}

function keyPressed(){
  if(key == '1' && stage == 0){
    resizeImages();
    makeDatasets();
    makeModels();
    console.log("Coefficients: ", model1.equation);
    stage = 1;
  }

  if(key == ' '){
    stage = 0;
    loadImages();
    console.log("state reset to 0");
  }

  if(key == '2'){
    pct = 0;
    console.log("pct: ", pct);
  }
  if(key == '3'){
    pct = 1;
    console.log("pct: ", pct);
  }

  if(key == '4'){
    console.log("pct: ", pct);
    console.log("m1: ", model1.equation);
    console.log("m2: ", model2.equation);
    console.log("lerped1: ", lerpPolynomials(model1.equation, model2.equation, pct));

    // console.log("m1: ", model1.equation);
    // console.log("m2: ", model2.equation);
    // console.log("lerped0: ", lerpPolynomials(model1.equation, model2.equation, 0));
    // console.log("lerped1: ", lerpPolynomials(model1.equation, model2.equation, 1));
  }

}
