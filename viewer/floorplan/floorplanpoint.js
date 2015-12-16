GV.Visualizer.Floorplanpoint = function(_viewpoint,_fp) {
	
	var fp = _fp;
	var viewpoint = _viewpoint;
	var tFull = viewpoint.getTransformation(); // get vec3!
	var selected = false;
	
	this.draw = function(T,zoom,azim,elev) {
		var point = this.getPoint(T);
		if (selected) {
			var length = 1000;
			var dir1 = new vec4(length*Math.cos(azim-zoom),length*Math.sin(azim-zoom),0,1);
			dir1.mulM(tFull);
			dir1.z = 1;
			dir1.mulM(T);
			fp.lineWidth = 2;
			fp.beginPath();
			fp.moveTo(point.x,point.y);
			fp.lineTo(dir1.x,dir1.y);
			fp.strokeStyle='gray';
			fp.stroke();
			
			var dir2 = new vec4(length*Math.cos(azim+zoom),length*Math.sin(azim+zoom),0,1);
			dir2.mulM(tFull);
			dir2.z = 1;
			dir2.mulM(T);
			fp.lineWidth = 2;
			fp.beginPath();
			fp.moveTo(point.x,point.y);
			fp.lineTo(dir2.x,dir2.y);
			fp.strokeStyle='gray';
			fp.stroke();


			fp.beginPath();
			fp.arc(point.x,point.y,8,0,2*Math.PI);

			fp.strokeStyle='white';
			fp.fillStyle = "gray";
			fp.lineWidth = 4;
			fp.stroke();
			fp.fill();
			
			/*
			fp.beginPath();
			fp.arc(point.x,point.y,2,0,2*Math.PI);
			fp.fillStyle = "black";
			fp.strokeStyle='black';
			fp.lineWidth = 2;
			fp.stroke();
			fp.fill();
			*/

		}
		else {
			
			
			
			fp.beginPath();
			fp.arc(point.x,point.y,5,0,2*Math.PI);
			fp.fillStyle = "black";
			fp.strokeStyle='white';
			fp.lineWidth = 3;
			fp.stroke();
			fp.fill();

		}
	}
	
	this.select = function(_selected) {
		selected = _selected;
	}
	
	this.isInside = function(screen,T) {
		var point = this.getPoint(T);
		return (screen.dist2(point.x,point.y) < 20);
	}
	
	this.getName = function() {
		return viewpoint.getName();
	}
	
	this.getPoint = function(T) {
		var point = new vec4(tFull.a03,tFull.a13,1,1);
		point.mulM(T);
		return point;
	}
}
