import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicRequestManagementComponent } from './mechanic-request-management-component';

describe('MechanicRequestManagementComponent', () => {
  let component: MechanicRequestManagementComponent;
  let fixture: ComponentFixture<MechanicRequestManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MechanicRequestManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MechanicRequestManagementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
