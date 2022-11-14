
const headers = {
    'Content-Type': 'application/json;',
};
export default {

    template: `  <div>
        <label>請輸入id</label>
        <el-input size="mini" type="text" v-on:keyup.enter.native=" IdSearch" v-model="searchValue.Id"></el-input>
        <br />
        <label>你搜尋的id是:{{searchValue.Id}}</label>
        <br />
        <label>請輸入title</label>
        <el-input size="mini" type="text" @keyup.enter.native="TitleSearch" v-model="searchValue.Title"></el-input>
        <br />
        <label>你搜尋的標題是:{{searchValue.Title}}</label>
        <br />
        <label>請輸入userId</label>
        <el-input size="mini" type="text"v-model="searchValue.Userid"></el-input>
        <br />
        <label>你搜尋的userId是:{{searchValue.Userid}}</label>
        <br />
        <el-button type="primary" @click="AllSearch">送出資料</el-button>
        <br />
        <label>取得特定一筆的資料</label>
        <el-input size="mini" type="number" v-model="dataCount"></el-input>
        <br />
        <el-button type="primary" @click="SingleGetData">取得第{{dataCount}}筆的資料</el-button>
        <br />
        <el-button type="primary"  @click="Test" >無作用按鈕</el-button>
        <!-- {{parenMsg}} -->
        
    </div>`,

    props: ["outputData", "parenMsg","showData"],
    data: (props) => {
        // 這裡的this是定義對象，而不是呼叫對象
        // 箭頭函式會綁定this=data，所以要傳參數(props)進來，才可以把props的值給data
        // ，但是那只是定義初始值，既使修改也改不了props，parenMsg就是一個例子
        return {
            searchValue: {
                Id: null,
                Title: null,
                Userid: null,
            },
            dataCount: 0,
            outputdata: [],
            // parenMsg:props.parenMsg,
        }
    },
    methods: {
        IdSearch() {
            //直接指到vue元件，this是指到定義時的對象。
            // console.log(this);
            console.log(this.showData); 
            console.log();
            if (isNaN(this.searchValue.Id)) {
                alert(`請輸入數字`);
            }
            else {
                // 將id的資料型別轉數字
                this.searchValue.Id = parseInt(this.searchValue.Id);
                axios.get(`http://localhost:5293/MyApps/IdSearch/${this.searchValue.Id}`,
                    { headers: headers })
                    // axios請求提交數據,(位址，資料，表頭)
                    .then((response) => {
                        // 回傳的值在這裡
                        console.log(`搜尋成功`);
                        this.$store.dispatch('updateOutputData', response.data);

                        // props in emit out的方法----------------------------------------------------------------
                        // this.outputdata = [];
                        // this.outputdata.push(response.data);
                        // props in emit out的方法----------------------------------------------------------------
                        // this.parenMsg=this.searchValue.Id; //無法直接改變props
                    })
                    .catch((error) => {
                        console.log(error);
                        console.log(`id搜尋失敗`);
                    })
            }
            // 清空輸入值
            this.searchValue.Id = null;
        },
        TitleSearch() {
            console.log(this.searchValue.Title);
            axios.post('http://localhost:5293/MyApps/TitleSearch',
                this.searchValue.Title, { headers: headers })
                // axios請求提交數據,(位址，資料，表頭)
                .then((response) => {
                    // 回傳的值在這裡
                    // 用store去dispatch action('updateOutputData'),這個action觸發mutation，mutation，去改變state
                    this.$store.dispatch('updateOutputData', response.data);
                    console.log(` Title搜尋成功`);
                })
                .catch((error) => {
                    console.log(` Title搜尋失敗`);
                    console.log(this.title);
                    console.log(error);
                })
            // 清空輸入值
            this.searchValue.Title = null;
        },
        AllSearch() {
            if (this.searchValue.Id == null ||
                this.searchValue.Title == null || this.searchValue.Userid == null) {
                // 可改善點
                if (this.searchValue.Id != null) {
                    console.log(`做id搜尋`);
                    this.searchValue.Id = parseInt(this.searchValue.Id);
                    this.IdSearch();
                }
                if (this.searchValue.Userid != null) {
                    console.log(`做UserId搜尋`);
                    this.SingleGetUserId()
                }
                if (this.searchValue.Title != null) {
                    console.log(`做title搜尋`);
                    this.TitleSearch()
                }
            }
            else if (this.searchValue.Id != null &&
                this.searchValue.Title != null && this.searchValue.Userid != null) {
                console.log(`做總搜尋`);
                this.searchValue.Id = parseInt(this.searchValue.Id);
                this.searchValue.Userid = parseInt(this.searchValue.Userid);
                axios.post('http://localhost:5293/MyApps/AllSearch',
                    this.searchValue, { headers: headers })
                    // axios請求提交數據,(位址，資料，表頭)
                    .then((response) => {
                        // 回傳的值在這裡
                        console.log(response.data);
                        // 用store去dispatch action('updateOutputData'),這個action觸發mutation，mutation，去改變state
                        this.$store.dispatch('updateOutputData', response.data);
                    })
                    .catch((error) => {
                        console.log(`Allsearch錯誤${this.searchValue}`);
                        console.log(error);
                    })
            }
            this.searchValue.Id = null;
            this.searchValue.Userid = null;
            this.searchValue.Title = null;
        },
        SingleGetData() {
            // 用GET的方式單獨查詢一筆資料
            if (this.dataCount < 0) {
            }
            else {
                axios.get(`http://localhost:5293/MyApps/?id=${this.dataCount}`)
                    .then((response) => {
                        console.log(response.data);
                        this.outputdata = [];
                        this.outputdata = response.data;
                    })
                    .catch((error) => {
                        console.log(`取得資料失敗`);
                        console.log(error);
                    })
            }
            this.dataCount = 0;
        },
        SingleGetUserId() {
            // 查詢userid
            this.searchValue.Userid = parseInt(this.searchValue.Userid);
            console.log(typeof (this.searchValue.Userid));
            axios.get(`http://localhost:5293/MyApps/${this.searchValue.Userid}`)
                // 差別點
                .then((response) => {
                    console.log(response.data);
                    this.outputdata = [];
                    this.outputdata = response.data;
                })
                .catch((error) => {
                    console.log(`取得資料失敗`);
                    console.log(error);
                })
            this.searchValue.Userid = 0;
        },
        Test: () => {
            // 箭頭函式的this
            console.log(`箭頭函示綁定的this`);
            console.log(this);
        },
    },
    watch: {
        //watch 可傳入參數，第一個參數是更新後的值，第二是舊值。 
        // watch->監聽變數
        searchValue: {
            // deep=true，偵測物件裡面的屬性更動，如果沒有，他不會偵測物件類型的屬性更動
            deep: true,
            // 物件改變時，執行handler()
            handler() {
                // console.log(`searchValue改變了${this.searchValue.Id}`);
            },
        },
        outputdata: {
            handler() {
                console.log(`outputdata改變了${this.outputdata}`);
                // $emit語法糖，將子元件的資料傳遞給父元件，自訂義事件
                // 事件名稱,傳遞的資料(子元件)
                this.$emit('update', this.outputdata);
            }
        },
    },
}