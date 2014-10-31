
{set $classification = cond( and(is_set( $align ), $align ), concat( $classification, ' object-', $align ), $classification )}
<table{if $classification} class="{$classification|wash}"{else} class="renderedtable"{/if}{if ne($border|trim,'')} border="{$border}"{/if} cellpadding="{first_set($cellpadding, '2')}" cellspacing="0"{if ne($width|trim,'')} width="{$width}" style="width: {$width}"{/if}{if and(is_set( $summary ), $summary)} summary="{$summary|wash}"{/if}
{if and(is_set( $title ), $title)} title="{$title|wash}"{/if}
{if and(is_set( $data-diagram-orientation ), $data-diagram-orientation)} data-diagram-orientation="{$data-diagram-orientation|wash}"{/if}
{if and(is_set( $data-diagram-type ), $data-diagram-type)} data-diagram-type="{$data-diagram-type|wash}"{/if}
>
{if and(is_set( $caption ), $caption)}<caption>{$caption|htmlspecialchars_decode|wash}</caption>{/if}
{$rows}
</table>
{if $classification|contains( 'diagram' )}
<div>
    <div class="anychart-svgButtons">
        <button class="anychart-buttonStyle ButtonIncrease" title="Vergrößern der Ansicht des Charts"><span class="fa fa-arrows-alt fa-1x"></span></button>
        {*<button class="anychart-buttonStyle htmltableclass" title="Die dazugehörige HTML Tabelle anzeigen"><span class="fa fa-table fa-1x"></span></button>*}
        <form method="POST" action={"extension/download"|ezurl()}>
            <input type="hidden" name="svg" value="" />
            <button class="anychart-buttonStyle ButtonDownload" title="Das Chart als PNG downloaden"><span class="fa fa-download fa-1x"></span></button>
        </form>
    </div>
    <div class="anychart-attr">
        <div class="anychart-svgChart" id="placeholder"></div>
    </div>
    <div class="anychart-tablePopup"></div>
</div>
{/if}