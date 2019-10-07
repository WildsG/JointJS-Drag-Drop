let rect = new joint.shapes.html.Rectangle();
rect.position(100, 30);
rect.resize(100, 40);
rect.attr({
    label: {
        text: 'Hello',
    }

});
rect.addTo(graph);

let rect2 = rect.clone();
rect2.translate(300, 0);
rect2.attr('label/text', 'World!');
rect2.addTo(graph);

let link = new joint.shapes.standard.Link();
link.source(rect);
link.target(rect2);
link.attr({
    line: {
        stroke: 'blue',
        strokeWidth: 1,
        targetMarker: {
            'type': 'path',
            'stroke': 'black',
            'fill': 'yellow',
            'd': 'M 10 -5 0 0 10 5 Z'
        }
    }
});
link.addTo(graph);
createLinkTools(link);

// graph.on('all', function(eventName, cell) {
//     console.log(arguments);
// });

paper.on('element:pointerup', function (elementView) {
    setActiveElement(elementView);
});

paper.on('blank:pointerdown', function (elementView) {
    resetAll(paper);
});

paper.on('cell:pointerdown', function (cellView, e, x, y) {
    resetAll(paper);
});


function resetAll() {
    let elements = paper.model.getElements();
    for (let i = 0; i < elements.length; i++) {
        let currentElement = elements[i];
        let view = paper.findViewByModel(currentElement);
        if (currentElement.attributes.type == types.rectangle) {
            view.$box.find('.delete').addClass('hidden');
            view.$box.find('.link').addClass('hidden');
            view.$box.removeClass('selected')
            currentElement.attr('body/stroke', 'black');
        }
    }
}

function setActiveElement(elementView) {
    resetAll(paper);
    let currentElement = elementView.model;
    currentElement.attr('body/stroke', 'orange')
    elementView.$box.find('.delete').removeClass('hidden');
    elementView.$box.find('.link').removeClass('hidden');
    elementView.$box.addClass('selected');
}

// popup functionality

function deselect(e) {
    $('.pop').slideFadeToggle(function () {
        e.removeClass('selected');
    });
}

$(function () {
    $('#button-dialog-create').on('click', function () {
        if ($(this).hasClass('selected')) {
            deselect($(this));
        } else {
            $(this).addClass('selected');
            $('.pop').slideFadeToggle();
        }
        return false;
    });
    $('.close').on('click', function () {
        deselect($('#button-dialog-create'));
        return false;
    });
    
});

$.fn.slideFadeToggle = function (easing, callback) {
    return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
};  


$('#paper').on('click', function () {
    if ($('#button-dialog-create').hasClass('selected')) {
        deselect($('#button-dialog-create'));
    }
});
$('#stencil').on('click', function () {
    if ($('#button-dialog-create').hasClass('selected')) {
        deselect($('#button-dialog-create'));
    }
});

$('.html-element').on('event', function () {
    if ($('#button-dialog-create').hasClass('selected')) {
        deselect($('#button-dialog-create'));
    }


});
var events = $._data($('.html-element')[0], "events");
console.log(events);
$('#confirm-create').on('click', function () {
    if(!$('#box-content').val())
        return;

    let rect = new joint.shapes.html.Rectangle({
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
                text: $('#box-content').val()
            }
        }
    });
    rect.addTo(stencilGraph);
    currentYPos += yOffset;
})