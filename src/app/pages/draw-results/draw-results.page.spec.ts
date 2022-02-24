import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DrawResultsPage } from './draw-results.page';

describe('DrawResultsPage', () => {
  let component: DrawResultsPage;
  let fixture: ComponentFixture<DrawResultsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawResultsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DrawResultsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
