/**
 * @jest-environment node
 */

import util from '../src/sniffer';

describe('sniffer test', () => {
    // ios 不支持 x5同层播放器
    it('ios not support inlinePlayer', () => {
        global.window = {
            navigator: {
                userAgent:
                    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X; Scale/2.00) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13E238; PregnancyHelper/8.9.1; hygjWXPay/8.9.1; hygjAlipay/8.9.1'
            }
        };
        expect(!!util.isAndroidX5SupportInlinePlayer).toEqual(false);
    });

    // 安卓 tbs x5 内核版本大于 36900 x5video 支持同层播放
    it('larger than  tbs@36900  isAndroidX5SupportInlinePlayer', () => {
        global.window = {
            navigator: {
                userAgent:
                    'Mozilla/5.0 (Linux; Android 9; PAR-AL00 Build/HUAWEIPAR-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 QBrowser/6.2 TBS/045216 Mobile Safari/537.36 PregnancyHelper/9.0.0(PAR-AL00;Android9);hygjAlipay;hygjWXPayMozilla/5.0 (Linux; Android 9; PAR-AL00 Build/HUAWEIPAR-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 QBrowser/6.2 TBS/045216 Mobile Safari/537.36 PregnancyHelper/9.0.0(PAR-AL00;Android9);hygjAlipay;hygjWXPay'
            }
        };
        expect(!!util.isAndroidX5SupportInlinePlayer).toEqual(true);
    });

    // 安卓 tbs@4.5.2 以上，在 x5内核下，不需要调整 x5video 样式。 45200
    it('lower than tbs@45200 is not need adjust x5video style', () => {
        global.window = {
            navigator: {
                userAgent:
                    'Mozilla/5.0 (Linux; Android 9; PAR-AL00 Build/HUAWEIPAR-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 QBrowser/6.2 TBS/045216 Mobile Safari/537.36 PregnancyHelper/9.0.0(PAR-AL00;Android9);hygjAlipay;hygjWXPayMozilla/5.0 (Linux; Android 9; PAR-AL00 Build/HUAWEIPAR-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 QBrowser/6.2 TBS/045216 Mobile Safari/537.36 PregnancyHelper/9.0.0(PAR-AL00;Android9);hygjAlipay;hygjWXPay'
            }
        };
        expect(!!util.isNeedToAdjustAndroidX5SupportInlinePlayerStyle).toEqual(false);
    });

    // 安卓 tbs@4.5.2 以上，在 x5内核下，不需要调整 x5video 样式。 45216
    it('lower than tbs@45216 is not need adjust x5video style', () => {
        global.window = {
            navigator: {
                userAgent:
                    'Mozilla/5.0 (Linux; Android 9; PAR-AL00 Build/HUAWEIPAR-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 QBrowser/6.2 TBS/045216 Mobile Safari/537.36 PregnancyHelper/9.0.0(PAR-AL00;Android9);hygjAlipay;hygjWXPayMozilla/5.0 (Linux; Android 9; PAR-AL00 Build/HUAWEIPAR-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 QBrowser/6.2 TBS/045216 Mobile Safari/537.36 PregnancyHelper/9.0.0(PAR-AL00;Android9);hygjAlipay;hygjWXPay'
            }
        };
        expect(!!util.isNeedToAdjustAndroidX5SupportInlinePlayerStyle).toEqual(false);
    });
});
