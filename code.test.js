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

// Helper function to create an isomorphic graph by relabeling vertices
function createIsomorphicGraph(graph, mapping) {
    const n = graph.length;
    let newGraph = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            newGraph[mapping[i]][mapping[j]] = graph[i][j];
        }
    }

    return newGraph;
}

// Property-based test for isomorphism correctness
const test = jsc.forall(jsc.array(jsc.tuple([jsc.nat(7), jsc.nat(7)])), edges => {
    // Build original graph
    let graph1 = buildGraph(edges);

    // Skip if graph has no edges (trivial case)
    if (edges.length === 0) return true;

    // Create an isomorphic graph by relabeling vertices
    let mapping = [...Array(graph1.length).keys()].sort(() => Math.random() - 0.5); // Random permutation
    let graph2 = createIsomorphicGraph(graph1, mapping);

    // Assert that the function correctly identifies isomorphic graphs
    if (!are_isomorphic(graph1, graph2)) {
        console.error('Failed isomorphic test:', { graph1, graph2, mapping });
        return false;
    }

    // Modify graph2 to make it non-isomorphic
    if (graph2.length > 1) {
        graph2[0][1] = 1 - graph2[0][1]; // Flip one edge
    }

    // Assert that the function correctly identifies non-isomorphic graphs
    if (are_isomorphic(graph1, graph2)) {
        console.error('Failed non-isomorphic test:', { graph1, graph2 });
        return false;
    }

    return true;
});

// Run the test with fewer cases for faster results
jsc.assert(test, { tests: 100 });
