import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageProcessingHome } from './image-processing-home';

describe('ImageProcessingHome', () => {
  let component: ImageProcessingHome;
  let fixture: ComponentFixture<ImageProcessingHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageProcessingHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageProcessingHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
