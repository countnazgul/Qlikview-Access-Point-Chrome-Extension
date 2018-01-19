<template>
  <div>
    <li class="item ">  
      <div class="grid-container-app">
        <span v-on:click="openDoc" class="link leftMenu-app" :title="tooltip">{{ doc.text }}</span>
        <div class="rightMenu-app" v-bind:style="{ color: doc.color, 'background-color': doc.color  }">.</div>
      </div>
    </li>
  </div>
</template>

<script>
export default {
  props: ['doc'],
  data() {
    return {
      tooltip: ''
    };
  },
  methods: {
    openDoc: function() {
      var _this = this;
      var url = `${_this.doc.server}QvAJAXZfc/AccessPoint.aspx?open=&id=${_this.doc.value}&client=Ajax`
      window.open(url, '_blank');      
    }
  },
  mounted: function() {
    var _this = this;
    var d = _this.doc
    
    _this.tooltip = 
    `Document: ${d.text}
Server: ${d.server}
Category: ${d.category}
Path: ${d.path}
Size: ${d.filesize}
Last Modified: ${d.lastModified}
Last Update: ${d.lastUpdate}
Color: ${d.color}
Server name: ${d.serverName}`
  }
};
</script>

<style lang="scss" scoped>
.link {
  cursor: pointer;
}

.item {
  padding-bottom: 3px;
}

.grid-container-app {
  display: grid;
  grid-template-columns: 90% 10%;
  grid-gap: 0px;
  width: 400px;
}

.leftMenu-app {
  grid-column-start: 1;
  grid-column-end: 2;
  text-align: left;
  font-size: 14px;
  overflow-wrap: break-word;
}

.rightMenu-app {
  grid-column-start: 2;
  grid-column-end: 2;  
  opacity: 0.4;
  z-index: -100;
}


</style>
