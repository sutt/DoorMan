/* global $ */

function fundWorkerOnClick(e) {
  $("#qr-actual-wrapper").css("display", "none");
  $("#qr-failure-wrapper").css("display", "none");
  $("#payment-message").css("display", "none");
  $("#payment-error-message").css("display", "none");
  $("#invoice-info").css("display", "none");
  $("#qr-code").attr("src", "");
  $("#payment-waiting-message").css("display", "flex");
  $("#qr-loading-wrapper").css("display", "flex");
  $(".left-panel").css("display", "none");
  $(".funding-wrapper").css("display", "flex");
  e.stopPropagation();
  fundingFormSubit(e);
}

function checkPayment(rHash, workerAddr) {
  const url = `/api/check_payment`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      checkingId: rHash,
      workerAddr: workerAddr,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.is_paid) {
        document.getElementById("is-paid-value").innerText = "✅";
        document.getElementById("is-paid-key").style.color = "green";

        $("#payment-waiting-message").css("display", "none");
        $("#payment-message").css("display", "flex");

        setTimeout(() => {
          location.reload();
        }, 3000);
      }

      if (data.error) {
        console.log(`server-side error: ${data.error}`);
      }
    })
    .catch((error) => {
      console.error("client-side error:", error);
    });
}

function fundingFormSubit(e) {
  e.preventDefault();

  var amount = 50;
  var trElem = $(e.target.parentElement.parentElement);
  var workerAddr = trElem.data("worker-addr");
  var workerName = trElem.find("td:first").text();

  console.log(amount, workerAddr, workerName);

  $("#worker-invoice-name").text(workerName);

  fetch("/api/funding_request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: parseInt(amount),
      workerAddr: workerAddr,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      if (data?.qrDataURL) {
        console.log("IM IN THEN\n\n");
        $("#qr-code").attr("src", data.qrDataURL);
        $("#qr-loading-wrapper").css("display", "none");
        $("#qr-actual-wrapper").css("display", "flex");
        $("#invoice-info").css("display", "block");
        $("#invoice-string").data("invoice", data.data.payment_request);
        
        // .setAttribute("data-invoice", data.data.payment_request);

        setInterval(
          () => checkPayment(data.data.payment_hash, workerAddr),
          2000,
        );
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
      $("#qr-loading-wrapper").css("display", "none");
      $("#payment-waiting-message").css("display", "none");
      $("#invoice-info").css("display", "none");
      $("#qr-failure-wrapper").css("display", "flex");
      $("#payment-error-message").css("display", "flex");
    });
}
