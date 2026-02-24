import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'radiosync_core.settings')
django.setup()

from django.contrib.auth.models import Group

def create_groups():
    roles = ['Radiologo', 'Tecnico', 'Paciente', 'SuperAdmin']
    for role in roles:
        group, created = Group.objects.get_or_create(name=role)
        if created:
            print(f'✅ Grupo creado: {role}')
        else:
            print(f'🟡 El grupo {role} ya existía')

if __name__ == '__main__':
    create_groups()