$(document).ready(function() {
  var id = (window.location.href.indexOf("id=") > -1) ? window.location.href.split("id=")[1] : null;
  getQuote(id);
  
  $("#newQuote").click(function(e) {
    e.preventDefault();
    getQuote();
  });
  
  $("#shareLink").click(function(e) {
    e.preventDefault();
    $("#copyShareLink").toggle(100).select();
  });
  
  function getQuote(id) {
    changeColors();
    $("#text").hide(350);
    $("#author").hide(350);
    // Make request for quote-json
    $.ajax({
      dataType: "json",
      // If a quote id is supplied, retrieve that quote. Otherwise get a random quote
      url: (id) ? "https://quotesondesign.com/wp-json/posts/" + id : "https://quotesondesign.com/wp-json/posts/?filter[orderby]=rand&filter[posts_per_page]=1",
      error: function(err) {
      // Show error message
      },
      success: function(data) {
        quoteData(data)
      },
      cache: false
    });
  }
  
  function quoteData(data) {
    var quote = (Array.isArray(data)) ? data[0] : data;
    placeQuote(quote.content, quote.title);
    var link = window.location.href.split("?")[0] + "?id=" + quote.ID;
    history.pushState("", "", link);
    $("#copyShareLink").val(link);
    var tweetAuthor = $("#author").text().substring(0,30);
    var tweetText = ($("#text").text().length < (113 - tweetAuthor.length)) ? $("#text").text() : $("#text").text().substring(0,(110-tweetAuthor.length)) + "...";
    var tweetContent = tweetText + "\n– " + tweetAuthor;
    $("#tweet").attr("href", "https://twitter.com/intent/tweet?text="+encodeURI(tweetContent) + "&url="+encodeURI(link));
  }
  
  function changeColors() {
    var r = Math.floor(Math.random()*256);
    var g = Math.floor(Math.random()*256);
    var b = Math.floor(Math.random()*256);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    var contrast = (yiq >= 138) ? "#333333" : "#fafafa";
    var color = "rgb(" + r + "," + g + "," + b + ")";
    $("body").css({"background":color,"color":contrast});
    $(".colorBox").css({"background":contrast,"color":color});
    $("#credits a").css("color", contrast);
  }

  function placeQuote(quote, author) {
    $("#text").html(quote).show(400);
    $("#author").html(author).show(400);
  }
});