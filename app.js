var vertexShaderText =
    [
        'precision mediump float;',
        '',
        'attribute vec2 vertPosition;',
        'attribute vec3 vertColor;',
        'varying vec3 fragColor;',
        '',
        'void main()',
        '{',
        '   fragColor = vertColor;',
        '   gl_Position = vec4(vertPosition, 0.0, 1.0);',
        '}',
    ].join('\n');

var fragmentShaderText =
    [
        'precision mediump float;',
        '',
        'varying vec3 fragColor;',
        'void main()',
        '{',
        '   gl_FragColor = vec4(fragColor, 1.0);',
        '}'
    ].join('\n');

var initDemo = function () {
    console.log("This is working");

    //Get WebGL context for modern browsers
    var canvas = document.getElementById('game-surface');
    var gl = canvas.getContext('webgl');

    //Get WebGL context for IE and Edge
    if (!gl) {
        console.log('WebGL not support, falling back on experimental')
        gl = canvas.getContext('experimental-webgl');
    }

    //If that didn't work then you are SOL.
    if (!gl) {
        alert('Your browser does not support webgl');
    }

    //Color background drawing window
    gl.clearColor(.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    //CHECK FOR ERRORS IN SHADER COMPILATION
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
        return;
    }

    gl.compileShader(fragmentShader);
    //CHECK FOR ERRORS IN SHADER COMPILATION
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    //CHECK FOR LINKER ERRORS
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR Linking program!', gl.getProgramInfoLog(program));
        return;
    }

    //This will catch additional issues. Shouldn't be used
    //For production code because it is unnecessary and 'expensive'.
    //Good for development
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getProgramInfoLog(program));
        return;
    }

    //
    // Create Buffer
    // This piece of memory only exists in CPU memory
    var triangleVertices =
        [ // x, y           R,G,B
            0.0, 0.5, 1.0, 1.0, 0.0,
            -0.5, -0.5, 0.7, 0.0, 1.0,
            0.5, -0.5, 0.1, 1.0, 0.6
        ];

    //Send information to the graphics card
    var triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation,             //Attrib location
        2,                                  //number of element per attrib
        gl.FLOAT,                           //type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, //size of an individual vertex
        0                                   //Offset from the beginning of a single vertex to this attribute
    );
    gl.vertexAttribPointer(
        colorAttribLocation,                 //Attrib location
        3,                                   //number of element per attrib
        gl.FLOAT,                            //type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,  //size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT   //Offset from the beginning of a single vertex to this attribute
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    //
    //Main render loop
    //

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);




};

