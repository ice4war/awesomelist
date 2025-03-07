<script setup>
import { onMounted, reactive, ref } from 'vue';
import Content from './Content.vue';

import python from "../data/python.json";
import go from '../data/go.json';
import java from '../data/java.json';
import vue from '../data/vue.json';
import php from '../data/php.json';
import django from '../data/django.json';
import tf from '../data/tf.json';
import docker from '../data/docker.json';
import sys  from '../data/sys.json';
import R from '../data/R.json';
import microservices from '../data/microservice.json';
import rust  from '../data/rust.json';
import elixir  from '../data/elixir.json';
import malware  from '../data/malware.json';
import ml  from '../data/ml.json';


import { HorizontalTree } from '../helpers/horizontalTree';


const w = ref({"title":"Start to explore by click the links below"});
const data = reactive({
  python: python,
  go : go,
  java: java,
  vue: vue,
  php: php,
  django: django,
  tf: tf,
  docker: docker,
  sys: sys,
  ml: ml,
  r: R,
  microservices: microservices,
  rust: rust,
  elixir: elixir,
  "malware analysis":malware
});

let chart;
onMounted(()=>{
 plotTree()
})
function plotTree(){
  chart = new HorizontalTree(w.value,'chart');
  const atags = document.querySelectorAll('.a-link');
  atags.forEach(d=>{
    const attr = d.getAttribute("href");
      d.addEventListener("click",()=>{
        chart.remove()
        const item = d.textContent.toLowerCase();
        w.value = data[item]
        chart = new HorizontalTree(w.value,"chart")
      })
  })
}
</script>

<template>
  <div class="aw-container">
    <div class="head">
    <h2>awesome packages and frameworks</h2>
    </div>
    <div class="chart" id="graph"></div>
    <div class="sep"></div>
    <Content />
    <div class="sep"></div>
    <div></div>

</div>
</template>

<style scoped >
.aw-container{
  margin-top: 2em;
}

.head {
  text-align: center;
  > h2{
    text-transform: capitalize;
  }
}
.sep{
  width: 100%;
  height: 2px;
  background: linear-gradient(to right,
    var(--purple1),
    var(--blue2),
    var(--blue3),
    var(--blue2),
    var(--purple1)
  );
}
.chart{
  margin: 1em;
}

</style>