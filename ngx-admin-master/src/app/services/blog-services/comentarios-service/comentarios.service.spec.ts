import { TestBed, inject } from '@angular/core/testing';

import { ComentariosService } from './comentarios.service';

describe('ComentariosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComentariosService]
    });
  });

  it('should be created', inject([ComentariosService], (service: ComentariosService) => {
    expect(service).toBeTruthy();
  }));
});
