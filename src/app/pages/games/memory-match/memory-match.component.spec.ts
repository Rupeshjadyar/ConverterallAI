import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MemoryMatchComponent } from './memory-match.component';

describe('MemoryMatchComponent', () => {
  let component: MemoryMatchComponent;
  let fixture: ComponentFixture<MemoryMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemoryMatchComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemoryMatchComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
