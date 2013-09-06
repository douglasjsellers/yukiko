if (phantom.args.length != 4)
{
    console.log('Please invoke as follows: phantomjs screenshot.js <web address> <output file> <browser_width> <browser_height>');
    phantom.exit();
} else
{
    var url = phantom.args[0] ;
    var output_file =  phantom.args[1];
    var browser_width = phantom.args[2];
    var browser_height = phantom.args[3];
}

var fs = require('fs');
var page = new WebPage();
page.onConsoleMessage = function(msg) {
     console.log(msg);
};
page.onResourceRequested = function(resource) {
//    console.log( "Loading: " + resource.url );
};

page.onResourceReceived = function(resource) {
//    console.log( "Received: " + resource.status );
};


page.viewportSize = { top: 0, left: 0, width: browser_width, height: browser_height };
page.loadImages = true;
page.settings = { localToRemoteUrlAccessEnabled: true, loadImages: true, javascriptEnabled: true };
page.open( url,
           function (status)
           {
               console.log( status );
              page.evaluate(function() {
                  document.body.bgColor = 'white';
              });
               window.setTimeout(function ()
                                 {
                                     console.log( page );
                                     page.evaluate( function() { console.log( document.head.innerHTML ); } );
                                     page.render( output_file );
                                     phantom.exit();
                                 }, 5000); 
           } );
