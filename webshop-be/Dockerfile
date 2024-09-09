FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app

COPY ./pom.xml ./pom.xml
COPY ./lombok.config ./lombok.config
COPY ./src ./src

RUN mvn install -DskipTests

FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/webshop-be-0.0.1-SNAPSHOT.jar ./app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]