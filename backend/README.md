# Bigsofa Backend

Spring Boot 3.4 application that powers both the public Bigsofa storefront and the new admin console. It exposes endpoints for managing furniture categories and items, including authenticated operations for administrators.

## Requirements
- Java 21+
- PostgreSQL 14+ (defaults: `jdbc:postgresql://localhost:5432/e-com`, user `postgres`, password `qwerty1!`)
- Maven (or use the provided Maven Wrapper `./mvnw`)

## Run locally
```bash
cd backend/bigsofa-backend
./mvnw spring-boot:run
```
The app starts on `http://localhost:8080`.

### Configuration
Update `src/main/resources/application.properties` to match your database and desired admin credentials:
```
app.admin.username=admin
app.admin.password=changeme
app.cors.allowed-origins=http://localhost:5173,http://localhost:5174
```

## Key endpoints

### Public
- `GET /api/categories` – list available furniture categories.
- `GET /api/categories/{id}` – fetch a single category.
- `POST /api/categories` – create a category.
- `GET /api/furniture` – list furniture (filter with `categoryId` or `categoryName`).
- `POST /api/furniture` – upload a new furniture item (multipart, requires `categoryId`, `name`, `priceCents`, `file`).
- `GET /api/furniture/{id}/image` – download the stored image bytes for an item.

### Admin (token protected)
- `POST /api/admin/login` – authenticate with `{ "username": "...", "password": "..." }`. Returns `{ "token": "..." }`.
- `POST /api/admin/logout` – invalidate the token, send `X-Admin-Token` header.
- `GET /api/admin/furniture` – list all items (send `X-Admin-Token` header).
- `POST /api/admin/furniture` – create furniture (multipart + `X-Admin-Token`).
- `PUT /api/admin/furniture/{id}` – update metadata and optionally replace the image.
- `DELETE /api/admin/furniture/{id}` – remove an item (image bytes are removed as part of the row delete).

All secured endpoints expect the `X-Admin-Token` header that is issued by the login call. Tokens are short lived (8 hours) and stored in-memory.

## Tests
```bash
cd backend/bigsofa-backend
./mvnw test
```
