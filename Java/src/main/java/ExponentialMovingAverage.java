public class ExponentialMovingAverage {
    private final double alpha; // Smoothing factor
    private Double oldValue; // Previous EMA value

    // Constructor to initialize the smoothing factor
    public ExponentialMovingAverage(double alpha) {
        this.alpha = alpha;
    }

    // Method to add a new value and update the EMA
    public void add(double value) {
        if (oldValue == null) {
            oldValue = value; // If it's the first value, the EMA is the value itself
        } else {
            oldValue = oldValue + alpha * (value - oldValue); // Calculate the weighted average of the new value and the old EMA
        }
    }

    // Method to get the current EMA
    public double getAverage() {
        if (oldValue == null) {
            return 0; // If no values have been added yet, the average is undefined (return 0)
        }
        return oldValue; // Return the current EMA
    }
}
