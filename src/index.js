const hexColorType = Symbol(),
      rgbColorType = Symbol(),
      rgbaColorType = Symbol(),
      hslColorType = Symbol(),
      hslaColorType = Symbol();

const toString = Object.prototype.toString;

const ipv4Pattern = /^(?:2(?:[0-4]\d|5[0-5])|1\d{2}|[1-9]?\d)(?:\.(?:2(?:[0-4]\d|5[0-5])|1\d{2}|[1-9]?\d)){3}$/,
      numberPattern = /^[-+]?(?:\d+|\d*\.\d+)(?:e[-+]?\d+)?$/i,
      colorPatterns = {
          [hexColorType]: /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i,
          [rgbColorType]: /^rgb\(\s*(?:2(?:[0-4]\d|5[0-5])|1\d{2}|[1-9]?\d)(?:\s*,\s*(?:2(?:[0-4]\d|5[0-5])|1\d{2}|[1-9]?\d)){2}\s*\)$/,
          [rgbaColorType]: /^rgba?\(\s*(?:2(?:[0-4]\d|5[0-5])|1\d{2}|[1-9]?\d)(?:\s*,\s*(?:2(?:[0-4]\d|5[0-5])|1\d{2}|[1-9]?\d)){2}\s*,\s*(?:0|1(?:\.0)?|0?\.\d)\s*\)$/,
          [hslColorType]: /^hsl\(\s*(?:3(?:60|[0-5]\d)|[12]\d{2}|[1-9]?\d)(?:\s*,\s*(?:(?:100|[1-9]?\d)(?:\.\d)?)%){2}\s*\)$/,
          [hslaColorType]: /^hsla\(\s*(?:3(?:60|[0-5]\d)|[12]\d{2}|[1-9]?\d)(?:\s*,\s*(?:(?:100(?:\.0)?|[1-9]?\d)(?:\.\d)?)%){2}(?:\s*,\s*(?:0|1(?:\.0)?|0?\.\d))?\s*\)$/
      };

export default {
    hexColorType: hexColorType,
    rgbColorType: rgbColorType,
    rgbaColorType: rgbaColorType,
    hslColorType: hslColorType,
    hslaColorType: hslaColorType,

    /**
     * 判断对象是否为undefined.
     * @param {*} object
     * @returns {boolean}
     */
    isUndefined(object) {
        return typeof(object) === 'undefined';
    },

    /**
     * 对象是否为字符串类型.
     * @param {*} object
     * @returns {boolean}
     */
    isString(object) {
        return toString.call(object) === '[object String]';
    },

    /**
     * 判断对象是否布尔值.
     * @param {*} object
     * @returns {boolean}
     */
    isBoolean(object) {
        return toString.call(object) === '[object Boolean]';
    },

    /**
     * 判断对象是否为数字类型.
     * @param {*} object
     * @param {boolean} [strict=false] - 是否严格判断,默认非严格,即object为string类型且满足数字的格式也被认定为数字类型
     * @returns {boolean}
     */
    isNumber(object, strict = false) {
        if (toString.call(object) === '[object Number]') {
            return true;
        }

        return !strict && this.isString(object) && numberPattern.test(object);
    },

    /**
     * 判断对象是否为整型数.
     * @param {*} object
     * @param {boolean} [strict=false] - 是否严格判断,默认非严格,即当object为字符串的值也满足整型格式也被认定为整型数
     * @returns {boolean}
     */
    isInteger(object, strict = false) {
        if (this.isNumber(object, true)) {
            return Number.isInteger(object);
        }
        if (!strict && this.isString(object)) {
            return numberPattern.test(object) && Number.isInteger(Number(object));
        }

        return false;
    },

    /**
     * 对象是否为Object对象.
     * @param {*} object
     * @returns {boolean}
     */
    isObject(object) {
        return typeof(object) === 'object' && object !== null;
    },

    /**
     * 判断对象是否函数.
     * @param {*} object
     * @returns {boolean}
     */
    isFunction(object) {
        return typeof(object) === 'function' ||
            this.isObject(object) && toString.call(object) === '[object Function]';
    },

    /**
     * 是否是Symbol类型.
     * @param {*} object
     * @returns {boolean}
     */
    isSymbol(object) {
        return typeof(object) === 'symbol' || toString.call(object) === '[object Symbol]';
    },

    /**
     * 判断对象是否日期.
     * @param {*} object
     * @returns {boolean}
     */
    isDate(object) {
        return toString.call(object) === '[object Date]';
    },

    /**
     * 判断对象是否正则对象.
     * @param {*} object
     * @returns {boolean}
     */
    isRegExp(object) {
        return toString.call(object) === '[object RegExp]';
    },

    /**
     * 判断对象是否颜色值.
     * 支持判断HEX,RGB(A),HSL(A)5种类型的颜色.
     * e.g. #A5B412|rgb(121, 23, 5)|rgba(123, 51, 1, 0.2)|hsl(320, 50%, 100%)|hsla(210, 12%, 5%, 0.5).
     * @param {*} object
     * @param {Symbol|Array} [types] - 判断的颜色类型(hexColorType, rgbColorType, rgbaColorType, hslColorType, hslaColorType)
     *      默认判断是否是这五种颜色中的一种
     *      传入以上五种类型任意一种(例如hexColorType)即判断是否是这种类型的字符串
     *      传入数组例如[rgbColorType, rgbColorType],则判断是否是这两种颜色中的一种
     * @returns {boolean}
     */
    isColor(object, types) {
        if (this.isString(types)) {
            types = [types];
        } else if (!this.isArray(types)) {
            types = [this.hexColorType, this.rgbColorType, this.rgbaColorType, this.hslColorType, this.hslaColorType];
        }

        let matches = [];

        for (let type of types) {
            if (colorPatterns.hasOwnProperty(type)) {
                matches.push(colorPatterns[type].test(object));
            }
        }

        return matches.reduce((prev, curr) => {
            return prev || curr;
        }, false);
    },

    /**
     * 判断对象是否是IP地址
     * @param {string} object
     * @returns {boolean}
     */
    isIPv4(object) {
        return ipv4Pattern.test(object);
    }
};