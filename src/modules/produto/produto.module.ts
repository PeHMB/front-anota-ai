import { Module } from "@nestjs/common";
import { ProdutoController } from "./produto.controller";
import { ProdutoService } from "./produto.service";
import { FornecedorService } from "../fornecedor/fornecedor.service";

@Module({
    imports: [],
    controllers: [ProdutoController],
    providers: [ProdutoService, FornecedorService],
})
export class ProdutoModule {}