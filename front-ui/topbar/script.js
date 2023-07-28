
var previousResponse = null;


function update() {
    $('#content').empty();
    $.ajax({
    url: 'http://localhost:3001/hub/info', // Replace with your API URL
    type: 'GET',
    crossDomain: true,
    success: function(response) {
        var funding = response.funding;
        var latestGeneration = response.latest_generation;
        var uiState = response.ui_state;

        var contentDiv = $('#content');

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

update();
setInterval(update, 2000);