var storage = chrome.storage.local;
var server = '';
var username = '';
var password = '';
jQuery("#error").hide();
jQuery("#loading").show();

$(document).ready(function() {
  server = store.get("server");
  username = store.get("username");
  password = store.get("password");
  
  if(server === undefined || username === undefined || password === undefined) {
    jQuery("#loading").hide();
    jQuery("#error").show();
    $("#error").text('Some of the options are empty. Please check the options page.');
  } else {
    
      // $(".signOutLink").click(function() {
      //     var e = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.Logout" action="" clientsizeWH="1280:939" /></update>';
      //     $.post(url, e, function(f) {
      //         location.reload()
      //     })
      // })    
    
    jQuery("#loading").show();
    jQuery("#error").hide();
    favorite = '<img src="images/box_star.png" height="14" width="14" style="position: absolute; left: 0px; margin-top: 8px">';
    ajaxImg = '<img src="images/icon_ajax.png" height="14" width="14" style="position: absolute; right: 31px; margin-top: 7px;opacity: 0.4;">';
    ieImg = '<img src="images/icon_ie.png" height="14" width="14" style="position: absolute; right: 15px; margin-top: 7px; opacity: 0.4;">';
    mobileImg = '<img src="images/icon_mobile.png" height="14" width="14" style="position: absolute; right: 45px; margin-top: 7px; opacity: 0.5;x">';
  
    var openUrl = server + '/QvAJAXZfc/AccessPoint.aspx?open=&id=';
    var platform = 'browser.chrome';
    var url = server + "/QvAJAXZfc/AccessPoint.aspx?mark=&platform=" + platform + "&dpi=96";

    TryLogin(username, password, function(status) {
      if(status != false) {
        jQuery("#loading").show();
        var a = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.Update" action="" /><set name="Document" add="mode;ie6false" /><set name="AccessPoint.Pagesize" value="0" /></update>';
        $.post(url, a)
          .done(function( c ) {
          //console.log(c)
                xmlText = new XMLSerializer().serializeToString(c);
                var x2js = new X2JS();
                var jsonObj = x2js.xml_str2json( xmlText );
                result = jsonObj.result.object.value;
                for(i = 0; i < result.length; i++) {
                  if( result[i]._name == 'Documents') {
                    documents = result[i].element;
                    //console.log(documents)
                    for(d = 0; d < documents.length; d++) {
                      ajax  = '';
                      ajaxMobile = '';
                      ie = '';
                      qvdocument = documents[d];
                      
                      clientsArray = qvdocument._clients.split(';');
                      for(c = 0; c < clientsArray.length; c++) {
                        if(clientsArray[c] == 'Ajax') {
                          ajax = ajaxImg;
                        }
                        
                        if(clientsArray[c] == 'AjaxOnSmallDevices') {
                          ajaxMobile = mobileImg;
                        }
                        
                        if(clientsArray[c] == 'Plugin') {
                          ie = ieImg;
                        }                      
                        
                      }
                      
                      if(qvdocument._favorite) {
                        fav = favorite
                      } else {
                        fav = '';
                      }
                                        
                      availability = ajax + ' ' + ajaxMobile + ' ' + ie;
                      qvdoc = qvdocument._text.replace('.qvw', '');
                      if(qvdoc.length > 50) {
                        qvdoc = qvdoc.substring(0,50) + ' ...';
                      }
                      $("#search_list").append('<div class="outer"><li><a title="QVW: ' + qvdocument._text + 
                                                    '\nCategory: '+ qvdocument._category + 
                                                    '\nSize: '+ qvdocument._filesize + 
                                                    //'\nClients: ' + qvdocument._clients  +
                                                    '\nLast Modified: ' + qvdocument._lastModified  +
                                                    '\nLast Update: ' + qvdocument._lastUpdate  +
                                                    '\nNext Update: ' + qvdocument._nextUpdate  +
                                                    '" href="' + openUrl + '' + qvdocument._value + '&client=Ajax' + '" target="_blank">' + 
                                                    fav + qvdoc + availability + '</a> <span style="display:none">' + qvdocument._category + '</span> </li></div>');
                    }
                    
                    $('#search_input').fastLiveFilter('#search_list', { 
                            callback:function(total) {
                            $('#search_list').unhighlight();
                            searchTerm = $("#search_input").val();
                            if (searchTerm.length > 0) {
                                $('#search_list').highlight(searchTerm);
                            }
                        }
                    });
                    jQuery("#loading").hide();
                    $("#search_input").on("search", function() {
                      if ($('#search_input').val() == "")
                        $('#search_input').val('').change();
                    });
                    
                    websiteAddress = document.getElementById("search_input");
                    websiteAddress.focus();                  
                  }
                  
                }
              
            })
              .fail(function() {
                jQuery("#loading").hide();
                jQuery("#error").show();
                $("#error").text('Communication error. Please try again later.');
              });
    } else {
      jQuery("#loading").hide();
      $("#error").text('Error reaching the server. Check options or network connection.');
      jQuery("#error").show();
    }
  })
}
});    
  
  
function TryLogin(username, password, callback) {
   jQuery("#loading").show();
   
	 formData = {username : username, password: password };

if(server.indexOf('http:') > -1) {
  server = server.replace('http://', "");
  url = 'http://' + encodeURIComponent(username) + ':' + encodeURIComponent(password) + '@' + server + '/QvAJAXZfc/Authenticate.aspx?back=/qlikview/FormLogin.htm';
} else {
  if(server.indexOf('https:') > -1) {
    server = server.replace('https://', "");
    url = 'https://' + encodeURIComponent(username) + ':' + encodeURIComponent(password) + '@' + server + '/QvAJAXZfc/Authenticate.aspx?back=/qlikview/FormLogin.htm';
  } else {
    url = 'http://' + encodeURIComponent(username) + ':' + encodeURIComponent(password) + '@' + server + '/QvAJAXZfc/Authenticate.aspx?back=/qlikview/FormLogin.htm';
  }
}

	 var ajaxObject = {
	    url: url,
  		//url: server + "/QvAJAXZfc/Authenticate.aspx?back=/qlikview/FormLogin.htm",
  		contentType: 'application/x-www-form-urlencoded',
  		type: 'POST',
  		cache: false,
  		data : formData,
  		error: function (XMLHttpRequest, textStatus, errorThrown) {
  			callback(false);
  		},
  		success: function () {
  			callback(true);
  		}
    };
	$.ajax( ajaxObject );
}
