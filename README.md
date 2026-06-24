
```markdown
# 🍔 DiscaAí — API de Gerenciamento de Cardápio e Pedidos

API REST desenvolvida em **ASP.NET Core** (C#) com **Minimal APIs** e **Entity Framework Core**, voltada para o gerenciamento de produtos, clientes e pedidos de um estabelecimento comercial.

---

## 📋 Sobre o Projeto

A **DiscaAí** é uma API que digitaliza o fluxo de pedidos de um estabelecimento. Ela permite:

- 📦 **Cadastrar produtos** do cardápio
- 👤 **Cadastrar clientes**
- 🧾 **Criar pedidos** associando um cliente a múltiplos produtos (com quantidades e preços)
- 🔍 **Listar, buscar e excluir** registros de todas as entidades

A API pode ser consumida por:
- Aplicativos **mobile** (garçom ou cliente montando o pedido)
- Sistemas **web** de painel administrativo
- **Serviços externos** de delivery ou PDV

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Descrição |
|---|---|
| **C# / .NET** | Linguagem e plataforma de desenvolvimento |
| **ASP.NET Core Minimal APIs** | Abordagem enxuta para definição de endpoints |
| **Entity Framework Core** | ORM para acesso a dados |
| **InMemory Database** | Banco de dados em memória (`"CardapioDb"`) para desenvolvimento e testes |
| **Data Annotations + Validation** | Validação de dados nos modelos |
| **HTTPS Redirection / HSTS** | Segurança de transporte |

---

## 📁 Estrutura do Projeto

```
DiscaAí/
├── Models/              # Classes de domínio (entidades)
│   ├── ProdutoModel.cs
│   ├── ClienteModel.cs
│   ├── PedidoModel.cs
│   └── LinhaPedidoModel.cs
├── Contexts/            # Contexto do Entity Framework
│   └── CardapioContext.cs
├── DTOs/                # Objetos de transferência de dados
│   └── PedidoInput.cs
├── Controllers/         # Controllers MVC (interface web complementar)
├── Views/               # Views MVC
├── Program.cs           # Ponto de entrada + definição de todos os endpoints
└── appsettings.json     # Configurações da aplicação
```

### Camadas e Comunicação

```
Requisição HTTP → Endpoint (Program.cs) → CardapioContext (EF Core) → Banco em Memória
                                                         ↓
                                                 Models / DTOs
```

- **Models:** representam as entidades persistidas no banco
- **DTOs:** definem a estrutura dos dados recebidos nas requisições (ex: `PedidoInput`)
- **Context:** ponte entre a aplicação e o banco via EF Core
- **Endpoints:** recebem a requisição, executam a lógica e retornam a resposta em JSON

---

## 🚀 Como Executar

### Pré-requisitos

- [.NET SDK 8.0+](https://dotnet.microsoft.com/download)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/discaai.git

# 2. Entre na pasta do projeto
cd discaai

# 3. Restaure as dependências
dotnet restore

# 4. Execute o projeto
dotnet run
```

A API estará disponível em:

```
[https://localhost:{PORTA}](http://localhost:5039
)
```

> ⚠️ **Atenção:** por usar banco em memória, **todos os dados são perdidos** quando a aplicação é reiniciada.

### Verificar funcionamento

```http
http://localhost:5039/hello
```

Resposta esperada: `"Hello world"`

---

## 📡 Endpoints da API

Base URL: `http://localhost:5039`

### Produtos

| Método | Endpoint | Descrição | Corpo (JSON) | Resposta |
|---|---|---|---|---|
| `GET` | `/api/produtos` | Lista todos os produtos | — | `200 OK` |
| `GET` | `/api/produtos/{id}` | Busca produto por ID | — | `200 OK` / `404 Not Found` |
| `POST` | `/api/produtos` | Cria um novo produto | `{ "nome": "...", "preco": 0.0, ... }` | `201 Created` |
| `DELETE` | `/api/produtos/{id}` | Exclui um produto | — | `204 No Content` / `404` |

### Clientes

| Método | Endpoint | Descrição | Corpo (JSON) | Resposta |
|---|---|---|---|---|
| `GET` | `/api/clientes` | Lista todos os clientes | — | `200 OK` |
| `GET` | `/api/clientes/{id}` | Busca cliente por ID | — | `200 OK` / `404 Not Found` |
| `POST` | `/api/clientes` | Cria um novo cliente | `{ "nome": "...", "telefone": "...", ... }` | `201 Created` |
| `DELETE` | `/api/clientes/{id}` | Exclui um cliente | — | `204 No Content` / `404` |

### Pedidos

| Método | Endpoint | Descrição | Corpo (JSON) | Resposta |
|---|---|---|---|---|
| `GET` | `/api/pedidos` | Lista todos os pedidos (com cliente e itens) | — | `200 OK` |
| `GET` | `/api/pedidos/{id}` | Busca pedido por ID (com cliente e itens) | — | `200 OK` / `404` |
| `POST` | `/api/pedidos` | Cria um novo pedido | Ver exemplo abaixo | `201 Created` / `404` |
| `DELETE` | `/api/pedidos/{id}` | Exclui um pedido | — | `204 No Content` / `404` |

---

## 📝 Exemplos de Uso

### Criar um produto

```http
POST /api/produtos
Content-Type: application/json

{
  "nome": "X-Burger",
  "preco": 25.0,
  "descricao": "Hambúrguer artesanal"
}
```

### Criar um cliente

```http
POST /api/clientes
Content-Type: application/json

{
  "nome": "João Silva",
  "telefone": "11999999999",
  "email": "joao@email.com"
}
```

### Criar um pedido

```http
POST /api/pedidos
Content-Type: application/json

{
  "cliente": 1,
  "linhasPedido": [
    {
      "produto": 1,
      "quantidade": 2,
      "precoUnitario": 25.0
    },
    {
      "produto": 2,
      "quantidade": 1,
      "precoUnitario": 10.0
    }
  ],
  "obs": "Sem cebola"
}
```

> 💡 O campo `cliente` e `produto` dentro de `linhasPedido` referenciam os **IDs** dos registros já cadastrados. A API valida se eles existem antes de criar o pedido.

### Resposta do pedido criado (201 Created)

```json
{
  "id": 1,
  "cliente": {
    "id": 1,
    "nome": "João Silva",
    "telefone": "11999999999",
    "email": "joao@email.com"
  },
  "linhasPedido": [
    {
      "produto": { "id": 1, "nome": "X-Burger", "preco": 25.0 },
      "quantidade": 2,
      "precoUnitario": 25.0
    },
    {
      "produto": { "id": 2, "nome": "Refrigerante", "preco": 10.0 },
      "quantidade": 1,
      "precoUnitario": 10.0
    }
  ],
  "obs": "Sem cebola"
}
```

### Tratamento de erros

| Cenário | Código | Mensagem |
|---|---|---|
| Cliente não encontrado ao criar pedido | `404` | `"Client not found"` |
| Produto não encontrado ao criar pedido | `404` | `"Product {id} not found"` |
| Recurso não encontrado por ID | `404` | — |

---

## 🏗️ Lógica de Criação de Pedidos

O endpoint `POST /api/pedidos` é o mais elaborado da API. Seu fluxo é:

1. **Recebe** um `PedidoInput` (DTO) — não o `PedidoModel` diretamente
2. **Busca o cliente** pelo ID informado → se não existir, retorna `404 "Client not found"`
3. **Percorre cada linha do pedido** e busca o produto correspondente → se não existir, retorna `404 "Product {id} not found"`
4. **Monta o grafo de objetos** — `PedidoModel` com `Cliente` e lista de `LinhaPedidoModel` (cada uma com seu `Produto`)
5. **Salva no banco** via `SaveChangesAsync()`
6. **Retorna** `201 Created` com o pedido completo

Nos endpoints de listagem (`GET /api/pedidos`), os dados relacionados são carregados com:

```csharp
.Include(p => p.Cliente)
.Include(p => p.LinhasPedido)
.ThenInclude(l => l.Produto)
```

Isso garante que o JSON retornado já venha com **cliente, linhas e produtos aninhados**.

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).
```

