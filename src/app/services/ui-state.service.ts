import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ActiveItemType = 'chat' | 'feed' | 'folder';
export type RightPanelTab = 'members' | 'pins' | 'search' | 'files' | null;

export interface UiState {
  activeItemType: ActiveItemType | null;
  activeItemId: string | null;
  leftSidebarOpen: boolean;
  rightPanelOpen: boolean;
  rightPanelTab: RightPanelTab;
}

const STORAGE_KEY_SIDEBAR = 'xxii.ui.leftSidebarOpen';

function loadSidebarState(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_SIDEBAR);
    return stored === null ? true : stored === 'true';
  } catch {
    return true;
  }
}

@Injectable({ providedIn: 'root' })
export class UiStateService {
  private readonly state$ = new BehaviorSubject<UiState>({
    activeItemType: null,
    activeItemId: null,
    leftSidebarOpen: loadSidebarState(),
    rightPanelOpen: false,
    rightPanelTab: null,
  });

  readonly state = this.state$.asObservable();

  get snapshot(): UiState {
    return this.state$.getValue();
  }

  selectItem(type: ActiveItemType, id: string): void {
    this.state$.next({
      ...this.state$.getValue(),
      activeItemType: type,
      activeItemId: id,
    });
  }

  openRightPanel(tab: Exclude<RightPanelTab, null>): void {
    this.state$.next({
      ...this.state$.getValue(),
      rightPanelOpen: true,
      rightPanelTab: tab,
    });
  }

  closeRightPanel(): void {
    this.state$.next({
      ...this.state$.getValue(),
      rightPanelOpen: false,
      rightPanelTab: null,
    });
  }

  toggleLeftSidebar(): void {
    const next = !this.state$.getValue().leftSidebarOpen;
    try {
      localStorage.setItem(STORAGE_KEY_SIDEBAR, String(next));
    } catch {
      // ignore storage errors
    }
    this.state$.next({
      ...this.state$.getValue(),
      leftSidebarOpen: next,
    });
  }

  setLeftSidebarOpen(open: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEY_SIDEBAR, String(open));
    } catch {
      // ignore storage errors
    }
    this.state$.next({
      ...this.state$.getValue(),
      leftSidebarOpen: open,
    });
  }
}
