import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectGamePage } from './select-game.page';

describe('SelectGamePage', () => {
  let component: SelectGamePage;
  let fixture: ComponentFixture<SelectGamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectGamePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectGamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
