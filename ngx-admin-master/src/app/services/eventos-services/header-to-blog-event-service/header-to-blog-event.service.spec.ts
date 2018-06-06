import { TestBed, inject } from '@angular/core/testing';

import { HeaderToBlogEventService } from './header-to-blog-event.service';

describe('HeaderToBlogEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeaderToBlogEventService]
    });
  });

  it('should be created', inject([HeaderToBlogEventService], (service: HeaderToBlogEventService) => {
    expect(service).toBeTruthy();
  }));
});
