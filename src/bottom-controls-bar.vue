<template>
    <div :class="['bottom-controls-bar', isShow ? '' : 'hidden']">
        <div
            class="bottom-controls-bar__load"
            :style="{
                width: `${loadPercentage}%`
            }"
        />
        <div
            class="bottom-controls-bar__played"
            :style="{
                width: `${percentage}%`,
                background: `${themeColor}`
            }"
        >
            <div class="bottom-controls-bar__played__dot" />
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    props: {
        percentage: {
            type: Number,
            default: 0
        },
        loadPercentage: {
            type: Number,
            default: 0
        },
        themeColor: {
            type: String,
            default: '#ff98be'
        },
        isShow: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style scoped lang="scss" type="text/scss">
@import '../scss/variable.scss';
.bottom-controls-bar {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: $z-index-bottom-bar;
    &.hidden {
        opacity: 0;
    }
    &__load {
        height: 100%;
        background: rgba(255, 255, 255, 1);
        position: absolute;
        left: 0;
        top: 0;
    }
    &__played {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        &__dot {
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 1);
            border-radius: 50%;
            position: absolute;
            right: -9px;
            top: 50%;
            transform: translateY(-50%);
            box-shadow: 0 2px 6px 0 rgba(133, 133, 133, 0.4);
            z-index: $z-index-controls-dot;
        }
    }
}
</style>
