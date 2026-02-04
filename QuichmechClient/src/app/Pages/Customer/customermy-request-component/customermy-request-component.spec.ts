import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomermyRequestComponent } from './customermy-request-component';

describe('CustomermyRequestComponent', () => {
  let component: CustomermyRequestComponent;
  let fixture: ComponentFixture<CustomermyRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomermyRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomermyRequestComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
