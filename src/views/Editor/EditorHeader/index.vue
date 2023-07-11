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

    <el-dialog v-model="historyDrawerVisible" title="保存当前版本" width="30%" draggable align-center
      :before-close="(formRef: any, done: any) => handleBeforeClose(formRef, done)" :close-on-click-modal="false"
      :destroy-on-close="true">
      <el-form ref="formRef" :model="verisonNameValidateForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="版本名称" prop="verison_name" :rules="[
          { required: true, message: '请输入版本名称' },
          { type: 'string', message: '最大长度256', max: 256 },
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
          <div class="titleLine">标题行</div>
          <div class="versionInfoLine">版本信息行</div>
        </div>
        <div class="viewHisContent">
          <div class="PptLeft">
            <div class="pptSiderBar" v-for="(item, index) in version_list">
              <div class="saveHis">
                保存当前版本
              </div>
              <div v-if="index !== 0" :data-id="item.id" :data-version="item.name">
                <!-- 有默认选中样式 -->
                
              </div>
              <div v-else>

              </div>
            </div>
          </div>
          <div class="PptRight">
            <div id="app" class="viewHistPPt"></div>
            <div class="pptNull" v-if="pptNULLVisable"><span class="higet_color_red">(没有可查看数据或暂无权限查看)</span></div>
          </div>
        </div>

      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="historyDrawerViewHisVisible = false">取消</el-button>
          <el-button type="primary" @click="historyDrawerViewHisVisible = false">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import useScreening from '@/hooks/useScreening'
import useSlideHandler from '@/hooks/useSlideHandler'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useExport from '@/hooks/useExport'
import saveHistory from '../../Editor/histtoryDialog/SaveHistory.vue'
import viewHistory from '../../Editor/histtoryDialog/ViewHistory.vue'
import HotkeyDoc from './HotkeyDoc.vue'
import type { FormInstance } from 'element-plus'
import { fa } from 'element-plus/es/locale'
export default defineComponent({
  name: 'editor-header',
  components: {
    HotkeyDoc,
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

    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.resetFields()
      historyDrawerVisible.value = false
    }
    const handleBeforeClose = function (formEl: FormInstance | undefined, done: any) {
      if (!formEl) return
      formEl.resetFields()
      done()
      historyDrawerVisible.value = false
    }

    // 查看历史版本模块
    const handleBeforeCloseViewHis = function (done: any) {
      done()
      historyDrawerViewHisVisible.value = false
    }
    const pptNULLVisable = ref(false)
    const version_list = ref<any>([])
    version_list.value = [
      { id: 1, name: '版本1' },
      { id: 2, name: '版本2' },
      { id: 3, name: '版本3' },
    ]
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
  height: 78vh;
  overflow-y: auto;
}
</style>