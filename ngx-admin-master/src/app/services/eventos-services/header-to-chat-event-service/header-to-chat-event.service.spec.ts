import { TestBed, inject } from '@angular/core/testing';

import { HeaderToChatEventService } from './header-to-chat-event.service';

describe('HeaderToChatEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeaderToChatEventService]
    });
  });

  it('should be created', inject([HeaderToChatEventService], (service: HeaderToChatEventService) => {
    expect(service).toBeTruthy();
  }));
});
