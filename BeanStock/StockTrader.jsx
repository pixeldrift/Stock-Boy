// Create a dockable panel in After Effects
(function() {
    var mainPanel = (this instanceof Panel) ? this : new Window("palette", "StockTrader", undefined, {resizeable: true});

    // Add a button to the main panel
    var precompButton = mainPanel.add("button", undefined, "Create Footage Precomps");
    var reportButton = mainPanel.add("button", undefined, "Generate Footage Report");

    // Define the button's onClick action
    reportButton.onClick = function() {
        // Get the active composition
        var activeComp = app.project.activeItem;
        
        if (activeComp && activeComp instanceof CompItem) {
            // Create an object to hold unique footage source filenames
            var uniqueFootage = {};
            var footageFound = false;

            // Function to collect footage from layers
            function collectFootage(comp) {
                for (var i = 1; i <= comp.numLayers; i++) {
                    var layer = comp.layer(i);
                    
                    // Check if the layer is a footage layer
                    if (layer.source && layer.source instanceof FootageItem) {
                        var fileName = layer.source.file ? layer.source.file.name : layer.source.name;
                        uniqueFootage[fileName] = true; // Use object keys to store unique filenames
                        footageFound = true;
                    }

                    // If the layer is a precomp, collect footage from that precomp
                    if (layer.source && layer.source instanceof CompItem) {
                        collectFootage(layer.source);
                    }
                }
            }

            // Collect footage from the active composition
            collectFootage(activeComp);

            // Generate the report               
            var report = "";
            for (var name in uniqueFootage) {
                report += name + "\n";
            }

            // Check if any footage was found
            if (!footageFound) {
                alert("No footage found in the selected composition.");
            } else {
                // Open the report panel
                createReportPanel(report);
            }
        } else {
            alert("Please select a composition.");
        }
    };

    // Function to copy text to clipboard based on OS
    function copyToClipboard(text) {
        var command;

        if ($.os.indexOf("Windows") !== -1) {
            command = 'cmd.exe /c "echo ' + text + ' | clip"'; // Windows command
        } else {
            command = 'echo "' + text + '" | pbcopy'; // macOS command
        }

        // Execute the command
        try {
            system.callSystem(command);
        } catch (e) {
            alert("Failed to copy to clipboard: " + e.message);
        }
    }

    // Function to create a dockable panel with the text box and buttons
    function createReportPanel(report) {
        
        var reportPanel = new Window("palette", "Footage Source Report", undefined, {resizeable: true});

        //Create status summary of results
        var resultMessage = "Found " + report.split(/\n/).length + " unique footage items used in this comp and its sub-comps.";
        var resultText = reportPanel.add("StaticText", undefined, resultMessage);

        // Create an editable text box
        var textBox = reportPanel.add("edittext", undefined, report, {multiline: true, wantReturn: true});
        textBox.preferredSize = [300, 200];

        // Add a button to copy text to clipboard
        var copyButton = reportPanel.add("button", undefined, "Copy to Clipboard");
        
        // Define the copy button's onClick action
        copyButton.onClick = function() {
            copyToClipboard(textBox.text);
        };

        // Add a close button
        var closeButton = reportPanel.add("button", undefined, "Close");
        closeButton.onClick = function() {
            reportPanel.close();
        };

        // Show the report panel
        reportPanel.show();
    }

    // Show the main panel
    if (mainPanel instanceof Window) {
        mainPanel.center();
        mainPanel.show();
    }

})();
