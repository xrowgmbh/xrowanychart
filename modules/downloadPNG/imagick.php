<?php 
$UID = uniqid();
$svgData = $_POST['svg'];

if ((strpos($svgData,'<svg') && strpos($svgData,'</def') ) !== false) {
// ."/tmpDownload";
$picturesFilepath = eZSys::cacheDirectory(); // --> ezpublish chache pfad
$svgFilename = $picturesFilepath.$UID.".svg";
$pngFilename = $picturesFilepath.$UID.".png";
$file=$pngFilename;

file_put_contents($svgFilename,$svgData);// write required data to SVG file
shell_exec("convert ".$svgFilename." ".$pngFilename); // convert to PNG
unlink($svgFilename); // delete SVG

header('Content-Description: File Transfer');
header('Content-Type: image/png'); // set MIME Type to PNG
header('Content-Disposition: attachment; filename=chart_'.$UID); //Filename without path
header('Content-Transfer-Encoding: binary');
header('Expires: 0');
header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
header('Pragma: public');
header('Content-Length: ' . filesize($file));
ob_clean();
flush();
readfile($file); // return PNG
unlink($file); // delete PNG
exit; // --> ezpublish exit
}
else
{
    echo "No valid SVG"; // --> exception die
}