async function setupCamera() {
    const video = document.createElement('video');
    video.width = 640;
    video.height = 480;

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            video.play();
            resolve(video);
        };
    });
}

function countFingers(landmarks) {
    const fingers = [
        { start: 0, tip: 4 },  // Thumb
        { start: 5, tip: 8 },  // Index finger
        { start: 9, tip: 12 }, // Middle finger
        { start: 13, tip: 16 }, // Ring finger
        { start: 17, tip: 20 }  // Little finger
    ];

    let count = 0;
    fingers.forEach(finger => {
        const start = landmarks[finger.start];
        const tip = landmarks[finger.tip];

        // Check if finger is extended (Y-coordinate of tip is less than start)
        if (tip[1] < start[1]) {
            count++;
        }
    });

    return count;
}

async function main() {
    const video = await setupCamera();
    document.body.appendChild(video);

    const model = await handpose.load();

    const fingerCountDiv = document.getElementById('finger-count'); // Get the div to display count

    video.addEventListener('loadeddata', async () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.width;
        canvas.height = video.height;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        async function detectHands() {
            const predictions = await model.estimateHands(video);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            if (predictions.length > 0) {
                predictions.forEach(prediction => {
                    const landmarks = prediction.landmarks;

                    // Draw landmarks
                    landmarks.forEach(([x, y]) => {
                        ctx.beginPath();
                        ctx.arc(x, y, 5, 0, 2 * Math.PI);
                        ctx.fillStyle = 'red';
                        ctx.fill();
                    });

                    // Count fingers
                    const fingerCount = countFingers(landmarks);

                    // Update the div with the count
                    fingerCountDiv.innerText = `Fingers: ${fingerCount}`;
                });
            } else {
                // If no hands detected, set count to 0
                fingerCountDiv.innerText = 'Fingers: 0';
            }

            requestAnimationFrame(detectHands);
        }

        detectHands();
    });
}

main();