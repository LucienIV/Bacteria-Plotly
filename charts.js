// Initialize the dashboard
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
init();
// Fetch new data each time a new sample is selected
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}
// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}
// Create Chart Building Function
function buildCharts(sample) {
  // Load Sample File
  d3.json("samples.json").then((data) => {
    // Create variables to hold the samples and metadata arrays
    var samples = data.samples;
    var metadata = data.metadata;
    // Create a variable that filters the samples for the object with the desired sample number
    var selectedSample = samples.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that filters the metadata array for the object with the desired sample number
    var metaSample = metadata.filter(metaObj => metaObj.id == sample);
    //  Create a variable that holds the first sample in the array
    var resultSample = selectedSample[0];
    // Create a variable that holds the first sample in the metadata array
    var metaResult = metaSample[0];
    // Create variables that hold the otu_ids, otu_labels, and sample_values
    var otuIDs = resultSample.otu_ids;
    var otuLabels = resultSample.otu_labels;
    var sampleValues = resultSample.sample_values;   
    // Create a variable that holds the washing frequency
    var washFreq = metaResult.wfreq;
    // Create the yticks for the bar chart
    var yticks = otuIDs.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();  
    // Create Bar Chart
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h",
      marker: {colorscale: "Viridis",color:otuIDs}
    }];
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
     plot_bgcolor: "rgba(0,0,0,0)",
     paper_bgcolor: "rgba(0,0,0,0)",
     font: {color: "darkblue",size: 14,family: "Roboto, monospace"}
    };
    Plotly.newPlot("bar", barData, barLayout)
    // Create Bubble Chart
    var bubbleData = [{
      x: otuIDs,
      y: sampleValues,
      text: otuLabels,
      type: "bubble",
      mode: "markers",
      marker: {colorscale: 'Viridis',color: otuIDs,size: sampleValues}
    }];
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      hovermode: "closest",
      plot_bgcolor: "rgba(0,0,0,0)",
      paper_bgcolor: "rgba(0,0,0,0)",
      font: {color: "darkblue",size: 14,family: "Roboto, monospace"}
    };
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    // Create Gauge Chart
    var gaugeData = [{
      value: washFreq,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "Belly Button Washing Frequency"},
      gauge: {
        axis: {range: [0,10]},
        steps: [
          {range: [0,2], color: "red"},
          {range: [2,4], color: "orange"},
          {range: [4,6], color: "gold"},
          {range: [6,8], color: "lime"},
          {range: [8,10], color: "darkcyan"}
        ],
        bar: {color: "black"}
      }
    }];
    var gaugeLayout = { 
      font: { color: "black"},
      plot_bgcolor: "rgba(0,0,0,0)",
      paper_bgcolor: "rgba(0,0,0,0)",
      font: {color: "darkblue",size: 14,family: "Roboto, monospace"}
    };
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
