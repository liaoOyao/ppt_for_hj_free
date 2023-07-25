<template>
  <div class="editor-header">
    <div class="left">
      <Dropdown :trigger="['click']">
        <div class="menu-item">
          <IconFolderClose /> <span class="text">文件</span>
        </div>
        <template #overlay>
          <Menu>
            <!-- <FileInput accept=".pptist" @change="files => importSpecificFile(files)">
              <MenuItem>导入 pptist 文件</MenuItem>
            </FileInput> -->
            <MenuItem @click="setDialogForExport('pptist')">导出 pptist 文件</MenuItem>
            <MenuItem @click="setDialogForExport('pptx')">导出 PPTX</MenuItem>
            <MenuItem @click="setDialogForExport('image')">导出图片</MenuItem>
            <MenuItem @click="setDialogForExport('json')">导出 JSON</MenuItem>
            <MenuItem @click="setDialogForExport('pdf')">打印 / 导出 PDF</MenuItem>
          </Menu>
        </template>
      </Dropdown>
      <Dropdown v-if="data_for_template.type === 2" :trigger="['click']">
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
      <!-- <Dropdown :trigger="['click']">
        <div class="menu-item">
          <IconPpt /> <span class="text">演示</span>
        </div>
        <template #overlay>
          <Menu>
            <MenuItem @click="enterScreeningFromStart()">从头开始</MenuItem>
            <MenuItem @click="enterScreening()">从当前页开始</MenuItem>
          </Menu>
        </template>
      </Dropdown> -->
      <Dropdown :trigger="['click']">
        <!-- <div class="menu-item">
          <IconHelpcenter /> <span class="text">帮助</span>
        </div> -->
        <template #overlay>
          <Menu>
            <!-- <MenuItem @click="goIssues()">意见反馈</MenuItem> -->
            <MenuItem @click="hotkeyDrawerVisible = true">快捷键</MenuItem>
          </Menu>
        </template>
      </Dropdown>
    </div>

    <div class="right">
      <Tooltip :mouseLeaveDelay="0" v-if="data_for_template.type === 2" title="保存数据">
        <div class="menu-item" @click="handleSaveTemplateData">
          <IconSave size="18" fill="#666"></IconSave>
        </div>
      </Tooltip>
      <Tooltip :mouseLeaveDelay="0" title="导出">
        <div class="menu-item" @click="setDialogForExport('pptx')">
          <IconShare size="18" fill="#666" />
        </div>
      </Tooltip>
      <!-- <Tooltip :mouseLeaveDelay="0" title="幻灯片放映">
        <div class="menu-item" @click="enterScreening()">
          <IconPpt size="19" fill="#666" style="margin-top: 1px;" />
        </div>
      </Tooltip> -->
      <!-- <a href="https://github.com/pipipi-pikachu/PPTist" target="_blank">
        <div class="menu-item"><IconGithub size="18" fill="#666" /></div>
      </a> -->
    </div>

    <!-- <Drawer width="320" placement="right" :visible="hotkeyDrawerVisible" @close="hotkeyDrawerVisible = false">
      <HotkeyDoc />
    </Drawer> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick, watchEffect, watch, onUnmounted, reactive, provide, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import useScreening from '@/hooks/useScreening'
import useSlideHandler from '@/hooks/useSlideHandler'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useExport from '@/hooks/useExport'

// import HotkeyDoc from './HotkeyDoc.vue'
import { ElLoading, FormInstance, ElMessageBox, ElMessage } from 'element-plus'
import http from '@/utils/http'
import pako from '@/utils/pako/pako.min.js'
import { arrayBufferToBase64, base64ToArrayBuffer } from '@/utils/handle_data'

export default defineComponent({
  name: 'editor-header',
  components: {
    // HotkeyDoc,
  },
  // setup(_: unknown, props: { dimension_obj_for_index: Object },context: SetupContext) {
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

    const handleSaveTemplateData = async () => {
      // 调用编辑模版页面的父亲的方法
      // context.emit('save_data')
      if (data_for_template && data_for_template.id) {
        // ElMessage.success('首页的维度对象获取到！' + JSON.stringify(data_for_template))
        try {
          const { slides, theme } = storeToRefs(slidesStore)
          // 获取数据 
          const data_ppt = pako.gzip(JSON.stringify(slides.value ? slides.value : null))
          // data_ppt转换为Base64编码时，String.fromCharCode.apply函数调用栈溢出了,因为data太大了，因此将unit8array 分块处理
          const base64_data = arrayBufferToBase64(data_ppt)
          const data = await http.post('/hz_ppt', { method_: "save_template_doc_by_id", id: data_for_template.id, doc: base64_data })
          if (data && data.status === 200) {
            ElMessage.success('保存成功！')
          }
          else {
            ElMessage.error(data.msg ? data.msg : '保存失败请刷新重试！')
          }
        } catch (e) {
          ElMessage.error('保存失败请刷新重试！')
        }
      }
      else {
        ElMessage.error('首页的维度对象没有获取到，请刷新重试！')
      }
    }
    const slidesStore = useSlidesStore()  // slider 仓库

    const beforeUnloadHandler = (event) => {
      const { isChanged } = storeToRefs(slidesStore)
      if (process.env.NODE_ENV === 'production' && isChanged) {
        // if (isChanged) {
        event.preventDefault()
        event.returnValue = '你还没有保存数据，确定要离开吗？'
      }
    }
    onMounted(() => {
      window.addEventListener('beforeunload', beforeUnloadHandler)
    })
    onUnmounted(() => {
      window.removeEventListener('beforeunload', beforeUnloadHandler)
    })
    const data_for_template: any = (inject('data_for_template'))

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
      handleSaveTemplateData,
      data_for_template,
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
  // padding: 0 10px;
  // height: calc(100vh - 250px);
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
</style>
<style lang="scss">
.ant-dropdown {
  z-index: 999999 !important;
}

.ant-tooltip {
  z-index: 9999 !important;
}

.el-message {
  z-index: 2147483647 !important;
}

.el-alert {
  z-index: 99999 !important;
}

.ant-drawer-left.ant-drawer-open,
.ant-drawer-right.ant-drawer-open {
  z-index: 99999;
}
</style>