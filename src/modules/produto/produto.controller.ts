import { Body, Controller, Get, Post, Redirect, Render, Param, HttpCode } from "@nestjs/common";
import { ProdutoService } from "./produto.service";
import { ValidationView, toBoolean } from 'nest-validation-view';
import { CreateProdutoDto } from "./dtos/create-produto.dto";
import { UpdateProdutoDto } from "./dtos/update-produto.dto";
import { FornecedorService } from "../fornecedor/fornecedor.service";

@Controller('produtos')
export class ProdutoController {

    constructor(
        private produtoService: ProdutoService,
        private fornecedorService: FornecedorService
    ) {}

    @Get()
    @Render('produto/inicial')
    async inicial(): Promise<object> {
        const listaProdutos = await this.produtoService.findAll();

        return {
            titulo: 'Consulta de Produtos',
            produtos: listaProdutos
        }
    }

    @Get('criar')
    @Render('produto/formulario')
    async formularioCriar(): Promise<object> {
        const fornecedores = await this.fornecedorService.findAll();

        return {
            titulo: 'Novo produto',
            fornecedores,
        };
    }

    @Post('criar')
    @Redirect('/produtos')
    @ValidationView('produto/formulario', ({ request, errors }) => ({
        produto: {
          ...request.body
        },
        errors,
      }))
    async formularioCriarSalvar(@Body() dados: CreateProdutoDto): Promise<void> {
        await this.produtoService.create(dados);
    }

    @Get(':id/editar')
    @Render('produto/formulario')
    async formEditar(@Param('id') id: number): Promise<object> {
        const produto = await this.produtoService.findOne(id);
        const fornecedores = await this.fornecedorService.findAll();

        if(!produto) {
            throw new Error('Produto não encontrado!');            
        }
        
        return {
            titulo: 'Edição de Produto',
            subtitulo: `Atualização do produto: ${produto.nome}`,
            produto,
            fornecedores,
        };
    }

    @Post(':id/editar')
    @Redirect('/produtos')
    @ValidationView('produto/formulario', ({ request, errors }) => ({
        produto: {
          id: request.params.id,
          ...request.body
        },
        errors,
      }))
    async formEditarSalvar(@Param('id') id: number, @Body() dados: UpdateProdutoDto): Promise<void>{
        await this.produtoService.update(id, dados);
    }

    @Get(':id/excluir')
    @Render('produto/remover')
    async formExcluir(@Param('id') id: number): Promise<object> {
        const produto = await this.produtoService.findOne(id);

        if(!produto) {
            throw new Error('Produto não encontrado!');            
        }
        
        return {
            titulo: 'Exclusão de Produto',
            subtitulo: `Exclusão de produto: ${produto.nome}`,
            produto,
        };
    }

    @Post(':id/excluir')
    @Redirect('/produtos')
    async formExcluirSalvar(@Param('id') id: number): Promise<void>{
        await this.produtoService.remove(id);
    }

    @Post(':id/remover')
    @HttpCode(204)
    async remove(@Param('id') id: number): Promise<void>{
        await this.produtoService.remove(id);
    }
}