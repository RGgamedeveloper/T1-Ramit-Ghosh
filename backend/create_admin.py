import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.accounts.models import User

email = 'admin@quizportal.com'
try:
    u = User.objects.get(email=email)
    print('Admin user already exists:', email)
except User.DoesNotExist:
    u = User.objects.create_user(
        email=email,
        username='admin',
        password='Admin1234!',
        first_name='Admin',
        is_staff=True,
        is_superuser=True,
    )
    print('Admin user created:', email, '/ Admin1234!')
