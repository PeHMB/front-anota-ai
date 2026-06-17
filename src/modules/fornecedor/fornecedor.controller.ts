import { Body, Controller, Get, Post, Redirect, Render, Param, HttpCode } from "@nestjs/common";
import { FornecedorService } from "./fornecedor.service";

@Controller('fornecedores')
export class FornecedorController {

    constructor(private fornecedorService: FornecedorService) {}

    @Get()
    @Render('fornecedor/inicial')
    async inicial(): Promise<object> {
        const fornecedores = await this.fornecedorService.findAll();

        return {
            titulo: 'Consulta de Fornecedores',
            fornecedores
        }
    }
}
