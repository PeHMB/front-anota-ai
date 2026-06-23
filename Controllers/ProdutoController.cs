using Microsoft.AspNetCore.Mvc;
using anotaai.Models;
using anotaai.Contexts;

namespace anotaai.Controllers;

[Route("[controller]")]
public class ProdutoController : Controller
{
    [HttpGet("")]
    public IActionResult Index([FromServices] CardapioContext db)
    {
	var produtos = db.Produtos.ToList();
	return View(produtos);
    }
}
