import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidebar collapse state', () => {
    const initialState = component.isCollapsed();
    component.toggleSidebar();
    expect(component.isCollapsed()).toBe(!initialState);
  });

  it('should have 5 navigation items', () => {
    expect(component['navItems'].length).toBe(5);
  });
});
