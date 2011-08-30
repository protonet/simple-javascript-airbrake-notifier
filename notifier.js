(function(window, location, undef) {
  var root   = location.protocol + "//" + location.host,
      apiKey = window.AIRBRAKE_API_KEY;
  
  function xmlNode(nodeName, attributes, nodeValue) {
    attributes = attributes ? " " + attributes : "";
    return "<" + nodeName + attributes +  ">" + nodeValue + "</" + nodeName + ">";
  }
  
  function escapeText(text) {
    return (text + "").replace(/[&<>'"]/g, function(match) {
      return "&#" + match.charCodeAt() + ";";
    });
  }
  
  function getXML(message, file, line) {
    file = file.replace(root, "[PROJECT ROOT]");
    return '<?xml version="1.0" encoding="UTF-8"?>' +
            xmlNode("notice", 'version="2.0"',
              xmlNode("api-key",  undef, apiKey) +
              xmlNode("notifier", undef,
                xmlNode("name",     undef, "hoptoad_notifier_js")   +
                xmlNode("version",  undef, "0.1.0")                 +
                xmlNode("url",      undef, "http://hoptoadapp.com")
              ) +
              xmlNode("error",    undef, 
                xmlNode("class",      undef, "Error")    +
                xmlNode("message",    undef, escapeText(message))    +
                xmlNode("backtrace",  undef, '<line method="" file="' + escapeText(file) + '" number="' + escapeText(line) + '" />')
              ) +
              xmlNode("request",  undef,
                xmlNode("component",  undef, "frontend")    +
                xmlNode("action",     undef, "javascript")  +
                xmlNode("url",        undef, location.href) +
                xmlNode("cgi-data",   undef, 
                  xmlNode("var", 'key="HTTP_USER_AGENT"', navigator.userAgent) +
                  xmlNode("var", 'key="HTTP_REFERER"',    document.referrer)
                )
              ) +
              xmlNode("server-environment", undef,
                xmlNode("project-root",     undef, root) +
                xmlNode("environment-name", undef, "production")
              )
            );
  }
  
  window.onerror = (window.Airbrake = {}).notify = function(message, file, line) {
    if (apiKey) {
      new Image().src = "//hoptoadapp.com/notifier_api/v2/notices?data=" + escape(getXML(message, file, line));
    }
  };
})(this, location);