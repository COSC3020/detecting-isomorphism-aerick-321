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

function areDegreeSequencesEqual(seq1, seq2) {
    if (seq1.length !== seq2.length) return false; 
    for (let i = 0; i < seq1.length; i++) {
        if (seq1[i] !== seq2[i]) return false; 
    }
    return true;
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
    
    let degSeq1 = degSeq(graph1); 
    let degSeq2 = degSeq(graph2);
    if (!areDegreeSequencesEqual(degreeSeq1, degreeSeq2)) return false;
    
    if (numedge(graph1) !== numedge(graph2)) return false;
    
    return true; 
}

module.exports = { are_isomorphic, degSeq, areDegreeSequencesEqual, numedge };
