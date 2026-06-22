import { onCLS, onLCP, onFCP, onTTFB, onINP, type Metric } from "web-vitals";
import * as Sentry from "@sentry/react";

function sendToSentry(metric: Metric) {
  Sentry.addBreadcrumb({
    category: "web-vital",
    message: `${metric.name}: ${metric.value}`,
    level: "info",
    data: {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
    },
  });

  // Send as custom measurement
  const transaction = Sentry.getActiveSpan();
  if (transaction) {
    Sentry.setMeasurement(
      metric.name,
      metric.value,
      metric.name === "CLS" ? "" : "millisecond",
    );
  }
}

export function initWebVitals() {
  onCLS(sendToSentry);
  onLCP(sendToSentry);
  onFCP(sendToSentry);
  onTTFB(sendToSentry);
  onINP(sendToSentry);
}
