import { TestBed } from '@angular/core/testing';

import { UserRewardService } from './user-reward.service';

describe('UserRewardService', () => {
  let service: UserRewardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRewardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
