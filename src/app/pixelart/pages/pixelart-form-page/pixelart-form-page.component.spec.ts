import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixelartFormPageComponent } from './pixelart-form-page.component';

describe('PixelartFormPageComponent', () => {
  let component: PixelartFormPageComponent;
  let fixture: ComponentFixture<PixelartFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PixelartFormPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PixelartFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
