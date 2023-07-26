import { debounce, throttle} from 'lodash'
import { useSnapshotStore,useSlidesStore } from '@/store'

export default () => {
  const snapshotStore = useSnapshotStore()
  const useSlidesStore1 = useSlidesStore()

  // 添加历史快照(历史记录)
  const addHistorySnapshot = debounce(function() {
    useSlidesStore1.setChanged()
    snapshotStore.addSnapshot()
  }, 300, { trailing: true })

  // 重做
  const redo = throttle(function() {
    useSlidesStore1.setChanged()
    snapshotStore.reDo()
  }, 100, { leading: true, trailing: false })

  // 撤销
  const undo = throttle(function() {
    useSlidesStore1.setChanged()
    snapshotStore.unDo()
  }, 100, { leading: true, trailing: false })

  return {
    addHistorySnapshot,
    redo,
    undo,
  }
}