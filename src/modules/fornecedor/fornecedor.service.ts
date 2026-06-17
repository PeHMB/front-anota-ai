import { Injectable } from "@nestjs/common";
import { Fornecedor } from "./fornecedor.entity";

@Injectable()
export class FornecedorService {     
    async findAll(): Promise<Fornecedor[]> {
        return Fornecedor.find();
    }
}