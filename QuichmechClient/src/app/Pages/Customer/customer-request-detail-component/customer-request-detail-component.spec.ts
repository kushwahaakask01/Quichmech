import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRequestDetailComponent } from './customer-request-detail-component';

describe('CustomerRequestDetailComponent', () => {
  let component: CustomerRequestDetailComponent;
  let fixture: ComponentFixture<CustomerRequestDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerRequestDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerRequestDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
