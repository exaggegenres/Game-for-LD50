function renderSide0(x, y, z, halfsizeX, halfsizeY, norm) {
    let x1 = x-halfsizeX;
    let y1 = y-halfsizeY;
    let x2 = x-halfsizeX;
    let y2 = y+halfsizeY;
    let x3 = x+halfsizeX;
    let y3 = y+halfsizeY;
    let x4 = x+halfsizeX;
    let y4 = y-halfsizeY;
    
    let tsx = halfsizeX;
    let tsy = halfsizeY;

    if(norm) {
        tsx = 0.99;
        tsy = 0.99;
    }
    let verts = [x2, y2, z, 0.01, 0.01,
        x3, y3, z, tsx, 0.01,
        x4, y4, z, tsx, tsy,
        x4, y4, z, tsx, tsy,
        x1, y1, z, 0.01, tsy,
        x2, y2, z, 0.01, 0.01,
    ];

    let polID = lastIndex;
    for(let i = 0; i < verts.length; i++) {
        globalVertices[polID+i] = verts[i];
        lastIndex++;
    }
    lastVertex+=verts.length/5;
}

function renderSide1(x, y, z, halfsizeZ, halfsizeY, norm) {
    let z1 = z-halfsizeZ;
    let y1 = y-halfsizeY;
    let z2 = z-halfsizeZ;
    let y2 = y+halfsizeY;
    let z3 = z+halfsizeZ;
    let y3 = y+halfsizeY;
    let z4 = z+halfsizeZ;
    let y4 = y-halfsizeY;
    
    let tsz = halfsizeZ;
    let tsy = halfsizeY;

    if(norm) {
        tsz = 0.99;
        tsy = 0.99;
    }

    let verts = [x, y2, z2, tsz, 0.01,
        x, y3, z3, 0.01, 0.01,
        x, y4, z4, 0.01, tsy,
        x, y4, z4, 0.01, tsy,
        x, y1, z1, tsz, tsy,
        x, y2, z2, tsz, 0.01,
    ];

    let polID = lastIndex;
    for(let i = 0; i < verts.length; i++) {
        globalVertices[polID+i] = verts[i];
        lastIndex++;
    }
    lastVertex+=verts.length/5;
}

function renderSide2(x, y, z, halfsizeX, halfsizeZ, norm) {
    let x1 = x-halfsizeX;
    let z1 = z-halfsizeZ;
    let x2 = x-halfsizeX;
    let z2 = z+halfsizeZ;
    let x3 = x+halfsizeX;
    let z3 = z+halfsizeZ;
    let x4 = x+halfsizeX;
    let z4 = z-halfsizeZ;
    
    let tsx = halfsizeX;
    let tsz = halfsizeZ;

    if(norm) {
        tsx = 0.99;
        tsz = 0.99;
    }

    let verts = [x2, y, z2, 0.01, 0.01,
        x3, y, z3, tsx, 0.01,
        x4, y, z4, tsx, tsz,
        x4, y, z4, tsx, tsz,
        x1, y, z1, 0.01, tsz,
        x2, y, z2, 0.01, 0.01,
    ];

    let polID = lastIndex;
    for(let i = 0; i < verts.length; i++) {
        globalVertices[polID+i] = verts[i];
        lastIndex++;
    }
    lastVertex+=verts.length/5;
}

function renderSprite(x, y, z, halfsizeX, halfsizeY, norm, ax) {
    let x1 = x-halfsizeX*Math.cos(ax);
    let y1 = y-halfsizeY;
    let z1 = z-halfsizeX*Math.sin(ax);
    let x2 = x-halfsizeX*Math.cos(ax);
    let y2 = y+halfsizeY;
    let z2 = z-halfsizeX*Math.sin(ax);
    let x3 = x+halfsizeX*Math.cos(ax);
    let y3 = y+halfsizeY;
    let z3 = z+halfsizeX*Math.sin(ax);
    let x4 = x+halfsizeX*Math.cos(ax);
    let y4 = y-halfsizeY;
    let z4 = z+halfsizeX*Math.sin(ax);

    let tsx = halfsizeX;
    let tsy = halfsizeY;

    if(norm) {
        tsx = 0.99;
        tsy = 0.99;
    }
    let verts = [x2, y2, z2, 0.01, 0.01,
        x3, y3, z3, tsx, 0.01,
        x4, y4, z4, tsx, tsy,
        x4, y4, z4, tsx, tsy,
        x1, y1, z1, 0.01, tsy,
        x2, y2, z2, 0.01, 0.01,
    ];

    let polID = lastIndex;
    for(let i = 0; i < verts.length; i++) {
        globalVertices[polID+i] = verts[i];
        lastIndex++;
    }
    lastVertex+=verts.length/5;
}

function renderWallCentered(x, y, z, w, h, d, clamp) {
    renderSide0(x, y, z+d, w, h, clamp);
    renderSide0(x, y, z-d, w, h, clamp);
    renderSide1(x+w, y, z, d, h, clamp);
    renderSide1(x-w, y, z, d, h, clamp);
    renderSide2(x, y+h, z, w, d, clamp);
    renderSide2(x, y-h, z, w, d, clamp);
}

function renderWallEdged(x, y, z, w, h, d) {
    let cpx = x+w;
    let cpy = y+h;
    let cpz = z+d;
    
    renderSide0(w, h, d, w, h, false);
    renderSide0(cpx-w, cpy-h, -d, w, h, false);
    renderSide1(w, 0, 0, d, h, false);
    renderSide1(-w, 0, 0, d, h, false);
    renderSide2(0, h, 0, w, d, false);
    renderSide2(0, -h, 0, w, d, false);
}
