function createShader(gl, src, t) {
    var shader = gl.createShader(t);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        let i = gl.getShaderInfoLog(shader);
        console.log(i);
    }

    return shader;
}

function createProgram(gl, vsrc, fsrc) {
    let vertexShader = createShader(gl, vsrc, gl.VERTEX_SHADER);
    let fragmentShader = createShader(gl, fsrc, gl.FRAGMENT_SHADER);

    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    return program;
}

function uniform4fvsh(shader, mat, data) {
    let loc = gl.getUniformLocation(shader, mat);
    gl.uniformMatrix4fv(loc, false, data);
}

function uniform3fvsh(shader, vec, data) {
    let loc = gl.getUniformLocation(shader, vec);
    gl.uniform3fv(loc, data);
}

function uniform1ish(shader, uniform, data) {
    let loc = gl.getUniformLocation(shader, uniform);
    gl.uniform1i(loc, data); 
}

function uniform1fsh(shader, uniform, data) {
    let loc = gl.getUniformLocation(shader, uniform);
    gl.uniform1f(loc, data); 
}