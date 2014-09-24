function save_options() {
  var server = document.getElementById('server').value;
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  item = {};
  item.server = server;
  item.username = username;
  item.password = password;
  console.log(item)
  
  chrome.storage.local.set({'channels': 'channels1'});
  
  chrome.storage.local.set({" value": "123"}, function() {
        // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 3000);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
  
  }, function(items) {
    //console.log(items);
    document.getElementById('color').value = items.favoriteColor;
    document.getElementById('like').checked = items.likesColor;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);