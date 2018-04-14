var insert = "";
$.getJSON( "192.168.56.255:3000/list", function( datalist ) {
  for(var i=0;i<10;i++) {
    $.getJSON("192.168.56.255:3000/vote?vote="+datalist.voteringar[i].votering_id, function(data) {
      var totalvotes=0;
      var title="Unknown law";
      var activevotes;
      if (datalist.votering[i].hasOwnProperty('title')) {
        totalvotes=datalist.title;
      }
      insert = insert.concat("<div class=\"subunit\"><h4>" + title + " </h4><div class=\"yesvote\">Yes<br />");
      $.each(data.parti_roster.j, function(key,value) {
        totalvotes+=value;
        activevotes+=value/10;
        insert=insert.concat("<div class=\"partycell\" style=\"background-color:" + getColor(key) + ";width:" + value/10 + "vw;height:1vw\">" + key + "</div>");
      });
      insert = insert.concat("</div>");
      insert = insert.concat("<div class=\"novote\">No<br />");
      $.each(data.parti_roster.n, function(key,value) {
        totalvotes+=value;
        activevotes+=value/10;
        insert=insert.concat("<div class=\"partycell\" style=\"background-color:" + getColor(key) + ";width:" + value/10 + "vw;height:1vw\">" + key + "</div>");
      });
      insert = insert.concat("</div>");
      if (data.parti_roster.hasOwnProperty('total_f')) {
        totalvotes+=data.parti_roster.total_f;
      }
      if (data.parti_roster.hasOwnProperty('total_a')) {
        totalvotes+=data.parti_roster.total_a;
      }
      activevotes=(349-activevotes)/10;
      insert = insert.concat("<div class=\"neutralvote\" style=\"width:"+ activevotes + "vw;\">Novote<br />");
      insert=insert.concat("<div class=\"partycell\" style=\"background-color:" + getColor("-") + ";width:" + (data.parti_roster.total_f+data.parti_roster.total_a)/10 + "vw;height:1vw\">" + "-" + "</div>");
      insert = insert.concat("</div><br/><br><br></div>");
      console.log(insert);
      document.getElementById("votes").innerHTML = insert;
    });
  }
});

function getColor(party) {
  if(party=="SD") {
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
