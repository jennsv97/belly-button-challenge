// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;


    // Filter the metadata for the object with the desired sample number
    let result = metadata.filter(obj => obj.id == sample)[0];


    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    // I used chatGPT to create my panel.append loop
    if (result) {
      Object.entries(result).forEach(([key, value]) => {
        panel.append("p").text(`${key}: ${value}`);
      });
    }

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;


    // Filter the samples for the object with the desired sample number
    let results = samples.filter(obj => obj.id == sample)[0];


    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = results.otu_ids;
    let otu_labels = results.otu_labels;
    let sample_values = results.sample_values;


    // Build a Bubble Chart
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      markers: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }
    //Layout ( copied the names on the provided UCI Dashboard images )
    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria", range: [0, 250]},
      hovermode: "closest"
    };


    // Render the Bubble Chart
    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let x_ticks = sample_values.slice(0, 10).reverse();
    let y_ticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    let text_labels = otu_labels.slice(0, 10).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barTrace = {
      x: x_ticks,
      y: y_ticks,
      text: text_labels,
      type: "bar",
      orientation: "h",
      marker: { color: "blue" }
    };
    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 },
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", [barTrace], barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach((sample) => {
      dropdown.append("option").text(`Sample ${sample}`).property("value", sample);
    });

    // Get the first sample from the list
    let firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
