import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainChatWindowComponent } from './main-chat-window.component';

describe('MainChatWindowComponent', () => {
  let component: MainChatWindowComponent;
  let fixture: ComponentFixture<MainChatWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainChatWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainChatWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
