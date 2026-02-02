import {
  connectToDatabase,
  initializeDatabase,
  getRosterData,
  getRosterDataFiltered,
  disconnectDatabase
} from './src/app/common/mongodb-connection';

/**
 * Main function to demonstrate MongoDB roster data retrieval
 */
async function main() {
  try {
    console.log('🔷 Manchester Seals Baseball - MongoDB Roster Retrieval\n');

    // Initialize database connection
    await initializeDatabase();

    // Retrieve all roster data
    console.log('\n--- All Roster Data ---');
    const allRoster = await getRosterData();
    console.log(JSON.stringify(allRoster, null, 2));

    // Example: Retrieve specific positions
    console.log('\n--- Pitchers Only ---');
    const pitchers = await getRosterDataFiltered({ position: 'Pitcher' });
    console.log(JSON.stringify(pitchers, null, 2));

    // Example: Retrieve by position (Outfield)
    console.log('\n--- Outfielders ---');
    const outfielders = await getRosterDataFiltered({ position: 'Outfield' });
    console.log(JSON.stringify(outfielders, null, 2));

    // Close connection
    await disconnectDatabase();
    console.log('\n✓ Script completed successfully');
  } catch (error) {
    console.error('\n✗ Error occurred:', error);
    process.exit(1);
  }
}

// Run the main function
main();
