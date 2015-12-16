$(document).on("mouseenter", '.row div', function (e) {
    var content = $(this).attr("data-original");
    if (content != "" && $(".row div[data-original='"+ content +"']").length > 1 ){     
  		 $(".row div[data-original='"+ content +"']").addClass("creatorhighlight");
	  }

    if ($(this).attr("data-original") != $(this).text()){
      $("#fulltext").remove();
      $("<div id='fulltext'></div>").appendTo("body");
      $("#fulltext").append("<div id='data-original'></div>");
      $("#data-original").prepend($(this).attr("data-original"));
    }

});

$(document).on("mouseleave", '.row div', function (e) {
  	$(".row div").removeClass("creatorhighlight");
    $("#data-original").empty();
     $("#fulltext").remove();
});

$(document).on("mouseenter", '#table .columnid', function (e) {
    var content = $(this).text();
    $(this).addClass("rowmarker");
    if (content != ""){
   		$(".columnid").filter(function() {
		    return $(this).text() === content;
		    }).addClass("idhighlight");
      $(".columnid").filter(function() {
        return $(this).text() === content;
        }).css("font-weight", "700");
	}
});

$(document).on("mouseleave", '#table .columnid', function (e) {
    var content = $(this).text();
    $(this).removeClass("rowmarker");
  	$(".columnid").filter(function() {
		    return $(this).text() === content;
	  }).removeClass("idhighlight");
    $(".columnid").filter(function() {
        return $(this).text() === content;
    }).css("font-weight", "400");
  
});

$(document).on("mouseenter", '.row', function (e) {
    var uri = $(this).attr("data-id");
    uri = GV.setting.spatialstore.getSpatialcontext().getID() + "/features/" + uri;
    GV.setting.setHighlightedFeature(uri);
});

$(document).on("mouseleave", '.row', function (e) {
    GV.setting.setHighlightedFeature(null);
});



