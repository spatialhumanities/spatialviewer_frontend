GV.Viewer.Polydraw = function(_gl,draw) {
	
	var gl = _gl;
	var program = GV.Viewer.Shader.polydrawProgram(gl);
	var vertexPositionBuffer;
	var vertexIndexBuffer;
	var vertexColorBuffer;
	
	var vertexData = [];
	var indexData = [];
	var colorData = [];
	
	//document.getElementById("point").onclick = function() {changeMode("point"); return false;};
	//document.getElementById("linestring").onclick = function() {changeMode("linestring"); return false;};
	//document.getElementById("polygon").onclick = function() {changeMode("polygon"); return false;};
	
	this.draw = function(pMatrix,mvMatrix) {
		gl.useProgram(program);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
		gl.vertexAttribPointer(program.vPosition, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
		gl.vertexAttribPointer(program.vColor, vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
		
		gl.uniformMatrix4fv(program.pMatrix, false, pMatrix);
		gl.uniformMatrix4fv(program.mvMatrix, false, mvMatrix);
		
		gl.drawElements(gl.TRIANGLES, vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	}
	
	this.zoom = function(zoom) {
		
	}
	
	this.update = function(measurement,visgeoms,selgeoms) {
		var memory = 65536 - 10000;
		var _vertexData = [];
		var _indexData = [];
		var _colorData = [];
		if (visgeoms && selgeoms) {
			vertexData = [];
			indexData = [];
			colorData = [];
			GV.info.allDisplayed = true;
			for (var i in selgeoms) {
				var geom = selgeoms[i].getGeometry();
				if (memory > geom.memory()) {
					geom.fill(vertexData,colorData,indexData,true);
					memory -= geom.memory();
				}
				else GV.info.allDisplayed = false;
			}
			visgeoms = visgeoms.reverse();
			for (var i in visgeoms) {
				var geom = visgeoms[i].getGeometry();
				if (memory > geom.memory()) {
					geom.fill(vertexData,colorData,indexData,false);
					memory -= geom.memory();
				}
				else GV.info.allDisplayed = false;
			}
		}
		for (var i=0; i<vertexData.length; i++)
			_vertexData.push(vertexData[i]);
		for (var i=0; i<indexData.length; i++)
			_indexData.push(indexData[i]);
		for (var i=0; i<colorData.length; i++)
			_colorData.push(colorData[i]);
		if (measurement)
			measurement.fill(_vertexData,_colorData,_indexData);
		
		vertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_vertexData), gl.STATIC_DRAW);
		vertexPositionBuffer.itemSize = 3;
		vertexPositionBuffer.numItems = _vertexData.length / 3;
		
		vertexIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(_indexData), gl.STATIC_DRAW);
		vertexIndexBuffer.itemSize = 1;
		vertexIndexBuffer.numItems = _indexData.length;
		
		vertexColorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_colorData), gl.STATIC_DRAW);
		vertexColorBuffer.itemSize = 4;
		vertexColorBuffer.numItems = _colorData.length / 4;
	}
}
