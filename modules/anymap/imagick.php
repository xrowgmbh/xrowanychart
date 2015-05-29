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
        
        $extra_caption = "";
        $convert_command = "convert " . $svgFilename . " " . $pngFilename;

        if(strlen($copyright)> 0 && strlen($source)> 0)
        {
            $extra_caption = "caption:'Quelle: $source \n © $copyright'";
        }
        elseif(strlen($copyright)> 0 && !strlen($source)> 0)
        {
            $extra_caption = "caption:'© $copyright'";
        }
        elseif(!strlen($copyright)> 0 && strlen($source)> 0)
        {
            $extra_caption = "caption:'Quelle: $source'";
        }

        if( strlen($extra_caption) > 0 )
        {
            $convert_command = "width=`identify -format %w $svgFilename`; convert -fill darkgrey -gravity West -font Arial -pointsize 11 -size \${width}x40 $extra_caption $svgFilename +swap -gravity south -append $pngFilename";
        }

        shell_exec( $convert_command );

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