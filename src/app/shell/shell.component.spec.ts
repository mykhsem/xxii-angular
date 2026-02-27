import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UiStateService } from '../services/ui-state.service';
import { ShellComponent } from './shell.component';

describe('ShellComponent', () => {
  let fixture: ComponentFixture<ShellComponent>;
  let uiState: UiStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(ShellComponent);
    uiState = TestBed.inject(UiStateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the app-header', () => {
    const header = fixture.nativeElement.querySelector('app-header');
    expect(header).toBeTruthy();
  });

  it('renders left sidebar when leftSidebarOpen is true', () => {
    uiState.setLeftSidebarOpen(true);
    fixture.detectChanges();
    const sidebar = fixture.nativeElement.querySelector('.shell__sidebar-left');
    expect(sidebar).toBeTruthy();
  });

  it('hides left sidebar when leftSidebarOpen is false', () => {
    uiState.setLeftSidebarOpen(false);
    fixture.detectChanges();
    const sidebar = fixture.nativeElement.querySelector('.shell__sidebar-left');
    expect(sidebar).toBeNull();
  });

  it('renders right panel when rightPanelOpen is true', () => {
    uiState.openRightPanel('members');
    fixture.detectChanges();
    const panel = fixture.nativeElement.querySelector('.shell__panel-right');
    expect(panel).toBeTruthy();
  });

  it('hides right panel when rightPanelOpen is false', () => {
    uiState.closeRightPanel();
    fixture.detectChanges();
    const panel = fixture.nativeElement.querySelector('.shell__panel-right');
    expect(panel).toBeNull();
  });

  it('center column has id="main-content"', () => {
    const main = fixture.nativeElement.querySelector('#main-content');
    expect(main).toBeTruthy();
  });

  it('center column has role="main"', () => {
    const main = fixture.nativeElement.querySelector('[role="main"]');
    expect(main).toBeTruthy();
  });
});
