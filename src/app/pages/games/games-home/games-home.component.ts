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
  templateUrl: './games-home.component.html',
  styleUrls: ['./games-home.component.css']
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
