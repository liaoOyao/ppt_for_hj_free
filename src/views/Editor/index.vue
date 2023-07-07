<template>
  <div class="hj_final_all">
    <div class="hj_head_ppt">
      <div class="hj_head_ppt_filter_div">
        <!-- array_top: {{ array_top }} 侧边栏顶部部分 -->
        <div class="hj_ppt_inline " v-if="d_id !== ''">
          <span class="hj_head_ppt_filter_div_name common_hj_font_style">部门:&nbsp;</span>
          <el-select filterable   v-model="value_dep" placeholder="请选择部门"
            @change="(value: any) => handleBuplOrSpfdChange(value, 'd')">
            <el-option v-for="item in dep_array" :key="item.pk" :label="item.name" :value="item.pk">
            </el-option>
          </el-select>
        </div>

        <div class="hj_ppt_inline " v-if="bupl_id !== ''">
          <span class="hj_head_ppt_filter_div_name common_hj_font_style">BUPL:&nbsp;</span>
          <el-select filterable   v-model="value_bupl" placeholder="请选择pl"
            @change="(value: any) => handleBuplOrSpfdChange(value, 'bupl')">
            <el-option v-for="item in bupl_array" :key="item.pk" :label="item.name" :value="item.pk">
            </el-option>
          </el-select>
        </div>

        <div class="hj_ppt_inline " v-if="spfd_id !== ''">
          <span class="hj_head_ppt_filter_div_name common_hj_font_style">功能领域:&nbsp;</span>
          <el-select filterable   v-model="value_spfd" placeholder="请选择spfd"
            @change="(value: any) => handleBuplOrSpfdChange(value, 'spfd')">
            <el-option v-for="item in spfd_array" :key="item.pk" :label="item.name" :value="item.pk">
            </el-option>
          </el-select>
        </div>

        <div class="hj_ppt_inline " v-if="year_id !== ''">
          <span class="hj_head_ppt_filter_div_name common_hj_font_style">年份:&nbsp;</span>
          <el-select v-model="value_year" class="hj_head_ppt_filter_div_select" placeholder="请选择编制年份">
            <el-option v-for="item in year_array" :key="item.value" :label="item.label" :value="item.value" />
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
        <h4 class="text-center hj_font_size title_style title_big">{{ title }}</h4>
        <h5 class="text-center title_style hj_font_size_little title_small"> 部门:<span id="title_department"
            style="margin-right: 20px;">{{ select_pk_name }}</span> 年份:<span id="">{{ value_year }}</span></h5>
        <hr class="hj_head_ppt_title_div_hr">
      </div>
    </div>
    <div class="hj_all_ppt">
      <div class="hj_slider">
        <div class="hj_right_adjust_icon_father">
          <div class="hj_right_adjust_icon"></div>
        </div>

        <!-- 公司： {{ company_array }} 侧边栏部分 -->
        <div v-if="company_array.length > 0" class="hj_sidebar_category_ppt">
          <span class="higet_ppt_span_bold " style="font-size: 1.1em;">公司维度</span>
          <div class="hj_sidebar_ppt_item " :data-table_pk="company_array[0].pk" data-form_type="c">
            <div class="hj_sidebar_ppt_icon"></div>
            <a class="higet_ppt_pointer hj_siderbar_ppt_height hj_ppt_font "
              @click="hj_ppt_sidebar_select(company_array[0].pk ? company_array[0].pk : null, company_array[0].department_name ? company_array[0].department_name : null, 'c')">
              {{ company_array[0].department_name }}
            </a>
          </div>
          <div v-if="bupl_array.length > 0 || spfd_array.length > 0" class="hj_slider_bottom_line"></div>
        </div>

        <!-- 部门 -->
        <div v-if="company_array.length > 0" class="hj_sidebar_category_ppt">
          <span class="higet_ppt_span_bold " style="font-size: 1.1em;">部门</span>
          <div v-for="(item, index) in dep_array" class="hj_sidebar_ppt_item "  :key="index" :data-table_pk="item.pk"  data-form_type="d">
            <div class="hj_sidebar_ppt_icon"></div>
            <a class="higet_ppt_pointer hj_siderbar_ppt_height hj_ppt_font "
            @click="hj_ppt_sidebar_select(item.pk ? item.pk : null, item.name ? item.name : null, 'd')">
               {{ item.name }}
            </a>
          </div>
          <div v-if="bupl_array.length > 0 || spfd_array.length > 0" class="hj_slider_bottom_line"></div>
        </div>

        <!-- bupl  -->
        <div v-if="bupl_array.length > 0" class="hj_sidebar_category_ppt">
          <span class="higet_ppt_span_bold " style="font-size: 1.1em;">BUPL</span>
          <div v-for="(item, index) in bupl_array" class="hj_sidebar_ppt_item " :key="index" :data-table_pk="item.pk"
            data-form_type="bupl">
            <div class="hj_sidebar_ppt_icon"></div>
            <a class="higet_ppt_pointer hj_siderbar_ppt_height hj_ppt_font "
              @click="hj_ppt_sidebar_select(item.pk ? item.pk : null, item.name ? item.name : null, 'bupl')">
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
              @click="hj_ppt_sidebar_select(item.pk ? item.pk : null, item.name ? item.name : null, 'spfd')">
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
    const bupl_id = ref('')
    const year_id = ref('')
    const spfd_id = ref('')  //  spfd 功能领域的问题
    const d_id = ref('')  //  spfd 功能领域的问题


    // 处理链接和维度的问题 
    const url = window.location.href
    // let array_left: any[] = []
    // let array_top: any[] = []
    const array_left = ref<string[]>([])
    const array_top = ref<string[]>([])

    // 根据参数渲染数据
    const handleUrlAndSleect = (url: string) => {
      // 创建一个新的URL对象
      // const urlObj = new URL(url, 'http://example.com')
      const params = new URLSearchParams(window.location.search)
      // 使用URLSearchParams对象来获取查询参数
      // const params = new URLSearchParams(urlObj.search)
      console.log(params, "最终的params")

      // if (urlObj && urlObj.search) {
      if (params) {
        // 左侧列表和上侧下拉列表一样  除了公司
        // 接下来根据参数是否有获取数据信息

        // 标记要显示的  填充当前选中的
        if (params.has('spfd_id')) {
          const temp = params.get('spfd_id')
          if (temp && temp !== '-1' && temp !== '0') {
            getSpfdData()
            spfd_id.value = temp
            value_spfd.value = Number(temp)
          }
        }
        // bupl
        if (params.has('bupl_id')) {
          const temp = params.get('bupl_id')
          if (temp && temp !== '-1' && temp !== '0') {
            getBuplData()
            bupl_id.value = temp
            value_bupl.value = Number(temp)
          }
        }
        // d 部门
        if (params.has('d_id')) {
          const temp = params.get('d_id')
          if (temp) {
            getDepData()
            d_id.value = temp
            value_dep.value = Number(temp)
          }
        }
        // 年份
        if (params.has('year')) {
          const temp = params.get('year')
          if (temp) {
            getYearData()
            year_id.value = temp
            value_year.value = Number(temp)
          }
        } else {
          ElMessage.error('缺少年份信息')
        }

        if (params.has('show_c')) {
          // 如果其余3个皆为空时，公司也不用展示，因为就是公司
          if (bupl_id.value !== '' || spfd_id.value !== '' || d_id.value !== '') {
            getCompanyData()
          }
        }

        // 获取标题
        if (params.has('title')) {
          const arrayParam = params.get('title')
          const arrayParam2 = params.get('d_id')
          console.log(typeof arrayParam)
          console.log(typeof arrayParam2)
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
    // 标记当前选了那个
    const value_year = ref<any>(new Date().getFullYear())
    const value_bupl = ref<any>(null)
    const value_spfd = ref<any>(null)
    const value_dep = ref<any>(null)
    const value_c = ref<any>(null)

    const company_array = ref<any[]>([]) // 公司维度
    const dep_array = ref<any[]>([]) // 部门维度
    const bupl_array = ref<any[]>([]) // bupl 
    const spfd_array = ref<any[]>([]) // spfd功能领域
    const year_array = ref<any[]>([]) // 年份
    const select_pk_name = ref('') // 标题中pk_name
    const title = ref('')
    // const my_funture_years = ref([])


    const current_year = new Date().getFullYear()


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
        { pk: 1, name: "BUPL1" },
        { pk: 2, name: "BUPL2" },
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
        { pk: 1, name: "SPFD1" },
        { pk: 2, name: "SPFD2" },
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

    // 部门
    const getDepData = () => {
      dep_array.value = [
        { pk: 1, name: "SPFD1" },
        { pk: 2, name: "SPFD2" },
      ]
    }

    let selectedPk = ref<any>(null)
    // 切换选择的维度
    // 选中的样式
    // 取消  之前选中的样式
    const hj_ppt_sidebar_select = (pk: any, pk_name: string, name: string) => {
      if (pk && name) {
        selectedPk = pk
        const elements = document.querySelectorAll('.hj_sidebar_ppt_item') // 获取元素
        elements.forEach((element) => {
          const formType = element.getAttribute('data-form_type')
          const data_table_pk = element.getAttribute('data-table_pk')
          console.log(formType)
          debugger
          if (formType !== name || pk.toString() !== data_table_pk) {
            element.classList.remove('hj_sidebar_categroy_ppt_this')
          } else {
            element.classList.add('hj_sidebar_categroy_ppt_this')
            //  根据formType 是buplu 还是spfd 去选择后面的代码提供的el-select  ，然后再根据 pk和name 选择下拉框值
            if (formType === 'bupl') {
              value_bupl.value = pk
              value_spfd.value = null
              value_dep.value = null
              value_c.value = null
            } else if (formType === 'spfd') {
              value_spfd.value = pk
              value_bupl.value = null
              value_dep.value = null
              value_c.value = null
            } else if (formType === 'd') {
              value_dep.value = pk
              value_spfd.value = null
              value_bupl.value = null
              value_c.value = null
            } else if (formType === 'c') { 
              value_c.value = pk
              value_dep.value = null
              value_spfd.value = null
              value_bupl.value = null
            }
            // 更新标题中的部门
            select_pk_name.value = pk_name
          }
        })
      }
    }


    // bupl选中状态
    const handleBuplOrSpfdChange = (val: any, name: string) => {
      debugger
      let selectedOption = null
      if (name === 'spfd') {
        selectedOption = spfd_array.value.find(item => item.pk === val)
      }
      else if (name === 'bupl') {
        selectedOption = bupl_array.value.find(item => item.pk === val)
      }
      hj_ppt_sidebar_select(val, selectedOption ? selectedOption.name ? selectedOption.name : null : null, name)
    }

    // // spfd选中状态
    // const handleSpfdChange = (val: any, name: string) => {
    //   // hj_ppt_sidebar_select(val,label, name)
    // }
    // 导入数据
    const pptData = [{ 'id': 'ygsaCHGK0I', 'elements': [{ 'type': 'text', 'id': 'q6vnO4-ZOn', 'left': 72.19760572139303, 'top': 27.839319029850742, 'width': 181.3847429519071, 'height': 80, 'content': '<p style=\'\'>汉捷咨询管理有限公司</p>', 'rotate': 0, 'defaultFontName': 'Microsoft Yahei', 'defaultColor': '#333', 'outline': { 'width': 2, 'color': '#000', 'style': 'solid' } }], 'background': { 'type': 'solid', 'color': '#fff' } }, { 'id': '6zWUVwfKm7', 'elements': [{ 'type': 'text', 'id': 'o7twfyvKvt', 'left': 72.19760572139303, 'top': 27.839319029850742, 'width': 181.3847429519071, 'height': 80, 'content': '<p style=\'\'>汉捷咨询管理有限公司</p>', 'rotate': 0, 'defaultFontName': 'Microsoft Yahei', 'defaultColor': '#333', 'outline': { 'width': 2, 'color': '#000', 'style': 'solid' } }], 'background': { 'type': 'solid', 'color': '#fff' } }, { 'id': 'jt_byN3tvQ', 'elements': [{ 'type': 'text', 'id': 'A4wSlLCrDi', 'left': 72.19760572139303, 'top': 27.839319029850742, 'width': 181.3847429519071, 'height': 80, 'content': '<p style=\'\'>汉捷咨询管理有限公司</p>', 'rotate': 0, 'defaultFontName': 'Microsoft Yahei', 'defaultColor': '#333', 'outline': { 'width': 2, 'color': '#000', 'style': 'solid' } }], 'background': { 'type': 'solid', 'color': '#fff' } }]
    // [{ 'id':'ygsaCHGK0I','elements':[{'type':'text','id':'q6vnO4-ZOn','left':72.19760572139303,'top':27.839319029850742,'width':181.3847429519071,'height':80,'content':'<p style=\'\'>汉捷咨询管理有限公司</p>','rotate':0,'defaultFontName':'Microsoft Yahei','defaultColor':'#333','outline':{'width':2,'color':'#000','style':'solid'}}],'background':{'type':'solid','color':'#fff'}},{'id':'6zWUVwfKm7','elements':[{'type':'text','id':'o7twfyvKvt','left':72.19760572139303,'top':27.839319029850742,'width':181.3847429519071,'height':80,'content':'<p style=\'\'>汉捷咨询管理有限公司</p>','rotate':0,'defaultFontName':'Microsoft Yahei','defaultColor':'#333','outline':{'width':2,'color':'#000','style':'solid'}}],'background':{'type':'solid','color':'#fff'}},{'id':'jt_byN3tvQ','elements':[{'type':'text','id':'A4wSlLCrDi','left':72.19760572139303,'top':27.839319029850742,'width':181.3847429519071,'height':80,'content':'<p style=\'\'>汉捷咨询管理有限公司</p>','rotate':0,'defaultFontName':'Microsoft Yahei','defaultColor':'#333','outline':{'width':2,'color':'#000','style':'solid'}}],'background':{'type':'solid','color':'#fff'}}]
    const { importSpecificData } = useExport()
    onMounted(() => {
      // alert('加载导入的数据中')
      // importSpecificData([])
      // handleUrlAndSleect('/primary_data/company_strategy_action_pl?pl_id=01&year=2023&array_top='['year:1','spfd:1','pl:1']')
      // 'href': '/primary_data/hz_ppt?bupl_id=1&spfd_id=0&d_id=1&year=2023&grid_key=ppt&show_c=1&title=ppt页面',
      // handleUrlAndSleect('/primary_data/hz_ppt?bupl_id=1&spfd_id=1&d_id=1&year=2023&grid_key=ppt&show_c=1&title=ppt页面')
      handleUrlAndSleect(url)


      // handleUrlAndSleect('/primary_data/company_strategy_action_pl?pl_id=01&year=2023&title=年度人才计划&array_top=' + encodeURIComponent(JSON.stringify(['year', 'spfd', 'bupl'])) + '&array_left=' + encodeURIComponent(JSON.stringify(['company', 'spfd', 'bupl'])))
    })

    return {
      remarkHeight,
      dialogForExport,
      closeExportDialog,
      value,
      importSpecificData,
      pptData,
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
      // 存储对应的下拉列表数据
      company_array,
      bupl_array,
      spfd_array,
      year_array,
      dep_array,
      hj_ppt_sidebar_select,
      selectedPk,
      handleBuplOrSpfdChange,
      select_pk_name,
      // 标记 要显示那些维度的下拉列表
      bupl_id,
      year_id,
      spfd_id,
      d_id,
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
