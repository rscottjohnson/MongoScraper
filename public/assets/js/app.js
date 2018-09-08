// // Grab the articles as a json
// // $.getJSON("/articles", function (data) {
// //   // For each one
// //   for (var i = 0; i < data.length; i++) {
// //     // Display the apropos information on the page
// //     $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
// //   }
// // });

// // When you click the savenote button
// $(document).on("click", ".saveNote", function () {
//   // Grab the id associated with the article from the submit button
//   var thisId = $(this).attr("data-id");

//   // Run a POST request to change the note, using what's entered in the inputs
//   $.ajax({
//       method: "POST",
//       url: "/articles/" + thisId,
//       data: {
//         // Value taken from title input
//         title: $("#titleinput").val(),
//         // Value taken from note textarea
//         body: $("#bodyinput").val()
//       }
//     })
//     // With that done
//     .then(function (data) {
//       // Log the response
//       console.log(data);
//       // Empty the notes section
//       $("#notes").empty();
//     });

//   // Also, remove the values entered in the input and textarea for note entry
//   $("#titleinput").val("");
//   $("#bodyinput").val("");
// });

// //Set clicked nav option to active
// $(".navbar-nav li").click(function () {
//   $(".navbar-nav li").removeClass("active");
//   $(this).addClass("active");
// });

// //Handle Save Article button
// $(".save").on("click", function () {
//   var thisId = $(this).attr("data-id");
//   $.ajax({
//     method: "POST",
//     url: "/articles/save/" + thisId
//   }).done(function (data) {
//     window.location = "/"
//   })
// });

// //Handle Delete Article button
// $(".delete").on("click", function () {
//   var thisId = $(this).attr("data-id");
//   $.ajax({
//     method: "POST",
//     url: "/articles/delete/" + thisId
//   }).done(function (data) {
//     window.location = "/saved"
//   })
// });

//Handle Save Note button
// $(".saveNote").on("click", function() {
//   var thisId = $(this).attr("data-id");

//   // Run a POST request to change the note, using what's entered in the inputs
//   $.ajax({
//     method: "POST",
//     url: "/articles/" + thisId,
//     data: {
//       // Value taken from title input
//       // title: $("#titleinput").val(),
//       // Value taken from note textarea
//       body: $("#noteText").val()
//     }
//   })
//     // With that done
//     .then(function(data) {
//       // Log the response
//       console.log(data);
//       // Empty the notes section
//       $("#notes").empty();
//     });

//   // Also, remove the values entered in the input and textarea for note entry
//   // $("#titleinput").val("");
//   $("#noteText").val("");
// });


// if (!$("#noteText" + thisId).val()) {
//     alert("please enter a note to save")
// }else {
//   $.ajax({
//         method: "POST",
//         url: "/notes/save/" + thisId,
//         data: {
//           text: $("#noteText" + thisId).val()
//         }
//       }).done(function(data) {
//           // Log the response
//           console.log(data);
//           // Empty the notes section
//           $("#noteText" + thisId).val("");
//           $(".modalNote").modal("hide");
//           window.location = "/saved"
//       });
// }
// });

// //Handle Delete Note button
// $(".deleteNote").on("click", function() {
//   var noteId = $(this).attr("data-note-id");
//   var articleId = $(this).attr("data-article-id");
//   $.ajax({
//       method: "DELETE",
//       url: "/notes/delete/" + noteId + "/" + articleId
//   }).done(function(data) {
//       console.log(data)
//       $(".modalNote").modal("hide");
//       window.location = "/saved"
//   })
// });


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

  $(document).on("click", "button.notes", function (event) {
    event.preventDefault();

    var id = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + id
      })
      .then(function (data) {
        console.log(data);

        var noteCard = $("<div class='card m-3'></div>");
        var noteBody = $("<div class='card-body'></div>");
        var title = $("<h5 class='card-title'>" + data.title + "</h5>");
        var noteTitle = $("<input type='text' class='form-control' id='titleinput' name='title'>");
        var noteInput = $("<textarea type='text' class='form-control mt-3 mb-3' id='bodyinput' name='body'></textarea>");
        var saveNote = $("<button class='btn btn-secondary ml-2' data-id=" + data._id + " role='button' id='savenote'>Save Note</button>");
        var delNote = $("<button class='btn btn-secondary ml-2' data-id=" + data._id + " role='button' id='delete-note'>Delete Note</button>");

        $("#notes").append(noteCard);
        noteCard.append(noteBody);
        noteBody.append(title);
        noteBody.append(noteTitle);
        noteBody.append(noteInput);
        noteBody.append(saveNote);
        noteBody.append(delNote);

        if (data.note) {
          $("#titleinput").val(data.note.title);
          $("#bodyinput").val(data.note.body);
        }

      });
  });

  $(document).on("click", "#savenote", function (event) {
    event.preventDefault();
    var id = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + id,
        data: {
          title: $("#titleinput").val(),
          body: $("#bodyinput").val()
        }
      })
      .then(function (data) {
        console.log(data);
        $("#notes").empty();
      });

    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

  $(document).on("click", "#delete-note", function (event) {
    event.preventDefault();

    var id = $(this).attr("data-id");

    $.ajax({
        method: "DELETE",
        url: "/articles/" + id
      })
      .then(function () {
        $("#notes").empty();
      });
  });
});