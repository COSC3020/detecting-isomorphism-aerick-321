const fs = require('fs');
const jsc = require('jsverify');

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

// Property-based test to check if the isomorphism function works
const test = jsc.forall("array (pair nat nat)", function(edges) {
    // Ensure the edges array has at least one edge
    if (edges.length === 0) return true;

    // Build two graphs using the same edges but reversing the edge order for the second graph
    let graph1 = buildGraph(edges);
    let graph2 = buildGraph(edges.slice().reverse()); // Reverse edges without modifying the original array

    // Test your `are_isomorphic` function
    return are_isomorphic(graph1, graph2);
});

// Assert the test
jsc.assert(test, { tests: 1000 });
