<?php
$Module = array( 
    "name" => "anymap" 
);

$ViewList['xml'] = array( 
    'default_navigation_part' => 'ezcontentnavigationpart' , 
    'script' => 'xml.php' , 
    'params' => array( 
        'ContentObjectID' , 
        'ContentObjectAttributeID' , 
        'Version',
        'MapID',
        'MapName'
    ) 
);

$ViewList["maps"] = array( 
    'default_navigation_part' => 'ezcontentnavigationpart' , 
    'script' => 'download.php' , 
    'params' => array( 
        'ContentObjectID' , 
        'ContentObjectAttributeID' , 
        'Version',
        'MapID',
        'MapName'
    ) 
);

$ViewList['download'] = array( 'functions' => array( 'download' ),
		'script' => 'imagick.php'
);
$ViewList['excel'] = array( 'functions' => array( 'excel' ),
		'script' => 'excel.php'
);
$FunctionList = array();