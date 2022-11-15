import MenuComponent from "./MenuComponent.js";
(function () {
    const messages = {
        en: {
            Button: {
                getData: "getData and initialization",
                popDialog: " pop-up dialog",
                sumitbtn:"sumit",
                getsinglebtn:"get single data",
            },
            main: {

                id: "key in id",
                searchId: "The id you searched for is:",
                userid: "key in userid",
                searchUserId: "The user id you are searching for is:",
                title: "key in title",
                searchtitle: "The title you searched for is:",
            }
        },
        tw: {
            Button: {
                getData: "獲取資料(初始化)",
                popDialog: "彈出視窗",
                sumitbtn:"送出資料",
                getsinglebtn:"取得特定一筆的資料",
            },
            main: {

                id: "id輸入",
                searchId: "你輸入的Userid是:",
                userid: "Userid輸入",
                searchUserId: "你輸入的Userid是:",
                title: "title輸入",
                searchtitle: "你輸入的title是:",
            }
        },
        jp: {
            Button: {
                getData: "getdata と初期化",
                popDialog: " ポップアップ ダイアログ",
                sumitbtn:"サミットt",
                getsinglebtn:"単一のデータを取得する",
            },
            main: {

                id: "キー入力ID",
                searchId: "検索した ID は次のとおりです。",
                userid: "ユーザーIDのキー",
                searchUserId: "ユーザーIDのキー:",
                title: "タイトルのキー",
                searchtitle: "検索したタイトルは次のとおりです。",
            }
        },
        cn:{
            Button: {
                getData: "获取资料(初始化)",
                popDialog: "弹出视窗",
                sumitbtn:"送出资料",
                getsinglebtn:"取得特定一笔的资料",
            },
            main: {

                id: "id输入",
                searchId: "你输入的id是:",
                userid: "键入用户标识",
                searchUserId: "你输入的Userid是:",
                title: "键入标题",
                searchtitle: "您搜索的标题是：",
            }
        },
    };
    const i18n = new VueI18n({
        //定義默認語言
        locale: 'tw', // 語系可以先指定或之後指定
        messages: messages
      })
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
            // getters 類似組件中的computed
            // getters的返回質會被暫存起來，當他的依賴被改變時才會重新計算
            outputData: state => { return state._outputData }
        },
    })

    const app = new Vue({
        el: '#app',
        // 引入store
        store,
        // 引入i18n
        i18n: i18n,
        data: {
            showdata: false,
            outputData: [],
            modifyValue: {
                UserId: null,
                Id: null,
                Title: null,
                Body: null,
            },
            Language:'',
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

                } else {
                    this.outputData.push(pushData);
                }

            },
            
            changeLanguage(val){
                console.log(this.$i18n);
                this.$i18n.locale=this.Language;
            },
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
