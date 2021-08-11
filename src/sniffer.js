export default {
    // 是否微信
    isWeixin() {
        const ua = navigator.userAgent.toLowerCase();
        return Number(ua.indexOf('micromessenger')) !== -1;
    },
    // 是否ios
    isIOS() {
        const u = navigator.userAgent;
        return Boolean(u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/));
    },
    // 是否安卓
    isAndroid() {
        const u = window.navigator.userAgent;
        return u.indexOf('Android') > -1;
    },
    // 查看 x5 内核对同层播放器的支持： https://act.mama.cn/subject/index-id-2020iknbf4s.html?config_id=547&preview=1#/
    get isAndroidX5SupportInlinePlayer() {
        const ua = window.navigator.userAgent;
        const tbs = ua.match(/TBS\/([\d.]+)/);
        // 添加过滤怪异机型，不支持同层播放
        const ignoreSpecialModels = [
            {
                type: 'vivo',
                tbs: 44328
            }
        ];
        const x5 = {
            tbsWx: ua.match(/MicroMessenger/i) === 'micromessenger' && tbs && tbs[1] >= 36849,
            // tbsQQ: browser.versions.QQ && isTBS && (isTBS[1]>= 36855), // qq 内置 webview
            MQQBrowser: ua.match(/MQQBrowser\/([\d.]+)/) && ua.match(/MQQBrowser\/([\d.]+)/)[1] >= 7.2, // qq 浏览器 或者  qq 内置 webview
            tbsX5: tbs && tbs[1] >= 36900 && ignoreSpecialModels.findIndex(item => item.tbs === tbs[1]) === -1 // 第三方接入 TBS x5 内核，如孕管安卓。注意：安卓 QQ 浏览器的 UA 没有 TBS（安卓 QQ 内置 webview 的 UA 有 TBS）
        };
        return (
            (ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1) &&
            (x5.tbsWx || x5.tbsQQ || x5.MQQBrowser || x5.tbsX5)
        );
    },

    // tbs@45200 以下  x5video 需要做样式适配
    get isNeedToAdjustAndroidX5SupportInlinePlayerStyle() {
        const ua = window.navigator.userAgent;
        const tbs = ua.match(/TBS\/([\d.]+)/);

        const tbsVersion = (tbs && tbs[1]) || 0;

        return this.isAndroidX5SupportInlinePlayer && tbsVersion <= 45200; // 经测试，共测试 15 台安卓手机，三台均 4.5.2以上的机子均不需要做样式适配，反而做适配后后有画面缺失问题。
    }
};
