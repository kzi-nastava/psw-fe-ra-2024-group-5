import { TestBed } from '@angular/core/testing';

import { TourCardService } from './tour-card.service';

describe('TourTouristService', () => {
  let service: TourCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
