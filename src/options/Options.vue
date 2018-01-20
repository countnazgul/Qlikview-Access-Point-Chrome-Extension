<template>
    <div class="grid-container">
        <div class="leftMenu">
            <div class="leftMenuContainer">
                <div class="leftMenuHeader">Options</div>
                <div v-on:click="option = true" class="leftMenuContent">Servers</div>
                <div v-on:click="option = false" class="leftMenuContent">About</div>
            </div>
        </div>
        <div class="mainContent">
            <div class="mainContentContainer">
                <div v-if="option" class="mainContentHeader">Servers</div>
                <div v-if="option" class="mainContentServers">
                  <el-button type="primary" @click="addServer">Add Server</el-button>
                  <el-button type="primary" @click="saveServers">Save</el-button>
                  <div class="line"></div>
                  <server 
                    v-for="server in servers" 
                    :server="server" 
                    v-bind:key="server.id"
                    v-on:removeServer="removeServer"
                  ></server>
                </div>
                <div v-if="!option" class="mainContentHeader">About</div>
                <div v-if="!option" class="mainContentAbout">
                  <div class="aboutContainer">                     
                      <div class="aboutContent"> <h3>Version</h3> </div>
                      <div class="aboutContent"> 2.0.3 </div>      


                      <div class="aboutContent"></div>
                      <div class="aboutContent"> <h3>Description</h3> </div>
                      <div class="aboutContent">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                      </div>
                      <div class="aboutContent"></div>

                      <div class="aboutContent"> <h3>Repo</h3> </div>
                      <div class="aboutContent"> <a href="https://github.com/countnazgul/Qlikview-Access-Point-Chrome-Extension" target="_blank">GitHub</a> </div>                            
                      <div class="aboutContent"></div>
                      
                      <div class="aboutContent"> <h3>Created by</h3> </div>
                      <div class="aboutContent"> Stefan Stoichev</div>
                      <div class="aboutContent"> Twitter: <a href="http://twitter.com/countnazgul" target="_blank">@countnazgul</a></div>
    							    <div class="aboutContent">  Website: <a href="https://sstoichev.eu" target="_blank">https://sstoichev.eu</a></div>
                      <div class="aboutContent"> GitHub: <a href="https://github.com/countnazgul" target="_blank">countnazgul</a></div>

                      <div class="aboutContent"></div>
                      <div class="aboutContent"> <h3>Changelog</h3> </div>     
                  </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import uuid from "uuid/v4";
import server from "./server";

export default {
  components: {
    server
  },
  data() {
    return {
      option: true,
      servers: []
    };
  },
  methods: {
    addServer: function() {
      this.servers.unshift({
        id: uuid(),
        url: "",
        user: "",
        pass: "",
        color: "",
        name: ""
      });
    },
    removeServer: function(id) {
      console.log(id);

      var filteredServers = this.servers.filter(function(server) {
        return server.id !== id;
      });

      this.servers = filteredServers;
    },
    saveServers: function() {
      var _this = this;

      chrome.storage.local.set({ servers: _this.servers }, function() {
        console.log("Saved");
        _this.$notify({
          title: "Saved",
          message: "Locally saved",
          type: "success",
          duration: 1000,
          showClose: false
        });
      });
    }
  },
  computed: {},
  mounted: function() {
    var _this = this;

    chrome.storage.local.get("servers", function(servers) {
      console.log(servers);
      _this.servers = servers.servers;
    });
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.grid-container {
  display: grid;
  grid-template-columns: 10% 90%;
  grid-gap: 0px;
  padding: 0px;
  height: 100vh;
  width: 100vw;
}

.leftMenu {
  grid-column-start: 1;
  grid-column-end: 2;
  background-color: lightgray;
  text-align: center;
  border: 1px;
  border-right-style: solid;
}

.leftMenuContainer {
  display: grid;
  grid-template-columns: auto;
  grid-row-gap: 10px;
}

.leftMenuHeader {
  grid-column-start: 1;
  grid-column-end: 1;
  font-size: 30px;
  border: 1px;
  border-bottom-style: solid;
  font-weight: bold;
}

.leftMenuContent {
  grid-column-start: 1;
  grid-column-end: 1;
  font-size: 20px;
  text-align: right;
  cursor: pointer;
  padding-right: 10px;
}

.mainContent {
  grid-column-start: 2;
  grid-column-end: 3;
  text-align: left;
}

.mainContentContainer {
  display: grid;
  grid-template-columns: auto;
  grid-row-gap: 10px;
}

.mainContentHeader {
  grid-column-start: 1;
  grid-column-end: 1;
  font-size: 30px;
  background-color: lightgray;
  padding-left: 10px;
  border: 1px;
  border-bottom-style: solid;
}

.mainContentContent {
  grid-column-start: 1;
  grid-column-end: 1;
  font-size: 20px;
  text-align: left;
  padding-left: 10px;
}

.mainContentServers {
  grid-column-start: 1;
  grid-column-end: 1;
  font-size: 20px;
  text-align: left;
  padding-left: 10px;
}

.mainContentAbout {
  grid-column-start: 1;
  grid-column-end: 1;
  font-size: 20px;
  text-align: left;
  padding-left: 10px;
}

.aboutContainer {
  display: grid;
  grid-template-columns: auto;
  grid-row-gap: 10px;
}

.aboutContent {
  grid-column-start: 1;
  grid-column-end: 1;
  text-align: left;
  padding-left: 10px;
  font-size: 16px;
}

.el-button {
  line-height: 30px;
  width: 90px;
}

.line {
  padding-top: 10px;
  border: solid;
  border-top: 0px;
  border-left: 0px;
  border-right: 0px;
}
</style>
