namespace anotaai.Models;

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class PedidoInput
{
    [Required]
    public int Cliente { get; set; }

    [Required]
    [MinLength(1)]
    public List<LinhaPedidoInput> LinhasPedido { get; set; }

    [StringLength(200, MinimumLength = 3)]
    public string? Obs { get; set; }
}
