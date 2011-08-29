(function(window, location) {
  var oldOnError    = window.onerror || function() {},
      URL           = location.protocol + '//hoptoadapp.com/notifier_api/v2/notices?data=',
      XML_TEMPLATE  = '<?xml version="1.0" encoding="UTF-8"?>'
                      + '<notice version="2.0">'
                      +   '<api-key>API_KEY</api-key>'
                      +   '<notifier>'
                      +     '<name>hoptoad_notifier_js</name>'
                      +     '<version>0.1.0</version>'
                      +     '<url>http://hoptoadapp.com</url>'
                      +   '</notifier>'
                      +   '<error>'
                      +     '<class>Error</class>'
                      +     '<message>EXCEPTION_MESSAGE</message>'
                      +     '<backtrace>BACKTRACE_LINES</backtrace>'
                      +   '</error>'
                      // TODO: Following might not be needed!
                      // +   '<request>'
                      // +     '<url>REQUEST_URL</url>'
                      // +     '<component>REQUEST_COMPONENT</component>'
                      // +     '<action>REQUEST_ACTION</action>'
                      // +   '</request>'
                      +   '<server-environment>'
                      +     '<project-root>PROJECT_ROOT</project-root>'
                      +     '<environment-name>production</environment-name>'
                      +   '</server-environment>'
                      + '</notice>';
  
  function escapeText(text) {
    return text.replace(/[&,<,>,',"]/g, function(match) {
      return "&#" + match.charCodeAt(0) + ";";
    });
  }
  
  function notify(message, file, line) {
    var img = new Image();
    img.src = URL + escape(generateXML(message, file, line));
  }
  
  function generateXML(message, file, line) {
    return XML_TEMPLATE.replace("EXCEPTION_MESSAGE",  message || 'Unknown error.')
                       .replace("BACKTRACE_LINES",    '<line method="" file="' + escapeText(file) + '" number="' + escapeText(number) + '" />')
                       .replace("PROJECT_ROOT",       location.protocol + '//' + location.host);
  }
  
  window.onerror = function() {
    var args = arguments;
    notify.apply(this, args);
    oldOnError.apply(this, args);
  };
  
  window.Hoptoad = {
    setApiKey: function(apiKey) {
      XML_TEMPLATE = XML_TEMPLATE.replace("API_KEY", apiKey);
    },
    notify: notify
  };
})(window, location);