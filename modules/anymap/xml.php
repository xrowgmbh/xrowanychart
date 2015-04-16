<?php
/**
 * @copyright Copyright (C) 1999-2011 eZ Systems AS. All rights reserved.
 * @license http://ez.no/eZPublish/Licenses/eZ-Business-Use-License-Agreement-eZ-BUL-Version-2.0 eZ Business Use License Agreement Version 2.0
 * @version 4.6.0
 * @package kernel
 */

$contentObjectID = $Params['ContentObjectID'];
$contentObjectAttributeID = $Params['ContentObjectAttributeID'];
$contentObject = eZContentObject::fetch( $contentObjectID );
$Module = $Params['Module'];

if ( !is_object( $contentObject ) )
{
    return $Module->handleError( eZError::KERNEL_NOT_AVAILABLE, 'kernel' );
}
$currentVersion = $contentObject->attribute( 'current_version' );

if ( isset(  $Params['Version'] ) && is_numeric( $Params['Version'] ) )
     $version = $Params['Version'];
else
     $version = $currentVersion;

$contentObjectAttribute = eZContentObjectAttribute::fetch( $contentObjectAttributeID, $version, true );
if ( !is_object( $contentObjectAttribute ) )
{
    return $Module->handleError( eZError::KERNEL_NOT_AVAILABLE, 'kernel' );
}
$contentObjectIDAttr = $contentObjectAttribute->attribute( 'contentobject_id' );
if ( $contentObjectID != $contentObjectIDAttr or !$contentObject->attribute( 'can_read' ) )
{
    return $Module->handleError( eZError::KERNEL_ACCESS_DENIED, 'kernel' );
}

// Get locations.
$nodeAssignments = $contentObject->attribute( 'assigned_nodes' );
if ( count( $nodeAssignments ) === 0 )
{
    // oops, no locations. probably it's related object. Let's check his owners
    $ownerList = eZContentObject::fetch( $contentObjectID )->reverseRelatedObjectList( false, false, false, false );
    foreach ( $ownerList as $owner )
    {
        if ( is_object( $owner ) )
        {
            $ownerNodeAssignments = $owner->attribute( 'assigned_nodes' );
            $nodeAssignments = array_merge( $nodeAssignments, $ownerNodeAssignments );
        }
    }
}

// If exists location that current user has access to and location is visible.
$canAccess = false;
foreach ( $nodeAssignments as $nodeAssignment )
{
    if ( ( eZContentObjectTreeNode::showInvisibleNodes() || !$nodeAssignment->attribute( 'is_invisible' ) ) and $nodeAssignment->canRead() )
    {
        $canAccess = true;
        break;
    }
}
if ( !$canAccess )
    return $Module->handleError( eZError::KERNEL_NOT_AVAILABLE, 'kernel' );

// If $version is not current version (published)
// we should check permission versionRead for the $version.
if ( $version != $currentVersion )
{
    $versionObj = eZContentObjectVersion::fetchVersion( $version, $contentObjectID );
    if ( is_object( $versionObj ) and !$versionObj->canVersionRead() )
        return $Module->handleError( eZError::KERNEL_NOT_AVAILABLE, 'kernel' );
}

$fileHandler = eZBinaryFileHandler::instance();

if ( $contentObjectAttribute->hasContent() )
{
    $info = $contentObjectAttribute->storedFileInformation();
    $file = eZClusterFileHandler::instance($info['filepath']);
    $file->fetch();
    $dom=new DOMDocument('1.0');

    if( $dom->load( $info['filepath'] ) === false)
    {
        $xml_string = file_get_contents($info['filepath']);
        $xml_string =  mb_convert_encoding( $xml_string, 'UTF-8');
        if( $dom->loadXML( $xml_string ) === false)
        {
            if (strlen($xml_string) == 0)
            {
                //fallback to solve the error
                $dom->loadXML( '<?xml version="1.0" encoding="UTF-8"?><anychart />' );
                eZDebug::writeError( "The xml file is empty." );
            }
            else
            {
                //unknown error
                eZDebug::writeError( "The xml file could not be load." );
                return $Module->handleError( eZError::KERNEL_NOT_AVAILABLE, 'kernel' );
            }
        }
    }

    if( $Params['MapName'] != '' )
    {
        $anymap_path = $contentObjectID.'/'. $Params['MapID'] .'/Version/'.$currentVersion.'/file/'.$Params['MapName'];
        $record = $dom->getElementsByTagName( 'map_series' );
        $record->item(0)->setAttribute( 'source', $anymap_path );
    }
    $content = $dom->saveXML();

    $lastModified = gmdate( 'D, d M Y H:i:s', $file->mtime() ) . ' GMT';

    if( isset( $_SERVER['HTTP_IF_MODIFIED_SINCE'] ) )
    {
        $ifModifiedSince = $_SERVER['HTTP_IF_MODIFIED_SINCE'];

        // Internet Explorer specific
        $pos = strpos($ifModifiedSince,';');
        if ( $pos !== false )
            $ifModifiedSince = substr( $ifModifiedSince, 0, $pos );

        if( strcmp( $lastModified, $ifModifiedSince ) == 0 )
        {
            header( 'HTTP/1.1 304 Not Modified' );
            header( 'Last-Modified: ' . $lastModified );
            header( 'X-Powered-By: eZ Publish' );
            eZExecution::cleanExit();
        }
     }

    // Set header settings
    $httpCharset = eZTextCodec::httpCharset();
    header( 'Last-Modified: ' . $lastModified );
    header( 'Content-Type: application/xml; charset=' . $httpCharset );
    header( 'Content-Length: ' . strlen( $content ) );
    header( 'X-Powered-By: eZ Publish' );

    for ( $i = 0, $obLevel = ob_get_level(); $i < $obLevel; ++$i )
    {
        ob_end_clean();
    }

    echo (string)$content;
    eZExecution::cleanExit();
}
else 
{
    eZDebug::writeError( "The specified file could not be found." );
    return $Module->handleError( eZError::KERNEL_NOT_AVAILABLE, 'kernel' );
}