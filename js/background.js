var storage = chrome.storage.local;

setInterval(function()
{
  Main();
}, 3000000);


//$(document).ready(function() {
function Main() {  
  errors = [];
  toprocess = 0;
  allprocessed = 0;
  allDocuments = '';
  
  servers = store.get('servers');
  store.set('error', '');
    servers = JSON.parse(servers);
    if(servers.length > 0) {
    
    toprocess = servers.length;

      favorite = '<img src="images/box_star.png" height="14" width="14" style="margin-left: -11px;; left: 0px; margin-top: 8px">';
      ajaxImg = '<img src="images/icon_ajax.png" height="14" width="14" style="margin-top: 7px;opacity: 0.4;float: right;margin-right: -79px;">';
      ieImg = '<img src="images/icon_ie.png" height="14" width="14" style="right: 15px; margin-top: 7px; opacity: 0.4;float: right;margin-right: -110px;">';
      mobileImg = '<img src="images/icon_mobile.png" height="14" width="14" style="right: 31px; margin-top: 7px; opacity: 0.5;float: right;margin-right: -95px;">';
    
    
      jQuery.eachAsync(servers, {
              delay: 100,
              bulk: 0,
              loop: function(index, value)
              {
                server = value.server;
                username = value.username;
                password = value.password;
                
                var openUrl = server + '/QvAJAXZfc/AccessPoint.aspx?open=&id=';
                var platform = 'browser.chrome';
                var url = server + "/QvAJAXZfc/AccessPoint.aspx?mark=&platform=" + platform + "&dpi=96";
          
                TryLogin(username, password, function(status) {
                  if(status != false) {
                    var a = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.Update" action="" /><set name="Document" add="mode;ie6false" /><set name="AccessPoint.Pages.Current" value="0" /><set name="AccessPoint.Pages.Current" value="0" /><set name="AccessPoint.Pagesize" value="0" /></update>';
//                            '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.Update" action="" /><set name="AccessPoint.Pages.Current" value="0" /><set name="AccessPoint.AttributeValue" value="" /><set name="Document" add="mode;ie6false" /><set name="AccessPoint.SearchFilter" text="" /><set name="AccessPoint.Pages.Current" value="0" /></update>
                    $.post(url, a)
                      .done(function( c ) {
                      //console.log(c)
                            xmlText = new XMLSerializer().serializeToString(c);
                            var x2js = new X2JS();
                            var jsonObj = x2js.xml_str2json( xmlText );
                            result = jsonObj.result.object.value;
                            //console.log(result);
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
                                  
                                  
                                  var counter = 0;
                                    for (var key in value) {
                                      if(counter == 4) {
                                        color = value[key];
                                      }
                                      counter++;
                                    }
                                  
                                  r = hexToRgb(color).r;
                                  g = hexToRgb(color).g;
                                  b = hexToRgb(color).b;
                                  
                                  categoryColor = 'background: -webkit-gradient(linear, left top, right bottom, \
                                                   color-stop(0%,rgba(' + r + ',' + g + ',' + b + ',0)), \
                                                   color-stop(73%,rgba(' + r + ',' + g + ',' + b + ',0)), \
                                                   color-stop(100%,rgba(' + r + ',' + g + ',' + b + ',1)));';
                                  
                                  allDocuments = allDocuments + '<li><a title="QVW: ' + qvdocument._text +
                                                                '\nServer: '+ value.server +
                                                                '\nCategory: '+ qvdocument._category + 
                                                                '\nSize: '+ qvdocument._filesize + 
                                                                //'\nClients: ' + qvdocument._clients  +
                                                                '\nLast Modified: ' + qvdocument._lastModified  +
                                                                '\nLast Update: ' + qvdocument._lastUpdate  +
                                                                '\nNext Update: ' + qvdocument._nextUpdate  +
                                                                '" href="' + openUrl + '' + qvdocument._value + '&client=Ajax' + '" target="_blank">' + 
                                                                '<span class="server" width: 14; style="' + categoryColor +' font-size:9px;"></span>' +
                                                                fav + qvdoc.substring(0,41) + availability + '</a><span style="display:none" class="category">' + qvdocument._category + 
                                                                '</span><span style="display:none" class="server">' + value.server + 
                                                                '</span><span style="display:none" class="nametag">' + value.nametag + '</span> \
                                                                <span style="display:none" class="qvw">' +  qvdocument._text + '</span> \
                                                                <span style="display:none" class="lastmodified">' + qvdocument._lastModified + '</span> \
                                                                <span style="display:none" class="lastupdate">' + qvdocument._lastUpdate + '</span> \
                                                                <span style="display:none" class="size">' +  qvdocument._filesize + '</span> \
                                                                </li>'
                                                                //);
                                }
                                
                                allprocessed++;
                                AllProcessed();
                              }
                              
                            }
                          
                        })
                          .fail(function() {
                            allprocessed++;
                            AllProcessed();
                            errors.push(server);
                            errors.push('Error reaching: ' + server);
                            Errors();
                            //console.log(errors);
                          });
                  } else {
                    allprocessed++;
                    AllProcessed();              
                    errors.push('Error reaching: ' + server);
                    Errors();
                    //console.log(errors);
                  }
                })
                  },
                  end: function()
                  {
                          //console.log(allDocuments);
                  }
          });
    } else {
      AllProcessed();
      errors.push('No servers defined. Use Options page.');
      Errors();
    }
}
  
function TryLogin(username, password, callback) {
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

function AllProcessed() {
  if(allprocessed == toprocess) {
    store.set('docs', allDocuments);
  }
}

function Errors(){
  text = '';
  
  for(i = 0; i < errors.length; i++) {
    text = '<br/>' + text + errors[i];
  }
  store.set('error', text)
}

function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
