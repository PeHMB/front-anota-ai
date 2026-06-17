import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('inicial')
  getHello(): object {
    const pessoas = [
      { nome: 'João Teixeira', email: 'joao.teixeira@ifro.edu.br' },
      { nome: 'Reinaldo Pereira', email: 'reinaldo.pereira@ifro.edu.br' },
      { nome: 'Jackson Henrique', email: 'jackson.henrique@ifro.edu.br' },
      { nome: 'Elias Abreu', email: 'elias.abreu@ifro.edu.br' },
      { nome: 'Clayton Andrade', email: 'clayton.andrade@ifro.edu.br' },
      { nome: 'Geilson Guardia', email: 'gleison.guardia@ifro.edu.br' },
    ];

    return {
      titulo: 'AppWeb com NestJs',
      horaAgora: new Date().toLocaleString('pt-BR'),
      listaPessoas: pessoas,
    };
  }

  @Get('sobre')
  @Render('_sobre')
  getSobre(): object {
    return {
      titulo: 'Seção de informações do sistema web.',
    };
  }

  @Get('login')
  @Render('autenticacao/login')
  login(): object {
    return { layout: false };
  }

  @Get('cardapio')
  @Render('cardapio')
  cardapio(): object {
    return { layout: false };
  }

  @Get('admin/pedidos')
  @Render('admin/pedidos')
  adminPedidos(): object {
    return {
      titulo: 'Gestão de Pedidos',
    };
  }
}
