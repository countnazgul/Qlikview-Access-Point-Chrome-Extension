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
      if(this.id == "servers") {
        $("#displaytable").html('');
        LoadFromStorage(); 
      }
  });

   $("#save").live("click", function() {
      // var server = document.getElementById('server').value;
      // var username = document.getElementById('username').value;
      // var password = document.getElementById('password').value;
      // ValidateBeforeSave(server, username, password, function(validate) {
      //   if(validate == true ) {
      //       store.set('server', server);
      //       store.set('username', username);
      //       store.set('password', password);
      //       $("#notif").text("Saved");
      //       $("#notif").fadeOut(5000, function() {
      //         $("#notif").text("");
      //         $("#notif").css({display: "inline"});
      //       });
      //   } else {
      //       $("#notif").text("Please fill all fields.");
      //       $("#notif").fadeOut(5000, function() {
      //         $("#notif").text("");
      //         $("#notif").css({display: "inline"});
      //       });            
      //   }
      // })
      
            // test = $( "#displaytable" ).find('table');
            // for(t = 0; t < test.length; t++) {
            //   inputs = $( test[t] ).find('table');  
            //   console.log(inputs.length);
            // }
            
            servers = [];
            $( "#displaytable" ).find('table').each(function(i) {
              var $this = $(this);
              server = {};
              $this.find('input').each(function(a) {
                server[$(this).attr('id')] = $(this).val();
              });
              
              $this.find('button').each(function(a) {
                server.id = $(this).attr('id');
              });
              //server.id = Math.uuid(17);
              servers.push(server);
            });
            
            store.set('servers', JSON.stringify(servers));
    });
    
   $("#add").live("click", function() {
      AppendServerSection('', '', '', Math.uuid(17));
    });     
    
});

function LoadFromStorage() {
    $("#displaytable").html('');
    servers = store.get('servers');
    if(servers) {
    servers = JSON.parse(servers);
       for(i = 0; i < servers.length; i++) {
         AppendServerSection(servers[i].server, servers[i].username, servers[i].password, servers[i].id);
       }
       RemoveServer();
    }
}

function AppendServerSection(server, username, password, id) {
  $( "#displaytable" ).append(' \
  <section> \
    <div> \
      <table><tr> \
		      <td>Server</td> \
		      <td><input id="server" value="'+ server  +'" type="text"  size="97" placeholder="QV server dns/ip in format: http://my-qv-server [add port if server is not listening on 80 (default)]"></td> \
		      <td></td> \
		    </tr> \
		    <tr> \
		      <td>Username</td> \
		      <td><input id="username" value="'+ username  +'" type="text" placeholder="domain\\username"></td> \
		      <td></td> \
		    </tr> \
		    <tr> \
		      <td>Password</td> \
		      <td><input id="password" value="'+ password  +'" type="password" placeholder="password"></td> \
		      <td><button id="' + id + '" class="remove" style="margin-top: 10px">Remove</button></td> \
		    </tr> \
		  </table> \
		</div> \
	</section>');
}

function RemoveServer() {
	t = document.getElementsByClassName("remove");
	for(i = 0; i < t.length; i++) {
	  t[i].addEventListener('click', function (){
        servers = store.get('servers');
        servers = JSON.parse(servers);	      
        result = []
      
        for(s = 0; s < servers.length; s++) {
          if(servers[s].id != $(this).attr('id')) {
            result.push(servers[s]);
          }
        }
        store.set('servers', JSON.stringify(result));
        $("#displaytable").html('');
	      LoadFromStorage();
    }, false);
	}  
}

function ValidateBeforeSave(server, username, password, callback) {
  if (server == null || server == "" || username == null || username == "" || password==null || password == "") {
    callback(false);
  } else {
    callback(true);
  }
}