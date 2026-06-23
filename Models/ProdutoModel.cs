namespace anotaai.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ProdutoModel
{
    public int Id { get; set; }
    
    [StringLength(60, MinimumLength = 3)]
    [Required]
    public string Nome { get; set; }

    [StringLength(200, MinimumLength = 3)]
    public string? Descricao { get; set; }

    [Range(0.01, float.MaxValue)]
    [Required]
    public float Preco { get; set; }
}
