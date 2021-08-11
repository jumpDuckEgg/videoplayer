<template>
    <div
        v-show="showVolume"
        ref="volumeWarpper"
        class="video-player__controls__volume__control"
        @touchstart="touchstart"
        @touchmove="touchmove"
        @click="click"
    >
        <div class="volume-control">
            <div
                class="volume-control__inner"
                :style="{
                    width: `${volume * 100}%`
                }"
            >
                <span class="volume-control__inner__dot" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isShow: {
            default: false,
            type: Boolean
        },
        volume: {
            type: Number,
            default: 1
        },
        isFullscreen: {
            type: Boolean,
            default: false
        },
        cssFullscreen: {
            type: Boolean,
            default: false
        },
        isCrossScreen: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            percentage: 0,
            barX: 0,
            barWidth: 0,
            showVolume: true
        };
    },
    watch: {
        isShow: {
            handler(after) {
                this.showVolume = after;
            }
        },
        isFullscreen(after) {
            this.showVolume = true;
            this.$nextTick(() => {
                if (after && this.cssFullscreen && this.isCrossScreen) {
                    console.log('after', this.$refs.volumeWarpper.getBoundingClientRect());
                    this.barX = this.$refs.volumeWarpper.getBoundingClientRect().y;
                    this.barWidth = this.$refs.volumeWarpper.getBoundingClientRect().height;
                } else {
                    this.barX = this.$refs.volumeWarpper.getBoundingClientRect().x;
                    this.barWidth = this.$refs.volumeWarpper.getBoundingClientRect().width;
                }
                this.showVolume = this.isShow;
            });
        }
    },
    mounted() {
        if (this.$refs.volumeWarpper) {
            this.initBar();
            this.showVolume = this.isShow;
        }
    },
    methods: {
        initBar() {
            if (this.isFullscreen && this.cssFullscreen && this.isCrossScreen) {
                this.barX = this.$refs.volumeWarpper.getBoundingClientRect().y;
                this.barWidth = this.$refs.volumeWarpper.getBoundingClientRect().height;
            } else {
                this.barX = this.$refs.volumeWarpper.getBoundingClientRect().x;
                this.barWidth = this.$refs.volumeWarpper.getBoundingClientRect().width;
            }
        },
        updateByPercentage(percentage) {
            this.percentage = percentage;
            this.$emit('update:volume', percentage);
        },
        getPercentageByTouchX(touchX) {
            const r = Math.floor(((touchX - this.barX) / this.barWidth) * 100);
            return r <= 0 ? 0 : r >= 100 ? 100 : r;
        },
        touchstart(e) {
            this.controlTouch(e);
        },
        touchmove(e) {
            this.controlTouch(e);
        },
        controlTouch(e) {
            const clientX =
                this.isFullscreen && this.cssFullscreen && this.isCrossScreen
                    ? e.touches[0].clientY
                    : e.touches[0].clientX;
            this.percentage = this.getPercentageByTouchX(clientX) / 100;
            this.updateByPercentage(this.percentage);
        },
        click(e) {
            const clientX = this.isFullscreen && this.cssFullscreen && this.isCrossScreen ? e.clientY : e.clientX;
            this.percentage = this.getPercentageByTouchX(clientX) / 100;
            this.updateByPercentage(this.percentage);
        }
    }
};
</script>

<style scoped lang="scss" type="text/scss">
@import '../scss/variable.scss';
.video-player__controls__volume__control {
    height: 10px;
    width: 65px;
    .volume-control {
        height: 4px;
        width: 100%;
        background-color: #fff;
        margin: 0 auto;
        &__inner {
            background-color: $theme;
            height: 100%;
            position: relative;
            &__dot {
                display: inline-block;
                width: 10px;
                height: 10px;
                background: #fff;
                border-radius: 50%;
                position: absolute;
                right: -9px;
                top: 50%;
                transform: translateY(-50%);
                z-index: $z-index-controls-dot;
            }
        }
    }
}
</style>
