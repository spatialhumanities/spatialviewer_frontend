GV.Floorplan.addMouse = function(canvas,move,zoom,click,dblclick,over) {
	
	var SPEED = 0.01;
	
	var leftDown = false;
	var clicked = false;
	var flag;
	
	var onClick = function(event) {
		click(getScreen(event));
	}
	
	var onDblClick = function(event) {
		dblclick(getScreen(event));
	}
	
	var onDown = function(event) {
		if (leftEvent(event)) {
			clicked = true;
			leftDown = true;
			flag = getScreen(event);
			canvas.style.cursor = 'move';
		}
	}
	
	var onMove = function(event) {
		var s = getScreen(event);
		if (leftDown) {
			clicked = false;
			move((s.getX() - flag.getX())*SPEED/3,(s.getY() - flag.getY())*SPEED/3);
			flag = s;
		}
		else {
			var pointer = over(s);
			if (pointer)
				canvas.style.cursor = 'pointer';
			else
				canvas.style.cursor = 'default';
		}
	}
	
	var onUp = function(event) {
		if (clicked) {
			onClick(event);
		}
		if (leftEvent(event)) {
			leftDown = false;
			canvas.style.cursor = 'default';
		}
		clicked = false;
	}
	
	var onWheel = function(event) {
		event.preventDefault();
		var amount = event.detail ? event.detail : -event.wheelDelta/10;
		zoom(Math.pow(1+SPEED,amount),getScreen(event));
	}
	
	// utils
	var getScreen = function(event) {
		var left = $("#floorplan").offset().left; 
		var top = $("#floorplan").offset().top; 
		return (new Screen(event.pageX-left,event.pageY-top));
	}
	var leftEvent = function(event) {
		return (event.which == 1);
	}
	var rightEvent = function(event) {
		return (event.which == 3);
	}
	
	canvas.onmousedown = onDown;
	canvas.onmousemove = onMove;
	canvas.onmouseup = onUp;
	canvas.ondblclick = onDblClick;
	canvas.addEventListener('mousewheel',onWheel,false);
	canvas.addEventListener('DOMMouseScroll',onWheel,false);
	canvas.addEventListener('mouseout',onUp,false);
}
