var MatchGame = {}; // Creates empty 'MatchGame' object

// Sets up a new game after HTML document has loaded.
// Renders a 4x4 board of cards.
$(document).ready(function() {
  var $game = $('#game');
  var values = MatchGame.generateCardValues();
  MatchGame.renderCards(values, $game);
});

// Generates and returns an array of matching card values.
MatchGame.generateCardValues = function() {

  var unplacedValues = [];  // Creates empty array to be filled

  // Generates array of eight pairs of numbers 1-8 [1,1,2,2...]
  for (var value = 1; value <= 8; value++) {
    unplacedValues.push(value);
    unplacedValues.push(value);
    // console.log(unplacedValues);
  }

  // Creates array of randomly ordered numbers picked from 'unplacedValues' array
  var cardValues = [];

  while (unplacedValues.length > 0) {
    var randomIndex = Math.floor(Math.random() * unplacedValues.length);  // Picks random value
    var randomValue = unplacedValues.splice(randomIndex, 1)[0]; // Attaches random value to new array, removes number from 'unplacedValues' array
    cardValues.push(randomValue);
    // console.log('Card Value: ' + cardValues);
  }

  return cardValues;
};

// Converts card values to jQuery card objects and adds them to the supplied game object.
MatchGame.renderCards = function(cardValues, $game) {
  // Array of colors to be assigned to card values 1-8
  var colors = [
    'hsl(25, 85%, 65%)',
    'hsl(55, 85%, 65%)',
    'hsl(90, 85%, 65%)',
    'hsl(160, 85%, 65%)',
    'hsl(220, 85%, 65%)',
    'hsl(265, 85%, 65%)',
    'hsl(310, 85%, 65%)',
    'hsl(360, 85%, 65%)'];

  $game.empty();
  $game.data('flippedCards', []); // Checks for already flipped cards

  // Assigns colors to card values
  for (var x = 0; x < cardValues.length; x++) {

    var value = cardValues[x]; // Picks card value from creates 'cardValues' array
    var color = colors[value - 1]; // Assigns color to card value based on number; e.g. if card value is 3, 3rd color from 'colors' array will be assigned
    var data = { // Sets arguments for 'data' variable (object)
      value: value,
      color: color,
      isFlipped: false
    };

    var $cardElement = $('<div class="col-3 card"></div>'); // Creates <div> element for card; .card class has to be defined in style.css
    $cardElement.data(data);  // Loads value & color to card(s)

    $game.append($cardElement);
  }

  // Event listener - calls 'flipCard()' whenever card is clicked
  $('.card').click(function() {
    MatchGame.flipCard($(this), $('#game'));
  });
};

// Flips over a given card and checks to see if two cards are flipped over.
// Updates styles on flipped cards depending whether they are a match or not.
MatchGame.flipCard = function($card, $game) {
  if ($card.data('isFlipped')) {
    return;
  }

  // Modify color, value, and status of flipped card
  $card.css('background-color', $card.data('color'))
    .text($card.data('value'))
    .data('isFlipped', true);

  // Pushing flipped card to the end of $game object
  var flippedCards = $game.data('flippedCards');
  flippedCards.push($card);

  // It two cards were flipped, check for their values
  if (flippedCards.length === 2) {
    // If values match change colors to grey
    if (flippedCards[0].data('value') === flippedCards[1].data('value')) {
      var matchCss = {
        backgroundColor: 'rgb(153, 153, 153)',
        color: 'rgb(204, 204, 204)'
      };
      // Assign color values to matched flipped cards
      flippedCards[0].css(matchCss);
      flippedCards[1].css(matchCss);
      // If values don't match
    } else {
      var card1 = flippedCards[0];
      var card2 = flippedCards[1];
      // Reset card status and color (make it unflipped again)
      window.setTimeout(function() {
        card1.css('background-color', 'rgb(32, 64, 86)')
          .text('')
          .data('isFlipped', false);
        card2.css('background-color', 'rgb(32, 64, 86)')
          .text('')
          .data('isFlipped', false);
      }, 350); // wait 350ms to flip cards back
    }
    $game.data('flippedCards', []); // Sett array of flipped cards to 0
  }
};
