import { Test, TestingModule } from '@nestjs/testing';
import { BibliotecasLibrosService } from './bibliotecas-libros.service';

describe('BibliotecasLibrosService', () => {
  let service: BibliotecasLibrosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BibliotecasLibrosService],
    }).compile();

    service = module.get<BibliotecasLibrosService>(BibliotecasLibrosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
