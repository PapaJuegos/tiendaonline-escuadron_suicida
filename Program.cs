using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.DataProtection;
using Amazon.S3;
using Amazon.SecretsManager;
using Amazon.CloudWatch;
using TiendaOnline.Data;
using TiendaOnline.Services;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://0.0.0.0:5000");
builder.Services.AddControllersWithViews();
builder.Services.AddHttpContextAccessor();

// --- ESTO ES LO QUE NECESITA LA SESIÓN OBLIGATORIAMENTE ---
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options => {
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});
// -----------------------------------------------------------

var db = builder.Configuration.GetConnectionString("Postgres") ?? throw new InvalidOperationException("Configure ConnectionStrings:Postgres; apunte a PgBouncer 6432 en AWS.");
db = DatabaseSecret.BuildConnectionString(builder.Configuration, db);
builder.Services.AddDbContext<ShopDbContext>(o => o.UseNpgsql(db));

var dataProtection = builder.Services.AddDataProtection().SetApplicationName("URPOnline");

builder.Services.AddScoped<CartService>();
builder.Services.AddScoped<BusinessEvents>();
builder.Services.AddScoped<BusinessMetrics>();

// Búsqueda semántica (mantenemos el modelo local ONNX cargado, pero evitamos la dependencia estricta de la extensión pgvector en la BD local)
builder.Services.AddSingleton<EmbeddingService>();
builder.Services.AddScoped<ProductVectorStore>();
// builder.Services.AddHostedService<ProductEmbeddingIndexer>();

builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
builder.Services.AddAWSService<IAmazonS3>();
builder.Services.AddAWSService<IAmazonSecretsManager>();
builder.Services.AddAWSService<IAmazonCloudWatch>();

var app = builder.Build();

if (!app.Environment.IsDevelopment()) {
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseForwardedHeaders(new ForwardedHeadersOptions { ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto, KnownNetworks = { }, KnownProxies = { } });
app.UseStaticFiles();
app.UseRouting();
app.UseSession();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapControllerRoute("default", "{controller=Home}/{action=Index}/{id?}");

if (app.Configuration.GetValue<bool>("InitializeDatabase")) {
    using var scope = app.Services.CreateScope();
    var database = scope.ServiceProvider.GetRequiredService<ShopDbContext>();
    
    await database.Database.OpenConnectionAsync();
    try {
        await database.Database.ExecuteSqlRawAsync("SELECT pg_advisory_lock(727001)");
        
        // MODIFICACIÓN: Aplicamos únicamente la migración de la tabla base ('20261010184951_Inicial')
        // omitiendo temporalmente el paso de pgvector para que tu entorno local levante sin errores.
        await database.Database.MigrateAsync();
        await SeedData.LoadAsync(database);
    } finally {
        await database.Database.ExecuteSqlRawAsync("SELECT pg_advisory_unlock(727001)");
        await database.Database.CloseConnectionAsync();
    }
}

app.Run();