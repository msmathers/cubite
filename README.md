Cubite - Client-side time series vizualization
==============================================

Powered by [Cubism.js](http://square.github.com/cubism/) + [Graphite](http://graphite.wikidot.com/)

![Cubite Screenshot](http://107.21.233.214/images/cubite_screenshot.png)

## What is Cubite?

Cubite uses your browser to render multiple Graphite data series into horizon charts. It is a thin wrapper around the Graphite metric hooks in Cubism.js with boilerplate JS/CSS/HTML. By modifying an HTML file, you can quickly build a fully client-side dashboard for time series vizualization.

Requires a Graphite server accessible via browser.

## Usage

```html
<script>
var cubite = new Cubite(
  "http://graphite.server.host.com",
  [
    {label: "Metric1", target: "avg(graphite.target.metric1)"},
    {label: "Metric2", target: "avg(graphite.target.metric2)"},
    {label: "Metric3", target: "avg(graphite.target.metric3)"}
  ]
);
cubite.render("body");
</script>
```

## Build your own

1) Clone the repo

    git clone git://github.com/msmathers/cubite.git

2) Modify or copy cubite.html.  Configure your Graphite host & targets.

    cd cubite
    cp cubite.html my_dashboard.html
    nano my_dashboard.html

3) Open my_dashboard.html in browser

## Configuration

Cubite(host, metrics, config) accepts an optional third argument for additional configuration, as follows:

```
{
    title: "Dashboard Title", // Sets <h1>, <title> elements
    step: 1e4, // Update frequency, default 10 sec
    size: 960 // Pixel width, default 960px,
    metric_function: function(cubite) { // Cubism.js metric factory
      return function(metric) {
        return cubite.graphite.metric(metric.target)
          .summarize("avg").alias(metric.label);
      }
    }
}
```

## Tips

- Use the 'keepLastValue()' function in your graphite target definitions to smooth out sparse data sets.
- Host the /static/ directory on a server and update the static paths in cubite.html. Now all you need is an HTML file.
- If graphite is behind HTTPS with an uncertified SSL cert, you will have to manually visit your graphite host in the browser to allow an cert exception.

## Author

- Mike Smathers ([msmathers](http://github.com/msmathers))

## Acknowledgements

- Square ([square](http://github.com/square))
