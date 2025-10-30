import java.util.*;
import java.util.stream.Collectors;

class Column {
    String name;
    String type;
    
    public Column(String name, String type) {
        this.name = name;
        this.type = type;
    }
}

class Table {
    private String name;
    private List<Column> columns;
    private List<Map<String, Object>> rows;
    
    public Table(String name, List<Column> columns) {
        this.name = name;
        this.columns = columns;
        this.rows = new ArrayList<>();
    }
    
    public void insert(Map<String, Object> row) {
        rows.add(new HashMap<>(row));
    }
    
    public List<Map<String, Object>> select(List<String> columnNames, 
                                           String whereColumn, 
                                           String whereValue) {
        return rows.stream()
            .filter(row -> whereColumn == null || 
                          row.get(whereColumn).toString().equals(whereValue))
            .map(row -> {
                if(columnNames.contains("*")) {
                    return row;
                }
                Map<String, Object> filtered = new HashMap<>();
                for(String col : columnNames) {
                    filtered.put(col, row.get(col));
                }
                return filtered;
            })
            .collect(Collectors.toList());
    }
    
    public void delete(String whereColumn, String whereValue) {
        rows.removeIf(row -> row.get(whereColumn).toString().equals(whereValue));
    }
    
    public void update(String setColumn, Object setValue, 
                      String whereColumn, String whereValue) {
        rows.stream()
            .filter(row -> row.get(whereColumn).toString().equals(whereValue))
            .forEach(row -> row.put(setColumn, setValue));
    }
    
    public String getName() { return name; }
    public List<Column> getColumns() { return columns; }
}

public class InMemoryDatabase {
    private Map<String, Table> tables;
    
    public InMemoryDatabase() {
        this.tables = new HashMap<>();
    }
    
    public void createTable(String tableName, List<Column> columns) {
        if(tables.containsKey(tableName)) {
            System.out.println("Table already exists!");
            return;
        }
        tables.put(tableName, new Table(tableName, columns));
        System.out.println("Table '" + tableName + "' created successfully!");
    }
    
    public void insert(String tableName, Map<String, Object> values) {
        Table table = tables.get(tableName);
        if(table == null) {
            System.out.println("Table not found!");
            return;
        }
        table.insert(values);
        System.out.println("Row inserted successfully!");
    }
    
    public void select(String tableName, List<String> columns, 
                      String whereColumn, String whereValue) {
        Table table = tables.get(tableName);
        if(table == null) {
            System.out.println("Table not found!");
            return;
        }
        
        List<Map<String, Object>> results = table.select(columns, whereColumn, whereValue);
        
        System.out.println("\n=== Query Results ===");
        if(results.isEmpty()) {
            System.out.println("No rows found.");
        } else {
            results.forEach(System.out::println);
        }
    }
    
    public void delete(String tableName, String whereColumn, String whereValue) {
        Table table = tables.get(tableName);
        if(table == null) {
            System.out.println("Table not found!");
            return;
        }
        table.delete(whereColumn, whereValue);
        System.out.println("Row(s) deleted successfully!");
    }
    
    public void update(String tableName, String setColumn, Object setValue,
                      String whereColumn, String whereValue) {
        Table table = tables.get(tableName);
        if(table == null) {
            System.out.println("Table not found!");
            return;
        }
        table.update(setColumn, setValue, whereColumn, whereValue);
        System.out.println("Row(s) updated successfully!");
    }
    
    public static void main(String[] args) {
        InMemoryDatabase db = new InMemoryDatabase();
        
        // Create table
        List<Column> columns = Arrays.asList(
            new Column("id", "INTEGER"),
            new Column("name", "STRING"),
            new Column("age", "INTEGER")
        );
        db.createTable("users", columns);
        
        // Insert data
        Map<String, Object> user1 = new HashMap<>();
        user1.put("id", 1);
        user1.put("name", "Alice");
        user1.put("age", 25);
        db.insert("users", user1);
        
        Map<String, Object> user2 = new HashMap<>();
        user2.put("id", 2);
        user2.put("name", "Bob");
        user2.put("age", 30);
        db.insert("users", user2);
        
        // Select all
        db.select("users", Arrays.asList("*"), null, null);
        
        // Select with WHERE clause
        db.select("users", Arrays.asList("name", "age"), "name", "Alice");
        
        // Update
        db.update("users", "age", 26, "name", "Alice");
        db.select("users", Arrays.asList("*"), null, null);
        
        // Delete
        db.delete("users", "name", "Bob");
        db.select("users", Arrays.asList("*"), null, null);
    }
}
