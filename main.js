// import {jaro_winkler} from './jaro_winkler/jaro_winkler.js';
// var jaro_winkler=import('./jaro_winkler/jaro_winkler.js');
var total=0;
var dictionary=[];
var currentLetters=[];
const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const search_svg=(<svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18.895" height="18.9" viewBox="0 0 18.895 18.9">
  <path id="union2" data-name="union2" className="cls-1" d="M-85.811,405.607-90.1,401.32A7.941,7.941,0,0,1-95,403a7.943,7.943,0,0,1-5.656-2.343,8.009,8.009,0,0,1,0-11.314A7.944,7.944,0,0,1-95,387a7.95,7.95,0,0,1,5.657,2.343,8.014,8.014,0,0,1,.663,10.563l4.287,4.287a1,1,0,0,1,0,1.414,1,1,0,0,1-.707.293A1,1,0,0,1-85.811,405.607Zm-13.435-14.849a6.007,6.007,0,0,0,0,8.485A5.957,5.957,0,0,0-95,401a5.957,5.957,0,0,0,4.243-1.757A5.961,5.961,0,0,0-89,395a5.961,5.961,0,0,0-1.758-4.243A5.961,5.961,0,0,0-95,389,5.961,5.961,0,0,0-99.247,390.758Z" transform="translate(103 -387)"/>
</svg>);
const report_svg=(<svg className="report-icon" xmlns="http://www.w3.org/2000/svg" width="19.716" height="17.964" viewBox="0 0 19.716 17.964">
	<path id="report" className="cls-1" d="M-84.228,406.518h-15.71a1.981,1.981,0,0,1-1.726-.99,1.981,1.981,0,0,1-.016-1.99l7.854-13.964a1.977,1.977,0,0,1,1.743-1.019,1.977,1.977,0,0,1,1.743,1.019l7.855,13.964a1.982,1.982,0,0,1-.017,1.991A1.981,1.981,0,0,1-84.228,406.518Zm-7.855-4.761a1.254,1.254,0,0,0-1.253,1.253,1.254,1.254,0,0,0,1.253,1.253,1.254,1.254,0,0,0,1.253-1.253A1.254,1.254,0,0,0-92.083,401.757Zm0-8.769a1.254,1.254,0,0,0-1.253,1.253v5.011a1.254,1.254,0,0,0,1.253,1.253,1.254,1.254,0,0,0,1.253-1.253v-5.011A1.254,1.254,0,0,0-92.083,392.989Z" transform="translate(101.941 -388.554)"/>
</svg>);
const copy_svg=(<svg className="copy-icon" xmlns="http://www.w3.org/2000/svg" width="17.325" height="19" viewBox="0 0 17.325 19">
  <path id="copy" className="cls-1" d="M-97,406a2,2,0,0,1-2-2h10.329a1,1,0,0,0,1-1V393a1,1,0,0,0-1-1v-2h1a2,2,0,0,1,2,2v12a2,2,0,0,1-2,2Zm-4-3a2,2,0,0,1-2-2V389a2,2,0,0,1,2-2h9.326a2,2,0,0,1,2,2v12a2,2,0,0,1-2,2Zm0-13v10a1,1,0,0,0,1,1h7.33a1,1,0,0,0,1-1V390a1,1,0,0,0-1-1H-100A1,1,0,0,0-101,390Z" transform="translate(103 -387)"/>
</svg>);
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
		const body=this.state.status==="word"?<Dictionary4Word/>:<Dictionary4Paragraph/>;
		return (
			<div>
				<h1>Plain Language Medical Dictionary <span>Application by the University of Michigan Library</span></h1>
				<section id="main">
					<div className="status">
						<button className={this.state.status==="word"?"button-dark":"button-bright"} onClick={this.handleStatusChange} value="word">Word</button>
						<button className={this.state.status==="paragraph"?"button-dark":"button-bright"} onClick={this.handleStatusChange} value="paragraph">Paragraph</button>
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
    this.state = {query:'',type:'',matches:[],report_query:[-1,-1]};
    this.handleChange = this.handleChange.bind(this);
    this.handleReport = this.handleReport.bind(this);
  }
  handleChange(change) {
    this.setState({query: change.query,type:change.type});
    var matches=getMatches(change.query,change.type);
    this.setState({matches:matches});
  }
  handleReport(query) {
  	this.setState({report_query:query});
  }
  render() {
  	if(this.state.report_query[0]!=-1)
  		return (
	  		<div>
	    		<SearchBar4Word onQueryChange={this.handleChange} status="disabled" query={this.state.query} type={this.state.type} matches={this.state.matches}/>
	    		<div className="TermCardList_word padding">
	    			<Report onBack={this.handleReport} query={this.state.report_query}/></div>
	    	</div>
  			);
  	const SecondaryBrowseField= this.state.type==='letter'?
  		<BrowseFeild onQueryChange={this.handleChange} status="secondary" query={this.state.query} type={this.state.type} list={currentLetters} />:'';
    return (
    	<div>
    		<SearchBar4Word onQueryChange={this.handleChange} status="word" query={this.state.query} type={this.state.type} matches={this.state.matches}/>
			<BrowseFeild onQueryChange={this.handleChange} status="primary" query={this.state.query} type={this.state.type} list={alphabet} />
			{SecondaryBrowseField}
			<MessageRow query={this.state.query} type={this.state.type}/>
    		<div className="TermCardList_word padding">
    			<TermCardList onReport={this.handleReport} matches={this.state.matches}/></div>
    	</div>
    	);
  }
}
class Dictionary4Paragraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {query:'',display:'',matches:[],flagArray:[],selected:-1,report_query:[-1,-1]};
    this.handleChange = this.handleChange.bind(this);
    this.handleReport = this.handleReport.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }
  handleChange(change) {
    this.setState({query: change.query});
    var obj=search_paragraph(change.query);
    this.setState({matches:obj.matches, display:obj.markedString, flagArray:obj.flagArray});
  }
  handleReport(query) {
  	this.setState({report_query:query});
  }
  handleMouseUp(pos) {
  	const flagArray=this.state.flagArray;
  	if(flagArray.length <= 0 || pos.start < 0 || pos.end > flagArray.length) return;

  	var selected=-1;
  	if(pos.end==pos.start) {
  		selected=flagArray[pos.end];
  	} else 
  		for(var i=pos.start ; i < pos.end ; i++)
  			if(flagArray[i]!=-1){ 
  				selected=flagArray[i];break;}

  	if(selected!=-1) this.setState({selected:selected});
  }
  render() {
  	var padding=this.state.matches.length>0? ' padding' : '';
  	if(this.state.report_query[0]!=-1)
  		return (
  			<div className="flex">
				<SearchBar4Paragraph status="disabled" onQueryChange={this.handleChange} onMouseUp={this.handleMouseUp} display={this.state.display}/>
				<div className={"TermCardList_para"+padding}>
					<Report onBack={this.handleReport} query={this.state.report_query}/></div>
			</div>
  			);

	return (
		<div className="flex">
			<SearchBar4Paragraph status="normal" onQueryChange={this.handleChange} onMouseUp={this.handleMouseUp} display={this.state.display}/>
			<div className={"TermCardList_para"+padding}>
				<TermCardList onReport={this.handleReport} matches={this.state.matches} selected={this.state.selected}/></div>
		</div>
	);
  }
}

class SearchBar4Word extends React.Component {
	constructor(props) {
	    super(props);
	    this.state={input:'',isToggled:false};
	    this.handleChange = this.handleChange.bind(this);
	    this.handleBlur = this.handleBlur.bind(this);
	}
	handleChange(event) {
		if(event.target.name!='guess') this.setState({isToggled:false});
		var value=event.target.value;
		var change=new Object();
		change.query=value;
		change.type="search";
		this.setState({input:value});
	    this.props.onQueryChange(change);
	}
	handleBlur(event){
		setTimeout(
		    function() {
		    	this.setState({isToggled:true});
		    }.bind(this),200);
	}
	render() {
		var matches=this.props.matches;
		var len=matches.length;
		var matchTerms=[];
		matchTerms.push(<button key="fake">fake</button>);
		for(var i=0;!this.state.isToggled && this.props.type!="letter" && i<4 && i<len;i++) 
			matchTerms.push(<button key={i} name="guess" value={matches[i][0]} onClick={this.handleChange}>{matches[i][0]}</button>);
	    const shadow=matchTerms.length>1?"shadow":""; 
	    
	    return (
	    	<div className="search-box-container relative" onBlur={this.handleBlur}>
		    	<div className="search-box flex"> 
			        <input type="text" name="search" disabled={this.props.status==="disabled"?true:false} placeholder="Search for a medical term" autoComplete="off" 
			        	onChange={this.handleChange} value={this.props.type=="letter"?this.state.input:this.props.query}></input>
			        {search_svg}
			     </div>
			     <div className={"search-box guess "+shadow}>{matchTerms}</div>
		     </div>
    	);
	}
}
//content editable field
class SearchBar4Paragraph extends React.Component {
	constructor(props) {
	    super(props);
	    this.state={pos:0};
	    this.handleChange = this.handleChange.bind(this);
	    this.handleMouseUp = this.handleMouseUp.bind(this);
	    this.getCaretPos = this.getCaretPos.bind(this);
	}
	handleChange(event) {
		var change=new Object();
		change.query=event.target.value;
		change.type="search";
	    setTimeout(function(){
	    	this.props.onQueryChange(change);
	    }.bind(this),200);
	}
	handleMouseUp(event){
		var pos=this.getCaretPos(event.target);
		this.props.onMouseUp(pos);
	}
	getCaretPos(target){
		// IE < 9 Support
		var pos=new Object();
	    if (document.selection) {
	        target.focus();
	        var range = document.selection.createRange();
	        var rangelen = range.text.length;
	        range.moveStart('character', -target.value.length);
	        var start = range.text.length - rangelen;
	        pos.start=start;
	        pos.end=start+ranglen;
	    } // IE >=9 and other browsers
	    else if (target.selectionStart || target.selectionStart == '0') {
	        	pos.start=target.selectionStart;
	        	pos.end=target.selectionEnd;
	    } else {
	    	pos.start=0;
	    	pos.end=0;
	    }
	    return pos;
	}
	render() {
			return(
				<div className="search-box-container">
					<div className="search-box flex">
						<div className="box-paragraph relative">
							<textarea name="search" placeholder="Please paste the text here" disabled={this.props.status==="disabled"?true:false}
				        	onInput={this.handleChange} onMouseUp={this.handleMouseUp} onBlur={this.handleChange}></textarea>
				        	<div id="under-textarea" dangerouslySetInnerHTML={{__html: this.props.display}}></div>
				        </div>
				        {search_svg}
				    </div>
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
		var value=event.target.value;
		this.setState({current:event.target.value});
		change.query=event.target.value;
		change.type='letter';
		this.props.onQueryChange(change);
	}
	render() {
		const boolean= this.props.type==='letter'?true:false;
		var query=""
		if(boolean){
			query=this.props.query.length<3 && this.props.status==='primary'?this.props.query.charAt(0):this.props.query;
		}
	  	var listItems = this.props.list.map((letter)=>
			<button key={letter} className={boolean && letter===query?"current-button":""} 
			value={letter} type="button" onClick={this.handleClick}>
				{letter}</button>
				);
	  	if(this.props.status==='primary')
	  	 	listItems.push(
		  		<button key="all" className={boolean && 'all'===query?"current-button":""}
		  		value='all' type="button" onClick={this.handleClick}>
					{"view all "+total+" terms"}</button>
					);
	    return <div className="BrowseFeild">{listItems}</div>;
	}
}


class MessageRow extends React.Component {
	constructor(props) {
	    super(props);
	}
	render () {
		if(this.props.query==='') return null;
		if(this.props.query==='all' && this.props.type==='letter') return <p>All the terms we have:</p>;
		const message= this.props.type==='letter'? "Terms started with ":"Possible matches for ";
		return <p>{message}<strong>{this.props.query}</strong>:</p>
	}
}

class TermCardList extends React.Component {
	constructor(props) {
	    super(props);
	    this.handleScroll=this.handleScroll.bind(this);
	    this.handleReport=this.handleReport.bind(this);
	  }
	handleReport(query){
		this.props.onReport(query);
	}
	handleScroll(){
		element.scroll({
		  top: 100,
		  behavior: 'smooth'
		});
	}
	render() {
		if(this.props.matches.length <= 0) return null;
		const list = this.props.matches.map(
			(item)=> <TermCard type="normal" onReport={this.handleReport} key={item[0]} query={item} />
			);
		return <div>{list}</div>;
	}
}
class TermCard extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {isToggled: true};
	    this.handleClick = this.handleClick.bind(this);
	    this.handleCopy = this.handleCopy.bind(this);
	    this.handleReport = this.handleReport.bind(this);
	}
	handleClick(event){
		if(this.props.query[1].length > 60) this.setState({isToggled:!this.state.isToggled});
	}
	handleReport(){
		this.props.onReport(this.props.query);
	}
	handleCopy(event){
		var target=event.target;
		target.focus();
		document.execCommand("copy");
 		alert("Copied the text: " + this.props.query[1]);
	}
	
	render() {
		const define=this.props.query[1];
		var def=define.length > 60 && this.state.isToggled? define.substring(0,60)+"...":define;
		if(this.props.type==="min")
			return (
				<div className="term-card-min">
					<h2>{this.props.query[0]}</h2>
					<p onClick={this.handleClick}>{def}</p>
				</div>
				);
		else return(
			<div className="term-card">
				<h2>{this.props.query[0]}</h2>
				<div className="iconset">
					<button onClick={this.handleReport} title="Report incorrect definition">{report_svg}</button>
					<button onClick={this.handleCopy} title="Copy this definition to clipboard">{copy_svg}</button></div>
				<p onClick={this.handleClick}>{def}</p>
			</div>);
	}
}

//to report errors in existing terms
class Report extends React.Component {
	constructor(props) {
		super(props);
		this.state = {submitted:false};
		this.handleBack = this.handleBack.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleBack(){
		this.props.onBack([-1,-1]);
	}
	handleSubmit(event) {
	    console.log(event.target);
	    event.preventDefault();
	 }
	render(){
		return (<div className="form">
					<p onClick={this.handleBack} className="back-a">&larr;back</p>
					<h3>Find something incorrect?</h3>
					<TermCard type="min" query={this.props.query}/>
					<form action="" method="post">
						<label htmlFor="comment">Please let us know what we can improve on: <strong>{this.props.query[0]}</strong></label>
						<div className="form-textarea" rows="4">
							<textarea type="text" name="comment" placeholder="Tell us more about this problem" required></textarea></div>
						<div className="right"><button onClick={this.handleBack} className="button-bright">Cancel</button>
						<button type="submit" value="submit" className="button-dark">Send</button></div>
					</form>
				</div>);
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
	return ('' + a[0]).localeCompare(''+b[0]);
}
function distanceCompare(a,b) {
	if(a[2]==b[2]) return ('' + a[0]).localeCompare(''+b[0]);
	else return a[2]-b[2];
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
      var max=center+range;
      for (var i = 0; i < len; i++) 
        if(matches[i][2]<=max) output.push(matches[i]);
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
    var best_score  = 0
    var score_range = 3
    var perfect=false;//if there is perfect match for the query in our dictionary
    // Split the query, search through word by word.
    var query_low = query.toLowerCase();
    var query_words = query_low.split(splittable_chars);
    for(const term of dictionary){
    	var term_low= term[0].toLowerCase();
      	var term_words = term_low.split(splittable_chars);
      	var len_t=term_words.length;
      	var len_q=query_words.length;
      	var a=query_low.search(term_low)!=-1? 1:-1;
      	var b=term_low.search(query_low)!=-1? 1:-1;
      	var distance = 10;
      	//if term or query is not the same
      	if(a+b>0){
      		distance=0;
      		perfect=true;}
      	if(a+b==0)
      		if(len_t!=len_q) distance=0.1*Math.abs(len_t - len_q)+1;
      		else distance=0.1*levenshteinDistance(term_low,query_low);
      	else {
      		if(len_t*len_q==1){
      			var levenDistance=levenshteinDistance(term_low,query_low);
      			distance=levenDistance > Math.max(term_low.length-2,len-2)?10:0.5*levenDistance;
      		} else for(const term_word of term_words)
			          for(const query_word of query_words){
	      				var levenDistance=levenshteinDistance(term_word,query_word);
	                	distance = levenDistance < distance? levenDistance : distance;
	                }
		    if(distance > best_score+score_range) continue;}
    	var termD=term;
    	termD[2]=distance;
    	matches.push(termD);
      }
    if(perfect && matches.length>=10) matches=matches.sort(distanceCompare).slice(0,10);
    else if(matches.length>=30) matches=matches.sort(distanceCompare).slice(0,30);
    return matches;
}

//query is plain text, pos is caret position
function search_paragraph(query) {
	var obj=new Object();
	const array_raw=[]
    obj.markedString="";
    obj.matches=[];
    obj.flagArray=[];
    if(query.length<=0) return obj;

    var splitPoints=[];
    var flagArray=query.split('').fill(-1);
    
    var query_low = query.toLowerCase();
    for(const term of dictionary){
      	var term_low = term[0].toLowerCase()
      	var position=query.search(term_low);
      	if(position!=-1){
      		splitPoints.push([position,position+term_low.length,term]);
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
    	flagArray.fill(i,match[0],match[1]);
    	if(match[0]>=start){
	    	markedString=markedString+query.substring(start,match[0])+"\<mark\>"+query.substring(match[0],match[1])+"\<\/mark\>";
	    	start=match[1];
	    }
	}
    markedString=markedString+query.substring(start);
    obj.markedString=markedString;
    obj.matches=matches;
    obj.flagArray=flagArray;
    
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


// code copyed from trekhleb/javascript-algorithms on Github
// path: src/algorithms/string/levenshtein-distance/levenshteinDistance.js

/**
 * @param {string} a
 * @param {string} b
 * @return {number}
 */
function levenshteinDistance(a, b) {
  // Create empty edit distance matrix for all possible modifications of
  // substrings of a to substrings of b.
  const distanceMatrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  // Fill the first row of the matrix.
  // If this is first row then we're transforming empty string to a.
  // In this case the number of transformations equals to size of a substring.
  for (let i = 0; i <= a.length; i += 1) {
    distanceMatrix[0][i] = i;
  }

  // Fill the first column of the matrix.
  // If this is first column then we're transforming empty string to b.
  // In this case the number of transformations equals to size of b substring.
  for (let j = 0; j <= b.length; j += 1) {
    distanceMatrix[j][0] = j;
  }

  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      distanceMatrix[j][i] = Math.min(
        distanceMatrix[j][i - 1] + 1, // deletion
        distanceMatrix[j - 1][i] + 1, // insertion
        distanceMatrix[j - 1][i - 1] + indicator, // substitution
      );
    }
  }

  return distanceMatrix[b.length][a.length];
}
