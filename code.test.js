const fs = require('fs');
const jsc = require('jsverify');
const { are_isomorphic } = require('./code');

// Helper function to build an adjacency matrix from edges
function buildGraph(edges) {
    let maxVertex = edges.reduce((max, [src, dest]) => Math.max(max, src, dest), 0);
    let matrix = Array.from({ length: maxVertex + 1 }, () => Array(maxVertex + 1).fill(0));

    edges.forEach(([src, dest]) => {
        matrix[src][dest] = 1;
        matrix[dest][src] = 1; // Undirected graph
    });

    return matrix;
}

// Clean edges: remove duplicates and self-loops
function cleanEdges(edges) {
    let uniqueEdges = new Set();
    edges.forEach(([src, dest]) => {
        if (src !== dest) {
            let sortedEdge = [Math.min(src, dest), Math.max(src, dest)].toString();
            uniqueEdges.add(sortedEdge);
        }
    });
    return [...uniqueEdges].map(edge => edge.split(',').map(Number));
}

// Create an isomorphic graph
function createIsomorphicGraph(edges, permutation) {
    return edges.map(([src, dest]) => [permutation[src], permutation[dest]]);
}

// Generate sparse graphs with limited size
const limitedEdges = jsc.suchthat(
    jsc.array(jsc.tuple([jsc.nat(7), jsc.nat(7)])), // Pairs of vertices between 0 and 7
    edges => edges.length <= 10 // Sparse graph (max 10 edges)
);

// Property-based test
const test = jsc.forall(limitedEdges, function(edges) {
    edges = cleanEdges(edges);
    if (edges.length === 0) return true; // Empty graph is trivially isomorphic

    // Build the first graph
    let graph1 = buildGraph(edges);

    // Generate a permutation for isomorphic graph
    let vertexCount = graph1.length;
    let permutation = [...Array(vertexCount).keys()].sort(() => Math.random() - 0.5);
    let isomorphicEdges = createIsomorphicGraph(edges, permutation);
    let graph2 = buildGraph(isomorphicEdges);

    // Verify that the two graphs are isomorphic
    if (!are_isomorphic(graph1, graph2)) {
        console.error("Failed isomorphic case");
        return false;
    }

    // Modify graph2 to make it non-isomorphic and verify
    if (edges.length > 1) {
        let modifiedEdges = edges.slice(0, -1); // Remove an edge
        let nonIsomorphicGraph = buildGraph(modifiedEdges);
        if (are_isomorphic(graph1, nonIsomorphicGraph)) {
            console.error("Failed non-isomorphic case");
            return false;
        }
    }

    return true;
});

// Run the test
jsc.assert(test, {
    tests: 100,
    on_failure: (counterexample) => {
        console.error("Test failed for input:", counterexample);
    }
});
