/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = Object.create(proto);
  Object.assign(obj, JSON.parse(json));
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class SuperBaseElementSelector {
  constructor() {
    this.selector = '';
    this.errorType = [];
    this.position = [];
  }

  element(value) {
    return this.createNewObject(value, 0, 'element', true);
  }

  id(value) {
    return this.createNewObject(`#${value}`, 1, 'id', true);
  }

  class(value) {
    return this.createNewObject(`.${value}`, 2, 'class');
  }

  attr(value) {
    return this.createNewObject(`[${value}]`, 3, 'attr');
  }

  pseudoClass(value) {
    return this.createNewObject(`:${value}`, 4, 'pseudoClass');
  }

  pseudoElement(value) {
    return this.createNewObject(`::${value}`, 5, 'pseudoElement', true);
  }

  createNewObject(value, position, errorType, isUnic = false) {
    this.checkOnError(errorType, isUnic, position);
    this.position.push(position);
    this.errorType.push(errorType);
    this.selector += value;
    return this;
  }

  stringify(value) {
    return value ? value.selector : this.selector;
  }

  checkOnError(errorType, isUnic, position) {
    if (this.errorType.includes(errorType) && isUnic) {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (this.position[this.position.length - 1] > position) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
  }
}
const cssSelectorBuilder = {
  element(value) {
    return new SuperBaseElementSelector().element(value);
  },
  id(value) {
    return new SuperBaseElementSelector().id(value);
  },
  class(value) {
    return new SuperBaseElementSelector().class(value);
  },
  attr(value) {
    return new SuperBaseElementSelector().attr(value);
  },
  pseudoClass(value) {
    return new SuperBaseElementSelector().pseudoClass(value);
  },
  pseudoElement(value) {
    return new SuperBaseElementSelector().pseudoElement(value);
  },
  combine(selector1, combinator, selector2) {
    const obj1 = selector1.stringify();
    const obj2 = selector2.stringify();
    this.selector = (`${obj1} ${combinator} ${obj2}`);
    return this;
  },
  stringify() {
    return new SuperBaseElementSelector().stringify(this);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
