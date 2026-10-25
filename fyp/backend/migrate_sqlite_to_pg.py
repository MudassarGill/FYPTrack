import sqlite3
import psycopg2

s_conn = sqlite3.connect('fyptrack.db')
s_cur = s_conn.cursor()

p_conn = psycopg2.connect('postgresql://postgres:Mudassar1565@localhost:5432/fyptrack')
p_cur = p_conn.cursor()
p_cur.execute('TRUNCATE TABLE documents, projects, notifications, feedbacks, evaluations, users CASCADE;')
p_conn.commit()

# 1. Sync Users
s_cur.execute('SELECT id, full_name, email, password_hash, role, is_active, email_updates_enabled, created_at, updated_at FROM users')
for row in s_cur.fetchall():
    p_cur.execute('''
        INSERT INTO users (id, full_name, email, password_hash, role, is_active, email_updates_enabled, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s::boolean, %s::boolean, %s, %s);
    ''', row)
p_conn.commit()
print("Users synced!")

p_cur.execute("SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1))")
p_conn.commit()

# 2. Sync Projects
s_cur.execute('SELECT id, student_id, student_name, student_email, group_name, title, domain, abstract, technologies, group_members, department, status, supervisor_id, supervisor_name, coordinator_status, coordinator_notes, originality_score, version, created_at, updated_at FROM projects')
for row in s_cur.fetchall():
    p_cur.execute('''
        INSERT INTO projects (id, student_id, student_name, student_email, group_name, title, domain, abstract, technologies, group_members, department, status, supervisor_id, supervisor_name, coordinator_status, coordinator_notes, originality_score, version, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, supervisor_id = EXCLUDED.supervisor_id, supervisor_name = EXCLUDED.supervisor_name, department = EXCLUDED.department;
    ''', row)
p_conn.commit()
print("Projects synced!")

p_cur.execute("SELECT setval('projects_id_seq', COALESCE((SELECT MAX(id) FROM projects), 1))")
p_conn.commit()

# 3. Sync Documents
s_cur.execute('SELECT id, project_id, student_id, file_name, file_path, file_size, file_format, doc_type, version, status, supervisor_comment, created_at FROM documents')
for row in s_cur.fetchall():
    p_cur.execute('''
        INSERT INTO documents (id, project_id, student_id, file_name, file_path, file_size, file_format, doc_type, version, status, supervisor_comment, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (id) DO NOTHING;
    ''', row)
p_conn.commit()
print("Documents synced!")

p_cur.execute("SELECT setval('documents_id_seq', COALESCE((SELECT MAX(id) FROM documents), 1))")
p_conn.commit()

# 4. Sync department settings with coordinator name = Pro Subhan Khan
p_cur.execute('''
    UPDATE department_settings 
    SET coordinator_name = 'Pro Subhan Khan'
    WHERE id = 1;
''')
p_conn.commit()
print("Department settings updated with coordinator Pro Subhan Khan!")
