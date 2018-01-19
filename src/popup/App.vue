<template>
  <div class="grid-container">
    
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
          <!-- <i v-if="!noServers" class="el-icon-setting" @click="openOptions"></i> -->
          <div v-if="noServers">
            <span > No servers found. Add server(s) from the</span> <span @click="openOptions" class="optionsLink">options</span> <span>page</span>
          </div>
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

var sort_by = function(field, reverse, primer){

   var key = primer ? 
       function(x) {return primer(x[field])} : 
       function(x) {return x[field]};

   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     } 
}

export default {
  components: {
    item
  },
  data() {
    return {
      test: [],
      docs: [],
      docs_temp: [],
      loaded: false,
      noServers: false,
      searchString: ""
    };
  },
  computed: {
    filterByDoc: function() {
      return this.docs.filter(doc => {
        return doc.text
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
            // console.log(server);
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

                    var docsList = [];
                    async.each(
                      docs.result.object.value,
                      function(obj, callback) {
                        // console.log(obj)
                        if (obj._attributes.name == "Documents") {
                          docsList = obj;
                          // console.log(docsList)
                        }
                        callback();
                      },
                      function(err) {
                        async.each(
                          //docs.result.object.value[20].element,
                          docsList.element,
                          function(doc, callback) {
                            // doc.text = doc.text.replace(
                            //   ".qvw",
                            //   ""
                            // );
                            doc._attributes.color = server.color;
                            doc._attributes.serverName = server.name;
                            var d = doc._attributes
                            _this.docs_temp.push(d);
                            callback();
                          },
                          function(err) {
                            callback();
                          }
                        );
                      }
                    );                    
                  }
                );
              }
            );
          },
          function(err) {
            // console.log(_this.docs)
            _this.docs = _this.docs_temp.sort(sort_by('text', false, function(a){return a.toUpperCase()}));
            _this.loaded = true;
          }
        );
      } else {
        _this.loaded = true;
        _this.noServers = true;
      }
    });
  }
};
</script>

<style scoped>
.grid-container {
  grid-template-columns: 10% 90%;
  grid-gap: 0px;
  padding: 0px;
  height: 100vh;
}

.header {
  grid-column-start: 1;
  grid-column-end: 1;
  background-color: lightgray;
  text-align: center;
  border: 1px;
  border-right-style: solid;
}

.apps-list {
  grid-column-start: 1;
  grid-column-end: 1;
  background-color: lightgray;
  text-align: center;
  border: 1px;
  border-right-style: solid;
}

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
