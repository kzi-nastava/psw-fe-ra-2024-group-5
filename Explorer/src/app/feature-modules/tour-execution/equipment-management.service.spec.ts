import { TestBed } from '@angular/core/testing';

import { EquipmentManagementService } from './equipment-management.service';

describe('EquipmentManagementService', () => {
  let service: EquipmentManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipmentManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
