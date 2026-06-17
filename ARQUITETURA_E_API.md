# Guia de Transição: Refatoração da API para C# (.NET Core)

Este documento foi elaborado para auxiliar na migração do backend deste sistema (atualmente em NestJS com TypeScript/TypeORM) para **C# (ASP.NET Core Web API com Entity Framework Core)**.

---

## 1. Visão Geral da Arquitetura Atual

A aplicação utiliza um modelo híbrido MVC/API:
* **Frontend (Visualização)**: Desenvolvido em HTML/CSS/JS com templates **EJS (Embedded JavaScript)** integrados ao NestJS. As requisições dinâmicas das novas telas utilizam a API REST através do serviço [api.js](file:///d:/IFRO/Projeto%20PABD/front-anota-ai/public/js/services/api.js).
* **Backend (API/Servidor)**: Desenvolvido em NestJS. Ele se conecta a um banco MySQL local (`pw2_app_web`) e disponibiliza endpoints que retornam views HTML ou dados JSON.

---

## 2. Mapeamento de Banco de Dados (TypeORM para EF Core)

No C#, o correspondente ao **TypeORM** é o **Entity Framework Core (EF Core)**. Abaixo está a modelagem conceitual das classes C# para as tabelas do banco de dados MySQL, baseadas nas entidades TypeScript atuais.

### 2.1 Fornecedor (`fornecedores`)
Mapeamento direto a partir do módulo `fornecedor.entity.ts`.

```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("fornecedores")]
public class Fornecedor
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [StringLength(14)] // CPF ou CNPJ
    public string CpfCnpj { get; set; } = string.Empty;

    public bool Ativo { get; set; } = true;

    [Column("criado_em")]
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

    [Column("atualizado_em")]
    public DateTime? AtualizadoEm { get; set; }

    // Relacionamento 1-N (Opcional para navegação)
    public ICollection<Produto> Produtos { get; set; } = new List<Produto>();
}
```

### 2.2 Produto (`produtos`)
Mapeamento a partir do módulo `produto.entity.ts`.

```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("produtos")]
public class Produto
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [StringLength(120)]
    public string Nome { get; set; } = string.Empty;

    public string? Descricao { get; set; }

    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal Preco { get; set; }

    public bool Ativo { get; set; } = true;

    [Column("criado_em")]
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

    [Column("atualizado_em")]
    public DateTime? AtualizadoEm { get; set; }

    // Relacionamento com Fornecedor (N-1)
    [Column("fornecedor_id")]
    public int FornecedorId { get; set; }

    [ForeignKey("FornecedorId")]
    public Fornecedor Fornecedor { get; set; } = null!;
}
```

### 2.3 Novas Tabelas Necessárias para o Cardápio (Entidades a Criar)
Estas tabelas devem ser modeladas para persistir as ações do carrinho de compras e controle do Kanban de vendas:

* **Categoria (`categorias`)**:
  * `Id` (Int, PK)
  * `Nome` (Varchar)
* **Pedido (`pedidos`)**:
  * `Id` (Int, PK)
  * `Data` (DateTime)
  * `Status` (Varchar: "pendente", "preparo", "pronto", "entregue")
  * `Total` (Decimal)
  * `FormaPagamento` (Varchar)
  * `ClienteNome` (Varchar - se não houver cadastro de usuário completo)
* **ItemPedido (`itens_pedido`)**:
  * `Id` (Int, PK)
  * `PedidoId` (Int, FK)
  * `ProdutoId` (Int, FK)
  * `Quantidade` (Int)
  * `PrecoUnitario` (Decimal)

---

## 3. Mapeamento de Controladores e Endpoints (Web API)

O arquivo JavaScript do frontend ([api.js](file:///d:/IFRO/Projeto%20PABD/front-anota-ai/public/js/services/api.js)) espera encontrar as seguintes rotas na API REST. Ela poderá implementar esses endpoints utilizando **Controllers** no ASP.NET:

### 3.1 Produtos Controller (`[Route("api/produtos")]`)

| Método HTTP | Endpoint | Objetivo | Parâmetros | Retorno Esperado (JSON) |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/produtos` | Listar todos os produtos | - | Lista de objetos Produto |
| **GET** | `/api/produtos/{id}` | Obter detalhes de um produto | `id` (na rota) | Objeto Produto específico |
| **POST** | `/api/produtos` | Cadastrar novo produto | Body (JSON) com dados do produto | Produto criado |
| **PUT** | `/api/produtos/{id}` | Atualizar produto existente | `id` na rota, Body com dados novos | Produto atualizado |
| **DELETE** | `/api/produtos/{id}` | Remover produto do catálogo | `id` na rota | Status 204 (No Content) |

### 3.2 Pedidos Controller (`[Route("api/pedidos")]`)

| Método HTTP | Endpoint | Objetivo | Parâmetros | Retorno Esperado (JSON) |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/pedidos` | Listar todos os pedidos (para o Kanban) | - | Lista de todos os Pedidos e seus Itens |
| **POST** | `/api/pedidos` | Criar novo pedido (finalizar checkout) | Body (JSON) com Itens e Forma de Pagamento | Objeto do Pedido criado |
| **PATCH** | `/api/pedidos/{id}/status` | Alterar status (transição no Kanban) | `id` na rota, Body: `{ "status": "preparo" }` | Pedido atualizado |
| **GET** | `/api/pedidos/{id}/acompanhar` | Acompanhar status em tempo real | `id` na rota | Status atual e tempo estimado |

---

## 4. Autenticação (JWT)

A integração cliente-side em [api.js](file:///d:/IFRO/Projeto%20PABD/front-anota-ai/public/js/services/api.js) lê o token de autenticação do `localStorage` com a chave `thb_token`.
* No C#, ela deve configurar o serviço de autenticação JWT no `Program.cs` (`builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)`).
* O token gerado no login deve ser devolvido no formato:
  ```json
  {
      "token": "seu-jwt-token-aqui",
      "usuario": { "nome": "Administrador", "tipo": "admin" }
  }
  ```
* O frontend passará este token em todas as chamadas subsequentes no header:
  `Authorization: Bearer <seu-jwt-token-aqui>`. No C#, ela poderá proteger os métodos usando o atributo `[Authorize]`.
