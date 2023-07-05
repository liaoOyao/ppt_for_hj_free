<template>
  <div class="hj_final_all">
    <div class="hj_head_ppt">
      <div class="hj_head_ppt_filter_div">
        <!-- array_top: {{ array_top }} -->
        <div class="hj_ppt_inline ">
          <span class="hj_head_ppt_filter_div_name common_hj_font_style">功能领域:&nbsp;</span>
          <el-select v-if="array_top.indexOf('spfd') !== -1" v-model="value_year" placeholder="请选择spfd">
            <el-option v-for="item in spfd_array" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>

        </div>
        <div class="hj_ppt_inline " v-if="array_top.indexOf('pl') !== -1">
          <span class="hj_head_ppt_filter_div_name common_hj_font_style">BUPL:&nbsp;</span>
          <el-select v-model="value_year" placeholder="请选择pl">
            <el-option v-for="item in bupl_array" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>

        <div class="hj_ppt_inline " v-if="array_top.indexOf('year') !== -1">
          <span class="hj_head_ppt_filter_div_name common_hj_font_style">年份:&nbsp;</span>
          <el-select v-model="value_year" class="hj_head_ppt_filter_div_select" placeholder="请选择编制年份">
            <el-option v-for="item in year_array" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <!-- 年份快速筛选 -->
        <div v-if="array_top.indexOf('year') !== -1" class="hj_ppt_inline fast_year_font fast_year_style">
          <a v-for="( item, index ) in  my_funture_years " class=" hj_ppt_a " :key="item" @click="selectYear(item)"><span
              class="higet_ppt_pointer hj_ppt_font">{{ item }}</span><span v-if="index !== my_funture_years.length - 1"
              class="hj_ppt_font">&nbsp;|&nbsp;</span></a>
        </div>
      </div>
      <div class="hj_head_ppt_title_div">
        <h4 class="text-center hj_font_size title_style title_big">{{ title }}</h4>
        <h5 class="text-center title_style hj_font_size_little title_small"> 部门:<span id="title_department"
            style="margin-right: 20px;">汉捷公司</span> 年份:<span id="">{{ value_year }}</span></h5>
        <hr class="hj_head_ppt_title_div_hr">
      </div>
    </div>
    <div class="hj_all_ppt">
      <div class="hj_slider">
        <div class="hj_right_adjust_icon_father">
          <div class="hj_right_adjust_icon"></div>
        </div>

        <!-- 公司： {{ company_array }} -->
        <div v-if="company_array.length > 0" class="hj_sidebar_category_ppt">
          <span class="higet_ppt_span_bold " style="font-size: 1.1em;">公司维度</span>
          <div class="hj_sidebar_ppt_item " :data-table_pk="company_array[0].pk" data-form_type="c">
            <div class="hj_sidebar_ppt_icon"></div>
            <a class="higet_ppt_pointer hj_siderbar_ppt_height hj_ppt_font "
              @click="hj_ppt_sidebar_select(company_array[0].pk ? company_array[0].pk : null, 'c')"
              :class="{ 'hj_sidebar_categroy_ppt_this': company_array[0].pk == selectedPk }">
              {{ company_array[0].department_name }}
            </a>
          </div>
          <div v-if="bupl_array.length > 0 || spfd_array.length > 0" class="hj_slider_bottom_line"></div>
        </div>
        <!-- bupl部门  -->
        <div v-if="bupl_array.length > 0" class="hj_sidebar_category_ppt">
          <span class="higet_ppt_span_bold " style="font-size: 1.1em;">BUPL</span>
          <div v-for="(item, index) in bupl_array" class="hj_sidebar_ppt_item " :key="index" :data-table_pk="item.pk"
            data-form_type="pl">
            <div class="hj_sidebar_ppt_icon"></div>
            <a class="higet_ppt_pointer hj_siderbar_ppt_height hj_ppt_font "
              @click="hj_ppt_sidebar_select(item.pk ? item.pk : null, 'pl')">
              {{ item.name }}
            </a>
          </div>
          <div class="hj_slider_bottom_line" v-if="spfd_array.length > 0"></div>
        </div>

        <!-- 功能领域部门  -->
        <div v-if="spfd_array.length > 0" class="hj_sidebar_category_ppt">
          <span class="higet_ppt_span_bold " style="font-size: 1.1em;">功能领域部门</span>
          <div v-for="(item, index) in spfd_array" class="hj_sidebar_ppt_item " :key="index" :data-table_pk="item.pk"
            data-form_type="spfd">
            <div class="hj_sidebar_ppt_icon"></div>
            <a class="higet_ppt_pointer hj_siderbar_ppt_height hj_ppt_font "
              @click="hj_ppt_sidebar_select(item.pk ? item.pk : null, 'spfd')"
              :class="{ 'hj_sidebar_categroy_ppt_this': item.pk == selectedPk }">
              {{ item.name }}
            </a>
          </div>
        </div>

      </div>
      <div class="pptist-editor">
        <EditorHeader class="layout-header" />
        <div class="layout-content">
          <Thumbnails class="layout-content-left" />
          <div class="layout-content-center">
            <CanvasTool class="center-top" />
            <Canvas class="center-body" :style="{ height: `calc(100% - ${remarkHeight + 40}px)` }" />
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
import { defineComponent, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
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
import { ElMessage } from 'element-plus'
import { Mounted } from '@icon-park/vue-next'
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
    const { dialogForExport } = storeToRefs(mainStore)
    const closeExportDialog = () => mainStore.setDialogForExport('')

    const remarkHeight = ref(40)
    useGlobalHotkey()
    usePasteEvent()

    // 定义数组来存储参数
    // const pl_id: (string | null)[] = []
    // const year: (string | null)[] = []
    // const spfd_id: (string | null)[] = [] //  spfd 功能领域的问题


    // 处理链接和维度的问题 
    const url = window.location.href
    // let array_left: any[] = []
    // let array_top: any[] = []
    const array_left = ref<string[]>([])
    const array_top = ref<string[]>([])
    const handleUrlAndSleect = (url: string) => {
      // 创建一个新的URL对象
      const urlObj = new URL(url, 'http://example.com')
      // const params = new URLSearchParams(window.location.search)

      // 使用URLSearchParams对象来获取查询参数
      const params = new URLSearchParams(urlObj.search)
      if (urlObj && urlObj.search) {
        //  获取top_array 
        if (params.has('array_top')) {
          const arrayParam = params.get('array_top')
          if (arrayParam) {
            try {
              array_top.value = JSON.parse(decodeURIComponent(arrayParam.replace(/'/g, '"')))
              console.log(array_top, 'array_top')
            } catch (e) {
              ElMessage.error('参数解析错误')
            }
          } else {
            ElMessage.error('头部至少要有一个下拉列表')
          }
        }
        //  获取左侧的下拉列表
        if (params.has('array_left')) {
          //  将参数添加到对应的数组中
          const arrayParam = params.get('array_left')
          if (arrayParam) {
            //  存储 头部的下拉列表
            array_left.value = JSON.parse(decodeURIComponent(arrayParam.replace(/'/g, '"')))
            // 接下来根据参数是否有获取数据信息
            if (array_left.value.indexOf('company') !== -1) {
              getCompanyData()
            }
            if (array_left.value.indexOf('spfd') !== -1) {
              getSpfdData()
            }
            if (array_left.value.indexOf('bupl') !== -1) {
              getBuplData()
            }
            console.log(array_left, 'array_left')
          }
          else {
            ElMessage.error('左侧至少要有一个下拉列表')
          }
        }

        // 获取标题
        if (params.has('title')) {
          const arrayParam = params.get('title')
          if (arrayParam) {
            title.value = arrayParam
          }
          else {
            ElMessage.error('缺少页面标题')
          }
        }
      }
    }
    const value = ref('')
    const value_year = ref<any>(new Date().getFullYear())
    const value_bupl = ref<any>(null)
    const value_spfd = ref<any>(null)
    const company_array = ref<any[]>([]) // 公司维度
    const bupl_array = ref<any[]>([]) // bupl 
    const spfd_array = ref<any[]>([]) // spfd功能领域
    const year_array = ref<any[]>([]) // 年份

    value_year
    value_year
    const title = ref('')
    // const my_funture_years = ref([])


    const current_year = new Date().getFullYear()

    const options = [
      {
        value: 'Option1',
        label: 'Option1',
      },
      {
        value: 'Option2',
        label: 'Option2',
      },
      {
        value: 'Option3',
        label: 'Option3',
      },
      {
        value: 'Option4',
        label: 'Option4',
      },
      {
        value: 'Option5',
        label: 'Option5',
      },
    ]


    //  3年

    const my_funture_years = [current_year, current_year + 1, current_year + 2]

    // 快速筛选
    const selectYear = (year: number) => {
      console.log(`You selected ${year}`)
      value_year.value = year
      // 这里你可以添加你的逻辑
    }

    // 获取几个维度的数据
    const getBuplData = () => {
      bupl_array.value = [
        { pk: 300, name: "bupl1" },
        { pk: 400, name: "bupl2" },
      ]
    }

    const getCompanyData = () => {
      company_array.value = [
        {
          "pk": 29,
          "year": "2023",
          "department_id": "00000000",
          "department_name": "汉捷公司",
          "division": "经营策略",
          "category": "",
          "description": "",
          "order_number": 10,
          "authority": 2
        },
        {
          "pk": 30,
          "year": "2023",
          "department_id": "00000000",
          "department_name": "汉捷公司",
          "division": "经营策略",
          "category": "",
          "description": "",
          "order_number": 10,
          "authority": 2
        }
      ]
    }

    const getSpfdData = () => {
      spfd_array.value = [
        { pk: 100, name: "spfd1" },
        { pk: 2000, name: "spfd2" },
      ]
    }

    const getYearData = () => {
      year_array.value = [
        {
          value: '2020',
          label: '2020',
        },
        {
          value: '2021',
          label: '2021',
        },
        {
          value: '2022',
          label: '2022',
        },
        {
          value: '2023',
          label: '2023',
        },
        {
          value: '2024',
          label: '2024',
        },
      ]
    }

    let selectedPk = ref<any>(null)
    // 切换选择的维度
    // 选中的样式
    // 取消  之前选中的样式
    const hj_ppt_sidebar_select = (pk: any, name: string) => {
      if (pk && name) {
        selectedPk = pk
        const elements = document.querySelectorAll('.hj_sidebar_ppt_item') // 获取元素
        elements.forEach((element) => {
          const formType = element.getAttribute('data-form_type')
          console.log(formType)
          if (formType !== name) {
            // 移除这个元素下的a标签的 hj_sidebar_categroy_ppt_this样式类
            const el_a = element.querySelector('a') 
            if (el_a) {
              el_a.classList.remove('hj_sidebar_categroy_ppt_this')
            }
          } else {
            const data_table_pk = element.getAttribute('data-table_pk')
            console.log(data_table_pk)
            if (data_table_pk === pk) {
              // 给这个元素下的a标签 增加样式类名为 hj_sidebar_categroy_ppt_this
              const el_a = element.querySelector('a')
              if (el_a) {
                el_a.classList.add('hj_sidebar_categroy_ppt_this')
              }
            }
          }
        })
      } else {
        ElMessage.error('缺少对应pk值或formType，请联系管理员')
      }
    }
    // 导入数据
    const pptData = [{ 'id': 'ygsaCHGK0I', 'elements': [{ 'type': 'text', 'id': 'q6vnO4-ZOn', 'left': 72.19760572139303, 'top': 27.839319029850742, 'width': 181.3847429519071, 'height': 80, 'content': '<p style=\'\'>汉捷咨询管理有限公司</p>', 'rotate': 0, 'defaultFontName': 'Microsoft Yahei', 'defaultColor': '#333', 'outline': { 'width': 2, 'color': '#000', 'style': 'solid' } }], 'background': { 'type': 'solid', 'color': '#fff' } }, { 'id': '6zWUVwfKm7', 'elements': [{ 'type': 'text', 'id': 'o7twfyvKvt', 'left': 72.19760572139303, 'top': 27.839319029850742, 'width': 181.3847429519071, 'height': 80, 'content': '<p style=\'\'>汉捷咨询管理有限公司</p>', 'rotate': 0, 'defaultFontName': 'Microsoft Yahei', 'defaultColor': '#333', 'outline': { 'width': 2, 'color': '#000', 'style': 'solid' } }], 'background': { 'type': 'solid', 'color': '#fff' } }, { 'id': 'jt_byN3tvQ', 'elements': [{ 'type': 'text', 'id': 'A4wSlLCrDi', 'left': 72.19760572139303, 'top': 27.839319029850742, 'width': 181.3847429519071, 'height': 80, 'content': '<p style=\'\'>汉捷咨询管理有限公司</p>', 'rotate': 0, 'defaultFontName': 'Microsoft Yahei', 'defaultColor': '#333', 'outline': { 'width': 2, 'color': '#000', 'style': 'solid' } }], 'background': { 'type': 'solid', 'color': '#fff' } }]
    // [{ 'id':'ygsaCHGK0I','elements':[{'type':'text','id':'q6vnO4-ZOn','left':72.19760572139303,'top':27.839319029850742,'width':181.3847429519071,'height':80,'content':'<p style=\'\'>汉捷咨询管理有限公司</p>','rotate':0,'defaultFontName':'Microsoft Yahei','defaultColor':'#333','outline':{'width':2,'color':'#000','style':'solid'}}],'background':{'type':'solid','color':'#fff'}},{'id':'6zWUVwfKm7','elements':[{'type':'text','id':'o7twfyvKvt','left':72.19760572139303,'top':27.839319029850742,'width':181.3847429519071,'height':80,'content':'<p style=\'\'>汉捷咨询管理有限公司</p>','rotate':0,'defaultFontName':'Microsoft Yahei','defaultColor':'#333','outline':{'width':2,'color':'#000','style':'solid'}}],'background':{'type':'solid','color':'#fff'}},{'id':'jt_byN3tvQ','elements':[{'type':'text','id':'A4wSlLCrDi','left':72.19760572139303,'top':27.839319029850742,'width':181.3847429519071,'height':80,'content':'<p style=\'\'>汉捷咨询管理有限公司</p>','rotate':0,'defaultFontName':'Microsoft Yahei','defaultColor':'#333','outline':{'width':2,'color':'#000','style':'solid'}}],'background':{'type':'solid','color':'#fff'}}]
    const { importSpecificData } = useExport()
    onMounted(() => {
      // alert('加载导入的数据中')
      // importSpecificData([])
      // handleUrlAndSleect('/primary_data/company_strategy_action_pl?pl_id=01&year=2023&array_top='['year:1','spfd:1','pl:1']')
      handleUrlAndSleect('/primary_data/company_strategy_action_pl?pl_id=01&year=2023&title=年度人才计划&array_top=' + encodeURIComponent(JSON.stringify(['year', 'spfd', 'bupl'])) + '&array_left=' + encodeURIComponent(JSON.stringify(['company', 'spfd', 'bupl'])))
    })

    return {
      remarkHeight,
      dialogForExport,
      closeExportDialog,
      value,
      options,
      importSpecificData,
      pptData,
      handleUrlAndSleect,
      url,
      value_year,
      my_funture_years,
      selectYear,
      array_left,
      array_top,
      title,
      value_bupl,
      value_spfd,
      company_array,
      bupl_array,
      spfd_array,
      year_array,
      hj_ppt_sidebar_select,
      selectedPk,
    }

  },
  created() {
    // alert(1213)
  },
  mounted() {
    // alert(1213)
  }
})
</script>

<style lang="scss" scoped>
.pptist-editor {
  width: 85%;
  height: 100%;
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