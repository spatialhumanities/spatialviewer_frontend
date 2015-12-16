// notwendig für JQuery
$( document ).ready(function() {

	function handler1() {
	    if($(this).children().eq(1).text() == "Console"){
	    	console.log("hide 2");
	    	$(this).nextAll().slice(0, 2).css({
		       display: 'none'
		    });
	    }
	    else{
		    $(this).next().css({
		       display: 'none'
		    });
	    }

	    $(this).removeClass("activetab");
	    $(this).addClass("closedtab");

	    var icon = $(this).children(".iconfont");
	    icon.removeClass();
	    icon.addClass("icon-maximieren");
	    icon.addClass("iconfont");
	    
	    $(this).one("click", handler2);
	}

	function handler2() {
	    if($(this).children().eq(1).text() == "Console"){
	    	console.log("hide 2");
	    	$(this).nextAll().slice(0, 2).css({
		       display: 'block'
		    });
	    }
	    else{
		    $(this).next().css({
		       display: 'block'
		    });
	    }
	    $(this).removeClass("closedtab");
	    $(this).addClass("activetab");

	    var icon = $(this).children(".iconfont");
	    icon.removeClass();
	    icon.addClass("icon-minimieren");
	    icon.addClass("iconfont");
	   
	    $(this).one("click", handler1);
	}

	
	$(".activetab").one("click", handler1);
	$(".closedtab").one("click", handler2);
	
	
});