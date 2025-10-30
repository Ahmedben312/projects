import java.util.concurrent.*;
import java.util.Random;
import java.util.List;
import java.util.ArrayList;

class FileDownloader implements Callable<String> {
    private String fileName;
    private int fileSize; // in MB
    
    public FileDownloader(String fileName, int fileSize) {
        this.fileName = fileName;
        this.fileSize = fileSize;
    }
    
    @Override
    public String call() throws Exception {
        System.out.println(Thread.currentThread().getName() + " starting download: " + fileName + " (" + fileSize + " MB)");
        
        Random random = new Random();
        int progress = 0;
        
        // Simulate occasional download failure (10% chance)
        if (random.nextInt(100) < 10) {
            throw new Exception("Network error while downloading " + fileName);
        }
        
        while(progress < fileSize) {
            Thread.sleep(500); // Simulate download time
            int downloaded = random.nextInt(5) + 1;
            progress += downloaded;
            
            if(progress > fileSize) progress = fileSize;
            
            int percentage = (progress * 100) / fileSize;
            System.out.println(fileName + ": " + percentage + "% complete (" + progress + "/" + fileSize + " MB)");
        }
        
        return fileName + " downloaded successfully!";
    }
}

public class MultiThreadedDownloader {
    public static void main(String[] args) {
        ExecutorService executor = Executors.newFixedThreadPool(3);
        
        String[] files = {
            "document.pdf",
            "video.mp4",
            "image.jpg",
            "software.zip",
            "music.mp3"
        };
        
        int[] sizes = {10, 25, 5, 50, 8}; // MB
        
        System.out.println("=== Multi-threaded File Downloader ===\n");
        
        List<Future<String>> futures = new ArrayList<>();
        
        for(int i = 0; i < files.length; i++) {
            FileDownloader downloader = new FileDownloader(files[i], sizes[i]);
            Future<String> future = executor.submit(downloader);
            futures.add(future);
        }
        
        System.out.println("\nAll downloads started!\n");
        
        for(Future<String> future : futures) {
            try {
                String result = future.get();
                System.out.println("✓ " + result);
            } catch(InterruptedException e) {
                System.out.println("Download interrupted: " + e.getMessage());
            } catch(ExecutionException e) {
                System.out.println("✗ Download failed: " + e.getCause().getMessage());
            }
        }
        
        executor.shutdown();
        
        try {
            if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
            Thread.currentThread().interrupt();
        }
        
        System.out.println("\nAll downloads completed!");
    }
}