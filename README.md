# PlainMD

The Plain Language Medical Dictionary (PLMD) widget is a project of the University of Michigan Taubman Health Sciences Library as part of the Michigan Health Literacy Awareness project, aimming to help people with a non-medical background better understand the medical terms. 

The initial version was designed in 2011 and published in three versions: website widget, iOS mobile application, and Android mobile application. In 2019, the widget was redesigned to a responsive webpage as one of [the Library Engagement Fellow projects](https://engage.lib.umich.edu/engagement-fellows/).

© This application is copyright 2020, The Regents of the University of Michigan.

## Install

To install this widget in your own website, please use the follwing code:

```html
<iframe src="http://www.lib.umich.edu/medical-dictionary" style="margin: 0 auto; height: 700px; width: 600px; border: 2px solid #eee;"></iframe>
```

The widget is responsive with a min-width of 320px, max-width of 768px and max-height of 700px. The recommended iframe width is 600px.


## Features & Functions

1. Letter browsing
By clicking on the button of letter, the user can view the terms with the same initials.
<img src="img/rdm_f1.png"/>

2. "Word Search": for short terms
Under the "word" mode, as the user typing in the search box, the search results would be displayed below immediately.
<img src="img/rdm_f2.png"/>

3. "Paragraph Search": for longer text
Users can paste or type in a paragraph or an article and the medical terms included would be marked. When a user clicks on the marked term in the textarea, the term card would be highlighted and scrolled in view accorddingly.
<img src="img/rdm_f3.png"/>

4. Report incorrect definitions & Request more medical terms
To further enrich our repository and keep this product updated, we designed this updating system that allows users to request definitions of terms we do not have and report information they think are incorrect. We will collect these feedback and update the repository sustainably. 
<img src="img/rdm_f4.png"/>

## Development

The widget is built with React.js and the development language is English. The algorithm used for term search is based on [levenshtein-distance](https://github.com/trekhleb/javascript-algorithms/tree/master/src/algorithms/string/levenshtein-distance). The thesaurus is stored in the data.json file.

## Contributors

- Lulu Guo (UX design & research)
- [Xiaoshan He](https://github.com/xiaoshanhe003) (UX design & development)
- Carol Shannon (supervisor)
