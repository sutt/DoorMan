/* global $ */

let selectedRow = null;
$(document).ready(function () {
  $(".switch-worker").click(function (e) {
    $("svg.checkmark").addClass("hidden");

    var rowNum = $(this).data("row");
    var rowId = `#checkmark-${rowNum}`;
    var workerName = $(this).find("td:first").text();
    var workerAddr = $(this).data("worker-addr");

    $(rowId).removeClass("hidden");

    console.log(workerName, workerAddr);

    document.getElementById("details-view-name").innerText = workerName;
    document.getElementById("details-view-host").innerText = workerAddr;

    $(".funding-wrapper").css("display", "none");
    $(".left-panel").css("display", "flex");
    console.log("here");
  });

  
  $("#modal-icon").click(function() {
    var data = $("#invoice-string").data("invoice")  
    $("#invoice-num-modal").text(data);
    $("#modal-popup").show();
  });

  $("#modal-popup .close").click(function() {
      $("#modal-popup").hide();
  });

  $("#copy-icon").click(function() {
    console.log("copy icon clicked")
      var data = $("#invoice-string").data("invoice")
      navigator.clipboard.writeText(data)
      .then(function() {
          console.log("Copied to clipboard!");
      })
      .catch(function(err) {
          console.error("Could not copy text: ", err);
      });
      
  });
});
