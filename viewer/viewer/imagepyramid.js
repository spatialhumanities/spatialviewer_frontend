GV.Visualizer.Imagepyramid = function(filename,_gl,draw) {
	
	var gl = _gl;
	var resList = [128,256,512,1024,2048];
	var number = 0;
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D,texture);
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([0,0,0,255]));
	
	var init = function() {
		var tex = gl.createTexture();
		tex.image = new Image();
		tex.image.onload = function() {
			gl.bindTexture(gl.TEXTURE_2D, tex);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.bindTexture(gl.TEXTURE_2D, null);
			texture = tex;
			draw();
			number++;
			if (number<resList.length)
				init();
		}
		tex.image.crossOrigin = "";
		tex.image.src = filename + "_" + resList[number] + ".png";
	}
	init();
	
	this.getImage = function() {
		return texture;
	}
}