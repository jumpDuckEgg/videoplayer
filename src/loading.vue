<template>
    <div class="video-player__loading">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            viewBox="0 0 100 100"
        >
            <path
                d="M100 50,A50 50, 0 1 1, 50,0"
                :style="{stroke: color}"
            >
                <animateTransform
                    attributeType="xml"
                    attributeName="transform"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    dur="1s"
                    repeatCount="indefinite"
                />
            </path>
        </svg>
    </div>
</template>
<script>
export default {
    props: {
        color: {
            type: String,
            default: '#fff'
        }
    }
};
</script>
