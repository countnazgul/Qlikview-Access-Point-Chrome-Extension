$(document).ready(function() {
  manifestData = chrome.app.getDetails();
  $("#appversion").text(manifestData.version);
  
  $("#server").val(store.get("server"));
  $("#username").val(store.get("username"));
  $("#password").val(store.get("password"));
  
  $(".navbar-item").click(function() {
      $(".navbar-item").removeClass("navbar-item-selected");
      $(this).addClass("navbar-item-selected");
      $(".page").hide();
      $("#" + this.id + "Page").show()
  });

   $("#save").live("click", function() {
      var server = document.getElementById('server').value;
      var username = document.getElementById('username').value;
      var password = document.getElementById('password').value;
      ValidateBeforeSave(server, username, password, function(validate) {
        if(validate == true ) {
            store.set('server', server);
            store.set('username', username);
            store.set('password', password);
            $("#notif").text("Saved");
            $("#notif").fadeOut(5000, function() {
              $("#notif").text("");
              $("#notif").css({display: "inline"});
            });
        } else {
            $("#notif").text("Please fill all fields.");
            $("#notif").fadeOut(5000, function() {
              $("#notif").text("");
              $("#notif").css({display: "inline"});
            });            
        }
      })
    });
    
   $("#clear").live("click", function() {
            store.remove('server');
            store.remove('username');
            store.remove('password');
            $("#server").val('');
            $("#username").val('');
            $("#password").val('');
            $("#notif").text("Cleared");
            $("#notif").fadeOut(5000, function() {
              $("#notif").text("");
              $("#notif").css({display: "inline"});
            });
    }); 
    
   $("#add").live("click", function() {
          $( "#displaytable" ).append('<section><div><table><tr> \
						      <td>Server</td> \
						      <td><input id="server" type="text"  size="97" placeholder="QV server dns/ip in format: http://my-qv-server [add port if server is not listening on 80 (default)]"></td> \
						      <td></td> \
						    </tr> \
						    <tr> \
						      <td>Username</td> \
						      <td><input id="username" type="text" placeholder="domain\\username"></td> \
						      <td></td> \
						    </tr> \
						    <tr> \
						      <td>Password</td> \
						      <td><input id="password"  type="password" placeholder="password"></td> \
						      <td>Remove</td> \
						    </tr> \
						  </table> \
						</div> \
					</section>');
    });     
    
});

function ValidateBeforeSave(server, username, password, callback) {
  if (server == null || server == "" || username == null || username == "" || password==null || password == "") {
    callback(false);
  } else {
    callback(true);
  }
}