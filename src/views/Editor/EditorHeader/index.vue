<template>
  <div class="editor-header">
    <div class="left">
      <Dropdown :trigger="['click']">
        <div class="menu-item">
          <IconFolderClose /> <span class="text">文件</span>
        </div>
        <template #overlay>
          <Menu>
            <FileInput accept=".pptist" @change="files => importSpecificFile(files)">
              <MenuItem>导入 pptist 文件</MenuItem>
            </FileInput>
            <MenuItem @click="setDialogForExport('pptist')">导出 pptist 文件</MenuItem>
            <MenuItem @click="setDialogForExport('pptx')">导出 PPTX</MenuItem>
            <MenuItem @click="setDialogForExport('image')">导出图片</MenuItem>
            <MenuItem @click="setDialogForExport('json')">导出 JSON</MenuItem>
            <MenuItem @click="setDialogForExport('pdf')">打印 / 导出 PDF</MenuItem>
          </Menu>
        </template>
      </Dropdown>
      <Dropdown :trigger="['click']">
        <div class="menu-item">
          <IconEdit /> <span class="text">编辑</span>
        </div>
        <template #overlay>
          <Menu>
            <MenuItem @click="undo()">撤销</MenuItem>
            <MenuItem @click="redo()">重做</MenuItem>
            <MenuItem @click="createSlide()">添加页面</MenuItem>
            <MenuItem @click="deleteSlide()">删除页面</MenuItem>
            <MenuItem @click="toggleGridLines()">{{ showGridLines ? '关闭网格线' : '打开网格线' }}</MenuItem>
            <MenuItem @click="toggleRuler()">{{ showRuler ? '关闭标尺' : '打开标尺' }}</MenuItem>
            <MenuItem @click="resetSlides()">重置幻灯片</MenuItem>
          </Menu>
        </template>
      </Dropdown>
      <Dropdown :trigger="['click']">
        <div class="menu-item">
          <IconPpt /> <span class="text">演示</span>
        </div>
        <template #overlay>
          <Menu>
            <MenuItem @click="enterScreeningFromStart()">从头开始</MenuItem>
            <MenuItem @click="enterScreening()">从当前页开始</MenuItem>
          </Menu>
        </template>
      </Dropdown>
      <Dropdown :trigger="['click']">
        <div class="menu-item">
          <IconHelpcenter /> <span class="text">帮助</span>
        </div>
        <template #overlay>
          <Menu>
            <!-- <MenuItem @click="goIssues()">意见反馈</MenuItem> -->
            <MenuItem @click="hotkeyDrawerVisible = true">快捷键</MenuItem>
          </Menu>
        </template>
      </Dropdown>
      <Tooltip :mouseLeaveDelay="0" title="加载模版">
        <div class="menu-item" @click="openTemplate(1)">
          <IconDownloadOne fill="#666"></IconDownloadOne><span class="text">加载模版</span>
        </div>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" title="编辑模版">
        <div class="menu-item" @click="openTemplate(2)">
          <IconFileEditing fill="#666"></IconFileEditing><span class="text">编辑模版</span>
        </div>
      </Tooltip>
    </div>

    <div class="right">
      <Tooltip :mouseLeaveDelay="0" title="保存数据">
        <div class="menu-item" @click="handleSaveData()">
          <IconSave size="18" fill="#666"></IconSave>
        </div>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" title="保存当前版本">
        <div class="menu-item" @click="openHistory(1)">
          <IconSaveOne size="18" fill="#666"></IconSaveOne>
        </div>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" title="查看历史版本">
        <div class="menu-item" @click="openHistory(2)">
          <IconHistory size="18" fill="#666"></IconHistory>
        </div>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" title="导出">
        <div class="menu-item" @click="setDialogForExport('pptx')">
          <IconShare size="18" fill="#666" />
          <!-- <IconExport size="18" fill="#666" /> -->


        </div>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" title="幻灯片放映">
        <div class="menu-item" @click="enterScreening()">
          <IconPpt size="19" fill="#666" style="margin-top: 1px;" />
        </div>
      </Tooltip>
      <!-- <a href="https://github.com/pipipi-pikachu/PPTist" target="_blank">
        <div class="menu-item"><IconGithub size="18" fill="#666" /></div>
      </a> -->
    </div>

    <Drawer width="320" placement="right" :visible="hotkeyDrawerVisible" @close="hotkeyDrawerVisible = false">
      <HotkeyDoc />
    </Drawer>
    <!-- 保存历史功能的对话框 -->
    <!-- :before-close="(formRef: any, done: any) => handleBeforeClose(formRef, done)" :close-on-click-modal="false" -->

    <el-dialog v-model="historyDrawerVisible" title="保存当前版本" width="30%" draggable align-center
      :before-close="handleBeforeClose" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="formRef" :model="verisonNameValidateForm" label-width="100px" class="demo-ruleForm"
        style="margin-top: 25px;">
        <el-form-item label="版本名称" prop="verison_name" :rules="[
          { required: true, message: '请输入版本名称', key: 1, },
          { type: 'string', message: '最大长度256', max: 256, key: 2 },
        ]">
          <el-input v-model="verisonNameValidateForm.verison_name" placeholder="请输入版本名称" clearable />
        </el-form-item>
        <el-form-item>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetForm(formRef)">取消</el-button>
          <el-button type="primary" @click="submitForm(formRef)">确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看历史版本功能的对话框 -->
    <el-dialog v-model="historyDrawerViewHisVisible" title="查看历史版本" width="98%" height="98%" draggable align-center
      :before-close="(done: any) => handleBeforeCloseViewHis(done)" :close-on-click-modal="false"
      :destroy-on-close="true">
      <div class="viewHisAll">
        <div class="viewHisHeader">
          <div class="titleLine">{{ his_title }}</div>
        </div>
        <div class="viewHisContent">
          <div class="PptLeft">
            <div class="ppt_save_current_version" @click="openHistory(1)">
              保存当前版本 <br>
            </div>
            <div class="font_common_ppt">
              (根据当前数据新增历史版本)
            </div>
            <hr class="ppt_view_his_hr" />
            <div v-if="!pptNULLVisable">
              <div class="pptSiderBar" v-for="(item, index) in version_list" :key="index">
                <div :data-id="item.id" :data-version="item.name" class="hiwin_ppt_snapshot_models_sidebar_row"
                  :class="{ 'hiwin_ppt_snapshot_models_sidebar_row_select': index === 0 }">
                  <!-- 有默认选中样式 -->
                  <div class="viewSiderBarIcon"></div>
                  <!-- <Delete-mode theme="outline" size="14" fill="#ee0c0c" strokeLinejoin="bevel"/> -->
                  <!-- <IconDeleteMode class="ppt_delete_icon" @click=""></IconDeleteMode> -->
                  <IconDeleteMode class="ppt_delete_icon" @click="openDialog(item)" />
                  <a class="higet_pointer hiwin_ppt_snapshot_models_sidebar_row_a"
                    @click="hj_ppt_sidebar_his_view_select(item.id ? item.id : null, item.name || null, false)">{{
                      item.name
                    }}</a>
                </div>
              </div>
            </div>
            <div class="pptHisListNull" v-else><span class="font_common_ppt">暂无历史版本</span></div>
          </div>
          <div class="PptRight" v-if="!pptNULLVisable">
            <div class="versionInfoLine">版本：<span class="span_ppt_version">{{ version_info.version_name }}</span>
              <div class="ppt_crateor_info">创建人：<span class="span_ppt_creator" style="margin-right: 20px;">{{
                version_info.ppt_creator }}</span>创建时间：<span class="span_created_time">{{
    version_info.created_time }}</span></div>
            </div>
            <div class="viewHistPPt">
              <APP />
            </div>
          </div>
          <div class="pptNull" v-if="pptNULLVisable"><span class="higet_color_red">没有可查看数据或暂无权限查看</span></div>
        </div>

      </div>
      <template #footer>
        <span class="dialog-footer ">
          <el-button @click="closeHisView" class="hzppt_view_close">关闭</el-button>
          <!-- <el-button type="primary" @click="historyDrawerViewHisVisible = false">
            确定
          </el-button> -->
        </span>
      </template>
    </el-dialog>

    <!-- 编辑模版和加载模版对话框 -->
    <el-dialog v-model="templateDrawerVisible" :title="template_type === 1 ? '加载模版' : '编辑模版'" width="98%" height="98%"
      draggable align-center :before-close="(done: any) => handleBeforeCloseViewHis(done)" :close-on-click-modal="false"
      :destroy-on-close="true" class="full-dialog" :show-close="false">
      <div class="HZPPTTemplateAll">
        <div>
          <!-- 内容区域 -->
          <div class="HZPPTTemplateHead ">
            <div :class="template_type === 1 ? 'HZPPTTemplateHead_load' : 'HZPPTTemplateHead_edit'">
              <el-select filterable v-model="value_template" placeholder="请选择模版"
                @change="(value: number) => handleTemplateChange(value)" width="100%" class="template_ppt_select">
                <el-option v-for="item in ppt_template_list" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div v-if="template_type === 2">
              <el-button @click="updateTemplateName" type="primary" plain size="default">修改名称</el-button>
              <el-button size="default" @click="addTemplate_start" type="primary">新增模版</el-button>
              <el-button type="danger" @click="delTemplateDialog(value_template)" size="default">删除模板</el-button>
              <!-- <el-button @click="hjTable.get_table_data" size="large">显示数据</el-button> -->
            </div>
          </div>
          <div class="ppt_template_content" v-if="!pptTemplateNULLVisable">
            <!-- 加载模版 -->
            <!-- <div v-if="template_type === 1"> -->
            <AppForTemplate />
            <!-- </div> -->
            <!-- 编辑模版 -->
            <!-- <div v-else>
              <AppForTemplate />
            </div> -->
          </div>
        </div>
        <div class="pptNull" v-if="pptTemplateNULLVisable"><span class="higet_color_red">(没有可查看数据或暂无权限查看)</span></div>
      </div>
      <template #footer>
        <span class="dialog-footer ">
          <el-button @click="cancelTemplate" class="">关闭</el-button>
          <el-button v-if="template_type === 1" type="primary" @click="sureTemplate">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="pptTemplateUpdateNameVisable" :title="handle_templat_button_type === 1 ? '修改模版名称' : '新增模版'"
      width="30%" draggable align-center :before-close="handleBeforeClose" :close-on-click-modal="false"
      :destroy-on-close="true">
      <el-form ref="formTemplateRef" :model="verisonNameValidateForm" label-width="100px" class="demo-ruleForm"
        style="margin-top: 25px;">
        <el-form-item label="模版名称" prop="verison_name" :rules="[
          { required: true, message: '请输入模版名称', key: 1, },
          { type: 'string', message: '最大长度256', max: 256, key: 2 },
        ]">
          <el-input v-model="verisonNameValidateForm.verison_name" placeholder="请输入模版名称" clearable />
        </el-form-item>
        <el-form-item>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetTemlateForm(formTemplateRef)">取消</el-button>
          <el-button type="primary" @click="submitTemplateForm(formTemplateRef)">确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <!-- {{ dimension_obj_for_index }} -->
</template>

<script lang="ts">
import { defineComponent, ref, reactive, ComponentOptions, onMounted, SetupContext, onUnmounted, provide, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import useScreening from '@/hooks/useScreening'
import useSlideHandler from '@/hooks/useSlideHandler'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useExport from '@/hooks/useExport'
// import saveHistory from '../../Editor/histtoryDialog/SaveHistory.vue'
// import viewHistory from '../../Editor/histtoryDialog/ViewHistory.vue'
import APP from '@/views/components/App.vue'
import AppForTemplate from '@/AppForTemplate.vue'
// import APP from '@/App.vue'

import HotkeyDoc from './HotkeyDoc.vue'
import { ElLoading, FormInstance, ElMessageBox, ElMessage } from 'element-plus'
import http from '@/utils/http'

// import { fa } from 'element-plus/es/locale'
import pako from '@/utils/pako/pako.min.js'
import { arrayBufferToBase64, base64ToArrayBuffer } from '@/utils/handle_data'
import { tr } from 'element-plus/es/locale'
// import { fa } from 'element-plus/es/locale'
// import { method } from 'lodash'
export default defineComponent({
  name: 'editor-header',
  components: {
    HotkeyDoc,
    APP,
    AppForTemplate,
  },
  // props:['dimension_obj_for_index'],
  props: {
    dimension_obj_for_index: {
      type: Object, // 或者其他你期望的类型
      required: true, // 如果这个prop是必需的，否则可以省略
    }
  },
  // setup(context: SetupContext) {
  // setup(_: unknown, props: { dimension_obj_for_index: Object },context: SetupContext) {
  setup(props: { dimension_obj_for_index: any }, context: SetupContext) {
    const mainStore = useMainStore()
    const { showGridLines, showRuler } = storeToRefs(mainStore)

    const { enterScreening, enterScreeningFromStart } = useScreening()
    const { createSlide, deleteSlide, resetSlides } = useSlideHandler()
    const { redo, undo } = useHistorySnapshot()
    const { importSpecificFile } = useExport()

    const setDialogForExport = mainStore.setDialogForExport

    const toggleGridLines = () => {
      mainStore.setGridLinesState(!showGridLines.value)
    }

    const toggleRuler = () => {
      mainStore.setRulerState(!showRuler.value)
    }

    const hotkeyDrawerVisible = ref(false)
    const historyDrawerVisible = ref(false)
    const historyDrawerViewHisVisible = ref(false)
    const loading = ref(null)




    const goIssues = () => {
      window.open('https://github.com/pipipi-pikachu/PPTist/issues')
    }
    const slidesStore = useSlidesStore()  // slider 仓库
    let current_version_obj = null
    const openHistory = (index: number) => {
      if (index === 1) {
        // 打开保存历史弹窗
        historyDrawerVisible.value = true
      } else if (index === 2) {
        // 查看历史
        // 打开主页时页面已经渲染好，只是没显示，点击查看历史时渲染样式和数据
        historyDrawerViewHisVisible.value = true
        // 设置标题
        const my_dimession = props.dimension_obj_for_index
        if (!my_dimession) {
          ElMessage.error('首页的维度对象没有获取到，请刷新重试！')
          return
        }
        his_title.value = (my_dimession.title ? my_dimession.title : '无') + ' 历史版本  ' + '(' + (my_dimession.select_pk_name ? my_dimession.select_pk_name : '空维度') + ' ' + (my_dimession.year ? my_dimession.year : '无年份') + ')'
        // his_title.value = (my_dimession.title ? my_dimession.title : '无') + ('&npsb;&npsb;历史版本' + '&npsb;&npsb;') + ('(' ) + (my_dimession.select_pk_name ? my_dimession.select_pk_name : '空维度')+ &nbsp; + (my_dimession.year ? my_dimession.year : '无年份') + ')')
        //获取历史版本
        get_ppt_history_list()
      }
    }

    const { importSpecificData } = useExport()
    const import_my_data = (current_version_obj_temp: any) => {
      try {
        if (current_version_obj_temp) {
          const base64_data = current_version_obj_temp.doc
          const arrayBuffer = base64ToArrayBuffer(base64_data)
          // 使用pako进行解压
          const decompressedData = pako.inflate(arrayBuffer, { to: 'string' })
          // 将解压后的数据转换回JSON对象
          const data = JSON.parse(decompressedData)
          importSpecificData(data)
          if (current_version_obj_temp && current_version_obj_temp.theme) {
            try {
              slidesStore.setTheme(current_version_obj_temp.theme)
            } catch (error) {
            }
          }
        }
        else {
          ElMessage.error('没有获取到ppt数据，请刷新重试！')
        }
      } catch (error) {
        ElMessage.error('加载ppt数据出错，请联系管理员')
      }
    }
    const his_title = ref<string>('')
    const get_ppt_history_list = async () => {
      // const get_ppt_history_list = () => {
      // 获取ppt历史记录
      try {
        const localDimensionObj = reactive({
          ...props.dimension_obj_for_index
        })
        // console.log(props.dimension_obj_for_index, 'localDimensionObj')
        localDimensionObj.bupl_id = localDimensionObj.bupl_id || 0
        localDimensionObj.spfd_id = localDimensionObj.spfd_id || 0
        localDimensionObj.d_id = localDimensionObj.d_id || 0
        // console.log(localDimensionObj, 'localDimensionObj')
        // const data = { "status": 200, "msg": "ok", "data": { "version_list": [{ "id": 105, "name": "加载模版时时自动生成2023-07-24 18:53", "create_time": "2023-07-24 18:50:41", "hiwin_creator": "李海" }, { "id": 104, "name": "加载模版时时自动生成2023-07-24 18:50", "create_time": "2023-07-24 18:50:22", "hiwin_creator": "李海" }, { "id": 103, "name": "加载模版时时自动生成2023-07-24 18:50", "create_time": "2023-07-24 18:48:32", "hiwin_creator": "李海" }, { "id": 102, "name": "加载模版时时自动生成2023-07-24 18:48", "create_time": "2023-07-24 18:37:35", "hiwin_creator": "李海" }, { "id": 101, "name": "加载模版时时自动生成2023-07-24 18:36", "create_time": "2023-07-24 17:51:54", "hiwin_creator": "李海" }, { "id": 100, "name": "123", "create_time": "2023-07-24 17:51:54", "hiwin_creator": "李海" }, { "id": 98, "name": "加载模版时时自动生成2023-07-24 17:51", "create_time": "2023-07-24 17:02:22", "hiwin_creator": "李海" }, { "id": 97, "name": "12312", "create_time": "2023-07-24 17:02:22", "hiwin_creator": "李海" }, { "id": 95, "name": "12312", "create_time": "2023-07-24 17:02:16", "hiwin_creator": "李海" }, { "id": 66, "name": "123-8", "create_time": "2023-07-20 10:09:28", "hiwin_creator": "李海" }, { "id": 64, "name": "123-7", "create_time": "2023-07-20 10:09:24", "hiwin_creator": "李海" }, { "id": 62, "name": "123-6", "create_time": "2023-07-20 10:09:19", "hiwin_creator": "李海" }, { "id": 60, "name": "123-5", "create_time": "2023-07-20 10:09:15", "hiwin_creator": "李海" }, { "id": 58, "name": "123-4", "create_time": "2023-07-20 10:09:11", "hiwin_creator": "李海" }, { "id": 56, "name": "123-3", "create_time": "2023-07-20 10:09:07", "hiwin_creator": "李海" }, { "id": 54, "name": "123-2", "create_time": "2023-07-20 10:09:03", "hiwin_creator": "李海" }, { "id": 52, "name": "123-1", "create_time": "2023-07-20 10:08:58", "hiwin_creator": "李海" }, { "id": 51, "name": "123", "create_time": "2023-07-20 10:07:47", "hiwin_creator": "李海" }, { "id": 50, "name": "123", "create_time": "2023-07-20 10:07:45", "hiwin_creator": "李海" }], "current_version_obj": { "id": 105, "name": "加载模版时时自动生成2023-07-24 18:53", "doc": "H4sIAAAAAAAAA9VWT2/cRBT/KtZwyMXrzj97bBMiQVAVIRKStLSiaQ7O7mzWqmMbe5LdUOWCKlUFcYsQh0pUVSRyQcCpUqDqp9nd8C143rXH3rIhiapUYnZmbb95M/N+7+9sPUZhB/lIyVy18ijsyBZBJpKR3JOxypG/9Ripw1QCS94L4GlO+Xl7Z3OQwlckuwr52EQqSZFPMbz1w47qId/mjol6MtztAQNzqGWb6CCU/U+SAWxbcMLYNlEaFNxo1cDw+xwGkOFZ/BfjARzSDaMIWD6wd7ydjj0hDGRnM1BhgvxuEOXSREkatEN1CLJYwkRZogIFUuMjcz6AJHm0knX/BaAWnxVQtPgU36jw3ShM7yFfZftyvuxKDlQletiJxepAi05cx+IOdgQntmCYMVFiaQnLZoRyr2yuU9vGtWtw1HUt4RIKpCiM5UpJJhY1UTuJFTgCnLqYGrk6jORHD9FDtLSYqyyJd+GZBrGe6AJ3Kw+/kb5BCE0HwDj649noh1fr63eH3704f/168VaxYAke5fpb6RJqQDZRR3aD/Ujdhq3Wgr0C+2rYzpI86SrjqwBkRppnOYmSrFAtYwxdoCyRq71761pZzLYrV7WZVUCepxHbmUU+A3OhgdKgPB0sLA2fn47P3oz+Oh6fnI1+fDo+fTM8Ox4fn2q0NwCyMFUF8nacPsh5DdIhFUjmmihXQQbULWwWHitjWLFlc2/ylSbhNMwRrEbbBezyOO2uE9RF+CSQHpBWGD0C7p2g/Wg3S/aLPes4Kxn1Vt1JQ0eF9G9nG3pBtmnaMFVr8Zef1Q7PKxsS7mp5BCG1AQW4vsfEFT16oTisFUThbuwbbZiU2YcLc128aXvulqYf/XoyPHkyevUnuPjoxdO/X/703r18b3PlYGNNa4hiwI8bjVX+wD3L5dT2yu7wqwXAJYqaryAdG00FDZ/99paObjg2xPLGp/12HRuUWdhraEDUoWKxZuPzI4fZ3HLB8XR/xzjiF1Uo7PW/vt/XgreosJzGsaQI7YnknFFLsIZIQm9OsO1Y1HN0Z7WNCZTkxgz0S0scxcaywbHRguFMOsEllZRkMqVPC2BZCYlbcdCSo3gneqacKOlT6rSWXrmA1jXzOllpfkpiV7kAHdzpyeVGTnKZZRO37lWGEjZEYu1vTJvGwbbVXNDIXvA1O3W5ZSpVNy8f1XXk+jq8wCNX0/6BqC8elJAZ36KuvgUSy8V23cT/AfXsFfKCRHt/44u7H9f3Xoa55WHBda/M7rkWwQ00tI53ImbDrqEBjt+1Pk282zfKkvsfydnFRXIePfn5/PeX5798O37+fV20bqh2gQqSrHMHlAxr7OsG6vY/ftPVEqsMAAA=", "create_time": "2023-07-24 18:50:41", "hiwin_creator": "李海" } } }
        const data = await http.get('/hz_ppt', { method_: "get_ppt_history_list", ...localDimensionObj })
        if (data && data.status === 200) {
          if (data.data.version_list && data.data.version_list.length > 0) {
            pptNULLVisable.value = false
            version_list.value = data.data.version_list
            current_version_obj = data.data.current_version_obj
            // 导入当前页面的数据
            import_my_data(current_version_obj)
            // 默认选中样式和填充值
            hj_ppt_sidebar_his_view_select(current_version_obj.id, current_version_obj.name, true)
          } else if (data.data.version_list && data.data.version_list.length === 0) {
            pptNULLVisable.value = true
          }
          else {
            ElMessage.error(data ? data.msg ? data.msg : '获取历史列表失败，请刷新重试' : '获取历史列表失败，请刷新重试')
          }
        } else {
          ElMessage.error(data ? data.msg ? data.msg : '获取历史列表失败，请刷新重试' : '获取历史列表失败，请刷新重试')
        }
      } catch (e) {
        ElMessage.error('获取历史列表失败，请刷新重试')
      }
    }
    // 保存历史版本模块
    const formRef = ref<FormInstance>()


    const verisonNameValidateForm = reactive({
      verison_name: '',
    })

    const submitForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.validate(async (valid) => {
        if (valid) {
          // console.log('submit!')
          // 保存当前版数据
          const { slides, theme } = storeToRefs(slidesStore)
          // console.log(theme)

          // 获取数据 
          const data_ppt = pako.gzip(JSON.stringify(slides.value ? slides.value : null))
          // data_ppt转换为Base64编码时，String.fromCharCode.apply函数调用栈溢出了,因为data太大了，因此将unit8array 分块处理
          const base64_data = arrayBufferToBase64(data_ppt)
          try {
            const localDimensionObj = reactive({
              ...props.dimension_obj_for_index
            })
            // console.log(props.dimension_obj_for_index, 'localDimensionObj')
            localDimensionObj.bupl_id = localDimensionObj.bupl_id || 0
            localDimensionObj.spfd_id = localDimensionObj.spfd_id || 0
            localDimensionObj.d_id = localDimensionObj.d_id || 0
            // console.log(localDimensionObj, 'localDimensionObj')
            const data = await http.post('/hz_ppt', { method_: "save_ppt_history", ...localDimensionObj, version: verisonNameValidateForm.verison_name, doc: base64_data })
            if (data && data.status === 200) {
              ElMessage.success('保存成功！')
              get_ppt_history_list()
              formEl.resetFields()
              historyDrawerVisible.value = false
            }
            else {
              ElMessage.error(data.msg ? data.msg : '保存失败请刷新重试！')
            }
          } catch (e) {
            ElMessage.error('保存失败请刷新重试！')
          }
        } else {
          // console.log('error submit!')
          return false
        }
      })
    }

    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.resetFields()
      historyDrawerVisible.value = false
      verisonNameValidateForm.verison_name = ''
    }
    const handleBeforeClose = function (done: any) {
      done()
      historyDrawerVisible.value = false
      verisonNameValidateForm.verison_name = ''
    }

    // 查看历史版本模块
    const handleBeforeCloseViewHis = function (done: any) {
      flush_index()
      done()
      historyDrawerViewHisVisible.value = false
    }

    const hj_ppt_sidebar_his_view_select = (pk: any, pk_name: string, is_first_default: boolean) => {
      open_loading()
      // name  是type
      if (pk && pk_name) {
        const observer = new MutationObserver((mutationsList, observer) => {
          for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
              const elements = document.querySelectorAll('.hiwin_ppt_snapshot_models_sidebar_row') // 获取元素
              elements.forEach(async (element) => {
                const data_id = element.getAttribute('data-id')
                const data_version = element.getAttribute('data-version')
                if (pk_name !== data_version || pk.toString() !== data_id) {

                  element.classList.remove('hiwin_ppt_snapshot_models_sidebar_row_select')
                } else {
                  
                  //找到要选中的对象了
                  element.classList.add('hiwin_ppt_snapshot_models_sidebar_row_select')
                  // get_hz_ppt_by_dimension_and_year(dimension_obj, value_year.value)
                  // 更新标题
                  const selectedOption = version_list.value.find((item: { id: any }) => item.id === pk)
                  if (selectedOption) {
                    version_info.value.created_time = selectedOption.create_time
                    version_info.value.ppt_creator = selectedOption.hiwin_creator
                    version_info.value.version_name = selectedOption.name
                  }
                  if (!is_first_default) {
                    const data = await http.get('/hz_ppt', { method_: "get_one_ppt_history_by_id", id: pk })
                    if (data && data.status === 200) {
                      import_my_data(data.data[0])
                    }
                    else {
                      ElMessage.error(data ? data.msg ? data.msg : '获取失败请刷新重试' : '获取失败请刷新重试')
                    }
                  }
                }
              })
              observer.disconnect()  //观察器断开连接
            }
          }
        })
        observer.observe(document.body, { childList: true, subtree: true })
      }
      close_loading()
    }
    const open_loading = () => {
      loading.value = ElLoading.service({
        lock: false,
        text: '加载中',
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
          }, 20)
        } 
        // else {
        //   // console.log('loading.value.close is not a function')
        // }
      } 
      // else {
      //   // console.log('loading.value does not exist')
      // }
    }
    const pptNULLVisable = ref(false)
    // 版本信息模块
    const version_list = ref<any>([])
    // for (let i = 4; i <= 50; i++) {
    //   version_list.value.push({
    //     id: i,
    //     name: `版本${i}`,
    //     creator: '李小明',
    //     created_time: '2023-07-01 14:59'
    //   })
    // }

    const dialogVisible = ref(false)
    const version_info = ref({
      'version_name': null,
      'ppt_creator': null,
      'created_time': null
    })
    const openDialog = function (item: any) {
      if (item.name) {
        ElMessageBox.confirm(
          '确定删除版本”' + item.name + '”吗？',
          '信息',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(async () => {
            const data = await http.post('/hz_ppt', { method_: "delete_ppt_version_by_id", id: item.id })
            if (data && data.status === 200) {
              ElMessage.success('删除成功！')
              get_ppt_history_list()
            } else {
              ElMessage.error(data ? data.msg ? data.msg : '删除失败请刷新重试' : '删除失败请刷新重试')
            }
          })
          .catch((e) => {
          })
      } else {
        ElMessage({
          type: 'info',
          message: '没有获取到当前版本，请刷新重试！',
        })
      }
    }
    // const deleteItem = function () {
    //   // Add your delete logic here
    //   // dialogVisible.value = false
    // }
    // 调用父亲的保存方法
    const handleSaveData = () => {
      // const data = '需要保存的数据';
      // this.$emit('save-data', data);
      context.emit('save_data')
    }
    // const hanldeDefaultSelect = () => {
    //   // 直接选中当前对象
    //   // 选中第一个
    //   
    //   hj_ppt_sidebar_his_view_select(current_version_obj ? current_version_obj.id : null, current_version_obj ? current_version_obj.name : null, true)
    // }
    onMounted(() => {
      // 最后处理默认选中
      // hanldeDefaultSelect()
      // nextTick(() => {
      //   // 在DOM更新完成后执行操作
      //   // ref.select1.$el.style.width = '212px'
      //   select2.value.$el.style.width = '120px'
    })
    // 模版模块
    const pptTemplateNULLVisable = ref<boolean>(false)
    const ppt_template_list = ref([])
    const templateDrawerVisible = ref<boolean>(false)
    const template_type = ref<number>(null)
    const value_template = ref<number>(null) //标记当前模版选择了那个id
    const value_template_name = ref<string>('') //标记当前模版选择了那个名称
    const pptTemplateUpdateNameVisable = ref<boolean>(false)
    const get_ppt_template_list = async () => {
      // const get_ppt_template_list = () => {
      // 获取模版列表
      pptTemplateNULLVisable.value = false
      try {
        // const data = { "status": 200, "msg": "ok", "data": { "template_list": [{ "id": 3, "name": "无模版时自动创建2023-07-21 14:06:43", "create_time": "2023-07-21 14:06:43", "hiwin_creator": "李海", "doc": "H4sIAAAAAAAAA9VWW2sbRxT+K8v0wS+rzVz3VtfQugRTatd20oTG+GEtjawl693t7tiSG/xSAiENeTOlD4GGYKhfStungFvIr5GU/ouekfbmRKpsggsdzWh2z5yZPd+5zs4jFHaQj5TMVSuPwo5sEWQiGckDGasc+TuPkDpOJbDkvQBmc8rP23vbgxTeItlVyMcmUkmKfIrhqR92VA/5gtsm6slwvwcMzKaWMNFRKPufJQM4VnPC2DVRGmhutG5g+H0JA8gw6389HsBHumEUActHYs/b64gJYSA724EKE+R3gyiXJkrSoB2qY5DFckyUJSpQIDU+MWcDSJKHa1n3PQC1+ExDqcSn+EaF70Zheg/5KjuUs2VXcqBK0cNO7KwPKtGZEIXwtrCoqPXvihoAEdxiHrb1ehTGcq2kW9RE7SRWYG04ejldWc5VlsT7MKdBbOTqOJKfLHWBo5WH30nfMAih6WBpZfTH09Hz15ubd5dvac4VmIqNt9IV1EBhoo7sBoeRug2HbAQHGs562M6SPOkq45sAREQVz2oSJZnWFmMMzcHv5Org3uYM/FSwuQoQ9ns45+CjXMMbvjgfX7wZ/XU6PrsY/fhkfP5meHE6Pj2v0N4ASG2YEuTtOH2Q8xqkTUqQzDVRroIMqDvY1E4oY9ixI7g3eUuTcBq5CHajXQ27+FzlgRPUOiISiHhUKYyeAPde0H64nyWH+sw6dArG6qjupKETLf27CYTOSSBNG6ZqI/76iwoe4aUNCXcreRxCagM6jiU85izy39Ki+mOtIAr3Y99ow6LMPl5a6NvcLUw/+vVsePZ49PrP4Q8vRy+f/P3qp//cyw+21462NioNUQz4caOx0h+4Z7mcCq/oNr9aACxQ1GwFVbHRVNDw6W/v6OiGY8NZ3fq8365jgzILew0NOHWoWKzZ+OzIYZAcXXC8qn9gHPF5RQd7/W/v9yvBW9Sx7MZniQ7tieScUcthDZGc6nCChW1Rz646a2R5qLKNFegLqxbFxqrBsdGCYU86wQWVFGQypU9rWlHciFty0IJDP5NqpVgo6FPqtDxeuSbWZfA6WWl2SmJXudMc3enJ1UZOcpkliFv3MkM5AiKx9jdWmcbGwmpuaGQveLu8tNgypaqb94nyhnF9Hc7xyPW0f+TUdwlKyCXfom51sSOWi0XdnP8D6su3wjmJ9v7WV3c/ra+yDHPLww6veml2z7UIbqChdbwT53LYNTTA8YfWp4l3+0ZRcv8lObt4ci97/PPb31+9/eX78YtnddG6odoFKkiyzh1QMuwR1w3U3X8AWckOV34MAAA=" }], "current_template_obj": { "id": 3, "name": "无模版时自动创建2023-07-21 14:06:43", "create_time": "2023-07-21 14:06:43", "hiwin_creator": "李海", "doc": "H4sIAAAAAAAAA9VWW2sbRxT+K8v0wS+rzVz3VtfQugRTatd20oTG+GEtjawl693t7tiSG/xSAiENeTOlD4GGYKhfStungFvIr5GU/ouekfbmRKpsggsdzWh2z5yZPd+5zs4jFHaQj5TMVSuPwo5sEWQiGckDGasc+TuPkDpOJbDkvQBmc8rP23vbgxTeItlVyMcmUkmKfIrhqR92VA/5gtsm6slwvwcMzKaWMNFRKPufJQM4VnPC2DVRGmhutG5g+H0JA8gw6389HsBHumEUActHYs/b64gJYSA724EKE+R3gyiXJkrSoB2qY5DFckyUJSpQIDU+MWcDSJKHa1n3PQC1+ExDqcSn+EaF70Zheg/5KjuUs2VXcqBK0cNO7KwPKtGZEIXwtrCoqPXvihoAEdxiHrb1ehTGcq2kW9RE7SRWYG04ejldWc5VlsT7MKdBbOTqOJKfLHWBo5WH30nfMAih6WBpZfTH09Hz15ubd5dvac4VmIqNt9IV1EBhoo7sBoeRug2HbAQHGs562M6SPOkq45sAREQVz2oSJZnWFmMMzcHv5Org3uYM/FSwuQoQ9ns45+CjXMMbvjgfX7wZ/XU6PrsY/fhkfP5meHE6Pj2v0N4ASG2YEuTtOH2Q8xqkTUqQzDVRroIMqDvY1E4oY9ixI7g3eUuTcBq5CHajXQ27+FzlgRPUOiISiHhUKYyeAPde0H64nyWH+sw6dArG6qjupKETLf27CYTOSSBNG6ZqI/76iwoe4aUNCXcreRxCagM6jiU85izy39Ki+mOtIAr3Y99ow6LMPl5a6NvcLUw/+vVsePZ49PrP4Q8vRy+f/P3qp//cyw+21462NioNUQz4caOx0h+4Z7mcCq/oNr9aACxQ1GwFVbHRVNDw6W/v6OiGY8NZ3fq8365jgzILew0NOHWoWKzZ+OzIYZAcXXC8qn9gHPF5RQd7/W/v9yvBW9Sx7MZniQ7tieScUcthDZGc6nCChW1Rz646a2R5qLKNFegLqxbFxqrBsdGCYU86wQWVFGQypU9rWlHciFty0IJDP5NqpVgo6FPqtDxeuSbWZfA6WWl2SmJXudMc3enJ1UZOcpkliFv3MkM5AiKx9jdWmcbGwmpuaGQveLu8tNgypaqb94nyhnF9Hc7xyPW0f+TUdwlKyCXfom51sSOWi0XdnP8D6su3wjmJ9v7WV3c/ra+yDHPLww6veml2z7UIbqChdbwT53LYNTTA8YfWp4l3+0ZRcv8lObt4ci97/PPb31+9/eX78YtnddG6odoFKkiyzh1QMuwR1w3U3X8AWckOV34MAAA=" } } }
        const data = await http.get('/hz_ppt', { method_: "get_ppt_template_list" })
        if (data && data.status === 200) {
          if (data.data && data.data.template_list.length > 0) {
            ppt_template_list.value = data.data.template_list
            // 选中第一个
            value_template.value = data.data.template_list[0].id
            // 导入当前的ppt doc
            import_my_data(data.data.current_template_obj)
          } else {
            // ppt 是空的
            pptTemplateNULLVisable.value = true
          }
        }
        else {
          ElMessage.error(data ? data.msg ? data.msg : '获取模版列表失败，请刷新重试' : '获取模版列表失败，请刷新重试')
        }
      } catch (error) {
        ElMessage.error('获取模版列表失败，请刷新重试')
      }
    }
    const openTemplate = (index: number) => {
      if (index === 1) {
        // 设置标题
        // 加载模版
        templateDrawerVisible.value = true
        template_type.value = 1
        // const my_dimession = props.dimension_obj_for_index
        // if (!my_dimession) {
        //   ElMessage.error('首页的维度对象没有获取到，请刷新重试！')
        //   return
        // }
        // his_title.value = (my_dimession.title ? my_dimession.title : '无') + ' 历史版本  ' + '(' + (my_dimession.select_pk_name ? my_dimession.select_pk_name : '空维度') + ' ' + (my_dimession.year ? my_dimession.year : '无年份') + ')'
      } else if (index === 2) {
        // 编辑模版
        templateDrawerVisible.value = true
        template_type.value = 2
      }
      get_ppt_template_list()
    }
    const TemplateNameValidateForm = reactive({
      template_name: '',
    })
    const handle_templat_button_type = ref<number>(1) // 1默认为修改名称  2 为 新增模版
    const handleTemplateChange = async (id: number) => {
      pptTemplateNULLVisable.value = false
      // const handleTemplateChange = (id: number) => {
      // if (template_type.value === 1) {
      // 加载模版
      try {
        const data = await http.get('/hz_ppt', { method_: "get_ppt_template_by_id", id: id })
        if (data && data.status === 200 && data.data.length > 0) {
          // ppt_template_list.value = data.template_list
          // 导入当前的ppt doc
          import_my_data(data.data[0])
        }
        else if (data && data.status === 200 && data.data.length === 0) {
          // ppt 是空的
          pptTemplateNULLVisable.value = true
        }
        else {
          ElMessage.error(data ? data.msg ? data.msg : '获取模版失败，请刷新重试' : '获取模版失败，请刷新重试')
        }
      } catch (error) {
        ElMessage.error('获取模版失败，请刷新重试')
      }
    }

    const updateTemplateName = () => {
      // 对话框
      if (ppt_template_list.value && ppt_template_list.value.length > 0) {
        for (const item of ppt_template_list.value) {
          if (Number(item.id) === value_template.value) {
            value_template_name.value = item.name
            // 打开对话框
            handle_templat_button_type.value = 1
            verisonNameValidateForm.verison_name = value_template_name.value
            pptTemplateUpdateNameVisable.value = true
            break
          }
        }
      }
      else {
        ElMessage.error('没有获取到模版名称')
      }

    }

    const addTemplate_start = () => {
      handle_templat_button_type.value = 2
      pptTemplateUpdateNameVisable.value = true
    }

    const addTemplate = async () => {
      // 对话框
      try {
        const data = await http.post('/hz_ppt', { method_: "insert_or_update_ppt_template", handle_type: 1, name: verisonNameValidateForm.verison_name })
        if (data && data.status === 200) {
          ElMessage.success('新增成功！')
          get_ppt_template_list()
        }
        else {
          ElMessage.error(data.msg ? data.msg : '新增模版失败,请刷新重试！')
        }
        // console.log('新增模版名称')
      } catch (error) {
        ElMessage.error('新增模版失败,请刷新重试!')
      }
    }
    const delTemplateDialog = function (id: number) {
      if (id) {
        ElMessageBox.confirm(
          '确定删除模版吗？',
          '信息',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            delTemplate(id)
          })
          .catch((e) => {

          })
      } else {
        ElMessage({
          type: 'info',
          message: '没有获取到当前模版，请刷新重试！',
        })
      }
    }
    const delTemplate = async (id: number) => {
      try {
        const data = await http.post('/hz_ppt', { method_: "delete_ppt_template_by_id", id: value_template.value })
        if (data && data.status === 200) {
          ElMessage.success('删除成功！')
          get_ppt_template_list()
        }
        else {
          ElMessage.error(data.msg ? data.msg : '删除失败,请刷新重试！')
        }
      } catch (e) {
        ElMessage.error('删除失败,请刷新重试！')
      }
      // console.log('删除模版名称')
    }

    const submitTemplateForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.validate(async (valid) => {
        if (valid) {
          if (handle_templat_button_type.value === 1) {
            try {
              const data = await http.post('/hz_ppt', { method_: "insert_or_update_ppt_template", id: value_template.value, name: verisonNameValidateForm.verison_name, handle_type: 2, })
              if (data && data.status === 200) {
                ElMessage.success('保存成功！')
                formEl.resetFields()
                pptTemplateUpdateNameVisable.value = false
                get_ppt_template_list()
              }
              else {
                ElMessage.error(data.msg ? data.msg : '保存失败请刷新重试！')
              }
            } catch (e) {
              ElMessage.error('保存失败请刷新重试！')
            }
          }
          else if (handle_templat_button_type.value === 2) {
            // 新增模版
            try {
              const data = await http.post('/hz_ppt', { method_: "insert_or_update_ppt_template", id: value_template.value, name: verisonNameValidateForm.verison_name, handle_type: 1, })
              if (data && data.status === 200) {
                ElMessage.success('新增模版成功！')
                formEl.resetFields()
                pptTemplateUpdateNameVisable.value = false
                get_ppt_template_list()
              }
              else {
                ElMessage.error(data.msg ? data.msg : '新增失败，请刷新重试！')
              }
            } catch (e) {
              ElMessage.error('新增失败，请刷新重试！')
            }
          }
        } else {
          return false
        }
      })
    }
    const formTemplateRef = ref<FormInstance>()

    const resetTemlateForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.resetFields()
      pptTemplateUpdateNameVisable.value = false
      verisonNameValidateForm.verison_name = ''
    }
    const data_for_template = reactive(
      {
        id: value_template,
        type: template_type
      }
    )
    provide('data_for_template', data_for_template)
    const cancelTemplate = () => {
      flush_index()
      templateDrawerVisible.value = false
      verisonNameValidateForm.verison_name = ''
    }
    const sureTemplate = async () => {
      // 加载模版的确定按钮
      try {
        const localDimensionObj = reactive({
          ...props.dimension_obj_for_index
        })
        // console.log(props.dimension_obj_for_index, 'localDimensionObj')
        localDimensionObj.bupl_id = localDimensionObj.bupl_id || 0
        localDimensionObj.spfd_id = localDimensionObj.spfd_id || 0
        localDimensionObj.d_id = localDimensionObj.d_id || 0
        const data = await http.post('/hz_ppt', { method_: "sure_ppt_template_by_id", id: value_template.value, ...localDimensionObj })
        if (data && data.status === 200) {
          ElMessage.success('确定加载模版成功！')
          templateDrawerVisible.value = false
          flush_index()
          verisonNameValidateForm.verison_name = ''

        }
        else {
          ElMessage.error(data.msg ? data.msg : '确定加载模版失败，请刷新重试！')
        }
      } catch (e) {
        ElMessage.error('新增失确定加载模版失败，请刷新重试！')
      }
    }
    // const get_hz_ppt_by_dimension_and_year = inject('get_hz_ppt_by_dimension_and_year')
    const get_hz_ppt_by_dimension_and_year: (localDimensionObj, year) => any = inject('get_hz_ppt_by_dimension_and_year') // 接受
    const closeHisView = () => {
      historyDrawerViewHisVisible.value = false
      flush_index()
    }
    const flush_index = () => {
      const localDimensionObj = reactive({
        ...props.dimension_obj_for_index
      })
      // console.log(props.dimension_obj_for_index, 'localDimensionObj')
      localDimensionObj.bupl_id = localDimensionObj.bupl_id || 0
      localDimensionObj.spfd_id = localDimensionObj.spfd_id || 0
      localDimensionObj.d_id = localDimensionObj.d_id || 0
      get_hz_ppt_by_dimension_and_year(localDimensionObj, localDimensionObj.year)
    }
    provide('flush_index', flush_index)
    return {
      redo,
      undo,
      showGridLines,
      showRuler,
      hotkeyDrawerVisible,
      importSpecificFile,
      setDialogForExport,
      enterScreening,
      enterScreeningFromStart,
      createSlide,
      deleteSlide,
      toggleGridLines,
      toggleRuler,
      resetSlides,
      goIssues,
      historyDrawerVisible,
      openHistory,
      verisonNameValidateForm,
      submitForm,
      resetForm,
      formRef,
      handleBeforeClose,
      historyDrawerViewHisVisible,
      handleBeforeCloseViewHis,
      pptNULLVisable,
      version_list,
      hj_ppt_sidebar_his_view_select,
      version_info,
      dialogVisible,
      openDialog,
      handleSaveData,
      his_title,
      templateDrawerVisible,
      template_type,
      openTemplate,
      pptTemplateNULLVisable,
      ppt_template_list,
      value_template,
      handleTemplateChange,
      updateTemplateName,
      addTemplate,
      value_template_name,
      TemplateNameValidateForm,
      pptTemplateUpdateNameVisable,
      resetTemlateForm,
      submitTemplateForm,
      formTemplateRef,
      addTemplate_start,
      handle_templat_button_type,
      data_for_template,
      sureTemplate,
      cancelTemplate,
      closeHisView,
      delTemplateDialog,
    }
  },
})
</script>

<style lang="scss" scoped>
.editor-header {
  background-color: #fff;
  user-select: none;
  border-bottom: 1px solid $borderColor;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  position: relative;
}

.left,
.right {
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-item {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  padding: 0 10px;
  transition: background-color $transitionDelay;
  cursor: pointer;

  .text {
    margin-left: 4px;
  }
}

.left .menu-item:hover {
  background-color: $lightGray;
}

.viewHisAll {
  height: 100%;
  width: 100%;
  // overflow-y: auto;
  position: relative;
}
</style>

<style lang="scss" >
.el-dialog {
  // --el-dialog-width: 50%;
  // --el-dialog-margin-top: 15vh;
  // --el-dialog-bg-color: var(--el-bg-color);
  // --el-dialog-box-shadow: var(--el-box-shadow);
  // --el-dialog-title-font-size: var(--el-font-size-large);
  // --el-dialog-content-font-size: 14px;
  // --el-dialog-font-line-height: var(--el-font-line-height-primary);
  // --el-dialog-padding-primary: 20px;
  // --el-dialog-border-radius: var(--el-border-radius-small);
  // position: relative;
  // margin: var(--el-dialog-margin-top,15vh) auto 50px;
  // background: var(--el-dialog-bg-color);
  // border-radius: var(--el-dialog-border-radius);
  // box-shadow: var(--el-dialog-box-shadow);
  // box-sizing: border-box;
  // width: var(--el-dialog-width,50%);
  --el-dialog-padding-primary: 15px;
}

.el-dialog__body {
  padding: 0 var(--el-dialog-padding-primary);
}

//  矫正一下样式不对的问题
// .slide-content {
//   // background-color: #fff;
//   // position: absolute;
//   // top: 50%;
//   // left: 50%;
//   // transform: translate(-50%, -50%);
//   // display: flex;
//   // justify-content: center;
//   // align-items: center;

//   width: 100% !important;
//   height: 100% !important;
//   // position: relative;
// }

.el-message {
  z-index: 2147483647 !important;
}

.el-alert {
  z-index: 99999 !important;
}

// .screen-slide {
//   // width: 100vh !important;
//   // height: calc(100% - 20px) !important;
//   width: 100% !important;
//   height: 100% !important;
//   position: relative !important;
// }

// .el-button {
//   margin-top: 11px;
// }

.hzppt_view_close {
  margin-top: 11px;
}

.full-dialog .el-dialog__wrapper {
  width: 100% !important;
  height: 100% !important;
}

.full-dialog .el-dialog {
  width: 100% !important;
  height: 100% !important;
}

// .template_ppt_select {
//   // width: 48% !important;
//   width: 320px;
//   position: absolute;
//   height: 40px !important;
//   line-height: 40px !important;
// }
// .select-trigger
.template_ppt_select {
  // width: 212px;
  width: 320px !important;
  position: absolute;
  height: 40px !important;
  line-height: 40px !important;
}
</style>