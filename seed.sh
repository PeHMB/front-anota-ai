http --verify=no POST http://localhost:5039/api/produtos \
  nome="Batata frita" \
  descricao="Batata bem frita com sal" \
  preco:=12.00

http --verify=no POST http://localhost:5039/api/produtos \
  nome="Coca-cola 350ml" \
  descricao="Bebida açúcarada" \
  preco:=4.50

http --verify=no POST http://localhost:5039/api/clientes \
  nome="Dona Dalva" \
  cpf="03142331120" \
  endereco="Rua das Flores 1232"

http --verify=no POST http://localhost:5039/api/pedidos \
  Cliente:=1 \
  LinhasPedido:='[{"Produto":1,"Quantidade":2,"PrecoUnitario":12.00}]' \
  Obs="Sal marinho por favor"

# http --verify=no DELETE http://localhost:5039/api/produtos/2
# http --verify=no GET http://localhost:5039/api/produtos
# http --verify=no GET http://localhost:5039/api/pedidos/1
