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
      
      <!-- 替换原来的 el-slider 部分 -->
      <el-form-item label="行程节奏">
        <el-radio-group v-model="formData.pace">
          <el-radio :value="1">轻松</el-radio>
          <el-radio :value="2">适中</el-radio>
          <el-radio :value="3">紧凑</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 在行程节奏后面，提交按钮之前添加 -->

<el-form-item label="预算范围(元)">
  <el-row :gutter="12">
    <el-col :span="11">
      <el-input v-model="formData.budgetMin" placeholder="最低预算" type="number" />
    </el-col>
    <el-col :span="2" style="text-align: center;">-</el-col>
    <el-col :span="11">
      <el-input v-model="formData.budgetMax" placeholder="最高预算" type="number" />
    </el-col>
  </el-row>
</el-form-item>

<el-form-item label="住宿偏好">
  <el-select v-model="formData.accommodation" placeholder="请选择住宿类型" clearable>
    <el-option label="经济型酒店" value="budget" />
    <el-option label="舒适型酒店" value="comfort" />
    <el-option label="精品民宿" value="homestay" />
    <el-option label="豪华酒店" value="luxury" />
  </el-select>
</el-form-item>

<el-form-item label="特殊需求">
  <el-checkbox-group v-model="formData.specialNeeds">
    <el-checkbox label="wheelchair">轮椅友好</el-checkbox>
    <el-checkbox label="vegetarian">素食推荐</el-checkbox>
    <el-checkbox label="pet">宠物友好</el-checkbox>
    <el-checkbox label="night">夜生活推荐</el-checkbox>
  </el-checkbox-group>
</el-form-item>

<el-form-item label="出发地点">
  <el-input v-model="formData.startLocation" placeholder="例如：上海" />
</el-form-item>
      
      <el-form-item label-width="0" class="submit-btn-item">
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
  pace: 2,
  budgetMin: '',      // 新增
  budgetMax: '',      // 新增
  accommodation: '',  // 新增
  specialNeeds: [],   // 新增
  startLocation: ''   // 新增
})

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
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.form-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
}

:deep(.el-input__wrapper) {
  border-radius: 12px;
  transition: all 0.2s;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #667eea inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) inset;
}

/* 让数字输入框也变成圆角 */
:deep(.el-input-number) {
  --el-input-border-radius: 24px;
}

:deep(.el-input-number .el-input__wrapper) {
  border-radius: 12px !important;
}

/* 如果加减按钮也要圆角效果 */
:deep(.el-input-number .el-input-number__decrease) {
  border-radius: 12px 0 0 12px;
}

:deep(.el-input-number .el-input-number__increase) {
  border-radius: 0 12px 12px 0;
}

:deep(.el-radio-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

:deep(.el-radio) {
  margin-right: 0;
}

:deep(.el-radio__label) {
  padding-left: 6px;
}

:deep(.el-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 12px 32px;
  font-weight: 500;
  font-size: 16px;
  transition: all 0.3s ease;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

:deep(.el-slider__runway) {
  background-color: #e9ecef;
}

:deep(.el-slider__bar) {
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.submit-btn-item {
  margin-top: 45px;
}

.submit-btn-item :deep(.el-form-item__content) {
  justify-content: center !important;
  margin-left: 0 !important;  /* 移除默认的左侧偏移 */
}
</style>