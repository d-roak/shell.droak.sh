
var terminal = $('#terminal');
var caret = $('#caret');
var hist = "[jpldcarvalho@tripleoak.pt]$ read intro.txt<br/>" + processCommand("read intro.txt");
var hist_cmd = [];
var hist_i = 0;
var initLine = "[jpldcarvalho@tripleoak.pt]$ ";
var curLine = "";

// caret animation
setInterval(function() {
  caret.toggleClass('transparent');
}, 600);

// initial text
terminal.html(hist + initLine);

// disable right click
document.addEventListener('contextmenu', event => event.preventDefault());

// main
$('html').on('keydown', function(e) {
  if(event.ctrlKey && event.shiftKey && event.keyCode==73)
    return false;  //Prevent from ctrl+shift+i
  if(e.key === "Enter") {
    hist += initLine + curLine + "<br/>";
    out = processCommand(curLine);
    hist += out;
    if(curLine !== "") {
      hist_cmd.push(curLine);
      hist_i = hist_cmd.length;
    }
    curLine = "";
    terminal.html(hist + initLine);
  } else if(e.key === "Backspace") {
    e.preventDefault();
    curLine = curLine.slice(0, -1);
    terminal.html(hist + initLine + curLine);
  } else if(e.key.length === 1 && e.key.match(/[a-z0-9 .-_]/i)) {
    curLine += e.key;
    terminal.html(hist + initLine + curLine);
  } else if(e.keyCode === 38) {
    hist_i = (hist_i - 1 < 0) ? 0: hist_i - 1;
    curLine = hist_cmd[hist_i];
    if(curLine === undefined)
      curLine = "";
    terminal.html(hist + initLine + curLine);
  } else if(e.keyCode === 40) {
    hist_i = (hist_i + 1 > hist_cmd.length) ? hist_cmd.length: hist_i + 1;
    curLine = hist_cmd[hist_i];
    if(curLine === undefined)
      curLine = "";
    terminal.html(hist + initLine + curLine);
  }
  caret.removeClass('transparent');
});

function processCommand(command) {
  argv = command.split(" ");
  argc = argv.length;
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
        tmp += files[k].date + " ";
        tmp += files[k].name + "<br/>";
      }
      return tmp;
      break;
    case "read":
      content = files_content[argv[1].replace(/.txt|.pdf/, "")];
      if(content === undefined)
        return "No such file: " + argv[1] + "<br/>";
      else if(content.includes("curriculum")) {
        window.open(content, '_blank');
        return "";
      }
      else
        return content + "<br/>";
      break;
    case "clear":
      hist = "";
      return "";
      break;
    case "contact":
      var a = "joao.carvalho";
      var b = "tripleoak.pt";
      window.location.href = "mailto:" + a + "@" + b;
      return "";
      break;
    case "github":
      window.open("https://github.com/jpldcarvalho", '_blank');
      return "";
      break;
    case "linkedin":
      window.open("https://www.linkedin.com/in/jpldcarvalho/", '_blank');
      return "";
      break;
    case "":
      return "";
      break;
    default:
      return argv[0] + ": command not found<br/>";
  }
}
