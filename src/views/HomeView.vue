<template>
  <div class="home">
    <header class="app-header">
      <h1>✈️ 智能行程规划</h1>
      <p>AI帮你规划最优路线</p>
    </header>
    
    <div class="content">
      <div class="form-section">
        <ItineraryForm @generated="onItineraryGenerated" />
      </div>
      
      <div class="result-section" v-if="store.itinerary">
        <ItineraryList />
      </div>
      
      <div v-else-if="!store.loading" class="empty-state">
        <el-empty description="填写上方表单，开始规划你的旅行" />
      </div>
      
      <div v-if="store.loading" class="loading-state">
        <el-skeleton :rows="5" animated />
        <div class="loading-text">正在生成行程，请稍候...</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useItineraryStore } from '@/stores/itineraryStore'
import ItineraryForm from '@/components/ItineraryForm.vue'
import ItineraryList from '@/components/ItineraryList.vue'

const store = useItineraryStore()

const onItineraryGenerated = (itinerary) => {
  // 自动滚动到结果区域
  setTimeout(() => {
    document.querySelector('.result-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    })
  }, 100)
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #f5f5f5;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 48px 24px;
  text-align: center;
}

.app-header h1 {
  font-size: 32px;
  margin-bottom: 8px;
}

.content {
  max-width: 1200px;
  margin: -24px auto 0;
  padding: 0 20px 40px;
}

.form-section {
  margin-bottom: 32px;
}

.result-section {
  animation: fadeIn 0.5s ease;
}

.empty-state,
.loading-state {
  background: white;
  border-radius: 8px;
  padding: 60px;
  text-align: center;
}

.loading-text {
  margin-top: 20px;
  color: #666;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .content {
    padding: 0 12px 20px;
  }
}
</style>