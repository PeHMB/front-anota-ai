namespace anotaai.Models;

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class PedidoModel
{
    public int Id { get; set; }
    
    [Required]
    public ClienteModel Cliente { get; set; }

    [MinLength(1)]
    [Required]
    public List<LinhaPedidoModel> LinhasPedido { get; set; }

    [StringLength(200, MinimumLength = 3)]
    public string? Obs { get; set; }

    public double ValorTotal() {
	var total = 0.0;
	foreach (var l in LinhasPedido)
	{
	    total += l.PrecoUnitario;
	}
	return total;
    }
}
