<template>
    <div
        ref="m-video-player"
        :class="[
            'm-video-player',
            isFullscreen && cssFullscreen && isCrossScreen
                ? 'cross-screen'
                : '',
        ]"
        :style="
            isFullscreen && cssFullscreen && isCrossScreen
                ? crossScreenStyle
                : ''
        "
    >
        <div
            ref="videoPlayer"
            :style="
                isFullscreen && cssFullscreen && isCrossScreen
                    ? crossScreenStyle
                    : { height: height, width: width }
            "
            :class="[
                isX5Android
                    ? isX5Horizontal
                        ? 'x5-android--horizontal'
                        : 'x5-android'
                    : '',
                'video-player',
                isFullscreen && cssFullscreen && !isCrossScreen
                    ? 'video-player--is-cssfullscreen'
                    : '',
            ]"
        >
            <div
                :id="'Container' + vId"
                ref="playerContainer"
                :class="['video-player__main']"
            />
            <div
                class="video-player__poster"
                :style="{ 'background-image': `url(${poster})` }"
                :class="{ 'is-playing': isPlayed }"
            />
            <div
                class="video-player__bg"
                :class="{ 'is-playing': isPlaying }"
                @click.stop="toggleControl"
            >
                <div
                    class="video-player__bg__big-play-btn"
                    @click.stop="togglePlay"
                >
                    <img
                        :src="controlPlayBtn"
                        class="video-player__bg__big-play-btn__img"
                    />
                </div>
            </div>
            <slot />
            <div
                class="video-player__controls"
                :class="{ 'is-playing': !isControl }"
            >
                <div class="video-player__controls__playBtn" />
                <div class="video-player__controls__currentTime">
                    {{ currentTime | timeFormatter }}
                </div>
                <div
                    ref="progress"
                    class="video-player__controls__warpper"
                    @touchstart="touchstart"
                    @touchmove="touchmove"
                    @touchend="touchend"
                    @click="click"
                >
                    <div class="video-player__controls__warpper__progress">
                        <div
                            class="video-player__controls__warpper__progress__load"
                            :style="{
                                width: `${loadPercentage}%`,
                            }"
                        />
                        <div class="progress__slot" />
                        <div
                            class="video-player__controls__warpper__progress__played"
                            :style="{
                                width: `${percentage}%`,
                                background: `${themeColor}`,
                            }"
                        >
                            <div
                                class="video-player__controls__warpper__progress__played__dot"
                            />
                        </div>
                    </div>
                </div>
                <div class="video-player__controls__duration">
                    {{ duration | timeFormatter }}
                </div>
                <section
                    v-longpress="toogleVolume"
                    class="video-player__controls__volume"
                >
                    <div
                        :class="[
                            'video-player__controls__volume__icon',
                            isMuted ? 'muted' : '',
                        ]"
                        @click="toogleMuted"
                    />
                    <volume-control
                        :is-show="isShowVolume"
                        :volume.sync="volume"
                        :is-fullscreen="isFullscreen"
                        :css-fullscreen="cssFullscreen"
                        :is-cross-screen="isCrossScreen"
                    />
                </section>
                <div
                    :class="[
                        'video-player__controls__fullscreen',
                        isFullscreen && cssFullscreen ? 'small' : '',
                    ]"
                    @click="toggleFullscreen"
                />
            </div>
            <bottom-bar
                v-if="isBottomBar"
                :percentage="percentage"
                :load-percentage="loadPercentage"
                :theme-color="themeColor"
                :is-show="!isControl && !isFirstPlayed"
            />
            <loading v-show="isWaiting" :color="themeColor" />
            <!-- <div class="video-player__water-mark"></div> -->
        </div>
    </div>
</template>
<script>
import VideoPlayer from "./video";

import longPress from "./longpress-directive";
import volumeControl from "./volume-control";
import loading from "./loading";
import bottomBar from "./bottom-controls-bar.vue";
import screenfull from "screenfull";
import util, { getParentTag } from "./util";
const { isNeedToAdjustAndroidX5SupportInlinePlayerStyle } = util;

export default {
    name: "videoPlayer",
    components: {
        volumeControl,
        loading,
        bottomBar,
    },
    directives: {
        longpress: longPress,
    },

    filters: {
        timeFormatter(time) {
            const fillZero = (n) => {
                if (n > 9) {
                    return n;
                } else {
                    return `0${n}`;
                }
            };

            if (Number.isNaN(time)) {
                return "00:00";
            }

            const second = Math.floor(time % 60);
            const minute = Math.floor(time / 60);

            return `${fillZero(minute)}:${fillZero(second)}`;
        },
    },
    props: {
        mreport: {
            type: Object,
            default: () => {
                return {};
            },
        },
        durationProperties: {
            type: Object,
            default: () => {
                return {};
            },
        },
        url: {
            type: [String],
            default: "",
            required: true,
            // default: '//cloud.video.taobao.com/play/u/2979107860/p/1/e/6/t/1/217257838934.mp4'
        },
        poster: {
            type: [String],
            default: "",
            required: true,
            // default: '//static-files.cdnmama.com/bifang/comp-video-play-view-1/image/video-poster.png'
        },
        controlPlayBtn: {
            type: [String],
            default:
                "//static-files.cdnmama.com/bifang/comp-video-play-view-1/image/icon-play.png",
        },
        autoPlay: {
            type: Boolean,
            default: false,
        },
        width: {
            type: [String],
            default: "750px",
        },

        height: {
            type: [String],
            default: "750px",
        },
        objectFit: {
            type: String,
            default: "contain", // 有坑， none 该属性会导致在安卓微信下,触发视频播放视频宽高异常
        },
        controls: {
            type: Boolean,
            default: false,
        },
        themeColor: {
            type: String,
            default: "#ff98be",
        },
        muted: {
            type: Boolean,
            default: false,
        },
        // 样式全屏
        cssFullscreen: {
            type: Boolean,
            default: true,
        },

        // 视频横向滑动
        horizontal: {
            type: Boolean,
            default: false,
        },
        // 是否显示底部控制栏
        isBottomBar: {
            type: Boolean,
            default: false,
        },
        // 当全屏为样式全屏时，是否为横向全屏
        isCrossScreen: {
            type: Boolean,
            default: false,
        },
        // 是否循环播放
        loop: {
            type: Boolean,
            default: false,
        },
        // 是否默认内联播放
        isPlaysinline: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            viewsNum: 0,
            isPlaying: false,
            isX5Android: isNeedToAdjustAndroidX5SupportInlinePlayerStyle,
            isX5Horizontal:
                isNeedToAdjustAndroidX5SupportInlinePlayerStyle &&
                this.horizontal,
            isLoading: false,
            waitTimer: null,
            isReportVideoView: false,
            voted: false,
            vId: `${Date.now().toString(36)}`,
            isPlayed: false, // 是否播放过
            status: "",
            video: null,
            currentTime: 0, // 当前播放进度时间
            duration: 0, // 视频总时长
            isSeeking: false,
            percentage: 0,
            barX: 0,
            barWidth: 0,
            isControl: false, // controls为true的条件下，控制条是否显示
            controlTimer: null, // 控制条计时器
            isWaiting: false, // 是否缓冲中
            loadPercentage: 0, // 加载进度
            isMuted: this.muted, // 标记是否静音
            isShowVolume: false, // 标记音量控制条显示
            volume: 0, // 音量大小
            isFullscreen: false, // 标记全屏
            isFirstPlayed: true, // 是否第一次播放
            bodyHeight: 0, // 屏幕窗口高度
            bodyWidth: 0, // 屏幕窗口宽度
            crossScreenStyle: {},
            isEnded: true, // 是否结束播放状态
        };
    },
    watch: {
        url() {
            this.destroy();
            this.$nextTick(() => {
                this.initVideo(true);
            });
        },
        muted: {
            handler(after) {
                this.updateMuted(after);
            },
        },
        volume: {
            handler(after) {
                this.updateVolume(after);
            },
        },
        isFullscreen(after) {
            if (this.cssFullscreen) {
                if (after) {
                    this.resovleParentSettedTransformCauseChirldNodeInvalidFixed();
                } else {
                    this.resetParentStyle(); // 退出全屏
                }
            }
            this.$emit("fullscreenChange", after);
        },
        // 用于支持动态修改controls
        controls(after) {
            if (after) {
                this.toggleControl();
            } else {
                this.isControl = false;
            }
        },
    },
    mounted() {
        // 在微信下一定要先初始化 video 不然会被拦截
        if (this.isX5Android || this.autoPlay) {
            this.initVideo();
            this.isControl = false;
        }
        this.videoWidth = `${this.$refs.playerContainer.offsetWidth}px`;
        this.videoHeight = `${this.$refs.playerContainer.offsetHeight}px`;

        if (this.$refs.progress) {
            this.initBar();
        }
        // alert(document.documentElement.offsetHeight)
        this.crossScreenStyle = {
            width: `${window.innerHeight}px`,
            height: `${window.innerWidth}px`,
        };
    },
    destroyed() {
        if (this.video) {
            this.video.destroy();
        }
    },
    methods: {
        // 初始化进度条位置，用于拖动进度条的计算。
        initBar() {
            if (this.isFullscreen && this.cssFullscreen && this.isCrossScreen) {
                this.barX = this.$refs.progress.getBoundingClientRect().y;
                this.barWidth = this.$refs.progress.getBoundingClientRect().height;
            } else {
                this.barX = this.$refs.progress.getBoundingClientRect().x;
                this.barWidth = this.$refs.progress.getBoundingClientRect().width;
            }
        },
        // 支持的回调方法
        onfullscreenEvents() {
            if (screenfull.isEnabled) {
                screenfull.on("change", () => {
                    // console.log("测试");
                    if (screenfull.isFullscreen) {
                        // 全屏时，要执行的操作
                    } else {
                        // 取消全屏时，要执行的操作
                        this.isFullscreen = !this.isFullscreen;
                    }
                });
            }
        },
        initVideo(reload = false) {
            if (this.video && !reload) {
                return;
            }
            this.isPlayed = false;
            this.isPlaying = false;
            this.isControl = false;
            this.isFirstPlayed = true;
            this.video = null;
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const self = this;
            if (this.$refs.progress) {
                this.barX = this.$refs.progress.getBoundingClientRect().x;
                this.barWidth = this.$refs.progress.getBoundingClientRect().width;
            }
            this.isWaiting = true;
            this.video = new VideoPlayer({
                id: this.vId,
                autoplay: this.autoPlay,
                loop: this.loop,
                url: this.url,
                isPlaysinline: this.isPlaysinline,
                style: {
                    objectFit: this.objectFit,
                },
                reload,
                muted: this.isMuted, // 静音标记
                onTimeupdate: function (mo) {
                    self.status = "onTimeupdate";
                    // console.log('onTimeupdate',mo.buffered.end(0))
                    if (mo.currentTime <= 0) {
                        this.isWaiting = true;
                    }
                    if (!this.isSeeking) {
                        self.duration = mo.duration;
                        self.currentTime = mo.currentTime;
                        self.updateByPercentage(
                            (self.currentTime / self.duration) * 100
                        );
                    }
                    self.$emit("videoTimeupdate", mo.currentTime);
                },
                onPlaying: function () {
                    self.status = "onPlaying";
                    console.log("onPlaying");
                    self.isWaiting = false;
                    self.showControl();
                },
                onEnded: function (mo) {
                    self.status = "结束啦";
                    // console.log("结束啦");
                    self.isPlaying = false;
                    self.fixShowControl();
                    self.$emit("videoEnded", mo);
                    self.isEnded = true;
                    console.log("onEnded");
                },
                onPause: function (mo) {
                    self.status = "暂停";
                    // console.log("暂停");
                    self.isPlaying = false;
                    if (!self.currentTime && !util.isIOS() && util.isWeixin()) {
                        // 微信下安卓设置了自动播放，还没播放就会自动暂停，然后封面图就会消失了，会给人一种不正常的感觉，
                        // 因此用这种方法恢复封面图
                        self.isPlayed = false;
                    } else {
                        self.fixShowControl();
                    }
                    // self.isPlayed = false; // 暂停显示封面图
                    self.$emit("videoPause", mo);
                },
                onPlay: function (mo) {
                    self.status = "播放了";
                    console.log("onPlay");
                    self.isWaiting = false;
                    self.isPlaying = true; // 移除播放按钮
                    self.isPlayed = true; // 移除封面
                    if (self.isFirstPlayed) {
                        // 标记是否第一次播放
                        self.isFirstPlayed = false;
                    }
                    self.showControl();
                    self.$emit("videoPlay", mo);
                },
                onLoadeddata: function (mo) {
                    self.status = "onLoadeddata";
                    self.duration = mo.duration;
                    // console.log("onLoadeddata---视频源数据加载完成----");
                    self.$emit("videoLoadeddata", mo);
                },
                onLoadstart: function () {
                    // console.log("onLoadstart");
                    self.isWaiting = true;
                },
                onWaiting: function () {
                    self.status = "waiting";
                    // console.log("waiting.....");
                    self.isWaiting = true;
                },

                onSeeking: function () {
                    // 这里是为了兼容 启用了mse分片加载后，安卓x5内核的webview中无法监听到waiting和playing事件，
                    // seeking就直接显示loading
                    self.isSeeking = true;
                    self.isWaiting = true;
                },
                onSeeked: function () {
                    self.isSeeking = false;
                    self.isWaiting = false;
                },
                onAutoplay: function () {
                    self.status = "autoPlay";
                    // console.log("autoPlay");
                    self.isPlaying = true; // 移除播放按钮
                    self.isPlayed = true; // 移除封面
                },
                onProgress: function (mo) {
                    // console.log('onProgress')
                    if (mo.buffered.length > 0) {
                        self.loadPercentage =
                            (mo.buffered.end(0) / mo.duration) * 100;
                    }
                },
                // onCanplay: function (mo) {
                //     self.isWaiting = false
                // },
                onError: function (err) {
                    console.log("onerror", err);
                },
            });
            if (!this.cssFullscreen) {
                this.onfullscreenEvents();
            }
            // 同步静音按钮状态
            if (this.autoPlay) {
                this.updateMuted(true);
            } else {
                this.updateMuted(this.isMuted);
            }
            if (this.video) {
                this.updateVolume(this.video.volume);
            }
        },
        updateVolume(volume) {
            if (!this.video) {
                return;
            }
            this.video.volume = volume;
            this.volume = volume;
        },
        // 全屏切换
        toggleFullscreen() {
            if (this.cssFullscreen) {
                this.isFullscreen = !this.isFullscreen;
                if (this.isCrossScreen) {
                    this.$nextTick(() => {
                        this.initBar();
                    });
                }
            } else {
                if (util.isIOS()) {
                    document.getElementById(this.vId).webkitEnterFullscreen();
                    return;
                }
                screenfull.request(document.getElementById(this.vId));
            }
        },

        // 解决设置为 cssFullScreen 出现 video 任意一个父级设置了 transform 不为 'none' 时，导致 position: fixed 失效（降级为 absolute）
        resovleParentSettedTransformCauseChirldNodeInvalidFixed() {
            const allParent = getParentTag(this.$refs["m-video-player"]);
            // console.log(allParent);
            this.needtoSetParent = [];
            allParent.forEach((element) => {
                if (element.style.transform !== "none") {
                    this.needtoSetParent.push({
                        element,
                        transform: element.style.transform,
                    });
                    element.style.transform = "none";
                }
            });

            // 重新设置 video 的宽高
            const $video = document.getElementById(this.vId);
            $video.classList.add("m-video-player--fullScreen");
        },

        resetParentStyle() {
            this.needtoSetParent.forEach((item) => {
                item.element.style.transform = item.transform;
            });

            const $video = document.getElementById(this.vId);
            $video.classList.remove("m-video-player--fullScreen");
        },
        toogleMuted() {
            if (!this.video) {
                return;
            }
            this.video.muted = !this.isMuted;
            this.isMuted = !this.isMuted;
        },
        updateMuted(isTrue) {
            if (!this.video) {
                return;
            }
            this.video.muted = isTrue;
            this.isMuted = isTrue;
        },
        clearControlTimeout() {
            clearTimeout(this.controlTimer);
            this.controlTimer = null;
        },
        togglePlay() {
            // 播放状态切换
            if (!this.video) {
                this.initVideo();
            }
            if (this.video && this.video.isPaused) {
                if (!this.isPlaysinline && util.isAndroid()) {
                    // 不延迟会有问题
                    setTimeout(() => {
                        screenfull.request(document.getElementById(this.vId));
                    }, 500);
                    // 安卓下，如果不重新load以下，其他视频会出现黑屏的现象
                    document
                        .getElementById(this.vId)
                        .addEventListener("x5videoexitfullscreen", () => {
                            this.video.load();
                        });
                }
                this.video.pause();
                this.video.play();
                this.isPlaying = true;
                this.isPlayed = true;
            } else if (this.video) {
                this.video.pause();
                this.isPlaying = false;
            }
            this.$emit("togglePlay");
        },

        play() {
            // 控制视频播放
            if (!this.video) {
                this.initVideo();
            }
            if(this.video) {
                this.video.play();
            }
            this.isPlaying = true;
            this.isPlayed = true;
        },
        pause() {
            // 控制视频暂停
            if(this.video) {
                this.video.pause();
            }
            this.isPlaying = false;
        },
        toggleControl() {
            if (!this.controls) {
                return;
            }
            if (this.isControl && this.video && !this.video.isPaused) {
                this.isControl = false;
            } else if (this.video && this.video.isPaused) {
                this.fixShowControl();
            } else {
                this.showControl();
            }
        },
        fixShowControl() {
            if (!this.controls) {
                return;
            }
            this.isControl = true;
            this.clearControlTimeout();
        },
        showControl() {
            if (!this.controls) {
                return;
            }
            this.isControl = true;
            if (!this.controlTimer) {
                this.controlTimer = setTimeout(() => {
                    this.isControl = false;
                    this.clearControlTimeout();
                }, 4000);
            }
        },
        updateByPercentage(percentage) {
            this.percentage = percentage;
            this.currentTime = Math.floor(
                (this.percentage * this.duration) / 100
            );
        },
        // 计算出进度已播放的条百分比
        getPercentageByTouchX(touchX) {
            const r = Math.floor(((touchX - this.barX) / this.barWidth) * 100);
            return r <= 0 ? 0 : r >= 100 ? 100 : r;
        },
        touchstart(e) {
            this.clearControlTimeout();
            this.isSeeking = true;
            const clientX =
                this.isFullscreen && this.cssFullscreen && this.isCrossScreen
                    ? e.touches[0].clientY
                    : e.touches[0].clientX;

            this.percentage = this.getPercentageByTouchX(clientX);
            this.updateByPercentage(this.percentage);
            this.touchend();
        },
        touchmove(e) {
            const clientX =
                this.isFullscreen && this.cssFullscreen && this.isCrossScreen
                    ? e.touches[0].clientY
                    : e.touches[0].clientX;
            this.percentage = this.getPercentageByTouchX(clientX);
            this.updateByPercentage(this.percentage);
            this.touchend();
        },
        touchend() {
            if (this.video) {
                this.video.currentTime = this.currentTime;
            }
            this.showControl();
            this.isSeeking = false;
        },
        click(e) {
            const clientX =
                this.isFullscreen && this.cssFullscreen && this.isCrossScreen
                    ? e.clientY
                    : e.clientX;
            this.percentage = this.getPercentageByTouchX(clientX);
            this.updateByPercentage(this.percentage);

            this.touchend();
        },
        toogleVolume() {
            this.isShowVolume = !this.isShowVolume;
        },
        destroy() {
            if (this.video) {
                this.video.destroy();
            }
        },
    },
};
</script>
<style lang="scss">
@import "../scss/index.scss";
</style>
