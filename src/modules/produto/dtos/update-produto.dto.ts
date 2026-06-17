import { CreateProdutoDto } from "./create-produto.dto";
import { IsBoolean, IsNotEmpty } from "class-validator";
import { Transform } from "class-transformer";
import { toBoolean } from 'nest-validation-view';

export class UpdateProdutoDto extends CreateProdutoDto {

  @IsBoolean()
  @IsNotEmpty({ message: 'O campo ativo é obrigatório'})
  @Transform(({ value }) => toBoolean(value, true))
  ativo!: boolean;

}