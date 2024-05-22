var total = 0;
var dictionary = [];
var currentLetters = [];
const dataFilePath = 'data.json';
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const search_svg = (<svg role="img" focusable="false" aria-hidden="true" className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18.895" height="18.9" viewBox="0 0 18.895 18.9">
	<path id="union2" data-name="union2" className="cls-1" d="M-85.811,405.607-90.1,401.32A7.941,7.941,0,0,1-95,403a7.943,7.943,0,0,1-5.656-2.343,8.009,8.009,0,0,1,0-11.314A7.944,7.944,0,0,1-95,387a7.95,7.95,0,0,1,5.657,2.343,8.014,8.014,0,0,1,.663,10.563l4.287,4.287a1,1,0,0,1,0,1.414,1,1,0,0,1-.707.293A1,1,0,0,1-85.811,405.607Zm-13.435-14.849a6.007,6.007,0,0,0,0,8.485A5.957,5.957,0,0,0-95,401a5.957,5.957,0,0,0,4.243-1.757A5.961,5.961,0,0,0-89,395a5.961,5.961,0,0,0-1.758-4.243A5.961,5.961,0,0,0-95,389,5.961,5.961,0,0,0-99.247,390.758Z" transform="translate(103 -387)" />
</svg>);
const report_svg = (<svg role="img" className="regular-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
	<title>Reprt incorrect definition</title>
	<path d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32V64 368 480c0 17.7 14.3 32 32 32s32-14.3 32-32V352l64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L64 48V32z"/></svg>);
const copy_svg = (<svg role="img" className="regular-icon" xmlns="http://www.w3.org/2000/svg" width="17.325" height="19" viewBox="0 0 17.325 19">
	<title>Copy this definition to clipboard</title>
	<path id="copy" className="cls-1" d="M-97,406a2,2,0,0,1-2-2h10.329a1,1,0,0,0,1-1V393a1,1,0,0,0-1-1v-2h1a2,2,0,0,1,2,2v12a2,2,0,0,1-2,2Zm-4-3a2,2,0,0,1-2-2V389a2,2,0,0,1,2-2h9.326a2,2,0,0,1,2,2v12a2,2,0,0,1-2,2Zm0-13v10a1,1,0,0,0,1,1h7.33a1,1,0,0,0,1-1V390a1,1,0,0,0-1-1H-100A1,1,0,0,0-101,390Z" transform="translate(103 -387)" />
</svg>);
const close_svg = (<svg className="regular-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
	<path id="close" d="M-88.321,403.116l-6.265-6.265-6.265,6.265a1.016,1.016,0,0,1-1.437,0,1.017,1.017,0,0,1,0-1.436l6.266-6.266-6.266-6.266a1.017,1.017,0,0,1,0-1.436,1.016,1.016,0,0,1,1.437,0l6.265,6.265,6.265-6.265a1.016,1.016,0,0,1,1.437,0,1.015,1.015,0,0,1,0,1.436l-6.266,6.266,6.266,6.266a1.015,1.015,0,0,1,0,1.436,1.013,1.013,0,0,1-.719.3A1.013,1.013,0,0,1-88.321,403.116Z" transform="translate(102.586 -387.414)" />
</svg>);
const image_svg = (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<rect width="24" height="24" fill="transparent" />
		<rect x="4" y="5" width="16" height="13" rx="1" fill="#D2DCE5" />
		<path fillRule="evenodd" clipRule="evenodd" d="M8 18H19C19.231 18 19.4437 17.9217 19.613 17.7901C17.5707 15.2107 14.0626 11 12.924 11C11.2827 11 8 16.25 8 16.25V18Z" fill="#B5C3D0" />
		<path fillRule="evenodd" clipRule="evenodd" d="M15.6124 18H5C4.44772 18 4 17.5523 4 17V13.6428C5.09148 12.1356 6.82346 10 7.875 10C9.26037 10 14.189 16.1779 15.6124 18Z" fill="#92A1B0" />
		<circle cx="16.5" cy="8.5" r="1.5" fill="#92A1B0" />
	</svg>
);

const form_url = "https://script.google.com/macros/s/AKfycbzciytBw2suR8xjs5BX7viyFhbEKwQLucrPWLfYaR-Eu9DCx2k/exec";
///////////////////
//// COMPONENTS ///
///////////////////

class DictionaryContainer extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.state = {
			status: "word",
			query: "",
			imageBox: ""
		};
		this.handleStatusChange = this.handleStatusChange.bind(this);
		this.handleImage = this.handleImage.bind(this);
	}
	componentDidMount() {
		this._isMounted = true;
	}
	componentWillUnmount() {
		this._isMounted = false;
	}
	handleStatusChange(event) {
		this._isMounted && this.setState({ status: event.target.value });
	}
	handleImage(query) {
		this._isMounted && this.setState({
			query: query
		});
	}
	render() {
		return (
			<section className="relative">
				<div className="status">
					<button className={this.state.status === "word" ? "button-dark" : "button-bright"} onClick={this.handleStatusChange} value="word" title="For short medical terms">Word</button>
					<button className={this.state.status === "paragraph" ? "button-dark" : "button-bright"} onClick={this.handleStatusChange} value="paragraph" title="For medical terms in a paragraph">Paragraph</button>
				</div>
				{
					this.state.status === "word" ? (
						<Dictionary4Word onImage={this.handleImage} />
					) : (
						<Dictionary4Paragraph onImage={this.handleImage} />
					)
				}
			</section>
		);
	}
}

class Dictionary4Word extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.lastScrollTop = 0;
		this.panelHeight = 0;
		this.state = { query: '', type: '', matches: [], report_query: [-1, -1], request: false };
		this.handleChange = this.handleChange.bind(this);
		this.handleReport = this.handleReport.bind(this);
		this.handleRequest = this.handleRequest.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.handleImage = this.handleImage.bind(this);
	}
	componentDidMount() {
		this._isMounted = true;
		this.lastScrollTop = Math.ceil(window.scrollTop);
		window.addEventListener('scroll', this.handleScroll);
	}
	componentWillUnmount() {
		this._isMounted = false;
		window.removeEventListener('scroll', this.handleScroll);
	}
	handleChange(change) {
		var matches = change.query === '' ? [] : getMatches(change.query, change.type);
		this._isMounted && this.setState({ query: change.query, type: change.type, matches: matches });
	}
	handleReport(query) {
		this._isMounted && this.setState({ report_query: query });
	}
	handleRequest(boolean) {
		this._isMounted && this.setState({ request: boolean });
	}
	handleScroll() {
		const top = Math.ceil(window.scrollY);
		const cardList = document.querySelector('.TermCardList_word');
		if (!cardList) return;

		const message = document.querySelector('#messageRow');
		const messageTop = cardList.offsetTop - message.offsetHeight;

		if (messageTop > 0 && top > messageTop) {
			message.classList.add("sticky");
			message.style.top = 0 + 'px';
			cardList.style.marginTop = message.offsetHeight + 'px';
		} else {
			message.classList.remove("sticky");
			message.style.top = '0px';
			cardList.style.marginTop = '0px';
		}

		this.lastScrollTop = top;
	}
	handleImage(query) {
		this.props.onImage(query);
	}
	render() {
		if (this.state.report_query[0] != -1) {
			const isReport = this.state.report_query[1] != -1;
			return <Report type={isReport ? "report" : "request"} onBack={this.handleReport}
				query={isReport ? this.state.report_query : this.state.query} />;
		}

		else return (
			<div>
				<SearchBar4Word onQueryChange={this.handleChange} query={this.state.query} type={this.state.type} matches={this.state.matches} />
				<BrowseField onQueryChange={this.handleChange} query={this.state.query} type={this.state.type} list={alphabet} />
				<BrowseFieldSecondary onQueryChange={this.handleChange} query={this.state.query} type={this.state.type} list={currentLetters} />
				<div id='messageRow'>
					<MessageRow query={this.state.query} type={this.state.type} length={this.state.matches.length} />
				</div>
				<div className="TermCardList_word hasCard">
					<TermCardList4Word
						onReport={this.handleReport}
						onImage={this.handleImage}
						onRequest={this.handleRequest}
						matches={this.state.matches}
						type={this.state.type}
					/>
				</div>
			</div>
		);
	}
}

class Dictionary4Paragraph extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.state = { query: '', display: '', matches: [], flagArray: [], selected: -1, report_query: [-1, -1] };
		this.handleChange = this.handleChange.bind(this);
		this.handleReport = this.handleReport.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.handleImage = this.handleImage.bind(this);
	}
	componentDidMount() {
		this._isMounted = true;
	}
	componentWillUnmount() {
		this._isMounted = false;
	}
	handleChange(change) {
		this._isMounted && this.setState({ query: change.query });
		var obj = search_paragraph(change.query);
		this._isMounted && this.setState({ matches: obj.matches, display: obj.markedString, flagArray: obj.flagArray });
	}
	handleReport(query) {
		this._isMounted && this.setState({ report_query: query });
	}
	handleMouseUp(pos) {
		const flagArray = this.state.flagArray;
		if (flagArray.length <= 0 || pos.start < 0 || pos.end > flagArray.length) return;

		var selected = -1;
		if (pos.end == pos.start) {
			selected = flagArray[pos.end];
		} else
			for (var i = pos.start; i < pos.end; i++)
				if (flagArray[i] != -1) {
					selected = flagArray[i]; break;
				}

		this._isMounted && this.setState({ selected: selected });
		if (selected != -1 && selected < this.state.matches.length && this.state.matches.length > 2) {
			var height = document.getElementById('card-container').children[selected].offsetTop;
			$('.TermCardList_para').scrollTop(height - 32);
		}
	}
	handleImage(query) {
		this.props.onImage(query);
	}

	render() {
		const hasCard = this.state.matches.length > 0 ? ' hasCard' : '';
		if (this.state.report_query[0] != -1)
			return <Report type="report" onBack={this.handleReport} query={this.state.report_query} />;

		else return (
			<div className="flex paragraph">
				<SearchBar4Paragraph status="normal" query={this.state.query} onQueryChange={this.handleChange} onMouseUp={this.handleMouseUp} display={this.state.display} />
				<div className={"TermCardList_para" + hasCard}>
					<TermCardList4Paragraph
						onReport={this.handleReport}
						onImage={this.handleImage}
						matches={this.state.matches}
						selected={this.state.selected}
					/>
				</div>
			</div>
		);
	}
}
class SearchBar4Word extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.state = { input: '', isToggled: true };
		this.handleChange = this.handleChange.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleClear = this.handleClear.bind(this);
	}
	componentDidMount() {
		this._isMounted = true;
	}
	componentWillUnmount() {
		this._isMounted = false;
	}
	handleChange(event) {
		if (event.target.name != 'guess') this._isMounted && this.setState({ isToggled: false });
		var value = event.target.value;
		var change = new Object();
		change.query = value;
		change.type = "search";
		this._isMounted && this.setState({ input: value });
		this.props.onQueryChange(change);
	}
	handleBlur(event) {
		setTimeout(
			function () {
				this._isMounted && this.setState({ isToggled: true });
			}.bind(this), 200);
	}
	handleClear() {
		document.querySelector("input").value = "";
		var change = new Object();
		change.query = '';
		change.type = "search";
		this.props.onQueryChange(change);
		this._isMounted && this.setState({ isToggled: true, input: "" });
	}
	render() {
		var matches = this.props.matches;
		var len = this.props.type === "search" ? Math.min(4, matches.length) : 0;
		//guess what the user try to search
		const shadow = len > 0 && !this.state.isToggled ? " shadow" : "";
		const value = this.props.type === "search" ? this.props.query : this.state.input;
		var matchTerms = [];
		if (this.props.type == "search" && !this.state.isToggled) {
			matchTerms.push(<button key="fake">fake</button>);
			for (var i = 0; i < len; i++)
				matchTerms.push(<button key={i} name="guess" value={matches[i][0]} onClick={this.handleChange}>{matches[i][0]}</button>);
		}

		return (
			<div className="search-box-container relative" onBlur={this.handleBlur}>
				<div className="search-box flex">
					<input type="text" name="search" placeholder="Search for a medical term" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
						onChange={this.handleChange} value={value}></input>
					{value.length > 0 ? <button className="button-none" onClick={this.handleClear} title="clear search field">{close_svg}</button> : null}
					{search_svg}
				</div>
				<div className={"search-box guess" + shadow}>{matchTerms}</div>
			</div>
		);
	}
}

//content editable field
class SearchBar4Paragraph extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.state = { pos: 0 };
		this.handleChange = this.handleChange.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
	}
	componentDidMount() {
		this._isMounted = true;
		if (this.props.query.length > 0) $('#paragraph').val(this.props.query);
	}
	componentWillUnmount() {
		this._isMounted = false;
	}
	handleChange(event) {
		console.log(event.target.scrollHeight);
		const target = event.target;
		target.style.height = 'inherit';//to auto set textarea's height
		target.style.height = `${target.scrollHeight}px`;
		var change = new Object();
		change.query = target.value;
		change.type = "search";
		setTimeout(function () {
			this.props.onQueryChange(change);
		}.bind(this), 200);
	}
	handleMouseUp(event) {
		var pos = getCaretPos(event.target);
		this.props.onMouseUp(pos);
	}
	render() {
		return (
			<div className="search-box-container">
				<div className="search-box flex">
					<div className="box-paragraph relative no-scroll-bar">
						<textarea class="textAreaInput" id="paragraph" name="search" placeholder="Please paste the text here" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
							onInput={this.handleChange} onMouseUp={this.handleMouseUp} onBlur={this.handleChange}></textarea>
						<div id="under-textarea" dangerouslySetInnerHTML={{ __html: this.props.display }}></div>
					</div>
					{search_svg}
				</div>
			</div>
		);
	}
}

class BrowseField extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(event) {
		var change = new Object();
		var value = event.target.value;
		change.query = value === this.props.query ? "" : value;
		if (this.props.type === "letter" && value === this.props.query.charAt(0)) change.query = "";
		change.type = value === "all" ? 'all' : 'letter';
		this.props.onQueryChange(change);
	}
	render() {
		const query = this.props.type === 'letter' ? this.props.query.charAt(0) : "";
		var listItems = this.props.list.map((letter) =>
			<button key={letter} className={letter === query ? "current-button" : ""}
				value={letter} type="button" onClick={this.handleClick}>
				{letter}</button>
		);
		listItems.push(
			<button key="all" className={this.props.type === 'all' ? "current-button" : ""}
				value='all' type="button" onClick={this.handleClick}>
				{"view all " + total + " terms"}</button>
		);
		return <div className="BrowseField">{listItems}</div>;
	}
}
class BrowseFieldSecondary extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(event) {
		var change = new Object();
		var value = event.target.value;
		change.query = value === this.props.query ? value.charAt(0) : value;
		change.type = 'letter';
		this.props.onQueryChange(change);
	}
	render() {
		if (this.props.type != 'letter' || this.props.query == '') return null;
		var listItems = this.props.list.map((letter) =>
			<button key={letter} className={letter === this.props.query ? "current-button" : ""}
				value={letter} type="button" onClick={this.handleClick}>
				{letter}</button>
		);
		return <div className="BrowseField">{listItems}</div>;
	}
}

class MessageRow extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		if (this.props.query === '') return null;
		else if (this.props.length <= 0) //when there is no match for the query
			return <p>Sorry, no match for <strong>{this.props.query}</strong>.</p>
		else if (this.props.type === 'all') //display all terms
			return <p>All {total} terms we have:</p>;
		else if (this.props.type === 'letter') //letter browsing
			return <p>{this.props.length} {this.props.length > 1 ? "terms" : "term"} started with <strong>{this.props.query}</strong>:</p>;
		else
			return <p>{this.props.length} possible matches for <strong>{this.props.query}</strong>:</p>;
	}
}

class TermCardList4Word extends React.Component {
	constructor(props) {
		super(props);
		this.handleReport = this.handleReport.bind(this);
		this.handleRequest = this.handleRequest.bind(this);
		this.handleImage = this.handleImage.bind(this);
	}
	handleReport(query) {
		this.props.onReport(query);
	}
	handleRequest(event) {
		if (event.target.name === "request") this.props.onReport(["request", -1]);
	}
	handleImage(query) {
		this.props.onImage(query);
	}
	render() {
		if (this.props.matches.length <= 0) return null;

		const list = this.props.matches.map(
			(item) => <TermCard onReport={this.handleReport} onImage={this.handleImage} key={item[0]} query={item} />
		);
		if (this.props.type == 'search' && this.props.matches[0][4] != 0)
			return (
				<div>
					{list}
					<div className="term-card-min request flex">
						<h3>Didn't find the term you need?</h3>
						<button name="request" className="button-dark" onClick={this.handleRequest}>Request Term</button>
					</div>
				</div>
			);
		else return <div>{list}</div>;
	}
}

class TermCardList4Paragraph extends React.Component {
	constructor(props) {
		super(props);
		this.handleReport = this.handleReport.bind(this);
		this.handleImage = this.handleImage.bind(this);
	}
	handleReport(query) {
		this.props.onReport(query);
	}
	handleImage(query) {
		this.props.onImage(query);
	}
	render() {
		var selected = '';
		if (this.props.selected != -1 && this.props.selected < this.props.matches.length)
			selected = this.props.matches[this.props.selected][0];
		const list = this.props.matches.map(
			(item) => (
				<TermCard
					type={selected === item[0] ? "selected" : "normal"}
					onReport={this.handleReport}
					onImage={this.handleImage}
					key={item[0]}
					query={item} />
			));
		if(list.length > 0){
			return (
				<div id="card-container">{list}</div>
			);
		}
		else{
			return(
				<div className="directions">Any found terms from the pasted text will appear here.</div>
			)
		}
		
	}
}


class TermCard extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.state = { isToggled: true, copied: false };
		this.handleClick = this.handleClick.bind(this);
		this.handleCopy = this.handleCopy.bind(this);
		this.handleReport = this.handleReport.bind(this);
		this.handleImage = this.handleImage.bind(this);
	}
	componentDidMount() {
		this._isMounted = true;
	}
	componentWillUnmount() {
		this._isMounted = false;
	}
	//toggle card
	handleClick(event) {
		this._isMounted && this.setState({ isToggled: !this.state.isToggled });
	}
	//navigate to report page
	handleReport() {
		this.props.onReport(this.props.query);
	}
	//expand image to full screen
	handleImage() {
		this.props.onImage(this.props.query);
	}
	//copy term and definition to clipboard
	handleCopy(event) {
		this._isMounted && this.setState({ copied: false });
		console.log(this.props.query);
		navigator.clipboard.writeText(this.props.query[0] + ": " + this.props.query[1]).then(function () {
			/* success */
			this._isMounted && this.setState({ copied: true });
			console.log("success")
		}.bind(this), function (error) {
			/* failure */
			console.log("Error message: " + error)
			window.alert(error);
		});
	}
	render() {
		//constants
		//=======
		const item = {
			term: this.props.query[0],
			definition: this.props.query[1],
			imgURL: this.props.query[2],
			altText: this.props.query[3]
		};
		
		let img = item.imgURL != "" ? (<div className="image-col"><img className="image" src={item.imgURL} alt={item.altText} /></div>) : "";

		return (
			<div className={this.props.type === "selected" ? "term-card term-card-selected" : "term-card"} onClick={this.handleClick} >
				<div className="flex-center">
					<div className="row flex-start cardHeader">
						<h2>{item.term}</h2>
					</div>
					<div className="iconset">
						<button
							onClick={this.handleReport}
							title="Report incorrect definition">
							{report_svg}
						</button>
						<button
							className={this.state.copied ? "message-copied" : ""}
							onClick={this.handleCopy}
							title="Copy this definition to clipboard">
							{copy_svg}
						</button>
					</div>
				</div>
				<p class="definitionParagraph">{item.definition}</p>
				{img}
			</div>
		);
	}
}
class TermCardMin extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.state = { isToggled: true };
		this.handleClick = this.handleClick.bind(this);
	}
	componentDidMount() {
		this._isMounted = true;
	}
	componentWillUnmount() {
		this._isMounted = false;
	}
	handleClick(event) {
		if (this.props.query[1].length > 60) this._isMounted && this.setState({ isToggled: !this.state.isToggled });
	}
	render() {
		const define = this.props.query[1];
		let def = <p>{define}</p>;
		if (define.length > 70) {
			def = (
				<p>{this.state.isToggled ? define.substring(0, 60) + "... " : define + " "}
					<a href="#" onClick={this.handleClick}>{this.state.isToggled ? "expand" : "collapse"}</a></p>);
		}
		return (
			<div className="term-card-min">
				<h2>{this.props.query[0]}</h2>
				{def}
			</div>);
	}
}
//to report errors in existing terms
class Report extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.state = { status: 'input', error: '', comment: '', loading: false, query: this.props.query[0] };
		this.handleBack = this.handleBack.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentDidMount() {
		this._isMounted = true;
		if (this.props.type === "request") this.setState({ query: this.props.query });
	}
	componentWillUnmount() {
		this._isMounted = false;
	}
	handleBack() {
		this.props.onBack([-1, -1]);
	}
	handleChange(event) {
		const target = event.target;
		if (target.name === "comment") this._isMounted && this.setState({ comment: target.value });
		if (target.name === "term") this._isMounted && this.setState({ query: target.value });
	}
	handleSubmit(event) {
		event.preventDefault();
		this._isMounted && this.setState({ status: 'loading' });
		const formObj = { type: this.props.type, term: this.state.query, comment: this.state.comment };
		let json = JSON.stringify(formObj);
		let u = new URLSearchParams(formObj).toString();
		let result = {};
		var jqxhr = $.ajax({
			url: form_url + '?' + u,
			method: "GET",
			dataType: "json",
			data: json,
			success: function (e) {
				if (e.result === 'success') this._isMounted && this.setState({ status: 'submitted', error: '' });
				else this._isMounted && this.setState({ status: 'error', error: e.error, name });
			}.bind(this)
		});
	}
	render() {
		const isReport = this.props.type === "report" ? true : false;
		if (this.state.status === "loading") { //waiting for the form to be sent
			return (
				<div className="loading center"><p>Sending your {this.props.type}...</p><div className="loading-animate"></div></div>
			);
		} else if (this.state.status === "submitted") { //when the form is submitted successfully
			return (
				<div className="form term-card">
					<h3 className="capitalize">{this.props.type} sent!</h3>
					<p>Your {isReport ? "report of incorrect information about" : "request for the definition of"} <strong>{this.state.query}</strong> has been sent! We will update the dictionary as soon as we can.</p>
					{isReport ? "" : <p>In the mean time, please reach out to your health advisor for more information</p>}
					<p>Thank you for your {this.props.type} and patience!</p>
					<div onClick={this.handleBack} className="right"><button className="button-dark">Back</button></div>
				</div>);
		} else if (isReport) //the form for report (when a user find something wrong with the term/definition)
			return (
				<div className="form term-card">
					<p onClick={this.handleBack}>{close_svg}</p>
					<h3>Find something incorrect?</h3>
					<TermCardMin query={this.props.query} />
					<form onSubmit={this.handleSubmit} action="" method="get">
						<label htmlFor="comment">Tell us what we can improve on: <em>{this.props.query[0]}</em></label>
						<div className="form-textarea">
							<textarea type="text" name="comment" onChange={this.handleChange}
								placeholder="Tell us more about this problem" rows="4" required></textarea></div>
						<div className="right">
							<button type="reset" onClick={this.handleBack} className="button-bright">Cancel</button>
							<button type="submit" value="submit" className="button-dark">Send</button></div>
					</form>
				</div>);
		else return ( //the form for request (when a user did't find the term he/she needs)
			<div className="form term-card">
				<p onClick={this.handleBack}>{close_svg}</p>
				<h3>Didn't find the term yoou need?</h3>
				<form onSubmit={this.handleSubmit} action="" method="get">
					<label htmlFor="term">Request definition for </label>
					<div className="form-textarea">
						<input type="text" name="term" autoComplete="off"
							onChange={this.handleChange} value={this.state.query} required></input></div>
					<label htmlFor="comment">Add a note about the request (optional)</label>
					<div className="form-textarea">
						<textarea type="text" name="comment" onChange={this.handleChange}
							placeholder="Tell us more about this term" rows="4"></textarea></div>
					<div className="right">
						<button type="reset" onClick={this.handleBack} className="button-bright">Cancel</button>
						<button type="submit" value="submit" className="button-dark">Send</button></div>
				</form>
			</div>);
	}
}


///////////////////
//// FUNCTIONS ////
///////////////////

// read data stored in json file and return a array
// format [ term, definition, imageURL, altText ]
function getData(dataJSON) {
	let data = dataJSON['definitions'];
	data.forEach(item => {
		dictionary.push([
			strip(item["term"]),
			strip(item["definition"]),
			strip(item["imgURL"]),
			strip(item["altText"]),
		]);
	});
	dictionary = dictionary.sort(alphaCompare);
	total = dictionary.length;
}

function strip(str) {
	if (!str) return "";
	return str.replace(/^\s+|\s+$/g, '');
}
function numCompare(a, b) {
	return a[0] - b[0];
}
function alphaCompare(a, b) {
	return ('' + a[0]).localeCompare('' + b[0]);
}
function distanceCompare(a, b) {
	if (a[4][0] != b[4][0]) return a[4][0] - b[4][0];
	else if (a[4][1] != b[4][1]) return a[4][1] - b[4][1];
	else return ('' + a[0].toLowerCase()).localeCompare('' + b[0].toLowerCase());
}
function isLetter(str) {
	return str.length === 1 && str.toLowerCase().match(/[a-z]/i);
}
// Run an anonymous funtion if a value is close enough to another value.
function getMatches(query, type) {
	const len = query.length;
	var matches_out = [];
	if (len <= 0) {
		currentLetters = [];
		return matches_out;
	}
	if (query === "all" && type === "all") matches_out = dictionary;
	else if (type === "letter") {
		const matches = search_letter(query)
		matches_out = matches[0];
		if (len == 1) {
			currentLetters = matches[1];
		}
	}
	else { matches_out = search_query(query); }
	return matches_out;
}

//letter browsing
function search_letter(query) {
	var list = dictionary;
	var letter = query.toLowerCase();
	var matches = [];
	var matches_sub = [];
	var flag = false;

	if (query.length == 1)
		for (var i = 0; i < total; i++) {
			var item = list[i][0].toLowerCase();
			if (item.charAt(0) === letter) {
				flag = true;
				matches.push(list[i]);
				if (item.charAt(1).match(/[a-z]/i) && (matches_sub.length == 0 || item.charAt(1) != matches_sub[matches_sub.length - 1].charAt(1)))
					matches_sub.push(query + item.charAt(1));
			}
			else if (flag) break;
		}
	else if (query.length == 2)
		for (var i = 0; i < total; i++) {
			var item = list[i][0].toLowerCase().substring(0, 2);
			if (item === letter) {
				flag = true;
				matches.push(list[i]);
			}
			else if (flag) break;
		}
	return [matches, matches_sub];
}

//search input
function search_query(query) {
	var len = query.length
	if (len <= 0) return false;
	var matches = []
	var splittable_chars = /[ ()[\]<>{}]/
	// Set the initial acceptable score range.
	var score_range = 0.5
	var perfect = false;//whether there is perfect match for the query in our dictionary
	// Split the query, search through word by word.
	var query_low = strip(query.toLowerCase());
	var query_words = query_low.split(splittable_chars);

	for (const term of dictionary) {
		var term_low = term[0].toLowerCase();
		var term_syn = term_low.search(",") != -1 ? term_low.split(",") : [term_low];
		var distance = [10, 10];
		if (query_low === term_low) {//perfect match
			distance = [0, 0];
			perfect = true;
		}
		else for (const term_s of term_syn) {
			if (query_low === strip(term_s)) {//perfect match
				distance = [0, 0];
				perfect = true;
			} else {//no perfect match, find possible matches
				var distance_avg = 0;
				var term_words = term_s.split(splittable_chars);
				for (const term_word of term_words)
					for (const query_word of query_words) {
						var levenDistance = levenshteinDistance(term_word, query_word) / Math.max(term_word.length, query_word.length);
						distance_avg = distance_avg + levenDistance;
						distance[0] = Math.min(levenDistance, distance[0], term_word.search(query_word) === 0 ? 0.1 : 10);
					}
				distance[1] = Math.min(distance_avg / (term_words.length * query_words.length), distance[1]);
			}
		}

		if (distance[0] > score_range || (perfect && distance[0] > 0)) continue;
		var termD = term;
		term[4] = distance;
		matches.push(termD);
	}
	var matches_len = matches.length
	matches = matches.sort(distanceCompare);//sort matches according to distance
	if (perfect) {
		for (var i = matches_len - 1; i > 0; i--) {
			if (matches[i][4][0] > 0 || matches[i][4][1] > 0.8) matches.pop();
		}
	} else if (matches_len >= 20) matches = matches.slice(0, 20);

	return matches;
}

//query is plain text, return a marked html, list of matches and position of matches
//if there are perfect matches in the paragraph, mark the term
function search_paragraph(query) {
	var obj = new Object();
	const array_raw = []
	obj.markedString = "";
	obj.matches = [];
	obj.flagArray = [];
	if (query.length <= 0) return obj;

	var splitPoints = [];
	var flagArray = query.split('').fill(-1);

	var query_low = query.toLowerCase();
	for (const term of dictionary) {
		var term_low = term[0].toLowerCase();
		var term_syn = term_low.search(",") != -1 ? term_low.split(",") : [term_low];
		for (var term_s of term_syn) {
			term_s = strip(term_s)
			var position = query_low.search(term_s);
			if (position != -1)
				if (term_s.length <= 4 && (isLetter(query_low.charAt(position - 1)) || isLetter(query_low.charAt(position + term_s.length))))
					continue;
				else {
					splitPoints.push([position, position + term_s.length, term]); break;
				}
		}

	}

	var len = splitPoints.length;
	if (len == 0) return obj;

	var markedString = "";
	var matches = []
	splitPoints.sort(numCompare);
	var start = 0;
	for (var i = 0; i < len; i++) {
		const match = splitPoints[i];
		matches.push(match[2]);
		flagArray.fill(i, match[0], match[1]);
		if (match[0] >= start) {
			markedString = markedString + query.substring(start, match[0]) + "\<mark\>" + query.substring(match[0], match[1]) + "\<\/mark\>";
			start = match[1];
		}
	}
	markedString = markedString + query.substring(start);
	obj.markedString = markedString;
	obj.matches = matches;
	obj.flagArray = flagArray;

	return obj;
}

function getCaretPos(target) {
	// IE < 9 Support
	var pos = new Object();
	if (document.selection) {
		target.focus();
		var range = document.selection.createRange();
		var rangelen = range.text.length;
		range.moveStart('character', -target.value.length);
		var start = range.text.length - rangelen;
		pos.start = start;
		pos.end = start + ranglen;
	} // IE >=9 and other browsers
	else if (target.selectionStart || target.selectionStart == '0') {
		pos.start = target.selectionStart;
		pos.end = target.selectionEnd;
	} else {
		pos.start = 0;
		pos.end = 0;
	}
	return pos;
}

///////////////////
////// RENDER /////
///////////////////

$.getJSON(dataFilePath)
	.done(function (json) {
		getData(json);
		ReactDOM.render(<DictionaryContainer />, document.getElementById('root'));
	})
	.fail(function (jqxhr, textStatus, error) {
		var err = textStatus + ", " + error;
		console.log("Request Failed: " + err);
	});

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