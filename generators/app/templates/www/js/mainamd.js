require.config({
  baseUrl:"js",
  paths:{
    jquery:'jquery.min',
    fnui:'fnui.min'
  }
});
require(['jquery','fnui'],function($,UI){
  $(function(){
    var loadPage = function(id){
      $("#container").load("html/"+id+".html");
    }
    $("#doc-topbar-collapse a").on("click",function(e){
      var page = $(this).attr('page');
      loadPage(page);
    })

    loadPage("main");
  });
});
