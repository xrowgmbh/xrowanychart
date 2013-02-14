XrowAnyChart Extension for eZ publish
============================================

Installation
------------
Copy the files and place them under the extension directory in your 
eZ publish root folder.

To enable this xrowanychart extension you need eZ publish 3.6 or later. In 
site.ini.append.php set the following configuration switches:

[ExtensionSettings]
ActiveExtensions[]=xrowanychart

Usage
-----
1. Insert additional <div> tags to the Template:
<div id="{concat( 'anychart-', $node.node_id )}" class="anychart" data-width="100%" data-xmlfile={concat( 'anymap/xml/', $ContentObjectID , '/' , $ContentObjectAttributeID , '/', $FileVersion, '/', $AnymapId, '/', $OriginalFilename|urlencode )} ></div>

<div> Tag uses the following parameters : ContentObjectID ,ContentObjectAttributeID,FileVersion,AnymapId,OriginalFilename

2. Maybe you need to add this to the end of the ".htaccess" file:

Rewriterule ^extension/xrowanychart/anymap/AnyChart.swf - [L] 

WARNING: 
-----
1.AnyChart.swf
2.AnyChart.js
3.AnyChartHTML5.js

The above files are protected by copyright law.
Please respect the copyright. 
Buy official version: http://www.anychart.com/buy/

