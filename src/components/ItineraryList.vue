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
          <div class="location-card" :data-time="loc.timeSlot">
            <div class="drag-handle">⋮⋮</div>
            <div class="location-info">
              <div class="time-badge">{{ getTimeSlotLabel(loc.timeSlot) }}</div>
              <h4>{{ loc.name }}</h4>
              <p class="address">{{ loc.address }}</p>
              <div class="meta">
                <span>⏱️ {{ loc.duration }}小时</span>
                <span class="tip">💡 {{ loc.tip }}</span>
              </div>
              <div class="action-buttons">
                <el-button type="primary" link size="small" @click="editLocation(dayIdx, loc.id)">
                  <el-icon><Edit /></el-icon> 编辑
                </el-button>
                <el-button type="danger" link size="small" @click="deleteLocation(dayIdx, loc.id)">
                  <el-icon><Delete /></el-icon> 删除
                </el-button>
              </div>
            </div>
          </div>
        </template>
      </draggable>
      <div class="add-location-btn">
        <el-button type="primary" plain size="small" @click="addLocation(dayIdx)">
          <el-icon><Plus /></el-icon> 添加地点
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import draggable from 'vuedraggable'
import { useItineraryStore } from '@/stores/itineraryStore'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Delete, Plus } from '@element-plus/icons-vue'

const store = useItineraryStore()

const getTimeSlotLabel = (slot) => {
  const map = { morning: '上午', afternoon: '下午', evening: '晚上' }
  return map[slot] || slot
}

const onDragEnd = (dayIndex, newLocations) => {
  store.updateDayLocations(dayIndex, newLocations)
}

// 删除地点
const deleteLocation = (dayIndex, locationId) => {
  ElMessageBox.confirm('确定要删除这个地点吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.deleteLocation(dayIndex, locationId)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 编辑地点（先做一个简单的弹窗，后续可扩展）
const editLocation = (dayIndex, locationId) => {
  const day = store.itinerary.days[dayIndex]
  const location = day.locations.find(l => l.id === locationId)
  
  ElMessageBox.prompt('修改地点名称', '编辑', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: location.name,
    inputValidator: (value) => value ? true : '名称不能为空'
  }).then(({ value }) => {
    store.updateLocationName(dayIndex, locationId, value)
    ElMessage.success('修改成功')
  }).catch(() => {})
}

// 添加地点（简单版，后续可扩展为搜索选择）
const addLocation = (dayIndex) => {
  ElMessageBox.prompt('请输入地点名称', '添加地点', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPlaceholder: '例如：苍山'
  }).then(({ value }) => {
    if (value) {
      const newLocation = {
        id: `loc_${Date.now()}`,
        name: value,
        address: '待补充',
        lat: 0,
        lng: 0,
        duration: 1,
        timeSlot: 'afternoon',
        tip: '待补充'
      }
      store.addLocation(dayIndex, newLocation)
      ElMessage.success('添加成功，后续可完善详情')
    }
  }).catch(() => {})
}
</script>

<style scoped>
.itinerary-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.day-section {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.day-section:hover {
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.day-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%);
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
}

.day-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
}

.day-header h3::before {
  content: '📅';
  font-size: 20px;
}

:deep(.el-tag) {
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  font-weight: 500;
}

.location-list {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.location-card {
  display: flex;
  gap: 14px;
  padding: 16px 18px;
  background: #ffffff;
  border-radius: 16px;
  transition: all 0.3s ease;
  cursor: move;
  border: 1px solid #e9ecef;
}

.location-card:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-color: #d0d7de;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.drag-handle {
  font-size: 20px;
  color: #adb5bd;
  cursor: grab;
  user-select: none;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.drag-handle:hover {
  color: #667eea;
}

.drag-handle:active {
  cursor: grabbing;
}

.location-info {
  flex: 1;
}

.time-badge {
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(135deg, #e8f4fd 0%, #d4eaff 100%);
  color: #1890ff;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  margin-bottom: 10px;
}

.location-info h4 {
  margin: 0 0 6px 0;
  font-size: 17px;
  font-weight: 600;
  color: #1a1a2e;
}

.address {
  color: #6c757d;
  font-size: 13px;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.address::before {
  content: '📍';
  font-size: 12px;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 10px;
  font-size: 12px;
  color: #868e96;
}

.meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tip {
  color: #20c997;
}

.tip::before {
  content: '💡';
  margin-right: 2px;
}

/* 不同时段的卡片微色调 */
.location-card[data-time="morning"] .time-badge {
  background: linear-gradient(135deg, #fff3e0, #ffe0b3);
  color: #f39c12;
}

.location-card[data-time="afternoon"] .time-badge {
  background: linear-gradient(135deg, #e8f4fd, #d4eaff);
  color: #3498db;
}

.location-card[data-time="evening"] .time-badge {
  background: linear-gradient(135deg, #f3e8ff, #e4d4ff);
  color: #9b59b6;
}

@media (max-width: 768px) {
  .day-header {
    padding: 12px 16px;
  }
  
  .day-header h3 {
    font-size: 16px;
  }
  
  .location-list {
    padding: 12px;
    gap: 10px;
  }
  
  .location-card {
    padding: 12px;
    flex-direction: column;
  }
  
  .drag-handle {
    display: none;
  }
  
  .location-info h4 {
    font-size: 15px;
  }
  
  .meta {
    gap: 12px;
  }
}

  .action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px dashed #e9ecef;
}

.add-location-btn {
  margin-top: 0px;
  padding: 0 20px 17px 20px;
  display: flex;
  justify-content: center;
}

.add-location-btn .el-button {
  width: 100%;
  max-width: 200px;
}
</style>