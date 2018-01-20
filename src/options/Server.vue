<template>
  <div class="grid-container-server">
    <div class="leftMenu-server">
      Name
    </div>
    <div class="rightMenu-server">
      <el-input 
        size="medium"
        placeholder="Server name (optional)" 
        v-model="server.name"></el-input> <!--{{server.id}}-->
    </div>    

    <div class="leftMenu-server">
      Server URL
    </div>
    <div class="rightMenu-server">
      <el-input placeholder="Server full URL" v-model="server.url"></el-input>
    </div>    

    <div class="leftMenu-server">
      Username
    </div>
    <div class="rightMenu-server">      
      <el-input placeholder="domain\username" v-model="server.user"></el-input>
    </div> 

    <div class="leftMenu-server">
      Password
    </div>
    <div class="rightMenu-server">
      <el-input type="password" placeholder="Password" v-model="server.pass"></el-input>
    </div> 

    <div class="leftMenu-server">
      Color
    </div>
    <div class="rightMenu-server">
      <el-color-picker v-model="server.color"></el-color-picker>
    </div>    
    <div class="leftMenu-server">
      <el-button type="danger" @click="removeServer">Delete</el-button>      
    </div>   
    <div class="rightMenu-server">
      <el-button type="primary" plain disabled>Test</el-button>
    </div>                     
  </div>
</template>

<script>
export default {
  props: ["server"],
  data() {
    return {
      tooltip: ""
    };
  },
  methods: {
    removeServer: function() {
      this.$emit("removeServer", this.server.id);
    }
  },
  mounted: function() {
    var _this = this;
  }
};
</script>

<style scoped>
.grid-container-server {
  display: grid;
  grid-template-columns: 10% 90%;
  grid-gap: 0px;
  padding: 0px;
  padding-top: 10px;
  padding-bottom: 10px;
  border: solid;
  border-top: 0px;
  border-left: 0px;
  border-right: 0px;
}

.leftMenu-server {
  grid-column-start: 1;
  grid-column-end: 2;
  text-align: left;
  font-size: 16px;
}

.rightMenu-server {
  grid-column-start: 2;
  grid-column-end: 2;
  text-align: left;
  font-size: 16px;
  padding-bottom: 10px;
}

.el-input {
  width: 500px;
}
</style>
