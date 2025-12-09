import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.usuarios.models import Usuario
from apps.profesionales.models import Profesional, DisponibilidadProfesional
from datetime import time

print("🚀 Creando datos de prueba...")

# Crear usuario profesional
usuario_prof, created = Usuario.objects.get_or_create(
    rut='11111111-1',
    defaults={
        'email': 'doctor@clinica.cl',
        'nombre': 'Juan',
        'apellido': 'Pérez',
        'telefono': '+56912345678',
        'fecha_nacimiento': '1980-01-01',
        'direccion': 'Consultorio Central',
        'rol': 'PROFESIONAL',
    }
)

if created:
    usuario_prof.set_password('doctor123')
    usuario_prof.save()
    print(f"✅ Usuario profesional creado: {usuario_prof.get_full_name()}")
else:
    print(f"ℹ️  Usuario profesional ya existe: {usuario_prof.get_full_name()}")

# Crear perfil profesional
profesional, created = Profesional.objects.get_or_create(
    usuario=usuario_prof,
    defaults={
        'especialidad': 'Medicina General',
        'registro_profesional': 'MED123456',
        'anos_experiencia': 10,
        'titulo_profesional': 'Médico Cirujano',
        'activo_para_citas': True,
        'duracion_cita_minutos': 30,
    }
)

if created:
    print(f"✅ Profesional creado: {profesional}")
else:
    print(f"ℹ️  Profesional ya existe: {profesional}")

# Crear disponibilidad (Lunes a Viernes)
horarios = [
    # Lunes
    {'dia': 0, 'inicio': time(9, 0), 'fin': time(13, 0)},
    {'dia': 0, 'inicio': time(14, 0), 'fin': time(18, 0)},
    # Martes
    {'dia': 1, 'inicio': time(9, 0), 'fin': time(13, 0)},
    {'dia': 1, 'inicio': time(14, 0), 'fin': time(18, 0)},
    # Miércoles
    {'dia': 2, 'inicio': time(9, 0), 'fin': time(13, 0)},
    {'dia': 2, 'inicio': time(14, 0), 'fin': time(18, 0)},
    # Jueves
    {'dia': 3, 'inicio': time(9, 0), 'fin': time(13, 0)},
    {'dia': 3, 'inicio': time(14, 0), 'fin': time(18, 0)},
    # Viernes
    {'dia': 4, 'inicio': time(9, 0), 'fin': time(13, 0)},
    {'dia': 4, 'inicio': time(14, 0), 'fin': time(17, 0)},
]

count = 0
for horario in horarios:
    disp, created = DisponibilidadProfesional.objects.get_or_create(
        profesional=profesional,
        dia_semana=horario['dia'],
        hora_inicio=horario['inicio'],
        defaults={
            'hora_fin': horario['fin'],
            'activo': True,
        }
    )
    if created:
        count += 1
        dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
        print(f"✅ Disponibilidad creada: {dias[horario['dia']]} {horario['inicio']}-{horario['fin']}")

print(f"\n✅ {count} horarios de disponibilidad creados")
print("\n🎉 ¡Datos de prueba creados exitosamente!")
print("\n📋 Credenciales del Profesional:")
print(f"   📧 Email: doctor@clinica.cl")
print(f"   🔑 Password: doctor123")
print(f"   👤 RUT: 11111111-1")
print("\n🩺 Profesional: Dr. Juan Pérez")
print("   Especialidad: Medicina General")
print("   Disponibilidad: Lunes a Viernes, 9:00-13:00 y 14:00-18:00")