GV.Config.parse = function(text) {
	if (arguments.length<=1)
		return text;
	var split = text.split(/[{}]/);
	var parsed = "";
	for (var i=0; i<split.length; i++) {
		if (i%2 == 0)
			parsed += split[i];
		else
			parsed += arguments[(i+1)/2];
	}
	return parsed;
}
