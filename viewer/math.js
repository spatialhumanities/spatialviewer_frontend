function selectedRadioValue(name) {
	var radios = document.getElementsByName(name);
	for (var i in radios) {
		if (radios[i].checked == true)
			return radios[i].value;
	}
}

function contains(array,value) {
	for (var index in array)
		if (array[index] == value)
			return true;
	return false;
}

function setIntersect() {
	var array = [];
	for (var index in arguments[0]) {
		var c = true;
		for (var i=1; i<arguments.length; i++)
			if (!contains(arguments[i],arguments[0][index]))
				c = false;
		if (c)
			array.push(arguments[0][index]);
	}
	return array;
}

function mapIntersect() {
	var array = [];
	for (var index in arguments[0]) {
		var c = true;
		for (var i=1; i<arguments.length; i++)
			if (!arguments[i][index])
				c = false;
		if (c)
			array[index] = arguments[0][index];
	}
	return array;
}

function setUnion() {
	var array = [];
	for (var i=0; i<arguments.length; i++) {
		for (var index in arguments[i]) {
			var c = false;
			for (var j=i+1; j<arguments.length; j++)
				if (contains(arguments[j],arguments[i][index]))
					c = true;
			if (!c)
				array.push(arguments[i][index]);
		}
	}
	return array;
}

function mapUnion() {
	var array = [];
	for (var i=0; i<arguments.length; i++) {
		for (var index in arguments[i]) {
			array[index] = arguments[i][index];
		}
	}
	return array;
}

function setXOR(array1,array2) {
	var array = [];
	for (var index in array1)
		if (!contains(array2,array1[index]))
			array.push(array1[index]);
	for (var index in array2)
		if (!contains(array1,array2[index]))
			array.push(array2[index]);
	return array;
}

function mapXOR(array1,array2) {
	var array = [];
	for (var index in array1)
		if (!array2[index])
			array[index] = array1[index];
	for (var index in array2)
		if (!array1[index])
			array[index] = array2[index];
	return array;
}

function setSubstract() {
	var array = [];
	for (var index in arguments[0]) {
		var c = false;
		for (var i=1; i<arguments.length; i++)
			if (contains(arguments[i],arguments[0][index]))
				c = true;
		if (!c)
			array.push(arguments[0][index]);
	}
	return array;
}

function mapSubstract() {
	var array = [];
	for (var index in arguments[0]) {
		var c = false;
		for (var i=1; i<arguments.length; i++)
			if (arguments[i][index])
				c = true;
		if (!c)
			array[index] = arguments[0][index];
	}
	return array;
}

function first(array) {
	var index;
	for (index in array) break;
	return array[index];
}

function size(array) {
	var counter = 0;
	for (var index in array)
		counter++;
	return counter;
}

function keys(array) {
	var list = [];
	for (var index in array)
		list.push(index);
	return list;
}

GV.Math = GV.Math || {};

// create projection matrix
GV.Math.projectionMatrix = function(aspect) {
	var matrix = new mat4();
	matrix.a00 = 1/Math.tan(GV.setting.getZoom());
	matrix.a11 = aspect/Math.tan(GV.setting.getZoom());
	//matrix.a22 = 2/(1000-0.001);
	//matrix.a23 = 1000.001/(1000-0.001);
	matrix.a22 = -(1000+0.001)/(1000-0.001);
	matrix.a23 = -2*1000*0.001/(1000-0.001);
	matrix.a32 = -1;
	matrix.a33 = 0;
	return matrix;
}

// create modelview matrix
GV.Math.modelviewMatrix = function() {
	var matrix = new mat4();
	matrix.mulM(rotationMatrixZ(Math.PI/2-GV.setting.getAzim()));
	matrix.mulM(rotationMatrixX(GV.setting.getElev()-Math.PI));
	return matrix;
}

// create rotation matrix about x-axis
function rotationMatrixX(angle) {
	var matrix = new mat4();
	matrix.a11 = Math.cos(angle);
	matrix.a12 = -Math.sin(angle);
	matrix.a21 = Math.sin(angle);
	matrix.a22 = Math.cos(angle);
	return matrix;
}

// create rotation matrix about y-axis
function rotationMatrixY(angle) {
	var matrix = new mat4();
	matrix.a00 = Math.cos(angle);
	matrix.a02 = Math.sin(angle);
	matrix.a20 = -Math.sin(angle);
	matrix.a22 = Math.cos(angle);
	return matrix;
}

// create rotation matrix about z-axis
function rotationMatrixZ(angle) {
	var matrix = new mat4();
	matrix.a00 = Math.cos(angle);
	matrix.a01 = -Math.sin(angle);
	matrix.a10 = Math.sin(angle);
	matrix.a11 = Math.cos(angle);
	return matrix;
}

// create translation matrix
function translationMatrix(x,y,z) {
	var matrix = new mat4();
	matrix.a30 = x;
	matrix.a31 = y;
	matrix.a32 = z;
	return matrix;
}

// Floorplan: [0,1]-Coordinates -> Pixel-Coordinates
GV.Math.floorplanMatrix = function(x,y,zoom,width,height) {
	var matrix = new mat4();
	matrix.a00 = width/zoom;
	matrix.a11 = height/zoom;
	matrix.a03 = -width*x;
	matrix.a13 = -height*y;
	return matrix;
}

// permutation PTG <-> webGL
GV.Math.permutMatrix = function() {
	var matrix = new mat4();
	//matrix.a00 = -1;
	//matrix.a11 = 0;
	//matrix.a22 = 0;
	//matrix.a12 = 1;
	//matrix.a21 = 1;
	return matrix;
}


// Screen = canvas coordinates
// Spherical = spherical coordinates
// vec3 = cartesian coordinates
function Screen(x_,y_) {
	var x = x_;
	var y = y_;
	
	this.getX = function() {
		return x;
	}
	
	this.getY = function() {
		return y;
	}
	
	this.dist2 = function(px,py) {
		return (px-x)*(px-x) + (py-y)*(py-y);
	}
}

function Spherical(theta_,phi_) {
	var theta = theta_;
	var phi = phi_;
	
	this.toCartesian = function() {
		var x = Math.sin(theta)*Math.cos(phi);
		var y = Math.sin(theta)*Math.sin(phi);
		var z = Math.cos(theta);
		return new vec3(x,y,z);
	}
	
	this.getTheta = function() {
		return theta;
	}
	this.getVerAngle = function() {
		return theta;
	}
	
	this.getPhi = function() {
		return phi;
	}
	this.getHorAngle = function() {
		return phi;
	}
}

function multiplyArray(array,factor) {
	for (i=0; i<array.length; i++) {
		array[i] *= factor;
	}
}


//   - - - MATRIX and VECTOR - - -

// vecN :  N-dimensional vector
// matN :  N-times-N matrix

// vec.addV(v) { vec = v+vec  }  Vektor-Addition
// vec.mulS(s) { vec = s*vec  }  Skalar-Multiplikation
// vec.mulM(M) { vec = M*vec  }  Matrix-Multiplikation von links
// vec.dot(v)  { return vec*v }  Skalarprodukt
// vec.norm()  { return |vec| }  Norm
// vec.toArray() { return array representation }
// vec.push(array) { push vec into array }
// vec.dist2(v) { return |vec-v|^2 }

// mat.addM(M) { mat = M+mat } Matrix-Addition
// mat.mulS(s) { mat = s*mat } Skalar-Multiplikation
// mat.mulM(M) { mat = M*mat } Matrix-Multiplikation von links
// mat.det()   { return determinant } Determinante
// mat.inverse() { return mat^-1 } Inverse
// mat.toArray() { return array representation }
// mat.push(array) { push mat into array }



function vec2(x_,y_) {
	this.x = x_;
	this.y = y_;
	
	this.addV = function(vector) {
		this.x += vector.x;
		this.y += vector.y;
	}
	
	this.mulS = function(scalar) {
		this.x *= scalar;
		this.y *= scalar;
	}
	
	this.mulM = function(matrix) {
		var tmpX = matrix.a00*this.x + matrix.a01*this.y;
		var tmpY = matrix.a10*this.x + matrix.a11*this.y;
		this.x = tmpX; this.y = tmpY;
	}
	
	this.dot = function(vector) {
		return (this.x*vector.x + this.y*vector.y);
	}
	
	this.norm = function() {
		return Math.sqrt(this.dot(this));
	}
	
	this.toArray = function() {
		return [this.x,this.y];
	}
	
	this.push = function(array) {
		array.push(this.x);
		array.push(this.y);
	}
	
	this.dist2 = function(other) {
		return (this.x-other.x)*(this.x-other.x) + (this.y-other.y)*(this.y-other.y);
	}
	
	this.copy = function() {
		return new vec2(this.x,this.y);
	}
}

function vec3(x_,y_,z_) {
	this.x = x_;
	this.y = y_;
	this.z = z_;
	
	this.addV = function(vector) {
		this.x += vector.x;
		this.y += vector.y;
		this.z += vector.z;
	}
	
	this.mulS = function(scalar) {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
	}
	
	this.mulM = function(matrix) {
		var tmpX = matrix.a00*this.x + matrix.a01*this.y + matrix.a02*this.z;
		var tmpY = matrix.a10*this.x + matrix.a11*this.y + matrix.a12*this.z;
		var tmpZ = matrix.a20*this.x + matrix.a21*this.y + matrix.a22*this.z;
		this.x = tmpX; this.y = tmpY; this.z = tmpZ;
	}
	
	this.dot = function(vector) {
		return (this.x*vector.x + this.y*vector.y + this.z*vector.z);
	}
	
	this.norm = function() {
		return Math.sqrt(this.dot(this));
	}
	
	this.cross = function(vector) {
		var tmpX = this.y * vector.z - this.z * vector.y;
		var tmpY = this.z * vector.x - this.x * vector.z;
		var tmpZ = this.x * vector.y - this.y * vector.x;
		return new vec3(tmpX,tmpY,tmpZ);
	}
	
	this.toArray = function() {
		return [this.x,this.y,this.z];
	}
	
	this.push = function(array) {
		array.push(this.x);
		array.push(this.y);
		array.push(this.z);
	}
	
	this.dist2 = function(other) {
		return (this.x-other.x)*(this.x-other.x) + (this.y-other.y)*(this.y-other.y) + (this.z-other.z)*(this.z-other.z);
	}
	
	this.toSpherical = function() {
		//var theta = Math.asin(this.y/this.norm());
		//var phi = Math.atan2(-this.x,-this.z);
		var theta = Math.acos(this.z/this.norm());
		var phi = Math.atan2(this.y,this.x);
		return new Spherical(theta,phi);
	}
	
	this.copy = function() {
		return new vec3(this.x,this.y,this.z);
	}
}

function vec4(x_,y_,z_,w_) {
	this.x = x_;
	this.y = y_;
	this.z = z_;
	this.w = w_;
	
	this.addV = function(vector) {
		this.x += vector.x;
		this.y += vector.y;
		this.z += vector.z;
		this.w += vector.w;
	}
	
	this.mulS = function(scalar) {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		this.w *= scalar;
	}
	
	this.mulM = function(matrix) {
		var tmpX = matrix.a00*this.x + matrix.a01*this.y + matrix.a02*this.z + matrix.a03*this.w;
		var tmpY = matrix.a10*this.x + matrix.a11*this.y + matrix.a12*this.z + matrix.a13*this.w;
		var tmpZ = matrix.a20*this.x + matrix.a21*this.y + matrix.a22*this.z + matrix.a23*this.w;
		var tmpW = matrix.a30*this.x + matrix.a31*this.y + matrix.a32*this.z + matrix.a33*this.w;
		this.x = tmpX; this.y = tmpY; this.z = tmpZ; this.w = tmpW;
	}
	
	this.dot = function(vector) {
		return (this.x*vector.x + this.y*vector.y + this.z*vector.z + this.w*vector.w);
	}
	
	this.norm = function() {
		return Math.sqrt(this.dot(this));
	}
	
	this.toArray = function() {
		return [this.x,this.y,this.z,this.w];
	}
	
	this.toVec3 = function() {
		return new vec3(this.x,this.y,this.z);
	}
	
	this.push = function(array) {
		array.push(this.x);
		array.push(this.y);
		array.push(this.z);
		array.push(this.w);
	}
	
	this.dist2 = function(other) {
		return (this.x-other.x)*(this.x-other.x) + (this.y-other.y)*(this.y-other.y) + (this.z-other.z)*(this.z-other.z) + (this.w-other.w)*(this.w-other.w);
	}
	
	this.copy = function() {
		return new vec4(this.x,this.y,this.z,this.w);
	}
}

function mat2() {
	this.a00 = 1;
	this.a01 = 0;
	this.a10 = 0;
	this.a11 = 1;
	
	this.addM = function(matrix) {
		this.a00 += matrix.a00; this.a01 += matrix.a01;
		this.a10 += matrix.a10; this.a11 += matrix.a11;
	}
	
	this.mulS = function(scalar) {
		this.a00 *= scalar; this.a01 *= scalar;
		this.a10 *= scalar; this.a11 *= scalar;
	}
	
	this.mulM = function(matrix) {
		var tmpA00 = matrix.a00*this.a00 + matrix.a01*this.a10;
		var tmpA01 = matrix.a00*this.a01 + matrix.a01*this.a11;
		var tmpA10 = matrix.a10*this.a00 + matrix.a11*this.a10;
		var tmpA11 = matrix.a10*this.a01 + matrix.a11*this.a11;
		this.a00 = tmpA00; this.a01 = tmpA01;
		this.a10 = tmpA10; this.a11 = tmpA11;
	}
	
	this.det = function() {
		var tmp = this.a00 * this.a11 - this.a01 * this.a10;
		return tmp;
	}
	
	this.inverse = function() {
		var inv = new mat2();
		inv.a00 =  this.a11;
		inv.a01 = -this.a01;
		inv.a10 = -this.a10;
		inv.a11 =  this.a00;
		inv.mulS(this.det());
		return inv;
	}
	
	this.toArray = function() {
		return [
			this.a00, this.a01,
			this.a10, this.a11
		];
	}
	
	this.push = function(array) {
		array.push(this.a00); array.push(this.a01);
		array.push(this.a10); array.push(this.a11);
	}
}

function mat3() {
	this.a00 = 1;
	this.a01 = 0;
	this.a02 = 0;
	this.a10 = 0;
	this.a11 = 1;
	this.a12 = 0;
	this.a20 = 0;
	this.a21 = 0;
	this.a22 = 1;
	
	this.addM = function(matrix) {
		this.a00 += matrix.a00; this.a01 += matrix.a01; this.a02 += matrix.a02;
		this.a10 += matrix.a10; this.a11 += matrix.a11; this.a12 += matrix.a12;
		this.a20 += matrix.a20; this.a21 += matrix.a21; this.a22 += matrix.a22;
	}
	
	this.mulS = function(scalar) {
		this.a00 *= scalar; this.a01 *= scalar; this.a02 *= scalar;
		this.a10 *= scalar; this.a11 *= scalar; this.a12 *= scalar;
		this.a20 *= scalar; this.a21 *= scalar; this.a22 *= scalar;
	}
	
	this.mulM = function(matrix) {
		var tmpA00 = matrix.a00*this.a00 + matrix.a01*this.a10 + matrix.a02*this.a20;
		var tmpA01 = matrix.a00*this.a01 + matrix.a01*this.a11 + matrix.a02*this.a21;
		var tmpA02 = matrix.a00*this.a02 + matrix.a01*this.a12 + matrix.a02*this.a22;
		var tmpA10 = matrix.a10*this.a00 + matrix.a11*this.a10 + matrix.a12*this.a20;
		var tmpA11 = matrix.a10*this.a01 + matrix.a11*this.a11 + matrix.a12*this.a21;
		var tmpA12 = matrix.a10*this.a02 + matrix.a11*this.a12 + matrix.a12*this.a22;
		var tmpA20 = matrix.a20*this.a00 + matrix.a21*this.a10 + matrix.a22*this.a20;
		var tmpA21 = matrix.a20*this.a01 + matrix.a21*this.a11 + matrix.a22*this.a21;
		var tmpA22 = matrix.a20*this.a02 + matrix.a21*this.a12 + matrix.a22*this.a22;
		this.a00 = tmpA00; this.a01 = tmpA01; this.a02 = tmpA02;
		this.a10 = tmpA10; this.a11 = tmpA11; this.a12 = tmpA12;
		this.a20 = tmpA20; this.a21 = tmpA21; this.a22 = tmpA22;
	}
	
	this.det = function(row,col) {
		var tmp0 = this.a00*(this.a11*this.a22 - this.a12*this.a21);
		var tmp1 = this.a01*(this.a12*this.a20 - this.a10*this.a22);
		var tmp2 = this.a02*(this.a10*this.a21 - this.a11*this.a20);
		return tmp0 + tmp1 + tmp2;
	}
	
	this.inverse = function() {
		var inv = new mat3();
		inv.a00 =  this.a11*this.a22 - this.a12*this.a21;
		inv.a01 =  this.a21*this.a02 - this.a22*this.a01;
		inv.a02 =  this.a01*this.a12 - this.a02*this.a11;
		inv.a10 =  this.a12*this.a20 - this.a10*this.a22;
		inv.a11 =  this.a22*this.a00 - this.a20*this.a02;
		inv.a12 =  this.a02*this.a10 - this.a00*this.a12;
		inv.a20 =  this.a10*this.a21 - this.a11*this.a20;
		inv.a21 =  this.a20*this.a01 - this.a21*this.a00;
		inv.a22 =  this.a00*this.a11 - this.a01*this.a10;
		inv.mulS(this.det());
		return inv;
	}
	
	this.toArray = function() {
		return [
			this.a00, this.a01, this.a02,
			this.a10, this.a11, this.a12,
			this.a20, this.a21, this.a22
		];
	}
	
	this.push = function(array) {
		array.push(this.a00); array.push(this.a01); array.push(this.a02);
		array.push(this.a10); array.push(this.a11); array.push(this.a12);
		array.push(this.a20); array.push(this.a21); array.push(this.a22);
	}
}

function mat4(string) {
	
	if (arguments.length > 0) {
		var split = string.split(",");

		this.a00 = Number(split[0]); 
		this.a01 = Number(split[1]);
		this.a02 = Number(split[2]);
		this.a03 = Number(split[3]);

		this.a10 = Number(split[4]);
		this.a11 = Number(split[5]);
		this.a12 = Number(split[6]);
		this.a13 = Number(split[7]);

		this.a20 = Number(split[8]);
		this.a21 = Number(split[9]);
		this.a22 = Number(split[10]);
		this.a23 = Number(split[11]);

		this.a30 = Number(split[12]);
		this.a31 = Number(split[13]);
		this.a32 = Number(split[14]);
		this.a33 = Number(split[15]);
	}
	else {
		this.a00 = 1;
		this.a01 = 0;
		this.a02 = 0;
		this.a03 = 0;
		this.a10 = 0;
		this.a11 = 1;
		this.a12 = 0;
		this.a13 = 0;
		this.a20 = 0;
		this.a21 = 0;
		this.a22 = 1;
		this.a23 = 0;
		this.a30 = 0;
		this.a31 = 0;
		this.a32 = 0;
		this.a33 = 1;
	}
	
	this.addM = function(matrix) {
		this.a00 += matrix.a00; this.a01 += matrix.a01; this.a02 += matrix.a02; this.a03 += matrix.a03;
		this.a10 += matrix.a10; this.a11 += matrix.a11; this.a12 += matrix.a12; this.a13 += matrix.a13;
		this.a20 += matrix.a20; this.a21 += matrix.a21; this.a22 += matrix.a22; this.a23 += matrix.a23;
		this.a30 += matrix.a30; this.a31 += matrix.a31; this.a32 += matrix.a32; this.a33 += matrix.a33;
	}
	
	this.mulS = function(scalar) {
		this.a00 *= scalar; this.a01 *= scalar; this.a02 *= scalar; this.a03 *= scalar;
		this.a10 *= scalar; this.a11 *= scalar; this.a12 *= scalar; this.a13 *= scalar;
		this.a20 *= scalar; this.a21 *= scalar; this.a22 *= scalar; this.a23 *= scalar;
		this.a30 *= scalar; this.a31 *= scalar; this.a32 *= scalar; this.a33 *= scalar;
	}
	
	this.mulM = function(matrix) {
		var tmpA00 = matrix.a00*this.a00 + matrix.a01*this.a10 + matrix.a02*this.a20 + matrix.a03*this.a30;
		var tmpA01 = matrix.a00*this.a01 + matrix.a01*this.a11 + matrix.a02*this.a21 + matrix.a03*this.a31;
		var tmpA02 = matrix.a00*this.a02 + matrix.a01*this.a12 + matrix.a02*this.a22 + matrix.a03*this.a32;
		var tmpA03 = matrix.a00*this.a03 + matrix.a01*this.a13 + matrix.a02*this.a23 + matrix.a03*this.a33;
		var tmpA10 = matrix.a10*this.a00 + matrix.a11*this.a10 + matrix.a12*this.a20 + matrix.a13*this.a30;
		var tmpA11 = matrix.a10*this.a01 + matrix.a11*this.a11 + matrix.a12*this.a21 + matrix.a13*this.a31;
		var tmpA12 = matrix.a10*this.a02 + matrix.a11*this.a12 + matrix.a12*this.a22 + matrix.a13*this.a32;
		var tmpA13 = matrix.a10*this.a03 + matrix.a11*this.a13 + matrix.a12*this.a23 + matrix.a13*this.a33;
		var tmpA20 = matrix.a20*this.a00 + matrix.a21*this.a10 + matrix.a22*this.a20 + matrix.a23*this.a30;
		var tmpA21 = matrix.a20*this.a01 + matrix.a21*this.a11 + matrix.a22*this.a21 + matrix.a23*this.a31;
		var tmpA22 = matrix.a20*this.a02 + matrix.a21*this.a12 + matrix.a22*this.a22 + matrix.a23*this.a32;
		var tmpA23 = matrix.a20*this.a03 + matrix.a21*this.a13 + matrix.a22*this.a23 + matrix.a23*this.a33;
		var tmpA30 = matrix.a30*this.a00 + matrix.a31*this.a10 + matrix.a32*this.a20 + matrix.a33*this.a30;
		var tmpA31 = matrix.a30*this.a01 + matrix.a31*this.a11 + matrix.a32*this.a21 + matrix.a33*this.a31;
		var tmpA32 = matrix.a30*this.a02 + matrix.a31*this.a12 + matrix.a32*this.a22 + matrix.a33*this.a32;
		var tmpA33 = matrix.a30*this.a03 + matrix.a31*this.a13 + matrix.a32*this.a23 + matrix.a33*this.a33;
		this.a00 = tmpA00; this.a01 = tmpA01; this.a02 = tmpA02; this.a03 = tmpA03;
		this.a10 = tmpA10; this.a11 = tmpA11; this.a12 = tmpA12; this.a13 = tmpA13;
		this.a20 = tmpA20; this.a21 = tmpA21; this.a22 = tmpA22; this.a23 = tmpA23;
		this.a30 = tmpA30; this.a31 = tmpA31; this.a32 = tmpA32; this.a33 = tmpA33;
	}
	
	this.det = function() {
		var tmp01 = this.a11*(this.a22*this.a33 - this.a23*this.a32);
		var tmp02 = this.a12*(this.a23*this.a31 - this.a21*this.a33);
		var tmp03 = this.a13*(this.a21*this.a32 - this.a22*this.a31);
		var tmp0  = this.a00*(tmp01+tmp02+tmp03);
		var tmp11 = this.a01*(this.a22*this.a33 - this.a23*this.a32);
		var tmp12 = this.a02*(this.a23*this.a31 - this.a21*this.a33);
		var tmp13 = this.a03*(this.a21*this.a32 - this.a22*this.a31);
		var tmp1  = this.a10*(tmp11+tmp12+tmp13);
		var tmp21 = this.a01*(this.a12*this.a33 - this.a13*this.a32);
		var tmp22 = this.a02*(this.a13*this.a31 - this.a11*this.a33);
		var tmp23 = this.a03*(this.a11*this.a32 - this.a12*this.a31);
		var tmp2  = this.a20*(tmp21+tmp22+tmp23);
		var tmp31 = this.a01*(this.a12*this.a23 - this.a13*this.a22);
		var tmp32 = this.a02*(this.a13*this.a21 - this.a11*this.a23);
		var tmp33 = this.a03*(this.a11*this.a22 - this.a12*this.a21);
		var tmp3  = this.a30*(tmp31+tmp32+tmp33);
		return tmp0 - tmp1 + tmp2 - tmp3;
	}
	
	this.inverse = function() {
		var inv = new mat4();
		inv.a00 =  this.a11*this.a22*this.a33 + this.a12*this.a23*this.a31 + this.a13*this.a21*this.a32 - this.a11*this.a23*this.a32 - this.a12*this.a21*this.a33 - this.a13*this.a22*this.a31;
		inv.a01 =  this.a01*this.a23*this.a32 + this.a02*this.a21*this.a33 + this.a03*this.a22*this.a31 - this.a01*this.a22*this.a33 - this.a02*this.a23*this.a31 - this.a03*this.a21*this.a32;
		inv.a02 =  this.a01*this.a12*this.a33 + this.a02*this.a13*this.a31 + this.a03*this.a11*this.a32 - this.a01*this.a13*this.a32 - this.a02*this.a11*this.a33 - this.a03*this.a12*this.a31;
		inv.a03 =  this.a01*this.a13*this.a22 + this.a02*this.a11*this.a23 + this.a03*this.a12*this.a21 - this.a01*this.a12*this.a23 - this.a02*this.a13*this.a21 - this.a03*this.a11*this.a22;
		inv.a10 =  this.a10*this.a23*this.a32 + this.a12*this.a20*this.a33 + this.a13*this.a22*this.a30 - this.a10*this.a22*this.a33 - this.a12*this.a23*this.a30 - this.a13*this.a20*this.a32;
		inv.a11 =  this.a00*this.a22*this.a33 + this.a02*this.a23*this.a30 + this.a03*this.a20*this.a32 - this.a00*this.a23*this.a32 - this.a02*this.a20*this.a33 - this.a03*this.a22*this.a30;
		inv.a12 =  this.a00*this.a13*this.a32 + this.a02*this.a10*this.a33 + this.a03*this.a12*this.a30 - this.a00*this.a12*this.a33 - this.a02*this.a13*this.a30 - this.a03*this.a10*this.a32;
		inv.a13 =  this.a00*this.a12*this.a23 + this.a02*this.a13*this.a20 + this.a03*this.a10*this.a22 - this.a00*this.a13*this.a22 - this.a02*this.a10*this.a23 - this.a03*this.a12*this.a20;
		inv.a20 =  this.a10*this.a21*this.a33 + this.a11*this.a23*this.a30 + this.a13*this.a20*this.a31 - this.a10*this.a23*this.a31 - this.a11*this.a20*this.a33 - this.a13*this.a21*this.a30;
		inv.a21 =  this.a00*this.a23*this.a31 + this.a01*this.a20*this.a33 + this.a03*this.a21*this.a30 - this.a00*this.a21*this.a33 - this.a01*this.a23*this.a30 - this.a03*this.a20*this.a31;
		inv.a22 =  this.a00*this.a11*this.a33 + this.a01*this.a13*this.a30 + this.a03*this.a10*this.a31 - this.a00*this.a13*this.a31 - this.a01*this.a10*this.a33 - this.a03*this.a11*this.a30;
		inv.a23 =  this.a00*this.a13*this.a21 + this.a01*this.a10*this.a23 + this.a03*this.a11*this.a20 - this.a00*this.a11*this.a23 - this.a01*this.a13*this.a20 - this.a03*this.a10*this.a21;
		inv.a30 =  this.a10*this.a22*this.a31 + this.a11*this.a20*this.a32 + this.a12*this.a21*this.a30 - this.a10*this.a21*this.a32 - this.a11*this.a22*this.a30 - this.a12*this.a20*this.a31;
		inv.a31 =  this.a00*this.a21*this.a32 + this.a01*this.a22*this.a30 + this.a02*this.a20*this.a31 - this.a00*this.a22*this.a31 - this.a01*this.a20*this.a32 - this.a02*this.a21*this.a30;
		inv.a32 =  this.a00*this.a12*this.a31 + this.a01*this.a10*this.a32 + this.a02*this.a11*this.a30 - this.a00*this.a11*this.a32 - this.a01*this.a12*this.a30 - this.a02*this.a10*this.a31;
		inv.a33 =  this.a00*this.a11*this.a22 + this.a01*this.a12*this.a20 + this.a02*this.a10*this.a21 - this.a00*this.a12*this.a21 - this.a01*this.a10*this.a22 - this.a02*this.a11*this.a20;
		inv.mulS(1.0/this.det());
		return inv;
	}
	
	this.toArray = function() {
		return [
			this.a00, this.a01, this.a02, this.a03,
			this.a10, this.a11, this.a12, this.a13,
			this.a20, this.a21, this.a22, this.a23,
			this.a30, this.a31, this.a32, this.a33
		];
	}
	
	this.toTransposedArray = function() {
		return [
			this.a00, this.a10, this.a20, this.a30,
			this.a01, this.a11, this.a21, this.a31,
			this.a02, this.a12, this.a22, this.a32,
			this.a03, this.a13, this.a23, this.a33
		];
	}
	
	this.push = function(array) {
		array.push(this.a00); array.push(this.a01); array.push(this.a02); array.push(this.a03);
		array.push(this.a10); array.push(this.a11); array.push(this.a12); array.push(this.a13);
		array.push(this.a20); array.push(this.a21); array.push(this.a22); array.push(this.a23);
		array.push(this.a30); array.push(this.a31); array.push(this.a32); array.push(this.a33);
	}
	
	this.transform3dVecs = function(array) {
		for (var i=0; i<array.length; i+=3) {
			var vec = new vec4(array[i],array[i+1],array[i+2],1);
			vec.mulM(this);
			array[i]   = vec.x;
			array[i+1] = vec.y;
			array[i+2] = vec.z;
		}
	}
}