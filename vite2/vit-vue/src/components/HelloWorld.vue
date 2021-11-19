<template>
  
</template>

<script setup>
import { onMounted,ref,watchEffect, defineProps, reactive } from 'vue'

const boxOfficeData = ref([])

const fetchData = async ()=>{
  const res = await fetch('/public/boxOffice.json')
  const data = await res.json()
  boxOfficeData.value = data
}

onMounted(()=>{
  fetchData()
})

const state = reactive({ count: 0 })
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
