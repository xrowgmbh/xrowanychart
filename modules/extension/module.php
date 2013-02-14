<?php
$Module = array( 
    "name" => "extension" 
);

$ViewList['xrowanychart'] = array( 
    'script' => 'xrowanychart.php' , 
    'params' => array( 
        'module' , 
        'view' , 
        'ContentObjectID' , 
        'ContentObjectAttributeID' , 
        'VersionName',
        'Version',
        'File',
        'MapName'
    ) 
);
$FunctionList = array();