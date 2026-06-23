namespace anotaai.Models;

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class LinhaPedidoInput
{
    [Required]
    public int Produto { get; set; }

    [Range(1, int.MaxValue)]
    [Required]
    public int Quantidade { get; set; }

    [Range(0.01, float.MaxValue)]
    [Required]
    public float PrecoUnitario { get; set; }
}
