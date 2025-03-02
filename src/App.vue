<script setup>
import { onMounted, reactive, ref } from 'vue';
import Content from './components/Content.vue';

import awesome from './data/awesome.json';
import python from "./data/python.json";
import go from './data/go.json';

import { HorizontalTree } from './helpers/horizontalTree';


const w = ref({"title":"Start to explore by click the links below"});
const data = reactive({
  python: python,
  go : go
});
const d = {
  title: "Root",
  children: awesome
}
let chart;
onMounted(()=>{
 plotTree()
})
function plotTree(){
  chart = new HorizontalTree(w.value,'chart');
  const atags = document.querySelectorAll('.a-link');
  atags.forEach(d=>{
    const attr = d.getAttribute("href");
    if(attr.startsWith("#")){
      d.addEventListener("click",()=>{
        chart.remove()
        const item = d.textContent.toLowerCase();
        w.value = data[item]
        chart = new HorizontalTree(w.value,"chart")
      })
    }
  })
}
</script>

<template>
  <div class="aw-container">
    
    <h2>awesome packages and frameWorks</h2>
    <div class="chart" id="graph"></div>
    <div class="sep"></div>
    <Content />

  <div class="sep"></div>

</div>
</template>

<style scoped >
.aw-container{
  margin-top: 2em;
}
.aw-container h2{
  text-transform: capitalize;

}

.sep{
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, var(--purple3), var(--blue3), var(--orange));
}
.chart{
  margin: 1em;
}
</style>