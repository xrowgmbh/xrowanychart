/* AnyChart and AnyMap*/ 
      $(function(){
        if(!FlashDetect.installed){
			if ($("#flashwarning").length > 0) {
				$('#flashwarning').css('display', 'block');
			}else{$('.anychart').append('<div id="flash_warning">Flash Player is not installed or you don’t have the latest version.</div>')}
        }else{
          if($(".anychart").length>0){
            $(".anychart").each(function(){
                var id = $(this).attr('id');
                var getNode = $(this);
                var path_anychart = $(this).data('xmlfile');
                var width_anychart = $(this).data('width');
    
                AnyChart.renderingType = anychart.RenderingType.FLASH_PREFERRED;
                var chart = new AnyChart("/extension/xrowanychart/anymap/AnyChart.swf");
                chart.width = width_anychart;
                //chart.height = 450;
               chart.setXMLFile($.ez.root_url + path_anychart);
               chart.write(id);
            });
          }
        }
    });  