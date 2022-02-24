import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JackpotPage } from './jackpot.page';

describe('JackpotPage', () => {
  let component: JackpotPage;
  let fixture: ComponentFixture<JackpotPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JackpotPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JackpotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
