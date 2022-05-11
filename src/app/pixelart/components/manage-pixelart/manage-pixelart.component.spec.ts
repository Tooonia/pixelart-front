import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePixelartComponent } from './manage-pixelart.component';

describe('ManagePixelartComponent', () => {
  let component: ManagePixelartComponent;
  let fixture: ComponentFixture<ManagePixelartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePixelartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePixelartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
