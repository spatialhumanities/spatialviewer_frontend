GV.Viewer.Shader = GV.Viewer.Shader || {};

GV.Viewer.Shader.panodrawProgram = function(gl) {
	
	var vsSource =
		'attribute vec3 vPosition; \n\
		attribute vec2 vTexture; \n\
		uniform mat4 pMatrix; \n\
		uniform mat4 mvMatrix; \n\
		varying vec2 fTexture; \n\
		void main() { \n\
			gl_Position = pMatrix * mvMatrix * vec4(vPosition,1.0); \n\
			fTexture = vTexture; \n\
		}';
	
	var fsSource =
		'precision mediump float; \n\
		varying vec2 fTexture; \n\
		uniform sampler2D sampler; \n\
		void main() { \n\
			gl_FragColor = texture2D(sampler, vec2(fTexture.s,fTexture.t)); \n\
		}';
	
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader,vsSource);
	gl.compileShader(vertexShader);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader,fsSource);
	gl.compileShader(fragmentShader);
	
	if (!vertexShader || !fragmentShader) {
		alert("Shader geht nicht");
		return;
	}
	
	var program = gl.createProgram();
	gl.attachShader(program,vertexShader);
	gl.attachShader(program,fragmentShader);
	gl.linkProgram(program);
	
	//attributes
	program.vPosition = gl.getAttribLocation(program, "vPosition");
	gl.enableVertexAttribArray(program.vPosition);
	program.vTexture = gl.getAttribLocation(program, "vTexture");
	gl.enableVertexAttribArray(program.vTexture);
	program.pMatrix = gl.getUniformLocation(program, "pMatrix");
	program.mvMatrix = gl.getUniformLocation(program, "mvMatrix");
	program.sampler = gl.getUniformLocation(program, "sampler");
	return program;
}

GV.Viewer.Shader.polydrawProgram = function(gl) {
	
	var vsSource =
		'attribute vec3 vPosition; \n\
		attribute vec4 vColor; \n\
		uniform mat4 pMatrix; \n\
		uniform mat4 mvMatrix; \n\
		varying vec4 fColor; \n\
		void main() { \n\
			gl_Position = pMatrix * mvMatrix * vec4(vPosition,1.0); \n\
			fColor = vColor; \n\
		}';
	
	var fsSource =
		'precision mediump float; \n\
		varying vec4 fColor; \n\
		void main() { \n\
			gl_FragColor = fColor; \n\
		}';
	
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader,vsSource);
	gl.compileShader(vertexShader);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader,fsSource);
	gl.compileShader(fragmentShader);
	
	if (!vertexShader || !fragmentShader) {
		alert("Shader geht nicht");
		return;
	}
	
	var program = gl.createProgram();
	gl.attachShader(program,vertexShader);
	gl.attachShader(program,fragmentShader);
	gl.linkProgram(program);
	
	//attributes
	program.vPosition = gl.getAttribLocation(program, "vPosition");
	gl.enableVertexAttribArray(program.vPosition);
	program.vColor = gl.getAttribLocation(program, "vColor");
	gl.enableVertexAttribArray(program.vColor);
	program.pMatrix = gl.getUniformLocation(program, "pMatrix");
	program.mvMatrix = gl.getUniformLocation(program, "mvMatrix");
	return program;
}

