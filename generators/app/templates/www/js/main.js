$(function(){
  var loadPage = function(id){
    $("#container").load("html/"+id+".html");
  };
  $("#doc-topbar-collapse a").on("click",function(e){
    var page = $(this).attr('page');
    loadPage(page);
  });

  loadPage("main");
});

