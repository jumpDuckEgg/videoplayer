import util from './util';
const TIMEOUT = 10000;
class Duration {
    constructor(durationProperties = {}, mreport = {}, player) {
        this.properties = durationProperties;
        this.startTime = null;
        this.initialTime = null; // 批次标记
        this.timer = null;
        this.reporter = (mreport && mreport.report
            ? mreport.report
            : window.MReport && window.MReport.report
                ? window.MReport.report
                : null
        ).bind(mreport);
        this.player = player;
        this.init();
    }
    init() {
        // unload时上报停留时长
        // ios通过pagehide监听页面卸载
        window.onpagehide = () => {
            this.exitReport();
        };

        window.onunload = () => {
            this.exitReport();
        };
        // app内处理app后台切换

        if (util.isMamaApp()) {
            window._appEnterCallbacks = window._appEnterCallbacks || [];
            window._appLeaveCallbacks = window._appLeaveCallbacks || [];
            window._appEnterCallbacks.push(this.enterCallback.bind(this));
            window._appLeaveCallbacks.push(this.leaveCallback.bind(this));
            window.Mama.onAppEnter = () => {
                window._appEnterCallbacks.map(cb => {
                    cb();
                });
            };
            window.Mama.onAppLeave = () => {
                window._appLeaveCallbacks.map(cb => {
                    cb();
                });
            };
        } else {
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') {
                    this.enterCallback();
                } else {
                    if (!this.timer) {
                        return;
                    }
                    this.leaveCallback();
                }
            });
        }
    }
    // 退出、切换到后台的上报
    exitReport() {
        if (!this.timer) {
            return;
        }
        this.claerTimer();
        this.report(Date.parse(new Date()) / 1000);
    }
    enterCallback() {
        if (this.timer) {
            this.tiggerReport();
        } else {
            this.player.isEnded = true;
        }
    }
    leaveCallback() {
        this.exitReport();
    }
    report(endTime) {
        const itemMark = Object.assign(
            {},
            this.properties && this.properties.item_mark ? {...this.properties.item_mark} : {},
            {
                item_mark_1: this.startTime,
                item_mark_2: endTime,
                item_mark_3: this.initialTime
            }
        );
        const properties = Object.assign(
            {},
            {
                ...this.properties
            },
            {
                item_mark: itemMark
            }
        );
        if (this.reporter) {
            this.reporter('duration', {
                properties
            });
        }
    }
    // 重新上报，新的开始时间
    tiggerReport() {
        this.claerTimer();
        this.startTime = Date.parse(new Date()) / 1000;
        this.initialTime = Date.parse(new Date()) / 1000;
        this.heartbeatReport();
    }
    // 继续上报，延续原来的开始时间
    keepReport() {
        this.claerTimer();
        this.startTime = Date.parse(new Date()) / 1000;
        this.heartbeatReport();
    }
    claerTimer() {
        window.clearInterval(this.timer);
        this.timer = null;
    }
    heartbeatReport() {
        if (this.timer) {
            return;
        }
        this.timer = setInterval(() => {
            const endTime = Date.parse(new Date()) / 1000;
            this.report(endTime);
        }, TIMEOUT);
    }
}

export default Duration;
