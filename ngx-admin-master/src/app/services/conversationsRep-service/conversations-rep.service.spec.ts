import { TestBed, inject } from '@angular/core/testing';

import { ConversationsRepService } from './conversations-rep.service';

describe('ConversationsRepService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConversationsRepService]
    });
  });

  it('should be created', inject([ConversationsRepService], (service: ConversationsRepService) => {
    expect(service).toBeTruthy();
  }));
});
