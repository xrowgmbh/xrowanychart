<?php

$FunctionList = array();

$FunctionList['getAnymapPath'] = array( 'name' => 'getAnymapPath',
                                        'call_method' => array( 'class' => 'xmlUpdate',
                                                                'method' => 'getAnymapPath' ),
                                                                'parameter_type' => 'standard',
                                                                'parameters' => array( array( 'name' => 'contentobject_id',
                                                                                              'type' => 'integer',
                                                                                              'required' => true ),
                                                                                       array( 'name' => 'anymap_id',
                                                                                              'type' => 'integer',
                                                                                              'required' => true ),
                                                                                       array( 'name' => 'version',
                                                                                              'type' => 'integer',
                                                                                              'required' => true ),
                                                                                       array( 'name' => 'original_filename',
                                                                                              'type' => 'string',
                                                                                              'required' => true ),
                                                                                       array( 'name' => 'xml_filename',
                                                                                              'type' => 'string',
                                                                                              'required' => true ))
                                                               );
