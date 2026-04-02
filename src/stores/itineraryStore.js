import { defineStore } from 'pinia'
import { mockItinerary } from '@/mock/mockData'

export const useItineraryStore = defineStore('itinerary', {
  state: () => ({
    itinerary: null,        // 当前行程数据
    loading: false,         // 加载状态
    currentDayIndex: 0      // 当前选中的天数
  }),

  actions: {
    // 生成行程（MVP阶段先用mock）
    async generateItinerary(formData) {
      this.loading = true

      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 实际这里会调用后端API，现在先用mock
      this.itinerary = mockItinerary
      this.loading = false

      return this.itinerary
    },

    // 更新某一天的某个时段的地点
    updateLocation(dayIndex, locationId, newData) {
      const day = this.itinerary.days[dayIndex]
      const locIndex = day.locations.findIndex(l => l.id === locationId)
      if (locIndex !== -1) {
        day.locations[locIndex] = { ...day.locations[locIndex], ...newData }
      }
    },

    // 拖拽排序后更新整个行程
    updateDayLocations(dayIndex, newLocations) {
      this.itinerary.days[dayIndex].locations = newLocations
    },

    setCurrentDay(index) {
      this.currentDayIndex = index
    }
  }
})