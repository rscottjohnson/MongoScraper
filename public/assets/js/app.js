$(document).ready(function () {

  // Scrape the Daily Reflector site
  $("#scrapeBtn").on("click", function () {
    $.ajax({
      method: "GET",
      url: "/scrape"
    }).then(function (data) {
      console.log(data)
      location.reload();
    });
  });

  // Save an article
  $("#saveBtn").on("click", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/save-article/" + thisId
    }).then(function (data) {
      console.log(data)
      location.reload();
    });
  });

  // View saved articles
  $("#savedBtn").on("click", function () {
    // var thisId = $(this).attr("data-id");
    $.ajax({
      method: "GET",
      url: "/saved"
    }).then(function (data) {
      console.log(data)
      window.location = "/saved"
    });
  });

  // // Add a note to a saved article
  // $("#noteBtn").on("click", function () {
  //   var thisId = $(this).attr("data-id");
  //   $.ajax({
  //     method: "GET",
  //     url: "/articles/" + thisId
  //   }).then(function (data) {
  //     console.log(data)
  //     // location.reload();
  //   });
  // });

  // Unsave a saved article
  $("#unsaveBtn").on("click", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/unsave-article/" + thisId,
    }).then(function (data) {
      console.log(data)
      location.reload();
    });
  });

  // Return to the main page
  $("#mainBtn").on("click", function () {
    // var thisId = $(this).attr("data-id");
    $.ajax({
      method: "GET",
      url: "/"
    }).then(function (data) {
      console.log(data)
      window.location = "/"
    });
  });
});