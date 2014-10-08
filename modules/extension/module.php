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

$ViewList['download'] = array( 'functions' => array( 'download' ),
    'script' => 'imagick.php'
);

$FunctionList = array();