<script setup>
import awesome from "../data/awesome.json";
	
</script>

<template>
	<div class="introduction">
			<div class="a-item" v-for="el in awesome">
				<a class="a-link" v-bind:href="el.url">{{ el.title.trim() }}</a>
        {{ el.description.trim() }}
      </div>
  </div>
</template>

<style scoped>
.introduction{
  width: 90%;
  font-size: .85em;
  margin: 0 auto;
  padding: 1em 2.5em;
  text-align: left;
  display: flex;
  flex-wrap: wrap;
}
.a-item{
  position: relative;
  padding: 0.3em 1em;
  margin-bottom: 1em;
  margin-right: 1em;
  max-width: 10em;
  overflow: hidden;
}

.a-item::before{
  position: absolute;
  content: '';
  top: 0;
  left: 0;
  opacity: 0.8;
  min-width: 2px;
  max-width: 2px;
  border-radius: 10em;
  height: 100%;
  background:linear-gradient(to bottom, var(--blue3), var(--blue4));
}
.a-item  a{
  position: relative;
  text-decoration: none;
  text-transform: capitalize;
  color: var(--blue4);
  transition: all .19s ease;
}
.a-item a:hover{
  background: var(--blue1);
}
</style>