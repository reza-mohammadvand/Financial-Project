public class ExponentialMovingAverage {
    private final double alpha;
    private Double oldValue;

    public ExponentialMovingAverage(double alpha) {
        this.alpha = alpha;
    }

    public void add(double value) {
        if (oldValue == null) {
            oldValue = value;
        } else {
            oldValue = oldValue + alpha * (value - oldValue);
        }
    }

    public double getAverage() {
        if (oldValue == null) {
            return 0; // technically the average is undefined
        }
        return oldValue;
    }
}
