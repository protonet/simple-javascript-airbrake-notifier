(function(window, location) {
  var root          = location.protocol + "//" + location.host,
      apiKey        = window.AIRBRAKE_API_KEY,
      oldOnError    = window.onerror || function() {},
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
    file = file.replace(root, "[PROJECT ROOT]");
    var mapping = {
      API_KEY:            apiKey,
      EXCEPTION_MESSAGE:  message,
      REQUEST_URL:        location.href,
      USER_AGENT:         navigator.userAgent,
      REFERER:            document.referrer,
      PROJECT_ROOT:       root,
      BACKTRACE_LINES:    '<line method="" file="' + escapeText(file) + '" number="' + escapeText(line) + '" />'
    };
    
    return XML_TEMPLATE.replace(/#{(.+?)}/g, function(match, $1) {
      return mapping[$1];
    });
  }
  
  function notify(message, file, line) {
    if (apiKey) {
      new Image().src = URL + escape(getXML(message, file, line));
    }
  }
  
  window.onerror = function() {
    var args = arguments;
    notify.apply(this, args);
    oldOnError.apply(this, args);
  };
  
  window.Airbrake = {
    notify: notify
  };
})(this, location);