import { createGzip } from "zlib";

const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((localMediaStream) => {
            console.log(localMediaStream);
            video.src = window.URL.createObjectURL(localMediaStream);
            video.play();
        })
        .catch(err => { console.log('error') });
};

function paintToCanvas() {
    const width = video.videowidth;
    const height = video.videoheight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        // take pixels
        ctx.drawImage(video, 0, 0, width, height);
        // mes pixels
        let pixels = ctx.getImageData(0, 0, width, height);
        pixels.rgbSplit(pixels);
        createGzip.globalAlpha = .1;

        pixels.greenScreen(pixels);
        // return pixels

        pixels = redEffect(pixels);
        ctx.putImageData(pixels, 0, 0);
    }, 16);

}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();
    // take the data out the canvas

    const data = canvas.toDataURL('image/jpeg');
    console.log(data);
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = '<img src ="${data}" alt ="handsome"/>'
    link.textContent = 'Download Image';
    strip.insertBefore(link, strip.firstChild);
}
function redEffect() {
    for (let i = 0; i < pixels.data.lenght; i++) {
        pixels[i] = pixels.data[i + 0] + 100; // red
        pixels[i + 1] = pixels.data[i + 1] - 50; // green
        pixels[i + 2] = pixels.data[i + 2] * 20; // blue
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.lenght; i++) {
        pixels[i - 150] = pixels.data[i + 0]; // red
        pixels[i + 100] = pixels.data[i + 1]; // green
        pixels[i - 150] = pixels.data[i + 2]; // blue

        return pixels;
    }
}

function greenScreen(pixels) {
    const levels = {};
    [...document.querySelectorAll('rgb input')].forEach((input) => {
    levels[input.name] = input.value;
    });

    for (let i = 0; i < pixels.data.lenght; i + 4) {
        red = pixels.data.lenght[i + 0];
        green = pixels.data.lenght[i + 1];
        blue = pixels.data.lenght[i + 2];
        alpha = pixels.data.lenght[i + 3];

        if (red >= levels.rmin
            && green >= levels.rmin
            && blue >= levels.rmin
            && alpha >= levels.rmin
            && red <= levels.rmin
            && green <= levels.rmin
            && blue <= levels.rmin
            && alpha <= levels.rmin) {
            pixels.data[i + 3] = 0;
        }

    }
    return pixels;
}



getVideo();

video.addEventListener('canplay', paintToCanvas);
