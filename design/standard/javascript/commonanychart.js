/* AnyChart and AnyMap*/ 
$(document).ready(function()
{
    if($(".diagram").length>0)
    { 
	    $(window).resize(function(){
            set_popup_position();
        });
        $(".diagram").each(function()
        {
            AnyChart.renderingType = anychart.RenderingType.SVG_ONLY;
            var chart = new AnyChart();
            chart.width = "100%";
            chart.height = "100%";

            chart.setData(buildXML($(this)));

            $(this).next().find(".anychart-svgChart").attr("id","anychart-" + Math.floor((Math.random() * 100000) + 1));
            chart.write($(this).next().find(".anychart-svgChart").attr("id"));

            $(this).next().find(".anychart-svgButtons").css("width",$(this).parent().css("width"));
            $(this).next().find(".anychart-attr").css("height",$(this).attr("data-diagram-height"));
            $(this).next().find(".anychart-attr").css("width",$(this).parent().css("width"));
            $(this).remove();
        });
    }

    function getChartDataAsJSON ( data )
    {
        var chartData = chartData = {series: [{ name:"", points: []}]};
        var z = 0;
        var dataLength = data.context.children.length - 1;
        if(data.children().children("tr").eq(0).children("th").size() == 1 ) //vertical chart
        {
            chartData.series[0].name = "Series";
            data.find("th").each(function()
            {
                chartData.series[0].points[z] = {name: $(this).html(), value: $(this).next().html().replace(",", ".") }
                z++;
            });
        }
        else if (data.children().children("tr").eq(0).children("th").size() > 1 && data.children().children("tr").eq(1).children("th").size() == 0) //horizontal chart
        {
            chartData.series[0].name = "Series";
            data.find("th").each(function()
            {
                chartData.series[0].points[z] = {name: $(this).html(), value: $(this).parent().next().children().eq(z).html().replace(",", ".") }
                z++;
            });
        }
        else if (data.children().children("tr").eq(1).children("th").size() > 0) //chart with multiple series
        {
            for(var i = 1; i < data.context.children[dataLength].children.length; i++)
            {
                chartData.series[i-1] = { name: data.context.children[dataLength].children[i].children[0].textContent , points: []}
                for(var a =  1; a < data.context.children[dataLength].children[i].children.length; a++)
                {
                    chartData.series[i-1].points[a-1] = { name: data.context.children[dataLength].children[0].children[a].textContent,
                                                         value: data.context.children[dataLength].children[i].children[a].textContent.replace(",", ".")}
                }
            }
        }
        else
        {
            chartData = false;
        }
        return chartData;
    }

    function buildXML (data)
    {
        if (getChartDataAsJSON(data) != false)
        {
            var diagramType = data.data("diagram-type");
            var title = data.children("caption").html();
            var orientation = data.data("diagram-orientation");
            var chartData = getChartDataAsJSON(data);
            var type = getSeriesType(diagramType);
            var legend = '<legend enabled="false" />';
            var labelRotation = 0;
            var border = false;

            if(type === "pie")
            {
                plottype = diagramType;
                data_plot_settings = '<data_plot_settings><pie_series style="flat">\
                    <label_settings enabled = "true">\
                    <font color="White"/>\
                    <position anchor="Center" valign="Center" halign="Center"/>\
                        <format>{%Value}{thousandsSeparator:,decimalSeparator:\\,}</format>\
                    </label_settings>\
                    </pie_series>\
                    </data_plot_settings>';
                legend = ' <legend enabled="true" position="Bottom" ignore_auto_item="true" align="Spread"><icon><marker enabled="true" /></icon><format>{%Icon} {%Name}</format><template></template><title enabled="false" /><items><item source="Points" /></items><columns_separator enabled="false" /><background><fill enabled="true" type="Solid" color="hsb(0,0,0)" opacity="0.0" /><border enabled="false" /></background></legend>';
            }
            else if(diagramType === "3D-Bar")
            {
                plottype = orientation;
                data_plot_settings = '<data_plot_settings default_series_type="Bar" enable_3d_mode="true"/>';
                if (chartData.series.length > 1)
                {
                    legend = ' <legend enabled="true" position="Bottom" align="Spread"><icon><marker enabled="true" /></icon><format>{%Icon} {%Name}</format><template></template><title enabled="false" /><columns_separator enabled="false" /><background><fill enabled="true" type="Solid" color="hsb(0,0,0)" opacity="0.0" /><border enabled="false" /></background></legend>';
                }
            }
            else
            {
                plottype = orientation;
                data_plot_settings = '<data_plot_settings default_series_type="'+ type +'">\
                <' + type + '_series style="flat">\
                    <tooltip_settings enabled="true"><format><![CDATA[{%YValue}{numDecimals:0,thousandsSeparator:.}]]></format></tooltip_settings>\
                    <label_settings>\
                        <background enabled="false" />\
                        <position anchor="Top" valign="Top" halign="Top" />\
                        <format>{%Value}{numDecimals:0,thousandsSeparator:.}</format>\
                    </label_settings>\
                </' + type + '_series>\
                </data_plot_settings>';

                if (chartData.series.length > 1)
                {
                    legend = ' <legend enabled="true" position="Bottom" align="Spread"><icon><marker enabled="true" /></icon><format>{%Icon} {%Name}</format><template></template><title enabled="false" /><columns_separator enabled="false" /><background><fill enabled="true" type="Solid" color="hsb(0,0,0)" opacity="0.0" /><border enabled="false" /></background></legend>';
                }

                if(type === "marker")
                {
                    var border = true;
                }

                if(orientation === "CategorizedVertical")
                {
                    labelRotation = 90;
                }

                if (title == null)
                {
                    title = " ";
                }
            }

            var trueXMLData = "<data>";
            for(var i = 0; i < chartData.series.length ; i++)
            {
                trueXMLData += '<series name="'+ chartData.series[i].name.replace(/&nbsp;/g, ' ')+'">';
                for(var a =  0; a < chartData.series[i].points.length ; a++)
                {
                    trueXMLData += '<point name="' + chartData.series[i].points[a].name.replace(/&nbsp;/g, ' ')+' " y=" '+ chartData.series[i].points[a].value.replace(/&nbsp;/g, ' ') + ' "/> ';
                }
                trueXMLData += '</series>';
            }
            trueXMLData += '</data>';

            XMLCode = '<?xml version="1.0" encoding="UTF-8"?>\
                <anychart width="1000" height="900">\
                <settings>\
                    <animation enabled="True" />\
                </settings>\
                <charts>\
                    <chart plot_type="' + plottype + '">\
                        <styles>\
                            <'+ type + '_style name="flat">\
                                <fill type="Solid"  opacity="1" />\
                                <border enabled="' + border + '"/>\
                                <states>\
                                    <hover>\
                                        <line color="#cccccc" opacity="1" />\
                                    </hover>\
                                    <selected_normal>\
                                        <line color="#cccccc" opacity="1" />\
                                    </selected_normal>\
                                    <selected_hover>\
                                        <line color="#cccccc" opacity="1" />\
                                    </selected_hover>\
                                    <pushed>\
                                        <line color="#cccccc" opacity="1" />\
                                    </pushed>\
                                </states>\
                            </'+ type + '_style>\
                        </styles>\
                        <chart_settings>\
                            <title position="Top" align="Left" align_mode="horizontal" align_by="chart" enabled="True" padding="35">\
                                <text>' + title + '</text>\
                            </title>\
                            <chart_background>\
                                <border enabled="false" />\
                                <inside_margin left="0" top="0" right="0" bottom="0" all="0" />\
                                <fill enabled="true" type="Solid" color="hsb(0,0,0)" opacity="0.0" />\
                                <effects enabled="false" />\
                            </chart_background>\
                            <axes>\
                                <y_axis >\
                                    <title enabled="false"/>\
                                    <labels>\
                                        <format>\{%Value}{numDecimals:0,thousandsSeparator:}</format>\
                                    </labels>\
                                </y_axis>\
                                <x_axis>\
                                    <labels enabled="true" rotation="' + labelRotation + '">\
                                        <format>\{%Value}{numDecimals:0,thousandsSeparator:}</format>\
                                    </labels>\
                                    <title enabled="false"/>\
                                </x_axis>\
                            </axes>' + legend + '\
                        </chart_settings>'+ data_plot_settings + trueXMLData + '\
                    </chart>\
                </charts>\
            </anychart>';
            return XMLCode;
        }
    }
    function getSeriesType ( type )
    {
        if(type === "Pie" || type === "Doughnut")
        {
            seriesType = "pie";
        }
        else if(type === "Bar" || type === "3D-Bar")
        {
            seriesType = "bar";
        }
        else if(type === "Line" || type === "spline" || type === "StepLineForward")
        {
            seriesType = "line";
        }
        else if( type === "area" || type === "SplineArea" || type === "StepLineForwardArea")
        {
            seriesType = "area";
        }
        else if( type === "Marker")
        {
            seriesType = "marker";
        }
        return seriesType;
    }

    function load_anycharts( imagemap_click, class_name )
    {
        if($(".anychart").length>0)
        {
            if( imagemap_click === false )
            {
                var search_pattern = ".anychart";
            }
            else
            {
                var area_class_id = class_name.split("_");
                area_class_id = area_class_id[1];
                var search_pattern = "#anychart-" + area_class_id;
                $(search_pattern).closest('.embed-image_map').find(".anychart").hide();
            }

            $( search_pattern ).each(function()
            {
                var id = $(this).attr('id');

                /* start embed code work for imagemap */
                var id_number = id.split("-");
                id_number = id_number[1];
                if( $(this).closest('.embed-image_map').find(" area[class^='chart_" + id_number + "']" ).length > 0 && imagemap_click === false )
                {
                    //skip this because it is a chart by the image map
                    $(this).hide();
                    return true;
                }

                var getNode = $(this);
                var path_anychart = $.ez.root_url + $(this).data('xmlfile');

                AnyChart.renderingType = anychart.RenderingType.SVG_ONLY;
                var chart = new AnyChart();
                var width_anychart;
                var height_anychart;

                $.ajax({
                    type: "GET",
                    async: false,
                    url: path_anychart,
                    dataType: "xml",
                    success: function(data){
                      xmlDoc=data;
                    }
                  });

                //error message when the xml can not be opened(permission for example)
                if (typeof xmlDoc === 'undefined') {
                    $(this).hide();
                    $( '<p class="error_text">You do not have permission to view this object</p>' ).insertAfter(this);
                    return false;
                }
                else
                {
                    $(this).show();
                }

                var anychart_element = xmlDoc.getElementsByTagName('anychart');
                var width_anychart = anychart_element[0].getAttribute('width');
                var height_anychart = anychart_element[0].getAttribute('height');

                chart.width = "100%";
                chart.height = "100%";
                chart.setXMLFile(path_anychart);
                var chartContainerID = "#" + id + "_svg";

                $(chartContainerID).css("height",height_anychart + "px");
                if(imagemap_click == true)
                {
                    $(this).css("max-width",width_anychart + "px");
                }
                else
                {
                    $(this).css("max-width",width_anychart + "px");
                }
                
                if(!($("#" + id + "_svg").has("svg").length > 0))
                {
                    chart.write(id + "_svg");
                }
                

           });
        }
    }

    //initial loading
    $('img[usemap]').rwdImageMaps();
    load_anycharts(false, "");
    
    //load charts on click
    $( "area[class^='chart']" ).on('click', function() {
        load_anycharts(true, $(this).attr('class'));
        
    });
    $( "area[class^='popup']" ).on('click', function() {
        load_anycharts(true, $(this).attr('class'));

        // get the chart id
        var search_pattern = "#anychart-" + $(this).attr('class').split("_")[1];
        
        $(search_pattern).parent().css("max-width",$(search_pattern).css("max-width"));
        set_popup_position( search_pattern );
        $("#anychart-popup-background").fadeIn("slow");
        $(search_pattern).parent().fadeIn("normal").css({"top": parseInt( $(window).scrollTop() + 30) + "px"});
    });
    
    function set_popup_position( id )
    {
        if(id === undefined)
        {
          id = "resize";
        }
        if(id == "resize")
        {
             var myid="#" + $(".anychart-popup").filter(":visible").find(".anychart").attr("id");
        }
        else
        {
            var myid=id;
        }
        if( myid == undefined)
        {
            return true;
        }
        var left = 0;
        if( ($("#page").outerWidth()) > parseInt($(myid).parent().css("max-width"),10) )
        {
            var offset = ($(window).outerWidth() - 25 - parseInt(($(myid).parent().css("max-width"))) )/2;
        }
        else
        {
            var offset = ($(window).outerWidth() - parseInt($(myid).parent().outerWidth()) )/2;
        }
        if(offset < 0)
        {
            var offset = 0;
        }
        $(myid).parent().css({"width": $("#page").outerWidth() - 30});
        $(myid).parent().css({"left": parseInt(offset)  + "px"});
    }
    
    $(document).bind("fullscreenchange", function() {
        if($(document).fullScreen() == false)
        {
            $(this).find(".anychart-svgChart").find(".anychart-ButtonClose").remove();
            $(this).find(".anychart-tablePopup").css("visibility","hidden");
            $(this).find(".anychart-svgChart").children("svg").css("background-color", "transparent");
            $(this).find(".anychart-tablePopup").html("");
            $(this).find("#tmp_svg").remove();
        }
    });
    
    $("#anychart-popup-background").click(function() {
        $("#anychart-popup-background").fadeOut("normal");
        $(".anychart-popup").fadeOut("normal");
    });
    
    $(".anychart-popup-close").click(function() {
            $("#anychart-popup-background").fadeOut("normal");
            $(".anychart-popup").fadeOut("normal");
    });
    
    $(".htmltableclass").click(function() {
        if($(this).closest(".anychart").length > 0)
        {
            var anychart_root = $(this).closest(".anychart");
            anychart_root.find(".anychart-tablePopup").html(("<button class=\"anychart-buttonStyle anychart-ButtonClose\" onclick=\"javascript:$(this).parent().fullScreen(false)\"><span class=\"fa fa-times fa-1x\"></span></button><div class=\"anychart-tableScroll\">" + anychart_root.find(".anychart-tablePopup").createTable($.ez.root_url + anychart_root.data('xmlfile')) + "</div>"));
        }
        else
        {
            var anychart_root = $(this).closest(".anychart-table");
            anychart_root.find(".anychart-tablePopup").append(anychart_root.find(".tmp_table_wrapper").html());
        }
        
        anychart_root.children(".anychart-tablePopup").fullScreen(true);
        anychart_root.find(".anychart-tablePopup").css("visibility","visible");
    });

    $(".ButtonIncrease").click(function() 
    {
        var anychart_root = $(this).closest(".anychart");
        if($(this).closest(".anychart").attr("class") == undefined)
        {
            anychart_root = $(this).closest(".anychart-table");
            anychart_root.find(".anychart-svgChart").children("svg").css("background-color","white");
            anychart_root.find(".anychart-svgChart").fullScreen(true);
            anychart_root.find(".anychart-svgChart").append("<button class=\"anychart-buttonStyle anychart-ButtonClose\" onclick=\"javascript:$(this).parent().fullScreen(false)\"><span class=\"fa fa-times fa-1x\"></span></button>");
        }
        else
        {
            anychart_root.append('<div id="tmp_svg"/>');
            anychart_root.find("#tmp_svg").fullScreen(true);

            AnyChart.renderingType = anychart.RenderingType.SVG_ONLY;
            var chart = new AnyChart();
            chart.width = "96%";
            chart.height = "96%";
            chart.setXMLFile($.ez.root_url + anychart_root.data('xmlfile'));
            chart.write("tmp_svg");

            anychart_root.find("#tmp_svg").append("<button class=\"anychart-buttonStyle anychart-ButtonClose\" onclick=\"javascript:$(this).parent().fullScreen(false)\"><span class=\"fa fa-times fa-1x\"></span></button>");
            anychart_root.find("#tmp_svg").css("background-color","white");
            anychart_root.find("#tmp_svg").css("visibility","visible");

        }
    });

    $( ".ButtonDownload" ).click(function() 
    {
        var anychart_root = $(this).closest(".anychart");
        if($(this).closest(".anychart").attr("class") == undefined)
        {
            anychart_root = $(this).closest(".anychart-table");
        }
        var SVGwidth = anychart_root.find(".anychart-svgChart").outerWidth();
        var SVGheight = anychart_root.find(".anychart-svgChart").outerHeight();

        //workaround to solve the svg access problem
        var tmp_html = anychart_root.find("svg").parent().html();
        var beginn = tmp_html.indexOf("<defs>");
        var tmp_html = tmp_html.substr(beginn);
        var ende = tmp_html.indexOf("</svg>");
        var SVGhtml = tmp_html.substr(0, ende);
        var copyright = anychart_root.data("copyright");
        var source = anychart_root.data("source");
        var SVGstring = "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">" + 
                        "<svg width=\"" + SVGwidth +"\" height=\"" + SVGheight + "\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">" + SVGhtml +"</svg>";
        SVGstring = SVGstring.replace(/#ac_/g, "Xac_"); // replace invalid '#' characters
        anychart_root.find("input[name='svg']").attr("value", SVGstring);
        anychart_root.find("input[name='copyright']").attr("value", copyright);
        anychart_root.find("input[name='source']").attr("value", source);
    });
	
	    $( ".ButtonExcel" ).click(function() 
    {
        if($(this).closest(".anychart").length > 0)
        {
            var anychart_root = $(this).closest(".anychart");
            var htmlString = anychart_root.find(".anychart-tablePopup").createTable($.ez.root_url + anychart_root.data('xmlfile'));
        }
        else
        {
            var anychart_root = $(this).closest(".anychart-table");
            var htmlString = anychart_root.prev().html();
        }
        anychart_root.find("input[name='htmlString']").attr("value", htmlString);
        console.log(htmlString);
    });

      $.fn.createTable = function(xml) 
    {
        var globalThis = this;
        var xmlContents = []; /* The Informations from the XML-file are stored here */
        var seriesIndex = 0;
        var tableString = "";
        
        $.ajax({
            type: "GET",
            async: false,
            url: xml,
            dataType: "xml",
            success: function(data){
              xmlDoc=data;
            }
          });
        
        
            /* For every found "series" Tag execute this: */
            $(xmlDoc).find("series").each(function()
            {
                var $tagData = $(this);
                seriesName = $tagData.attr("name"); /* read the name of the "series" tag and save it in seriesName */
                seriesChildren = $tagData.children("point"); /* get the point elements for the "series" tag */ 
                xmlContents[xmlContents.length] = { serieseriesName:seriesName, pointname:[], values:[]}; /* fill xmlContents with the series name */
                
                /* for every child element of the "series" tag execute: */
                for(var i = 0; i < seriesChildren.length; i++)
                {
                    /* for every attribute of "point" execute: */
                    for(var x = 0; x < seriesChildren[i].attributes.length; x++)
                    {
                        /* if attribute x nodename = "name", hence the xml-attribute "name" was found   */
                        /* then save the value in xmlContents                                                   */
                        if(seriesChildren[i].attributes[x].nodeName == "name")
                        {
                            xmlContents[seriesIndex].pointname[i] = seriesChildren[i].attributes[x]; //name
                        }
                        /* if attribute y nodename = "y", hence the xml-attribute "y" was found */
                        /* then save the value in xmlContents                                                   */
                        if(seriesChildren[i].attributes[x].nodeName == "y")
                        {
                            xmlContents[seriesIndex].values[i] = seriesChildren[i].attributes[x]; //value
                        }
                    }
                }
                /* increment seriesIndex to loop throught the next series */
                seriesIndex++;
            });     
           
            var tableString = "<table class=\"anychart-gridtable\"><tr><th></th>";  
            /* execute for every series and build the table headers */
            for(var i = 0; i < xmlContents[0].pointname.length; i++)
            {
                tableString += "<th>" + xmlContents[0].pointname[i].nodeValue + "</th>";
            }
            tableString += "</tr>";
            /* execute for the number of points */
            for(var a = 0; a < xmlContents.length; a++) 
            {
                tableString += "<tr><td>" + xmlContents[a].serieseriesName + "</td>";
                
                /* execute for the number of series */
                for(var i = 0; i < xmlContents[0].pointname.length; i++)
                {
                    tableString += "<td>" + xmlContents[a].values[i].nodeValue + "</td>";
                }   
                tableString += "</tr>";
            }
            tableString += "</table>";
            return tableString;
        
    }
});