package com.estatesphere.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.sql.Connection;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${SPRING_DATASOURCE_URL:${DATABASE_URL:}}")
    private String rawUrl;

    @Value("${SPRING_DATASOURCE_USERNAME:${DATABASE_USERNAME:${MYSQLUSER:root}}}")
    private String rawUser;

    @Value("${SPRING_DATASOURCE_PASSWORD:${DATABASE_PASSWORD:${MYSQLPASSWORD:mohit123}}}")
    private String rawPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        // Try configured PostgreSQL / MySQL database
        if (rawUrl != null && !rawUrl.trim().isEmpty()) {
            try {
                HikariDataSource ds = createRemoteDataSource(rawUrl.trim(), rawUser, rawPassword);
                // Validate connectivity
                try (Connection conn = ds.getConnection()) {
                    log.info("✅ Successfully connected to external database: {}", ds.getJdbcUrl());
                    return ds;
                } catch (Exception e) {
                    log.warn("⚠️ Could not connect to configured database ({}). Error: {}. Falling back to embedded H2.", rawUrl, e.getMessage());
                    ds.close();
                }
            } catch (Exception e) {
                log.warn("⚠️ Failed to parse or initialize database URL {}: {}. Falling back to embedded H2.", rawUrl, e.getMessage());
            }
        }

        // Try local MySQL if localhost connection succeeds
        try {
            String localMysql = "jdbc:mysql://localhost:3306/estatesphere?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
            HikariDataSource mysqlDs = new HikariDataSource();
            mysqlDs.setJdbcUrl(localMysql);
            mysqlDs.setUsername(rawUser != null ? rawUser : "root");
            mysqlDs.setPassword(rawPassword != null ? rawPassword : "root");
            mysqlDs.setDriverClassName("com.mysql.cj.jdbc.Driver");
            mysqlDs.setConnectionTimeout(2000);
            mysqlDs.setValidationTimeout(1500);

            try (Connection conn = mysqlDs.getConnection()) {
                log.info("✅ Connected to local MySQL at localhost:3306");
                return mysqlDs;
            } catch (Exception e) {
                mysqlDs.close();
            }
        } catch (Exception ignored) {
        }

        // Resilient Fallback: Embedded H2 database (PostgreSQL mode)
        log.info("🚀 Initializing embedded In-Memory Database (H2 PostgreSQL Mode) so application starts cleanly on cloud...");
        HikariConfig h2Config = new HikariConfig();
        h2Config.setDriverClassName("org.h2.Driver");
        h2Config.setJdbcUrl("jdbc:h2:mem:estatesphere;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE");
        h2Config.setUsername("sa");
        h2Config.setPassword("");
        h2Config.setMaximumPoolSize(10);
        return new HikariDataSource(h2Config);
    }

    private HikariDataSource createRemoteDataSource(String url, String defaultUser, String defaultPassword) {
        HikariConfig config = new HikariConfig();
        config.setConnectionTimeout(5000);
        config.setValidationTimeout(3000);
        config.setMaximumPoolSize(10);

        String jdbcUrl = url;
        String user = defaultUser;
        String password = defaultPassword;

        // Convert postgres:// or postgresql:// to proper JDBC URL and extract auth if present
        if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
            try {
                String clean = url.replace("postgres://", "http://").replace("postgresql://", "http://");
                URI uri = new URI(clean);
                if (uri.getUserInfo() != null) {
                    String[] userParts = uri.getUserInfo().split(":", 2);
                    user = userParts[0];
                    if (userParts.length > 1) {
                        password = userParts[1];
                    }
                }
                int port = uri.getPort() != -1 ? uri.getPort() : 5432;
                String path = (uri.getPath() != null && !uri.getPath().isEmpty() && !uri.getPath().equals("/")) ? uri.getPath() : "/postgres";
                String query = uri.getQuery() != null ? ("?" + uri.getQuery()) : "?sslmode=require";
                
                jdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + port + path + query;
            } catch (Exception e) {
                log.warn("Could not parse URI {}, prepending jdbc: directly", url);
                jdbcUrl = "jdbc:" + url;
            }
            config.setDriverClassName("org.postgresql.Driver");
        } else if (url.startsWith("jdbc:postgresql:")) {
            config.setDriverClassName("org.postgresql.Driver");
        } else if (url.startsWith("jdbc:mysql:")) {
            config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        }

        config.setJdbcUrl(jdbcUrl);
        if (user != null && !user.isEmpty()) {
            config.setUsername(user);
        }
        if (password != null && !password.isEmpty()) {
            config.setPassword(password);
        }

        return new HikariDataSource(config);
    }
}
