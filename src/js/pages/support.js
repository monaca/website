(function() {

  window.monacaPages = window.monacaPages || [];

  monacaPages["/support/inquiry.html"] = function (loginData) {

  	var params = monacaApi.getUrlVars();
  	var tag = params.tag;

  	if (tag) {
  		var checked = "general";
  		$(".question_type").each( function(index) {
  			var value = $(this).val();
  			if (tag == value) {
  				checked = value;
  			}
  		});
  		$(".question_type").each( function(index) {
  			var value = $(this).val();
			if (checked == value) {
				$(this).attr("checked","checked");
			} else {
				$(this).removeAttr("checked");
			}
		});  		
  	}

  	$("#send_feedback").click( function() {
  		$.ajax( {
      		type : "POST",
      		url : monacaApi.getBaseUrl() + "/" + window.LANG + "/support/inquiry_io",
            xhrFields: {
              withCredentials: true
            },
            data: { "tag" : tag,
                    "inquiry[subject]" : "OK" ,
                    "inquiry[product_type]" : "Product!" },
            dataType: "json",
            success: function(msg) {
            	alert( JSON.stringify( msg.result ) );
              // var evt = document.createEvent("HTMLEvents");
              // evt.initEvent('loaddata',true,true);
              // document.dispatchEvent( evt ) ; 
            },
            error: function(msg) {
              console.log( JSON.stringify( msg ) );
              loginData.setReady();
            }
    } );

  		return false;
  	})

  	loginData.onReady( function() { 
  		if (loginData.profile != null) {
	  		var name = loginData.profile.name;
	  		var email = loginData.profile.email;
	  		if (name) {
		  		$("#name").val( name );
		  	}
		  	if (email) {
		  		$("#email").val( email );
		  	}
	  	}
  	}); 
  };

})();
