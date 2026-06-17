import { Injectable } from "@nestjs/common";
import { Produto } from "./produto.entity";
import { CreateProdutoDto } from "./dtos/create-produto.dto";
import { UpdateProdutoDto } from "./dtos/update-produto.dto";

@Injectable()
export class ProdutoService {     
    async findAll(): Promise<Produto[]> {
        // return Produto.find({
        //     select: {
        //         id: true,
        //         nome: true,
        //         preco: true,
        //         ativo: true,
        //         criadoEm: true
        //     }
        // });
        return Produto.find({ relations: ['fornecedor'] });
    }

    async findOne(id: number): Promise<Produto | null> {
        return Produto.findOne({
            where: { id },
            relations: ['fornecedor']         
        });
    }

    async create(dados: CreateProdutoDto): Promise<Produto> {
        const produto = Produto.create({ ...dados, fornecedor: { id: dados.fornecedor } });

        return produto.save();
    }

    async update(id: number, dados: UpdateProdutoDto): Promise<Produto | null> {
        const produto = await this.findOne(id);

        if(!produto) {
            return null;
        }

        Object.assign(produto, { ...dados, fornecedor: { id: dados.fornecedor }});

        return produto.save(); 
    }

    async remove(id: number): Promise<Produto | null> {
        const produto = await this.findOne(id);

        if(!produto) {
            return null;
        }

        return produto.remove();
    }
}