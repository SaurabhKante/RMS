# Stage 1: Build Spring Boot Application

FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy Maven configuration first
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build Spring Boot JAR
RUN mvn clean package -DskipTests



# Stage 2: Run Spring Boot Application

FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy generated JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Spring Boot internal container port
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]