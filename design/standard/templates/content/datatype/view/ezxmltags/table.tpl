{set $classification = cond( and(is_set( $align ), $align ), concat( $classification, ' object-', $align ), $classification )}
<table{if $classification} class="{$classification|wash}"{else} class="renderedtable"{/if}{if ne($border|trim,'')} border="{$border}"{/if} cellpadding="{first_set($cellpadding, '2')}" cellspacing="0"{if ne($width|trim,'')} width="{$width}" style="width: {$width}"{/if}{if and(is_set( $summary ), $summary)} summary="{$summary|wash}"{/if}
{if and(is_set( $title ), $title)} title="{$title|wash}"{/if}
{if and(is_set( $data-diagram-orientation ), $data-diagram-orientation)} data-diagram-orientation="{$data-diagram-orientation|wash}"{/if}
{if and(is_set( $data-diagram-type ), $data-diagram-type)} data-diagram-type="{$data-diagram-type|wash}"{/if}
{if and(is_set( $data-diagram-height ), $data-diagram-height)} data-diagram-height="{$data-diagram-height|wash}"{else}data-diagram-height="400"{/if}
>
{if and(is_set( $caption ), $caption)}<caption>{$caption|htmlspecialchars_decode|wash}</caption>{/if}
{$rows}
</table>
{if $classification|contains( 'diagram' )}
<div class="anychart-table">
    <div class="anychart-svgButtons">
        <button class="anychart-buttonStyle ButtonIncrease" title="Vergrößern der Ansicht des Charts"><span class="fa fa-arrows-alt fa-1x"></span></button>
    {* Html Tabelle in Fullscreen anzeigen wurde entfernt um die Html Tabelle als eine Exceltabelle Download Funktion anzubieten. *}
    {* <button class="anychart-buttonStyle htmltableclass" title="Die dazugehörige HTML Tabelle anzeigen"><span class="fa fa-table fa-1x"></span></button>*}
        <form method="POST" action={"anymap/excel"|ezurl()}>
            <input type="hidden" name="htmlString" value="" />
            <input type="hidden" name="title" value="" />
            {if is_set($copyright)}
                <input type="hidden" name="copyright" value="{$copyright}" />
            {/if}
            {if is_set($source)}
                <input type="hidden" name="source" value="{$source}" />
            {/if}
            <button class="anychart-buttonStyle ButtonExcel" title="Das Chart als Excel Dokument speichern"><span class="fa fa-table fa-1x"></span></button>
        </form>
        <form method="POST" action={"anymap/download"|ezurl()}>
            <input type="hidden" name="svg" value="" />
            {if is_set($copyright)}
                <input type="hidden" name="copyright" value="{$copyright}" />
            {/if}
            {if is_set($source)}
                <input type="hidden" name="source" value="{$source}" />
            {/if}
            <button class="anychart-buttonStyle ButtonDownload" title="Das Chart als PNG downloaden"><span class="fa fa-download fa-1x"></span></button>
        </form>
    </div>
    <div class="anychart-attr">
        <div class="anychart-svgChart" id="placeholder"></div>
    </div>
    <div class="anychart-tablePopup"></div>
    <div class="tmp_table_wrapper">
        <table class="tmp_table" {if ne($border|trim,'')} border="{$border}"{/if} cellpadding="{first_set($cellpadding, '2')}" cellspacing="0"{if ne($width|trim,'')} width="{$width}" style="width: {$width}"{/if}{if and(is_set( $summary ), $summary)} summary="{$summary|wash}"{/if}
            {if and(is_set( $title ), $title)} title="{$title|wash}"{/if}
            {if and(is_set( $data-diagram-orientation ), $data-diagram-orientation)} data-diagram-orientation="{$data-diagram-orientation|wash}"{/if}
            {if and(is_set( $data-diagram-type ), $data-diagram-type)} data-diagram-type="{$data-diagram-type|wash}"{/if}
            {if and(is_set( $data-diagram-height ), $data-diagram-height)} data-diagram-height="{$data-diagram-height|wash}"{else}data-diagram-height="400"{/if}
            >
            {if and(is_set( $caption ), $caption)}<caption>{$caption|htmlspecialchars_decode|wash}</caption>{/if}
            {$rows}
        </table>
        <button class="anychart-buttonStyle anychart-ButtonClose" onclick="{literal}javascript:$(this).parent().fullScreen(false){/literal}">
            <span class="fa fa-times fa-1x"></span>
        </button>
    </div>
    {if is_set($source)}
        <div class="anychart-diagram-source">
            <span>Quelle: {$source}</span>
        </div>
     {/if}
</div>
{/if}