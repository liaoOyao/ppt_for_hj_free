<template>
  <div id="hz_ppt_editor_id" class="hj_final_all" v-loading="loading">
    <div class="hj_head_ppt">
      <div class="hj_head_ppt_filter_div">
        <!-- array_top: {{ array_top }} 侧边栏顶部部分 -->
        <div class="hj_ppt_inline " v-if="d_id !== ''">
          <span class="hj_head_ppt_filter_div_name common_hj_font_style">部门:&nbsp;</span>
          <el-select filterable v-model="value_dep" placeholder="请选择部门"
            @change="(value: any) => handleDimessionChange(value, 'd')">
            <el-option v-for="item in dep_array" :key="item.pk" :label="item.name || item.text ? item.text : null"
              :value="item.pk">
            </el-option>
          </el-select>
        </div>

        <div class="hj_ppt_inline " v-if="bupl_id !== ''">
          <span class="hj_head_ppt_filter_div_name common_hj_font_style">BUPL:&nbsp;</span>
          <el-select filterable v-model="value_bupl" placeholder="请选择BUPL"
            @change="(value: any) => handleDimessionChange(value, 'bupl')">
            <el-option v-for="item in bupl_array" :key="item.pk" :label="item.name" :value="item.pk">
            </el-option>
          </el-select>
        </div>

        <div class="hj_ppt_inline " v-if="spfd_id !== ''">
          <span class="hj_head_ppt_filter_div_name common_hj_font_style">功能领域:&nbsp;</span>
          <el-select filterable v-model="value_spfd" placeholder="请选择SPFD"
            @change="(value: any) => handleDimessionChange(value, 'spfd')">
            <el-option v-for="item in spfd_array" :key="item.pk" :label="item.name" :value="item.pk">
            </el-option>
          </el-select>
        </div>

        <div class="hj_ppt_inline " v-if="year_id !== ''">
          <span class="hj_head_ppt_filter_div_name common_hj_font_style">年份:&nbsp;</span>
          <el-select ref="select2" v-model="value_year" class="hj_head_ppt_filter_div_select hz_ppt_year_select"
            width="100%" placeholder="请选择编制年份" @change="(value: any) => handleDimessionChange(value, 'year')">
            <el-option v-for="item in year_array" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </div>

        <!-- 年份快速筛选 -->
        <div v-if="year_id !== ''" class="hj_ppt_inline fast_year_font fast_year_style">
          <a v-for="( item, index ) in  my_funture_years " class=" hj_ppt_a " :key="item" @click="selectYear(item)"><span
              class="higet_ppt_pointer hj_ppt_font">{{ item }}</span><span v-if="index !== my_funture_years.length - 1"
              class="hj_ppt_font">&nbsp;|&nbsp;</span></a>
        </div>
      </div>
      <div class="hj_head_ppt_title_div">
        <h4 class="text-center hj_font_size title_style title_big">{{ title || '默认标题' }}</h4>
        <!-- <h5 class="text-center title_style hj_font_size_little title_small"> 部门:<span id="title_department"
            style="margin-right: 20px;">{{ select_pk_name }}</span> 年份:<span id="">{{ value_year }}</span></h5> -->
        <hr class="hj_head_ppt_title_div_hr">
      </div>
    </div>
    <div class="hj_all_ppt" id='hj_all_ppt_id'>
      <div class="hj_slider" @click="adjustWidth(hj_slider_dom, 1)">
        <div class="hj_right_adjust_icon_father">
          <div class="hj_right_adjust_icon" @click.stop="adjustWidth(hj_slider_dom, 2)"></div>
        </div>
        <!-- 公司： {{ company_array }} 侧边栏部分 -->
        <div v-if="dep_array && dep_array.length > 0" class="hj_sidebar_category_ppt">
          <span class="higet_ppt_span_bold " style="font-size: 1.1em;">公司维度</span>
          <div class="hj_sidebar_ppt_item hj_sidebar_categroy_ppt_this" :data-table_pk="dep_array[0].pk"
            data-form_type="c">
            <div class="hj_sidebar_ppt_icon"></div>
            <a class="higet_ppt_pointer hj_siderbar_ppt_height hj_ppt_font "
              @click="a_click_hj_ppt_sidebar_select(dep_array[0].pk ? dep_array[0].pk : null, dep_array[0].name || (dep_array[0].text ? dep_array[0].text : null), 'c')">
              {{ dep_array[0].name || (dep_array[0].text ? dep_array[0].text : '无') }}
            </a>
          </div>
          <div v-if="bupl_array && bupl_array.length > 0 || spfd_array && spfd_array.length > 0"
            class="hj_slider_bottom_line"></div>
        </div>

        <!-- 部门 -->
        <div v-if="dep_array && dep_array.length > 0" class="hj_sidebar_category_ppt">
          <span class="higet_ppt_span_bold " style="font-size: 1.1em;">部门</span>
          <div v-for="(item, index) in dep_array" class="hj_sidebar_ppt_item " :key="index" :data-table_pk="item.pk"
            data-form_type="d">
            <div class="hj_sidebar_ppt_icon"></div>
            <a class="higet_ppt_pointer hj_siderbar_ppt_height hj_ppt_font "
              @click="a_click_hj_ppt_sidebar_select(item.pk ? item.pk : null, item.name ? item.name : null, 'd')">
              {{ item.name || (item.text ? item.text : '无') }}
            </a>
          </div>
          <div v-if="bupl_array && bupl_array.length > 0 || spfd_array && spfd_array.length > 0"
            class="hj_slider_bottom_line"></div>
        </div>

        <!-- bupl  -->
        <div v-if="bupl_array && bupl_array.length > 0" class="hj_sidebar_category_ppt">
          <span class="higet_ppt_span_bold " style="font-size: 1.1em;">BUPL</span>
          <div v-for="(item, index) in bupl_array" class="hj_sidebar_ppt_item " :key="index" :data-table_pk="item.pk"
            data-form_type="bupl">
            <div class="hj_sidebar_ppt_icon"></div>
            <a class="higet_ppt_pointer hj_siderbar_ppt_height hj_ppt_font "
              @click="a_click_hj_ppt_sidebar_select(item.pk ? item.pk : null, item.name ? item.name : null, 'bupl')">
              {{ item.name }}
            </a>
          </div>
          <div class="hj_slider_bottom_line" v-if="spfd_array && spfd_array.length > 0"></div>
        </div>

        <!-- 功能领域部门  -->
        <div v-if="spfd_array && spfd_array.length > 0" class="hj_sidebar_category_ppt">
          <span class="higet_ppt_span_bold " style="font-size: 1.1em;">功能领域部门</span>
          <div v-for="(item, index) in spfd_array" class="hj_sidebar_ppt_item " :key="index" :data-table_pk="item.pk"
            data-form_type="spfd">
            <div class="hj_sidebar_ppt_icon"></div>
            <a class="higet_ppt_pointer hj_siderbar_ppt_height hj_ppt_font "
              @click="a_click_hj_ppt_sidebar_select(item.pk ? item.pk : null, item.name ? item.name : null, 'spfd')">
              {{ item.name }}
            </a>
          </div>
        </div>

      </div>
      <div class="pptist-editor">
        <EditorHeader class="layout-header" @save_data="saveData" :dimension_obj_for_index="dimension_obj_for_index" />
        <div class="layout-content">
          <Thumbnails class="layout-content-left" />
          <div class="layout-content-center">
            <CanvasTool class="center-top" />
            <Canvas class="center-body" :style="{ height: `calc(100% - ${remarkHeight + 40}px)`, overflow: 'auto' }" />
            <Remark class="center-bottom" v-model:height="remarkHeight" :style="{ height: `${remarkHeight}px` }" />
          </div>
          <Toolbar class="layout-content-right" />
        </div>
      </div>
    </div>
    <Modal :visible="!!dialogForExport" :footer="null" centered :closable="false" :width="680" destroyOnClose
      @cancel="closeExportDialog()">
      <ExportDialog />
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick, watchEffect, watch, onUnmounted, reactive, provide } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import useGlobalHotkey from '@/hooks/useGlobalHotkey'
import usePasteEvent from '@/hooks/usePasteEvent'

import EditorHeader from './EditorHeader/index.vue'
import Canvas from './Canvas/index.vue'
import CanvasTool from './CanvasTool/index.vue'
import Thumbnails from './Thumbnails/index.vue'
import Toolbar from './Toolbar/index.vue'
import Remark from './Remark/index.vue'
import ExportDialog from './ExportDialog/index.vue'
import '../../assets/styles/hj_style.scss'
import useExport from '@/hooks/useExport'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { message } from 'ant-design-vue'
import http from '@/utils/http'
import pako from '@/utils/pako/pako.min.js'
export default defineComponent({
  name: 'editor',
  components: {
    EditorHeader,
    Canvas,
    CanvasTool,
    Thumbnails,
    Toolbar,
    Remark,
    ExportDialog,
  },
  setup() {
    const mainStore = useMainStore()
    const slidesStore = useSlidesStore()  // slider 仓库

    const { dialogForExport } = storeToRefs(mainStore)
    const closeExportDialog = () => mainStore.setDialogForExport('')

    const remarkHeight = ref(40)
    useGlobalHotkey()
    usePasteEvent()
    //  导入方法
    const { importSpecificData } = useExport()

    // 只控制是否显示
    const bupl_id = ref('')
    const year_id = ref('')
    const spfd_id = ref('')  //  spfd 功能领域的问题
    const d_id = ref('')  //  spfd 功能领域的问题

    const value = ref('')
    // 标记当前选了那个
    const value_year = ref<any>(new Date().getFullYear())
    const value_bupl = ref<any>(null)
    const value_spfd = ref<any>(null)
    const value_dep = ref<any>(null)
    const value_c = ref<any>(null)
    const gridKey = ref<string>('')

    // 处理链接和维度的问题 
    const url = window.location.href
    const dimension_list_data = ref<any>()
    // 根据参数渲染数据
    // const handleUrlAndSleect = async () => {
    const handleUrlAndSleect = (url: string) => {
      // 创建一个新的URL对象
      const urlObj = new URL(url, 'http://example.com')
      // 使用URLSearchParams对象来获取查询参数
      const params = new URLSearchParams(urlObj.search)
      // const params = new URLSearchParams(window.location.search)
      // console.log(params, "最终的params")
      if (params) {
        // if (urlObj && urlObj.search) {
        // 构造维度对象 去获取列表
        const dimension_obj = {
          'spfd_id': params.has('spfd_id') ? params.get('spfd_id') : 0,
          'bupl_id': params.has('bupl_id') ? params.get('bupl_id') : 0,
          'd_id': params.has('d_id') ? params.get('d_id') : 0,
        }
        try {
          // console.log(dimension_obj_for_index, 'dimension_obj_for_index')
          dimension_list_data.value = { "status": 200, "msg": "ok", "dimension_obj": { "pl_list": [{ "name": "DSTE咨询及软件", "id": 2, "pk": 2, "superior_id": 0, "children_pk_list": [5, 6], "is_valid_now": 0 }, { "name": "内训", "id": 3, "pk": 3, "superior_id": 0, "children_pk_list": [7, 8], "is_valid_now": 0 }, { "name": "公开课", "id": 4, "pk": 4, "superior_id": 0, "children_pk_list": [9, 10], "is_valid_now": 0 }, { "name": "IPD咨询", "id": 11, "pk": 11, "superior_id": 0, "children_pk_list": [1], "is_valid_now": 0 }, { "name": "布艺事业部", "id": 13, "pk": 13, "superior_id": 0, "children_pk_list": [14, 15, 16, 17, 18], "is_valid_now": 0 }, { "name": "11", "id": 21, "pk": 21, "superior_id": 0, "children_pk_list": [22], "is_valid_now": 0 }, { "name": "12", "id": 23, "pk": 23, "superior_id": 0, "children_pk_list": [24], "is_valid_now": 1 }, { "name": "测试权限", "id": 25, "pk": 25, "superior_id": 0, "children_pk_list": [26], "is_valid_now": 0 }, { "name": "布艺事业部 / 中高端品类", "id": 18, "pk": 18, "superior_id": 13, "is_valid_now": 1 }], "pl_id": null, "pl_name": null, "spfd_list": [{ "id": 7, "pk": 7, "name": "供应链" }, { "id": 1, "pk": 1, "name": "研发领域" }, { "id": 2, "pk": 2, "name": "营销领域" }, { "id": 3, "pk": 3, "name": "组织及人力资源" }, { "id": 4, "pk": 4, "name": "财务" }, { "id": 5, "pk": 5, "name": "品牌" }, { "id": 6, "pk": 6, "name": "服务领域" }, { "id": 8, "pk": 8, "name": "流程IT" }, { "id": 9, "pk": 9, "name": "市场营销" }, { "id": 10, "pk": 10, "name": "F-权限测试" }], "spfd_id": null, "spfd_name": null, "d_list": [{ "id": "00000000", "pk": "00000000", "name": "汉捷公司", "text": "汉捷公司", "tree_name": "汉捷公司", "level": 0, "sales_position": 1 }, { "pk": "01000000", "name": "咨询一部", "tree_name": "咨询一部", "level": 1, "sales_position": 2, "superior_department__pk": "00000000", "id": "01000000", "text": "咨询一部" }, { "pk": "06000000", "name": "咨询二部", "tree_name": "咨询二部", "level": 1, "sales_position": "", "superior_department__pk": "00000000", "id": "06000000", "text": "咨询二部" }, { "pk": "02000000", "name": "销售一部", "tree_name": "销售一部", "level": 1, "sales_position": 1, "superior_department__pk": "00000000", "id": "02000000", "text": "销售一部" }, { "pk": "03000000", "name": "销售二部", "tree_name": "销售二部", "level": 1, "sales_position": 1, "superior_department__pk": "00000000", "id": "03000000", "text": "销售二部" }, { "pk": "04000000", "name": "市场部", "tree_name": "市场部", "level": 1, "sales_position": "", "superior_department__pk": "00000000", "id": "04000000", "text": "市场部" }, { "pk": "05000000", "name": "运作管理部", "tree_name": "运作管理部", "level": 1, "sales_position": "", "superior_department__pk": "00000000", "id": "05000000", "text": "运作管理部" }, { "pk": "07000000", "name": "总经理助理", "tree_name": "总经理助理", "level": 1, "sales_position": "", "superior_department__pk": "00000000", "id": "07000000", "text": "总经理助理" }, { "pk": "08000000", "name": "外部合作", "tree_name": "外部合作", "level": 1, "sales_position": "", "superior_department__pk": "00000000", "id": "08000000", "text": "外部合作" }, { "pk": "09000000", "name": "香港办事处", "tree_name": "香港办事处", "level": 1, "sales_position": "", "superior_department__pk": "00000000", "id": "09000000", "text": "香港办事处" }, { "pk": "04010000", "name": "软件中心", "tree_name": "软件中心", "level": 1, "sales_position": "", "superior_department__pk": "00000000", "id": "04010000", "text": "软件中心" }, { "pk": "11000000", "name": "测试权限", "tree_name": "测试权限", "level": 1, "sales_position": "", "superior_department__pk": "00000000", "id": "11000000", "text": "测试权限" }, { "pk": "06010000", "name": "IT实施组", "tree_name": "咨询二部 / IT实施组", "level": 2, "sales_position": "", "superior_department__pk": "06000000", "id": "06010000", "text": "IT实施组" }, { "pk": "08010000", "name": "外部合作销售", "tree_name": "外部合作 / 外部合作销售", "level": 2, "sales_position": "", "superior_department__pk": "08000000", "id": "08010000", "text": "外部合作销售" }, { "pk": "11020000", "name": "测试权限（二级部门）", "tree_name": "测试权限 / 测试权限（二级部门）", "level": 2, "sales_position": "", "superior_department__pk": "11000000", "id": "11020000", "text": "测试权限（二级部门）" }, { "id": "07000000", "pk": "07000000", "text": "总经理助理", "tree_name": "总经理助理", "level": 1 }, { "id": "04010000", "pk": "04010000", "text": "软件中心", "tree_name": "软件中心", "level": 1 }, { "id": "06000000", "pk": "06000000", "text": "咨询二部", "tree_name": "咨询二部", "level": 1 }], "d_id": "00000000", "d_name": null, "year_list": [{ "id": 2019, "name": 2019 }, { "id": 2020, "name": 2020 }, { "id": 2021, "name": 2021 }, { "id": 2022, "name": 2022 }, { "id": 2023, "name": 2023 }, { "id": 2024, "name": 2024 }, { "id": 2025, "name": 2025 }, { "id": 2026, "name": 2026 }, { "id": 2027, "name": 2027 }, { "id": 2028, "name": 2028 }], "cur_year": "2023" } }
          // dimension_list_data.value = await http.get('/hz_ppt', { method_: "get_dimension_list", ...dimension_obj })
          if (dimension_list_data.value) {
            if (!dimension_list_data.value.dimension_obj) {
              // 为空
              ElMessage.error('维度列表数据获取失败，请刷新重试！')
              return
            }
          }
          else {
            // 为空
            ElMessage.error('维度列表数据获取失败，请刷新重试！')
            return
          }
        } catch (e) {
          ElMessage.error('维度列表数据获取失败，请刷新重试！')
          return
        }

        // if (params) {
        // 左侧列表和上侧下拉列表一样  除了公司
        // 接下来根据参数是否有获取数据信息
        try {
          const dim_data = dimension_list_data.value.dimension_obj
          if (!dim_data) {
            ElMessage.error('维度列表数据获取失败，请刷新重试！')
          } else {
            try {
              // 标记要显示的  填充当前选中的
              if (params.has('spfd_id')) {
                const temp = params.get('spfd_id')
                if (temp && temp !== '-1') {
                  getSpfdData(dim_data.spfd_list)
                  spfd_id.value = temp // 标记是否显示
                }
              }
              // bupl
              if (params.has('bupl_id')) {
                const temp = params.get('bupl_id')
                if (temp && temp !== '-1') {
                  getBuplData(dim_data.pl_list)
                  bupl_id.value = temp // 标记是否显示
                }
              }
              // d 部门
              if (params.has('d_id')) {
                const temp = params.get('d_id')
                if (temp && temp !== '-1') {
                  getDepData(dim_data.d_list)
                  d_id.value = temp
                }
              }
              // 年份
              if (params.has('year')) {
                const temp = params.get('year')
                getYearData(dim_data.year_list)
                if (temp) {
                  year_id.value = temp
                  value_year.value = Number(dim_data.cur_year)
                  current_year = Number(dim_data.cur_year)
                }
              } else { // 没有传年份
                getYearData(dim_data.year_list)
                year_id.value = new Date().getFullYear().toString()
                value_year.value = Number(new Date().getFullYear())
                current_year = Number(value_year.value)
                my_funture_years_fun(current_year)
              }

              if (params.has('show_c')) {
                // 如果其余3个皆为空时，公司也不用展示，因为就是公司
                if (bupl_id.value !== '' || spfd_id.value !== '' || d_id.value !== '') {
                  const temp = params.get('show_c')
                  if (temp !== '-1') {
                    getCompanyData(dim_data.d_list)
                  }
                }
              }

              // 获取标题
              if (params.has('title')) {
                const arrayParam = params.get('title')
                // const arrayParam2 = params.get('d_id')
                // console.log(typeof arrayParam)
                // console.log(typeof arrayParam2)
                if (arrayParam) {
                  title.value = arrayParam
                }
                else {
                  ElMessage.error('缺少页面标题')
                }
              }

              // grid_key 
              if (params.has('grid_key')) {
                const arrayParam = params.get('grid_key')
                if (arrayParam) {
                  // console.log(arrayParam)
                  gridKey.value = arrayParam
                }
                else {
                  ElMessage.error('缺少grid_key')
                }
              } else {
                ElMessage.error('缺少grid_key')
              }
              // 最后根据维度数据区获取当前选中的数据
              const dimension_obj = {
                'bupl_id': value_bupl.value || 0,
                'spfd_id': value_spfd.value || 0,
                'd_id': value_dep.value || 0,
              }
              get_hz_ppt_by_dimension_and_year(dimension_obj, value_year.value)
            } catch (error) {
              ElMessage.error('缺失维度或配置数据获数据出错')
            }
          }
        } catch (e) {
          ElMessage.error('维度数据获取失败')
        }

      }
    }

    // dom数据渲染完,加上选中样式
    const hanldeDefaultSelect = () => {
      if (dimension_list_data.value && dimension_list_data.value.dimension_obj) {
        const dim_data = dimension_list_data.value.dimension_obj
        if (bupl_id.value !== '-1' && bupl_id.value !== '0') { //bupl
          if (dim_data.pl_id) { //选中
            value_bupl.value = dim_data.pl_id
            set_default_select_item(dim_data.pl_id, dim_data.pl_name, 'bupl')
          }
        } else if (spfd_id.value !== '-1' && spfd_id.value !== '0') { //spfd 
          if (dim_data.spfd_id) { //选中
            value_spfd.value = dim_data.spfd_id
            set_default_select_item(dim_data.spfd_id, dim_data.spfd_name, 'spfd')
          }
        }
        else if (d_id.value !== '-1' && d_id.value !== '0') { //部门
          if (dim_data.d_id) { //选中
            value_dep.value = dim_data.d_id
            set_default_select_item(dim_data.d_id, dim_data.d_name, 'd')
          }
        }
        else { //都没有选中时默认选中公司
          if (dim_data.d_id) { //选中
            value_c.value = dim_data.d_id
            set_default_select_item(dim_data.d_id, dim_data.d_name, 'c')
          }
        }
      }
    }


    const company_array = ref<any[]>([]) // 公司维度
    const dep_array = ref<any[]>([]) // 部门维度
    const bupl_array = ref<any[]>([]) // bupl 
    const spfd_array = ref<any[]>([]) // spfd功能领域
    const year_array = ref<any[]>([]) // 年份
    const select_pk_name = ref('') // 标题中pk_name
    const title = ref('')
    let my_funture_years = [new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1]


    let current_year = new Date().getFullYear()
    const loading = ref<any>(null)

    //  3年

    const my_funture_years_fun = (cur_year: any) => {
      my_funture_years = [cur_year - 1, cur_year, cur_year + 1]
    }


    // 快速筛选
    const selectYear = (year: number) => {
      value_year.value = year
      handleDimessionChange(year, 'year')
    }

    // 获取几个维度的数据
    const getBuplData = (data: any) => {
      bupl_array.value = data
    }

    const getCompanyData = (data: any) => {
      company_array.value = data
      // [
      //   {
      //     "pk": 29,
      //     "year": "2023",
      //     "department_id": "00000000",
      //     "department_name": "汉捷公司",
      //     "division": "经营策略",
      //     "category": "",
      //     "description": "",
      //     "order_number": 10,
      //     "authority": 2
      //   },
      //   {
      //     "pk": 30,
      //     "year": "2023",
      //     "department_id": "00000000",
      //     "department_name": "汉捷公司",
      //     "division": "经营策略",
      //     "category": "",
      //     "description": "",
      //     "order_number": 10,
      //     "authority": 2
      //   }
      // ]
    }

    const getSpfdData = (data: any) => {

      spfd_array.value = data
    }

    const getYearData = (data: any) => {
      year_array.value = data
    }

    // 部门
    const getDepData = (data: any) => {
      dep_array.value = data
      // [
      //   { pk: 1, name: "SPFD1" },
      //   { pk: 2, name: "SPFD2" },
      // ]
    }

    //  设置打开默认选中对象
    const set_default_select_item = (pk: any, pk_name: any, type: string) => {
      // 根据传入的pk、pk_name (用来渲染标题中的部门的)  设置默认选中
      if (pk && type) {

        const elements = document.querySelectorAll('.hj_sidebar_ppt_item') // 获取元素
        elements.forEach((element) => {
          // 
          const formType = element.getAttribute('data-form_type')
          const data_table_pk = element.getAttribute('data-table_pk')
          if (formType !== type || pk.toString() !== data_table_pk) {
            element.classList.remove('hj_sidebar_categroy_ppt_this')
          } else {

            element.classList.add('hj_sidebar_categroy_ppt_this')
            // 更新标题中的部门
            select_pk_name.value = pk_name
          }
        })

      } else {
        ElMessage.error('没有设置默认选中对象')
      }
    }

    // 点击切换    选择的维度
    const a_click_hj_ppt_sidebar_select = async (pk: any, pk_name: string, name: string) => {
      await remindSave()
      open_loading()
      // name  是type
      let dimension_obj = {}
      if (name !== 'year') {
        if (pk && name) {
          const elements = document.querySelectorAll('.hj_sidebar_ppt_item') // 获取元素
          elements.forEach((element) => {
            const formType = element.getAttribute('data-form_type')
            const data_table_pk = element.getAttribute('data-table_pk')
            // console.log(formType)
            if (formType !== name || pk.toString() !== data_table_pk) {
              element.classList.remove('hj_sidebar_categroy_ppt_this')
            }
            else {
              //找到要选中的对象了
              element.classList.add('hj_sidebar_categroy_ppt_this')
              //  根据formType 是buplu 还是spfd 去选择后面的代码提供的el-select  ，然后再根据 pk和name 选择下拉框值
              if (formType === 'bupl') {
                value_bupl.value = pk
                value_spfd.value = null
                value_dep.value = null
                value_c.value = null
                dimension_obj = {
                  'bupl_id': value_bupl.value,
                  'spfd_id': 0,
                  'd_id': 0,
                }
              } else if (formType === 'spfd') {
                value_spfd.value = pk
                value_bupl.value = null
                value_dep.value = null
                value_c.value = null
                dimension_obj = {
                  'spfd_id': value_spfd.value,
                  'bupl_id': 0,
                  'd_id': 0,
                }
              } else if (formType === 'd') {
                value_dep.value = pk
                value_spfd.value = null
                value_bupl.value = null
                value_c.value = null
                dimension_obj = {
                  'd_id': value_dep.value,
                  'bupl_id': 0,
                  'spfd_id': 0,
                }
              } else if (formType === 'c') {
                value_c.value = pk
                value_dep.value = null
                value_spfd.value = null
                value_bupl.value = null
                dimension_obj = {
                  'bupl_id': 0,
                  'spfd_id': 0,
                  'd_id': 0,
                }
              }
              get_hz_ppt_by_dimension_and_year(dimension_obj, value_year.value)
              // 更新标题中的部门
              select_pk_name.value = pk_name
            }

          })
        }
      } else {
        dimension_obj = {
          'bupl_id': value_bupl.value || 0,
          'spfd_id': value_spfd.value || 0,
          'd_id': value_dep.value || 0,
        }
        get_hz_ppt_by_dimension_and_year(dimension_obj, value_year.value)
      }

      close_loading()
    }


    // 顶部维度改变
    const handleDimessionChange = (val: any, name: string) => {
      let selectedOption: any = null  // 主要用来获取pk_name
      if (name === 'spfd') {
        selectedOption = spfd_array.value.find(item => item.pk === val)
      }
      else if (name === 'bupl') {
        selectedOption = bupl_array.value.find(item => item.pk === val)
      }
      else if (name === 'd') {
        selectedOption = dep_array.value.find(item => item.pk === val)

      }
      else if (name === 'year') {
        selectedOption = year_array.value.find(item => item.id === val)
      }
      else if (name === 'c') {
        selectedOption = dep_array.value.find(item => item.pk === val)
      }
      if (selectedOption) {
        a_click_hj_ppt_sidebar_select(val, selectedOption ? selectedOption.name ? selectedOption.name : null : null, name)
      }
    }

    // 获取doc 数据,并且获取 维度列表的信息
    // const get_hz_ppt_by_dimension_and_year = async (dimension_obj: any, year: any) => {
    const get_hz_ppt_by_dimension_and_year = (dimension_obj: any, year: any) => {
      open_loading()
      try {
        // const data1 = await http.get('/hz_ppt', { method_: "get_hz_ppt_by_dimension_and_year", ...dimension_obj, year: year, gridKey: gridKey.value })
        const data1 = {
          "status": 200,
          "msg": "新的维度数据已创建",
          "data": {
            "id": 46,
            "hiwin_deleted_time": null,
            "hiwin_creator": 2,
            "hiwin_updator": null,
            "hiwin_is_deleted": 0,
            "grid_key": "ppt",
            "year": "2022",
            "dimension": "bupl_id_0_spfd_id_1_d_id_0",
            "version": "",
            "doc": "H4sIAAAAAAAAA9VWW2sbRxT+K8v0wS+rzVz3VtfQugRTatd20oTG+GEtjawl693t7tiSG/xSAiENeTOlD4GGYKhfStungFvIr5GU/ouekfbmRKpsggsdzWh2z5yZPd+5zs4jFHaQj5TMVSuPwo5sEWQiGckDGasc+TuPkDpOJbDkvQBmc8rP23vbgxTeItlVyMcmUkmKfIrhqR92VA/5gtsm6slwvwcMzKaWMNFRKPufJQM4VnPC2DVRGmhutG5g+H0JA8gw6389HsBHumEUActHYs/b64gJYSA724EKE+R3gyiXJkrSoB2qY5DFckyUJSpQIDU+MWcDSJKHa1n3PQC1+ExDqcSn+EaF70Zheg/5KjuUs2VXcqBK0cNO7KwPKtGZEIXwtrCoqPXvihoAEdxiHrb1ehTGcq2kW9RE7SRWYG04ejldWc5VlsT7MKdBbOTqOJKfLHWBo5WH30nfMAih6WBpZfTH09Hz15ubd5dvac4VmIqNt9IV1EBhoo7sBoeRug2HbAQHGs562M6SPOkq45sAREQVz2oSJZnWFmMMzcHv5Org3uYM/FSwuQoQ9ns45+CjXMMbvjgfX7wZ/XU6PrsY/fhkfP5meHE6Pj2v0N4ASG2YEuTtOH2Q8xqkTUqQzDVRroIMqDvY1E4oY9ixI7g3eUuTcBq5CHajXQ27+FzlgRPUOiISiHhUKYyeAPde0H64nyWH+sw6dArG6qjupKETLf27CYTOSSBNG6ZqI/76iwoe4aUNCXcreRxCagM6jiU85izy39Ki+mOtIAr3Y99ow6LMPl5a6NvcLUw/+vVsePZ49PrP4Q8vRy+f/P3qp//cyw+21462NioNUQz4caOx0h+4Z7mcCq/oNr9aACxQ1GwFVbHRVNDw6W/v6OiGY8NZ3fq8365jgzILew0NOHWoWKzZ+OzIYZAcXXC8qn9gHPF5RQd7/W/v9yvBW9Sx7MZniQ7tieScUcthDZGc6nCChW1Rz646a2R5qLKNFegLqxbFxqrBsdGCYU86wQWVFGQypU9rWlHciFty0IJDP5NqpVgo6FPqtDxeuSbWZfA6WWl2SmJXudMc3enJ1UZOcpkliFv3MkM5AiKx9jdWmcbGwmpuaGQveLu8tNgypaqb94nyhnF9Hc7xyPW0f+TUdwlKyCXfom51sSOWi0XdnP8D6su3wjmJ9v7WV3c/ra+yDHPLww6veml2z7UIbqChdbwT53LYNTTA8YfWp4l3+0ZRcv8lObt4ci97/PPb31+9/eX78YtnddG6odoFKkiyzh1QMuwR1w3U3X8AWckOV34MAAA=",
            "doc2": "H4sIAAAAAAAAA91XW2/cRBT+K5Z5yEvXnasvIUSCoCpCJCRpaUWzeXB2x1mrjm3sSXYD6ktVqWoRbxHioRJVFYm8IOCpUkDqr9nd8i+Y8Xh3Z7Zp3KbQImbHlzkXz5xvzjlz1t7+tm3H3ba9aLVtzkreKpO4y1qwbV8RFJawfZbyUvKlJD/KmZIte6F8lUITddLZ3RrkipawiEsqkAOe5fIdgWrUj7u8J8eUuHLcY/FerxLGLnKoJB3GrP9JNqhmrbTEbUcy8lCptu01C4jf5+ISPPGUd3ndVvNHcZIowQ/obrDbpRPygHW3Qh5nkhmFSckkOcvDTsyPqgU7nqQUGQ95ZSq4e8VqsjzL7qwW0astN+3GCgfNbgTeh9VREuc3JYUXB6zBaM4G3LQ57qbe2sC0GVOqWe1SB1Fzx31qWg4pcXAAXCWXxClbnfEcJImdLOXCBdWkS/nyUsmLLN0TzzxMrZIfJeyjhUgItcr4G7ZoWRCifLCwPPr94ej7ZxsbN5auSsll8agVr+bLatmavXLYZVF4kPBr4lvr4X5t+FrcKbIyi7j1VSjWrRRryZUsyYoab4xx225GzSv5/s2Ni1BDFDfCRt3zkXkFIohIQIaPT8dnz0d/Ho9PzkY/PBifPh+eHY+PT6f4vDNY5D6bsFxL89slmYPFhTos2JejkodFxd0Wa1PRwdLqI9uUBBNSnsWTpNW21Vfb9o7CbLY2PUQq1Or4zhK5LGMH0N1Kezfs3NkrsgM1o5kVZlr6HFHVBAQKg3MyLWrKtC87Uc7X0y8/M9GCRHciSHxj/R6Epgd5nkMD7L122E3cSi6mFSbxXrpodQSfFR8uNIYk8Wv/G/1yMjy5P3r2x/DRk9GTB389/fE/FZz7W6uHm+smrggIpIDWsO6UJHB8gmhQd5dcIm4boD0f0mlI65AOH/46h+p7DGlvZfPTfmcupBF2QKDh5ZkR7mC9kYaAx+Lw8IWnT/u/Fv7kNWoAEPS/vtU37W0hz3G1BUKVxGqDCUaOhzUDPGNSCKjroMCddjx3dopqSeOK/gZFBALWikWA1RKXW3UIaiqsyVDRVYlR1xrQn0igWkK+wymnZtR0RVXVyuVKFL0iuXwGvij94ksUuofXe2xlPv/62KHQn3U9G3tU5JCZ32Njn11AHV1xLlMLisl+k22e7JteK06qx7fekOaYWMv7h95cjYggNLwa6SGBAHR8QGfN+19A9fJ/jObD6NbmFzc+nvs3hQFxAuCRadedLPAdCDTzkZnCoGdmiznoCPhHTv0q8hatuu654ADzQVWk3//pxW9PX/x8b/z4u1kp8K4qggqgrOheF1tT6dO3TDI79t81cRe4UA8AAA==",
            "is_curr": 1
          }
        }
        // const data1  = {"status":200,"msg":"ok","dimension_obj":{"pl_list":[{"name":"DSTE咨询及软件","id":2,"pk":2,"superior_id":0,"children_pk_list":[5,6],"is_valid_now":0},{"name":"内训","id":3,"pk":3,"superior_id":0,"children_pk_list":[7,8],"is_valid_now":0},{"name":"公开课","id":4,"pk":4,"superior_id":0,"children_pk_list":[9,10],"is_valid_now":0},{"name":"IPD咨询","id":11,"pk":11,"superior_id":0,"children_pk_list":[1],"is_valid_now":0},{"name":"布艺事业部","id":13,"pk":13,"superior_id":0,"children_pk_list":[14,15,16,17,18],"is_valid_now":0},{"name":"11","id":21,"pk":21,"superior_id":0,"children_pk_list":[22],"is_valid_now":0},{"name":"12","id":23,"pk":23,"superior_id":0,"children_pk_list":[24],"is_valid_now":1},{"name":"测试权限","id":25,"pk":25,"superior_id":0,"children_pk_list":[26],"is_valid_now":0},{"name":"布艺事业部 / 中高端品类","id":18,"pk":18,"superior_id":13,"is_valid_now":1}],"pl_id":null,"pl_name":null,"spfd_list":[{"id":7,"pk":7,"name":"供应链"},{"id":1,"pk":1,"name":"研发领域"},{"id":2,"pk":2,"name":"营销领域"},{"id":3,"pk":3,"name":"组织及人力资源"},{"id":4,"pk":4,"name":"财务"},{"id":5,"pk":5,"name":"品牌"},{"id":6,"pk":6,"name":"服务领域"},{"id":8,"pk":8,"name":"流程IT"},{"id":9,"pk":9,"name":"市场营销"},{"id":10,"pk":10,"name":"F-权限测试"}],"spfd_id":null,"spfd_name":null,"d_list":[{"id":"00000000","pk":"00000000","name":"汉捷公司","text":"汉捷公司","tree_name":"汉捷公司","level":0,"sales_position":1},{"pk":"01000000","name":"咨询一部","tree_name":"咨询一部","level":1,"sales_position":2,"superior_department__pk":"00000000","id":"01000000","text":"咨询一部"},{"pk":"06000000","name":"咨询二部","tree_name":"咨询二部","level":1,"sales_position":"","superior_department__pk":"00000000","id":"06000000","text":"咨询二部"},{"pk":"02000000","name":"销售一部","tree_name":"销售一部","level":1,"sales_position":1,"superior_department__pk":"00000000","id":"02000000","text":"销售一部"},{"pk":"03000000","name":"销售二部","tree_name":"销售二部","level":1,"sales_position":1,"superior_department__pk":"00000000","id":"03000000","text":"销售二部"},{"pk":"04000000","name":"市场部","tree_name":"市场部","level":1,"sales_position":"","superior_department__pk":"00000000","id":"04000000","text":"市场部"},{"pk":"05000000","name":"运作管理部","tree_name":"运作管理部","level":1,"sales_position":"","superior_department__pk":"00000000","id":"05000000","text":"运作管理部"},{"pk":"07000000","name":"总经理助理","tree_name":"总经理助理","level":1,"sales_position":"","superior_department__pk":"00000000","id":"07000000","text":"总经理助理"},{"pk":"08000000","name":"外部合作","tree_name":"外部合作","level":1,"sales_position":"","superior_department__pk":"00000000","id":"08000000","text":"外部合作"},{"pk":"09000000","name":"香港办事处","tree_name":"香港办事处","level":1,"sales_position":"","superior_department__pk":"00000000","id":"09000000","text":"香港办事处"},{"pk":"04010000","name":"软件中心","tree_name":"软件中心","level":1,"sales_position":"","superior_department__pk":"00000000","id":"04010000","text":"软件中心"},{"pk":"11000000","name":"测试权限","tree_name":"测试权限","level":1,"sales_position":"","superior_department__pk":"00000000","id":"11000000","text":"测试权限"},{"pk":"06010000","name":"IT实施组","tree_name":"咨询二部 / IT实施组","level":2,"sales_position":"","superior_department__pk":"06000000","id":"06010000","text":"IT实施组"},{"pk":"08010000","name":"外部合作销售","tree_name":"外部合作 / 外部合作销售","level":2,"sales_position":"","superior_department__pk":"08000000","id":"08010000","text":"外部合作销售"},{"pk":"11020000","name":"测试权限（二级部门）","tree_name":"测试权限 / 测试权限（二级部门）","level":2,"sales_position":"","superior_department__pk":"11000000","id":"11020000","text":"测试权限（二级部门）"},{"id":"07000000","pk":"07000000","text":"总经理助理","tree_name":"总经理助理","level":1},{"id":"04010000","pk":"04010000","text":"软件中心","tree_name":"软件中心","level":1},{"id":"06000000","pk":"06000000","text":"咨询二部","tree_name":"咨询二部","level":1}],"d_id":"00000000","d_name":"汉捷管理咨询有限公司","year_list":[{"id":2019,"name":2019},{"id":2020,"name":2020},{"id":2021,"name":2021},{"id":2022,"name":2022},{"id":2023,"name":2023},{"id":2024,"name":2024},{"id":2025,"name":2025},{"id":2026,"name":2026},{"id":2027,"name":2027},{"id":2028,"name":2028}],"cur_year":"2022"}}
        if (data1 && data1.status === 200) {
          // // 解析维度信息 
          // try {
          //   // if (!data1.dimension_obj.pl_id && !data1.dimension_obj.spfd_id && !data1.dimension_obj.d_id) {  // 公司维度
          //   //   company_array.value = data1.dimension_obj.d_list
          //   //   set_default_select_item(company_array.value[0].id, company_array.value[0].name, 'c')
          //   // } 
          //   // 如果之前传的
          //   if (spfd_id.value && bupl_id.value && d_id.value && spfd_id.value === '' && bupl_id.value === '' && d_id.value === '') {
          //     value_c.value = data1.dimension_obj.d_id

          //     set_default_select_item(data1.dimension_obj.d_id, data1.dimension_obj.d_name, 'c')
          //   }
          //   else {
          //     spfd_array.value = data1.dimension_obj.spfd_list
          //     bupl_array.value = data1.dimension_obj.pl_list
          //     dep_array.value = data1.dimension_obj.pl_list
          //     if (data1.dimension_obj.pl_id) {
          //       // 默认选中bupl
          //       value_bupl.value = data1.dimension_obj.pl_id
          //       set_default_select_item(data1.dimension_obj.pl_id, data1.dimension_obj.pl_name, 'bupl')
          //     } else if (data1.dimension_obj.spfd_id) {
          //       // 默认选中
          //       value_spfd.value = data1.dimension_obj.spfd_id
          //       set_default_select_item(data1.dimension_obj.spfd_id, data1.dimension_obj.spfd_name, 'spfd')
          //     }
          //     else if (data1.dimension_obj.d_id) {
          //       // 默认选中
          //       value_dep.value = data1.dimension_obj.d_list
          //       set_default_select_item(data1.dimension_obj.d_id, data1.dimension_obj.d_name, 'd')
          //     }
          //   }


          // } catch (error) {
          //   ElMessage.error('解析维度失败请刷新重试!' + error)
          // }
          // 解析doc信息
          try {
            if (data1.data.doc) {

              const base64_data = data1.data.doc
              const arrayBuffer = base64ToArrayBuffer(base64_data)

              // 使用pako进行解压
              const decompressedData = pako.inflate(arrayBuffer, { to: 'string' })
              // 将解压后的数据转换回JSON对象
              const data = JSON.parse(decompressedData)
              importSpecificData(data)
            } else {
              ElMessage.error('解析data1.data.doc数据失败请刷新重试!')
            }
          }
          catch (error) {
            ElMessage.error('解析数据失败请刷新重试!' + error)
          }
        }
        else {
          try {
            ElMessage.error(data1.msg)
          }
          catch (error) {
            ElMessage.error('获取失败请刷新重试！')
          }
        }
      } catch (error) {
        ElMessage.error('首页维度和ppt数据获取失败，请刷新重试！')
      }

      close_loading()
    }

    const open_loading = (msg?: string) => {
      loading.value = ElLoading.service({
        lock: false,
        text: msg ? msg : '加载中...',
        background: 'rgba(0, 0, 0, 0.6)',
        // target: '.pptist-editor'  // 这里添加你的div的class或者id
        // target: '#hj_all_ppt_id',  // 这里添加你的div的class或者id
      })
    }
    const close_loading = () => {
      if (loading.value) {
        // console.log('loading.value exists')
        if (typeof loading.value.close === 'function') {
          // console.log('loading.value.close is a function')
          setTimeout(() => {
            loading.value.close()
          }, 10)
        }
        // else {
        //   // console.log('loading.value.close is not a function')
        // }
      }
      //  else {
      //   console.log('loading.value does not exist')
      // }
    }

    handleUrlAndSleect('/primary_data/hz_ppt?bupl_id=0&spfd_id=0&d_id=0&year=2023&grid_key=ppt&show_c=1&title=ppt页面')
    // handleUrlAndSleect()
    // 处理与保存历史版本和查看历史版本的模块
    // const dimension_obj_for_index = ref<any>(null)
    const dimension_obj_for_index = reactive({
      'bupl_id': value_bupl,
      'spfd_id': value_spfd,
      'd_id': value_dep,
      'year': value_year,
      'gridKey': gridKey,
      'title': title,
      'select_pk_name': select_pk_name,
    })
    const select2 = ref(null)


    const saveData = async () => {
      open_loading('保存中...')
      const { slides, theme } = storeToRefs(slidesStore)
      // console.log(theme)
      // 获取数据 
      const data_ppt = pako.gzip(JSON.stringify(slides.value ? slides.value : null))
      // data_ppt转换为Base64编码时，String.fromCharCode.apply函数调用栈溢出了,因为data太大了，因此将unit8array 分块处理
      const base64_data = arrayBufferToBase64(data_ppt)
      const dimension_obj = {
        'bupl_id': value_bupl.value || 0,
        'spfd_id': value_spfd.value || 0,
        'd_id': value_dep.value || 0,
      }
      let resp = null
      try {
        // 发送数据给后端
        resp = await http.post('/hz_ppt', { method_: "insert_or_update_hz_ppt", ...dimension_obj, year: value_year.value, gridKey: gridKey.value, doc: base64_data })
      }
      catch (e) {
        message.error('更新失败，请重试')
        close_loading()
        return
      }
      if (resp && resp.status === 200) {
        // 返回响应
        message.success('保存成功')
        close_loading()
      }
      else {
        try {
          message.error(resp.msg)
          close_loading()
        } catch (e) {
          message.error('更新失败，请重试')
          close_loading()
        }
      }
    }
    // 将数据分块处理
    const arrayBufferToBase64 = (buffer) => {
      let binary = ''
      const bytes = new Uint8Array(buffer)
      const len = bytes.byteLength
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      return window.btoa(binary)
    }
    // 将Base64编码的数据转换回Uint8Array
    function base64ToArrayBuffer(base64) {
      const binary_string = window.atob(base64)
      const len = binary_string.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i)
      }
      return bytes.buffer
    }
    const viewHis = () => {
      message.success('查看历史')
    }
    // const handle_key_event = () => {
    //   const parentElement = document.getElementById('hz_ppt_editor_id')
    //   if (parentElement) {
    //     parentElement.addEventListener('keydown', keydownListener)
    //   }
    // }
    debugger
    const remindSave = () => {
      debugger
      return new Promise<void>((resolve, reject) => {
        debugger
        const { isChanged } = storeToRefs(slidesStore)
        if (isChanged.value) {
          ElMessageBox.confirm(
            '保存当前所做更改吗？',
            '信息',
            {
              confirmButtonText: '保存',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            // 调用保存数据的方法
            saveData().then(() => {
              slidesStore.setChanged_init()
              resolve() // 解决 Promise，表示点击了确定
            }).catch(error => {
              slidesStore.setChanged_init()
              reject() // 拒绝 Promise，表示出错或取消
            })
          }).catch(() => {
            slidesStore.setChanged_init()
            reject() // 拒绝 Promise，表示点击了取消
          })
        } else {
          resolve() // 解决 Promise，不需要保存直接通过
        }
      })
    }

    provide('get_hz_ppt_by_dimension_and_year', get_hz_ppt_by_dimension_and_year)
    const pptistEditor = ref(null)
    const hj_slider_dom = ref(null)
    const isSliderSmall = ref(false) // 用于判断 hj_slider 是否变小
    const adjustWidth = (hjSlider_data: any, source_type: number) => {
      if (source_type === 1 && !isSliderSmall.value) {
        // 是hj_slider 触发   并且 hj_slider 没变小 
        return
      }
      alert(hjSlider_data + " hjSlider_data")
      const computedWidth = window.getComputedStyle(hjSlider_data).width
      if (computedWidth === '0px' || computedWidth === '10px') {
        hjSlider_data.classList.remove('shrink')
        pptistEditor.value.classList.remove('expand')
        isSliderSmall.value = false
      } else {
        hjSlider_data.classList.add('shrink')
        pptistEditor.value.classList.add('expand')
        isSliderSmall.value = true
      }

      // // 当 hj_slider 变小以后，不再阻止 hj_slider 的点击事件
      // if (isSliderSmall.value) {
      //   sliderClicked()
      // }
    }

    // const sliderClicked = () => {
    //   // 当 hj_slider 变小以后，hj_slider 的点击事件可以生效
    //   if (isSliderSmall.value) {
    //     // 执行你的逻辑
    //   }
    // }
    // 处理默认关闭的
    onUnmounted(() => {
      // document.removeEventListener('keydown', keydownListener)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    })
    onMounted(() => {
      // 最后处理默认选中
      hanldeDefaultSelect()
      hj_slider_dom.value = document.querySelector('.hj_slider')
      pptistEditor.value = document.querySelector('.pptist-editor')
      window.addEventListener('beforeunload', handleBeforeUnload)
    })
    // 阻止离开当前页面代码

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const { isChanged } = storeToRefs(slidesStore);
      if (isChanged.value) {
        event.preventDefault();
        event.returnValue = '确认离开该页面吗'; // Chrome需要设置此属性


        // 监听用户点击取消事件
        const handleUserCancel = () => {
          // 隐藏全局加载动画
          hideGlobalLoading();

          // 移除用户点击取消事件监听器
          window.removeEventListener('unload', handleUserCancel);
        };

        // 添加用户点击取消事件监听器
        window.addEventListener('unload', handleUserCancel);
      }
    }
    const hideGlobalLoading = () => {
      const loading_dom = document.querySelector('.higet_processing ') as HTMLElement
      if (loading_dom) {
        loading_dom.style.display = 'none'
      }
    }
    return {
      remarkHeight,
      dialogForExport,
      closeExportDialog,
      value,
      importSpecificData,
      // pptData,
      handleUrlAndSleect,
      url,
      my_funture_years,
      selectYear,
      title,
      // 标记当前选了那个
      value_bupl,
      value_spfd,
      value_dep,
      value_year,
      gridKey,
      // 存储对应的下拉列表数据
      company_array,
      bupl_array,
      spfd_array,
      year_array,
      dep_array,
      a_click_hj_ppt_sidebar_select,
      handleDimessionChange,
      select_pk_name,
      // 标记 要显示那些维度的下拉列表
      bupl_id,
      year_id,
      spfd_id,
      d_id,
      loading,
      select2,
      saveData,
      viewHis,
      dimension_obj_for_index,
      adjustWidth,
      hj_slider_dom,
    }
  },
  created() {
    // alert(1213)
  },
  mounted() {
    // alert(1213)
  }
  // 在组件卸载时停止观察
})
</script>

<style lang="scss" scoped>
.pptist-editor {
  width: 91.6666666667%;
  height: 100%;
  transition: width 0.3s ease-in-out;
}

.layout-header {
  height: 40px;
}

.layout-content {
  height: calc(100% - 40px);
  display: flex;
}

.layout-content-left {
  width: 160px;
  height: 100%;
  flex-shrink: 0;
}

.layout-content-center {
  width: calc(100% - 160px - 260px);

  .center-top {
    height: 40px;
  }
}

.layout-content-right {
  width: 260px;
  height: 100%;
}
</style>

<style>
.example-showcase .el-loading-mask {
  z-index: 9;
}

.el-select-dropdown {
  width: 212px;
}

.el-select {
  width: 212px;
  height: 38px;
}

/* .hz_ppt_year_select {
  position: "absolute";
  width: 120px !important;
  max-width: 120px !important;
} */

.hz_ppt_year_select {
  width: 120px !important;
  height: 40px !important;
  line-height: 40px !important;
}

/* .hz_ppt_year_select .el-select-dropdown {
  width: 120px !important;
} */

/* .hz_ppt_year_select .el-popper {
  width: 120px !important;
  max-width: 120px !important;
} */
</style>