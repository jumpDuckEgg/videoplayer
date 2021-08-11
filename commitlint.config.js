/**
 * https://commitlint.js.org/
 * feat：新增功能
 * fix：bug 修复
 * docs：文档更新
 * style：不影响程序逻辑的代码修改(修改空白字符，格式缩进，补全缺失的分号等，没有改变代码逻辑)
 * refactor：重构代码(既没有新增功能，也没有修复 bug)
 * perf：性能, 体验优化
 * test：新增测试用例或是更新现有测试、添加测试代码
 * build：主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
 * ci：主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交
 * chore：不属于以上类型的其他类型，比如构建流程, 依赖管理
 * revert：回滚某个更早之前的提交
 * patch: 重要补丁
 * config: 修改配置文件
 * file: 增加新文件
 * publish: 发布新版本
 * tag: 发布新版本
 * git: 添加或修改 .gitgnore 文件
 * init: 初次提交/初始化项目
 * format: 格式化代码
 */

module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert']],
        'subject-full-stop': [0, 'never'],
        'subject-case': [0, 'never']
    } // rule由name和配置数组组成，如： name:[0, 'always', 72] ，数组中第一位为 level ，可选 0,1,2 ，0为禁用规则，1为警告，2为错误，第二位为应用与否，可选 always|never ，第三位该rule的值
};
