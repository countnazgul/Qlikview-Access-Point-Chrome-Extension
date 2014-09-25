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
});

function ValidateBeforeSave(server, username, password, callback) {
  if (server == null || server == "" || username == null || username == "" || password==null || password == "") {
    callback(false);
  } else {
    callback(true);
  }
}