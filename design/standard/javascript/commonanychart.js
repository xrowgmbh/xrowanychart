/* AnyChart and AnyMap*/ 
$(document).ready(function(){
    if($(".anychart").length>0)
    {
        $(".anychart").each(function()
        {
            var id = $(this).attr('id');
            var getNode = $(this);
            var path_anychart = $(this).data('xmlfile');
            var width_anychart = $(this).data('width');
            AnyChart.renderingType = anychart.RenderingType.FLASH_PREFERRED;
            var chart = new AnyChart("/extension/xrowanychart/anymap/AnyChart.swf");
            chart.width = width_anychart;
            chart.setXMLFile($.ez.root_url + path_anychart);
            chart.write(id);
       });
    }
});