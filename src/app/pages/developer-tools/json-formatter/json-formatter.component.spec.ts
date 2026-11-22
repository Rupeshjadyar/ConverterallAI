import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { JsonFormatterComponent } from './json-formatter.component';

describe('JsonFormatterComponent', () => {
  let component: JsonFormatterComponent;
  let fixture: ComponentFixture<JsonFormatterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonFormatterComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonFormatterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
