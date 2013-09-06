if (phantom.args.length != 5)
{
    console.log('Please invoke as follows: phantomjs screenshot.js <input file> <output file> <full_domain_path> <browser_width> <browser_height>');
    phantom.exit();
} else
{
    var  input_file = phantom.args[0] ;
    var output_file =  phantom.args[1];
    var full_domain_path = phantom.args[2];
    var browser_width = phantom.args[3];
    var browser_height = phantom.args[4];
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
var absolute_path = input_file.substring( 0, input_file.lastIndexOf( "/" ) + 1);
page.loadImages = true;
page.settings = { localToRemoteUrlAccessEnabled: true, loadImages: true, javascriptEnabled: true };
page.open( "file://" + input_file,
           function (status)
           {
               console.log( status );

               // Crazy hack (suggested in the phantomjs forums) to pass variables into the page.evaluate context
               eval('function setVariable(){ window.full_domain_path = "' + full_domain_path + '"; window.absolute_path = "' + absolute_path + '";}')
               page.evaluate( setVariable );
              
              page.evaluate(function() {
                  document.body.bgColor = 'white';
              });
               page.evaluate( function() 
                              {
                                  strip_extraneous_ending_from_path = function( path )
                                  {

                                      if( path.lastIndexOf( "?" ) > 0 )
                                      {
                                          path = path.substring( 0, path.lastIndexOf( "?" ) );
                                      }

                                      if( path.lastIndexOf( "#") > 0 )
                                      {
                                          path = path.substring( 0, path.lastIndexOf( "#" ) );
                                      }

                                      if( path.lastIndexOf( "/" ) == path.length - 1 )
                                      {
                                          path = path.substring( 0, path.length - 1 );
                                      }
                                         
                                      return path;
                                  }

                                  isFile = function( path )
                                  {
                                      return path.indexOf( "file://" ) == 0;
                                  }

                                  removeFile = function( path )
                                  {
                                      return path.replace( "file://", "" ).replace( absolute_path, '' );
                                  }

                                  appendPath = function( path, domain, full_path )
                                  {
                                      if( path.charAt( 0 ) == "/" )
                                      {
                                          return domain + path;
                                      } else
                                      {
                                          return full_path + "/" + path;
                                      }
                                  }

                                  find_absolute_path = function( domain )
                                  {
                                      if( domain.indexOf( "/", 8 ) > 0 )
                                      {
                                          return domain.substring( 0, domain.indexOf( "/", 8 ) );
                                      } else
                                      {
                                          return domain;
                                      }
                                  }
                                  
                                  full_domain_path = strip_extraneous_ending_from_path( full_domain_path );
                                  console.log( full_domain_path );
                                  
                              });
               window.setTimeout(function ()
                                 {
                                     page.evaluate( function() { console.log( document.head.innerHTML ); } );
                                     page.render( output_file );
                                     phantom.exit();
                                 }, 5000);
           } );
