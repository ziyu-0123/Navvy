<template>
  <div class="itinerary-list">
    <div v-for="(day, dayIdx) in store.itinerary.days" :key="dayIdx" class="day-section">
      <div class="day-header">
        <h3>第 {{ day.dayIndex }} 天 · {{ day.date }}</h3>
        <el-tag size="small">{{ day.locations.length }} 个地点</el-tag>
      </div>
      
      <!-- 拖拽列表 -->
      <draggable 
        v-model="day.locations" 
        :animation="200"
        item-key="id"
        @end="onDragEnd(dayIdx, day.locations)"
        class="location-list"
      >
        <template #item="{ element: loc }">
          <div class="location-card" :data-id="loc.id">
            <div class="drag-handle">⋮⋮</div>
            <div class="location-info">
              <div class="time-badge">{{ getTimeSlotLabel(loc.timeSlot) }}</div>
              <h4>{{ loc.name }}</h4>
              <p class="address">{{ loc.address }}</p>
              <div class="meta">
                <span>⏱️ {{ loc.duration }}小时</span>
                <span class="tip">💡 {{ loc.tip }}</span>
              </div>
            </div>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import draggable from 'vuedraggable'
import { useItineraryStore } from '@/stores/itineraryStore'

const store = useItineraryStore()

const getTimeSlotLabel = (slot) => {
  const map = { morning: '上午', afternoon: '下午', evening: '晚上' }
  return map[slot] || slot
}

const onDragEnd = (dayIndex, newLocations) => {
  store.updateDayLocations(dayIndex, newLocations)
}
</script>

<style scoped>
.itinerary-list {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.day-section {
  margin-bottom: 32px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #1890ff;
}

.day-header h3 {
  margin: 0;
}

.location-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.location-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: move;
}

.location-card:hover {
  background: #f0f0f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.drag-handle {
  font-size: 20px;
  color: #999;
  cursor: grab;
  user-select: none;
}

.location-info {
  flex: 1;
}

.time-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #1890ff;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 8px;
}

.location-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
}

.address {
  color: #666;
  font-size: 13px;
  margin: 4px 0;
}

.meta {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}

.tip {
  color: #52c41a;
}

@media (max-width: 768px) {
  .location-card {
    flex-direction: column;
  }
  
  .drag-handle {
    display: none;
  }
}
</style>