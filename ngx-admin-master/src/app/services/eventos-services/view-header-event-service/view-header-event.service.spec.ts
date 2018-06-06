import { TestBed, inject } from '@angular/core/testing';

import { ViewHeaderEventService } from './view-header-event.service';

describe('ViewHeaderEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewHeaderEventService]
    });
  });

  it('should be created', inject([ViewHeaderEventService], (service: ViewHeaderEventService) => {
    expect(service).toBeTruthy();
  }));
});
