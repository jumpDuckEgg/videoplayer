import '../scss/index.scss';
import videoPlayer from './player.vue';

const install = function (vue) {
    vue.component(videoPlayer.name, videoPlayer);
};

const VueVideoPlayer = {videoPlayer, install};

export default VueVideoPlayer;
export {videoPlayer, install};
