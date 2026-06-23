using Microsoft.AspNetCore.Mvc;
using anotaai.Models;
using anotaai.Contexts;

namespace anotaai.Controllers;

[Route("[controller]")]
public class ClienteController : Controller
{
    [HttpGet("")]
    public IActionResult Index([FromServices] CardapioContext db)
    {
	var clientes = db.Clientes.ToList();
	return View(clientes);
    }
}
