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
    </div>

    <div class="right">
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
          <div class="titleLine">历史版本</div>
        </div>
        <div class="viewHisContent">
          <div class="PptLeft">
            <div class="ppt_save_current_version" @click="openHistory(1)">
              保存当前版本
            </div>
            <hr class="ppt_view_his_hr" />
            <div class="pptSiderBar" v-for="(item, index) in version_list" :key="index">
              <div v-if="index !== 0" :data-id="item.id" :data-version="item.name"
                class="hiwin_ppt_snapshot_models_sidebar_row"
                :class="{ 'hiwin_ppt_snapshot_models_sidebar_row_select': index === 1 }">
                <!-- 有默认选中样式 -->
                <div class="viewSiderBarIcon"></div>
                <!-- <Delete-mode theme="outline" size="14" fill="#ee0c0c" strokeLinejoin="bevel"/> -->
                <!-- <IconDeleteMode class="ppt_delete_icon" @click=""></IconDeleteMode> -->
                <IconDeleteMode class="ppt_delete_icon" @click="openDialog(item.name)" />
                <a class="higet_pointer hiwin_ppt_snapshot_models_sidebar_row_a"
                  @click="hj_ppt_sidebar_his_view_select(item.id ? item.id : null, item.name || null)">{{ item.name }}</a>
              </div>
            </div>
          </div>
          <div class="PptRight">
            <div class="versionInfoLine">版本：<span class="span_ppt_version">{{ version_info.version_name }}</span>
              <div class="ppt_crateor_info">创建人：<span class="span_ppt_creator" style="margin-right: 20px;">{{
                version_info.ppt_creator }}</span>创建时间：<span class="span_created_time">{{
    version_info.created_time }}</span></div>
            </div>
            <div class="viewHistPPt">
              <APP />
            </div>
            <div class="pptNull" v-if="pptNULLVisable"><span class="higet_color_red">(没有可查看数据或暂无权限查看)</span></div>
          </div>
        </div>

      </div>
      <template #footer>
        <span class="dialog-footer ">
          <el-button @click="historyDrawerViewHisVisible = false" class="hzppt_view_close">关闭</el-button>
          <!-- <el-button type="primary" @click="historyDrawerViewHisVisible = false">
            确定
          </el-button> -->
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, ComponentOptions } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import useScreening from '@/hooks/useScreening'
import useSlideHandler from '@/hooks/useSlideHandler'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useExport from '@/hooks/useExport'
// import saveHistory from '../../Editor/histtoryDialog/SaveHistory.vue'
// import viewHistory from '../../Editor/histtoryDialog/ViewHistory.vue'
import APP from '@/views/components/App.vue'
// import APP from '@/App.vue'

import HotkeyDoc from './HotkeyDoc.vue'
import { ElLoading, FormInstance, ElMessageBox, ElMessage } from 'element-plus'

import { fa } from 'element-plus/es/locale'
import { method } from 'lodash'

export default defineComponent({
  name: 'editor-header',
  components: {
    HotkeyDoc,
    APP,
    // Editor
    // saveHistory,
    // viewHistory
  },
  setup() {
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


    const goIssues = () => {
      window.open('https://github.com/pipipi-pikachu/PPTist/issues')
    }
    const openHistory = (index: number) => {
      if (index === 1) {
        // 保存历史
        historyDrawerVisible.value = true
      } else if (index === 2) {
        // 查看历史
        historyDrawerViewHisVisible.value = true
      }
    }
    // 保存历史版本模块
    const formRef = ref<FormInstance>()

    const verisonNameValidateForm = reactive({
      verison_name: '',
    })

    const submitForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          // console.log('submit!')
          formEl.resetFields()
          historyDrawerVisible.value = false
        } else {
          // console.log('error submit!')
          return false
        }
      })
    }
    // 保存历史版本
    const save_his_version = () => {
      alert('保存版本')
    }
    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.resetFields()
      historyDrawerVisible.value = false
    }
    const handleBeforeClose = function (done: any) {
      // debugger
      // if (!formEl) return
      // formEl.resetFields()
      done()
      historyDrawerVisible.value = false
    }

    // 查看历史版本模块
    const handleBeforeCloseViewHis = function (done: any) {
      done()
      historyDrawerViewHisVisible.value = false
    }

    const loading = ref<any>(null)
    const hj_ppt_sidebar_his_view_select = (pk: any, pk_name: string) => {
      // debugger
      open_loading()
      // name  是type
      if (pk && pk_name) {
        const elements = document.querySelectorAll('.hiwin_ppt_snapshot_models_sidebar_row') // 获取元素
        elements.forEach((element) => {
          const data_id = element.getAttribute('data-id')
          const data_version = element.getAttribute('data-version')
          if (pk_name !== data_version || pk.toString() !== data_id) {
            element.classList.remove('hiwin_ppt_snapshot_models_sidebar_row_select')
          }
          else {
            //找到要选中的对象了
            element.classList.add('hiwin_ppt_snapshot_models_sidebar_row_select')
            // get_hz_ppt_by_dimension_and_year(dimension_obj, value_year.value)
            // 更新标题
            const selectedOption = version_list.value.find(item => item.id === pk)
            if (selectedOption) {
              version_info.value.created_time = selectedOption.created_time
              version_info.value.ppt_creator = selectedOption.creator
              version_info.value.version_name = selectedOption.name
            }
          }

        })
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
        console.log('loading.value exists')
        if (typeof loading.value.close === 'function') {
          console.log('loading.value.close is a function')
          setTimeout(() => {
            loading.value.close()
          }, 1000)
        } else {
          console.log('loading.value.close is not a function')
        }
      } else {

        console.log('loading.value does not exist')
      }
    }
    const pptNULLVisable = ref(false)
    // 版本信息模块
    const version_list = ref<any>([])
    for (let i = 4; i <= 50; i++) {
      version_list.value.push({
        id: i,
        name: `版本${i}`,
        creator: '李小明',
        created_time: '2023-07-01 14:59'
      })
    }
    // version_list.value = [
    //   { id: 1, name: '版本1', 'creator': '李小明', 'created_time': '2023-07-01 14:59' },
    //   { id: 2, name: '版本2', 'creator': '李小明', 'created_time': '2023-07-01 14:59' },
    //   { id: 3, name: '版本3', 'creator': '李小明', 'created_time': '2023-07-01 14:59' },

    // ]
    const dialogVisible = ref(false)
    const version_info = ref({
      'version_name': null,
      'ppt_creator': null,
      'created_time': null
    })
    const openDialog = function (name: any) {
      if (name) {
        ElMessageBox.confirm(
          '确定删除版本”' + name + '”吗？',
          '信息',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            ElMessage({
              type: 'success',
              message: '模拟删除成功！',
            })
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '模拟删除取消！',
            })
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
      save_his_version,
      hj_ppt_sidebar_his_view_select,
      version_info,
      dialogVisible,
      openDialog,
      // deleteItem,
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
.slide-content[data-v-2ee3d44c] {
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100% !important;
  height: 100% !important;
  // position: relative;
}

.el-message {
  z-index: 2147483647 !important;
}

.el-alert {
  z-index: 99999 !important;
}

.screen-slide {
  // width: 100vh !important;
  // height: calc(100% - 20px) !important;
  width: 100% !important;
  height: 100% !important;
  position: relative !important;
}

// .el-button {
//   margin-top: 11px;
// }

.hzppt_view_close {
  margin-top: 11px;
}
</style>