import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCreateRequestComponent } from './customer-create-request-component';

describe('CustomerCreateRequestComponent', () => {
  let component: CustomerCreateRequestComponent;
  let fixture: ComponentFixture<CustomerCreateRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerCreateRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerCreateRequestComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
