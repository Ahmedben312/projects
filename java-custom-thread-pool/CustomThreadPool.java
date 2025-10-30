import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;

class WorkerThread extends Thread {
    private BlockingQueue<Runnable> taskQueue;
    private AtomicBoolean isStopped;
    
    public WorkerThread(BlockingQueue<Runnable> queue) {
        this.taskQueue = queue;
        this.isStopped = new AtomicBoolean(false);
    }
    
    @Override
    public void run() {
        while(!isStopped.get()) {
            try {
                Runnable task = taskQueue.poll(1, TimeUnit.SECONDS);
                if(task != null) {
                    task.run();
                }
            } catch(InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }
    
    public void stopWorker() {
        isStopped.set(true);
    }
}

public class CustomThreadPool {
    private BlockingQueue<Runnable> taskQueue;
    private WorkerThread[] workers;
    private AtomicBoolean isShutdown;
    
    public CustomThreadPool(int poolSize, int queueCapacity) {
        this.taskQueue = new ArrayBlockingQueue<>(queueCapacity);
        this.workers = new WorkerThread[poolSize];
        this.isShutdown = new AtomicBoolean(false);
        
        for(int i = 0; i < poolSize; i++) {
            workers[i] = new WorkerThread(taskQueue);
            workers[i].start();
        }
        
        System.out.println("Thread pool initialized with " + poolSize + " workers");
    }
    
    public void submit(Runnable task) throws InterruptedException {
        if(isShutdown.get()) {
            throw new IllegalStateException("Thread pool is shut down!");
        }
        taskQueue.put(task);
    }
    
    public void shutdown() {
        isShutdown.set(true);
        for(WorkerThread worker : workers) {
            worker.stopWorker();
        }
        
        for(WorkerThread worker : workers) {
            try {
                worker.join();
            } catch(InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        System.out.println("Thread pool shut down");
    }
    
    public int getQueueSize() {
        return taskQueue.size();
    }
    
    // Demo
    public static void main(String[] args) throws InterruptedException {
        CustomThreadPool pool = new CustomThreadPool(4, 10);
        
        for(int i = 1; i <= 20; i++) {
            final int taskNumber = i;
            pool.submit(() -> {
                System.out.println("Task " + taskNumber + " started by " + 
                                 Thread.currentThread().getName());
                try {
                    Thread.sleep(2000);
                } catch(InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                System.out.println("Task " + taskNumber + " completed");
            });
        }
        
        Thread.sleep(10000);
        pool.shutdown();
    }
}