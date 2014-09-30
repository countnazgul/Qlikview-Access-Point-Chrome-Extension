  documents = store.get('docs');
  $("#search_list").append(documents);
  
  $('#search_input').fastLiveFilter('#search_list', { 
          callback:function(total) {
          $('#search_list').unhighlight();
          searchTerm = $("#search_input").val();
          if (searchTerm.length > 0) {
              $('#search_list').highlight(searchTerm);
          }
      }
  });
  $("#search_input").on("search", function() {
    if ($('#search_input').val() == "")
      $('#search_input').val('').change();
  });
  
  websiteAddress = document.getElementById("search_input");
  websiteAddress.focus();
  
  $('#error').hide()
  errors = store.get('error');
  if(errors) {
    $('#error').html(errors);
    $('#error').show();
  }

// var storage = chrome.storage.local;
// var server = '';
// var username = '';
// var password = '';
// jQuery("#error").hide();
// jQuery("#loading").show();
// errors = [];
// toprocess = 0;
// allprocessed = 0;

// $(document).ready(function() {
  
//   servers = store.get('servers');
//   if(!servers) {
//     AllProcessed();
//     errors.push('No servers defined. Use Options page.');
//     Errors();
//   } else {
//     servers = JSON.parse(servers);
//     if(servers.length > 0) {
    
//     toprocess = servers.length;
//       // $(".signOutLink").click(function() {
//       //     var e = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.Logout" action="" clientsizeWH="1280:939" /></update>';
//       //     $.post(url, e, function(f) {
//       //         location.reload()
//       //     })
//       // })    
      
//       jQuery("#loading").show();
//       jQuery("#error").hide();
//       favorite = '<img src="images/box_star.png" height="14" width="14" style="position: absolute; left: 0px; margin-top: 8px">';
//       ajaxImg = '<img src="images/icon_ajax.png" height="14" width="14" style="position: absolute; right: 45px; margin-top: 7px;opacity: 0.4;">';
//       ieImg = '<img src="images/icon_ie.png" height="14" width="14" style="position: absolute; right: 15px; margin-top: 7px; opacity: 0.4;">';
//       mobileImg = '<img src="images/icon_mobile.png" height="14" width="14" style="position: absolute; right: 31px; margin-top: 7px; opacity: 0.5;">';
    
    
//       jQuery.eachAsync(servers, {
//               delay: 100,
//               bulk: 0,
//               loop: function(index, value)
//               {
//                 server = value.server;
//                 username = value.username;
//                 password = value.password;
                
//                 var openUrl = server + '/QvAJAXZfc/AccessPoint.aspx?open=&id=';
//                 var platform = 'browser.chrome';
//                 var url = server + "/QvAJAXZfc/AccessPoint.aspx?mark=&platform=" + platform + "&dpi=96";
          
//                 TryLogin(username, password, function(status) {
//                   if(status != false) {
//                     //jQuery("#loading").show();
//                     var a = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.Update" action="" /><set name="Document" add="mode;ie6false" /><set name="AccessPoint.Pagesize" value="0" /></update>';
//                     $.post(url, a)
//                       .done(function( c ) {
//                       //console.log(c)
//                             xmlText = new XMLSerializer().serializeToString(c);
//                             var x2js = new X2JS();
//                             var jsonObj = x2js.xml_str2json( xmlText );
//                             result = jsonObj.result.object.value;
//                             for(i = 0; i < result.length; i++) {
//                               if( result[i]._name == 'Documents') {
//                                 documents = result[i].element;
//                                 //console.log(documents)
//                                 for(d = 0; d < documents.length; d++) {
//                                   ajax  = '';
//                                   ajaxMobile = '';
//                                   ie = '';
//                                   qvdocument = documents[d];
                                  
//                                   clientsArray = qvdocument._clients.split(';');
//                                   for(c = 0; c < clientsArray.length; c++) {
//                                     if(clientsArray[c] == 'Ajax') {
//                                       ajax = ajaxImg;
//                                     }
                                    
//                                     if(clientsArray[c] == 'AjaxOnSmallDevices') {
//                                       ajaxMobile = mobileImg;
//                                     }
                                    
//                                     if(clientsArray[c] == 'Plugin') {
//                                       ie = ieImg;
//                                     }                      
                                    
//                                   }
                                  
//                                   if(qvdocument._favorite) {
//                                     fav = favorite
//                                   } else {
//                                     fav = '';
//                                   }
                                                    
//                                   availability = ajax + ' ' + ajaxMobile + ' ' + ie;
//                                   qvdoc = qvdocument._text.replace('.qvw', '');
//                                   if(qvdoc.length > 50) {
//                                     qvdoc = qvdoc.substring(0,50) + ' ...';
//                                   }
                                  
                                  
//                                   var counter = 0;
//                                     for (var key in value) {
//                                       if(counter == 4) {
//                                         color = value[key];
//                                       }
//                                       counter++;
//                                     }
                                  
//                                   r = hexToRgb(color).r;
//                                   g = hexToRgb(color).g;
//                                   b = hexToRgb(color).b;
                                  
//                                   categoryColor = 'background: -webkit-gradient(linear, left top, right bottom, \
//                                                   color-stop(0%,rgba(' + r + ',' + g + ',' + b + ',0)), \
//                                                   color-stop(73%,rgba(' + r + ',' + g + ',' + b + ',0)), \
//                                                   color-stop(100%,rgba(' + r + ',' + g + ',' + b + ',1)));';
                                  
//                                   $("#search_list").append('<div class="outer"><li><a title="QVW: ' + qvdocument._text +
//                                                                 '\nServer: '+ value.server +
//                                                                 '\nCategory: '+ qvdocument._category + 
//                                                                 '\nSize: '+ qvdocument._filesize + 
//                                                                 //'\nClients: ' + qvdocument._clients  +
//                                                                 '\nLast Modified: ' + qvdocument._lastModified  +
//                                                                 '\nLast Update: ' + qvdocument._lastUpdate  +
//                                                                 '\nNext Update: ' + qvdocument._nextUpdate  +
//                                                                 '" href="' + openUrl + '' + qvdocument._value + '&client=Ajax' + '" target="_blank">' + 
//                                                                 '<span class="server" width: 14; style="' + categoryColor +' font-size:9px;"></span>' +
//                                                                 fav + qvdoc + availability + '</a><span style="display:none">' + qvdocument._category + 
//                                                                 '</span><span style="display:none">' + value.server + 
//                                                                 '</span><span style="display:none">' + value.nametag + 
//                                                                 '</span> </li></div>');
//                                 }
                                
//                                 $('#search_input').fastLiveFilter('#search_list', { 
//                                         callback:function(total) {
//                                         $('#search_list').unhighlight();
//                                         searchTerm = $("#search_input").val();
//                                         if (searchTerm.length > 0) {
//                                             $('#search_list').highlight(searchTerm);
//                                         }
//                                     }
//                                 });
//                                 $("#search_input").on("search", function() {
//                                   if ($('#search_input').val() == "")
//                                     $('#search_input').val('').change();
//                                 });
                                
//                                 websiteAddress = document.getElementById("search_input");
//                                 websiteAddress.focus();
//                                 allprocessed++;
//                                 AllProcessed();
//                               }
                              
//                             }
                          
//                         })
//                           .fail(function() {
//                             allprocessed++;
//                             AllProcessed();
//                             errors.push(server);
//                             errors.push('Error reaching: ' + server);
//                             Errors();
//                             //console.log(errors);
//                           });
//                   } else {
//                     allprocessed++;
//                     AllProcessed();              
//                     errors.push('Error reaching: ' + server);
//                     Errors();
//                     //console.log(errors);
//                   }
//                 })
//                   },
//                   end: function()
//                   {
//                           //console.log(' END');
//                   }
//           });
//     } else {
//       AllProcessed();
//       jQuery("#error").show();
//       errors.push('No servers defined. Use Options page.');
//       Errors();
//     }
//   }
// });    
  
  
// function TryLogin(username, password, callback) {
// 	formData = {username : username, password: password };

//   if(server.indexOf('http:') > -1) {
//     server = server.replace('http://', "");
//     url = 'http://' + encodeURIComponent(username) + ':' + encodeURIComponent(password) + '@' + server + '/QvAJAXZfc/Authenticate.aspx?back=/qlikview/FormLogin.htm';
//   } else {
//     if(server.indexOf('https:') > -1) {
//       server = server.replace('https://', "");
//       url = 'https://' + encodeURIComponent(username) + ':' + encodeURIComponent(password) + '@' + server + '/QvAJAXZfc/Authenticate.aspx?back=/qlikview/FormLogin.htm';
//     } else {
//       url = 'http://' + encodeURIComponent(username) + ':' + encodeURIComponent(password) + '@' + server + '/QvAJAXZfc/Authenticate.aspx?back=/qlikview/FormLogin.htm';
//     }
//   }

// 	 var ajaxObject = {
// 	    url: url,
//   		//url: server + "/QvAJAXZfc/Authenticate.aspx?back=/qlikview/FormLogin.htm",
//   		contentType: 'application/x-www-form-urlencoded',
//   		type: 'POST',
//   		cache: false,
//   		data : formData,
//   		error: function (XMLHttpRequest, textStatus, errorThrown) {
//   			callback(false);
//   		},
//   		success: function () {
//   			callback(true);
//   		}
//     };
// 	$.ajax( ajaxObject );
// }

// function AllProcessed() {
//   if(allprocessed == toprocess) {
//     jQuery("#loading").hide();
//   }
// }

// function Errors(){

//   $("#error").html('');
//   text = '';
  
//   for(i = 0; i < errors.length; i++) {
//     text = text + errors[i] + '<br/>';
//   }
  
//   $("#error").html(text);  
//   jQuery("#error").show();
// }

// function hexToRgb(hex) {
//     var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
//     hex = hex.replace(shorthandRegex, function(m, r, g, b) {
//         return r + r + g + g + b + b;
//     });

//     var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//     return result ? {
//         r: parseInt(result[1], 16),
//         g: parseInt(result[2], 16),
//         b: parseInt(result[3], 16)
//     } : null;
// }
