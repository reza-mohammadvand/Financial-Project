public class RSI {
    private final MovingAverage gains;
    private final MovingAverage losses;
    private Double lastClosingPrice = null;

    public RSI(int period) {
        gains = new MovingAverage(period);
        losses = new MovingAverage(period);
    }

    public void add(double closingPrice) {
        if (lastClosingPrice != null) {
            double change = closingPrice - lastClosingPrice;
            if (change > 0) {
                gains.add(change);
                losses.add(0);
            } else {
                gains.add(0);
                losses.add(-change);
            }
        }
        lastClosingPrice = closingPrice;
    }

    public double getRSI() {
        double avgGain = gains.getAverage();
        double avgLoss = losses.getAverage();

        if (avgLoss == 0) {
            if (avgGain == 0) {
                // Price didn't change
                return 50;
            } else {
                // Price only gained, no losses
                return 100;
            }
        }

        double rs = avgGain / avgLoss;
        return 100 - (100 / (1 + rs));
    }
}
