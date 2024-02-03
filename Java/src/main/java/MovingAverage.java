import java.util.LinkedList;
import java.util.Queue;

public class MovingAverage {
    private final Queue<Double> window = new LinkedList<>(); // Window of numbers for moving average
    private final int period; // Number of periods for moving average
    private double sum; // Sum of numbers in the window

    // Constructor to initialize the period
    public MovingAverage(int period) {
        this.period = period;
    }

    // Method to add a new value and update the moving average
    public void add(double num) {
        sum += num;
        window.add(num);
        if (window.size() > period) {
            sum -= window.remove(); // Remove the oldest number from the sum and the window
        }
    }

    // Method to get the current moving average
    public double getAverage() {
        if (window.isEmpty()) return 0; // If no values have been added yet, the average is undefined (return 0)
        return sum / window.size(); // Return the average of the numbers in the window
    }
}
