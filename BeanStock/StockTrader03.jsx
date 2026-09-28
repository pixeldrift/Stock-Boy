// Stock Trader
// An After Effects script for helping manage stock footage
// by Nathan D. B. Pizar (nathan@pizar.net)

(function() {

    // Create the dockable UI

    // Main Panel
    var mainPanel = new Window("palette", undefined, undefined, {resizeable: true}); 
    mainPanel.text = "🔀 StockSwapper v0.1"; 
    mainPanel.orientation = "column"; 
    mainPanel.alignChildren = ["center","top"]; 
    mainPanel.spacing = 10; 
    mainPanel.margins = 16; 

    // Panel Group - Create Precomps
    var createPrecompsPanel = mainPanel.add("panel", undefined, undefined, {name: "createPrecompsPanel"}); 
    createPrecompsPanel.text = "1:  Precompose preview footage"; 
    createPrecompsPanel.orientation = "column"; 
    createPrecompsPanel.alignChildren = ["left","top"]; 
    createPrecompsPanel.spacing = 10;
    createPrecompsPanel.margins = 20;
    createPrecompsPanel.alignment = ["fill","top"]; 
    

    var precompButton = createPrecompsPanel.add("button", undefined, undefined, {name: "precompButton"}); 
    precompButton.text = "Create Footage Precomps"; 
    precompButton.alignment = ["center","top"]; 

    // Radio Button Group - Precomp size
    var footageSizeRadioGroup = createPrecompsPanel.add("group", undefined, {name: "footageSizeRadioGroup"}); 
    footageSizeRadioGroup.orientation = "row"; 
    footageSizeRadioGroup.alignChildren = ["center","center"]; 
    footageSizeRadioGroup.spacing = 10; 
    footageSizeRadioGroup.margins = 0; 
    footageSizeRadioGroup.alignment = ["center","top"]; 

    var radioButtonHD = footageSizeRadioGroup.add("radiobutton", undefined, undefined, {name: "radioButtonHD"}); 
    radioButtonHD.text = "HD"; 
    radioButtonHD.value = true;

    var radioButton4k = footageSizeRadioGroup.add("radiobutton", undefined, undefined, {name: "radioButton4k"}); 
    radioButton4k.text = "4K"; 

    // Panel Group - Tag Footage Source
    var tagSourcePanel = mainPanel.add("panel", undefined, undefined, {name: "tagSourcePanel"}); 
    tagSourcePanel.text = "2:  Identify what site your clips are from"; 
    tagSourcePanel.orientation = "column"; 
    tagSourcePanel.alignChildren = ["left","top"]; 
    tagSourcePanel.spacing = 10; 
    tagSourcePanel.margins = 20;
    tagSourcePanel.alignment = ["fill","top"]; 

    var tagSourceButton = tagSourcePanel.add("button", undefined, undefined, {name: "tagSourceButton"}); 
    tagSourceButton.text = "Tag Stock Source"; 
    tagSourceButton.alignment = ["center","top"]; 

    var stockSourcesList_array = ["-Select Stock Site-","Shutterstock","iStockPhoto","AdobeStock","Pond5","Getty","Storyblocks","Artlist","MotionArray","Envato","Artgrid","Alamy"]; 
    var stockSourcesList = tagSourcePanel.add("dropdownlist", undefined, undefined, {name: "stockSourcesList", items: stockSourcesList_array}); 
    stockSourcesList.selection = 0; 
    stockSourcesList.alignment = ["center","top"]; 

    // Panel Group - Replace Footage
    var replaceFootagePanel = mainPanel.add("panel", undefined, undefined, {name: "replaceFootagePanel"}); 
    replaceFootagePanel.text = "3:  Replace previews with purchased clips"; 
    replaceFootagePanel.orientation = "column"; 
    replaceFootagePanel.alignChildren = ["left","top"]; 
    replaceFootagePanel.spacing = 10; 
    replaceFootagePanel.margins = 20;
    replaceFootagePanel.alignment = ["fill","top"]; 

    var replaceFootageButton = replaceFootagePanel.add("button", undefined, undefined, {name: "replaceFootageButton"}); 
    replaceFootageButton.text = "Swap with Purchased"; 
    replaceFootageButton.alignment = ["center","top"]; 

    // Panel Group - Generate Report
    var reportPanel = mainPanel.add("panel", undefined, undefined, {name: "reportPanel"}); 
    reportPanel.text = "4:  Create a list of all utilized footage"; 
    reportPanel.orientation = "column"; 
    reportPanel.alignChildren = ["left","top"]; 
    reportPanel.spacing = 10; 
    reportPanel.margins = 20;
    reportPanel.alignment = ["fill","top"]; 

    var reportButton = reportPanel.add("button", undefined, undefined, {name: "reportButton"}); 
    reportButton.text = "Generate Footage Report"; 
    reportButton.alignment = ["center","top"]; 

    // Radio Button Group - Report Type
    var reportFormatRadioGroup = reportPanel.add("group", undefined, {name: "reportFormatRadioGroup"});
    reportFormatRadioGroup.orientation = "row";
    reportFormatRadioGroup.alignChildren = ["left","center"];
    reportFormatRadioGroup.spacing = 10;
    reportFormatRadioGroup.margins = 0;
    reportFormatRadioGroup.alignment = ["center","top"];

    var plainTextRadioButton = reportFormatRadioGroup.add("radiobutton", undefined, undefined, {name: "plainTextRadioButton"}); 
    plainTextRadioButton.text = "Plain Text";
    plainTextRadioButton.value = true; // Default selection

    var htmlRadioButton = reportFormatRadioGroup.add("radiobutton", undefined, undefined, {name: "htmlRadioButton"}); 
    htmlRadioButton.text = "HTML";

    // Show the main panel
    mainPanel.show();

    // Define the precompButton click action
    precompButton.onClick = precompFootage;

    // Define the precompButton click action
    tagSourceButton.onClick = tagFootageSource;

    // Define the replaceFootageButton click action
    replaceFootageButton.onClick = replaceFootage;

    // Define the reportButton click action
    reportButton.onClick = reportFootage;


// ============================================
// ============================================


    // Function to create precomps from selected footage
    function precompFootage() {
        var selectedFootage = [];
        var project = app.project;
    
        // Check if any footage is selected in the project panel
        for (var i = 1; i <= project.items.length; i++) {
            var item = project.item(i);
            if (item.selected && item instanceof FootageItem) {
                selectedFootage.push(item);
            }
        }
    
        // If no footage is selected, check what's selected in the active comp
        if (selectedFootage.length === 0) {
            var activeComp = app.project.activeItem;
            if (activeComp && activeComp instanceof CompItem) {
                for (var j = 1; j <= activeComp.numLayers; j++) {
                    var layer = activeComp.layer(j);
                    if (layer.source && layer.source instanceof FootageItem) {
                        selectedFootage.push(layer.source);
                    }
                }
            }
        }
    
        // If no layers are selected in the comp, get all footage items in the whole project
        if (selectedFootage.length === 0) {
            for (var k = 1; k <= project.items.length; k++) {
                var item = project.item(k);
                if (item instanceof FootageItem) {
                    selectedFootage.push(item);
                }
            }
        }
    
        // Begin undo group
        app.beginUndoGroup("Create Footage Precomps");

        
        // Set footage precomp resolution based on user selection
        var resolution = radioButtonHD.value ? [1920, 1080] : [3840, 2160];
        
        // Create precomps for each unique footage item
        var uniqueFootage = {};

        for (var i = 0; i < selectedFootage.length; i++) {

            var footage = selectedFootage[i];

            if (!uniqueFootage[footage.name]) {
                uniqueFootage[footage.name] = footage;

                // Create a new precomp
                var precomp = project.items.addComp(footage.name, resolution[0], resolution[1], footage.pixelAspect, footage.duration, footage.frameRate);
                precomp.layers.add(footage);

                // Scale the footage to fit the comp dimensions
                var layer = precomp.layer(1);
                layer.transform.scale.setValue([100 * Math.min(resolution[0] / footage.width, resolution[1] / footage.height), 100 * Math.min(resolution[0] / footage.width, resolution[1] / footage.height)]);

                // Create footage folders if they don't exist, if at least one footage precomp is created
                if (i == 0) {
                    var previewFolder = project.items.addFolder("Preview Footage");
                    var compsFolder = project.items.addFolder("Footage Comps");
                }

                // Move original footage into the Preview Footage folder
                footage.parentFolder = previewFolder;
                
                // Move the precomp into the Footage Comps folder
                precomp.parentFolder = compsFolder;
            }
        }

        app.endUndoGroup();

        // TO DO: Expand the comps folder and select the new precomps

        alert("Created " + Object.keys(uniqueFootage).length + " precomps in the 'Footage Comps' folder.");
    
    }

    // Function to tag the source of footage from undetermined origin.
    function tagFootageSource() {

        // Make sure an item is selected from the dropdown options
        var selectedSource = stockSourcesList.selection;

        if (selectedSource.index === 0) {
            // "Select Source Site" is selected, do nothing
            alert("Please select a stock footage source site.");
            return;
        }

        var sourceName = selectedSource.text;
        var selectedItems = getSelectedFootageItems();
    
        if (selectedItems.length === 0) {
            // Show modal dialog if no footage is selected
            showModalDialog("Select at least one piece of footage or footage precomp.", sourceName);
            return;
        }

        // Proceed to tag footage
        tagSelectedFootage(selectedItems, sourceName);
    }

    // Function to get selected footage items
    function getSelectedFootageItems() {
        var project = app.project;
        var selectedFootage = [];

        // Check selected footage in project panel
        for (var i = 1; i <= project.items.length; i++) {
            var item = project.item(i);
            if (item.selected && (item instanceof FootageItem || item instanceof CompItem)) {
                selectedFootage.push(item);
            }
        }

        return selectedFootage;
    }

    // Function to show source tagging modal dialog
    function showModalDialog(message, sourceName) {
        var dialog = new Window("dialog", "No Selection");
        dialog.add("statictext", undefined, message);
        
        var buttonGroup = dialog.add("group");
        buttonGroup.alignment = "right";
        
        var cancelButton = buttonGroup.add("button", undefined, "Cancel");
        cancelButton.onClick = function() {
            dialog.close();
        };
        
        var tagAllButton = buttonGroup.add("button", undefined, "Tag All");
        tagAllButton.onClick = function() {
            tagAllFootage(sourceName);
            dialog.close();
        };

        dialog.show();
    }

    // Function to tag selected footage items
    function tagSelectedFootage(selectedItems, sourceName) {
        app.beginUndoGroup("Tag Footage Source");
        
        for (var i = 0; i < selectedItems.length; i++) {
            item = selectedItems[i];
            item.name = sourceName + "-" + item.name;
        };

        app.endUndoGroup();
        alert("Tagged " + selectedItems.length + " clips with source: " + sourceName);
    }

    // Function to tag all footage in specific folders
    function tagAllFootage(sourceName) {
        var project = app.project;
        var footageCompFolder = findFolderByName("Footage Comps");
        var previewFolder = findFolderByName("Preview Footage");

        var itemsToTag = [];

        if (footageCompFolder) {
            itemsToTag = itemsToTag.concat(getFootageItemsInFolder(footageCompFolder));
        }
        if (previewFolder) {
            itemsToTag = itemsToTag.concat(getFootageItemsInFolder(previewFolder));
        }

        // If no specific folders found, check all footage items
        if (itemsToTag.length === 0) {
            itemsToTag = getAllFootageItems();
        }

        // Tag footage items
        for (var i = 0; i < itemsToTag.length; i++) {
            item = itemsToTag[i];
            if (item instanceof FootageItem || (item instanceof CompItem && item.numLayers === 1 && item.layer(1).source instanceof FootageItem)) {
                item.name = sourceName + " - " + item.name;
            }
        };

        alert("Tagged " + itemsToTag.length + " items with source: " + sourceName);
    }

    // Helper function to find a folder by name
    function findFolderByName(name) {
        var project = app.project;
        for (var i = 1; i <= project.items.length; i++) {
            if (project.item(i).name === name && project.item(i) instanceof FolderItem) {
                return project.item(i);
            }
        }
        return null;
    }

    // Function to get all footage items in a folder
    function getFootageItemsInFolder(folder) {
        var items = [];
        for (var i = 1; i <= folder.items.length; i++) {
            var item = folder.item(i);
            if (item instanceof FootageItem || (item instanceof CompItem && item.numLayers === 1 && item.layer(1).source instanceof FootageItem)) {
                items.push(item);
            }
        }
        return items;
    }

    // Function to get all footage items in the project
    function getAllFootageItems() {
        var project = app.project;
        var items = [];
        for (var i = 1; i <= project.items.length; i++) {
            var item = project.item(i);
            if (item instanceof FootageItem) {
                items.push(item);
            }
        }
        return items;
    }


    // Function to replace the preview footage with purchased footage.
    function replaceFootage() {
        alert("This button will swap out purchased footage for the preview clips.");

    }

    // Function to generate a report of all footage clips used in the selected comp
    function reportFootage() {
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
    }

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

    // Function to create a new panel with the text report
    function createReportPanel(report) {
        var reportPanel = new Window("palette", "Footage Source Report", undefined, {resizeable: true});

        // Create status summary of results
        var resultMessage = "Found " + report.split(/\n/).length + " unique footage items used in this comp and its sub-comps.";
        var resultText = reportPanel.add("statictext", undefined, resultMessage);

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



    // Show the main panel as dockable
    if (mainPanel instanceof Window) {
        mainPanel.center();
        mainPanel.show();
    } else {
        mainPanel.layout.layout(true); // Layout the UI elements correctly
    }

})();
