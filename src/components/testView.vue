<!-- src/components/C1.vue -->
<template>
    <div>
      <h2>Component 1</h2>
      <el-button type="primary" @click="navigateToC2">
        Go to Component 2  Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2
      </el-button>
      <h2>Component 1</h2>
      <el-button type="primary" @click="navigateToC2">
        Go to Component 2  Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2
      </el-button>
      <h2>Component 1</h2>
      <el-button type="primary" @click="navigateToC2">
        Go to Component 2  Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2
      </el-button>
      <h2>Component 1</h2>
      <el-button type="primary" @click="navigateToC2">
        Go to Component 2  Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2
      </el-button>
      <h2>Component 1</h2>
      <el-button type="primary" @click="navigateToC2">
        Go to Component 2  Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2
      </el-button>
      <h2>Component 1</h2>
      <el-button type="primary" @click="navigateToC2">
        Go to Component 2  Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2 Go to Component 2
      </el-button>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const navigateToC2 = () => router.push('/c2')
  </script>
  