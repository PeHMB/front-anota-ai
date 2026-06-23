using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using anotaai.Models;
using anotaai.Contexts;

namespace anotaai.Controllers;

[Route("[controller]")]
public class PedidoController : Controller
{
    [HttpGet("")]
    public IActionResult Index([FromServices] CardapioContext db)
    {
	var pedidos = db.Pedidos.Include(p => p.Cliente).Include(p => p.LinhasPedido).ThenInclude(l => l.Produto).ToList();
	return View(pedidos);
    }
}
