//import regression from 'regression';

var img;
var sliders = [];
var sliderVal = [];
var coeffs = [0.3096, 2.0965, -8.5475, 12.8969, -6.3887];
var socket;
var isRecording = false;

var trainSet = [
  [0.1, 0.3],
  [0.2, 0.6],
  [0.7, 0.8],
  [0.9, 0.9],
  [0.5, 0.65]
];


var container;
var camera, scene, renderer;
var uniforms;

var training = true;

function setup() {
//  console.log(yIntercept);
  var canvas = createCanvas(500 , windowHeight- 20);
  canvas.parent("p5container");
  //createCanvas(500, 500);

  container = document.getElementById( 'container' );
  camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	scene = new THREE.Scene();
	var geometry = new THREE.PlaneBufferGeometry( 2, 2 );

  uniforms = {
					time: { value: 1.0 }
	};

	var material = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent
	}
  );

  var mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  container.appendChild( renderer.domElement );
  onWindowResize();
  window.addEventListener( 'resize', onWindowResize, false );




  //LoadImage with callback
  img = loadImage("handSketch.jpg", function(img) {
    // img.resize(200, 200);
    img.filter(THRESHOLD, 0.1);
    image(img, 0, 0, width, height);
    // img.resize(200, 200);
    // let blackPix = [];
    // let xs = [];
    // let ys = [];
    //
    // img.loadPixels();
    // for(var x = 0; x < img.width; x++){
    //   for(var y = 0; y < img.height; y++){
    //     let loc = x + y*width;
    //     let pix = img.pixels[loc];
    //     if(pix < 200){
    //       blackPix.push(pix);
    //       xs.push(x);
    //       ys.push(y);
    //     }
    //   }
    // }
    //
    // let testSet = [];
    // for(var i = 0; i < blackPix.length; i++){
    //   testSet.push([xs[i]/img.width, 1-ys[i]/img.height]);
    // }
    // // console.log(testSet);
    // weki.deleteTraining();
    // weki.sendSet(testSet);

    // img.filter("gray");
    // img.filter("threshold", 0.15);
    // save(img, "myImage.jpg");
  });


}

var timer = 0;

function draw() {

  background(255, 0, 0, 0);


  timer += 5;
  uniforms.time.value = timer / 1000;
	renderer.render( scene, camera );


}

function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canvas.position(x, y);
}

function onWindowResize( event ) {
				renderer.setSize( window.innerWidth, window.innerHeight );
}


function keyPressed(){
  if(key == ' '){
    training = !training;
  }

  if(key == '1'){
    noCanvas();
  }

  if(key == '2'){
    var canvas = createCanvas(windowWidth / 4, windowHeight);
    canvas.parent("container");
    fill(255, 0, 0);
    ellipse(width/2, height/2, 100);
  }
}
