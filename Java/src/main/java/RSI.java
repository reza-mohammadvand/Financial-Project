public class RSI {
    private final MovingAverage gains; // Moving average of gains
    private final MovingAverage losses; // Moving average of losses
    private Double lastClosingPrice = null; // Last closing price

    // Constructor to initialize the period for moving averages
    public RSI(int period) {
        gains = new MovingAverage(period);
        losses = new MovingAverage(period);
    }

    // Method to add a new closing price and update the RSI
    public void add(double closingPrice) {
        if (lastClosingPrice != null) {
            double change = closingPrice - lastClosingPrice;
            if (change > 0) {
                gains.add(change); // If the price has increased, add the gain
                losses.add(0); // No loss
            } else {
                gains.add(0); // No gain
                losses.add(-change); // If the price has decreased, add the loss
            }
        }
        lastClosingPrice = closingPrice; // Update the last closing price
    }

    // Method to get the current RSI
    public double getRSI() {
        double avgGain = gains.getAverage();
        double avgLoss = losses.getAverage();

        if (avgLoss == 0) {
            if (avgGain == 0) {
                return 50; // If the price didn't change, the RSI is 50
            } else {
                return 100; // If the price only gained, the RSI is 100
            }
        }

        double rs = avgGain / avgLoss; // Calculate the relative strength (RS)
        return 100 - (100 / (1 + rs)); // Calculate the RSI
    }
}
