//Global variables
var image1, image2, image3;
var resized1, resized2, resized3;
var slider1, slider2, slider3;
var button1, button2, button3;
var model1, model2, model3;
var dataset1 = [], dataset2 = [], dataset3 = [];

//Current stage
var stage;

var pad = 10;
var imgTop = 120;

//Degree of the polynomial; if you change it here remember to change it
//in the fragment shader too (it seems that GLSL needs literal numbers for
//loops so the degree can't be passed as a uniform)
var polyDegree = 7;
//Initial coefficients set to 0
var u_coeffs = [];
for(let i = 0; i < polyDegree; i++) u_coeffs.push(0);

//The interpolated coefficients that get sent to the shader
var lerpedCoefficients;



//Dimensions of resized images
var resizedX = 200;
var resizedY = 200;

//THREEjs standard objects
var container;
var camera, scene, renderer;
var uniforms;

//Load all three images
function preload(){
  loadImages();
}

//Setup screen
function setup() {
  stage = 0;
  setupCanvas();
  background(255);
  initUI();
}

function draw() {
  if(stage == 0)
    drawImages();
  else if(stage == 1){
    //drawImages();
    drawPolynomials();
  }
  else if(stage == 2){
    //Interpolates the coefficients that are sent to the shader
    //Goes from model 1 to 2, from 2 to 3 and then back again
    lerpedCoefficients = animation();
    //Update the uniforms sent to the shader, time and interpolated coefficients
    uniforms.time.value = millis()/1000;
    uniforms.u_coefficients.value = lerpedCoefficients;
    renderer.render( scene, camera );
  }
}

//Keyboard controls: SPACE to move to the next stage
function keyPressed(){
  if(key == ' ' && stage == 0)
    train();
  else if(key == ' ' && stage == 1)
    showShader();
}
