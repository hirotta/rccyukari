(function (){
  window.onload = function(){
    var logarea = document.getElementById("log-area");
    var text_form = document.getElementById("text_form");
    var url_form = document.getElementById("url_form");
    var send_text = document.getElementById("send_text");
    var send_url = document.getElementById("send_url");
    var char_button = document.getElementById("char_button");
    var silent_button = document.getElementById("silent_button");
    var ws = new WebSocket("ws://" + window.location.host + "/ws");

    ws.onopen = function() {
      console.log("connection opened");
    }
    ws.onclose = function() { 
      console.log("connection closed");
    }
    ws.onmessage = function(m) {
      var json = JSON.parse(m.data)
      
      if(json["log"]) {
        getLog(json["log"]);
      } else if (json["youtube"]) {
        getYoutube(json["youtube"]);
      } 
    }

    send_text.onclick = function(){
      send_text.value = ""; 
    }
    char_button.onclick = function() {
      switch (char_button.value) {
        case "ykr":
          value = "ai";
          break;
        case "ai":
          value = "akn";
          break;
        case "akn":
          value = "ykr";
          break;
        default:
          value = "ykr";
          break;
      }
      char_button.value = value;
    }
    text_form.onsubmit = function(){
      text = send_text.value
      if(text=="") return;

      msg = {"msg": text, "char": char_button.value}
      
      ws.send(JSON.stringify(msg))
      send_text.value = "";
      return false;
    }

    send_url.onclick = function(){
      send_url.value = ""; 
    }
    url_form.onsubmit = function(){
      url = send_url.value
      if(url=="") return;

      msg = {"url": url}
      
      ws.send(JSON.stringify(msg))
      send_url.value = "";
      return false;
    }
    
    silent_button.onclick = function(){
      ws.send(JSON.stringify({"silent": true}));
    }
    
    function getLog(data) {
      var li = document.createElement("li");
      li.textContent = parseJson(data);
      logarea.insertBefore(li, logarea.firstChild);
    }
    function parseJson(json) {
      time = json['time'].replace(/\-/g, "/");
      return time+": "+json['text'];
    }

    function getYoutube(title) {
      field = document.getElementById("youtube_title")
      field.innerHTML = title;
    }
  }
})();
