import { EdgeData, NodeData } from '@/shared/types/edgify.types';

interface GraphNode extends NodeData {
  rank?: number;
  order?: number;
}

export const layoutNodes = (nodes: NodeData[], edges: EdgeData[]): NodeData[] => {
  const graphNodes: GraphNode[] = JSON.parse(JSON.stringify(nodes));
  const VERTICAL_SPACING = 100;
  const HORIZONTAL_SPACING = 200;

  // Assign ranks (layers) using a simplified topological sort
  const assignRanks = () => {
    const visited = new Set<string>();
    const rankMap = new Map<string, number>();

    const dfs = (nodeId: string, rank = 0) => {
      visited.add(nodeId);
      rankMap.set(nodeId, Math.max(rank, rankMap.get(nodeId) || 0));

      edges
        .filter((e) => e.source === nodeId)
        .forEach((e) => {
          if (!visited.has(e.target)) {
            dfs(e.target, rank + 1);
          }
        });
    };

    // Start DFS from nodes with no incoming edges
    const hasIncoming = new Set(edges.map((e) => e.target));
    graphNodes.filter((n) => !hasIncoming.has(n.id)).forEach((n) => dfs(n.id));

    // Assign ranks to nodes
    graphNodes.forEach((node) => {
      node.rank = rankMap.get(node.id) || 0;
    });
  };

  // Assign horizontal positions within ranks to minimize edge crossings
  const assignOrders = () => {
    const rankGroups = new Map<number, GraphNode[]>();
    graphNodes.forEach((node) => {
      if (!rankGroups.has(node.rank!)) {
        rankGroups.set(node.rank!, []);
      }
      rankGroups.get(node.rank!)!.push(node);
    });

    rankGroups.forEach((nodes, rank) => {
      nodes.sort((a, b) => {
        const aConnections = edges.filter((e) => e.source === a.id || e.target === a.id).length;
        const bConnections = edges.filter((e) => e.source === b.id || e.target === b.id).length;
        return bConnections - aConnections;
      });

      nodes.forEach((node, index) => {
        node.order = index;
      });
    });
  };

  // Apply layout
  assignRanks();
  assignOrders();

  // Calculate final positions
  graphNodes.forEach((node) => {
    node.position = {
      x: node.order! * HORIZONTAL_SPACING + 50,
      y: node.rank! * VERTICAL_SPACING + 50,
    };
  });

  return graphNodes;
};
