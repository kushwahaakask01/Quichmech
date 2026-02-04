import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusBadgeComponentComponent } from './status-badge-component-component';

describe('StatusBadgeComponentComponent', () => {
  let component: StatusBadgeComponentComponent;
  let fixture: ComponentFixture<StatusBadgeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusBadgeComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusBadgeComponentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
