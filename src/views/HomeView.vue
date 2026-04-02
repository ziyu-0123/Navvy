<template>
  <div class="home">
    <header class="app-header">
      <h1>智能行程规划</h1>
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
        <div class="loading-spinner"></div>
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
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.app-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.app-header h1 {
  font-size: 36px;  /* 从 42px 改小 */
  margin-bottom: 8px;
  font-weight: 700;
  letter-spacing: -0.5px;
  position: relative;
  z-index: 1;
}

.app-header p {
  font-size: 14px;  /* 从 16px 改小 */
  opacity: 0.9;
  position: relative;
  z-index: 1;
}

.content {
  max-width: 1200px;
  margin: 16px auto 0;
  padding: 0 24px 60px;
  position: relative;
  z-index: 2;
}

.form-section {
  margin-bottom: 16px;
  animation: slideInRight 0.5s ease;
}

.result-section {
  animation: fadeInUp 0.6s ease;
}

.empty-state,
.loading-state {
  background: white;
  border-radius: 20px;
  padding: 80px 40px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loading-text {
  color: #666;
  font-size: 14px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .app-header {
    padding: 16px 20px;
  }
  
  .app-header h1 {
    font-size: 24px;
    margin-bottom: 4px;
  }
  
  .app-header p {
    font-size: 12px;
  }
  
  .content {
    padding: 0 16px 40px;
    margin-top: 16px;  /* 关键修改：不重叠 */
  }
  
  .empty-state,
  .loading-state {
    padding: 40px 20px;
  }
}
</style>