<template>
  <div class="form-container">
    <el-form :model="formData" label-width="100px">
      <el-form-item label="目的地">
        <el-input v-model="formData.destination" placeholder="例如：大理" />
      </el-form-item>
      
      <el-form-item label="旅行天数">
        <el-input-number v-model="formData.days" :min="1" :max="7" />
      </el-form-item>
      
      <el-form-item label="出行类型">
        <el-radio-group v-model="formData.travelers">
          <el-radio label="solo">独旅</el-radio>
          <el-radio label="couple">情侣</el-radio>
          <el-radio label="family">亲子</el-radio>
          <el-radio label="elderly">带老人</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="兴趣偏好">
        <el-checkbox-group v-model="formData.interests">
          <el-checkbox label="nature">自然风光</el-checkbox>
          <el-checkbox label="culture">历史文化</el-checkbox>
          <el-checkbox label="food">美食</el-checkbox>
          <el-checkbox label="shopping">购物</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      
      <el-form-item label="行程节奏">
        <el-slider v-model="formData.pace" :min="1" :max="3" :marks="paceMarks" />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="store.loading">
          生成行程
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useItineraryStore } from '@/stores/itineraryStore'
import { ElMessage } from 'element-plus'

const store = useItineraryStore()

const formData = reactive({
  destination: '大理',
  days: 2,
  travelers: 'solo',
  interests: ['nature', 'culture'],
  pace: 2
})

const paceMarks = { 1: '轻松', 2: '适中', 3: '紧凑' }

const emit = defineEmits(['generated'])

const handleSubmit = async () => {
  if (!formData.destination) {
    ElMessage.warning('请输入目的地')
    return
  }
  
  const result = await store.generateItinerary(formData)
  emit('generated', result)
  ElMessage.success('行程生成成功！')
}
</script>

<style scoped>
.form-container {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>