namespace anotaai.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class LinhaPedidoModel
{
    public int Id { get; set; }

    [Required]
    public ProdutoModel Produto { get; set; }

    [Range(0.01, int.MaxValue)]
    [Required]
    public int Quantidade { get; set; }

    [Range(0.01, float.MaxValue)]
    [Required]
    public float PrecoUnitario { get; set; }
}
