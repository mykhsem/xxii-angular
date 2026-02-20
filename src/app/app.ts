import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <header class="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div class="mx-auto max-w-xl px-4 py-4">
          <h1 class="text-xl font-bold text-indigo-600">{{ title() }}</h1>
          <p class="text-xs text-gray-400">Signals · RxJS · Reactive Forms · Tailwind</p>
        </div>
      </header>
      <main class="mx-auto max-w-xl px-4 py-8">
        <router-outlet />
      </main>
    </div>
  `,
})
export class App {
  protected readonly title = signal('XXII Angular');
}
