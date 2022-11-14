namespace myApp;


public class Product
{
    // 以下皆為屬性
    public int? userId { get; set; }
    public int? id { get; set; }
    public string? title { get; set; }
    public string? body { get; set; }

}

public class searchValue
{
    // 模型繫結
    // 同時搜尋id,title
    // 對應到前端的searchValue的格式
    public int? id { get; set; }
    public string title { get; set; }
    public int? userid { get; set; }
}

public class modifyhValue
{
    // 模型繫結
    // id,Title,userId,Body
    // 對應到前端的modifyValue的格式
    public int? userId { get; set; }
    public int? Id { get; set; }
    public string Title { get; set; }
    public string Body { get; set; }
}