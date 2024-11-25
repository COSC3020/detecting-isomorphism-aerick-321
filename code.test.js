const fs = require('fs');
const jsc = require('jsverify');
const { are_isomorphic } = require('./code');

// Helper function to build an adjacency matrix from edges
function buildGraph(edges) {
    let maxVertex = edges.reduce((max, [src, dest]) => Math.max(max, src, dest), 0);
    let matrix = Array.from({ length: maxVertex + 1 }, () => Array(maxVertex + 1).fill(0));

    edges.forEach(([src, dest]) => {
        matrix[src][dest] = 1;
        matrix[dest][src] = 1; // Assuming an undirected graph
    });

    return matrix;
}

// Generate sparse graphs with limited size
const limitedEdges = jsc.suchthat(
    jsc.array(jsc.tuple([jsc.nat(7), jsc.nat(7)])), // Pairs of vertices between 0 and 7
    edges => edges.length <= 10 // Sparse graph (max 10 edges)
);

// Property-based test to check if the isomorphism function works
const test = jsc.forall(limitedEdges, function(edges) {
    if (edges.length === 0) return true; // Empty graph is trivially isomorphic

    // Build two graphs
    let graph1 = buildGraph(edges);
    let reversedEdges = edges.map(([src, dest]) => [dest, src]); // Reverse edges
    let graph2 = buildGraph(reversedEdges);

    // Test `are_isomorphic` function
    return are_isomorphic(graph1, graph2);
});

// Assert the test with fewer cases
jsc.assert(test, { tests: 100 });
