GV.Visualizer.Tooltip = function(_fp) {
	
	var fp = _fp;
	this.text = false;
	this.x = 30;
	this.y = 0;
	
	this.draw = function() {
		if (this.text) {
			fp.beginPath();
			fp.fillStyle = '#000000';
			fp.font = 'normal 20px serif';
			fp.textBaseline = 'alphabetic';
			fp.fillText(this.text, this.x, this.y);
		}
	}
	
}
