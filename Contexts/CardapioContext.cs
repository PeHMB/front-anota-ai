namespace anotaai.Contexts;

using Models;
using Microsoft.EntityFrameworkCore;

public class CardapioContext : DbContext
{
    public CardapioContext(DbContextOptions<CardapioContext> options)
        : base(options) { }

    public DbSet<ProdutoModel> Produtos => Set<ProdutoModel>();
    public DbSet<ClienteModel> Clientes => Set<ClienteModel>();
    public DbSet<PedidoModel> Pedidos => Set<PedidoModel>();
}
