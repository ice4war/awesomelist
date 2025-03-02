import * as d3 from "d3";

export class HorizontalTree {
  constructor(data, element, config) {
    this.width = 900;
    this.marginTop = 10;
    this.marginRight = 10;
    this.marginBottom = 10;
    this.marginLeft = 150;

    this.config = config ? config : HorizontalTree.defaultConfig();
    this.element = element;
    this.data = data;
    this.root = d3.hierarchy(this.data);
    const dx = 25;
    const dy = (this.width - this.marginright - this.marginLeft) / (1 + this.root.height);

    this.tree = d3.tree().nodeSize([dx, dy]).separation((a, b) => (a.parent == b.parent ? 4 : 3) / a.depth);
    this.diagonal = d3.linkHorizontal().x(d => d.y * 1.2).y(d => d.x);


    this.graph = d3.select(`.${this.element}`).append('svg')
      .attr('width', this.width)
      .attr('height', dx * 2)
      .attr('viewBox', [-this.marginLeft, -this.marginTop, this.width, this.height])
      .attr('style', 'width: 100%; height: auto; height: intrinsic;')

    this.graph.node().graph = this;

    this.gLink = this.graph.append("g")
      .attr('fill', 'none')
      .attr('stroke', this.config.lineStrokeColor)
      .attr('stroke-opacity', this.config.lineStrokeOpacity)
      .attr('stroke-width', this.config.lineStrokeWidth);

    this.gNode = this.graph.append("g")
      .attr('pointer-events', 'all')
      .attr('cursor', 'pointer');
    // Hover animate
    const hoverColors = ["#a230ed", "#c364fa", "#6fb2d8", "#61b6d6", "#6fb2d8", "#c364fa", "#a230ed"];

    const hoverGradient = this.graph.append('defs').append('linearGradient');
    hoverGradient.attr('id', 'hover-animate')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0')
      .attr('spreadMethod', 'reflect');

    hoverGradient.selectAll('.hover-stop')
      .data(hoverColors)
      .enter().append("stop")
      .attr("offset", (d, i) => i / (hoverColors.length - 1))
      .attr('stop-color', d => d);

    // Hover animate
    this.root.x0 = dy / 2;
    this.root.y0 = 0;
    this.root.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
      if (d.depth >= 1) d.children = null;
    })
    this.update(null, this.root);
  }
  update(event, source) {
    const identifier = this.element;
    const config = this.config;
    const nodeSelector = (d) => {
      const id = (d.data.name || d.data.title).split(" ").join("_");
      return id + "_" + d.id;
    }
    const linkSelector = (source, target) => {
      const s = (source.data.title || source.data.name).split(" ").join("_");
      const t = (target.data.title || target.data.name).split(" ").join("_");
      return `${s}_${t}`;
    }
    const nodes = this.root.descendants().reverse();
    const links = this.root.links();

    this.tree(this.root);
    let left = this.root;
    let right = this.root;
    nodes.forEach(d => (d.y = d.depth * 100));

    this.root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });
    const height = right.x - left.x + this.marginTop + this.marginBottom;

    const transition = this.graph.transition()
      .duration(400)
      .attr('width', this.width)
      .attr('height', height)
      .attr('viewBox', [-this.marginLeft, left.x - this.marginTop, this.width, height])
      .tween("resize", window.ResizeObserver ? null : () => () => this.graph.dispatch("toggle"));

    const node = this.gNode.selectAll('g')
      .data(nodes, d => d.id)

    const nodeEnter = node.enter().append('g').attr('id', 'graph-node')
      .attr('transform', d => `translate(${source.y0},${source.x0})`)
      .attr('fill-opacity', 0)
      .attr('stroke-opacity', 0)
      .on('click', (event, d) => {
        d.children = d.children ? null : d._children;
        this.update(event, d);
      })


    // Nodes
    nodeEnter.append('circle')
      .attr('class', d => `${nodeSelector(d)}_circle ${identifier}_circle`)
      .attr('r', config.nodeRadius)
      .attr('fill', d => d._children ? config.parentNodeColor : config.childNodeColor)
      .attr('stroke', config.nodeStokeColor)
      .attr('fill-opacity', config.nodeFillOpacity)
      .attr('stroke-width', config.nodeStrokeWidth);

    // Labels
    const href = nodeEnter.append('a')
      .attr('href', d => d.data.url ? d.data.url : null)
      .attr('target', '_blank')
      .attr('ref', 'noreferrer noopener');

    href.append('text').attr('font-size', config.fontSize + 'px')
      .attr('class', d => `${nodeSelector(d)}_text ${identifier}_text`)
      .attr('dy', '0.31em')
      .attr('dx', d => d._children ? '-.5em' : '.4em')
      .attr('text-anchor', d => d._children ? 'end' : 'start')
      .attr('stroke', config.textStrokeColor)
      .attr('paint-order', 'stroke')
      .attr('stroke-width', config.textStrokeWidth)
      .text(d => d.data.name || d.data.title)
      .on('mouseover', function (event, d) {
        //Link modification
        d3.selectAll(`.${identifier}_link`).attr('stroke-opacity', 0.2)
        // Label modification
        d3.selectAll(`.${identifier}_text`).attr('fill-opacity', 0.2)
        // Node modification
        d3.selectAll(`.${identifier}_circle`).attr('fill-opacity', 0.2)

        while (d.parent) {
          if (d.parent != null) {
            // Labels
            d3.select(`.${nodeSelector(d)}_text`)
              .attr('fill-opacity', 1)
              .attr('font-size', config.fontSize + 3 + 'px');

            // Nodes
            d3.select(`.${nodeSelector(d)}_circle`)
              .attr('fill-opacity', 0.7)
              .attr("r", config.nodeRadius + 1);

            // Links
            d3.select(`.${linkSelector(d.parent, d)}`)
              .attr('stroke', 'url(#hover-animate)')
              .attr('stroke-opacity', 1);
          }//IF
          d = d.parent;
        }// while
      })
      .on('mouseleave', function (event, d) {
        // Link reset
        d3.selectAll(`.${identifier}_link`)
          .attr('stroke-opacity', config.lineStrokeOpacity)
          .attr('stroke', config.lineStrokeColor);
        // Node reset
        d3.selectAll(`.${identifier}_circle`)
          .attr('fill-opacity', config.nodeFillOpacity)
          .attr("r", config.nodeRadius);
        // Label reset
        d3.selectAll(`.${identifier}_text`)
          .attr('fill-opacity', 1)
          .attr('font-size', config.fontSize + "px")
      });



    // node Update
    const nodeUpdate = node.merge(nodeEnter).transition(transition)
      .attr("transform", d => `translate(${d.y * 1.2},${d.x})`)
      .attr('fill-opacity', 1)
      .attr('stroke-opacity', 1);

    const nodeExit = node.exit().transition(transition).remove()
      .attr("transform", d => `translate(${source.y},${source.x})`)
      .attr('fill-opacity', 0)
      .attr('stroke-opacity', 0);

    // // Links
    const link = this.gLink.selectAll('path').data(links, d => d.target.id);

    const linkEnter = link.enter().append("path").attr('id', 'graph-link')
      .attr('class', d => `${linkSelector(d.source, d.target)} ${identifier}_link`)
      .attr("d", d => {
        const o = { x: source.x0, y: source.y0 };
        return this.diagonal({ source: o, target: o });
      });
    link.merge(linkEnter).transition(transition)
      .attr("d", this.diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
      .attr("d", d => {
        const o = { x: source.x, y: source.y };
        return this.diagonal({ source: o, target: o });
      });
    this.root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
  adjust(w) {
    if (!w) return this.width;
    this.width = w;
    this.update()
  }

  remove() {
    this.graph.remove();
  }
  static defaultConfig() {
    let config = {
      nodeRadius: 4,

      parentNodeColor: "#FA3B01",
      childNodeColor: "#5a5",
      nodeStrokeWidth: 0,
      nodeStrokeColor: 'none',
      nodeFillOpacity: 0.6,

      lineStrokeColor: "#afafaf",
      lineStrokeOpacity: .6,
      lineStrokeWidth: 2,

      textStrokeColor: "none",
      textStrokeWidth: 0,
      fontSize: 12,
    }
    return config;
  }
}
