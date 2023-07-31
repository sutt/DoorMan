

function update() {
    $('#topbar-content').empty();
    $.ajax({
    url: 'http://localhost:3001/hub/info', // Replace with your API URL
    type: 'GET',
    crossDomain: true,
    success: function(response) {
        var funding = response.funding;
        var latestGeneration = response.latest_generation;
        var uiState = response.ui_state;

        if (funding.credits_available < 1) {
            warning402 = true;
        } else {
            warning402 = false;
        }

        var contentDiv = $('#topbar-content');

        var titleSection = $('<div>').addClass('divSection');
        $('<h2>').text('Doorman').appendTo(titleSection);
        titleSection.appendTo(contentDiv);
        

        // Funding Section
        var fundingSection = $('<div>').addClass('divSection');
        // $('<h4>').text('Funding').appendTo(fundingSection);
        $('<p>').text('Fundings with Credit: ' + funding.fundings_with_credit).appendTo(fundingSection);
        $.each(funding.workers_and_credits, function(i, worker) {
            $('<p>').text('Worker: ' + worker.worker_addr + ', Available Credits: ' + worker.available_credits).appendTo(fundingSection);
        });
        if (funding.workers_and_credits.length == 0) {
            $('<p>').text('No workers available; Add funds to a worker').addClass('warning-402').appendTo(fundingSection);
        }
        fundingSection.appendTo(contentDiv);

        // Latest Generation Section
        var latestGenerationSection = $('<div>').addClass('divSection');
        // $('<h4>').text('Latest Generation').appendTo(latestGenerationSection);
        $('<p>').text('Worker Address: ' + latestGeneration.workerAddr).appendTo(latestGenerationSection);
        $('<p>').text('Response Time: ' + latestGeneration.responseTime).appendTo(latestGenerationSection);
        $('<p>').text('Fee: ' + latestGeneration.fee).appendTo(latestGenerationSection);
        latestGenerationSection.appendTo(contentDiv);

        // UI State Section
        var uiStateSection = $('<div>').addClass('divSection');
        // $('<h4>').text('UI State').appendTo(uiStateSection);
        $('<p>').text('Is Generating: ' + uiState.isGenerating).appendTo(uiStateSection);
        $('<p>').text('Generation Started At: ' + (uiState.generationStartedAt || 'N/A')).appendTo(uiStateSection);
        uiStateSection.appendTo(contentDiv);

    
    }
    });
}

let warning402 = false;


// Wait for page to load to kickoff extensions
setTimeout(function() {
    
    console.log("topbar.js, adding doorman views -------")
    
    // Listen to Genrate button click 
    const id = "txt2img_generate_box";
    const targetElem = document.getElementById(id);
    if (targetElem != null) {
        targetElem.addEventListener("click", async function(e) {
            
            console.log("custom hook on generate button");
            
            $.ajax({
                url: 'http://localhost:3001/hub/start_generation', // Replace with your API URL
                type: 'GET',
                crossDomain: true,
                success: function(response) { 
                    console.log("doorman server notified of generate button click") 
                }
            });

            if (warning402) {
                console.log("warn! 402")
                $('.warning-402').addClass('warning-402-flash');
                    setTimeout(function() {
                        $('.warning-402').removeClass('warning-402-flash');
                    }, 2000);  
            }
        })
    }

    // Start updating the topBar
    update();
    // setInterval(update, 2000);
    

}, 3000);
