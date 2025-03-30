let lessonWatched = JSON.parse(localStorage.getItem('lessonWatched')) || [false, false, false, false];
const progress = document.getElementById('progress');
const progressText = document.getElementById('progress-text');

let players = [];

// Called automatically by YouTube API
function onYouTubeIframeAPIReady() {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((iframe, index) => {
        const player = new YT.Player(iframe, {
            events: {
                'onStateChange': (event) => checkProgress(event, index)
            }
        });
        players.push(player);
    });
}

function checkProgress(event, index) {
    if (event.data === YT.PlayerState.PLAYING) {
        const duration = players[index].getDuration();
        const checkInterval = setInterval(() => {
            const currentTime = players[index].getCurrentTime();
            if (currentTime / duration >= 0.5 && !lessonWatched[index]) {
                lessonWatched[index] = true;
                localStorage.setItem('lessonWatched', JSON.stringify(lessonWatched));
                updateProgress();
                clearInterval(checkInterval);
            }
            if (currentTime >= duration) {
                clearInterval(checkInterval);
            }
        }, 1000);
    }
}

function updateProgress() {
    const completed = lessonWatched.filter(x => x).length;
    const total = lessonWatched.length;
    const percent = Math.floor((completed / total) * 100);
    progress.style.width = percent + '%';
    progressText.innerText = `${percent}% Completed`;
}

updateProgress();
