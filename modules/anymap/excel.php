<?php

$Module = $Params['Module'];
if ( !isset ( $_POST['htmlString'] ) )
{
	eZDebug::writeError( 'No table specified' );
	return $Module->handleError( eZError::KERNEL_NOT_AVAILABLE, 'kernel' );
}

$string = '<?xml version="1.0"?>' . "\n" . $_POST['htmlString'];
$string = str_replace('&nbsp;',"",$string);


$xml = new SimpleXMLElement($string);

// Create new PHPExcel object
$objPHPExcel = new PHPExcel();
// Set document properties
$objPHPExcel->getProperties()->setCreator("Maarten Balliauw")
->setLastModifiedBy("Maarten Balliauw")
->setTitle("Office 2007 XLSX Test Document")
->setSubject("Office 2007 XLSX Test Document")
->setDescription("Test document for Office 2007 XLSX, generated using PHP classes.")
->setKeywords("office 2007 openxml php")
->setCategory("Test result file");
// Add some data

$simplexmlarray = $xml->xpath('//tr');

$row = 0;
foreach( $simplexmlarray as $key=>$array )
{
 $col = 0;
 $row = $row+1;
 foreach ($array as $key=>$value){
 	$objPHPExcel->setActiveSheetIndex(0)
 	->setCellValueByColumnAndRow( $col ,$row  , "" . $value);
    $col = $col+1;
 }
}

// Resize Columns
$sheet = $objPHPExcel->getActiveSheet();
$cellIterator = $sheet->getRowIterator()->current()->getCellIterator();
$cellIterator->setIterateOnlyExistingCells( true );
/** @var PHPExcel_Cell $cell */
foreach( $cellIterator as $cell ) {
 	$sheet->getColumnDimension( $cell->getColumn() )->setAutoSize( true );
}
// Rename worksheet
$objPHPExcel->getActiveSheet()->setTitle('Diagramm');
// Set active sheet index to the first sheet, so Excel opens this as the first sheet
$objPHPExcel->setActiveSheetIndex(0);
// Redirect output to a client’s web browser (Excel2007)
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment;filename="diagram.xlsx"');

header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT'); // always modified

$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
$objWriter->save('php://output');

eZExecution::cleanExit();