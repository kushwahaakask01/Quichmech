import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindMechanicComponent } from './find-mechanic-component';

describe('FindMechanicComponent', () => {
  let component: FindMechanicComponent;
  let fixture: ComponentFixture<FindMechanicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FindMechanicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindMechanicComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
