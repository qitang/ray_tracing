
// var center = Vector.create([0.1, 0.3, -2.3]);

init();


function getColor(w, view, spheres, lights, level) {

	if(level > 3) return null;
	w = w.toUnitVector();//normailize
  
  var t = Number.NEGATIVE_INFINITY;
  
  var sphere = null;
	spheres.forEach(function(sp) {
		var discriminant = Math.pow(w.dot(view.subtract(sp.center)),2) + sp.radius * sp.radius - view.subtract(sp.center).dot(view.subtract(sp.center));
		if(discriminant <= 0) return ;
		var t1 = Math.sqrt(discriminant) - w.dot(view.subtract(sp.center));
		var t2 = -Math.sqrt(discriminant) - w.dot(view.subtract(sp.center));
		if(t1 > t) {
			t = t1;
			sphere = sp;
		}
	})
	
	if(!sphere) return null;
	var s = w.multiply(t);
	var normal = (s.subtract(sphere.center)).multiply(1/sphere.radius).toUnitVector();
	var reflection = w.subtract(normal.multiply(2*normal.dot(w))).toUnitVector();
	

	
	var result =  sphere.ambient;
	
	for(var i =0 ; i<lights.length ; i++) {
		  var temp = sphere.diffuse.multiply(lights[i].direction.dot(normal)).add(sphere.spectular.multiply(Math.pow(lights[i].direction.dot(reflection), sphere.p)));
		  var color = [lights[i].rgb.e(1)*temp.e(1), lights[i].rgb.e(2)*temp.e(2), lights[i].rgb.e(3)*temp.e(3)];
	      result = result.add(Vector.create(color));
	}
	
	result = result.toUnitVector();
	var newView = s.add(reflection.multiply(0.0001))
	        
	var colorR = getColor(reflection, newView, spheres, lights, level+1);

	var mc = [0.3, 0.3, 0.3]

	if(!colorR) return [result.e(1), result.e(2), result.e(3)] //return [result.e(1) * 255, result.e(2) * 255, result.e(3) * 255];

	//return [colorR[0]*result.e(1), colorR[1]*result.e(2), colorR[2]*result.e(3)];
  //return [result.e(1) * 255, result.e(2) * 255, result.e(3) * 255];
	return [result.e(1) *( 1.0 - mc[0]) + colorR[0] * mc[0], result.e(2) *( 1.0 - mc[1]) + colorR[1] * mc[1], result.e(3) *( 1.0 - mc[2]) + colorR[2] * mc[2]]

   
	        
	//return [result.e(1) * 255, result.e(2) * 255, result.e(3) * 255];

}

function init() {
	var focalLengh = -0.4;
	var radius = 0.7;
	// var center = Vector.create([0.1, 0.3, -2.3]);
	var center = Vector.create([0, 0, -1.8]);
	var view = Vector.create([0,0,0]);


  var sp1 = new Sphere(center, radius, Vector.create([1, 0.1, 0.1]), Vector.create([0.1, 0.1, 0.1]), Vector.create([0.9 , 0.9 , 0.4]), 10);
  
  
  var sp2 = new Sphere(Vector.create([1.3, 0.1, 2.1]), 0.3, Vector.create([0, 0.1, 1]), Vector.create([0.1, 0.1, 0.1]), Vector.create([0.9 , 0.9 , 0.4]), 10);
  
  var light1 = new Light(Vector.create([-0.1 , -0.1, -1]), Vector.create([0.5 , 0.14, 0.24]));
  var light2 = new Light(Vector.create([0.4 , -1, -1]), Vector.create([0.5 , 0.04, 0.14]));

  var lights = [light1, light2];

	var height = 500;
	var width = 600;
	var canvas  = document.getElementById("pad");
	var context = canvas.getContext("2d");
	var imageData = context.createImageData(width, height);


	for(var y =0 ; y<=height ; y++ ) {
		for(var x =0 ;x <=width ; x++) {
				var pixelIndex = 4 * (x + y * width);
				var w = Vector.create([(x - 0.5 * width) / width, (y - 0.5 * height) / height, focalLengh]);
				var rgb = getColor(w, view, [sp1, sp2], lights, 3);
				if(rgb) {

					imageData.data[pixelIndex    ] = 255 *  rgb[0];  // red   color
					imageData.data[pixelIndex + 1] = 255 *    rgb[1];  // green color
					imageData.data[pixelIndex + 2] = 255 *    rgb[2];  // blue  color
					imageData.data[pixelIndex + 3] = 255;
				}  
	     
		}
	}

	context.putImageData(imageData, 0, 0);
}


function Light(direction, rgb) {
	this.direction = direction;
	this.rgb = rgb;
}

function Sphere(center, radius, ambient, diffuse, spectular, p) {
	this.center = center;
	this.radius = radius;
	this.ambient = ambient;
	this.diffuse = diffuse;
	this.spectular = spectular;
	this.p = p;
}



