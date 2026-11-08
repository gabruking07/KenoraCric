# Database

Mongoose models currently persist users, matches, and scoring events. Match documents retain a materialized innings state and event list. A unique compound index on matchId and eventId prevents duplicate score events. Environment configuration is in .env.example.
