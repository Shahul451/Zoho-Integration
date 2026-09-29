try {
  require('./dist/server.js');
} catch (err) {
  console.error('❌ App startup failed:', err);
  process.exit(1);
}
