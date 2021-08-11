import EventEmitter from "events";
import util from "./util";

const { createDom, isAndroidX5SupportInlinePlayer } = util;

let allComponentKeys = [];
const allComponent = new Map();

class MVideoPlayer extends EventEmitter {
    constructor(options = {}) {
        super(); // 继承 event
        const defaultConfig = {
            // src: "//cloud.video.taobao.com/play/u/2979107860/p/1/e/6/t/1/217257838934.mp4",
            autoplay: false,
            muted: true,
            autoplayMuted: true,
            id: "video",
        };

        this.config = this.videoConfig = Object.assign(
            {},
            defaultConfig,
            options
        );

        // if(!this.isAndroidX5SupportInlinePlayer){
        this.$videoContainer = document.getElementById(
            `Container${this.videoConfig.id}`
        );

        let videoAttrs = {
            "x5-video-player-type": "h5-page",
            class: "video-player__main__tech",
            // src: options.url,
            id: options.id,
            style: Object.assign({}, options.style, {
                width: "100%",
                height: "100%",
            }),
        };
        // 内联播放
        if (options.isPlaysinline) {
            videoAttrs = Object.assign({}, videoAttrs, {
                playsinline: true,
                "webkit-playsinline": true,
            });
        } else {
            videoAttrs = Object.assign({}, videoAttrs, {
                "x5-video-player-fullscree": true,
                "x5-video-orientation": "landscape|portrait",
            });
        }
        // 自动播放
        if (options.autoplay) {
            videoAttrs = Object.assign({}, videoAttrs, {
                muted: "muted",
                autoplay: options.autoplay,
            });
        }
        // 循环播放
        if (options.loop) {
            videoAttrs = Object.assign({}, videoAttrs, {
                loop: true,
            });
        }
        this.video = createDom("video", "", videoAttrs, "");

        this.pluginsCall();
        if (this.videoConfig.reload && this.switchURL) {
            this.switchURL(this.videoConfig.url);
        }

        // 获取父级的宽高
        allComponent.set(this.videoConfig.id, this);
        allComponentKeys.push(this.videoConfig.id);
        // debugger;
        this.start();
    }

    async start(url = this.config.url) {
        if (this.config.autoplay) {
            this.on("canplay", () => {
                console.log("设置了自动播放了哦");
                // safari 11 上已经禁止了视频自动播放，需要用户手动点击选择是否允许自动播放。
                // iOS 上想要自动播放播放，需要同时设置 autoplay 和 muted = true, 注意： ios 不管怎样设置，蜂窝数据下自动播放肯定被禁用的
                this.checkCanAutoPlay()
                    .then(({ canAutoPlay }) => {
                        console.log(canAutoPlay);
                    })
                    .catch(({ canAutoPlay }) => {
                        console.log(canAutoPlay);
                    });
            });
        }
        this.ev = [
            "play",
            "playing",
            "pause",
            "ended",
            "error",
            "seeking",
            "seeked",
            "timeupdate",
            "waiting",
            "canplay",
            "canplaythrough",
            "durationchange",
            "volumechange",
            "loadeddata",
            "progress",
            "autoplay",
            "error",
            "loadstart",
        ].map((item) => {
            return {
                [item]: `on${item.charAt(0).toUpperCase()}${item.slice(1)}`,
            };
        });

        this.ev.forEach((item) => {
            // console.log(this);
            const evName = Object.keys(item)[0];
            const evFunc = this.videoConfig[item[evName]];
            if (evFunc) {
                this.on(evName, evFunc);
            }
        });
        // eslint-disable-next-line  @typescript-eslint/no-this-alias
        const self = this;
        this.ev.forEach((item) => {
            self.evItem = Object.keys(item)[0];
            const name = Object.keys(item)[0];
            self.video.addEventListener(
                name,
                function () {
                    // console.log(name);
                    self.emit(name, self);
                },
                false
            );
        });
        if (util.typeOf(url) === "String") {
            this.video.src = url;
        }
        this.$videoContainer.appendChild(this.video);
    }

    // 安卓使用 x5 内核的环境
    get isAndroidX5SupportInlinePlayer() {
        return isAndroidX5SupportInlinePlayer;
    }

    get playerUrl() {
        return this.videoConfig.src;
    }

    get isAutoPlay() {
        return this.videoConfig.autoplay;
    }

    // 获取当前音量
    get volume() {
        return this.video.volume;
    }

    set volume(isTrue) {
        this.video.volume = isTrue;
    }

    get muted() {
        return this.video.muted;
    }

    set muted(isTrue) {
        this.video.muted = isTrue;
    }

    // 获取当前视频总时长
    get duration() {
        return this.video.duration;
    }

    // 是否暂停播放
    get isPaused() {
        return this.video.paused;
    }

    // 当前播放状态 ‘加载中’

    set autoplay(isTrue) {
        this.video.autoplay = isTrue;
    }
    get autoplay() {
        return this.video.autoplay;
    }
    get buffered() {
        return this.video.buffered;
    }
    get crossOrigin() {
        return this.video.crossOrigin;
    }
    set crossOrigin(isTrue) {
        this.video.crossOrigin = isTrue;
    }
    // 获取当前播放位置
    get currentTime() {
        return this.video.currentTime;
    }
    set currentTime(time) {
        if (isFinite(time)) {this.video.currentTime = time;}
    }
    get defaultMuted() {
        return this.video.defaultMuted;
    }
    set defaultMuted(isTrue) {
        this.video.defaultMuted = isTrue;
    }
    get src() {
        return this.video.src;
    }
    set src(url) {
        this.video.pause();
        this.video.src = url;
    }
    // 检查能否自动播放
    async checkCanAutoPlay() {
        let canAutoPlay = false;
        return new Promise((resolve, reject) => {
            if (util.isWeixin() && util.isIOS()) {
                // 微信下ios想要自动播放，必需要在WeixinJSBridgeReady回调进行处理，因为ios某些机型直接调用play()方法会报错
                document.addEventListener(
                    "WeixinJSBridgeReady",
                    () => {
                        try {
                            this.video.play();
                            this.emit(
                                "autoplay",
                                this.videoConfig["onAutoplay"]
                            );
                            resolve({
                                canAutoPlay: true,
                            });
                        } catch (error) {
                            console.log(error);
                            resolve({
                                canAutoPlay: false,
                            });
                        }
                    },
                    false
                ); // 兼容微信自动播放
            } else {
                // 会返回一个 Promise ! 如果这个 Promise 函数被顺利执行，那么视频就会播放，同时 video 元素也会执行 playing 事件
                const playPromise = this.video.play();
                // console.log("checkCanAutoPlay", playPromise.then);
                if (playPromise !== undefined && playPromise) {
                    // 华为手机m20 playPromise 为 undefined
                    playPromise
                        .catch(() => {
                            console.log(" Auto-play was prevented");
                            canAutoPlay = false;
                            // Auto-play was prevented
                            // Show a UI element to let the user manually start playback
                            reject({ canAutoPlay });
                        })
                        .then(() => {
                            canAutoPlay = true;
                            // Auto-play started
                            this.wxReady();
                            if (canAutoPlay) {
                                console.log("能够自动播放哦！");
                                this.play();
                            }
                            this.emit(
                                "autoplay",
                                this.videoConfig["onAutoplay"]
                            );
                            resolve({ canAutoPlay });
                        });
                }
            }
        });
    }
    wxReady() {
        document.addEventListener(
            "WeixinJSBridgeReady",
            () => {
                this.play();
            },
            false
        ); // 兼容微信自动播放
    }
    // 然后是 play 和 pause 方法。
    play() {
        // 执行原生play()方法
        // 这里显示播放器播放状态UI
        // 要先执行play，再延迟暂停其他视频，否则安卓下其他视频会黑屏
        this.video.play()?.catch((err) => {
            console.log(err);
        });
        
        setTimeout(() => {
            allComponentKeys
                .filter((key) => key !== this.videoConfig.id)
                .forEach((key) => {
                    console.log(allComponent.get(key).video);
                    allComponent.get(key).video.pause();
                });
        }, 200);
    }
    load() {
        allComponentKeys.forEach((key) => {
            allComponent.get(key).video.load();
        });
    }
    pause() {
        // 执行原生pause()方法
        this.video.pause();
        // 这里显示播放器暂停状态UI
    }
    destroy() {
        this.emit("destroy");
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        if (this.video) {
            this.video.pause();
        }
        this.ev.forEach((item) => {
            // console.log(this);
            const evName = Object.keys(item)[0];
            const evFunc = this.videoConfig[item[evName]];
            if (evFunc) {
                this.off(evName, evFunc);
            }
        });
        this.ev.forEach((item) => {
            this.evItem = Object.keys(item)[0];
            const name = Object.keys(item)[0];
            this.video.removeEventListener(name, function () {
                // console.log(name);
                this.off(name, self);
            });
        });
        if (document.getElementById(this.videoConfig.id)) {
            this.$videoContainer.removeChild(this.video);
        }
        allComponent.delete(this.video.id);
        allComponentKeys = allComponentKeys.filter(
            (key) => key !== this.video.id
        );
    }
    // 根据currenttime获取需要加载的video的range段
    getBufferedRange() {
        const range = [0, 0];
        const video = this.video;
        const buffered = video.buffered;
        const currentTime = video.currentTime;
        if (buffered) {
            for (let i = 0, len = buffered.length; i < len; i++) {
                range[0] = buffered.start(i);
                range[1] = buffered.end(i);
                if (range[0] <= currentTime && currentTime <= range[1]) {
                    break;
                }
            }
        }
        if (range[0] - currentTime <= 0 && currentTime - range[1] <= 0) {
            return range;
        } else {
            return [0, 0];
        }
    }
    // 执行插件
    pluginsCall() {
        if (MVideoPlayer.plugins) {
            Object.keys(MVideoPlayer.plugins).forEach((name) => {
                const descriptor = MVideoPlayer.plugins[name];
                descriptor.call(this, this);
            });
        }
    }
    // 注册插件
    static install(name, descriptor) {
        if (!MVideoPlayer.plugins) {
            MVideoPlayer.plugins = {};
        }
        MVideoPlayer.plugins[name] = descriptor;
    }
}

MVideoPlayer.util = util;
export default MVideoPlayer;
