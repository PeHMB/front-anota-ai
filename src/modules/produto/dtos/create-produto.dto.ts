import { Type, Transform } from "class-transformer";
import { IsNotEmpty, MinLength, IsNumber, Min, IsOptional, IsString } from "class-validator";



const toDecimalNumber = (value: unknown): unknown => {
  const normalizedValue: unknown = Array.isArray(value)
    ? (value as unknown[])[value.length - 1]
    : value;

  if (typeof normalizedValue === 'string') {
    return Number(normalizedValue.replace(',', '.'));
  }

  return normalizedValue;
};

export class CreateProdutoDto {

  @IsNotEmpty({ message: 'O campo nome é obrigatório'})
  @MinLength(5, { message: 'O nome deve ter no mínimo 5 caracteres' })
  nome!: string;

  @IsOptional()
  @IsString()
  descricao!: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O valor deve ter no máximo 2 casas decimais' })
  @Transform(({ value }) => toDecimalNumber(value))
  @Min(0.01, { message: 'O preço deve no mínimo R$ 0,01'})
  preco!: number;

  @IsNotEmpty({ message: 'O campo nome é obrigatório'})
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  fornecedor: number;
}