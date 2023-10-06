const songs = [
    {
        title: 'Dreamers',
        artist: 'Savoir Adore',
        src: 'https://ts9.tarafdari.com/contents/user763441/content-sound/1._savoir_adore_-_dreamers_128.mp3',
        poster: 'https://i1.sndcdn.com/artworks-000026749975-3onsns-t500x500.jpg'
    },
    {
        title: 'See Spaces',
        artist: 'Teeth ',
        src: 'https://dl.musicdel.ir/Music/1401/03/teeth_see_spaces%20128.mp3',
        poster: 'https://i1.sndcdn.com/artworks-000011444883-7t1isi-t500x500.jpg'
    },
    {
        title: 'They Call Me',
        artist: 'Rednek ',
        src: 'https://ts1.tarafdari.com/contents/user11344/content-sound/rednek_-they_call_me.mp3',
        poster: 'https://upload.wikimedia.org/wikipedia/en/4/46/Pro_Evolution_Soccer_2013_cover.jpg'
    },
    {
        title: 'Ai se eu te pego',
        artist: 'Michel Telo',
        src: 'https://ts1.tarafdari.com/contents/user11344/content-sound/michel_telo_-_ai_se_eu_te_pego.mp3',
        poster: 'https://ts1.tarafdari.com/contents/user332849/content-sound/michel-tel-2_1.jpg'
    },
]

const titleEl = document.getElementById('title');
const artistEl = document.getElementById('artist');
const imageEl = document.getElementById('image');
const progressEl = document.querySelector('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('durationTime');
const repeatBtn = document.getElementById('repeat-btn');
const prevBtn = document.getElementById('prev-btn');
const toggleBtn = document.getElementById('toggle-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const audioEl = document.querySelector('audio');
const openBtn = document.getElementById('open-btn');
const playlist = document.getElementById('playlist');

audioEl.volume = 0.08;

let songIndex = 0;

songs.forEach((song, index) => {

    const playlistAudio = document.createElement('audio');
    playlistAudio.src = song.src;
    playlistAudio.addEventListener('loadedmetadata', () => {
        const duration = getTime(playlistAudio.duration);
        playlistBtn.innerHTML = `
            <span>${song.title}</span>
            <span>${duration}</span>
        `;
    });

    const playlistBtn = document.createElement('button');
    playlistBtn.className = 'flex justify-between p-2 block w-full hover:font-bold transition';
    playlistBtn.setAttribute('data-name', song.title);
    playlist.appendChild(playlistBtn);

    if(index == 0) playlistBtn.classList.add('font-bold');

    playlistBtn.addEventListener('click', () => {

        playlist.querySelector('button.font-bold').classList.remove('font-bold');
        playlistBtn.classList.add('font-bold');

        const findIndex = songs.findIndex(song => {
            return song.title == playlistBtn.dataset.name;
        });
        songIndex = findIndex;
        loadMusic(songIndex);
        play();
    });

});

loadMusic(songIndex)

function loadMusic(index) {
    titleEl.innerText = songs[index].title;
    artistEl.innerText = songs[index].artist;
    imageEl.src = songs[index].poster;
    audioEl.src = songs[index].src;

    audioEl.addEventListener('loadedmetadata', () => {
        const duration = audioEl.duration;
        durationEl.innerText = getTime(duration);
    });

    audioEl.addEventListener('timeupdate', () => {
        const currentTime = audioEl.currentTime;
        currentTimeEl.innerText = getTime(currentTime);
        updateProgressbar(currentTime);
    });

}

function getTime(time) {
    return `${Math.floor(time / 60)}:${`${Math.floor(time % 60)}`.padStart(2,'0')}`;
}

function updateProgressbar(time) {
    progressEl.value = time / audioEl.duration * 100;
}

toggleBtn.addEventListener('click', () => {
    if(toggleBtn.classList.contains('playing')) {
        pause();
    } else {
        play();
    }
});

function play() {
    toggleBtn.classList.add('playing');
    audioEl.play();
}

function pause() {
    toggleBtn.classList.remove('playing');
    audioEl.pause();
}

function next() {
    songIndex++
    if(songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadMusic(songIndex);
    setActivePlayList(songIndex);
    play();
}

function prev() {
    songIndex--
    if(songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadMusic(songIndex);
    setActivePlayList(songIndex);
    play();
}

nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);

openBtn.addEventListener('click', () => {
    if(playlist.classList.contains('max-h-0')) {
        playlist.classList.remove('max-h-0');
        playlist.classList.add('max-h-[300px]');
        playlist.classList.add('pb-6');
        openBtn.classList.add('open');
        setTimeout(() => {
            document.documentElement.scrollTo(0, document.body.scrollHeight);
        }, 500);
    } else {
        playlist.classList.remove('max-h-[300px]');
        playlist.classList.remove('pb-6');
        playlist.classList.add('max-h-0');
        openBtn.classList.remove('open');
    }
});

repeatBtn.addEventListener('click', () => {
    repeatBtn.classList.toggle('repeat');
});

shuffleBtn.addEventListener('click', () => {
    shuffleBtn.classList.toggle('text-blue-900');
});

function setActivePlayList(index) {
    const playListBtns = document.querySelectorAll('#playlist button');

    playListBtns.forEach(btn => {
        if(btn.classList.contains('font-bold')) {
            btn.classList.remove('font-bold');
        } else if(btn.dataset.name == songs[index].title) {
            btn.classList.add('font-bold');
        }
    });
}

audioEl.addEventListener('ended', () => {
    if(repeatBtn.classList.contains('repeat')) {
        audioEl.currentTime = 0;
        play();
    } else if(shuffleBtn.classList.contains('text-blue-900')) {
        loadMusic(Math.floor(Math.random() * 4));
        play();
    } else {
        next();
    }
});