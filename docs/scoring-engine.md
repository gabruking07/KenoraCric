# Scoring engine

The pure TypeScript scoring package stores legal balls as an integer. Overs are formatted from legal balls, never decimal arithmetic. It supports runs, extras, wickets, target completion, all-out completion, run rate, and undo by replaying the innings event log. Wides and no-balls are illegal deliveries. This first iteration does not yet model batter/bowler figures, striker rotation, free-hit dismissal restrictions, innings formats, or super overs.
