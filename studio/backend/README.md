# backend (Spring Boot)

This folder contains a minimal Spring Boot backend scaffold. It's intended as a starting point for implementing a REST API with JPA persistence.

How to run (PowerShell):


```powershell
# from repository root
cd .\backend
# Build and run locally (development uses in-memory H2 database)
.\mvnw clean package
.\mvnw spring-boot:run
```

If you don't have the Maven wrapper (`mvnw`) you can use an installed Maven:

```powershell
mvn clean package
mvn spring-boot:run
```

The service listens on port 8081 by default and uses H2 in-memory DB for development.

Endpoints:
- GET /api/posts
- GET /api/posts/{id}
- POST /api/posts
 
Using MySQL instead of H2
---------------------------------

If you want to persist data in MySQL, do the following:

1. Install and run a MySQL server locally (or use a hosted MySQL). For a quick local container you can run:

```powershell
docker run -e MYSQL_ROOT_PASSWORD=change_me -e MYSQL_DATABASE=studio_db -p 3306:3306 -d mysql:8
```

2. Configure credentials and connection. The project includes an example `application-mysql.properties` in `src/main/resources`.

By default the example uses:

- URL: `jdbc:mysql://localhost:3306/studio_db`
- Username: `root`
- Password: `change_me`

3. Start the app with the `mysql` profile so Spring Boot picks up the MySQL properties:

```powershell
cd backend
mvn -Dspring-boot.run.profiles=mysql spring-boot:run
```

Or run the built jar with the profile active:

```powershell
java -jar -Dspring.profiles.active=mysql target/backend-0.0.1-SNAPSHOT.jar
```

4. If you prefer environment variables instead of the profile file, set:

```powershell
$env:SPRING_DATASOURCE_URL='jdbc:mysql://localhost:3306/studio_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC'
$env:SPRING_DATASOURCE_USERNAME='root'
$env:SPRING_DATASOURCE_PASSWORD='change_me'
$env:SPRING_PROFILES_ACTIVE='mysql'
```

Notes:
- `spring.jpa.hibernate.ddl-auto=update` will create/update tables automatically for development. For production, prefer using proper migrations (Flyway/Liquibase) and set `ddl-auto` to `validate` or off.
- The `mysql-connector-j` dependency has been added to `pom.xml`.
