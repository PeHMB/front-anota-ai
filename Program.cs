using anotaai.Contexts;
using anotaai.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<CardapioContext>(opt => opt.UseInMemoryDatabase("CardapioDb"));
builder.Services.AddValidation();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();


app.MapGet("/hello", () => "Hello world");

/**
 * API Produtos
 */
app.MapGet("/api/produtos", async (CardapioContext db) =>
	   await db.Produtos.ToListAsync());

app.MapGet("/api/produtos/{id}", async (int id, CardapioContext db) =>
	   await db.Produtos.FindAsync(id) is ProdutoModel produto ? Results.Ok(produto) : Results.NotFound());

app.MapPost("/api/produtos", async (ProdutoModel produto, CardapioContext db) =>
{
    db.Produtos.Add(produto);
    await db.SaveChangesAsync();

    return Results.Created($"/api/produtos/{produto.Id}", produto);
});

app.MapDelete("/api/produtos/{id}", async (int id, CardapioContext db) =>
{
    if (await db.Produtos.FindAsync(id) is ProdutoModel produto)
    {
        db.Produtos.Remove(produto);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }

    return Results.NotFound();
});

/**
 * API Clientes
 */
app.MapGet("/api/clientes", async (CardapioContext db) =>
	   await db.Clientes.ToListAsync());

app.MapGet("/api/clientes/{id}", async (int id, CardapioContext db) =>
	   await db.Clientes.FindAsync(id) is ClienteModel cliente ? Results.Ok(cliente) : Results.NotFound());

app.MapDelete("/api/clientes/{id}", async (int id, CardapioContext db) =>
{
    if (await db.Clientes.FindAsync(id) is ClienteModel cliente)
    {
        db.Clientes.Remove(cliente);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }

    return Results.NotFound();
});

app.MapPost("/api/clientes", async (ClienteModel cliente, CardapioContext db) =>
{
    db.Clientes.Add(cliente);
    await db.SaveChangesAsync();

    return Results.Created($"/api/clientes/{cliente.Id}", cliente);
});

/**
 * API Pedidos
 */
app.MapGet("/api/pedidos", async (CardapioContext db) => {
    var pedidos = await db.Pedidos
	.Include(p => p.Cliente)
	.Include(p => p.LinhasPedido)
	.ThenInclude(l => l.Produto)
	.ToListAsync();

    return Results.Ok(pedidos);
});

app.MapGet("/api/pedidos/{id}", async (int id, CardapioContext db) => {
    var pedido = await db.Pedidos
	.Include(p => p.Cliente)
	.Include(p => p.LinhasPedido)
	.ThenInclude(l => l.Produto)
	.FirstOrDefaultAsync(p => p.Id == id);
    return pedido is not null ? Results.Ok(pedido) : Results.NotFound();
});

app.MapPost("/api/pedidos", async (PedidoInput pedidoInput, CardapioContext db) =>
{
    var cliente = await db.Clientes.FindAsync(pedidoInput.Cliente);
    if (cliente is null)
        return Results.NotFound("Client not found");

    var linhasPedido = new List<LinhaPedidoModel>();
    foreach (var l in pedidoInput.LinhasPedido)
    {
	var produto = await db.Produtos.FindAsync(l.Produto);
	if (produto is null)
	    return Results.NotFound($"Product {l.Produto} not found");

	linhasPedido.Add(new LinhaPedidoModel
	{
	    Produto = produto,
	    Quantidade = l.Quantidade,
	    PrecoUnitario = l.PrecoUnitario
	});
    }

    var pedido = new PedidoModel
    {
        Cliente = cliente,
        LinhasPedido = linhasPedido,
        Obs = pedidoInput.Obs,
    };

    db.Pedidos.Add(pedido);
    await db.SaveChangesAsync();

    return Results.Created($"/api/pedidos/{pedido.Id}", pedido);
});

app.MapDelete("/api/pedidos/{id}", async (int id, CardapioContext db) =>
{
    if (await db.Pedidos.FindAsync(id) is PedidoModel pedido)
    {
        db.Pedidos.Remove(pedido);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }

    return Results.NotFound();
});

app.Run();
