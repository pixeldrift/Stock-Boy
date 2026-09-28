// Stock Trader
//
// An After Effects Utility by
// Nathan D. B. Pizar
// nathan@pizar.net

//  TO DO:

// - Option to group by provider
// - Flag missing purchase links
// - Auto try "Get Lucky" button
// - Additional prompting for inconclusive matches



// Get the ID of the stock clip
function getBaseName(file) {
    return decodeURI(file.name).replace(/\.[^\.]+$/, "");
}


function detectStockAssetFromFilename(fileName) {
    var name = decodeURI(fileName).toLowerCase();

    // SHUTTERSTOCK
    if (name.indexOf("shutterstock") !== -1) {
        var m = name.match(/(\d{6,})/);
        if (m) return {
            provider: "Shutterstock",
            assetId: m[1],
            url: "https://www.shutterstock.com/video/clip/" + m[1]
        };
    }

    // ADOBE STOCK
    if (name.indexOf("adobestock") !== -1 || name.indexOf("adobe_stock") !== -1) {
        var m = name.match(/([a-z0-9]{6,})/i);
        if (m) return {
            provider: "Adobe Stock",
            assetId: m[1],
            url: "https://stock.adobe.com/video/" + m[1]
        };
    }

    // POND5
    if (name.indexOf("pond5") !== -1) {
        var m = name.match(/(\d{6,})/);
        if (m) return {
            provider: "Pond5",
            assetId: m[1],
            url: "https://www.pond5.com/stock-footage/item/" + m[1]
        };
    }

    // ALAMY
    if (name.indexOf("alamy") !== -1) {
        var m = name.match(/([a-z0-9]{6,})/i);
        if (m) return {
            provider: "Alamy",
            assetId: m[1],
            url: "https://www.alamy.com/stock-video/id/" + m[1]
        };
    }

    // VIDEOHIVE
    if (name.indexOf("videohive") !== -1) {
        var m = name.match(/(\d{6,})/);
        if (m) return {
            provider: "VideoHive",
            assetId: m[1],
            url: "https://videohive.net/item/-/" + m[1]
        };
    }

    // DETECT-ONLY PROVIDERS
    var detectOnly = [
        "getty", "istock", "filmsupply",
        "motionarray", "storyblocks",
        "artlist", "artgrid",
        "premiumbeat", "envato"
    ];

    for (var i = 0; i < detectOnly.length; i++) {
        if (name.indexOf(detectOnly[i]) !== -1) {
            return {
                provider: detectOnly[i],
                assetId: "",
                url: "",
                note: "Manual lookup required (no stable public purchase URL)"
            };
        }
    }

    // UNSPLASH (FREE)
    if (name.indexOf("unsplash") !== -1) {
        return {
            provider: "Unsplash",
            assetId: "",
            url: "",
            note: "Free asset (no purchase required)"
        };
    }

    return null;
}






item instanceof FootageItem && item.file


// Generate the report data for each item
// uses HTML so it's clickable in Excel
// One row per unique asset:

if (item instanceof FootageItem && item.file) {
    var asset = detectStockAssetFromFilename(item.file.name);

    if (asset) {
        reportItems.push({
            comp: comp.name,
            layer: layer.name,
            provider: asset.provider,
            assetId: asset.assetId || "",
            url: asset.url || "",
            note: asset.note || "",
            filePath: item.file.fsName
        });
    }
}

// Maybe note if watermarked previews already swapped?
// status: item.file.name.indexOf("preview") !== -1 ? "PREVIEW" : "LICENSED"

// What if multiple numbers are in the filename?
// Longest numeric string?
// Or first match
// Or prompt user later (optional)

// PREVIEW
// LICENSED
// UNKNOWN




