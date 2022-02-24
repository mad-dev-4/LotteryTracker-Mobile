import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TicketListPage } from './ticket-list.page';

describe('TicketListPage', () => {
  let component: TicketListPage;
  let fixture: ComponentFixture<TicketListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
