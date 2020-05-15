<template>
  <div>
    <div id="ele-cloud-spreadjs-toolkit"
         style="width: 100%; height: 100%;position: relative;background-color: rgb(247,247,247)">
      <!--撤销，重做-->
      <ButtonGroup>
        <Button type="text" @click="undoCommand" size="small">
          <Tooltip content="撤销" :delay="tipsDelay">
            <i class="spreadfont spreadchexiao"></i>
          </Tooltip>
        </Button>
        <Button type="text" @click="redoCommand" size="small">
          <Tooltip content="恢复" :delay="tipsDelay">
            <i class="spreadfont spreadhuifu"></i>
          </Tooltip>
        </Button>
      </ButtonGroup>

      <span class="toolkit-divider">
        <i class="spreadfont spreadshuxian"></i>
      </span>

      <!--格式刷-->
      <Button :type="formatPainter.isPainting ? 'primary' : 'text'" size="small" @click="painterCopy">
        <Tooltip content="格式刷" :delay="tipsDelay">
          <i class="spreadfont spreadpainter"></i>
        </Tooltip>
      </Button>

      <span class="toolkit-divider">
        <i class="spreadfont spreadshuxian"></i>
      </span>

      <ButtonGroup>
        <!--货币-->
        <Button type="text" @click="setFormatter('$#,##0.00')" size="small">
          <Tooltip content="货币" :delay="tipsDelay">
            <i class="spreadfont spreadhuobidanwei"></i>
          </Tooltip>
        </Button>

        <!--百分比-->
        <Button type="text" @click="setFormatter('0.00%')" size="small">
          <Tooltip content="百分比" :delay="tipsDelay">
            <i class="spreadfont spreadbaifenbi"></i>
          </Tooltip>
        </Button>

        <!--增加小数位数-->
        <Button type="text" @click="increaseDecimal" size="small">
          <Tooltip content="增加小数位数" :delay="tipsDelay">
            <i class="spreadfont spreadzengjiaxiaoshuweishu"></i>
          </Tooltip>
        </Button>

        <!--减少小数位数-->
        <Button type="text" @click="decreaseDecimal" size="small">
          <Tooltip content="减少小数位数" :delay="tipsDelay">
            <i class="spreadfont spreadjianxiaoxiaoshuweishu"></i>
          </Tooltip>
        </Button>
      </ButtonGroup>

      <!--格式-->
      <div class="toolkit-select" style="margin-left: 5px;">
        <Tooltip content="格式" :delay="tipsDelay" :disabled="tooltip.cellFormatter">
          <Select size="default" v-model="cellStyle.cellFormatter" @on-select="setFormatter" placeholder="格式" style="min-width: 82px"
                  @on-open-change="bool => tooltip.cellFormatter = bool">
            <Option v-for="item in formatterOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Tooltip>
      </div>

      <span class="toolkit-divider">
        <i class="spreadfont spreadshuxian"></i>
      </span>

      <!--字体-->
      <div class="toolkit-select toolkit-font">
        <Tooltip content="字体" :delay="tipsDelay" :disabled="tooltip.cellFont">
          <Select size="default" v-model="cellStyle.cellFont" @on-select="setFont" placeholder="字体"
                  @on-open-change="bool => tooltip.cellFont = bool">
            <Option v-for="item in fontOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Tooltip>
      </div>

      <!--字体大小-->
      <div class="toolkit-select toolkit-fontsize">
        <Tooltip content="字体大小" :delay="tipsDelay" :disabled="tooltip.cellFontSize">
          <Select size="default" v-model="cellStyle.cellFontsize" @on-select="setFontsize" placeholder="大小"
                  @on-open-change="bool => tooltip.cellFontSize = bool">
            <Option v-for="item in fontsizeOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Tooltip>
      </div>

      <!--B I U-->
      <ButtonGroup>
        <Button :type="cellStyle.cellBold ? 'primary' : 'text'" @click="boldCell" size="small">
          <Tooltip content="加粗" :delay="tipsDelay">
            <i class="spreadfont spreadjiacu"></i>
          </Tooltip>
        </Button>
        <Button :type="cellStyle.cellItalic ? 'primary' : 'text'" @click="italicCell" size="small">
          <Tooltip content="斜体" :delay="tipsDelay">
            <i class="spreadfont spreadxieti"></i>
          </Tooltip>
        </Button>
        <Button :type="cellStyle.cellUnderline ? 'primary' : 'text'" @click="underlineCell" size="small">
          <Tooltip content="下划线" :delay="tipsDelay">
            <i class="spreadfont spreadUnderline"></i>
          </Tooltip>
        </Button>
      </ButtonGroup>

      <!--字体/背景颜色-->
      <div style="position: relative;display: flex;">
        <ButtonGroup>
          <Button size="small" type="text" @click.stop="cellColorFunc">
            <Tooltip content="字体颜色" :delay="tipsDelay">
              <i class="spreadfont spreadzitiyanse"></i>
              <Icon type="ios-arrow-down"></Icon>
            </Tooltip>
          </Button>
          <Button size="small" type="text" @click.stop="cellColorBgFunc">
            <Tooltip content="背景颜色" :delay="tipsDelay">
              <i class="spreadfont spreadbeijingyanse"></i>
              <Icon type="ios-arrow-down"></Icon>
            </Tooltip>
          </Button>
        </ButtonGroup>
        <ColorPicker ref="cellColorPicker" v-model="cellStyle.cellColor" @on-change="setFontColor"
                     class="toolkit-color-picker"/>
        <ColorPicker ref="cellBgColorPicker" v-model="cellStyle.cellBgColor" @on-change="setBgColor"
                     class="toolkit-color-picker--bg"/>
      </div>

      <!--边框-->
      <Dropdown trigger="click" @on-click="borderFunc">
        <Button size="small" type="text">
          <Tooltip content="添加边框" :delay="tipsDelay">
            <i class="spreadfont spreadjurassic_border-bottom"></i>
            <Icon type="ios-arrow-down"></Icon>
          </Tooltip>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem name="addBorder">所有框线</DropdownItem>
          <DropdownItem name="delBorder">无框线</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <span class="toolkit-divider">
        <i class="spreadfont spreadshuxian"></i>
      </span>

      <div class="toolkit-group">
        <!--水平对齐-->
        <Dropdown trigger="click" @on-click="hAlignCell">
          <Button size="small" type="text">
            <Tooltip content="水平对齐" :delay="tipsDelay">
              <i class="spreadfont spreadzuoduiqi"
                 v-show="cellStyle.cellLeft || (!cellStyle.cellLeft && !cellStyle.cellCenter && !cellStyle.cellRight)"></i>
              <i class="spreadfont spreadjuzhong" v-show="cellStyle.cellCenter"></i>
              <i class="spreadfont spreadyouduiqi" v-show="cellStyle.cellRight"></i>
              <Icon type="ios-arrow-down"></Icon>
            </Tooltip>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="left">
              <span>
              <i class="spreadfont spreadzuoduiqi"></i>
            </span>
              <Icon type="ios-checkmark" v-show="cellStyle.cellLeft"/>
            </DropdownItem>
            <DropdownItem name="center">
              <span>
              <i class="spreadfont spreadjuzhong"></i>
            </span>
              <Icon type="ios-checkmark" v-show="cellStyle.cellCenter"/>
            </DropdownItem>
            <DropdownItem name="right">
              <span>
              <i class="spreadfont spreadyouduiqi"></i>
            </span>
              <Icon type="ios-checkmark" v-show="cellStyle.cellRight"/>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <!--垂直对齐-->
        <Dropdown trigger="click" @on-click="vAlignCell">
          <Button size="small" type="text">
            <Tooltip content="垂直对齐" :delay="tipsDelay">
              <i class="spreadfont spreadvtop"
                 v-show="cellStyle.cellTop || (!cellStyle.cellTop && !cellStyle.cellMiddle && !cellStyle.cellBottom)"></i>
              <i class="spreadfont spreadchuizhiduiqizhongxian" v-show="cellStyle.cellMiddle"></i>
              <i class="spreadfont spreadchuizhiduiqidibu" v-show="cellStyle.cellBottom"></i>
              <Icon type="ios-arrow-down"></Icon>
            </Tooltip>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="top">
              <span>
              <i class="spreadfont spreadvtop"></i>
            </span>
              <Icon type="ios-checkmark" v-show="cellStyle.cellTop"/>
            </DropdownItem>
            <DropdownItem name="center">
              <span>
              <i class="spreadfont spreadchuizhiduiqizhongxian"></i>
            </span>
              <Icon type="ios-checkmark" v-show="cellStyle.cellMiddle"/>
            </DropdownItem>
            <DropdownItem name="bottom">
              <span>
              <i class="spreadfont spreadchuizhiduiqidibu"></i>
            </span>
              <Icon type="ios-checkmark" v-show="cellStyle.cellBottom"/>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <!--合并/取消合并单元格-->
        <Dropdown trigger="click" @on-click="mergeFunc">
          <Button size="small" type="text">
            <Tooltip content="合并单元格" :delay="tipsDelay">
              <i class="spreadfont spreadhebingdanyuange"> </i>
              <Icon type="ios-arrow-down"></Icon>
            </Tooltip>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="mergeCell">合并单元格</DropdownItem>
            <DropdownItem name="unmergeCell">取消合并单元格</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <!--自动换行-->
        <Button :type="cellStyle.wordWrap ? 'primary' : 'text'" size="small" @click="setWordWrap">
          <Tooltip content="自动换行" :delay="tipsDelay">
            <i class="spreadfont spreadwenbenhuanhang"></i>
          </Tooltip>
        </Button>

        <span class="toolkit-divider">
          <i class="spreadfont spreadshuxian"></i>
        </span>
      </div>

      <div class="toolkit-group">
        <!--下拉列表-->
        <Button type="text" size="small" @click="setListValidatorVisible">
          <Tooltip content="下拉列表" :delay="tipsDelay">
            <i class="spreadfont spreadxialaxuanxiang"></i>
          </Tooltip>
        </Button>

        <!--冻结/取消冻结单元格-->
        <Dropdown trigger="click" @on-click="frozen">
          <Button size="small" type="text">
            <Tooltip content="冻结单元格" :delay="tipsDelay">
              <i class="spreadfont spreaddongjiedanyuange"> </i>
              <Icon type="ios-arrow-down"></Icon>
            </Tooltip>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="frozenCell">冻结单元格</DropdownItem>
            <DropdownItem name="removeFrozenCell">取消冻结单元格</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <span class="toolkit-divider">
          <i class="spreadfont spreadshuxian"></i>
        </span>
      </div>

      <div class="toolkit-group">
        <!--解锁-->
        <Button type="text" @click="lock(true)" size="small" v-show="!cellStyle.isLocked">
          <Tooltip content="解锁" :delay="tipsDelay">
            <i class="spreadfont spreadjiesuo"></i>
          </Tooltip>
        </Button>
        <!-- or -->
        <!--加锁-->
        <Button type="text" @click="lock(false)" size="small" v-show="cellStyle.isLocked">
          <Tooltip content="加锁" :delay="tipsDelay">
            <i class="spreadfont spreadsuo"></i>
          </Tooltip>
        </Button>
      </div>

      <!--更多菜单-->
      <Poptip class="toolkit-more_wrapper" placement="bottom">
        <Button size="small" type="text">
          <Tooltip content="更多菜单" :delay="tipsDelay">
            <Icon type="ios-more"/>
          </Tooltip>
        </Button>
        <div class="toolkit-more" slot="content">
        </div>
      </Poptip>

    </div>

    <!--数据验证dialog-->
    <Modal
      v-model="listValidatorVisible"
      title="下拉列表"
      size="small"
      width="250"
      @on-ok="setListValidator(listOptions)"
      @on-cancel="listValidatorVisible = false">
      <Input v-model="listOptions" placeholder="输入指定的值, 以逗号分隔"></Input>
    </Modal>
  </div>
</template>

<script>
  import mixin from './mixins'

  export default {
    name: 'Toolkit',
    mixins: [mixin],
    provide: function () {
      return {
        ...this.$data,
      }
    }
  }
</script>
<style>
  @import "../style/font/iconfont.css";
  /*@import "../style/iviewfont/ionicons.css";*/

  #ele-cloud-spreadjs-toolkit {
    display: flex;
    align-items: center;
  }

  .toolkit-group {
    display: flex;
    align-items: center;
  }

  .toolkit-select {
    display: inline-block;
    /*width: 80px;*/
  }

  .ivu-btn-primary, .ivu-btn-primary.active, .ivu-btn-primary:active,
  .ivu-btn-primary.hover, .ivu-btn-primary:hover, .ivu-btn-text.active, .ivu-btn-text:active,
  .ivu-btn-text.hover, .ivu-btn-text:hover{
    color: inherit;
    background-color: rgb(229, 229, 229);
    border-color: rgb(229, 229, 229);
  }

  .ivu-btn-primary:focus, .ivu-btn-text:focus {
    box-shadow: none;
  }

  .ivu-select-selection {
    background-color: rgb(229, 229, 229);
    border-radius: 1px;
    /*border: 1px rgb(85,85,85) solid;*/
  }

  .ivu-select-visible .ivu-select-selection {
    border-color: rgb(229, 229, 229);
    box-shadow: none;
  }

  .ivu-select-selection-focused, .ivu-select-selection:hover {
    border-color: rgb(229, 229, 229);
  }

  .ivu-btn-group .ivu-btn-primary, .ivu-btn-group .ivu-btn-text{
    border-left: 0 !important;
    border-right: 0 !important;
  }

  .ivu-poptip-popper {
    min-width: 50px;
  }

  .ivu-btn-group {
    display: flex;
  }

  .ivu-dropdown-menu {
    min-width: 50px;
  }

  .toolkit-fontsize .ivu-select-selection {
    width: 58px;
    margin-left: -4px;
    margin-right: 5px;
  }

  .toolkit-font .ivu-select-selection {
    width: 82px;
  }

  .ivu-btn-small {
    padding: 1px 5px 2px !important;
  }

  .toolkit-list-validator-input {
    margin-right: 5px;
    width: 150px !important;
  }

  .ivu-select-single .ivu-select-selection {
    height: 29.4px !important;
  }

  .ivu-select-single .ivu-select-selection .ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
    height: 29.4px !important;
    line-height: 29.4px !important;
  }

  .ivu-color-picker-rel {
    visibility: hidden !important;
    width: 0 !important;
    height: 0 !important;
  }

  .ivu-input-icon-validate {
    display: none !important;
  }

  .toolkit-color-picker {
    position: relative;
    left: -76px;
    top: 10px;
  }

  .toolkit-color-picker--bg {
    position: relative;
    left: -32px;
    top: 10px;
  }

  .toolkit-divider {
    display: inline-block;
    width: 12px;
    text-align: center;
    vertical-align: middle;
    line-height: 1;
    color: #b8bbbd;
  }

  .toolkit-more {
    display: flex;
  }
</style>
