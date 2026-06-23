using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using anotaai.Models;
using anotaai.Contexts;

namespace anotaai.Controllers;

public class HomeController : Controller
{
    public IActionResult Index([FromServices] CardapioContext db)
    {
	var produtos = db.Produtos.ToList();
        return View(produtos);
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
