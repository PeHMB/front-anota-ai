using Microsoft.AspNetCore.Mvc;
using anotaai.Models;
using anotaai.Contexts;
using Microsoft.EntityFrameworkCore;

namespace anotaai.Controllers;

[Route("[controller]")]
public class ProdutoController : Controller
{
    private readonly CardapioContext _context;

    public ProdutoController(CardapioContext context)
    {
        _context = context;
    }

    [HttpGet("")]
    public IActionResult Index()
    {
        var produtos = _context.Produtos.ToList();
        return View(produtos);
    }


    [HttpGet("Edit/{id}")]
    public async Task<IActionResult> Edit(int id)
    {
        var produto = await _context.Produtos.FindAsync(id);
        if (produto == null)
            return NotFound();

        return View(produto);
    }

    [HttpPost("Edit/{id}")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, ProdutoModel produto)
    {
        if (id != produto.Id)
            return NotFound();

        if (ModelState.IsValid)
        {
            _context.Update(produto);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        return View(produto);
    }
}
