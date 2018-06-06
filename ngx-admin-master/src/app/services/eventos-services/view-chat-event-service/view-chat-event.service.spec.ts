import { TestBed, inject } from '@angular/core/testing';

import { ViewChatEventService } from './view-chat-event.service';

describe('ViewChatEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewChatEventService]
    });
  });

  it('should be created', inject([ViewChatEventService], (service: ViewChatEventService) => {
    expect(service).toBeTruthy();
  }));
});
