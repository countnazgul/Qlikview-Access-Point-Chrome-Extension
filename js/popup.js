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
  
  favorite = '<img src="images/box_star.png" height="14" width="14" style="position: absolute; left: 0px; margin-top: 8px">';
  ajaxImg = '<img src="images/icon_ajax.png" height="14" width="14" style="position: absolute; right: 31px; margin-top: 7px;opacity: 0.4;">';
  ieImg = '<img src="images/icon_ie.png" height="14" width="14" style="position: absolute; right: 15px; margin-top: 7px; opacity: 0.4;">';
  mobileImg = '<img src="images/icon_mobile.png" height="14" width="14" style="position: absolute; right: 45px; margin-top: 7px; opacity: 0.5;x">';
  var ap = {};
  ap.browserType = function(data) {
    var f = "browser.";
    if (data.indexOf("chrome") != -1 && data.indexOf("webkit") != -1) {
        f += "chrome"
    } else {
        if (data.indexOf("safari") != -1 || data.indexOf("konqueror") != -1) {
            f += "safari"
        } else {
            if (data.indexOf("opera") != -1) {
                f += "opera"
            } else {
                if (data.indexOf("gecko") !== -1 && data.indexOf("like gecko") === -1) {
                    var geckoVersion = parseFloat(navigator.userAgent.substr(navigator.userAgent.search("Firefox") + 8, 3));
                    f += "gecko." + geckoVersion
                } else {
                    if (data.toLowerCase().indexOf("msie") != -1) {
                        isIE = true;
                        f += navigator.userAgent.substr(navigator.userAgent.indexOf("MSIE"), 8);
                        if (data.toLowerCase().indexOf("msie 6") != -1) {
                            isIE6 = 1
                        }
                        var IE_VERSION = parseFloat(data.substr(data.search("msie") + 4, 4));
                        var IE_DOCMODE = typeof document.documentMode == "undefined" ? IE_VERSION : document.documentMode;
                        if (IE_VERSION < 9 && IE_DOCMODE < 9) {
                            isIE8ORWORSE = true;
                            /*@cc_on
                                    if (/^10/.test(@_jscript_version)) {
                                        isIE10ORBETTER = true;
                                    }
                                    @*/
                        }
                    } else {
                        if (data.indexOf("rv:") !== -1 && data.indexOf("like gecko") !== -1) {
                            IS_IE11_OR_ABOVE = true
                        }
                    }
                }
            }
        }
    } if (navigator.userAgent.toLowerCase().indexOf("mobile") != -1 || navigator.userAgent.toLowerCase().indexOf("playbook") != -1) {
        f += ".mobile";
        isMobile = 1
    }
    if (data.toLowerCase().indexOf("windows nt 6.2") != -1) {
        isWIN8 = true
    }
    if (data.toLowerCase().indexOf("windows nt 6.3") != -1) {
        isWIN8 = true
    }
    return f
};
  var openUrl = server + '/QvAJAXZfc/AccessPoint.aspx?open=&id=';
  var platform = ap.browserType(navigator.userAgent.toLowerCase());
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
                                                    '\nClients: ' + qvdocument._clients  +
                                                    '\nLast Modified: ' + qvdocument._lastModified  +
                                                    '\nLast Update: ' + qvdocument._lastUpdate  +
                                                    '\nNext Update: ' + qvdocument._nextUpdate  +
                                                    '" href="' + openUrl + '' + qvdocument._value + '&client=Ajax' + '" target="_blank">' + 
                                                    fav + qvdoc + availability + '</a></li></div>');
                    }
  //                   $('#search_input').fastLiveFilter('#search_list');
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
                //console.log('test');
              });
    } else {
      jQuery("#loading").hide();
      $("#error").text('Error reaching the server. Check options.');
      jQuery("#error").show();
    }
  })
});    
  
  
function TryLogin(username, password, callback) {
   jQuery("#loading").show();
   
	 formData = {username : username, password: password };
	 
	 var ajaxObject = {
  		url: server + "/QvAJAXZfc/Authenticate.aspx?back=/qlikview/FormLogin.htm",
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
