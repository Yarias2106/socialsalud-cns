#  SocialSalud CNS
### Sistema de Gestión de Tarjetas de Pacientes
**Caja Nacional de Salud — Supervisión Trabajo Social**

---

##  Inicio Rápido (Un solo comando)

### Requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo

### Ejecutar el sistema

```bash
docker compose up --build
```

Luego abrir el navegador en: **http://localhost**

Para detener el sistema:
```bash
docker compose down
```

>  Los datos se guardan en un volumen Docker persistente. Se mantienen aunque apague el sistema.

---

## 📋 Funcionalidades

### Autenticación
- Registro de usuario con nombre de usuario y contraseña
- Inicio de sesión con JWT (sesión de 8 horas)
- Cada usuario ve únicamente sus propias tarjetas

### Tarjetas de Pacientes
Cada tarjeta incluye los siguientes campos (todos opcionales):

| # | Campo | Descripción |
|---|-------|-------------|
| 1 | Mat. Aseg. | Código único del asegurado |
| 2 | Cód. Benefi. | Código de beneficiario |
| 3 | Apellido Paterno | |
| 4 | Apellido Materno | |
| 5 | Nombre | |
| 6 | Ap. Esposo/a | |
| 7 | Lugar de Procedencia | |
| 8 | Localidad | |
| 9 | Provincia | |
| 10 | Departamento | |
| 11 | Dirección | |
| 12 | Teléfono | |
| 13 | Empresa | |
| 14 | Sección | |
| 15 | A quién notificar (emergencia) | |
| 16 | Dirección del contacto | |
| 17 | Unidad Sanitaria | |
| 18 | Consultorio o Servicio | |
| 19 | Sala | |
| 20 | Cama | |
| 21 | Lugar y Fecha | Selector de calendario, permite fechas pasadas |

### Observaciones de Visitas
- Historial de visitas por paciente
- Cada observación tiene fecha (seleccionable con calendario) y texto libre
- Las observaciones se muestran de más reciente a más antigua
- Eliminación con doble confirmación

### Otras funciones
- Buscador por Mat. Aseg. en la pantalla principal
- Eliminación de tarjetas con doble confirmación (anti-click accidental)

---

##  Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | Python 3.11 + FastAPI |
| Base de Datos | SQLite (persistente vía Docker volume) |
| Autenticación | JWT (python-jose + bcrypt) |
| Frontend | React 18 + Vite |
| Router | React Router v6 |
| Servidor | Nginx (frontend) + Uvicorn (backend) |
| Deploy | Docker Compose |

---

##  Estructura del Proyecto

```
socialsalud-cns/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py          # Punto de entrada FastAPI
│       ├── config.py        # Configuración y variables de entorno
│       ├── database.py      # Conexión SQLAlchemy
│       ├── dependencies.py  # Middleware JWT
│       ├── models/          # Modelos de base de datos
│       │   ├── user.py
│       │   └── card.py      # Card + Observation
│       ├── schemas/         # Validación Pydantic
│       │   ├── user.py
│       │   └── card.py
│       ├── services/        # Lógica de negocio
│       │   ├── auth.py
│       │   └── card.py
│       └── routers/         # Endpoints API REST
│           ├── auth.py      # /api/auth/register, /api/auth/login
│           └── cards.py     # /api/cards/ CRUD + observaciones
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css        # Tema verde CNS
        ├── assets/
        │   └── logo-cns.png
        ├── context/
        │   └── AuthContext.jsx
        ├── services/
        │   └── api.js       # Axios + interceptores JWT
        ├── components/
        │   ├── Header.jsx
        │   ├── DeleteModal.jsx
        │   └── ObservationModal.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx   # Listado + buscador
            ├── CardForm.jsx    # Crear / editar tarjeta
            └── CardDetail.jsx  # Ver tarjeta + observaciones
```

---

##  API REST

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión → JWT |
| GET | `/api/cards/` | Listar tarjetas (con ?search=) |
| POST | `/api/cards/` | Crear tarjeta |
| GET | `/api/cards/{id}` | Ver tarjeta + observaciones |
| PUT | `/api/cards/{id}` | Editar tarjeta |
| DELETE | `/api/cards/{id}` | Eliminar tarjeta |
| POST | `/api/cards/{id}/observations` | Agregar observación |
| DELETE | `/api/cards/{id}/observations/{obs_id}` | Eliminar observación |

Documentación interactiva disponible en: **http://localhost/api/docs** (cuando el backend está corriendo)

---

##  Ejecutar Tests

```bash
cd backend
pip install -r requirements.txt
pytest tests/ -v
```

---

##  Variables de Entorno

Para producción, modificar en `docker-compose.yml`:

```yaml
environment:
  - SECRET_KEY=tu-clave-secreta-muy-segura-aqui
  - ACCESS_TOKEN_EXPIRE_MINUTES=480
```

---

##  Notas

- La base de datos SQLite es suficiente para el uso previsto (pocos usuarios, uso interno).
- Si en el futuro se necesita escalar a más usuarios, SQLite puede migrarse a PostgreSQL cambiando solo `DATABASE_URL`.
- El volumen `db_data` persiste los datos entre reinicios del contenedor.
