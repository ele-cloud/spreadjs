import { GC, workbook } from '../src/init';

import Vue from 'vue/dist/vue.esm.js';
import Context from './context.vue';
import { Button, Select, Checkbox, Input, Option, Dropdown, DropdownMenu, DropdownItem, Icon, ButtonGroup, ColorPicker, Tooltip, Modal, RadioGroup, Radio, InputNumber } from 'iview';

  /**
 * method spread右键功能.
 */
export default function context() {
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
    Vue.component('Modal', Modal);
    Vue.component('RadioGroup', RadioGroup);
    Vue.component('Radio', Radio);
    Vue.component('InputNumber', InputNumber);
    Vue.component('Checkbox', Checkbox);

    const contextDom = document.createElement('div');
    document.body.appendChild(contextDom);
    new Vue({
      el: contextDom,
      template: '<Context :GC="GC" :workbook="workbook"></Context>',
      components: { Context },
      data: {
        GC, workbook
      }
    });
}


