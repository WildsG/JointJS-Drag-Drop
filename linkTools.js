function createLinkTools(myLink) {
    
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

    let linkView = myLink.findView(paper);
    linkView.addTools(toolsView);
    linkView.hideTools();

    paper.on('link:mouseenter', function (linkView) {
        linkView.showTools();
    });

    paper.on('link:mouseleave', function (linkView) {
        linkView.hideTools();
    });
}