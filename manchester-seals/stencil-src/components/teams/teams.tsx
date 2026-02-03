import { Component, h } from '@stencil/core';

@Component({
  tag: 'teams-component',
  styleUrl: 'teams.css',
  shadow: true
})
export class Teams {
  render() {
    return (
      <div class="teams-wrapper">
        <h2>Teams (Built in StencilJS)</h2>
      </div>
    );
  }
}
