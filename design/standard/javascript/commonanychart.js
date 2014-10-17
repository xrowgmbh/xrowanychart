/* AnyChart and AnyMap*/ 
$(document).ready(function()
{
    if($(".diagram").length>0)
    {
        var htmlData = [];
        var tableIndex = 0;
        var chartData = [];

        $(".diagram").each(function()
        {
            var title = "";
            chartData[tableIndex] =     { series: [{ name:"", points: []}]};
            htmlData[htmlData.length] = $(this).find("trbody"); //html ins DOM Objekt
            var tableChildrenLength = htmlData[tableIndex].context.children.length - 1;

            if(htmlData[tableIndex].context.children[0].length != 0)
            {
                title = htmlData[tableIndex].context.children[0].textContent;
            }

            for(var i = 1; i < htmlData[tableIndex].context.children[tableChildrenLength].children.length; i++)// für anzahl der <tr>
            {
                chartData[tableIndex].series[i-1] = { name: htmlData[tableIndex].context.children[tableChildrenLength].children[i].children[0].textContent , points: []}         
                for(var a =  1; a < htmlData[tableIndex].context.children[tableChildrenLength].children[i].children.length; a++)
                {   
                    chartData[tableIndex].series[i-1].points[a-1] = { name: htmlData[tableIndex].context.children[tableChildrenLength].children[0].children[a].textContent,
                                                                     value: htmlData[tableIndex].context.children[tableChildrenLength].children[i].children[a].textContent}
                }
            }
            
        var tmp = '<?xml version="1.0" encoding="UTF-8"?>\
            <anychart width="1000" height="900">\
            <settings>\
            <animation enabled="True" />\
            </settings>\
            <charts>';
        
        console.log("diagram-type: " + $(this).data("diagram-type") + " | diagram-orientation: " + $(this).data("diagram-orientation"));
        if($(this).data("diagram-type") === "Pie" || $(this).data("diagram-type") === "Doughnut")
        {
            tmp +='<chart plot_type="'+$(this).data("diagram-type")+'">';
            
        }
        else
        {
            tmp +='<chart plot_type="'+$(this).data("diagram-orientation")+'">';
        }
        
        
        tmp +='<chart_settings>\
                <title position="Top" align="Left" align_mode="horizontal" align_by="chart" enabled="True">\
                    <text>' + title + '</text>\
                </title>\
                <chart_background>\
                    <border enabled="false" />\
                    <inside_margin left="0" top="0" right="0" bottom="0" all="0" /> \
                    <fill enabled="true" type="Solid" color="hsb(0,0,0)" opacity="0.0" />\
                    <effects enabled="false" />\
                </chart_background>\
                <axes>\
                    <y_axis >\
                        <title enabled="false"/>\
                        <labels>\
                            <format>{%Value}{numDecimals:0,thousandsSeparator:}</format>\
                        </labels>\
                    </y_axis>\
                    <x_axis>\
                        <labels enabled="true">\
                        <format>{%Value}{numDecimals:0,thousandsSeparator:}</format>\
                        </labels>\
                        <title enabled="false"/>\
                    </x_axis>\
                </axes>\
            </chart_settings>';

            if($(this).data("diagram-type") === "Pie" || $(this).data("diagram-type") === "Doughnut")
            {
                tmp += ' <data_plot_settings>' ;
                
                tmp += '<pie_series>\
                <label_settings>\
                <font color="White"/>\
                <position anchor="Center" valign="Center" halign="Center"/>\
                <format>{%YPercentOfSeries}{numDecimals:1}%</format>\
                </label_settings>\
                </pie_series>\
                </data_plot_settings>';
            }
            else if($(this).data("diagram-type") === "3D-Bar")
            {
                tmp += ' <data_plot_settings default_series_type="Bar" enable_3d_mode="true" >' ;
                
                tmp += ' <bar_series>\
                    <label_settings>\
                        <background enabled="false" />\
                        <position anchor="Top" valign="Top" halign="Top" />\
                        <format>{%Value}{numDecimals:0,thousandsSeparator:.}</format>\
                    </label_settings>\
                    </bar_series>\
                </data_plot_settings>';
            }
            else
            {
                tmp += ' <data_plot_settings default_series_type="'+$(this).data("diagram-type")+'">' ;
                tmp += ' <bar_series>\
                    <label_settings>\
                        <background enabled="false" />\
                        <position anchor="Top" valign="Top" halign="Top" />\
                        <format>{%Value}{numDecimals:0,thousandsSeparator:.}</format>\
                    </label_settings>\
                    </bar_series>\
                </data_plot_settings>';
            }
        tmp += '<data>';

        // for all series
        for(var i = 0; i < chartData[tableIndex].series.length ; i++)
        {
            tmp += '<series name="'+chartData[tableIndex].series[i].name+'">';
            // for all points
            for(var a =  0; a < chartData[tableIndex].series[i].points.length ; a++)
            {
                tmp += '<point name="'+chartData[tableIndex].series[i].points[a].name+' " y=" '+ chartData[tableIndex].series[i].points[a].value + ' "/> ';
            }

            tmp += '</series>';
        }
        tmp += '</data></chart></charts></anychart>';
        
        
        AnyChart.renderingType = anychart.RenderingType.SVG_ONLY;
        var chart = new AnyChart();
        chart.width = "100%";
        chart.height = "100%";
        chart.setData(tmp);
        $(this).next().find(".anychart-svgChart").attr("id","anychart-" + Math.floor((Math.random() * 100000) + 1))
        chart.write($(this).next().find(".anychart-svgChart").attr("id"));

        $(this).next().find(".anychart-svgButtons").css("width",$(this).parent().css("width"));
        $(this).next().find(".anychart-attr").css("height","400px");
        $(this).next().find(".anychart-attr").css("width",$(this).parent().css("width"));
        
        $(this).remove();
        tableIndex++;
        });
    }

    if($(".anychart").length>0)
    {
        $(".anychart").each(function()
        {
            var id = $(this).attr('id');
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
            

            var anychart_element = xmlDoc.getElementsByTagName('anychart');
            //var width_anychart = anychart_element[0].getAttribute('width');
            var height_anychart = anychart_element[0].getAttribute('height');

            chart.width = "100%";
            chart.height = "100%";
            chart.setXMLFile(path_anychart);
            var chartContainerID = "#" + id + "_svg";
            $(chartContainerID).css("height",height_anychart);
            $(chartContainerID).css("width","100%");
            
            chart.write(id + "_svg");
            
       });
    }
    
    $(document).bind("fullscreenchange", function() {
        if($(document).fullScreen() == false)
        {
            $(this).find(".anychart-svgChart").find(".anychart-ButtonClose").remove();
            $(this).find(".anychart-tablePopup").css("visibility","hidden");
            $(this).find(".anychart-svgChart").children("svg").css("background-color", "transparent");
            $(this).find(".anychart-tablePopup").html("");
        }
    });
    
    $(".htmltableclass").click(function() {
        var anychart_root = $(this).closest(".anychart");
        anychart_root.find(".anychart-tablePopup").createTable($.ez.root_url + anychart_root.data('xmlfile'));
        anychart_root.children(".anychart-tablePopup").fullScreen(true);
        anychart_root.find(".anychart-tablePopup").css("visibility","visible");
    });
    
    $(".ButtonIncrease").click(function() {
        var anychart_root = $(this).closest(".anychart");
        anychart_root.find(".anychart-svgChart").children("svg").css("background-color","white");
        anychart_root.find(".anychart-svgChart").fullScreen(true);
        anychart_root.find(".anychart-svgChart").append("<button class=\"anychart-buttonStyle anychart-ButtonClose\" onclick=\"javascript:$(this).parent().fullScreen(false)\"><span class=\"fa fa-times fa-1x\"></span></button>");
    });

    $( ".ButtonDownload" ).click(function() 
    {
        var anychart_root = $(this).closest(".anychart");
        var SVGwidth = anychart_root.find(".anychart-svgChart").outerWidth();
        var SVGheight = anychart_root.find(".anychart-svgChart").outerHeight();

        //workaround to solve the svg access problem
        var tmp_html = $(this).closest(".anychart").find("svg").parent().html();
        var beginn = tmp_html.indexOf("<defs>");
        var tmp_html = tmp_html.substr(beginn);
        var ende = tmp_html.indexOf("</svg>");
        var SVGhtml = tmp_html.substr(0, ende);
        
        var SVGstring = "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">" + 
                        "<svg width=\"" + SVGwidth +"\" height=\"" + SVGheight + "\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">" + SVGhtml +"</svg>";
        SVGstring = SVGstring.replace(/#ac_/g, "Xac_"); // replace invalid '#' characters
        anychart_root.find("input[name='svg']").attr("value", SVGstring);

    });

    $.fn.createTable = function(xml) 
    {
        var globalThis = this;
        var xmlContents = []; /* The Informations from the XML-file are stored here */
        var seriesIndex = 0;
        var tableString = "";
        $.get(xml, function(XML)
        {
            /* For every found "series" Tag execute this: */
            $(XML).find("series").each(function()
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
            
            tableString = "<button class=\"anychart-buttonStyle anychart-ButtonClose\" onclick=\"javascript:$(this).parent().fullScreen(false)\"><span class=\"fa fa-times fa-1x\"></span></button><div class=\"anychart-tableScroll\"><table class=\"anychart-gridtable\"><tr><th></th>";  
            /* execute for every series and build the table headers */
            for(var i = 0; i < xmlContents[0].pointname.length; i++)
            {
                tableString += "<th>" + xmlContents[0].pointname[i].nodeValue + "</th>";
            }

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
            tableString += "</tr></table></div>";
            $(globalThis).parent().parent().find(".anychart-tablePopup").html(tableString);
        });
    }
});