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
    perform();
});

const density = "Ñ@#W$9876543210?!abc;:+=-,._1                    ";
// const density = '       .:-i|=+%O#@'
let vx = 50;
let vy = 50;
let main = () => {
    fillData();
    requestAnimationFrame(main);
}

function convertRange( value, r1, r2 ) {
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}
console.log(canvas.width);

let fillData = () => {
    let line = '';
    for(let y = 0; y < vy; y++) {
        for(let x = 0; x < vx; x++) {
            let pixel = ctx2.getImageData(x, y, 1, 1).data;
            let avg = (pixel[0] + pixel[1] + pixel[2]) / 3;


            let char = density.charAt(Math.floor(convertRange(avg, [0, 255], [0, density.length])));
            // ctx2.fillStyle = `rgb(${pixel[0] / 3}, ${pixel[1] / 3}, ${pixel[2] / 3})`;
            // ctx2.fillRect(x, y, 1, 1);

            if (char === ' ') {
                char = '&nbsp;';
            }
            line += char;
        }
        line += '</br>';
    }

    // perform();
    document.getElementById('ascii').innerHTML = line;
    // ctx.getImageData(x, y, 1, 1);
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
        const mask = bodyPix.toMask(
            multiPersonSegmentation, foregroundColor, backgroundColor,
            false);

        // const mask = bodyPix.toColoredPartMask(multiPersonSegmentation, false);

        bodyPix.drawMask(canvas, video,mask, 1, 0, 1);

        requestAnimationFrame(bodySegmentationFrame);
    }

    bodySegmentationFrame();
}

async function estimateSegmentation() {
    return await net.segmentPerson(video);
}


window.addEventListener('load', async function() {
    // perform();
})




main();



