// import {jaro_winkler} from './jaro_winkler/jaro_winkler.js';
// var jaro_winkler=import('./jaro_winkler/jaro_winkler.js');

var total=0;
var dictionary=[];
var currentLetters=[];

	///////////////////
   //// COMPONENTS ///
  ///////////////////

class DictionaryContainer extends React.Component {
	constructor(props){
		super(props);
		this.state={status:"word"};
		this.handleStatusChange=this.handleStatusChange.bind(this);
	}
	handleStatusChange(event){
		this.setState({status:event.target.value});
	}
	render(){
		var body=<Dictionary4Word/>;
		if(this.state.status==="paragraph") body=<Dictionary4Paragraph/>;
		return (
			<div>
				<h1>Plain Language Medical Dictionary <span>Application by the University of Michigan Library</span></h1>
				<section id="main">
					<div className="status">
						<button className={this.state.status==="word"?"current-status":""} onClick={this.handleStatusChange} value="word">Word</button>
						<button className={this.state.status==="paragraph"?"current-status":""} onClick={this.handleStatusChange} value="paragraph">Paragraph</button>
					</div>
					{body}
				</section>
				<p id="copyright">This work was performed under a subcontract with the University of Illinois at Chicago and made possible by grant #N01-LM-6-3503 from National Library of Medicine (NLM) and its contents are solely the responsibility of the authors and do not necessarily represent the official views of the National Library of Medicine.
This application is copyright 2014, The Regents of the University of Michigan.</p>
			</div>);
	}

}
class Dictionary4Word extends React.Component {
  constructor(props) {
    super(props);
    this.state = {query:'',type:'',matches:[]};
    this.handleChange = this.handleChange.bind(this);
    this.handleLetterChange = this.handleLetterChange.bind(this);
  }
  handleChange(change) {
    this.setState({query: change.query,type:change.type});
    var matches=getMatches(change.query,change.type);
    this.setState({matches:matches});
  }
  handleLetterChange(letters){
  	this.setState({letters:letters});
  }
  render() {
  	const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  	let letterBrowse=<BrowseFeild onQueryChange={this.handleChange} list={alphabet} type="primary"/>;
  	if(this.state.type==='letter')
  		letterBrowse=<div>
	  			<BrowseFeild onQueryChange={this.handleChange} list={alphabet} type="primary"/>
	  			<BrowseFeild onQueryChange={this.handleChange} list={currentLetters} type="secondary"/>
  			</div>;
    return (
    	<div>
    		<SearchBar4Word onQueryChange={this.handleChange} status="word" query={this.state.query} type={this.state.type} matches={this.state.matches}/>
    		{letterBrowse}
    		<MessageRow query={this.state.query} type={this.state.type}/>
    		<TermCardList matches={this.state.matches}/>
    	</div>
    	);
  }
}
class Dictionary4Paragraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {query:'',display:'',matches:[]};
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(change) {
    this.setState({query: change.query});
    var obj=search_paragraph(change.query);
    this.setState({matches:obj.matches,display:obj.markedString});
  }
  render() {
    return (
    	<div className="flex">
    		<SearchBar4Paragraph onQueryChange={this.handleChange} display={this.state.display} />
    		<div className="paraTermList"><TermCardList matches={this.state.matches}/></div>
    	</div>
    	);
  }
}

class SearchBar4Word extends React.Component {
	constructor(props) {
	    super(props);
	    this.state={input:'',isToggled:false};
	    this.handleChange = this.handleChange.bind(this);
	}
	handleChange(event) {
		var change=new Object();
		change.query=event.target.value;
		change.type="search";
		this.setState({input:event.target.value});
		if(event.target.name==='guess') this.setState({isToggled:true});
		else this.setState({isToggled:false});
	    this.props.onQueryChange(change);
	}
	render() {
		const matches=this.props.matches;
		const len=matches.length;
		var matchTerms=[];
		matchTerms.push(<button key="fake">fake</button>);
		for(var i=0;!this.state.isToggled && this.props.type!="letter" && i<4 && i<len;i++) 
			matchTerms.push(<button key={i} name="guess" value={matches[i][0]} onClick={this.handleChange}>{matches[i][0]}</button>);
	    const shadow=matchTerms.length>1?"shadow":""; 
	    return (
	    	<div className="relative">
		    	<div className="search-box search-word"> 
			        <input type="text" name="search" id="search-field" placeholder="Search for a medical term" autoComplete="off" 
			        	onChange={this.handleChange} value={this.props.type==="letter"?this.state.input:this.props.query}></input>
			        <div className="search-icon"></div>
			     </div>
			     <div className={"search-box guess "+shadow}>{matchTerms}</div>
		     </div>
    	);
	}
}
class SearchBar4Paragraph extends React.Component {
	constructor(props) {
	    super(props);
	    this.state={input:''};
	    this.handleContentEditable = this.handleContentEditable.bind(this);
	}
	handleContentEditable(event) {
		var change=new Object();
		change.query=$('#content-editable-field').text();
		change.type="search";
		this.setState({input:change.query});
	    this.props.onQueryChange(change);
	}
	render() {
			return(
				<div className="relative search-box search-paragraph">
			        <div name="search" id="content-editable-field" placeholder="Please paste the text here"
			        	onInput={this.handleContentEditable} onBlur={this.handleContentEditable} contentEditable="true" suppressContentEditableWarning={true} 
			        	dangerouslySetInnerHTML={{__html: this.props.display}}></div>
			     </div>
			     );
	}
} 

class BrowseFeild extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {current: ''};
	    this.handleClick = this.handleClick.bind(this);
	}
	handleClick(event){
		var change=new Object();
		this.setState({current:event.target.value});
		change.query=event.target.value;
		change.type='letter';
		this.props.onQueryChange(change);
	}
	setStyle(){}
	render() {
	  	var listItems = this.props.list.map((letter)=>
			<button key={letter} className={letter===this.state.current?"letter focused-button":"letter"} value={letter} type="button" onClick={this.handleClick}>
				{letter}
			</button>
		);
	  	if(this.props.type==='primary')
	  	 	listItems.push(
		  		<button key="all" className={'all'===this.state.current?"letter focused-button":"letter"} value='all' type="button" onClick={this.handleClick}>
					{"view all "+total+" terms"}
				</button>);
	    return <div className="BrowseFeild">{listItems}</div>;
	}
}


class MessageRow extends React.Component {
	constructor(props) {
	    super(props);
	}
	render () {
		if(this.props.query==='') return null;
		if(this.props.query==='all'&&this.props.type==='letter') return <p>All the terms we have:</p>;
		const message=this.props.type==='letter'?"Terms started with ":"Possible matches for ";
		return <p>{message}<strong>{this.props.query}</strong>:</p>
	}
}

class TermCardList extends React.Component {
	constructor(props) {
	    super(props);
	  }
	render() {
		var list=null;
		if(this.props.matches.length>0){
			list = this.props.matches.map((item)=> <TermCard key={item[0]} term={item[0]} define={item[1]} />);
		}
		return list;
	}
}
class TermCard extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {isToggled: true, length:this.props.define.length};
	    this.handleClick = this.handleClick.bind(this);
	}
	handleClick(event){
		this.setState({isToggled:!this.state.isToggled});
	}
	render() {
		if(this.state.length>60 && this.state.isToggled)
			return(
				<div className="term-card" onClick={this.handleClick}>
					<h2>{this.props.term}</h2>
					<p>{this.props.define.substring(0,60)+' ...'}</p></div>);
		else return(
				<div className="term-card" onClick={this.handleClick}>
					<h2>{this.props.term}</h2>
					<p>{this.props.define}</p></div>);
	}
}

	///////////////////
   //// FUNCTIONS ////
  ///////////////////

function getData(data){
	var obj=data['definitions'];
	for(var key in obj)
		if(obj[key]!='')
			dictionary.push([key,obj[key]]);
	dictionary=dictionary.sort(alphaCompare);
	total=dictionary.length;
}

function alphaCompare(a,b) {
	return a[0] > b[0];
}
function distanceCompare(a,b) {
	if(a[2]==b[2]) return a[0] > b[0];
	else return a[2] < b[2];
}
// Run an anonymous funtion if a value is close enough to another value.
function getMatches(query,type){
	  	const letterBrowse=type=='letter'? true:false;
	  	const len=query.length;
	  	var matches_out=[];
	    if(letterBrowse){
	    	if(len>2){
	    		matches_out=dictionary;
	    		currentLetters=[];
	    	}	
	    	else{
    			var matches=search_letter(query)
    			matches_out=matches[0];
    			if(len==1){currentLetters=matches[1];}
	    	}
	    }
	    else{matches_out=search_query(query);}
	    return matches_out;
}
function filter_matches(matches, center, range) {
      var output = []
      var len=matches.length;
      var min=center-range;
      for (var i = 0; i < len; i++) 
        if(matches[i][2]>=min) output.push(matches[i]);
      return output.sort(distanceCompare);
    }
//list=dictionary for 1 letter, list=matches for 2 letters
function search_letter(query){
	var list=dictionary;
	var len=query.length;
	var lenList=list.length;
	var letter=query.toLowerCase();
	var matches=[];
	var matches_sub=[];
	if(len==1)
		for(var i=0 ; i < lenList; i++){
			var item=list[i][0].toLowerCase();
			if(item.charAt(0)==letter){
				matches.push(list[i]);
				if(item.charAt(1).match(/[a-z]/i) && (matches_sub.length==0 || item.charAt(1)!=matches_sub[matches_sub.length-1].charAt(1)))
					matches_sub.push(query+item.charAt(1));
				if(i<lenList-1)
					if(list[i+1][0].toLowerCase().charAt(0)!=letter) break;
			}
		}
	if(len==2)
		for(var i=0 ; i < lenList ; i++){
			var item=list[i][0].toLowerCase().substring(0,2);
			if(item==letter) {
				matches.push(list[i]);i++;
				var item_next=list[i][0].toLowerCase().substring(0,2);
				if(item_next==letter) matches.push(list[i]);
				else break;
			}
			
		}
	return [matches,matches_sub];
}	
	
function search_query(query) {
    var len = query.length
    if(len<=0) return false;
    var matches = []
    var splittable_chars = /[ ()[\]<>{}]/
    // Set the initial acceptable score range.
    var best_score  = 0.85
    var score_range = 0.05
    // Split the query, search through word by word.
    var query_low = query.toLowerCase();
    var query_words = query_low.split(splittable_chars);
    for(const term of dictionary){
      	var term_words = term[0].toLowerCase().split(splittable_chars)
      	var distance = 0 //the larger the better
        for(const term_word of term_words)
          for(const query_word of query_words)
          	distance = jaro_winkler(term_word , query_word)>distance?jaro_winkler(term_word,query_word):distance;
        
        // If the match is above range, update best_score and filetr matches
        if(distance < (best_score-score_range)) continue;
        else if(distance > (best_score+score_range)) best_score=distance;
        else {
        	var termD=term;
        	termD.push(distance);
        	matches.push(termD);
        }
      }
    return filter_matches(matches, best_score, score_range);
 }

function search_paragraph(query) {
	var obj=new Object();
    obj.markedString="";
    obj.matches=[];
    if(query.length<=0) return obj;

    var splitPoints=[]
    var query_low = query.toLowerCase();
    for(const term of dictionary){
      	var term_low = term[0].toLowerCase()
      	var position=query.search(term_low);
      	if(position!=-1){splitPoints.push([position,term_low.length,term]);
      	}
      }
     
    var markedString="";
	var matches = []
    var len=splitPoints.length;
    if(len==0) return obj;
    splitPoints.sort(alphaCompare);
    var start=0;
    for(var i=0;i<len;i++){
    	const match=splitPoints[i];
    	matches.push(match[2]);
    	if(match[0]>=start){
    		var end=match[0]+match[1];
	    	markedString=markedString+query.substring(start,match[0])+"\<mark\>"+query.substring(match[0],end)+"\<\/mark\>";
	    	start=end;
	    }
	}
    markedString=markedString+query.substring(start);
    obj.markedString=markedString;
    obj.matches=matches;
    
    return obj;
}
	///////////////////
   ////// RENDER /////
  ///////////////////

$.getJSON( "data.json" )
	  .done(function( json ) {
	    getData(json);
	    ReactDOM.render(<DictionaryContainer/>, document.getElementById('root'));
	  })
	  .fail(function( jqxhr, textStatus, error ) {
	    var err = textStatus + ", " + error;
	    console.log( "Request Failed: " + err );
	});

	//////////////////////
   //// jaro winkler ////
  //////////////////////


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
