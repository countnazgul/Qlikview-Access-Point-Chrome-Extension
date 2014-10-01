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
     Save();
    });
    
   $("#add").live("click", function() {
      AppendServerSection('', '', '', '', '', Math.uuid(17));
      Save();
      RemoveServer();
    }); 
    
    $("#force").live("click", function() {
      var bkg = chrome.extension.getBackgroundPage();
      bkg.Main();
    });     
    
});

function LoadFromStorage() {
    $("#displaytable").html('');
    servers = store.get('servers');
    if(servers) {
      $("#save").show();
      servers = JSON.parse(servers);
         for(i = 0; i < servers.length; i++) {
           
          var counter = 0;
          s = servers[i];
          for (var key in s) {
            if(counter == 4) {
              color = s[key];
              colorId = key;
            }
            counter++;
          }
          
           AppendServerSection(servers[i].server, servers[i].username, servers[i].password, colorId, color ,servers[i].id);
         }
      RemoveServer();
    } else {
      $("#save").hide();
    }
}

function AppendServerSection(server, username, password, colorId, color ,id) {
  if(!colorId) {
    colorId = Math.uuid(17);
  }
  
  $( "#displaytable" ).append(' \
  <section> \
    <div> \
      <table><tr> \
		      <td>Server</td> \
		      <td><input id="server" value="'+ server  +'" type="text"  size="97" placeholder="QV server dns/ip in format: http://my-qv-server [add port if server is not listening on 80 (default)]"></td> \
		      <td> </td> \
		    </tr> \
		    <tr> \
		      <td>Username</td> \
		      <td><input id="username" value="'+ username  +'" type="text" placeholder="domain\\username"></td> \
		      <td></td> \
		    </tr> \
		    <tr> \
		      <td>Password</td> \
		      <td><input id="password" value="'+ password  +'" type="password" placeholder="password"></td> \
		      <td></td> \
		    </tr> \
		    <tr> \
		    <td>Identifier</td> \
		    <td> <input id="nametag" placeholder="optional name tag"></td> \
		    <td></td> \
		    </tr> \
		    <tr> \
		    <td>Color</td> \
		    <td> <input class="color" value="' + color +'" id="' + colorId + '"> (optional)</td> \
		    <td><button id="' + id + '" class="remove" style="margin-top: 10px">Remove</button></td> \
		    </tr> \
		  </table> \
		</div> \
	</section>');
	
	input = document.getElementById(colorId);
	col = new jscolor.color(input)
	
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
        $("#notif").text("Saved");
        $("#notif").fadeOut(5000, function() {
          $("#notif").text("");
          $("#notif").css({display: "inline"});
        });	      
    }, false);
	}  
}

function Save() {
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

    servers.push(server);
  });
  
  store.set('servers', JSON.stringify(servers));
  $("#notif").text("Saved");
  $("#notif").fadeOut(5000, function() {
    $("#notif").text("");
    $("#notif").css({display: "inline"});
  });
}
