import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroupNewPage } from './group-new.page';

describe('GroupNewPage', () => {
  let component: GroupNewPage;
  let fixture: ComponentFixture<GroupNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupNewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
