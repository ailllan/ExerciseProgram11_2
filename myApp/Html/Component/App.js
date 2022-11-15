import MenuComponent from "./MenuComponent.js";
(function () {

    Vue.use(Vuex);
    const store = new Vuex.Store({
        state: {
            _searchValue: {
                id: null,
                title: null,
                userid: null,
            },
            _outputData: [],
        },
        mutations: {
            // mutations負責接收action並更改state的資料
            //mutation是vuex中唯一可以改動state的方法
            // state=可更改/取用state的值，payload從action傳來的參數
            UPDATE_OUTPUT(state, payload) {
                // 清空之前的值
                console.log(`mutations有執行 `);
                console.log(payload.length);
                state._outputData = [];
                if (payload.length == undefined) {
                    state._outputData.push(payload);
                } else {
                    payload.forEach(element => {
                        state._outputData.push(element);
                    });
                }
                console.log(state._outputData);
            },
        },
        actions: {
            updateOutputData(context, resData) {
                console.log(`action有執行 `);
                console.log(resData);
                context.commit("UPDATE_OUTPUT", resData);
            }
        },
        getters: {
            outputData: state => { return state._outputData }
        },
    })

    const app = new Vue({
        el: '#app',
        // 引入store
        store,
        data: {
            showdata: false,
            outputData: [],
            modifyValue: {
                UserId: null,
                Id: null,
                Title: null,
                Body: null,
            },
            dialogVisible: false,
            dialogcontain: null,
            parenMsg: 'Vue實體的資料',
        },
        methods: {
            GetData() {
                axios.get('http://localhost:5293/MyApps')
                    .then((res) => {
                        this.outputData = res.data;
                        //暫存資料
                        console.log("資料獲取成功");
                    })
                    .catch((error) => { console.error(error) })
            },
            // 新增資料
            AddData() {
                if (this.modifyValue == null) {
                    return null;
                }
                else {
                    axios.put('http://localhost:5293/MyApps/AddData',
                        this.modifyValue, { headers: headers })
                        .then((response) => {
                            console.log(`推送資料成功`);
                            console.log(response);
                            this.outputData = [];
                            this.outputData = response.data;
                            // this.$store.dispatch('updateOutputData', response.data);
                            DataLength = this.outputData.length;
                        })
                        .catch((error) => {
                            console.log(`推送資料失敗`);
                            console.log(error);
                        })
                }
                // 清空輸入值
                this.modifyValue = {};
            },
            // 單筆資料刪除
            DeleteData(id) {
                axios.delete(`http://localhost:5293/MyApps/DeletData/${id}`)
                    .then((response) => {
                        console.log(`刪除資料成功`);
                        console.log(response);
                        this.outputData = [];
                        // 更新前端資料畫面
                        this.outputData = response.data;
                        // this.$store.dispatch('updateOutputData', response.data);
                        DataLength = this.outputData.length;
                    })
                    .catch((error) => {
                        console.log(`刪除資料失敗`);
                        console.log(error);
                    })
                this.modifyValue = {};
            },
            // 特定資料刪除
            DeleteSingleData() {
                if (this.modifyValue.Id == null && this.modifyValue.Title == null
                    && this.modifyValue.UserId == null && this.modifyValue.Body == null) {
                    alert("輸入值為空");
                }
                else {
                    axios.delete(`http://localhost:5293/MyApps/DeleteSingleData`,
                        { data: this.modifyValue }, { headers: headers })
                        .then((response) => {
                            console.log(`資料刪除成功`);
                            console.log(response);
                            // 更新前端資料畫面
                            this.outputData = [];
                            this.outputData = response.data;
                            // this.$store.dispatch('updateOutputData', response.data);
                        })
                        .catch((error) => {
                            console.log(`資料刪除失敗`);
                            console.log(error);
                        })
                }
                this.modifyValue = {};
            },
            ShowDiaLog() {
                this.dialogVisible = true;
                this.showdata = true;
            },
            // 父組件更新outputData
            updateInfo(val) {
                this.outputData = val;
            },
            // 推送資料到主畫面
            pushToTable(pushData) {
                // 防止重複推送，有重複不push
                if (this.outputData.includes(pushData)) {
                    
                }else{
                  this.outputData.push(pushData);
                }
                  
            }
        },
        components: {
            MenuComponent
        },
        computed: {
            // 將結果暫存在updat，當參考值改變時(this.$store.getters.outputData)，
            // compute會重新執行
            update() {
                return this.$store.getters.outputData;
            }
        },
    })
})();
