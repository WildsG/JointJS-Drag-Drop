joint.shapes.html = {};
joint.shapes.html.Rectangle = joint.shapes.standard.Rectangle.extend({
    defaults: joint.util.deepSupplement({
        type: 'html.Element',
        size: {
            width: 100,
            height: 40
        },
        attrs: {
            text: {
                text: 'Rect1'
            }
        }
    }, joint.shapes.standard.Rectangle.prototype.defaults)
});


joint.shapes.html.ElementView = joint.dia.ElementView.extend({

    template: [
        '<div class="html-element">',
            '<button class="delete hidden">x</button>',
            '<button class="link hidden">l</button>',
        '</div>'
    ].join(''),

    initialize: function() {
        _.bindAll(this, 'updateBox');
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);
        this.$box = $(_.template(this.template)());
        // Prevent paper from handling pointerdown.
        this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));
        this.$box.find('.link').on('pointerdown', _.bind(function(evt) {
        // reset all selected elements
        resetAll()
        // create link object
        let linkView = new joint.shapes.standard.Link().attr({
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
            }).set({
                'source': this.model,
                'target': V(paper.viewport).toLocalPoint(evt.clientX, evt.clientY)
            })
            .addTo(graph)
            .findView(paper);
        
            // initialize linkTools on link
            setLinkTools(linkView);
            // initiate the linkView arrowhead movement
            linkView.startArrowheadMove('target');

            $(document).on({
                'mousemove.events': onDrag,
                'mouseup.events': onDragEnd
            }, {
                    // shared data between listeners
                    view: linkView,
                    paper: paper
                });

            function onDrag(evt) {
                // transform client to paper coordinates
                var p = evt.data.paper.snapToGrid({
                    x: evt.clientX,
                    y: evt.clientY
                });
                // manually execute the linkView mousemove handler
                evt.data.view.pointermove(evt, p.x, p.y);
            }

            function onDragEnd(evt) {
                // manually execute the linkView mouseup handler
                evt.data.view.pointerup(evt);
                evt.data.view.showTools();
                $(document).off('.events');
            }
        }, this));
        // Update the box position whenever the underlying model changes.
        this.model.on('change', this.updateBox, this);
        // Remove the box when the model gets removed from the graph.
        this.model.on('remove', this.removeBox, this);
        this.updateBox();
    },
    render: function () {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
        this.paper.$el.prepend(this.$box);
        this.updateBox();
        return this;
    },
    updateBox: function () {
        // Set the position and dimension of the box so that it covers the JointJS element.
        var bbox = this.model.getBBox();
        // Example of updating the HTML with a data stored in the cell model.
        this.$box.css({
            width: bbox.width,
            height: bbox.height,
            left: bbox.x,
            top: bbox.y,
            transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
        });
    },
    removeBox: function (evt) {
        this.$box.remove();
    },

});


function setLinkTools(linkView){
    let verticesTool = new joint.linkTools.Vertices();
    let segmentsTool = new joint.linkTools.Segments();
    let sourceArrowheadTool = new joint.linkTools.SourceArrowhead();
    let targetArrowheadTool = new joint.linkTools.TargetArrowhead();
    let sourceAnchorTool = new joint.linkTools.SourceAnchor();
    let targetAnchorTool = new joint.linkTools.TargetAnchor();
    let boundaryTool = new joint.linkTools.Boundary();
    let removeButton = new joint.linkTools.Remove();

    let toolsView = new joint.dia.ToolsView({
        tools: [
            verticesTool, segmentsTool,
            targetArrowheadTool,
            sourceAnchorTool, targetAnchorTool,
            boundaryTool, removeButton
        ]
    });

    linkView.addTools(toolsView);
    linkView.hideTools();

    paper.on('link:mouseenter', function (linkView) {
        linkView.showTools();
    });

    paper.on('link:mouseleave', function (linkView) {
        linkView.hideTools();
    });
}