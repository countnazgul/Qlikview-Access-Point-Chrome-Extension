  documents = store.get('docs');
  $("#search_list").append(documents);
  $('ul#search_list>li').tsort('a',{attr:'title'});
  
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

  $(".btn-group > .btn").click(function(){
      $(this).addClass("active").siblings().removeClass("active");
  });
  
  $('#sortTitle').addClass("active");
  $('#sortasc').addClass("active");

  sort = 'asc';
  Field = 1;
  Sort(1,sort)
  
  $("#sortTitle").live("click", function() {
    Field = 1;
    Sort(1, sort) 
  }); 
  
  $("#sortServer").live("click", function() {
    Field = 2;
    Sort(2, sort) 
  });   
  
  $("#sortLastModified").live("click", function() {
    Field = 3;
    Sort(3, sort)
  });     
  
  $("#sortLastUpdated").live("click", function() {
    Field = 4;
    Sort(4, sort)    
  });       
  
  $("#sortasc").live("click", function() {
    sort = 'asc';
    Sort(Field, sort);
  });       
  
  $("#sortdesc").live("click", function() {
    sort = 'desc';
    Sort(Field, sort);
  });       
  
  function Sort(field, order) {
    switch(field) {
        case 1:
            $('ul#search_list>li').tsort('span[class=qvw]',{order:order});
            break;
        case 2:
            $('ul#search_list>li').tsort('span.server','span.qvw',{order:order});
            break;
        case 3:
            $('ul#search_list>li').tsort('span[class=lastmodified]',{order:order});
            break;
        case 4:
            $('ul#search_list>li').tsort('span[class=lastupdate]',{order:order});
            break;            
        // default:
        //     default code block
    }    
  }


