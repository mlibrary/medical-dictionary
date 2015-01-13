// Modified by Colin Fulton to put the algorithm in a function instead of binding it to the String prototype

function jaro_winkler(string1, string2) {
  var ch, i, j, jaro, matchWindow, numMatches, prefix, string1Matches, string2Matches, transpositions, windowEnd, windowStart, _i, _j, _k, _l, _len, _len1, _len2, _ref;

  if (string1.length > string2.length) {
    _ref = [string2, string1], string1 = _ref[0], string2 = _ref[1];
  }

  matchWindow = ~~Math.max(0, string2.length / 2 - 1);
  string1Matches = [];
  string2Matches = [];

  for (i = _i = 0, _len = string1.length; _i < _len; i = ++_i) {
    ch = string1[i];
    windowStart = Math.max(0, i - matchWindow);
    windowEnd = Math.min(i + matchWindow + 1, string2.length);

    for (j = _j = windowStart; windowStart <= windowEnd ? _j < windowEnd : _j > windowEnd; j = windowStart <= windowEnd ? ++_j : --_j) {
      if ((string2Matches[j] == null) && ch === string2[j]) {
        string1Matches[i] = ch;
        string2Matches[j] = string2[j];
        break;
      }
    }
  }

  string1Matches = string1Matches.join("");
  string2Matches = string2Matches.join("");
  numMatches = string1Matches.length;

  if (!numMatches) {
    return 0;
  }

  transpositions = 0;

  for (i = _k = 0, _len1 = string1Matches.length; _k < _len1; i = ++_k) {
    ch = string1Matches[i];
    if (ch !== string2Matches[i]) {
      transpositions++;
    }
  }

  prefix = 0;

  for (i = _l = 0, _len2 = string1.length; _l < _len2; i = ++_l) {
    ch = string1[i];
    if (ch === string2[i]) {
      prefix++;
    } else {
      break;
    }
  }

  jaro = ((numMatches / string1.length) + (numMatches / string2.length) + (numMatches - ~~(transpositions / 2)) / numMatches) / 3.0;
  return jaro + Math.min(prefix, 4) * 0.1 * (1 - jaro);
}
