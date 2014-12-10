<?php 
$UID = uniqid();
$svgData = $_POST['svg'];
$copyright = trim(preg_replace('/\s\s+/', ' ', $_POST['copyright']));
$source = trim(preg_replace('/\s\s+/', ' ', $_POST['source']));
try{
    if ((strpos($svgData,'<svg') && strpos($svgData,'</def') ) !== false)
    {
        $picturesFilepath = eZSys::cacheDirectory()."/tmpDownload"; // --> ezpublish chache pfad
        $svgFilename = $picturesFilepath.$UID.".svg";
        $pngFilename = $picturesFilepath.$UID.".png";
        $file=$pngFilename;
        
        file_put_contents($svgFilename,$svgData);// write required data to SVG file

        if(strlen($copyright)> 0 && strlen($source)> 0)
        {
            shell_exec("convert -splice 0x32 -gravity SouthEast -font Arial -pointsize 11 -fill darkgrey -annotate +4+4 'Quelle: " . $source . "\n© ".$copyright."' ".$svgFilename." ".$pngFilename);
        }
        elseif(strlen($copyright)> 0 && !strlen($source)> 0)
        {
            shell_exec("convert -splice 0x22 -gravity SouthEast -font Arial -pointsize 11 -fill darkgrey -annotate +4+4 '© ".$copyright."' ".$svgFilename." ".$pngFilename);
        }
        elseif(!strlen($copyright)> 0 && strlen($source)> 0)
        {
            shell_exec("convert -splice 0x22 -gravity SouthEast -font Arial -pointsize 11 -fill darkgrey -annotate +4+4 'Quelle: ".$source."' ".$svgFilename." ".$pngFilename);
        }
        else 
        {
            shell_exec("convert ".$svgFilename." ".$pngFilename);
        }

        unlink($svgFilename); // delete SVG
        
        header('Content-Description: File Transfer');
        header('Content-Type: image/png'); // set MIME Type to PNG
        header('Content-Disposition: attachment; filename=chart_'.$UID);
        header('Content-Transfer-Encoding: binary');
        header('Expires: 0');
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Pragma: public');
        header('Content-Length: ' . filesize($file));
        ob_clean();
        flush();
        readfile($file); // return PNG
        unlink($file); // delete PNG
        eZExecution::cleanExit(); // --> ezpublish exit
    }
    else
    {
        throw new Exception("No valid SVG !");
    }
}
catch (Exception $e) 
{
    echo $e->getMessage();
    eZExecution::cleanExit(); // --> ezpublish exit
}