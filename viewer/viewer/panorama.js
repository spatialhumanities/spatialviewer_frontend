GV.Viewer.Panodraw = function(_gl,draw) {
	
	var gl = _gl;
	var program = GV.Viewer.Shader.panodrawProgram(gl);
	var vertexPositionBuffer;
	var vertexIndexBuffer;
	var vertexTextureBuffer;
	
	var imageList = [];
	
	this.draw = function(pMatrix,mvMatrix) {
		if (imageList.length > 0) {
			gl.useProgram(program);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
			gl.vertexAttribPointer(program.vPosition, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureBuffer);
			gl.vertexAttribPointer(program.vTexture, vertexTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);
			
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
			
			gl.uniformMatrix4fv(program.pMatrix, false, pMatrix);
			gl.uniformMatrix4fv(program.mvMatrix, false, mvMatrix);
			
			for (var i=0; i<imageList.length; i++) {
				gl.activeTexture(gl.TEXTURE0); // wähle GPU speicher
				gl.bindTexture(gl.TEXTURE_2D, imageList[i].getImage()); // bringe Bildinformation (Pixelwerte) in diesen Speicher
				gl.uniform1i(program.sampler, 0); // was soll die Grafikkarte mit dem Bild machen?
				
				gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 12*i); // eigentlicher Zeichenbefehl und an welche Stelle
			}
		}
	}
	
	this.changePanorama = function(panorama) {
		var vertexData = GV.Viewer.Panodraw.cubeVertexData();
		var indexData = GV.Viewer.Panodraw.cubeIndexData();
		var textureData = GV.Viewer.Panodraw.cubeTextureData();
		panorama.getTransformation().transform3dVecs(vertexData);
		
		vertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
		vertexPositionBuffer.itemSize = 3;
		vertexPositionBuffer.numItems = vertexData.length / 3;
		
		vertexIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
		vertexIndexBuffer.itemSize = 1;
		vertexIndexBuffer.numItems = indexData.length;
		
		vertexTextureBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureData), gl.STATIC_DRAW);
		vertexTextureBuffer.itemSize = 2;
		vertexTextureBuffer.numItems = textureData.length / 2;
		
		for (var i=imageList.length-1; i>=0; i--) {
			delete imageList[i];
		}
		imageList.length = 0;
		var panoramaImages = panorama.getImages();
		for (var i=0; i<panoramaImages.length; i++) {
			imageList.push(new GV.Visualizer.Imagepyramid(panoramaImages[i],gl,draw));
		}
		
	}
}

GV.Viewer.Panodraw.cubeVertexData = function() {
	return [
	// front face
	 1.0,  1.0, -1.0, 
	 1.0, -1.0, -1.0, 
	 1.0, -1.0,  1.0, 
	 1.0,  1.0,  1.0, 
	// right face
	 1.0, -1.0, -1.0, 
	-1.0, -1.0, -1.0, 
	-1.0, -1.0,  1.0, 
	 1.0, -1.0,  1.0, 
	// back face
	-1.0, -1.0, -1.0, 
	-1.0,  1.0, -1.0, 
	-1.0,  1.0,  1.0, 
	-1.0, -1.0,  1.0, 
	// left face
	-1.0,  1.0, -1.0, 
	 1.0,  1.0, -1.0, 
	 1.0,  1.0,  1.0, 
	-1.0,  1.0,  1.0, 
	// top face
	 1.0,  1.0,  1.0, 
	 1.0, -1.0,  1.0, 
	-1.0, -1.0,  1.0, 
	-1.0,  1.0,  1.0, 
	// bottom face
	-1.0,  1.0, -1.0, 
	-1.0, -1.0, -1.0,
	 1.0, -1.0, -1.0, 
	 1.0,  1.0, -1.0];
}

GV.Viewer.Panodraw.cubeIndexData = function() {
	return [
	0, 1, 2,      0, 2, 3,    // front face
	4, 5, 6,      4, 6, 7,    // right face
	8, 9, 10,     8, 10, 11,  // back face
	12, 13, 14,   12, 14, 15, // left face
	16, 17, 18,   16, 18, 19, // top face
	20, 21, 22,   20, 22, 23];// bottom face];
}

GV.Viewer.Panodraw.cubeTextureData = function() {
	return [
	// front face
	0.0, 0.0,
	1.0, 0.0,
	1.0, 1.0,
	0.0, 1.0,
	
	// right face
	0.0, 0.0,
	1.0, 0.0,
	1.0, 1.0,
	0.0, 1.0,
	
	// back face
	0.0, 0.0,
	1.0, 0.0,
	1.0, 1.0,
	0.0, 1.0,
	
	// left face
	0.0, 0.0,
	1.0, 0.0,
	1.0, 1.0,
	0.0, 1.0,
	
	// top face
	0.0, 0.0,
	1.0, 0.0,
	1.0, 1.0,
	0.0, 1.0,
	
	// bottom face
	0.0, 0.0,
	1.0, 0.0,
	1.0, 1.0,
	0.0, 1.0];
}