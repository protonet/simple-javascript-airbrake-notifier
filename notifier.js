(function(window, location) {
  var oldOnError    = window.onerror || function() {},
      URL           = location.protocol + "//hoptoadapp.com/notifier_api/v2/notices?data=",
      XML_TEMPLATE  = '<?xml version="1.0" encoding="UTF-8"?>'
                      + '<notice version="2.0">'
                      +   '<api-key>#{API_KEY}</api-key>'
                      +   '<notifier>'
                      +     '<name>hoptoad_notifier_js</name>'
                      +     '<version>0.1.0</version>'
                      +     '<url>http://hoptoadapp.com</url>'
                      +   '</notifier>'
                      +   '<error>'
                      +     '<class>Error</class>'
                      +     '<message>#{EXCEPTION_MESSAGE}</message>'
                      +     '<backtrace>#{BACKTRACE_LINES}</backtrace>'
                      +   '</error>'
                      +   '<request>'
                      +     '<component>frontend</component>'
                      +     '<action>javascript</action>'
                      +     '<url>#{REQUEST_URL}</url>'
                      +     '<cgi-data>'
                      +       '<var key="HTTP_USER_AGENT">#{USER_AGENT}</var>'
                      +       '<var key="HTTP_REFERER">#{REFERER}</var>'
                      +     '</cgi-data>'
                      +   '</request>'
                      +   '<server-environment>'
                      +     '<project-root>#{PROJECT_ROOT}</project-root>'
                      +     '<environment-name>production</environment-name>'
                      +   '</server-environment>'
                      + '</notice>';
  
  function escapeText(text) {
    return (text + "").replace(/[&,<,>,',"]/g, function(match) {
      return "&#" + match.charCodeAt(0) + ";";
    });
  }
  
  function getXML(message, file, line) {
    var apiKey = window.AIRBRAKE_API_KEY;
    if (!apiKey) {
      return;
    }
    file = file.replace(location.protocol + "//" + location.host, "[PROJECT ROOT]");
    return XML_TEMPLATE.replace("#{API_KEY}",            apiKey)
                       .replace("#{EXCEPTION_MESSAGE}",  message || "Unknown error.")
                       .replace("#{REQUEST_URL}",        location.href)
                       .replace("#{USER_AGENT}",         navigator.userAgent)
                       .replace("#{REFERER}",            document.referrer)
                       .replace("#{PROJECT_ROOT}",       location.protocol + "//" + location.host)
                       .replace("#{BACKTRACE_LINES}",    '<line method="" file="' + escapeText(file) + '" number="' + escapeText(line) + '" />');
  }
  
  function notify(message, file, line) {
    new Image().src = URL + escape(getXML(message, file, line));
  }
  
  window.onerror = function() {
    var args = arguments;
    notify.apply(this, args);
    oldOnError.apply(this, args);
  };
  
  window.Airbrake = {
    notify: notify
  };
})(window, location);