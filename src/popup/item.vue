<template>
  <div>
    <li class="item">  
      <div>
        <span v-on:click="openDoc" class="link" :title="tooltip">{{ doc._attributes.text }}</span>
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
      var url = `https://app.instantview.io/QvAJAXZfc/AccessPoint.aspx?open=&id=${_this.doc._attributes.value}&client=Ajax`
      window.open(url, '_blank');      
    }
  },
  mounted: function() {
    var _this = this;
    var d = _this.doc._attributes
    
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
  padding-bottom: 7px;
}
</style>
