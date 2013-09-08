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
var number_of_resources_requested = 0;
var number_of_resources_failed = 0;

page.onResourceRequested = function(resource) 
{
    number_of_resources_requested += 1;
};

page.onResourceReceived = function(resource) 
{
//    console.log( "Received: " + resource.status );
};

page.onResourceError = function(resourceError) 
{
    number_of_resources_failed += 1;
}

page.onLoadFinished = function(status) 
{
    console.log( "Resource requested count: " + number_of_resources_requested );
    console.log( "Resource failed count: " + number_of_resources_failed );

    // if more than 25% of the resources failed to load it is probably a local request
    // so let's not bother generating the screenshot
    if( number_of_resources_requested > 0 )
    {
        if( (number_of_resources_failed / number_of_resources_requested ) > 0.25 )
        {
            phantom.exit();
        }
    }

    try
    {
        page.render( output_file );
    } catch( err )
    {
    }

    phantom.exit();
}

page.viewportSize = { top: 0, left: 0, width: browser_width, height: browser_height };
page.loadImages = true;
page.settings = { localToRemoteUrlAccessEnabled: true, loadImages: true, javascriptEnabled: true };

page.open( url,
           function (status)
           {
               page.evaluate(function() 
                             {
                                 document.body.bgColor = 'white';
                             });
           } );

// if it takes more than 60 seconds then exit
window.setTimeout( function () { phantom.exit(); }, 60000 );
