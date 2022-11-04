
using myApp;
var builder = WebApplication.CreateBuilder(args);
// 服務註冊區
// Add services to the container.
// 將ITservice介面，DataSearch函式僅行註冊。
//  .Net Core 的相依注入有三種留存期，Transient (暫時性)，Scoped (範圍性)，Singleton (單一性)
// 下方式註冊範圍性的服務。
builder.Services.AddScoped<ITservice, DataSearch>();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//   設定policy，用來處理CORS問題， policy.WithOrigins是指允許的路由，'*'=所有路由皆可。
var MyAllowUrl = "_myAllowUrl";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowUrl,
                      policy =>
                      {
                          policy.WithOrigins("*").AllowAnyHeader()
                                                  .AllowAnyMethod();
                      });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseCors(MyAllowUrl);

app.UseAuthorization();

app.MapControllers();

app.Run();
