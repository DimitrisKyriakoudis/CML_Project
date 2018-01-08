//--------------------------------------------------------------
function train(){
  if(stage == 0){
    //Downsize the thresholded images
    resizeImages();
    //Make the datasets based on the (normalized) x and y coordinates off each black pixel
    makeDatasets();
    //Train three models based on those datasets
    makeModels();
    stage = 1;
    console.log("Training Done");
  }
}

//--------------------------------------------------------------
function makeDatasets(){
  //Threshold for a pixel to be considered black
  let threshold = 50;

  //Loop through all the pixels and, if they're under the brightness threshold,
  //add them to the dataset using their (normalized) x coordinates as input and their y coordinates as output

  resized1.loadPixels();
  for(let x = 0; x < resizedX; x++){
    for(let y = 0; y < resizedY; y++){
      let loc = (x + y * resizedX)*4;
      if(resized1.pixels[loc] < threshold){
        dataset1.push([x/resizedX, 1-y/resizedY]);
      }
    }
  }

  resized2.loadPixels();
  for(let x = 0; x < resizedX; x++){
    for(let y = 0; y < resizedY; y++){
      let loc = (x + y * resizedX)*4;
      if(resized2.pixels[loc] < threshold){
        dataset2.push([x/resizedX, 1-y/resizedY]);
      }
    }
  }

  resized3.loadPixels();
  for(let x = 0; x < resizedX; x++){
    for(let y = 0; y < resizedY; y++){
      let loc = (x + y * resizedX)*4;
      if(resized3.pixels[loc] < threshold){
        dataset3.push([x/resizedX, 1-y/resizedY]);
      }
    }
  }
}

//Linearly interpolates the coefficients of the models going from 1 to 2, 2 to 3 and back around
function animation(){
  let morph;
  //How long it takes to complete a cycle
  let duration = 35*1000;
  let timer = (millis()%duration)/duration;
  //First half of the animation, going from model 1 to model 3
  if(timer < 0.25){
    morph = lerpPolynomials(model1.equation, model2.equation, map(timer, 0.0, 0.25, 0.0, 1.0));
  }
  else if (timer >= 0.25 && timer < 0.5){
    morph  = lerpPolynomials(model2.equation, model3.equation, map(timer, 0.25, 0.5, 0.0, 1.0));
  }  //Second half, coming back again
  else if(timer >= 0.5 && timer < 0.75){
    morph = lerpPolynomials(model3.equation, model2.equation, map(timer, 0.5, 0.75, 0.0, 1.0));
  }
  else if (timer >= 0.75){
    morph  = lerpPolynomials(model2.equation, model1.equation, map(timer, 0.75, 1.0, 0.0, 1.0));
  }
  return morph;
}

//Trains three models based on the datasets
//--------------------------------------------------------------
function makeModels(){
  model1 = regression.polynomial(dataset1, {order: polyDegree});
  model2 = regression.polynomial(dataset2, {order: polyDegree});
  model3 = regression.polynomial(dataset3, {order: polyDegree});
}

//--------------------------------------------------------------
function showShader(){
  slider1.remove();
  slider2.remove();
  slider3.remove();
  button1.remove();
  button2.remove();
  button3.remove();
  //Deletes the P5js canvas and reveals the THREEjs fragment shader
  noCanvas();
  stage = 2;
}

//Draws the three models on top of the images
function drawPolynomials(){
  drawPolynomial(model1.equation, 0, imgTop, width/3, width/3);
  drawPolynomial(model2.equation, width/3, imgTop, width/3, width/3);
  drawPolynomial(model3.equation, 2*width/3, imgTop, width/3, width/3);
}

//Draws a polynomial
function drawPolynomial(poly, startX, startY, _width, _height){
  let numPoints = 200;
  let size = 8;

  for(let i = 0; i < numPoints; i++){
    let x = i/numPoints;
    let y = 0;
    for(let d = 0; d < poly.length; d++){
      y += poly[d]*Math.pow(x, poly.length-d-1);
    }

    fill(255, 100, 100);
    ellipse(startX + _width*i/numPoints, startY + _height-_height*y, size, size);
  }
}

//Linearly interpolates between two polynomials of the same degree
//--------------------------------------------------------------
function lerpPolynomials(poly1, poly2, pct){
  var newPoly = [];
  for(let i = 0; i < polyDegree+1; i++){
    newPoly.push(lerp(poly1[i], poly2[i], pct));
  }

  return newPoly;
}
//--------------------------------------------------------------
function drawImages(){
  image(image1, 0, imgTop, (width-2*pad)/3, width/3);
  image(image2, (width-pad)/3, imgTop, (width-2*pad)/3, width/3);
  image(image3, 2*(width-pad)/3, imgTop, (width-2*pad)/3, width/3);
}


//--------------------------------------------------------------
function loadImages(){
  //loads 3 images, displays them on screen with three sliders to change
  //the brightness thresholds
  image1 = loadImage("data/image1.jpg");
  image2 = loadImage("data/image2.jpg");
  image3 = loadImage("data/image3.jpg");
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
function setupCanvas(){
  //P5 Canvas, appended to the same container as the THREE one
  var canvas = createCanvas(window.innerWidth, window.innerHeight );
  canvas.parent("container");

  //THREEjs window setup, adapted from the website's shader example
  container = document.getElementById( 'container' );
  camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	scene = new THREE.Scene();
	var geometry = new THREE.PlaneBufferGeometry( 2, 2 );

  //Time and the polynomial coefficients are sent to the shader as uniforms
  uniforms = {
					time: { value: 1.0 },
          resolution: {type: "v2",
                       value: new THREE.Vector2(1920, 1080)},
          u_coefficients: {type: "fv1", //basic float vector of variable length
                   value: u_coeffs}
	};

  //Binding the shader to a material
	var material = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent
	});

  //Binding the material on the full-screen plane geometry
  var mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  container.appendChild( renderer.domElement );
  onWindowResize();
  window.addEventListener( 'resize', onWindowResize, false );
}

//--------------------------------------------------------------
function initUI(){
  let y = imgTop + width/3 + 15;
  let w = (width-pad);
  let bOff = 120;

  slider1 = createSlider(0, 1, 0.5, 0.001);
  slider1.position(pad, y);
  slider1.style('width', '80px');

  slider2 = createSlider(0, 1, 0.5, 0.001);
  slider2.position((width-pad)/3, y);
  slider2.style('width', '80px');

  slider3 = createSlider(0, 1, 0.5, 0.001);
  slider3.position(2*(width-pad)/3, y);
  slider3.style('width', '80px');

  button1 = createButton('Filter Image 1');
  button1.position(pad + bOff, y);
  button1.mousePressed(filterImg1);

  button2 = createButton('Filter Image 2');
  button2.position((width-pad)/3 + bOff, y);
  button2.mousePressed(filterImg2);

  button3 = createButton('Filter Image 3');
  button3.position(2*(width-pad)/3 + bOff, y);
  button3.mousePressed(filterImg3);

  //Instructions
  var t = "1) Filter the images until there are no artifacts, \n2) Press Space once to see the models, \n3) Press Space again to see the shader \n4) Place 3 other images in the data folder (named image1.jpg, image2.jpg etc.) and refresh the page!";
  textSize(20);
  text(t, 10, 30);
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
