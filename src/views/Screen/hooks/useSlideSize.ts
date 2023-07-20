// import { onMounted, onUnmounted, Ref, ref } from 'vue'
// import { storeToRefs } from 'pinia'
// import { useSlidesStore } from '@/store'

// export default (wrapRef?: Ref<HTMLElement | undefined>) => {
//   const slidesStore = useSlidesStore()
//   const { viewportRatio } = storeToRefs(slidesStore)

//   const slideWidth = ref(0)
//   const slideHeight = ref(0)

//   // 计算和更新幻灯片内容的尺寸（按比例自适应屏幕）
//   const setSlideContentSize = () => {
//     const slideWrapRef = wrapRef?.value || document.body
//     const winWidth = slideWrapRef.clientWidth
//     const winHeight = slideWrapRef.clientHeight
//     let width, height

//     if (winHeight / winWidth === viewportRatio.value) {
//       width = winWidth
//       height = winHeight
//     }
//     else if (winHeight / winWidth > viewportRatio.value) {
//       width = winWidth
//       height = winWidth * viewportRatio.value
//     }
//     else {
//       width = winHeight / viewportRatio.value
//       height = winHeight
//     }
//     slideWidth.value = width
//     slideHeight.value = height
//   }

//   onMounted(() => {
//     setSlideContentSize()
//     window.addEventListener('resize', setSlideContentSize)
//   })
//   onUnmounted(() => {
//     window.removeEventListener('resize', setSlideContentSize)
//   })

//   return {
//     slideWidth,
//     slideHeight,
//   }
// }

import { onMounted, onUnmounted, Ref, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'

// export default (wrapRef?: Ref<HTMLElement | undefined>) => {
//   const slidesStore = useSlidesStore()
//   const { viewportRatio } = storeToRefs(slidesStore)

//   const slideWidth = ref(0)
//   const slideHeight = ref(0)

//   // 计算和更新幻灯片内容的尺寸（按比例自适应屏幕）
//   const setSlideContentSize = () => {
//     const slideWrapRef = wrapRef?.value || document.body
//     const winWidth = slideWrapRef.clientWidth
//     const winHeight = slideWrapRef.clientHeight
//     let width, height

//     if (winHeight / winWidth === viewportRatio.value) {
//       width = winWidth
//       height = winHeight
//     }
//     else if (winHeight / winWidth > viewportRatio.value) {
//       width = winWidth
//       height = winWidth * viewportRatio.value
//     }
//     else {
//       width = winHeight / viewportRatio.value
//       height = winHeight
//     }
//     slideWidth.value = width
//     slideHeight.value = height
//   }

//   onMounted(() => {
//     setSlideContentSize()
//     window.addEventListener('resize', setSlideContentSize)
//   })
//   onUnmounted(() => {
//     window.removeEventListener('resize', setSlideContentSize)
//   })

//   return {
//     slideWidth,
//     slideHeight,
//   }
// }
export default (wrapRef?: Ref<HTMLElement | undefined>) => {
  const slidesStore = useSlidesStore()
  const { viewportRatio } = storeToRefs(slidesStore)
  const slideWidth = ref(0)
  const slideHeight = ref(0)

  const setSlideContentSize = () => {
    const slideWrapRef = wrapRef?.value || document.body
    const parentWidth = slideWrapRef.parentElement?.clientWidth || slideWrapRef.clientWidth
    const parentHeight = slideWrapRef.parentElement?.clientHeight || slideWrapRef.clientHeight
    let width, height
    if (parentHeight / parentWidth === viewportRatio.value) {
      width = parentWidth
      height = parentHeight
    } else if (parentHeight / parentWidth > viewportRatio.value) {
      width = parentWidth
      height = parentWidth * viewportRatio.value
    } else {
      width = parentHeight / viewportRatio.value
      height = parentHeight
    }
    slideWidth.value = width
    slideHeight.value = height
  }

  onMounted(() => {
    setSlideContentSize()
    window.addEventListener('resize', setSlideContentSize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', setSlideContentSize)
  })

  return {
    slideWidth,
    slideHeight,
  }
}