const fs = require('fs');
const jsc = require('jsverify');

// The function to check if two graphs are isomorphic
function areIsomorphic(graph1, graph2) {
    // Check if they have the same number of nodes
    if (Object.keys(graph1).length !== Object.keys(graph2).length) return false;
    
    // Convert adjacency list to sorted edge lists
    const adjList1 = convertToAdjList(graph1);
    const adjList2 = convertToAdjList(graph2);
    
    // Compare the adjacency lists
    return JSON.stringify(adjList1) === JSON.stringify(adjList2);
}

// Convert adjacency matrix to adjacency list
function convertToAdjList(graph) {
    let adjList = [];
    for (let node in graph) {
        adjList[node] = [...new Set(graph[node].sort())];
    }
    return adjList;
}

// Property-based test using jsverify
const test = jsc.forall("array (pair nat nat)", function(edges) {
    let max = edges.reduce((a, b) => Math.max(a, Math.max(b[0], b[1])), 0);
    
    let graph1 = buildGraph(edges);
    let graph2 = buildGraph(edges.reverse()); // Create a second graph by reversing edges
    
    // Ensure the graphs are isomorphic (this could be adjusted for different cases)
    return areIsomorphic(graph1, graph2);
});

// Helper function to build a graph from edges
function buildGraph(edges) {
    let graph = {};
    edges.forEach(([src, dest]) => {
        if (!graph[src]) graph[src] = [];
        if (!graph[dest]) graph[dest] = [];
        graph[src].push(dest);
        graph[dest].push(src); // assuming undirected graph
    });
    return graph;
}

// Assert the test
jsc.assert(test, { tests: 1000 });

