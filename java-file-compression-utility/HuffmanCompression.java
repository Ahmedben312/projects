import java.io.*;
import java.util.*;

class HuffmanNode implements Comparable<HuffmanNode> {
    char character;
    int frequency;
    HuffmanNode left, right;
    
    public HuffmanNode(char character, int frequency) {
        this.character = character;
        this.frequency = frequency;
    }
    
    @Override
    public int compareTo(HuffmanNode other) {
        return this.frequency - other.frequency;
    }
}

public class HuffmanCompression {
    private Map<Character, String> huffmanCodes;
    private HuffmanNode root;
    
    public HuffmanCompression() {
        huffmanCodes = new HashMap<>();
    }
    
    private Map<Character, Integer> buildFrequencyTable(String text) {
        Map<Character, Integer> frequencyMap = new HashMap<>();
        for(char c : text.toCharArray()) {
            frequencyMap.put(c, frequencyMap.getOrDefault(c, 0) + 1);
        }
        return frequencyMap;
    }
    
    private HuffmanNode buildHuffmanTree(Map<Character, Integer> frequencyMap) {
        PriorityQueue<HuffmanNode> pq = new PriorityQueue<>();
        
        for(Map.Entry<Character, Integer> entry : frequencyMap.entrySet()) {
            pq.offer(new HuffmanNode(entry.getKey(), entry.getValue()));
        }
        
        while(pq.size() > 1) {
            HuffmanNode left = pq.poll();
            HuffmanNode right = pq.poll();
            
            HuffmanNode parent = new HuffmanNode('\0', left.frequency + right.frequency);
            parent.left = left;
            parent.right = right;
            
            pq.offer(parent);
        }
        
        return pq.poll();
    }
    
    private void generateCodes(HuffmanNode node, String code) {
        if(node == null) return;
        
        if(node.left == null && node.right == null) {
            huffmanCodes.put(node.character, code);
            return;
        }
        
        generateCodes(node.left, code + "0");
        generateCodes(node.right, code + "1");
    }
    
    public String compress(String text) {
        if(text == null || text.isEmpty()) {
            return "";
        }
        
        Map<Character, Integer> frequencyMap = buildFrequencyTable(text);
        root = buildHuffmanTree(frequencyMap);
        generateCodes(root, "");
        
        StringBuilder compressed = new StringBuilder();
        for(char c : text.toCharArray()) {
            compressed.append(huffmanCodes.get(c));
        }
        
        return compressed.toString();
    }
    
    public String decompress(String compressed) {
        if(compressed == null || compressed.isEmpty() || root == null) {
            return "";
        }
        
        StringBuilder decompressed = new StringBuilder();
        HuffmanNode current = root;
        
        for(char bit : compressed.toCharArray()) {
            current = (bit == '0') ? current.left : current.right;
            
            if(current.left == null && current.right == null) {
                decompressed.append(current.character);
                current = root;
            }
        }
        
        return decompressed.toString();
    }
    
    public void displayCodes() {
        System.out.println("\n=== Huffman Codes ===");
        huffmanCodes.forEach((character, code) -> 
            System.out.println("'" + character + "' : " + code));
    }
    
    public double getCompressionRatio(String original, String compressed) {
        int originalBits = original.length() * 8;
        int compressedBits = compressed.length();
        return (1 - (double)compressedBits / originalBits) * 100;
    }
    
    public static void main(String[] args) {
        HuffmanCompression huffman = new HuffmanCompression();
        
        String text = "huffman coding is a compression algorithm";
        System.out.println("Original text: " + text);
        System.out.println("Original size: " + (text.length() * 8) + " bits\n");
        
        String compressed = huffman.compress(text);
        System.out.println("Compressed: " + compressed);
        System.out.println("Compressed size: " + compressed.length() + " bits");
        
        huffman.displayCodes();
        
        String decompressed = huffman.decompress(compressed);
        System.out.println("\nDecompressed: " + decompressed);
        System.out.println("Match: " + text.equals(decompressed));
        
        System.out.println("\nCompression ratio: " + 
                         String.format("%.2f", huffman.getCompressionRatio(text, compressed)) + "%");
    }
}