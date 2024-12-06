import { TestBed } from '@angular/core/testing';

import { CouponFormService } from './coupon-form.service';

describe('CouponFormService', () => {
  let service: CouponFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CouponFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
