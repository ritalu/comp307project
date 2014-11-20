var loadPets=function() {
    console.log("load pets");
  $.ajax({//initial ajax call 
    type:"GET",
    url:"./api/pettypes",
    success: function(data){
        console.log(data);
        renderPets(data);
    }
  });
}

var loadObjects=function() {
    console.log("load objects");
  $.ajax({//initial ajax call 
    type:"GET",
    url:"./api/objects",
    success: function(data){
        console.log(data);
        renderObjects(data);
    }
  });
}

var renderPets = function (data) {
console.log("rendering");
  var content="";
  for (var i = 0; i < data.length; i++) {
    if (data[i] == null) {
      break;
    }
    else {
      content +=
      '<div class="pet active">' + //TODO
          '<div class="petimg" style="background:url("../img/' + data[i].imageID +'.png") center center no-repeat;background-size:contain"></div>' +
          '<br><b>'+ data[i].typeID + '</b>' +
          '<br>' + data[i].price +'coins' +
          '<br> Level' + data[i].unlock_level +
      '</div>'
  	};
  }
  $('.petcontainer').html(content);
}

var renderObjects = function (data) {
console.log("rendering");
  var content="";
  for (var i = 0; i < data.length; i++) {
    if (data[i] == null) {
      break;
    }
    else {
      content +=
      '<div class="item active">' + //TODO
      	'<img src="' +data[i].image+ '">' +
        '<br><b>' + data[i].name + '</b>'+
        '<br>' + data[i].price + 'coins'
        '<br>Level'+ data[i].unlock_level +
        '</div>'	
  	};
  }
  $('.itemcontainer').html(content);
}