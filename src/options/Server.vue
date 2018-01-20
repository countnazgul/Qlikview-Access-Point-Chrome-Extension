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
    <!--<div class="rightMenu-server">
      <el-button type="primary" plain @click="testConnection">Test</el-button>
      {{ testResult.text }}
    </div> -->
  </div>
</template>

<script>
import xhr from "xhr";
import convert from "xml-js";

export default {
  props: ["server"],
  data() {
    return {
      tooltip: "",
      testResult: {
        type: "",
        text: ""
      }
    };
  },
  methods: {
    removeServer: function() {
      var _this = this;
      this.$confirm("Are you shure you want to delete this server?", "", {
        confirmButtonText: "YES",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          _this.$emit("removeServer", this.server.id);
        })
        .catch(() => {});
    },
    testConnection: function() {
      /*      
      var _this = this;
      _this.testResult = {
        type: "",
        text: ""
      };

      xhr(
        {
          method: "post",
          body: `username=${_this.server.user}&password=${_this.server.pass1}`,
          uri: `${_this.server
            .url}/QvAJAXZfc/Authenticate.aspx?back=/FormLogin.htm`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        },
        function(err, resp, body) {
          xhr(
            {
              method: "post",
              body:
                '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.Update" action="" /><set name="AccessPoint.Pages.Current" value="0" /><set name="AccessPoint.Pagesize" value="0" /><set name="AccessPoint.Category" value="" /><set name="Document" add="mode;ie6false" /><set name="AccessPoint.SearchFilter" text="" /></update>',
              uri: `${_this.server
                .url}/QvAJAXZfc/AccessPoint.aspx?mark=&platform=browser.chrome&dpi=96`,
              headers: {}
            },
            function(err, resp, body) {
              var docs = convert.xml2json(body, {
                compact: true,
                spaces: 4
              });
              docs = JSON.parse(docs);

              _this.testResult = {
                type: true,
                text: docs.result.object.value[3]._attributes.value
              };
            }
          );
        }
      );
*/
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
