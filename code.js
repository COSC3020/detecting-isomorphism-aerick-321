function degSeq(graph) {
    let degreeSequence = [];
    for (let i = 0; i < graph.length; i++) {
        let degree = 0;
        for (let j = 0; j < graph.length; j++) {
            if (graph[i][j] === 1) degree++;
        }
        if (graph[i][i] === 1) degree++; 
        degreeSequence.push(degree);
    }
    return degreeSequence.sort((a, b) => a - b); 
}

function hasSameDegreeMultiset(seq1, seq2) {
    if (seq1.length !== seq2.length) return false;

    seq1 = seq1.slice().sort((a, b) => a - b);
    seq2 = seq2.slice().sort((a, b) => a - b);

    for (let i = 0; i < seq1.length; i++) {
        if (seq1[i] !== seq2[i]) return false;
    }
    return true;
}

function permutation(a, num = 0, permutations = []) {
    if (num === a.length - 1) {
        permutations.push([...a]);
        return permutations;
    }
    for (let i = num; i < a.length; i++) {
        [a[i], a[num]] = [a[num], a[i]];
        permutation(a, num + 1, permutations);
        [a[i], a[num]] = [a[num], a[i]];
    }
    return permutations;
}

function preservesAdjacency(graph1, graph2, mapping) {
    let n = graph1.length;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (graph1[i][j] !== graph2[mapping[i]][mapping[j]]) {
                return false;
            }
        }
    }

    return true;
}

function isValidMapping(graph1, graph2) {
    let n = graph1.length;
    let permutations = permutation([...Array(n).keys()]);

    for (let perm of permutations) {
        if (preservesAdjacency(graph1, graph2, perm)) {
            return true; // Found a valid mapping
        }
    }
    return false; // No valid mapping found
}

function numedge(graph){
     let edge = 0;
    for (let i = 0; i < graph.length; i++) {
        for (let j = 0; j < graph[i].length; j++) {
            if (graph[i][j] === 1) edge++;
        }
    }
    return edge / 2;
}

function are_isomorphic (graph1, graph2) {
    if (graph1.length !== graph2.length) return false;
    if (numedge(graph1) !== numedge(graph2)) return false;
    
    let degSeq1 = degSeq(graph1); 
    let degSeq2 = degSeq(graph2);
    if (!hasSameDegreeMultiset(degSeq1, degSeq2)) return false;
    
    return isValidMapping(graph1, graph2); 
}

module.exports = { are_isomorphic, degSeq, hasSameDegreeMultiset, numedge, permutation, isValidMapping, preservesAdjacency};
