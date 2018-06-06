import { TestBed, inject } from '@angular/core/testing';

import { ViewBlogEventService } from './view-blog-event.service';

describe('ViewBlogEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewBlogEventService]
    });
  });

  it('should be created', inject([ViewBlogEventService], (service: ViewBlogEventService) => {
    expect(service).toBeTruthy();
  }));
});
