var loadPetList=function(username) {
  //console.log("load pets");
  $.ajax({//initial ajax call 
    type:"GET",
    url:"./api/users/getallpets/"+username,
    success: function(data){
        renderPetList(data,0);
        renderPetBackground(data[0]);
        renderActivePet(data[0]);
        loadObjects(username);
        // dsdddddddddddddddddddddd
    }
  });
}


var loadObjects=function(username) {
    //console.log("load objects");
  $.ajax({//initial ajax call 
    type:"GET",
    url:"./api/users/getallobjects/"+username,
    success: function(data){
        //console.log(data);
        renderObjects(data);
        $('.item.active').click(function() {
          $('.fullcontainer').fadeIn();
          $('.objactioncontainer').removeClass('hidden');
          var url = "url("+$(this).children('.objimg').attr('src') + ") center center no-repeat";
          //console.log(url);
          $('.objpic').css({"background": url,"background-size":"contain"})
          $('.objtype').html($(this).children('.type').html());
          $('.objuseneed').html($(this).children('.need').html());
          $('.objfulfillment').html($(this).children('.fullfillment').html());
          $('.objqty').html("Qty: "+$(this).children('.quantity').html());
          $('.objownedID').html($(this).children('#objectsownedID').val());
          $('.error').remove();
        });
    }
  });
}

var renderPetList = function (data, petNum) {
  //console.log("rendering pet list");
  var content='<div class="title">Pets</div>';
  for (var i = 0; i < data.length; i++) {
    if(i != petNum){
      if (data[i] == null) {
        break;
      } 
      else {
        content +=
        '<div class="petcontainer notactive" style="background:url('+data[i].happy+') center center no-repeat;background-size:contain">' +
          '<div class="name">'+data[i].name+'</div>'
          +'<input class="petPos" type="text" value="'+i+'" style="display:none;">'
        +'</div>';
    	};
    }
    else{
      //add hidden field for first pet
      content+='<input id="activePetID" type="text" value="'+data[i].petID+'" style="display:none;">';
      content+='<input id="activePetPic" type="text" value="'+data[i].happy+'" style="display:none;">';
      content +=
      '<div class="petcontainer active" style="background:url('+data[i].happy+') center center no-repeat;background-size:contain">' +
        '<div class="name">'+data[i].name+'</div>' +
        '<input class="petPos" type="text" value="'+i+'" style="display:none;">'+
      '</div>';
    }
  }
  $('.petlist').html(content);
  $('.notactive').on('click',function(){
      //console.log($(this).children('.petPos').val());
      var petPos = $(this).children('.petPos').val();
      renderPetList(data,petPos);
      renderPetBackground(data[petPos]);
      renderActivePet(data[petPos]);
  });
}

var renderActivePet = function (data) {
  var activePetPic = document.getElementById("activePetPic").value;
  $('.petpic').html('<img src="'+activePetPic+'">');

  var age = Math.floor(calcAge(data.creationdate));
  if(age==-1){
    age = 0;
  }
  var petDeets = '<table><tr><td>Name:</td><td class="petname">'+data.name+
  '</td></tr><tr><td>Age:</td><td class="petage">'+ age+
  ' days</td></tr></table>';
  $('.petinfo').html(petDeets);

  //TODO pet levels
  var petStats = "";
  petStats = 'Fullness:'
      +'<div class="bar">'
          +'<div class="full"></div>'
          +'<div id="fulltext" class="text">'+ data.fullness +'/100</div>'
      +'</div>'
      +'Happiness:'
      +'<div class="bar">'
          +'<div class="happy"></div>'
          +'<div id="happytext" class="text">'+data.happiness+'/100</div>'
      +'</div>'
      +'Cleanliness:'
      +'<div class="bar">'
          +'<div class="clean"></div>'
          +'<div id="cleantext" class="text">'+ data.cleanliness+'/100</div>'
      +'</div></div>'
  $('.petstats').html(petStats);
  $('.full').css('width',2*data.fullness+'px');
  $('.happy').css('width',2*data.happiness+'px');
  $('.clean').css('width',2*data.cleanliness+'px');
}

function calcAge(creationdate) {
  var bday = creationdate.split(' ');
  bday = bday[0].split('-');
  bday = new Date(bday[0], bday[1]-1, bday[2]);
  return (new Date()-bday)/(1000*60*60*24);
}

renderPetBackground = function(data) {
  //console.log("background");
    //set background to match pet
  if (data.typeID == "Cactus") {
    $('.petview').css('background','url(http://catcus.me/img/background_cactus.png) center center no-repeat');
  }
  else if (data.typeID == "Turtle" || data.typeID == "Fish") {
    $('.petview').css('background','url(http://catcus.me/img/background_fishturtle.png) center center no-repeat');
  }
  else {
    $('.petview').css('background','url(http://catcus.me/img/background_catdog.png) center center no-repeat');
  };
}

var renderObjects = function(data)
{
  var content="";
  if(data.length == 0){
    content+='<div class ="noitems">You have no items :( Go buy some!</div>';
  }
  else {
    for (var i = 0; i < data.length; i++) {
      if (data[i] == null) {
        break;
      }
      var qty = data[i].uses_remaining;
      if (data[i].uses_remaining < 0)
      {
        qty = 'unlimited';
      };
      content +=
        '<div class="item active">' +
          '<input id="objectsownedID" type="text" value="'+
          data[i].objectsownedID+'" style="display:none;">' +
          '<img class="objimg" src="' +data[i].image+ '">' +
          '<br><span class="type">' + data[i].name + '</span>'+
          '<br><span class="need">' + data[i].need_fulfilled + '</span>'+
          '<br>+<span class="fullfillment">' + data[i].rate_of_fulfillment + '</span>'+
          '<br>Qty: <span class="quantity">'+ qty +'</span>'+ 
          '</div>';
    }
  }
  $('.itemcontainer').html(content);
}

var loadPetImage=function(username, petID) {
  console.log("load pet image");
  $.ajax({//initial ajax call 
    type:"GET",
    url:"./api/users/getallpets/"+username,
    success: function(data){
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        if (data[i] == null) {
          break;
        } 
        else {
          if(data[i].petID == petID){
            console.log("changing pet image: " + data[i].happy);
            $('.petpic img').attr('src',data[i].happy);
          }
        }
      }
    }
  });
}