<template>
  <div>
    
    <div v-if="!loaded" class="loading">
      <i class="el-icon-loading"></i>
    </div>

    <div v-if="loaded">
      <div class="searchBar">
        <div class="searchBox">
          <el-input 
          v-if="!noServers" 
            placeholder="Search"
            v-model="searchString"
            clearable>
          </el-input>
          <i v-if="!noServers" class="el-icon-setting" @click="openOptions"></i>
          <span v-if="noServers"> No servers found. \n Add server(s) from the</span> <span @click="openOptions" class="optionsLink">options</span> <span>page</span>
        </div>
      </div>
      <div  v-if="!noServers" class="content">
        <ul id="example-1">
          <item v-for="doc in filterByDoc" :doc="doc"></item>
        </ul>
      </div>
    </div>    

  </div>
</template>

<script>
// import axios from "axios";
// import Vue from 'vue';
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(ElementUI)
import xhr from "xhr";
import convert from "xml-js";
import item from "./item";
import async from "async";
// import eachSeries from "async/eachSeries";

// async function Login() {
//   return new Promise(function(resolve, reject) {
//     resolve;
//   });
// }

// async function GetDocuments() {}

export default {
  components: {
    item
  },
  data() {
    return {
      test: [],
      docs: [],
      loaded: false,
      noServers: false,
      searchString: ""
    };
  },
  computed: {
    filterByDoc: function() {
      return this.docs.filter(doc => {
        return doc._attributes.text
          .toLowerCase()
          .match(this.searchString.toLowerCase());
      });
    }
  },
  methods: {
    openOptions: function() {
      // chrome.tabs.create({
      //   url: "chrome://extensions/?options=" + chrome.runtime.id
      // });
      chrome.tabs.create({ url: "options/options.html" });
    }
  },
  mounted: function() {
    var _this = this;
    _this.docs = [];

    chrome.storage.local.get("servers", function(servers) {
      if (servers.servers.length > 0) {
        async.each(
          servers.servers,
          function(server, callback) {
            xhr(
              {
                method: "post",
                body: `username=${server.user}&password=${server.pass}`,
                uri: `${server.url}/QvAJAXZfc/Authenticate.aspx?back=/FormLogin.htm`,
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                }
              },
              function(err, resp, body) {
                // console.log(body)

                xhr(
                  {
                    method: "post",
                    body:
                      '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.Update" action="" /><set name="AccessPoint.Pages.Current" value="0" /><set name="AccessPoint.Pagesize" value="0" /><set name="AccessPoint.Category" value="" /><set name="Document" add="mode;ie6false" /><set name="AccessPoint.SearchFilter" text="" /></update>',
                    uri: `${server.url}/QvAJAXZfc/AccessPoint.aspx?mark=&platform=browser.chrome&dpi=96`,
                    headers: {}
                  },
                  function(err, resp, body) {
                    var docs = convert.xml2json(body, {
                      compact: true,
                      spaces: 4
                    });
                    docs = JSON.parse(docs);

                    async.each(
                      docs.result.object.value[20].element,
                      function(doc, callback) {
                        //   var localDoc = docs.result.object.value[20].element[d];
                        // console.log(server)
                        doc._attributes.color = server.color;
                        doc._attributes.serverName = server.name;
                        _this.docs.push(doc);
                        callback();
                      },
                      function(err) {
                        callback();
                      }
                    );

                    // _this.docs = docs.result.object.value[20].element

                    // console.log(server);

                    // for (
                    //   var d = 0;
                    //   d < docs.result.object.value[20].element.length;
                    //   d++
                    // ) {
                    //   var localDoc = docs.result.object.value[20].element[d];
                    //   localDoc.color = server.color;
                    //   localDoc.server = server.name;
                    //   _this.docs.push(localDoc);
                    // }

                    _this.loaded = true;
                  }
                );

                // callback();
              }
            );
          },
          function(err) {}
        );
      } else {
        _this.loaded = true;
        _this.noServers = true;
      }
      /*
      for (var i = 0; i < servers.servers.length; i++) {
        var server = servers.servers[i];
        console.log(server);
        xhr(
          {
            method: "post",
            body: `username=${server.user}&password=${server.pass}`,
            uri: `${server.url}/QvAJAXZfc/Authenticate.aspx?back=/FormLogin.htm`,
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
                uri: `${server.url}/QvAJAXZfc/AccessPoint.aspx?mark=&platform=browser.chrome&dpi=96`,
                headers: {}
              },
              function(err, resp, body) {
                var docs = convert.xml2json(body, { compact: true, spaces: 4 });
                docs = JSON.parse(docs);
                console.log(server);
                for (
                  var d = 0;
                  d < docs.result.object.value[20].element.length;
                  d++
                ) {
                  var localDoc = docs.result.object.value[20].element[d];
                  localDoc.color = server.color;
                  localDoc.server = server.name;
                  _this.docs.push(localDoc);
                }

                _this.loaded = true;
              }
            );
          }
        );
      }
      */
    });
  }
};
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}

ul {
  list-style-type: none;
  padding-left: 5px !important;
}

.loading {
  font-size: 40px;
  text-align: center;
  padding-top: 40%;
}

.searchBar {
  position: fixed;
  width: 97%;
  top: 0;
  background-color: white;
  height: 60px;
}

.searchBox {
  padding-top: 10px;
}

.content {
  padding-top: 40px;
}

.optionsLink {
  cursor: pointer;
  color: blue;
  text-decoration: underline;
}
</style>
