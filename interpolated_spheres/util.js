//--------------------------------------------------------------
function loadImages(){
  //loads 3 images, displays them on screen with three sliders to change
  //the thresholding

  image1 = loadImage("data/image1.jpg");
  image2 = loadImage("data/image2.jpg");
  image3 = loadImage("data/image3.jpg");

  // img = loadImage("data/handSketch.jpg", function(img) {
  //   // img.resize(200, 200);
  //   img.filter(THRESHOLD, 0.1);
  //   image(img, 0, 0, width, height);
  //   // img.resize(200, 200);
  //   // let blackPix = [];
  //   // let xs = [];
  //   // let ys = [];
  //   //
  //   // img.loadPixels();
  //   // for(var x = 0; x < img.width; x++){
  //   //   for(var y = 0; y < img.height; y++){
  //   //     let loc = x + y*width;
  //   //     let pix = img.pixels[loc];
  //   //     if(pix < 200){
  //   //       blackPix.push(pix);
  //   //       xs.push(x);
  //   //       ys.push(y);
  //   //     }
  //   //   }
  //   // }
  //   //
  //   // let testSet = [];
  //   // for(var i = 0; i < blackPix.length; i++){
  //   //   testSet.push([xs[i]/img.width, 1-ys[i]/img.height]);
  //   // }
  //   // // console.log(testSet);
  //   // weki.deleteTraining();
  //   // weki.sendSet(testSet);
  //
  //   // img.filter("gray");
  //   // img.filter("threshold", 0.15);
  //   // save(img, "myImage.jpg");
  // });
}
//--------------------------------------------------------------
function resizeImages(){
  resized1 = image1;
  resized1.resize(resizedX, resizedY);

  resized2 = image2;
  resized2.resize(resizedX, resizedY);

  resized3 = image3;
  resized3.resize(resizedX, resizedY);
}
//--------------------------------------------------------------
function filterImg1(){
  let value = slider1.value();
  image1 = loadImage("data/image1.jpg", function(i) {
      i.filter(THRESHOLD, value);
  });
}
function filterImg2(){
  let value = slider2.value();
  image2 = loadImage("data/image2.jpg", function(i) {
      i.filter(THRESHOLD, value);
  });
}
function filterImg3(){
  let value = slider3.value();
  image3 = loadImage("data/image3.jpg", function(i) {
      i.filter(THRESHOLD, value);
  });
}
//--------------------------------------------------------------
function makeDatasets(){
  let threshold = 50;
  resized1.loadPixels();
  for(let x = 0; x < resizedX; x++){
    for(let y = 0; y < resizedY; y++){
      let loc = (x + y * resizedX)*4;
      if(resized1.pixels[loc] < threshold){
        dataset1.push([x/resizedX, y/resizedY]);
      }
    }
  }

  console.log(dataset1);

  resized2.loadPixels();
  for(let x = 0; x < resizedX; x++){
    for(let y = 0; y < resizedY; y++){
      let loc = (x + y * resizedX)*4;
      if(resized2.pixels[loc] < threshold){
        dataset2.push([x/resizedX, y/resizedY]);
      }
    }
  }

  resized3.loadPixels();
  for(let x = 0; x < resizedX; x++){
    for(let y = 0; y < resizedY; y++){
      let loc = (x + y * resizedX)*4;
      if(resized3.pixels[loc] < threshold){
        dataset3.push([x/resizedX, y/resizedY]);
      }
    }
  }
}
//--------------------------------------------------------------
function makeModels(){
  model1 = regression.polynomial(dataset1, {order: polyDegree});
  model2 = regression.polynomial(dataset2, {order: polyDegree});
  model3 = regression.polynomial(dataset3, {order: polyDegree});
}
//--------------------------------------------------------------
function showShader(){
  noCanvas();

  stage = 2;
}

function drawPolynomials(){
  let numPoints = 200;
  for(let i = 0; i < numPoints; i++){
    let m1 = model1.predict(i/numPoints);
    let m2 = model2.predict(i/numPoints);
    let m3 = model3.predict(i/numPoints);
    fill(255, 0, 0);
    ellipse(width*m1[0], height*m1[1], 5, 5);

    fill(0, 255, 0);
    ellipse(width*m2[0], height*m2[1], 5, 5);

    fill(0, 0, 255);
    ellipse(width*m3[0], height*m3[1], 5, 5);
  }
}

function drawPolynomial(poly){
  let numPoints = 200;

  for(let i = 0; i < numPoints; i++){
    let x = i/numPoints;
    let y = 0;
    for(let d = 0; d < poly.length; d++){
      y += poly[d]*Math.pow(x, poly.length-d-1);
    }

    fill(255, 100, 100);
    ellipse(width*i/numPoints, height*y, 8, 8);
  }

}

function lerpPolynomials(poly1, poly2, pct){
  var newPoly = [];
  for(let i = 0; i < polyDegree+1; i++){
    newPoly.push(lerp(poly1[i], poly2[i], pct));
  }

  return newPoly;
}
//--------------------------------------------------------------
function drawImages(){
  image(image1, 0, 0, width/3, 400);
  image(image2, width/3, 0, width/3, 400);
  image(image3, 2*width/3, 0, width/3, 400);
}

//--------------------------------------------------------------
function initUI(){
  degreeSlider = createSlider(2, 20, 7, 1);
  degreeSlider.position(10, 100);
  degreeSlider.style('width', '80px');

  slider1 = createSlider(0, 1, 0.5, 0.001);
  slider1.position(10, 10);
  slider1.style('width', '80px');

  slider2 = createSlider(0, 1, 0.5, 0.001);
  slider2.position(10, 30);
  slider2.style('width', '80px');

  slider3 = createSlider(0, 1, 0.5, 0.001);
  slider3.position(10, 50);
  slider3.style('width', '80px');

  button1 = createButton('Filter Image 1');
  button1.position(159, 19);
  button1.mousePressed(filterImg1);

  button2 = createButton('Filter Image 2');
  button2.position(279, 19);
  button2.mousePressed(filterImg2);

  button3 = createButton('Filter Image 3');
  button3.position(499, 19);
  button3.mousePressed(filterImg3);
}

//--------------------------------------------------------------
function setupCanvas(){
  //P5 Canvas, appended to the same container as the THREE one
  var canvas = createCanvas(window.innerWidth, window.innerHeight );
  canvas.parent("container");

  //THREEjs window setup, adapted from the shader example
  container = document.getElementById( 'container' );
  camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	scene = new THREE.Scene();
	var geometry = new THREE.PlaneBufferGeometry( 2, 2 );

  console.log("window: ", window.innerWidth, window.innerHeight );
  //Time and the polynomial coefficients are sent to the shader as uniforms
  uniforms = {
					time: { value: 1.0 },
          resolution: {type: "v2",
                       value: new THREE.Vector2(1920, 1080)},
          coeffs: {type: "fv1",
                   value: u_coeffs}
	};

  //Binding the shader to a material
	var material = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent
	});

  //Binding the material on the plane geometry
  var mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  container.appendChild( renderer.domElement );
  onWindowResize();
  window.addEventListener( 'resize', onWindowResize, false );
}

//--------------------------------------------------------------
function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canvas.position(x, y);
}
//--------------------------------------------------------------
function onWindowResize( event ) {
	renderer.setSize( window.innerWidth, window.innerHeight );
}
