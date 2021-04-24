const replaceGreenScreen = (e) => {
    let frame = e.data
    let data = frame.data;
    let len = data.length;
    for (let i = 0, j = 0; j < len; i++, j += 4) {
        // Convert from RGB to HSL...
        let hsl = rgb2hsl(data[j], data[j + 1], data[j + 2]);
        let h = hsl[0],
            s = hsl[1],
            l = hsl[2];

        // ... and check if we have a somewhat green pixel.
        if (h >= 90 && h <= 160 && s >= 25 && s <= 90 && l >= 20 && l <= 75) {
            data[j + 3] = 0;
        }
    }
    postMessage(frame);
};

function rgb2hsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;

    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
    var h, s, l;

    if (max == min) {
        h = 0;
    } else if (r == max) {
        h = (g - b) / delta;
    } else if (g == max) {
        h = 2 + (b - r) / delta;
    } else if (b == max) {
        h = 4 + (r - g) / delta;
    }

    h = Math.min(h * 60, 360);

    if (h < 0) {
        h += 360;
    }

    l = (min + max) / 2;

    if (max == min) {
        s = 0;
    } else if (l <= 0.5) {
        s = delta / (max + min);
    } else {
        s = delta / (2 - max - min);
    }

    return [h, s * 100, l * 100];
}

onmessage = replaceGreenScreen;