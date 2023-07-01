<template>
  <div class="hj_all">
    <div class="hj_slider">
      <div class="hj_slider_content">
        <el-select v-model="value" class="m-2 hj_slider_select" placeholder="Select" size="large">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <div class="hj_ri
        ght_adjust_icon_father" >
          <div class="hj_right_adjust_icon"></div>
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
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
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

    const value = ref('')

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
    return {
      remarkHeight,
      dialogForExport,
      closeExportDialog,
      value,
      options,
    }

  },
})
</script>

<style lang="scss" scoped>
.pptist-editor {
  width: 80%;
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