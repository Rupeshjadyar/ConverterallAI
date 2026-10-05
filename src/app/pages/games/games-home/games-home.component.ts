import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToolRegistryService } from '../../../services/tool-registry.service';
import { ToolItem } from '../../../data/tools.data';

@Component({
  selector: 'app-games-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="games-hub-container">
      
      <!-- HERO BANNER -->
      <section class="games-hero">
        <div class="hero-badge">
          <span class="pulse-dot"></span>
          <span>100% Free • Zero Latency • Client-Side Angular Games</span>
        </div>
        
        <h1 class="hero-title">
          The Ultimate <span class="gradient-text">Browser Games Arcade</span>
        </h1>
        <p class="hero-desc">
          Play classic strategy board games, Indian 3-Patti card tables with AI bots, arcade retro classics, and speed benchmarks. Play solo vs smart AI or 2-player pass & play!
        </p>

        <!-- Search and Quick Category Filter -->
        <div class="hub-controls">
          <div class="search-bar">
            <span class="search-icon">🔍</span>
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              placeholder="Search games (e.g. Chess, 3 Patti, 2048, Sudoku, Snake...)" 
              class="search-input"
            />
            <button *ngIf="searchQuery" (click)="searchQuery = ''" class="clear-btn">✕</button>
          </div>

          <div class="genre-pills">
            <button 
              *ngFor="let g of genres" 
              class="genre-pill" 
              [class.active]="selectedGenre() === g.id"
              (click)="selectedGenre.set(g.id)">
              <span>{{ g.icon }}</span>
              <span>{{ g.name }}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- FEATURED SPOTLIGHT -->
      <section class="featured-spotlight" *ngIf="!searchQuery && selectedGenre() === 'all'">
        <div class="spotlight-card chess-spotlight">
          <div class="spotlight-content">
            <span class="spotlight-badge">🏆 TRENDING STRATEGY</span>
            <h2>Chess Master ♟️</h2>
            <p>Challenge high-accuracy Minimax AI engines or battle a friend with legal move highlights, check indicators, and move history notation.</p>
            <div class="spotlight-actions">
              <a routerLink="/games/chess" class="btn-play-primary">Play Chess Now →</a>
              <span class="player-tag">👥 1P vs AI / 2-Player</span>
            </div>
          </div>
          <div class="spotlight-art">♟️</div>
        </div>

        <div class="spotlight-card patti-spotlight">
          <div class="spotlight-content">
            <span class="spotlight-badge gold-badge">🎴 POPULAR CARD GAME</span>
            <h2>Teen Patti Royale 3-Patti</h2>
            <p>Experience authentic Indian 3-card poker. Place Blind and Chaal bets, build your chip empire, and challenge smart computer bots!</p>
            <div class="spotlight-actions">
              <a routerLink="/games/teen-patti" class="btn-play-gold">Enter Table →</a>
              <span class="player-tag">💰 Virtual Chips & Bots</span>
            </div>
          </div>
          <div class="spotlight-art">🎴</div>
        </div>
      </section>

      <!-- GAMES GRID -->
      <section class="games-section">
        <div class="section-header">
          <h2 class="section-title">
            <span>{{ getSectionTitle() }}</span>
            <span class="game-count">({{ filteredGames().length }} Games)</span>
          </h2>
        </div>

        <div class="games-grid">
          <div *ngFor="let game of filteredGames()" class="game-card glass">
            <div class="card-header">
              <div class="game-icon-box">{{ game.icon }}</div>
              <div class="badge-row">
                <span *ngIf="game.badge" class="game-badge" [ngClass]="game.badge.toLowerCase()">{{ game.badge }}</span>
                <span *ngIf="game.isAI" class="ai-badge">🤖 AI Bot</span>
              </div>
            </div>

            <div class="card-body">
              <h3 class="game-name">{{ game.name }}</h3>
              <p class="game-desc">{{ game.shortDesc }}</p>
            </div>

            <div class="card-footer">
              <a [routerLink]="game.slug" class="btn-launch-game">
                <span>Play Free</span>
                <span class="arrow">→</span>
              </a>
            </div>
          </div>
        </div>

        <div *ngIf="filteredGames().length === 0" class="empty-state glass">
          <div class="empty-icon">🎮</div>
          <h3>No games found matching "{{ searchQuery }}"</h3>
          <p>Try clearing your search query or selecting "All Games".</p>
          <button (click)="searchQuery = ''; selectedGenre.set('all')" class="btn-reset">View All Games</button>
        </div>
      </section>

      <!-- WHY PLAY ON CONVERTERALL GAMES -->
      <section class="perks-section">
        <div class="perks-grid">
          <div class="perk-card glass">
            <div class="perk-icon">⚡</div>
            <h3>Zero Latency</h3>
            <p>100% Client-side Angular standalone engines. No ads interruptions, instant 60fps frame rates.</p>
          </div>
          <div class="perk-card glass">
            <div class="perk-icon">🔒</div>
            <h3>100% Private & Free</h3>
            <p>No registration, no downloads, no credit card required. High scores are securely stored in your browser.</p>
          </div>
          <div class="perk-card glass">
            <div class="perk-icon">📱</div>
            <h3>Cross-Platform Ready</h3>
            <p>Engineered with touch D-pads, swipe gestures, and keyboard hotkeys for Mobile, Tablet, and PC.</p>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .games-hub-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem;
      font-family: inherit;
    }

    /* Hero */
    .games-hero {
      text-align: center;
      margin-bottom: 3rem;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.9rem;
      border-radius: 99px;
      background: rgba(139, 92, 246, 0.15);
      border: 1px solid rgba(139, 92, 246, 0.3);
      color: #c4b5fd;
      font-size: 0.82rem;
      font-weight: 700;
      margin-bottom: 1.2rem;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #38bdf8;
      box-shadow: 0 0 8px #38bdf8;
    }

    .hero-title {
      font-size: clamp(2rem, 4.5vw, 3.2rem);
      font-weight: 900;
      color: var(--text-color, #fff);
      line-height: 1.15;
      margin-bottom: 1rem;
    }

    .gradient-text {
      background: linear-gradient(135deg, #a78bfa 0%, #38bdf8 50%, #ec4899 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-desc {
      font-size: 1.05rem;
      color: var(--text-muted, #94a3b8);
      max-width: 760px;
      margin: 0 auto 2rem;
      line-height: 1.6;
    }

    /* Hub Controls */
    .hub-controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
      max-width: 850px;
      margin: 0 auto;
    }

    .search-bar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem 1.25rem;
      border-radius: 99px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.14));
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    .search-icon {
      font-size: 1.1rem;
      color: #94a3b8;
    }

    .search-input {
      flex: 1;
      background: transparent;
      border: none;
      color: var(--text-color, #fff);
      font-size: 0.98rem;
      outline: none;
    }

    .search-input::placeholder {
      color: #64748b;
    }

    .clear-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .genre-pills {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem;
    }

    .genre-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 1rem;
      border-radius: 99px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
      color: var(--text-muted, #94a3b8);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .genre-pill:hover, .genre-pill.active {
      background: rgba(139, 92, 246, 0.2);
      border-color: rgba(139, 92, 246, 0.45);
      color: #fff;
    }

    /* Featured Spotlight Cards */
    .featured-spotlight {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 3.5rem;
    }

    @media (max-width: 900px) {
      .featured-spotlight {
        grid-template-columns: 1fr;
      }
    }

    .spotlight-card {
      padding: 2rem;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.14);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }

    .chess-spotlight {
      background: linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(15, 23, 42, 0.85) 100%);
      border-color: rgba(139, 92, 246, 0.3);
    }

    .patti-spotlight {
      background: linear-gradient(135deg, rgba(88, 28, 135, 0.8) 0%, rgba(30, 27, 75, 0.85) 100%);
      border-color: rgba(234, 179, 8, 0.3);
    }

    .spotlight-content {
      flex: 1;
      z-index: 2;
    }

    .spotlight-badge {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      padding: 0.2rem 0.65rem;
      border-radius: 99px;
      background: rgba(139, 92, 246, 0.25);
      color: #c4b5fd;
      margin-bottom: 0.75rem;
    }

    .gold-badge {
      background: rgba(234, 179, 8, 0.2);
      color: #fde047;
    }

    .spotlight-card h2 {
      font-size: 1.5rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 0.5rem;
    }

    .spotlight-card p {
      font-size: 0.88rem;
      color: #94a3b8;
      line-height: 1.5;
      margin-bottom: 1.25rem;
      max-width: 420px;
    }

    .spotlight-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn-play-primary {
      padding: 0.65rem 1.4rem;
      border-radius: 12px;
      background: linear-gradient(135deg, #8b5cf6, #38bdf8);
      color: #fff;
      font-weight: 700;
      font-size: 0.9rem;
      text-decoration: none;
      box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
      transition: transform 0.2s;
    }

    .btn-play-primary:hover {
      transform: translateY(-2px);
    }

    .btn-play-gold {
      padding: 0.65rem 1.4rem;
      border-radius: 12px;
      background: linear-gradient(135deg, #eab308, #f59e0b);
      color: #000;
      font-weight: 800;
      font-size: 0.9rem;
      text-decoration: none;
      box-shadow: 0 4px 15px rgba(234, 179, 8, 0.4);
      transition: transform 0.2s;
    }

    .btn-play-gold:hover {
      transform: translateY(-2px);
    }

    .player-tag {
      font-size: 0.78rem;
      font-weight: 600;
      color: #cbd5e1;
    }

    .spotlight-art {
      font-size: 5rem;
      opacity: 0.25;
      user-select: none;
    }

    /* Games Grid */
    .games-section {
      margin-bottom: 4rem;
    }

    .section-header {
      margin-bottom: 1.75rem;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-color, #fff);
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .game-count {
      font-size: 1rem;
      font-weight: 600;
      color: #94a3b8;
    }

    .games-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
      gap: 1.5rem;
    }

    .game-card {
      padding: 1.4rem;
      border-radius: 18px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.25s;
    }

    .game-card:hover {
      transform: translateY(-5px);
      border-color: rgba(139, 92, 246, 0.4);
      box-shadow: 0 15px 45px rgba(0, 0, 0, 0.4);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .game-icon-box {
      font-size: 2.2rem;
      width: 54px;
      height: 54px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .badge-row {
      display: flex;
      gap: 0.4rem;
    }

    .game-badge {
      font-size: 0.68rem;
      font-weight: 800;
      padding: 0.15rem 0.55rem;
      border-radius: 99px;
      text-transform: uppercase;
    }

    .game-badge.popular {
      background: rgba(236, 72, 153, 0.2);
      color: #f472b6;
      border: 1px solid rgba(236, 72, 153, 0.35);
    }

    .game-badge.new {
      background: rgba(6, 182, 212, 0.2);
      color: #67e8f9;
      border: 1px solid rgba(6, 182, 212, 0.35);
    }

    .game-badge.free {
      background: rgba(34, 197, 94, 0.2);
      color: #4ade80;
      border: 1px solid rgba(34, 197, 94, 0.35);
    }

    .ai-badge {
      font-size: 0.68rem;
      font-weight: 800;
      padding: 0.15rem 0.55rem;
      border-radius: 99px;
      background: rgba(139, 92, 246, 0.2);
      color: #c4b5fd;
      border: 1px solid rgba(139, 92, 246, 0.35);
    }

    .game-name {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text-color, #fff);
      margin-bottom: 0.4rem;
    }

    .game-desc {
      font-size: 0.86rem;
      color: var(--text-muted, #94a3b8);
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }

    .btn-launch-game {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.65rem 1rem;
      border-radius: 12px;
      background: rgba(139, 92, 246, 0.12);
      border: 1px solid rgba(139, 92, 246, 0.25);
      color: #c4b5fd;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.88rem;
      transition: all 0.2s;
    }

    .btn-launch-game:hover {
      background: #8b5cf6;
      color: #fff;
      border-color: #8b5cf6;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      border-radius: 18px;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 0.8rem;
    }

    .btn-reset {
      margin-top: 1rem;
      padding: 0.6rem 1.2rem;
      border-radius: 10px;
      background: #8b5cf6;
      color: #fff;
      border: none;
      cursor: pointer;
      font-weight: 700;
    }

    /* Perks */
    .perks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .perk-card {
      padding: 1.5rem;
      border-radius: 16px;
      text-align: center;
    }

    .perk-icon {
      font-size: 2rem;
      margin-bottom: 0.75rem;
    }

    .perk-card h3 {
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--text-color, #fff);
      margin-bottom: 0.35rem;
    }

    .perk-card p {
      font-size: 0.85rem;
      color: var(--text-muted, #94a3b8);
      line-height: 1.5;
    }

    /* Light Theme */
    :host-context(body.light-theme) .spotlight-card.chess-spotlight {
      background: linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%);
      border-color: #c4b5fd;
    }
    :host-context(body.light-theme) .spotlight-card.patti-spotlight {
      background: linear-gradient(135deg, #fefce8 0%, #fffbeb 100%);
      border-color: #fde047;
    }
    :host-context(body.light-theme) .spotlight-card h2 { color: #111827; }
    :host-context(body.light-theme) .player-tag { color: #475569; }
    :host-context(body.light-theme) .search-bar { background: #fff; border-color: #e2e8f0; }
    :host-context(body.light-theme) .genre-pill { background: #fff; border-color: #e2e8f0; color: #475569; }
    :host-context(body.light-theme) .genre-pill.active { background: #ede9fe; color: #6d28d9; border-color: #a78bfa; }
    :host-context(body.light-theme) .game-card { background: #fff; border-color: #e2e8f0; }
    :host-context(body.light-theme) .game-name { color: #111827; }
    :host-context(body.light-theme) .game-icon-box { background: #f8fafc; border-color: #e2e8f0; }
    :host-context(body.light-theme) .perk-card { background: #fff; border-color: #e2e8f0; }
    :host-context(body.light-theme) .perk-card h3 { color: #111827; }
  `]
})
export class GamesHomeComponent {
  private registry = inject(ToolRegistryService);
  searchQuery = '';
  selectedGenre = signal('all');

  genres = [
    { id: 'all', name: 'All Games', icon: '🎮' },
    { id: 'action', name: 'Action & Royale', icon: '🪂' },
    { id: 'board', name: 'Board & Cards', icon: '♟️' },
    { id: 'arcade', name: 'Arcade Classics', icon: '🕹️' },
    { id: 'puzzle', name: 'Brain & Puzzles', icon: '🧠' },
    { id: 'multiplayer', name: 'vs AI & 2-Player', icon: '👥' }
  ];

  allGames = computed(() => this.registry.getToolsByCategory('games'));

  filteredGames = computed(() => {
    let list = this.allGames();
    const query = this.searchQuery.trim().toLowerCase();
    const genre = this.selectedGenre();

    if (query) {
      list = list.filter(g => g.name.toLowerCase().includes(query) || g.shortDesc.toLowerCase().includes(query));
    }

    if (genre === 'action') {
      list = list.filter(g => ['frontline-survivor', 'warfare-3000', 'snake', 'brick-breaker', 'pong'].includes(g.id));
    } else if (genre === 'board') {
      list = list.filter(g => ['chess', 'teen-patti', 'teen-do-paanch', 'snakes-ladders', 'ludo', 'tic-tac-toe'].includes(g.id));
    } else if (genre === 'arcade') {
      list = list.filter(g => ['frontline-survivor', 'warfare-3000', 'snake', 'brick-breaker', 'pong', 'snakes-ladders'].includes(g.id));
    } else if (genre === 'puzzle') {
      list = list.filter(g => ['sudoku', 'memory-match', 'typing-test', 'spelling-bee'].includes(g.id));
    } else if (genre === 'multiplayer') {
      list = list.filter(g => ['warfare-3000', 'chess', 'teen-patti', 'teen-do-paanch', 'snakes-ladders', 'ludo', 'tic-tac-toe', 'pong'].includes(g.id));
    }

    return list;
  });

  getSectionTitle(): string {
    const g = this.genres.find(x => x.id === this.selectedGenre());
    return g ? g.name : 'All Games';
  }
}
