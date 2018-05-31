import { TestBed, inject } from '@angular/core/testing';

import { ConversationsCliService } from './conversations-cli.service';

describe('ConversationsCliService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConversationsCliService]
    });
  });

  it('should be created', inject([ConversationsCliService], (service: ConversationsCliService) => {
    expect(service).toBeTruthy();
  }));
});
