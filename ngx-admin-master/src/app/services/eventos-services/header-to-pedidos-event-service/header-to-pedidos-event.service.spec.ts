import { TestBed, inject } from '@angular/core/testing';

import { HeaderToPedidosEventService } from './header-to-pedidos-event.service';

describe('HeaderToPedidosEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeaderToPedidosEventService]
    });
  });

  it('should be created', inject([HeaderToPedidosEventService], (service: HeaderToPedidosEventService) => {
    expect(service).toBeTruthy();
  }));
});
