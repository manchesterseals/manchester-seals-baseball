import { Component, OnInit, ChangeDetectorRef, NgZone, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PLAYERS } from '../common/config_data';
import { RosterService, RosterEntry } from '../common/roster-api.service';
import { ExternalApiService } from '../common/external-api.service';

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
  isLoadingFromExternal = false;
  externalPlayers: any[] = [];
  updateTrigger = 0; // Force template update

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

  constructor(
    private rosterService: RosterService, 
    private externalApiService: ExternalApiService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private appRef: ApplicationRef
  ) {}

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

  /**
   * Load roster data from external REST service (localhost:8080)
   */
  loadRosterFromExternal() {
    this.isLoadingFromExternal = true;
    this.externalPlayers = [];
    this.cdr.detectChanges();
    
    this.externalApiService.getRoster().subscribe({
      next: (response: any) => {
        console.log('External API Response:', response);
        this.isLoadingFromExternal = false;
        
        // Handle response - flexible structure
        const data = Array.isArray(response) ? response : (response?.data ? response.data : []);
        if (data && data.length > 0) {
          this.externalPlayers = [...data];
          console.log(`✓ Loaded ${this.externalPlayers.length} roster entries from external service`);
        } else {
          console.log('⚠ No data received from external service');
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('✗ Error loading roster from external service:', error);
        console.error('Make sure the service is running at http://localhost:8080');
        this.isLoadingFromExternal = false;
        this.externalPlayers = [];
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Generic method to fetch data from external service
   */
  fetchFromExternal(endpoint: string) {
    // Validate endpoint
    if (!endpoint || endpoint.trim() === '') {
      console.error('⚠ Please enter an endpoint');
      return;
    }
    
    // Ensure endpoint starts with /
    const cleanEndpoint = endpoint.trim().startsWith('/') ? endpoint.trim() : `/${endpoint.trim()}`;
    
    console.log(`Fetching from ${cleanEndpoint}...`);
    console.log('BEFORE: isLoadingFromExternal=', this.isLoadingFromExternal);
    
    this.isLoadingFromExternal = true;
    this.externalPlayers = [];
    
    console.log('AFTER SET TRUE: isLoadingFromExternal=', this.isLoadingFromExternal);
    this.updateTrigger++;
    this.cdr.detectChanges();
    
    this.externalApiService.getData(cleanEndpoint).subscribe({
      next: (response: any) => {
        console.log(`✓ API Response from ${cleanEndpoint}:`, response);
        
        const data = Array.isArray(response) ? response : (response?.data ? response.data : response);
        console.log('Processed data:', data);
        
        // Set data first
        this.externalPlayers = Array.isArray(data) ? [...data] : [data];
        console.log('Set externalPlayers to:', this.externalPlayers);
        
        // Set loading to false
        this.isLoadingFromExternal = false;
        this.updateTrigger++;
        console.log('RESPONSE HANDLER: isLoadingFromExternal set to FALSE:', this.isLoadingFromExternal);
        
        // Force change detection
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(`✗ Error fetching from ${cleanEndpoint}:`, error);
        this.isLoadingFromExternal = false;
        this.externalPlayers = [];
        this.updateTrigger++;
        this.cdr.markForCheck();
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
