const constraints = {
    video: {
        width: 400,
        height: 400,
    }
};

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let canvas2 = document.getElementById('canvas2');
let ctx2 = canvas2.getContext('2d');

const video = document.querySelector("video");

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;
});

video.addEventListener('loadeddata', () => {
    perform();
})

const density = "Ñ@#W$9876543210?!abc;:+=-,._  ";
// const density = '       .:-i|=+%O#@'
let vx = 100;
let vy = 50;
let main = () => {
    fillData();
    requestAnimationFrame(main);
}

function convertRange( value, r1, r2 ) {
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}
console.log(canvas.width);

canvas2.width = 100;
canvas2.height = 50;

const toGrayScale = (r, g, b) => 0.21 * r + 0.72 * g + 0.07 * b;

imgData = '';

let fillData = () => {

    let img = document.getElementById('image');
    img.src = canvas.toDataURL();
    img.style.width = '100px';

    ctx2.drawImage(img, 0, 0, 100, 50);

    let line = '';
    for(let y = 0; y < vy; y++) {
        for(let x = 0; x < vx; x++) {
            let pixel = ctx2.getImageData(x, y, 1, 1).data;
            let avg = toGrayScale(pixel[0], pixel[1], pixel[2]);

            let char = density.charAt(Math.floor(convertRange(avg, [0, 255], [0, density.length])));

            if (char === ' ') {
                char = '&nbsp;';
            }
            line += char;
        }
        line += '</br>';
    }

    document.getElementById('ascii').innerHTML = line;
}

async function perform() {
    net = await bodyPix.load();
    segmentBodyInRealTime();
}

function segmentBodyInRealTime() {
    async function bodySegmentationFrame() {
        const multiPersonSegmentation = await estimateSegmentation();
        const foregroundColor = {r: 255, g: 255, b: 255, a: 0};
        const backgroundColor = {r: 255, g: 255, b: 255, a: 255};
        const mask = bodyPix.toMask(multiPersonSegmentation, foregroundColor, backgroundColor, false);

        bodyPix.drawMask(canvas, video,mask, 1, 0, 1);

        requestAnimationFrame(bodySegmentationFrame);
    }

    bodySegmentationFrame();
}

async function estimateSegmentation() {
    return await net.segmentPerson(video);
}

main();



