import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixelartCardComponent } from './pixelart-card.component';

describe('PixelartCardComponent', () => {
  let component: PixelartCardComponent;
  let fixture: ComponentFixture<PixelartCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PixelartCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PixelartCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
