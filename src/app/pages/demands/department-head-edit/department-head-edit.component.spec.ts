import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentHeadEditComponent } from './department-head-edit.component';

describe('DepartmentHeadEditComponent', () => {
  let component: DepartmentHeadEditComponent;
  let fixture: ComponentFixture<DepartmentHeadEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentHeadEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentHeadEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
