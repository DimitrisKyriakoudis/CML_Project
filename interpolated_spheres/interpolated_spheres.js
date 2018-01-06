//import regression from 'regression';

var image1, image2, image3;
var resized1, resized2, resized3;
var slider1, slider2, slider3;
var button1, button2, button3;
var model1, model2, model3;

var dataset1 = [], dataset2 = [], dataset3 = [];
var coefficients;



var modelOrder = 7;
var u_coeffs = [];
for(let i = 0; i < modelOrder; i++) u_coeffs.push(0);

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

function draw() {
  drawImages();

  if(isReady){
    uniforms.time.value = millis();
    uniforms.coeffs.value = u_coeffs;
    //uniforms.resolution.value = [window.innerWidth]
  	renderer.render( scene, camera );
  }

}

function keyPressed(){
  if(key == '1'){
    resizeImages();
    makeDatasets();
    makeModels();
    console.log("Coefficients: ", model1.equation);
    showShader();
  }

}
