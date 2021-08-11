/**
 * getParentTag - 获取传入标签的所有父级标签
 *
 * @param  { HTMLElement } startTag 初始dom节点
 * @param  {Array} parentTagList 初始dom节点的所有父级节点
 * @return {type} 递归/初始dom节点的所有父级节点
 */
import screenfull from 'screenfull';
import sniffer from './sniffer';
export function getParentTag(startTag, parentTagList = []) {
    // 传入标签是否是DOM对象
    if (!(startTag instanceof HTMLElement)) {
        return console.error('receive only HTMLElement');
    }
    // 父级标签是否是body,是着停止返回集合,反之继续
    if ('BODY' !== startTag.parentElement.nodeName) {
        // 放入集合
        parentTagList.push(startTag.parentElement);
        // 再上一层寻找
        return getParentTag(startTag.parentElement, parentTagList);
    }
    // 返回集合,结束
    else {
        return parentTagList;
    }
}

const util = {
    // 是否妈妈网app
    isMamaApp() {
        const ua = window.navigator.userAgent;
        return (
            /mmq/i.test(ua) ||
            /gzq/i.test(ua) ||
            /pregnancyhelper/i.test(ua) ||
            /recordapp/i.test(ua) ||
            /mmgoods/i.test(ua)
        );
    },
    /**
     * 进入全屏
     * @param {*} el 全屏的元素
     */
    fullscreen(el, video) {
        if (screenfull.isEnabled) {
            screenfull.request(video);
        } else if (video.webkitSupportsFullscreen) {
            video.webkitEnterFullscreen();
        } else {
            this.addClass(el, 'video-player--is-cssfullscreen');
        }
    },
    /**
     * 退出全屏
     */
    exitFullscreen() {
        screenfull.exit();
    },
    /**
     * 检测是否支持全屏
     */
    checkFullEnabled() {
        let isFull =
            document.fullscreenEnabled ||
            window.fullScreen ||
            document.webkitIsFullScreen ||
            document.msFullscreenEnabled; // to fix : false || undefined == undefined

        if (isFull === undefined) {
            isFull = false;
        }
        return isFull;
    },
    /**
     * 添加类
     * @param {*} el
     * @param {*} className
     */
    addClass(el, className) {
        if (el.classList) {
            className
                .replace(/(^\s+|\s+$)/g, '')
                .split(/\s+/g)
                .forEach(item => {
                    if (item) {
                        el.classList.add(item);
                    }
                });
        } else if (!util.hasClass(el, className)) {
            el.className += ` ${className}`;
        }
    },
    /**
     * 移除类
     * @param {*} el
     * @param {*} className
     */
    removeClass(el, className) {
        if (el.classList) {
            className.split(/\s+/g).forEach(item => {
                el.classList.remove(item);
            });
        } else if (util.hasClass(el, className)) {
            className.split(/\s+/g).forEach(item => {
                const reg = new RegExp(`(\\s|^)${item}(\\s|$)`);
                el.className = el.className.replace(reg, ' ');
            });
        }
    },

    createDom(el = 'div', tpl = '', attrs = {}, cname = '') {
        const dom = document.createElement(el);
        dom.className = cname;
        dom.innerHTML = tpl;
        Object.keys(attrs).forEach(item => {
            const key = item;
            const value = attrs[item];
            if (el === 'video' || el === 'audio') {
                if (key === 'style') {
                    for (const k in value) {
                        dom.style[k] = value[k];
                    }
                } else {
                    dom.setAttribute(key, value);
                }
            }
        });
        return dom;
    },
    hasClass(el, className) {
        if (el.classList) {
            return Array.prototype.some.call(el.classList, item => item === className);
        } else {
            return Boolean(el.className.match(new RegExp(`(\\s|^)${className}(\\s|$)`)));
        }
    },
    deepCopy(dst, src) {
        if (util.typeOf(src) === 'Object' && util.typeOf(dst) === 'Object') {
            Object.keys(src).forEach(key => {
                if (util.typeOf(src[key]) === 'Object' && !(src[key] instanceof Node)) {
                    if (!dst[key]) {
                        dst[key] = src[key];
                    } else {
                        util.deepCopy(dst[key], src[key]);
                    }
                } else if (util.typeOf(src[key]) === 'Array') {
                    dst[key] = util.typeOf(dst[key]) === 'Array' ? dst[key].concat(src[key]) : src[key];
                } else {
                    dst[key] = src[key];
                }
            });
            return dst;
        }
    },
    typeOf(obj) {
        return Object.prototype.toString.call(obj).match(/([^\s.*]+)(?=]$)/g)[0];
    },
    ...sniffer
};

export default util;
