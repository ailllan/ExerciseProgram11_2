namespace myApp;


public interface ITservice
{
    public List<Product> UserIdSearch(int? userid, List<Product> jsondata);
    public Product IdSearch(int? id, List<Product> jsondata);
    public Product TitleSearch(string title, List<Product> jsondata);
    public List<Product> BodySearch(string body, List<Product> jsondata);

    public List<Product> AllSearch(string title, int? id, List<Product> jsondata);
}

public class DataSearch : ITservice
{
    public Product IdSearch(int? id, List<Product> jsondata)
    {
        Product retrurnvale = null;
        foreach (var item in jsondata)
        {
            if (item.id == id)
            {
                retrurnvale = item;
                break;
            }
        }

        return retrurnvale;
    }
    public Product TitleSearch(string title, List<Product> jsondata)
    {
        Product retrurnvale = null;
        foreach (var item in jsondata)
        {
            // 判斷是否包含title
            if (item.title.Contains(title))
            {
                retrurnvale = item;
                break;
            }
        }
        return retrurnvale;
    }
    public List<Product> AllSearch(string title, int? id, List<Product> jsondata)
    {
        List<Product> retrurnvale = new List<Product>();
        foreach (var item in jsondata)
        {
            // 判斷是否包含title
            if (item.title.Contains(title) || item.id == id)
            {
                retrurnvale.Add(item);

            }
        }
        return retrurnvale;
    }

    public List<Product> UserIdSearch(int? userid, List<Product> jsondata)
    {
        List<Product> retrurnvale = new List<Product>();
        foreach (var item in jsondata)
        {
            if (item.userId == userid)
            {
                retrurnvale.Add(item);
            }
        }

        return retrurnvale;
    }
    public List<Product> BodySearch(string body, List<Product> jsondata)
    {
        List<Product> retrurnvale = new List<Product>();
        foreach (var item in jsondata)
        {
            if (item.body == body)
            {
                retrurnvale.Add(item);
            }
        }
        return retrurnvale;
    }

}


