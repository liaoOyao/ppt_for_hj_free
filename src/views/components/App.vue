<template>
  <Screen v-if="true" />
  <Mobile v-else />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useScreenStore, useMainStore, useSnapshotStore } from '@/store'
import { LOCALSTORAGE_KEY_DISCARDED_DB } from '@/configs/storage'
import { isPC } from '@/utils/common'

// import Editor from '@/views/Editor/index.vue'
import Screen from '@/views/Screen/indexHisView.vue'

import Mobile from '@/views/MobileHisView.vue'

export default defineComponent({
  name: 'app',
  components: {
    Screen,
    Mobile,
  },
  setup() {
    const mainStore = useMainStore()
    const snapshotStore = useSnapshotStore()
    const { databaseId } = storeToRefs(mainStore)
    const { screening } = storeToRefs(useScreenStore())

    if (process.env.NODE_ENV === 'production') {
      window.onbeforeunload = () => false
    }

    onMounted(() => {
      snapshotStore.initSnapshotDatabase()
      mainStore.setAvailableFonts()
      // prefentconext()
    })



    // 应用注销时向 localStorage 中记录下本次 indexedDB 的数据库ID，用于之后清除数据库
    window.addEventListener('unload', () => {
      const discardedDB = localStorage.getItem(LOCALSTORAGE_KEY_DISCARDED_DB)
      const discardedDBList: string[] = discardedDB ? JSON.parse(discardedDB) : []

      discardedDBList.push(databaseId.value)

      const newDiscardedDB = JSON.stringify(discardedDBList)
      localStorage.setItem(LOCALSTORAGE_KEY_DISCARDED_DB, newDiscardedDB)
    })
    const prefentconext = () => {
      document.oncontextmenu = e => e.preventDefault()
    }
    // 创建一个计算属性
    // const isPCComputed = computed(() => isPC())
    return {
      screening,
      isPC: isPC(),
    }

  },
})
</script>

<style lang="scss">
#app {
  height: 100%;
  width: 100%;
  position: relative;
}

// 矫正下拉框的层级
.el-message {
  z-index: 2147483647 !important;
}

.el-alert {
  z-index: 99999 !important;
}
</style>