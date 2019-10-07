let paperWidth = 1000;
let paperHeight = 600;
let paperGridSize = 5;

let graph = new joint.dia.Graph;

let paper = new joint.dia.Paper({
    el: document.getElementById('paper'),
    model: graph,
    width: paperWidth,
    height: paperHeight,
    gridSize: paperGridSize,
    drawGrid: true,
    background: {
        color: 'rgba(255, 255, 255, 0.3)'
    }
});


paper.on('cell:pointermove', function (cellView, evt, x, y) {

    var bbox = cellView.getBBox();
    var constrained = false;
    var constrainedX = x;
    
    if (bbox.x <= 0) { 
        constrainedX = x + paperGridSize;
        constrained = true
    }
    
    if (bbox.x + bbox.width >= paperWidth) { 
        constrainedX = x - paperGridSize; 
        constrained = true
    }
                        
    var constrainedY = y;
    
    if (bbox.y <= 0) {
        constrainedY = y + paperGridSize;
        constrained = true
    }
    
    if (bbox.y + bbox.height >= paperHeight) { 
        constrainedY = y - paperGridSize; 
        constrained = true
    }
    
    //if you fire the event all the time you get a stack overflow
    if (constrained) { 
        cellView.pointermove(evt, constrainedX, constrainedY)
    }
});
