import sqlite3

conn = sqlite3.connect('fyptrack.db')
c = conn.cursor()
tables = [r[0] for r in c.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()]
print("Tables:", tables)

for t in tables:
    try:
        cnt = c.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
        print(f"Table {t}: {cnt} rows")
    except Exception as e:
        print(f"Table {t} error: {e}")

# Check columns of users
c.execute("PRAGMA table_info(users)")
print("Users columns:", [r[1] for r in c.fetchall()])

# Clear only student project-specific tables
for t in ['projects', 'documents', 'evaluations', 'notifications', 'milestones']:
    if t in tables:
        if t != 'milestones': # keep milestones or re-seed them cleanly
            c.execute(f"DELETE FROM {t}")
            print(f"Cleared table: {t}")

# Update student roll number if student user exists
c.execute("UPDATE users SET roll_number = 'FA20-BSE-058' WHERE email = 'student@university.edu'")
conn.commit()

c.execute("SELECT id, email, full_name, role, roll_number FROM users")
print("Remaining users:")
for row in c.fetchall():
    print(" ", row)

conn.close()
print("Clean DB setup done successfully.")
