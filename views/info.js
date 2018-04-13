
$.getJSON( "list", function( data ) {
  var insert = "";
  for(var i=0;i<10;i++) {
    $.getJSON("vote?vote="+data.voteringar[i].votering_id, function(data) {

      insert = insert + "<div class=\"subunit\"><div class=\"yesvote\">Yes<br />"
      $.each(data.parti_roster.j, function(key,value) {
        insert=insert+""
      });

    });
  }
});

function getColor(party) {
  if(party="SD") {
    return "#fffc00";
  } else if(party=="V") {
    return "#990000";
  } else if(party=="S") {
    return "#ff0000";
  } else if(party=="KD") {
    return "#001973";
  } else if(party=="MP") {
    return "#009304";
  } else if(party=="L") {
    return "#00e0ff";
  } else if(party=="M") {
    return "#0030ff";
  } else if(party=="C") {
    return "#00ff21";
  } else if(party=="-") {
    return "#454545";
  }
}
