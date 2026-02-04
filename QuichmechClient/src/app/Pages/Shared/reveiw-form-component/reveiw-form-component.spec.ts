import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReveiwFormComponent } from './reveiw-form-component';

describe('ReveiwFormComponent', () => {
  let component: ReveiwFormComponent;
  let fixture: ComponentFixture<ReveiwFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReveiwFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReveiwFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
