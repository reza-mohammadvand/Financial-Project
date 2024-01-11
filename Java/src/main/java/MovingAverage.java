import java.util.LinkedList;
import java.util.Queue;

public class MovingAverage {
    private final Queue<Double> window = new LinkedList<>();
    private final int period;
    private double sum;

    public MovingAverage(int period) {
        this.period = period;
    }

    public void add(double num) {
        sum += num;
        window.add(num);
        if (window.size() > period) {
            sum -= window.remove();
        }
    }

    public double getAverage() {
        if (window.isEmpty()) return 0; // technically the average is undefined
        return sum / window.size();
    }
}

