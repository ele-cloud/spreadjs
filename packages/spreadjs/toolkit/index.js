/**
 * @file 工具箱
 * @author Angus Yang
 * @date 2020/2/7
 * @description
 */

import Vue from 'vue/dist/vue.esm.js';
import Toolkit from './main.vue';
import { Button, Select, Input, Option, Dropdown, DropdownMenu, DropdownItem, Icon, ButtonGroup, ColorPicker, Tooltip, Poptip } from 'iview';
import 'iview/dist/styles/iview.css';

import { GC, workbook } from '../src/init';
import { formatterOptions, fontOptions, fontsizeOptions } from '../src/options';

/**
 * method toolkit for spreadjs.
 * @param {Object} dom The dom that toolkit will be rendered.
 */
export default function index(dom) {
  Vue.component('Button', Button);
  Vue.component('Select', Select);
  Vue.component('Input', Input);
  Vue.component('Option', Option);
  Vue.component('Dropdown', Dropdown);
  Vue.component('DropdownMenu', DropdownMenu);
  Vue.component('DropdownItem', DropdownItem);
  Vue.component('Icon', Icon);
  Vue.component('ButtonGroup', ButtonGroup);
  Vue.component('ColorPicker', ColorPicker);
  Vue.component('Tooltip', Tooltip);
  Vue.component('Poptip', Poptip);

  new Vue({
    el: dom,
    template: '<Toolkit></Toolkit>',
    components: { Toolkit }
  });
}
