let globalVertices = [];
let lastIndex = 0;
let lastVertex = 0;

function setVBO(gl, vb, va) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(va),
        gl.STATIC_DRAW
    );
}

function setVAO(shad, attr, size, offs, stride) {
    const position = gl.getAttribLocation(shad, attr);
    gl.vertexAttribPointer(position, size, gl.FLOAT, false, stride, offs);
    gl.enableVertexAttribArray(position);
}

function V(x, y, z) {
    globalVertices[lastIndex] = x;
    lastIndex++;
    globalVertices[lastIndex] = y;
    lastIndex++;
    globalVertices[lastIndex] = z;
    lastIndex++;
}

function TC(u, v) {
    globalVertices[lastIndex] = u;
    lastIndex++;
    globalVertices[lastIndex] = v;
    lastIndex++;
}

function VTC(x, y, z, u, v) {
    globalVertices[lastIndex] = x;
    lastIndex++;
    globalVertices[lastIndex] = y;
    lastIndex++;
    globalVertices[lastIndex] = z;
    lastIndex++;
    globalVertices[lastIndex] = u;
    lastIndex++;
    globalVertices[lastIndex] = v;
    lastIndex++;

    lastVertex++;
}

function VTCC(x, y, z, u, v, r, g, b) {
    globalVertices[lastIndex] = x;
    lastIndex++;
    globalVertices[lastIndex] = y;
    lastIndex++;
    globalVertices[lastIndex] = z;
    lastIndex++;
    globalVertices[lastIndex] = u;
    lastIndex++;
    globalVertices[lastIndex] = v;
    lastIndex++;
    globalVertices[lastIndex] = r;
    lastIndex++;
    globalVertices[lastIndex] = g;
    lastIndex++;
    globalVertices[lastIndex] = b;
    lastIndex++;
    
    lastVertex++;
}

function clearglobalVertices() {
    globalVertices = [];
    lastIndex = 0;
    lastVertex = 0;
}

