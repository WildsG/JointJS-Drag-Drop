let currentYPos = 10;
let yOffset = 50;

let stencilGraph = new joint.dia.Graph,
    stencilPaper = new joint.dia.Paper({
        el: $('#stencil'),
        height: 500,
        width: 140,
        model: stencilGraph,
        interactive: false,
        background: {
            color: 'rgba(240,240, 240, 1)'
        }
    });

let r1 = new joint.shapes.html.Rectangle({
    position: {
        x: 20,
        y: currentYPos
    },
    size: {
        width: 100,
        height: 40
    },
    attrs: {
        text: {
            text: 'Rect1'
        }
    }
});
currentYPos += yOffset;
let r2 = new joint.shapes.html.Rectangle({
    position: {
        x: 20,
        y: currentYPos
    },
    size: {
        width: 100,
        height: 40
    },
    attrs: {
        text: {
            text: 'Rect2'
        }
    }
});
currentYPos += yOffset;
stencilGraph.addCells([r1, r2]);


stencilPaper.on('cell:pointerdown', function (cellView, e, x, y) {
    $('body').append('<div id="flyPaper" style="position:fixed;z-index:100;opacity:.7;pointer-event:none;"></div>');
    let flyGraph = new joint.dia.Graph,
        flyPaper = new joint.dia.Paper({
            el: $('#flyPaper'),
            model: flyGraph,
            interactive: false,
            width: 100,
            height: 40
        }),
        flyShape = cellView.model.clone(),
        pos = cellView.model.position(),
        offset = {
            x: x - pos.x,
            y: y - pos.y
        };
    flyShape.position(0, 0);
    flyGraph.addCell(flyShape);
    $("#flyPaper").offset({
        left: e.pageX - offset.x,
        top: e.pageY - offset.y
    });
    $('body').on('mousemove.fly', function (e) {
        $("#flyPaper").offset({
            left: e.pageX - offset.x,
            top: e.pageY - offset.y
        });
        
    });
    $('body').on('mouseup.fly', function (e) {
        let x = e.pageX,
            y = e.pageY,
            target = paper.$el.offset();

        // Dropped over paper ?
        if (x > target.left && x < target.left + paper.$el.width() && y > target.top && y < target.top + paper.$el.height()) {
            let s = flyShape.clone();
            s.position(x - target.left - offset.x, y - target.top - offset.y);
            graph.addCell(s);
            setActiveElement(paper.findViewByModel(s));
            correctBounds(s);
        }
        $('body').off('mousemove.fly').off('mouseup.fly');
        flyShape.remove();
        $('#flyPaper').remove();
    });
});


function correctBounds(shape){
    let position = shape.get('position');
    let size = shape.get('size');
    let correctedPositionX = position.x;
    let correctedPositionY = position.y;
    if(position.x + size.width + paperGridSize > paperWidth){
        correctedPositionX = paperWidth - size.width - paperGridSize;
    }
    if(position.y + size.height + paperGridSize > paperHeight){
        correctedPositionY = paperHeight - size.height - paperGridSize;
    }
    if(position.x < paperGridSize){
        correctedPositionX = paperGridSize;
    }
    if(position.y < paperGridSize){
        correctedPositionY = paperGridSize;
    }
    shape.position(correctedPositionX, correctedPositionY);
}


stencilPaper.on('cell:pointerdown', function (cellView, e, x, y) {
    if ($('#button-dialog-create').hasClass('selected')) {
        deselect($('#button-dialog-create'));
    } 
});