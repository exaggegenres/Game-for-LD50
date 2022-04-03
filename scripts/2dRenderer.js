var font = "abcdefghijklmnopqrstuvwxyz.,0123456789%-_+/:";

function addQuad(x, y, tw, th, bw, bh, nx, ny, w, h, r, g, b) {

    let xt1 = x/bw;
    let yt1 = y/bh;
    let xt2 = (x+tw)/bw;
    let yt2 = y/bh;
    let xt3 = (x+tw)/bw;
    let yt3 = (y+th)/bh;
    let xt4 = x/bw;
    let yt4 = (y+th)/bh;

    let cx = nx;
    let cy = ny;
    
    VTCC(cx, cy+h, -1.0, xt1, yt1, r, g, b);
    VTCC(cx+w, cy+h, -1.0, xt2, yt2, r, g, b);
    VTCC(cx+w, cy+0, -1.0, xt3, yt3, r, g, b);
    VTCC(cx+w, cy+0, -1.0, xt3, yt3, r, g, b);
    VTCC(cx+0, cy+0, -1.0, xt4, yt4, r, g, b);
    VTCC(cx+0, cy+h, -1.0, xt1, yt1, r, g, b);
}

function renderString(text, xx, yy, cw, ch, r, g, b) {
    clearglobalVertices();

    fontCharacters = font.split('');
    textCharacters = text.split('');
    for(let i = 0; i < textCharacters.length; i++) {
        if(textCharacters[i] != ' ') {
            let pos = font.indexOf(textCharacters[i])

            let xf = canvas.width/canvas.height;
            let x = pos%16;
            let y = Math.trunc(pos/16);

            addQuad(x, y, 1.0, 1.0, 16.0, 16.0, xx+i*cw, yy, cw, ch, r, g, b);
        }
    }

    bindTexture(guiTexLists[0]);

    setVBO(gl, vb, globalVertices);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.drawArrays(gl.TRIANGLES, 0, lastVertex);
}

function renderStringCentered(text, xx, yy, cw, ch, r, g, b) {
    let length = text.length*cw;
    renderString(text, xx-length/2, yy-ch/2, cw, ch, r, g, b);
}

function renderGradientButton(x, y, w, h, r, g, b, r2, g2, b2) {

    clearglobalVertices();

    let cx = x;
    let cy = y;
    
    gl.disable(gl.TEXTURE_2D);

    VTCC(cx, cy+h, -1.0, 0.0, 0.0, r, g, b);
    VTCC(cx+w, cy+h, -1.0, 1.0, 0.0, r, g, b);
    VTCC(cx+w, cy+0, -1.0, 1.0, 1.0, r2, g2, b2);
    VTCC(cx+w, cy+0, -1.0, 1.0, 1.0, r2, g2, b2);
    VTCC(cx+0, cy+0, -1.0, 0.0, 1.0, r2, g2, b2);
    VTCC(cx+0, cy+h, -1.0, 0.0, 0.0, r, g, b);
    
    setVBO(gl, vb, globalVertices);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.drawArrays(gl.TRIANGLES, 0, lastVertex);
}

function renderGradientButtonCentered(x, y, w, h, r, g, b, r2, g2, b2) {
    let ww = w;
    let hh = h;
    renderGradientButton(-ww/2+x, -hh/2+y, ww, hh, r, g, b, r2, g2, b2);
}