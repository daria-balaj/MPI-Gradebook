package api.util;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class BackupScheduler {

    // Database configuration
    private final String dbHost = "localhost";
    private final String dbPort = "5432";
    private final String dbName = "school_db";
    private final String dbUser = "postgres";
    private final String dbPassword = "1q2w3e";

    // Backup configuration
    private final String backupFolder = "C:/backups/";
    private final String pgDumpPath = "C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe";
    private final int maxBackupsToKeep = 5;
    private final String[] tablesToBackup = {
            "assignment_submissions",
            "assignments",
            "course_participants",
            "courses",
            "flyway_schema_history",
            "grades",
            "users"
    };

    @Scheduled(cron = "0 0 2 * * *") // Every day at 2:00 AM
    public void backupDatabase() {

        try {
            System.out.println("Starting database backup...");

            Path backupDir = Paths.get(backupFolder).toAbsolutePath();
            if (!Files.exists(backupDir)) {
                Files.createDirectories(backupDir);
                System.out.println("Created backup directory: " + backupDir);
            }

            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String backupFileName = "backup_" + timestamp + ".dump";
            Path backupFilePath = backupDir.resolve(backupFileName);

            List<String> command = new ArrayList<>();
            command.add(pgDumpPath);
            command.add("-h");
            command.add(dbHost);
            command.add("-p");
            command.add(dbPort);
            command.add("-U");
            command.add(dbUser);
            command.add("-d");
            command.add(dbName);
            command.add("-Fc");
            command.add("-f");
            command.add(backupFilePath.toString());

            for (String table : tablesToBackup) {
                command.add("-t");
                command.add(table);
            }


            ProcessBuilder processBuilder = new ProcessBuilder(command);
            processBuilder.environment().put("PGPASSWORD", dbPassword);
            processBuilder.redirectErrorStream(true);

            System.out.println("Executing: " + String.join(" ", command));

            Process process = processBuilder.start();


            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println(line);
                }
            }

            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("Database backup completed successfully: " + backupFilePath);
                System.out.println("Backup size: " +
                        Files.size(backupFilePath) / 1024 + " KB");
            } else {
                System.err.println("Database backup failed. Exit code: " + exitCode);

                Files.deleteIfExists(backupFilePath);
            }

        } catch (IOException | InterruptedException e) {
            System.err.println("Backup failed: " + e.getMessage());
            e.printStackTrace();
        }
        try {
            cleanupOldBackups();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
    private void cleanupOldBackups() throws IOException {
        List<Path> backups = Files.list(Paths.get(backupFolder))
                .filter(p -> p.toString().endsWith(".dump"))
                .sorted()
                .collect(Collectors.toList());

        if (backups.size() > maxBackupsToKeep) {
            for (int i = 0; i < backups.size() - maxBackupsToKeep; i++) {
                Files.delete(backups.get(i));
                System.out.println("Deleted old backup: " + backups.get(i));
            }
        }
    }
}