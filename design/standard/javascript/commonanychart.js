/* AnyChart and AnyMap*/ 
$(document).ready(function(){
    if($(".anychart").length>0)
    {
        $(".anychart").each(function()
        {
            var id = $(this).attr('id');
            var getNode = $(this);
            var path_anychart = $(this).data('xmlfile');
            
            AnyChart.renderingType = anychart.RenderingType.FLASH_PREFERRED;
            AnyChart.renderingType = anychart.RenderingType.SVG_ONLY;
            var chart = new AnyChart();
            var width_anychart = "";
            var height_anychart = "";
            $.ajax({
                type: "GET",
                async: false,
                url: $.ez.root_url + path_anychart,
                success: function(data){
                  xmlDoc=data;
                }
              });
            for(var i = 0; i < xmlDoc.children[0].attributes.length; i++)
            {
                if(xmlDoc.children[0].attributes[i].name == "width")
                {
                    width_anychart = xmlDoc.children[0].attributes[i].nodeValue;
                }
                
                if(xmlDoc.children[0].attributes[i].name == "height")
                {
                    height_anychart = xmlDoc.children[0].attributes[i].nodeValue;
                }
            }
            chart.width = "100%";
            chart.height = "100%";
            chart.setXMLFile($.ez.root_url + path_anychart);
            var chartContainerID = "#" + id + "_svg";
            $(chartContainerID).css("height",height_anychart);
            $(chartContainerID).css("width",width_anychart);
            chart.write(id + "_svg");
       });
    }
    
    $(document).bind("fullscreenchange", function() {
        if($(document).fullScreen() == false)
        {
            $(this).find(".tablePopup").css("visibility","hidden");
            $(this).find(".tablePopup").html("");
        }
    });
    
    $(".htmltableclass").click(function() {
            
            var xmlFile = $.ez.root_url + $(this).parent().parent().data('xmlfile');
            var div = "#" + $(this).parent().parent().attr('id');
            createTable(xmlFile,div);
            $(this).parent().parent().children(".tablePopup").fullScreen(true);
            $(this).parent().parent().find(".tablePopup").css("visibility","visible");
    });
    
    $(".myButtonIncrease").click(function() {
        $(this).parent().parent().children(".anychart_attr").find(".svgChart").fullScreen(true);
    });
    
    $( ".myButtonDownload" ).click(function() 
    {   
        var SVGwidth = $(this).parent().parent().parent().children(".anychart_attr").find(".svgChart").css("width");
        var SVGheight = $(this).parent().parent().parent().children(".anychart_attr").find(".svgChart").css("height");
        var SVGhtml = $(this).parent().parent().parent().children(".anychart_attr").find(".svgChart").find("svg").html();
        var SVGstring = "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg width=\"" + SVGwidth +"\" height=\"" + SVGheight + "\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">" + SVGhtml +"</svg>";
        SVGstring = SVGstring.replace(/#ac_/g, "Xac_"); // replace invalid '#' characters
        
        $(this).prev().attr("value",SVGstring);
    });
    
    createTable = function(xml,div) 
    {
    
    var xmlData = []; /* The Informations from the XML-file are stored here */
    var seriesIndex = 0;
    var tableString = "";
    $.get(xml, function(XML)
    {   
        /* For every found "series" Tag execute this: */
        $(XML).find("series").each(function()
        {
            var $tagData = $(this);
            sname = $tagData.attr("name"); /* read the name of the "series" tag and save it in sname */
            seriesChildren = $tagData.children(); /* get the children elements for the "series" tag */ 
            xmlData[xmlData.length] = { seriesname:sname, pointname:[], values:[]}; /* fill xmlData with the series name */
            
            /* for every child element of the "series" tag execute: */
            for(var i = 0; i < seriesChildren.length; i++)
            {
            
                /* for every attribute of "point" execute: */
                for(var x = 0; x < seriesChildren[i].attributes.length; x++)
                {
                    /* if attribute x nodename = "name", hence the xml-attribute "name" was found   */
                    /* then save the value in xmlData                                                   */
                    if(seriesChildren[i].attributes[x].nodeName == "name")
                    {
                        xmlData[seriesIndex].pointname[i] = seriesChildren[i].attributes[x]; //name
                    }
                    /* if attribute y nodename = "y", hence the xml-attribute "y" was found */
                    /* then save the value in xmlData                                                   */
                    if(seriesChildren[i].attributes[x].nodeName == "y")
                    {
                        xmlData[seriesIndex].values[i] = seriesChildren[i].attributes[x]; //value
                    }
                }
            }
            /* increment seriesIndex                */
            /* to loop throught the next series     */
            seriesIndex++;
        });     
        
        tableString = "<table class=\"gridtable\"><tr><th></th>";  
        /* execute for every series and build the table headers*/
        for(var i = 0; i < xmlData[0].pointname.length; i++)    
        {
        
            tableString += "<th>" + xmlData[0].pointname[i].nodeValue + "</th>";    
        }

        //tableString += "</tr><tr>";
        
        /* execute for the number of points */
        for(var a = 0; a < xmlData.length; a++) 
        {   
            tableString += "<tr><td>" + xmlData[a].seriesname + "</td>";
            
            /* execute for the number of series */
            for(var i = 0; i < xmlData[0].pointname.length; i++)
            {
                tableString += "<td>" + xmlData[a].values[i].nodeValue + "</td>";
            }   
            tableString += "</tr>";
        }
        tableString += "</tr></table>";

        $(div).find(".tablePopup").html(tableString);
        
    });

};

    
    
    
});