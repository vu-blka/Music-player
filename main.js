const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "F8_PLAYER";


const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio')
const cd = $('.cd');
const playBtn = $('.btn-toggle-play')
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Vì yêu cứ đâm đầu",
            singer: "Đen x Min",
            path: "./src/music/vi-yeu-cu-dam-dau.mp3",
            image: "https://photo-resize-zmp3.zmdcdn.me/w480_r1x1_webp/cover/0/3/a/c/03ac82cbf720ea5d24129dc5a2bb5bbe.jpg"
        },
        {
            name: "Big city boiz",
            singer: "Binz",
            path: "./src/music/big-city-boi.mp3",
            image:
                "https://photo-resize-zmp3.zmdcdn.me/w480_r1x1_webp/cover/5/a/5/1/5a5164496ababbca1496193ec8b8afb1.jpg"
        },
        {
            name: "Don't break my heart",
            singer: "Binz",
            path: "./src/music/don't-break-my-heart.mp3",
            image: "https://photo-resize-zmp3.zmdcdn.me/w480_r1x1_webp/cover/2/3/a/3/23a319ae4abfa44026f1cfe9d3de9387.jpg"
        },
        {
            name: "Đổi thay",
            singer: "Hồ Quang Hiếu",
            path: "./src/music/doi-thay.mp3",
            image:
                "https://photo-resize-zmp3.zmdcdn.me/w480_r1x1_webp/covers/c/5/c52f65959e8b0c2aafa7e5ef06f57f17_1471919089.jpg"
        },
        {
            name: "Đánh mất em",
            singer: "Quang Đăng Trần",
            path: "./src/music/danh-mat-em.mp3",
            image:
                "https://photo-resize-zmp3.zmdcdn.me/w480_r1x1_webp/cover/8/3/6/9/83690ac46c2ba7cf46b153e6226c974d.jpg"
        },
        {
            name: "Nàng thơ",
            singer: "Hoàng Dũng",
            path: "./src/music/nang-tho.mp3",
            image:
                "https://photo-resize-zmp3.zmdcdn.me/w480_r1x1_webp/cover/e/6/7/e/e67ea0b93182adbf44c6a019591834df.jpg"
        },
        {
            name: "Thêm bao nhiêu lâu",
            singer: "Đạt G",
            path: "./src/music/them-bao-nhieu-lau.mp3",
            image:
                "https://photo-resize-zmp3.zmdcdn.me/w480_r1x1_webp/cover/2/1/a/b/21ab9ad515854e17cb8a23fb50bf43bb.jpg"
        },
        {
            name: "Anh nhà ở đâu thế",
            singer: "B-ray x Amee",
            path: "./src/music/anh-nha-o-dau-the.mp3",
            image:
                "https://photo-resize-zmp3.zmdcdn.me/w480_r1x1_webp/cover/5/2/7/8/527879fe969864e5e149db25432debb0.jpg"
        },
        {
            name: "Sau tất cả",
            singer: "Erik",
            path: "./src/music/sau-tat-ca.mp3",
            image:
                "https://photo-resize-zmp3.zmdcdn.me/w480_r1x1_webp/covers/5/5/55a2e33a5d4d6a70f5144181c28eacb0_1452855672.jpg"
        },
        {
            name: "Người ấy",
            singer: "Trịnh Thăng Bình",
            path: "./src/music/nguoi-ay.mp3",
            image:
                "https://photo-resize-zmp3.zmdcdn.me/w480_r1x1_webp/covers/c/a/ca79cd05ebbc2de2536374d3a710df85_1356577120.jpg"
        }
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
        <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        _this = this;
        const cdWidth = cd.offsetWidth;

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 20000, // 10 seconds
            interations: Infinity
        })
        cdThumbAnimate.pause();

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCDWidth = cdWidth - scrollTop;

            cd.style.width = newCDWidth > 0 ? newCDWidth + 'px' : 0;
            cd.style.opacity = newCDWidth / cdWidth;

        }

        // Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        }

        // Khi play song
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play();
        }

        // Khi pause song
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause();

        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const currentProgress = audio.currentTime / audio.duration * 100;
                progress.value = currentProgress;
            }
        }

        // Xử lý khi tua bài hát thay
        progress.onchange = function () {
            const seekTime = progress.value / 100 * audio.duration;
            audio.currentTime = seekTime;
        }

        // Previous songs
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollIntoView();
        }

        // Next songs
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollIntoView();
        }

        // Random songs
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);

        }

        // Repeat this song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        //Audio end songs
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            }
            else {
                nextBtn.onclick();
            }
        }

        //Click on playlist b
        playlist.onclick = function (e) {
            let songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);    // nho khuc nay anh Son noi la songNode.dataSet.index no la String nen bi loi
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                if (e.target.closest('.option')) {

                }
            }

        }
    },
    scrollIntoView: function () {
        let isLittle;
        if (this.currentIndex <= 3) {
            isLittle = true;
        }
        else {
            isLittle = false;
        }
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: isLittle ? 'center' : 'nearest',
        }
        )
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong();
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * this.songs.length)
        } while (nextIndex === this.currentIndex)

        this.currentIndex = nextIndex;
        this.loadCurrentSong();

    },
    start: function () {
        // Load config
        this.loadConfig();
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe  xử lý các sự kiện (DOM Events)
        this.handleEvents();

        // Load thông tin bài hát hiện tại
        this.loadCurrentSong();

        // Render playlist
        this.render();

        repeatBtn.classList.toggle('active', _this.isRepeat);
        randomBtn.classList.toggle('active', _this.isRandom);
    }
}

app.start();

