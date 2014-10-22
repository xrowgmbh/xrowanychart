xrowAnyChart Extension for eZ publish
============================================

Installation
------------
Copy the files and place them under the extension directory in your 
eZ Publish root folder.

To enable this xrowanychart extension you need eZ Publish 4.x or later.
In  site.ini.append.php set the following configuration switches:

[ExtensionSettings]
ActiveExtensions[]=xrowanychart

To use all features you should implement the jquery.fullscreen-min.js as well https://github.com/kayahr/jquery-fullscreen-plugin

Usage
-----
1. Insert additional <div> tags to the Template:
<div id="{concat( 'anychart-', $node.node_id )}" class="anychart" data-width="100%" data-xmlfile={concat( 'anymap/xml/', $ContentObjectID , '/' , $ContentObjectAttributeID , '/', $FileVersion, '/', $AnymapId, '/', $OriginalFilename|urlencode )} ></div>

<div> Tag uses the following parameters : ContentObjectID ,ContentObjectAttributeID,FileVersion,AnymapId,OriginalFilename

2. Maybe you need to add this to the end of the ".htaccess" file:

Rewriterule ^extension/xrowanychart/anymap/AnyChart.swf - [L] 

Known Issues
------------

- Firefox: When the tooltip of a chart opens(mousehover), the text flickers
- Internet Explorer lower than 11: Fullscreen doesnt work at all ( v. jquery.fullscreen 1.1.5)
- Safari PC: Fullscreen looks pretty bad ( v. jquery.fullscreen 1.1.5)
- Safari Ipad: Fullscreen doesnt work at all ( v. jquery.fullscreen 1.1.5)
- The fullscreen mode needs to be improved in general. The size and background color is not that great in chrome for example
- Internet Explorer 11: After leaving the fullscreen mode, we got a scrollbar in our chart.. (whitespace appears?)

WARNING: 
---------

The files below are protected by copyright law. You can buy the licence at http://www.anychart.com/.

1.AnyChart.swf
2.AnyChart.js
3.AnyChartHTML5.js