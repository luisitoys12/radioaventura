# Configuración y Uso de Firebase para Radio Aventura

Este documento explica cómo configurar Firebase para el proyecto Radio Aventura, incluyendo la autenticación, reglas de seguridad y cómo integrar Firebase en los archivos HTML y JavaScript.

---

## 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/).
2. Crea un nuevo proyecto o usa uno existente.
3. En la sección **Authentication**, habilita el método de inicio de sesión por **Correo electrónico y contraseña**.
4. En la sección **Realtime Database**, crea una base de datos y selecciona el modo de producción (con reglas de seguridad).

---

## 2. Configurar Reglas de Seguridad

Para proteger la base de datos y permitir solo usuarios autenticados para escritura, pero permitir lectura pública (por ejemplo, para la página web pública), usa las siguientes reglas:

```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null"
  }
}
```

Esto permite que cualquier usuario pueda leer los datos, pero solo usuarios autenticados puedan escribir o modificar datos.

---

## 3. Crear Usuario Admin

1. En la sección **Authentication > Usuarios**, crea un usuario con correo y contraseña que usarás para el panel de administración.
2. Guarda el correo y contraseña para configurar el login precargado en `js/admin.js`.

---

## 4. Configurar Firebase en HTML y JS

### Archivo `index.htm`

- Incluye el SDK de Firebase y la configuración del proyecto.
- Usa `js/firebase.js` para escuchar la configuración y mostrar metadatos.
- La página pública puede leer datos si las reglas lo permiten (por ejemplo, acceso anónimo).

### Archivo `admin.html`

- Incluye el SDK de Firebase y la configuración.
- Usa `js/admin.js` para manejar autenticación y administración.
- El login se realiza automáticamente con las credenciales precargadas en `js/admin.js`.

---

## 5. Configuración en `js/admin.js`

- Cambia las constantes `ADMIN_EMAIL` y `ADMIN_PASSWORD` por las credenciales reales del usuario admin.
- El script intenta iniciar sesión automáticamente con estas credenciales.
- Si falla, muestra un formulario de login (puedes implementar uno si deseas).
- Solo usuarios autenticados pueden modificar la configuración y datos.

---

## 6. Descarga del Archivo JSON de Configuración

Para facilitar la configuración, puedes descargar el archivo JSON con la configuración de Firebase desde la consola Firebase:

1. Ve a **Configuración del proyecto > General**.
2. En la sección "Tus apps", selecciona la app web.
3. Descarga el archivo `google-services.json` o copia la configuración para usarla en el código.

---

## 7. Estructura recomendada del JSON en Realtime Database

```json
{
  "config": {
    "streams": {
      "sliderTiming": 10000,
      "carouselTiming": 5000,
      "timeRefresh": 10000,
      "base_url": "https://streaming.live365.com/a32532",
      "id_user": 12,
      "multi_stream": false,
      "service": "live365",
      "module_video_tops": true,
      "module_news": true,
      "module_team": true
    }
  },
  "messages": {
    "message1": {
      "text": "Bienvenidos a Radio Aventura!",
      "timestamp": 1687000000000
    }
  },
  "programs": {
    "monday": [
      {
        "title": "Programa Matutino",
        "time": "08:00 - 10:00",
        "description": "Noticias y música para empezar el día"
      }
    ]
  }
}
```

---

## 8. Resumen

- Usa Firebase Authentication para proteger el panel admin.
- Configura reglas de seguridad para permitir solo usuarios autenticados.
- Preconfigura las credenciales en `js/admin.js` para login automático.
- La página pública puede leer datos según las reglas configuradas.
- Asegúrate de mantener seguras las credenciales y no exponerlas públicamente.

---

Si necesitas ayuda adicional para implementar el formulario de login o mejorar la seguridad, no dudes en consultarme.
