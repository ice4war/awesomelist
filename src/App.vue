<script setup>
import { onMounted, reactive, ref } from 'vue';

import python from "./data/python.json";
import awesome from './data/awesome.json';
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
    <div class="introduction">
      <ol>
      <li v-for="el in awesome">
        <a class="a-link" v-bind:href="el.url">{{ el.title.trim() }}</a>&nbsp;{{ el.description.trim() }}
      </li>
    </ol>
  </div>

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
.introduction{
  width: 88%;
  font-size: .85em;
  margin: 0 auto;
  padding: 1em 2.5em;
  text-align: left;
}
.introduction ol li{
  line-height: 1.5em;
}
.introduction ol li a{
  position: relative;
  text-decoration: none;
  text-transform: capitalize;
  color: var(--purple3);
  border-bottom: 2px solid transparent;
  transition: all .19s ease;
}
.introduction ol li a:hover{
  border-bottom-color: var(--purple3);
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