using Microsoft.AspNetCore.Mvc;

namespace myApp.Controllers;

[ApiController]
[Route("[controller]")]
public class MyAppsController : ControllerBase
{
    static HttpClient client = new HttpClient();
    Product resulet = new Product();
    // 接收資料(字串)
    public string jsondata = null;
    // datalist=資料集，接收的資料，經過處理後最後會在這裡
    // 下方是兩種不同的初始化方式。
    public static List<Product> datalist = new List<Product>();
    // public static List<Product> datalist;
    // 注入Logging的服務-->記錄管理Log
    private readonly ILogger<MyAppsController> _logger;
    // 注入ITservice的服務
    private readonly ITservice _itservice;
    public MyAppsController(ILogger<MyAppsController> logger, ITservice itservice)
    {
        // 建構元注入
        // 所有在建構元的變數，都要註冊。
        // List<Product> datalist = new List<Product>();
        _logger = logger;
        _itservice = itservice;
        // datalist=_datalist;
    }


    [HttpGet]
    [Route("~/MyApps")]
    public async Task<List<Product>> Get(int id)
    {
        HttpResponseMessage response = null;
        // get請求方法
        if (id > 0)
        {
            response = await client.GetAsync($"https://jsonplaceholder.typicode.com/posts/{id}");
            jsondata = await response.Content.ReadAsStringAsync();
            Product returnValue = System.Text.Json.JsonSerializer.Deserialize<Product>(jsondata);
            datalist.Clear();
            datalist.Add(returnValue);
        }
        else
        {
            response = await client.GetAsync("https://jsonplaceholder.typicode.com/posts");
            //狀態碼
            var statusCode = response.EnsureSuccessStatusCode();
            // 序列化，將resulet物件傳換為"字串"
            jsondata = System.Text.Json.JsonSerializer.Serialize(resulet);
            // 用get方法獲取 json資料並以字串的形式儲存
            jsondata = await response.Content.ReadAsStringAsync();
            //字串轉換為json->object，並反序列化
            datalist = System.Text.Json.JsonSerializer.Deserialize<List<Product>>(jsondata);
        }
        return datalist;
    }

    [HttpGet]
    [Route("~/MyApps/{userid}")]
    public async Task<List<Product>> SingleGet(int? userid)

    {
        // userID搜尋
        HttpResponseMessage response = await client.GetAsync($"https://jsonplaceholder.typicode.com/posts/?userId={userid}");
        // 將 response的內容讀取並以字串的形式儲存
        jsondata = await response.Content.ReadAsStringAsync();
        List<Product> returnValue = System.Text.Json.JsonSerializer.Deserialize<List<Product>>(jsondata);
        return returnValue;

    }
    [HttpGet]
    [Route("~/MyApps/IdSearch/{id}")]
    public async Task<Product> IdSearch(int? id)
    {
        // 注意id搜尋是返回單筆資料
        HttpResponseMessage response = await client.GetAsync($"https://jsonplaceholder.typicode.com/posts/{id}");
        // 將 response的內容讀取並以字串的形式儲存
        string jsondata = await response.Content.ReadAsStringAsync();
        // 字串轉換成物件
        Product returnValue = System.Text.Json.JsonSerializer.Deserialize<Product>(jsondata);
        return returnValue;
    }


    [HttpPost]
    [Route("~/MyApps/AllSearch")]
    // [FromBody]='參數繫結' searchValue data='模型繫結/綁定'
    public string AllSearch([FromBody] searchValue data)
    {
        string returndata = System.Text.Json.JsonSerializer.Serialize(_itservice.AllSearch(data.title, data.id, datalist));
        return returndata;
    }

    [HttpPost]
    [Route("~/MyApps/TitleSearch")]
    public async Task<List<Product>> TitleSearch([FromBody] string title)
    {
        // 當datalist沒有資料的時候
        if (datalist.Count == 0)
        {
            List<Product> fildedData = new List<Product>();
            // 以非同步作業的方式，將 GET 要求傳送至指定的 URI，去獲取資料
            HttpResponseMessage response = await client.GetAsync("https://jsonplaceholder.typicode.com/posts");
            //將抓到的HTTP資料內容轉/序列化成字串    
            string data = await response.Content.ReadAsStringAsync();
            // 將字串形式data反序列化成物件
            List<Product> _data = System.Text.Json.JsonSerializer.Deserialize<List<Product>>(data);
            //  Product型別資料序列化成字串(序列化)。
            fildedData = _itservice.TitleSearch(title, _data);
            return fildedData;

        }
        else
        {
            // 當datalist有資料的時候
            List<Product> fildedData = new List<Product>();
            fildedData = _itservice.TitleSearch(title, datalist);
            return fildedData;
        }
        //  Product型別資料序列化成字串(序列化)。

    }



    [HttpPut]
    [Route("~/MyApps/AddData")]
    public List<Product> AddData([FromBody] Product data)
    {
        datalist.Add(data);
        // 因為沒有真的資料庫，所以需要顯示在畫面上
        // return "修改資料成功";
        return datalist;
    }
    [HttpDelete]
    [Route("~/MyApps/DeletData/{id}")]
    public List<Product> DeletData(int id)
    {
        //移除資料
        datalist.Remove(_itservice.IdSearch(id, datalist));
        // return "刪除資料資料成功";
        return datalist;
    }

    [HttpDelete]
    [Route("~/MyApps/DeleteSingleData")]
    public List<Product> DeleteSingleData([FromBody] Product data)
    {
        // id過濾
        // 將id符合的元素刪除。
        datalist.Remove(_itservice.IdSearch(data.id, datalist));
        // 判斷不為空值
        if (data.title != null)
        {
            // title過濾
            foreach (var item in _itservice.TitleSearch(data.title, datalist))
            {
                datalist.Remove(item);
            }

        }

        // userid過濾
        foreach (var item in _itservice.UserIdSearch(data.userId, datalist))
        {
            datalist.Remove(item);
        }

        if (data.body != null)
        {
            foreach (var item in _itservice.BodySearch(data.body, datalist))
            {
                datalist.Remove(item);
            }
        }
        //body過濾
        //移除資料
        // return "刪除資料資料成功";
        return datalist;
    }

}



