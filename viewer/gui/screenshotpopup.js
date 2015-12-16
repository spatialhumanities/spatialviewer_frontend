$(document).on("mouseenter", '#table .row', function (e) {
	// onload
	if($(this).hasClass("header")){
		return false;
	}
    // TODO link dynamisch!
   //var picturehtml = "<div class='picturepopup'><img onerror='this.style.display=\"none\"' alt='image' src='http://ibr.spatialhumanities.de/ephesos/rest/Ephesos/features/" + $(this).attr('data-id') + ".png'></div>"
   var picturehtml = "<div class='picturepopup'><img onerror='this.style.display=\"none\"' alt='image' src='" + GV.setting.spatialstore.getSpatialcontext().getID() + "/features/" + $(this).attr('data-id') + ".png'></div>"

    $(picturehtml).appendTo($(this));
});

$(document).on("mouseleave", '#table .row', function (e) {
	if($(this).hasClass("header")){
		return false;
	}
    $(".picturepopup").remove();
});