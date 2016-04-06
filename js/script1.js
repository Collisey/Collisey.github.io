QB.init(QBApp.appId, QBApp.authKey, QBApp.authSecret, true);

QB.createSession(QBUser, function(err, result){
  if (err) {
    console.log('Something went wrong: ' + err);
  } else {
    console.log('Session created with id ' + result.id);

    QB.data.list("object", function(err, result){
      var str = '';
      for (var i=0; i < result.items.length; i++) {
        var item = result.items[result.items.length-i-1];
        str += '<h4>'+item.o_name+'</h4><br>';
        str += '<button class="send_post" data-id="'+item._id+'" type="button">В избранное</button><br>';
        str += item.o_description;
        for (var j = 0; j < item.o_url.length; j++) {
          if (item.o_year) {
            str += '<h5>Год фото ' + item.o_year[j] + '</h5>';
            str += "<img src='" + item.o_url[j] + "' alt=''/>";
          };
        };
      }
      $('#more_object').html(str);
    });
  }
});