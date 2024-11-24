function degSeq (graph, vert){
    let degree = 0;
    for(let i = 0; i < graph.vert; i++)
    {
        if (graph.dir[vert][i] == 1)
            degree++;
    }
    if (graph.dir[vert][vert] == 1) 
        degree++;
         
    return degree;
}

function numedge(graph){
    let list = [];
    let edge = 0;
    for (let i= 0; i < graph.length; i++){
        list[i] = [];
        for(let j = 0; j < graph[i].length; j++) {
            if(adjMatrix[i][j] === 1){
               edge++;
            }
        }
    }
    return edge;
}

function are_isomorphic (graph1, graph2) {
    if (graph1.length !== graph2.length) return false;
    if (degSeq(graph1) === degSeq(graph2) && numedge(graph1) === numedge(graph2) && graph1.length === graph2.length) {
        return true;
    }
    else {
        return false;
    }
}
