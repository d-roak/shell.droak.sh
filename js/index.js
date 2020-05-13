
var terminal = $('#terminal');
var caret = $('#caret');
var hist = "[root@tripleoak.pt]$ cat intro.txt<br/>\
Hello and welcome to my page!<br/>\
Feel free to explore all the content.<br/>\
Type 'help' to check the commands available.<br/>";
var initLine = "[root@tripleoak.pt]$ ";
var curLine = "";

// caret animation
setInterval(function() {
  caret.toggleClass('transparent');
}, 600);

// initial text
terminal.html(hist + initLine);

// main
$('html').on('keydown', function(e) {
  if(e.key === "Enter") {
    hist += initLine + curLine + "<br/>";
    out = processCommand(curLine);
    hist += out;
    curLine = "";
    terminal.html(hist + initLine);
  } else if(e.key === "Backspace") {
    curLine = curLine.slice(0, -1);
    terminal.html(hist + initLine + curLine);
  } else if(e.key.length === 1 && e.key.match(/[a-z0-9 .-_]/i)) {
    curLine += e.key;
    terminal.html(hist + initLine + curLine);
  }
  caret.removeClass('transparent');
});

function processCommand(command) {
  argv = command.split(" ");
  switch(argv[0]) {
    case "help":
      tmp = "";
      for(var k in help) {
        tmp += k + ((k.length < 8) ? "&#09;&#09;": "&#09;") + help[k] + "<br/>";
      }
      return tmp;
      break;
    case "ls":
      tmp = "";
      for(var k in files) {
        tmp += files[k].permissions + " ";
        tmp += files[k].owner + " ";
        tmp += files[k].size + " ";
        tmp += files[k].datetime + " ";
        tmp += files[k].name + "<br/>";
      }
      return tmp;
      break;
    case "cat":
      return "cat<br/>";
      break;
    case "clear":
      hist = "";
      return "";
      break;
    case "github":
      var win = window.open("https://github.com/jpldcarvalho", '_blank');
      return "";
      break;
    case "linkedin":
      var win = window.open("https://www.linkedin.com/in/jpldcarvalho/", '_blank');
      return "";
      break;
    default:
      return argv[0] + ": command not found<br/>";
  }
}
