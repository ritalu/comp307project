var loadUser = function(username) {
  $.ajax({//initial ajax call 
    type:"GET",
    url:"../api/users/" + username,
    success: function(data){
        renderUser(data);
    }
  });
}

var renderUser = function (data) {

  var level = Math.floor(Math.log(data.exp) / Math.log(2));
  var totalExp = Math.pow(level + 1, 2);
  
  $('.panel').children('h1').html(data.username);
  var bg = "url(" + data.picture + ") center center no-repeat white";
  $('.profpic').css({"background": bg, "background-size":"cover"});

  $('.panel').children('h2').html("Level " + level);

}

var loadUserPets = function(username) {
  $.ajax({//initial ajax call 
    type:"GET",
    url:"../api/users/getallpets" + username,
    success: function(data){
        renderPets(data);
    }
  });
}

var renderPets = function(data) {
  var content = "";
  for (var i = 0; i < data.length; i++) {

    if (data[i] == null) {
      break;
    }
    else {
      content += '<div class="pet">' + 
        '<img class="petimg" src="' + data[i].happy + '">' + 
          '<br>' + data[i].name +
      '</div>';
    };
  }
  content += '<br clear="all" />'
  if (datalength == 1) {
    $('.petwrapper').css({"width":"160px"});
  } else if (datalength == 2) {
    $('.petwrapper').css({"width":"320px"})
  }
  $('.petwrapper').html(content);
}