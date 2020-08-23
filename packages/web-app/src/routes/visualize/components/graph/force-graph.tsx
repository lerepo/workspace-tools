import React, { useCallback, useEffect, useState, useRef } from 'react';

import { useTheme, useMediaQuery } from '@material-ui/core';
import ForceGraph2D from 'react-force-graph-2d';

import useWindowDimensions from '~/hooks/useWindowDimensions';
import { useAppDrawer } from '~/contexts/use-app-drawer';
import { Workspace } from '~/model/workspace';

type Link = {
  source: string;
  target: string;
};

type Node = {
  id: string;
  name: string;
  neighbors: Array<Node>;
  links: Array<Link>;
};

export const ForceGraph: React.FC<{ data: Workspace[]; selection: string[] }> = ({
  data,
  selection
}) => {
  const drawer = useAppDrawer();
  const fgRef = useRef<typeof ForceGraph2D>();

  const NODE_R = 4;

  const [graphData, setGraphData] = useState({
    nodes: [] as Array<Node>,
    links: [] as Array<Link>
  });
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const theme = useTheme();
  const xsup = useMediaQuery(theme.breakpoints.up('xs')); // && useMediaQuery('orientation:landscape');
  const smup = useMediaQuery(theme.breakpoints.up('sm'));
  const lgup = useMediaQuery(theme.breakpoints.up('lg'));
  const { height: vheight, width: vwidth } = useWindowDimensions();

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  const handleNodeHover = (node) => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node);
      node.neighbors.forEach((neighbor) => highlightNodes.add(neighbor));
      node.links.forEach((link) => highlightLinks.add(link));
    }

    setHoverNode(node || null);
    updateHighlight();
  };

  const paintRing = useCallback(
    (node, ctx) => {
      // add ring just for highlighted nodes
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
      ctx.fillStyle = node === hoverNode ? 'red' : 'orange';
      ctx.fill();
    },
    [hoverNode]
  );

  useEffect(() => {
    const nodes: Array<Node> = [];
    const links: Array<Link> = [];

    data
      ?.filter((item) => selection.includes(item.location))
      .map((workspace) => {
        const node = { id: workspace.location, name: workspace.name, neighbors: [], links: [] };
        if (workspace.dependencies) {
          const depLinks = workspace.dependencies
            .filter((dep) => selection.includes(dep))
            .map((location) => {
              return {
                source: workspace.location,
                target: location
              };
            });
          links.push(...depLinks);
        }
        nodes.push(node);
      });

    // cross-link node objects
    links.forEach((link) => {
      const a = nodes.find((node) => node.id == link.source);
      const b = nodes.find((node) => node.id == link.target);
      if (a && b) {
        !a.neighbors && (a.neighbors = []);
        !b.neighbors && (b.neighbors = []);
        a.neighbors.push(b);
        b.neighbors.push(a);

        !a.links && (a.links = []);
        !b.links && (b.links = []);
        a.links.push(link);
        b.links.push(link);
      }
    });

    setGraphData({
      nodes: nodes,
      links: links
    });
  }, [data, selection]);

  useEffect(() => {
    const adjustHeight = 6;

    setWidth(vwidth);
    setHeight(vheight - 56 - adjustHeight);
    console.log(`media default`);

    if (lgup) {
      setHeight(vheight - 64 - adjustHeight);
      setWidth(vwidth - DRAWER_WIDTH);
      console.log(`lgup`);
    } else if (smup) {
      setHeight(vheight - 64 - adjustHeight);
      setWidth(drawer?.isOpen ? vwidth - DRAWER_WIDTH : vwidth);
      console.log(`smup`);
    } else if (xsup) {
      setHeight(vheight - 56 - adjustHeight);
      console.log(`xsup`);
    }
    console.log(`width=${width}  height=${height}`);
  }, [vwidth, vheight, lgup, smup, xsup, width, height, drawer?.isOpen]);

  return (
    <ForceGraph2D
      ref={fgRef}
      cooldownTicks={100}
      onEngineStop={() => fgRef.current.zoomToFit(400)}
      width={width}
      height={height}
      graphData={graphData}
      linkColor={() => 'darkgrey'}
      linkDirectionalArrowLength={3.5}
      linkDirectionalArrowRelPos={1}
      linkCurvature={0.25}
      nodeRelSize={NODE_R}
      linkWidth={(link) => (highlightLinks.has(link) ? 5 : 1)}
      linkDirectionalParticles={4}
      linkDirectionalParticleWidth={(link) => (highlightLinks.has(link) ? 4 : 0)}
      nodeCanvasObjectMode={(node) => (highlightNodes.has(node) ? 'before' : undefined)}
      nodeCanvasObject={paintRing}
      onNodeHover={handleNodeHover}
    />
  );
};
