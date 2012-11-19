/*
 * Cubite - Client-side time vizualization.
 * Powered by Cubism.js + Graphite
 *
 * Usage:
 * <script>
 *   var cubite = new Cubite(
 *     "http://graphite.server.host.com",
 *     [
 *       {label: "Metric1", target: "avg(graphite.target.metric1)"},
 *       {label: "Metric2", target: "avg(graphite.target.metric2)"},
 *       {label: "Metric3", target: "avg(graphite.target.metric3)"},
 *     ]
 *   );
 *   cubite.render("body");
 * </script>
 */

var Cubite = function(host, metrics, opts) {
  this.host = host;
  this.metrics = metrics;

  // Set optional configuration

  opts = opts || {};
  this.step = opts.step || 1e4; // 10 sec
  this.size = opts.size || 960;
  this.title = "Cubite" + (opts.title ? " - " + opts.title : "");
  this.metric_function = opts.metric_function || function(cubite) {
    return function(metric) {
      return cubite.graphite.metric(metric.target)
        .summarize("avg").alias(metric.label);
    }
  };
  // TODO(msmathers): Validate metrics, metric_function
}

Cubite.prototype = {
  render: function(selector) {

    // Apply title/size configuration

    d3.select(selector).append("h1").text(this.title);
    d3.select(selector).attr("style", "width: " + this.size + "px");
    d3.select("title").text(this.title);

    // Build cubism.js context

    var context = cubism.context()
        .step(this.step)
        .size(this.size)

    this.graphite = context.graphite(this.host);

    // Render axes & rules

    d3.select(selector).selectAll(".axis")
        .data(["top", "bottom"])
      .enter().append("div")
        .attr("class", function(d) { return d + " axis"; })
        .each(function(d) { d3.select(this).call(context.axis().ticks(12).orient(d)); });

    d3.select(selector).append("div")
        .attr("class", "rule")
        .call(context.rule());

    // Render Graphite data into Cubism.js metrics

    d3.select(selector).selectAll(".horizon")
        .data(this.metrics.map(this.metric_function(this)))
      .enter().insert("div", ".bottom")
        .attr("class", "horizon")
        .call(context.horizon());

    // Hover tooltip

    context.on("focus", function(i) {
      d3.selectAll(".value").style("right", i == null ? null : context.size() - i + "px");
    });

    return this;
  }
}
