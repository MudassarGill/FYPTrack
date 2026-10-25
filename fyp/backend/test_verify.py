import requests

BASE_URL = 'http://localhost:8000/api'

# 1. Login as Student
r_stu = requests.post(f'{BASE_URL}/auth/login', json={'email': 'student@university.edu', 'password': 'password123'})
print('Student Login Status:', r_stu.status_code)
stu_token = r_stu.json()['access_token']
h_stu = {'Authorization': f'Bearer {stu_token}'}

stu_projs = requests.get(f'{BASE_URL}/projects/my', headers=h_stu).json()
print('Student Projects Count:', len(stu_projs))

ms = requests.get(f'{BASE_URL}/milestones/', headers=h_stu).json()
print('Official Milestones Count:', len(ms))
for m in ms:
    print(f"  {m['phase']}: {m['milestone']} ({m['submission_weight']}) - Due: {m['deadline']}")

# 2. Login as Supervisor
r_sup = requests.post(f'{BASE_URL}/auth/login', json={'email': 'supervisor@university.edu', 'password': 'password123'})
print('\nSupervisor Login Status:', r_sup.status_code)
sup_token = r_sup.json()['access_token']
h_sup = {'Authorization': f'Bearer {sup_token}'}
sup_projs = requests.get(f'{BASE_URL}/projects/my', headers=h_sup).json()
print('Supervisor Assigned Projects Count:', len(sup_projs))
sup_stus = requests.get(f'{BASE_URL}/students/my', headers=h_sup).json()
print('Supervisor Assigned Students Count:', len(sup_stus))

# 3. Login as Coordinator
r_coord = requests.post(f'{BASE_URL}/auth/login', json={'email': 'coordinator@university.edu', 'password': 'password123'})
print('\nCoordinator Login Status:', r_coord.status_code)
coord_token = r_coord.json()['access_token']
h_coord = {'Authorization': f'Bearer {coord_token}'}
all_projs = requests.get(f'{BASE_URL}/projects/all', headers=h_coord).json()
print('Coordinator Total Projects in DB:', len(all_projs))
