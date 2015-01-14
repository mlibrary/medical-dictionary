<script>
  // Copyright (c) 2014 The Regents of the University of Michigan.
  // All Rights Reserved. Licensed according to the terms of the Revised BSD license.
  // See LICENSE.txt for details.

    ///////////////////
   // INITIAL SETUP //
  ///////////////////

  window.onload = function() {
    // Clear out the "No JavaScript" message
    clear_page()

    // Initialize global-ish variables
    var dictionary   = <?php echo(json_encode($dictionary)); ?>;
    var alphabetical = <?php echo(json_encode($alphabetical)); ?>;
    var search_field = document.getElementById('search-field')
    var browse_field = document.getElementById('browse-field')
    var all_letters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    var search_timer

    // When a letter is entered in the search field...
    document.onkeyup = function() {
      if (document.activeElement === search_field) {
        // Reset the browse field so it is clear which input was used
        browse_field.selectedIndex = 0

        // Clear the previous timer
        window.clearTimeout(search_timer)

        // Update the list of results after a delay.
        // The delay prevents the from flashing quickly as you type.
        search_timer = window.setTimeout(
                         function() {
                           add_result_to_page(
                             search_and_render(search_field.value)
                           )
                         },
                         200
                       )
      }
    }

    // Function called when a letter is selected from the browse dropdown
    browse = function() {
      // Reset the search field so it is clear which input was used
      search_field.value = ''

      // Get the letter
      letter = browse_field.options[browse_field.selectedIndex].value

      if (letter !== 'default') {
        add_result_to_page(search_and_render(letter, true))
      } else {
        clear_page()
      }
    }

    // Function called when a letter is selected from the browse dropdown
    view_all = function() {
      // Reset the search and browse fields so it is clear which input was used
      search_field.value = ''
      browse_field.selectedIndex = 0

      var output = ''

      // Call search and render on every letter in the alphabet
      for (var i = 0; i < all_letters.length; ++i) {
        output = output.concat(search_and_render(all_letters[i], true))
      }

      add_result_to_page(output)
    }

      ////////////
     // SEARCH //
    ////////////

    // A wrapper around search_for() and render_list() that also sets the render
    // message based on whether you are searching or browsing
    function search_and_render(query, is_a_browse) {
      match_message = (is_a_browse) ? "Terms starting with" : "Possible matches for"

      return render_list(
               query,
               sort_matches(
                 search_for(query, is_a_browse)
               ),
               match_message
             )
    }

    // Get an array of terms that loosely match the given string.
    function search_for(query, is_a_browse) {
      var query   = query.toLowerCase()
      var matches = []
      var splittable_chars = /[ ()[\]<>{}]/
      // Set the minimum score, and the range around the best score that will be accepted.
      var best_score  = 0.85
      var score_range = 0.05
      // Split the query so we can search through it word by word.
      var query_words = query.split(splittable_chars)

      if (query.length > 0) {
        // For every word in the dictionary...
        for_each(alphabetical, function(term) {
          var lower_case_term = term.toLowerCase()

          // If this is a browse...
          if (is_a_browse) {
            if (query === lower_case_term.charAt(0)) {
              matches.push({ 'term':     term,
                             'distance': 1 })
            }
          // If this is a search...
          } else {
            var term_words = lower_case_term.split(splittable_chars)

            // For every word in the current dictionary term...
            for_each(term_words, function(term_word) {
              var distance  = 0

              // For every word in the query...
              for_each(query_words, function(single_query_word) {
                distance = Math.max(
                             jaro_winkler(
                               term_word,
                               single_query_word
                             ),
                             distance
                           )
              })

              // If the match is above the range for the current best match, set it as
              // the new best score and filter out matches that are no longer good enough.
              if_above_range(distance, best_score, score_range, function() {
                best_score = distance
                matches = filter_matches(matches, best_score, score_range)
              })

              // If the match is within the current range, push it to the matches array.
              if_around_value(distance, best_score, score_range, function() {
                matches.push({ 'term':     alphabetical[i],
                               'distance': distance })
              })
            })
          }
        })
      }

      return matches
    }

      //////////
     // SORT //
    //////////

    // Include the Jaro-Winkler string distance algorithm
    <?php include 'jaro_winkler/jaro-winkler.js'; ?>

    // Take an array of matches and sort them in some sensible way.
    function sort_matches(matches) {
      // If we have matches, sort them by distance from the query.
      if (matches.length > 0) {
        matches = matches.sort(
          function(first, second) {
            difference = second['distance'] - first['distance']

            if (difference !== 0) {
              return difference
            // If the the distances are the same sort the terms in alphabetical order.
            } else {
              first   = first['term'].toLowerCase()
              seccond = second['term'].toLowerCase()

              if (first > second) {
                return 1
              } else if (first < second) {
                return -1
              } else {
                return 0
              }
            }
          }
        )
      }

      return matches
    }

    function for_each(array, lambda) {
      for (var i = 0; i < array.length; ++i) {
        lambda(array[i], i)
      }
    }

    // Take in a set of matches and remove any values that are not within the range given.
    function filter_matches(matches, center, range) {
      var output = []

      // For each match from the array given...
      for (var i = 0; i < matches.length; ++i) {
        var possible_match = matches[i]

        // ... add it to the output array if it is within the range given.
        if_around_value(possible_match['distance'], center, range, function() {
          output.push(possible_match)
        })
      }

      return output
    }

    // Run an anonymous funtion if a value is close enough to another value.
    function if_around_value(value, center, range, lamda) {
      if (value > (center - range) &&
          value < (center + range)) {
        lamda()
      }
    }

    // Run an anonymous funtion if a value is well above a given value.
    function if_above_range(value, center, range, lamda) {
      if (value > (center + range)) {
        lamda()
      }
    }


      ////////////
     // RENDER //
    ////////////

    // Take a query string and an array of matches and render them on the page.
    function render_list(query, matches, match_message) {
      // Set the default for when there are no matches.
      var no_match_message = '<h2>No matches for <strong>' + query + '</strong></h2>'

      var output = (search_field.value === '' &&
                    browse_field.options[browse_field.selectedIndex].value === 'default') ? '' : no_match_message

      // If there are matches...
      if (matches.length > 0) {
        output = '<h2>' + match_message + ' <strong>' + query + '</strong>:</h2><dl>'

        // Format each matched term and add it to the output.
        for (var i = 0; i < matches.length; ++i) {
          var term = matches[i]['term']
          output = output + '<dt>' + term + '</dt><dd>' + dictionary[term] + '</dd>'
        }

        output = output + '</dl>'
      }

      return output
    }

    // Render the given HTML onto the page.
    function add_result_to_page(html) {
      document.getElementById("definition-area").innerHTML = html
    }

    // Remove all content from the area we render results to.
    function clear_page() {
      add_result_to_page('')
    }
  }
</script>
