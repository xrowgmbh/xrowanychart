<?php

$module = $Params['Module'];
$moduleName = $Params['module'];
$moduleView = $Params['view'];
$contentObjectID = $Params['ContentObjectID'];
$contentObjectAttributeID = $Params['ContentObjectAttributeID'];
$VersionName = $Params['VersionName'];
$Version = $Params['Version'];
$File = $Params['File'];
$MapName = $Params['MapName'];
$url = $moduleName . '/' . $moduleView . '/' . $contentObjectID . '/' . $contentObjectAttributeID . '/' . $VersionName . '/' . $Version . '/' . $File . '/' . $MapName;

return $module->redirectTo( $url );