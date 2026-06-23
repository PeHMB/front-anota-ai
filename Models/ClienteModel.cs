namespace anotaai.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ClienteModel
{
    public int Id { get; set; }
    
    [StringLength(60, MinimumLength = 3)]
    [Required]
    public string Nome { get; set; }

    [StringLength(11, MinimumLength = 11)]
    [Required]
    public string Cpf { get; set; }

    [StringLength(200, MinimumLength = 3)]
    [Required]
    public string Endereco { get; set; }
}
