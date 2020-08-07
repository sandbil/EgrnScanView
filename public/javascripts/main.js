var config = {
    layout: {
        name: 'layout',
        padding: 0,
        panels: [
            //{ type: 'top', size: 32, content: '<div>Top Panel</div>', style: 'border-bottom: 1px solid silver;' },
            { type: 'top', size: 32, style: 'border-bottom: 1px solid silver;',
                /* toolbar: {
                     items: [
                         { type: 'check',  id: 'item1', caption: 'Check', img: 'icon-page', checked: true },
                         { type: 'spacer' },
                         { type: 'button',  id: 'item5',  caption: 'Item 5', icon: 'w2ui-icon-check', hint: 'Hint for item 5' }
                     ],
                     onClick: function (event) {
                         //this.owner.content('main', event);
                         w2ui.layout.html('main', event);
                     }
                 }*/
            },
            { type: 'left', size: 400, resizable: true, minSize: 200,
                toolbar: {
                    items: [
                        { type: 'html',  id: 'item5',
                            html: function (item) {
                                var html =
                                    '<div style="padding: 3px 10px;">'+
                                    ' Кад.№:'+
                                    '    <input id="fldSearch" size="20" placeholder="Enter Cadn" onchange="searchCadn(this.value)" '+
                                    '         style="padding: 3px; border-radius: 2px; border: 1px solid silver" value="'+ (item.value || '') +'"/>'+
                                    '</div>';
                                return html;
                            }
                        },
                        { type: 'break' },
                        { type: 'button', id: 'item6', icon: 'fa-star-empty', text: 'Refresh',
                            tooltip: 'Click to refresh entire toolbar.<br>Note, input value is preserved.',
                            onClick: function (event) { this.refresh(); }
                        }
                    ]
                }
            },
            { type: 'main', overflow: 'hidden',
                style: 'background-color: white; border: 1px solid silver; border-top: 0px; padding: 10px;',
                tabs: {
                    active: 'tab0',
                    tabs: [{ id: 'tab0', text: 'Initial Tab' }],
                    onClick: function (event) {
                        w2ui.layout.html('main', 'Active tab: '+ event.target);
                    },
                    onClose: function (event) {
                        this.click('tab0');
                    }
                }
            },
            { type: 'bottom', size: 16, content: '<div>bottom Panel</div>', style: 'border-bottom: 1px solid silver;' },
        ]
    },
    sidebar: {
        name: 'sidebar',
        //topHTML: 'some text',
        nodes: [

        ],
        onDblClick: function (event) {
            console.log(event.target);
            console.log(event.object.tag);
            var tabs = w2ui.layout_main_tabs;
            if (tabs.get(event.target)) {
                tabs.select(event.target);
                w2ui.layout.html('main', 'Tab Selected');
            } else {
                tabs.add({ id: event.target, text: 'Tab '+ event.target, closable: true });
                w2ui.layout.html('main', 'New tab added' + event.target);
                tabs.select(event.target);
            }
        }
    }
};

function searchCadn(cadn) {
    var el = w2ui.layout_left_toolbar.set('item5', { value: cadn });
    w2ui.sidebar.lock('', true);
    $.ajax({
        type: "POST",
        url: 'docstree',
        data: {cadn:cadn},
        success: function(data){
            console.log('callback ajax post');
            if (data.error) {
                w2alert(cadn + ' - ' + data.error);
                w2ui.sidebar.unlock();
            } else {
                w2ui['sidebar'].add(data._root);
                w2ui.sidebar.unlock();
            }
        },
        error: function(err){ w2alert('Ошибка: ' + cadn + ' status:' + err.status + ' ' + err.statusText)
            .ok(function () { console.log(JSON.stringify(err)); }); w2ui.sidebar.unlock();}
    });


}

$(function () {
    // initialization
    $('#main').w2layout(config.layout);
    //w2ui.layout.content('top',$('#toolbar').w2toolbar(config.topToolBar));
    w2ui.layout.html('left', $().w2sidebar(config.sidebar));
});