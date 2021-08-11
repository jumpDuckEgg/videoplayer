import '../scss/index.scss';
import videoPlayer from './player.vue';

const install = function (vue, config) {
    if (config) {
        if (config.options) {
            videoPlayer.props.globalOptions.default = () => config.options;
        }
        if (config.events) {
            videoPlayer.props.globalEvents.default = () => config.events;
        }
    }
    vue.component(videoPlayer.name, videoPlayer);
};

const VueVideoPlayer = {videoPlayer, install};

export default VueVideoPlayer;
export {videoPlayer, install};
