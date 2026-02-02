import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PLAYERS } from '../common/config_data';
import { RosterService, RosterEntry } from '../common/roster-api.service';

interface Player {
  name: string;
  position: string;
  number: string;
}

@Component({
  selector: 'app-roster',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roster.component.html',
  styleUrl: './roster.component.css'
})
export class RosterComponent implements OnInit {
  players: Player[] = PLAYERS;
  isLoadingFromMongoDB = false;
  mongoDBPlayers: RosterEntry[] = [];

  searchTerm: string = '';
  sortKey: keyof Player | null = null;
  sortAsc = true;
  showAddForm = false;
  newPlayer: Player = { name: '', position: '', number: '' };
  showDeleteConfirm = false;
  playerToDelete: string | null = null;
  showEditForm = false;
  editPlayer: Player | null = null;
  editPlayerOriginalName: string | null = null;

  constructor(private rosterService: RosterService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadRosterFromMongoDB();
  }

  /**
   * Load roster data from MongoDB via API
   */
  loadRosterFromMongoDB() {
    this.isLoadingFromMongoDB = true;
    this.mongoDBPlayers = [];
    this.cdr.detectChanges();
    this.rosterService.getAllRoster().subscribe({
      next: (response: any) => {
        console.log('Full Response:', response);
        console.log('Response Data:', response?.data);
        console.log('Response Success:', response?.success);
        
        this.isLoadingFromMongoDB = false;
        
        // Handle response - be flexible about structure
        if (response && (response.data || response)) {
          const data = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
          if (data && data.length > 0) {
            this.mongoDBPlayers = [...data];
            console.log('✓ Loaded roster data');
          }
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('✗ Error loading roster from MongoDB:', error);
        this.isLoadingFromMongoDB = false;
        this.mongoDBPlayers = [];
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Filter roster by position from MongoDB
   */
  filterByPosition(position: string) {
    this.isLoadingFromMongoDB = true;
    this.mongoDBPlayers = [];
    this.cdr.detectChanges();
    this.rosterService.getRosterByPosition(position).subscribe({
      next: (response: any) => {
        console.log('Position Filter Response:', response);
        this.isLoadingFromMongoDB = false;
        
        // Handle response - be flexible about structure
        if (response && (response.data || response)) {
          const data = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
          if (data) {
            this.mongoDBPlayers = [...data];
            console.log(`✓ Found ${this.mongoDBPlayers.length} player(s) with position: ${position}`);
          }
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('✗ Error filtering roster by position:', error);
        this.isLoadingFromMongoDB = false;
        this.mongoDBPlayers = [];
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Filter roster by player number from MongoDB
   */
  filterByNumber(number: string) {
    this.isLoadingFromMongoDB = true;
    this.mongoDBPlayers = [];
    this.cdr.detectChanges();
    this.rosterService.getRosterByNumber(number).subscribe({
      next: (response: any) => {
        console.log('Number Filter Response:', response);
        this.isLoadingFromMongoDB = false;
        
        // Handle response - be flexible about structure
        if (response && (response.data || response)) {
          const data = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
          if (data) {
            this.mongoDBPlayers = [...data];
            console.log(`✓ Found ${this.mongoDBPlayers.length} player(s) with number: ${number}`);
          }
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('✗ Error filtering roster by number:', error);
        this.isLoadingFromMongoDB = false;
        this.mongoDBPlayers = [];
        this.cdr.detectChanges();
      }
    });
  }

  get displayedPlayers(): Player[] {
    let list = this.players.slice();

    const q = this.searchTerm?.trim().toLowerCase();
    if (q) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.position.toLowerCase().includes(q) ||
        p.number.toLowerCase().includes(q)
      );
    }

    if (this.sortKey) {
      const key = this.sortKey;
      list.sort((a, b) => {
        const va = String(a[key]).toLowerCase();
        const vb = String(b[key]).toLowerCase();
        if (va < vb) return this.sortAsc ? -1 : 1;
        if (va > vb) return this.sortAsc ? 1 : -1;
        return 0;
      });
    }

    return list;
  }

  toggleSort(key: keyof Player) {
    if (this.sortKey === key) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortKey = key;
      this.sortAsc = true;
    }
  }

  showDeleteConfirmModal(playerName: string) {
    this.playerToDelete = playerName;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (this.playerToDelete) {
      this.players = this.players.filter((p) => p.name !== this.playerToDelete);
      this.showDeleteConfirm = false;
      this.playerToDelete = null;
    }
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.playerToDelete = null;
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.newPlayer = { name: '', position: '', number: '' };
    }
  }

  addPlayer() {
    if (this.newPlayer.name.trim() && this.newPlayer.position.trim() && this.newPlayer.number.trim()) {
      this.players.push({ ...this.newPlayer });
      this.newPlayer = { name: '', position: '', number: '' };
      this.showAddForm = false;
    }
  }

  openEditModal(player: Player) {
    this.editPlayerOriginalName = player.name;
    this.editPlayer = { ...player };
    this.showEditForm = true;
  }

  updatePlayer() {
    if (this.editPlayer && this.editPlayerOriginalName && this.editPlayer.name.trim() && this.editPlayer.position.trim() && this.editPlayer.number.trim()) {
      const index = this.players.findIndex((p) => p.name === this.editPlayerOriginalName);
      if (index !== -1) {
        this.players[index] = { ...this.editPlayer };
      }
      this.editPlayer = null;
      this.editPlayerOriginalName = null;
      this.showEditForm = false;
    }
  }

  cancelEdit() {
    this.editPlayer = null;
    this.editPlayerOriginalName = null;
    this.showEditForm = false;
  }
}
