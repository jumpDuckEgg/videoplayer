class _Errors {
    constructor(type, vid, errd = {}, url = "") {
        this.url = url;
        this.errd = errd;
        this.type = type;
    }
}

export default _Errors;
