/*
	Code take from https://github.com/justin-coberly/dagre-d3-react
	and modified as needed to explore cpabalities and how it suits our needs
*/
import React, { Component, createRef } from 'react'
import dagreD3 from 'dagre-d3'
import * as d3 from 'd3'

interface GraphProps {
	nodes: d3Node[]
	links: d3Link[]
	zoomable?: boolean
	fitBoundaries?: boolean
	height?: string
	width?: string
	rankdir?: rankdir
	animate?: number
	className?: string
	shape?: shapes
	onNodeClick: Function
	onNodeRightClick: Function
	onNodeDoubleClick: Function
	onRelationshipClick: Function
	onRelationshipDoubleClick: Function
	onRelationshipRightClick: Function
}
type rankdir = 'TB' | 'BT' | 'LR' | 'RL'
type shapes = 'rect' | 'circle' | 'ellipse'
type labelType = 'html' | 'svg' | 'string'

type d3Node = {
	id: any
	label: string
	class?: string
	labelType?: string
}
type d3Link = {
	source: string
	target: string
	class?: string
	label?: string
}
type Relationship = {
	v: any
	w: any
}

class DagreGraph extends Component<GraphProps> {
	svg = createRef<SVGSVGElement>()
	innerG = createRef<SVGSVGElement>()
	renderER = new dagreD3.render();

	static defaultProps = {
		rankdir: 'TB',
		zoomable: false,
		fitBoundaries: false,
		className: 'dagre-d3-react'
	}
	componentDidMount() {
		this._drawChart()
	}

	componentDidUpdate(prevProps) {
		//if (prevProps.nodes.length != this.props.nodes.length) {
		this._drawChart()
		//}
	}

	_getNodeData(id: any) {
		return this.props.nodes.find(node => node.id === id)
	}

	_drawChart = () => {
		let {
			nodes,
			links,
			zoomable,
			fitBoundaries,
			rankdir,
			animate,
			shape,
			onNodeClick,
			onNodeRightClick,
			onNodeDoubleClick,
			onRelationshipClick,
			onRelationshipRightClick,
			onRelationshipDoubleClick
		} = this.props
		let g = new dagreD3.graphlib.Graph().setGraph({ rankdir })

		nodes.forEach(node =>
			g.setNode(node.id, { label: node.label, class: node.class || '', labelType: node.labelType || 'string' })
		)

		// Round the corners of the nodes
		g.nodes().forEach(function (v) {
		    var node = g.node(v);
		    node.rx = node.ry = 5;
		});

		links.forEach(link => g.setEdge(link.source, link.target, { label: link.label || '', class: link.class || '' }))

		let svg: any = d3.select(this.svg.current)
		let inner: any = d3.select(this.innerG.current)

		this.renderER(inner, g)
		
		let zoom = d3.zoom().on('zoom', () => inner.attr('transform', d3.event.transform))
		if (zoomable) {
			svg.call(zoom)
		}
		if (animate) {
			g.graph().transition = function transition(selection) {
				return selection.transition().duration(animate || 1000)
			}
		}

		if (fitBoundaries) {
			var bounds = inner.node().getBBox();
      var parent = inner.node().parentElement;
      var fullWidth = parent.clientWidth || parent.parentNode.clientWidth,
        fullHeight = parent.clientHeight || parent.parentNode.clientHeight;
      var width = bounds.width,
        height = bounds.height;
      var midX = bounds.x + width / 2,
        midY = bounds.y + height / 2;
      if (width == 0 || height == 0) return; // nothing to fit
      var scale = 0.85 / Math.max(width / fullWidth, height / fullHeight);
      var translate = [
        fullWidth / 2 - scale * midX,
        fullHeight / 2 - scale * midY
      ];

      var transform = d3.zoomIdentity
        .translate(translate[0], translate[1])
        .scale(scale);

      svg
        .transition()
        .duration(animate || 0) // milliseconds
        .call(zoom.transform, transform);
			/*let _initial_scale = 0.5
			svg.call(
				zoom.transform,
				d3.zoomIdentity.translate((svg.attr('width') - g.graph().width * _initial_scale) / 2, 20).scale(_initial_scale)
			)
			svg.attr('height', g.graph().height * _initial_scale + 180)*/
		}

		if (onNodeClick) {
			svg.selectAll('g.node').on('click', (id: any) => {
				let _node = g.node(id)
				let _original = this._getNodeData(id)
				onNodeClick({ d3node: _node, original: _original })
			})
		}

		if (onNodeRightClick) {
			svg.selectAll('g.node').on('contextmenu', (id: any) => {
				let _node = g.node(id)
				let _original = this._getNodeData(id)
				onNodeRightClick({ d3node: _node, original: _original })
			})
		}
		if (onNodeDoubleClick) {
			svg.selectAll('g.node').on('dblclick', (id: any) => {
				let _node = g.node(id)
				let _original = this._getNodeData(id)
				onNodeDoubleClick({ d3node: _node, original: _original })
			})
		}

		if (onRelationshipClick) {
			svg.selectAll('g.edgeLabel').on('click', (id: Relationship) => {
				let _source = g.node(id.w)
				let _original_source = this._getNodeData(id.w)

				let _target = g.node(id.v)
				let _original_target = this._getNodeData(id.v)
				onRelationshipClick({
					d3source: _source,
					source: _original_source,
					d3target: _target,
					target: _original_target
				})
			})
		}
		if (onRelationshipRightClick) {
			svg.selectAll('g.edgeLabel').on('contextmenu', (id: Relationship) => {
				let _source = g.node(id.w)
				let _original_source = this._getNodeData(id.w)

				let _target = g.node(id.v)
				let _original_target = this._getNodeData(id.v)
				onRelationshipRightClick({
					d3source: _source,
					source: _original_source,
					d3target: _target,
					target: _original_target
				})
			})
		}
		if (onRelationshipDoubleClick) {
			svg.selectAll('g.edgeLabel').on('dblclick', (id: Relationship) => {
				let _source = g.node(id.w)
				let _original_source = this._getNodeData(id.w)
				let _target = g.node(id.v)
				let _original_target = this._getNodeData(id.v)
				onRelationshipDoubleClick({
					d3source: _source,
					source: _original_source,
					d3target: _target,
					target: _original_target
				})
			})
		}
	}

	render() {
		return (
			<svg width={this.props.width} height={this.props.height} ref={this.svg} className={this.props.className || ''}>
				<g ref={this.innerG} />
			</svg>
		)
	}
}

export default DagreGraph;
