<?php
$Module = $Params['Module'];
if (! isset($_POST['htmlString'])) {
    eZDebug::writeError('No table specified');
    return $Module->handleError(eZError::KERNEL_NOT_AVAILABLE, 'kernel');
}
$string = '<?xml version="1.0"?>' . "\n" . $_POST['htmlString'];
$string = str_replace('&nbsp;', " ", $string);

$xml = new SimpleXMLElement($string);

// Create new PHPExcel object
$objPHPExcel = new PHPExcel();
// Set document properties
$objPHPExcel->getProperties()
    ->setCreator("Diagramm")
    ->setLastModifiedBy("Diagramm Excel Generator")
    ->setTitle("Diagramm");

// Add some data
$simplexmlarray = $xml->xpath('//tr');

// var_dump($simplexmlarray);

// set from header
if (isset($_POST['title'])) {
    $objPHPExcel->setActiveSheetIndex(0)->setCellValueByColumnAndRow(0,1, $_POST['title'] );
}
$row = 1;
foreach ($simplexmlarray as $key => $array) {
    $col = 0;
    $row = $row + 1;
    foreach ($array as $key => $value) {
        $objPHPExcel->setActiveSheetIndex(0)->setCellValueByColumnAndRow($col, $row, "" . $value);
        $col = $col + 1;
    }
}

// set from source 
if (isset($_POST['copyright'])) {
    $objPHPExcel->setActiveSheetIndex(0)->setCellValueByColumnAndRow(0, $row+1, $_POST['copyright']);
}
if (isset($_POST['source'])) {
    $objPHPExcel->setActiveSheetIndex(0)->setCellValueByColumnAndRow(0, $row+2, $_POST['source']);
}

// Resize Columns
$sheet = $objPHPExcel->getActiveSheet();
$cellIterator = $sheet->getRowIterator()
    ->current()
    ->getCellIterator();
$cellIterator->setIterateOnlyExistingCells(true);
/**
 * @var PHPExcel_Cell $cell
 */
foreach ($cellIterator as $cell) {
    $sheet->getColumnDimension($cell->getColumn())
        ->setAutoSize(true);
}
// Rename worksheet
$objPHPExcel->getActiveSheet()->setTitle('Diagramm');
// Set active sheet index to the first sheet, so Excel opens this as the first sheet
$objPHPExcel->setActiveSheetIndex(0);
// Redirect output to a client’s web browser (Excel2007)
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment;filename="diagram.xlsx"');

header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // always modified

$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
$objWriter->save('php://output');

eZExecution::cleanExit();