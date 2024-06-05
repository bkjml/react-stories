// import React from "react";

// const List = ({list}) =>
//       list.map(({objectID, ...item}) =>
//       <Item key={objectID} {...item}/>
//     );

// const Item = ({
//   title,
//   url,
//   author,
//   num_comments,
//   points,
//   }) =>{
//   (<div>
//     <span>
//       <a href={url}>{title}</a>
//     </span>
//     <span>{author}</span>
//     <span>{num_comments}</span>
//     <span>{points}</span>
//   </div>)
// }

// const initialStories = [
//   {
//   title: 'React',
//   url: 'https://reactjs.org/',
//   author: 'Jordan Walke',
//   num_comments: 3,
//   points: 4,
//   objectID: 0,
//   },
//   {
//   title: 'Redux',
//   url: 'https://redux.js.org/',
//   author: 'Dan Abramov, Andrew Clark',
//   num_comments: 2,
//   points: 5,
//   objectID: 1,
//   },
//   ];

// const getAsyncStories = () =>{
//   new Promise(resolve =>
//     setTimeout(() =>
//       resolve({data: {stories: initialStories}})), 2000)
// }

// const List = ({ list, onRemoveItem }) =>
//   list.map(item => <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />);

// const Item = ({ item, onRemoveItem }) => {

// function handleRemoveItem(){
//   onRemoveItem(item)
// }

//   return(
//     <div>
//       <span>
//       <a href={item.url}>{item.title}</a>
//       </span>
//       <span>{item.author}</span>
//       <span>{item.num_comments}</span>
//       <span>{item.points}</span>
//       <span>
//         <button type="button" onClick={() => onRemoveItem(item)}>Dismiss</button>
//       </span>
//     </div>
//   )

// };

// const InputWithLabel = ({id, value, type="text", onInputChange, isFocused, children}) =>{

//   const inputRef = React.useRef();

//   React.useEffect(()=>{
//     if(isFocused && inputRef.current){
//       inputRef.current.focus();
//     }
//   }, [isFocused])

//   return (
//     <>
//       <label htmlFor={id}>{children}</label>
//       <span></span>
//       <input ref={inputRef} id={id} type={type} value={value} onChange={onInputChange}/>

//     </>
//   )
// }

// const useSemiPersistentState = (key, initialState) =>{
//   const [value, setValue] = React.useState(localStorage.getItem(key) || initialState)

//   React.useEffect(() => {localStorage.setItem(key, value)}, [value, key]);

//   return [value, setValue]

// }

// const App = () => {

//   const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React')

//   const [stories, setStories] = React.useState([]);

//   React.useEffect(()=>{
//     getAsyncStories().then(result =>{
//       setStories(result.data.stories)
//     })
//   }, )

//   const handleRemoveStories = item =>{
//     const newStories = stories.filter(
//         story => item.objectID !== story.objectID
//     )
//     setStories(newStories);
//   }

//   const handleSearch = event =>{
//     setSearchTerm(event.target.value)

//   }

//   const searchedStories = stories.filter(story => {
//     return story.title.toLowerCase().includes(searchTerm.toLowerCase())
//   })

//   return (
//     <div className="App">

//       <h1>My Hacker stories</h1>

//       <InputWithLabel id="search" label="Search" value={searchTerm} isFocused onInputChange={handleSearch}>
//       <strong>Search: </strong>
//       </InputWithLabel>

//       <p>The searched text is <strong>{searchTerm}</strong></p>
//       <hr/>
//       <List list={searchedStories} onRemoveItem={handleRemoveStories}/>
//     </div>

//  );
// }

// export default App;

import React from "react";
import axios from "axios";

import './App.css'


// const initialStories = [
//   {
//     title: "React",
//     url: "https://reactjs.org/",
//     author: "Jordan Walke",
//     num_comments: 3,
//     points: 4,
//     objectID: 0,
//   },
//   {
//     title: "Redux",
//     url: "https://redux.js.org/",
//     author: "Dan Abramov, Andrew Clark",
//     num_comments: 2,
//     points: 5,
//     objectID: 1,
//   },
// ];

// const getAsyncStories = () =>
//   new Promise((resolve, reject) =>
//     // setTimeout(reject, 2000)
//     setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
//   );

// const StyledContainer = styled.div`
//       height: 100vw;
//       padding: 20px;
//       background: #83a4d4;
//       background: linear-gradient(to left, #b6fbff, #83a4d4);
//       color: #171212;
//       `;

// const StyledHeadlinePrimary = styled.h1`
//       font-size: 48px;
//       font-weight: 300;
//       letter-spacing: 2px;
//       `;


const storiesReducer = (state, action) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID)
      }
    default:
      throw new Error();
  }
};

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';


const SearchForm = ({searchTerm, onSearchInput, OnSearchSubmit}) =>(
  <form onSubmit={OnSearchSubmit} className="search-form">
      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={onSearchInput}
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <button 
        type="submit"
        disabled={!searchTerm}
        className="button button_large"
        >
        Submit
      </button>
    </form>
)

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");

  // const [stories, setStories] = React.useState([]);
  // const [isLoading, setIsLoading] = React.useState(false);
  // const [isError, setIsError] = React.useState(false);

  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`)

  const handleSearchInput = event =>{
    setSearchTerm(event.target.value)
  }

  const handleSearchSubmit = event =>{
    setUrl(`${API_ENDPOINT}${searchTerm}`)
    event.preventDefault()
  }


  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleFetchStories = React.useCallback(async() =>{


    dispatchStories({ type: "STORIES_FETCH_INIT" });

    try{
      const result = await axios.get(url);

    // axios
    //   // .then(response => response.json())
    //   .get(url)
    //   .then((result) => {
    dispatchStories({
      type: "STORIES_FETCH_SUCCESS",
      payload: result.data.hits
    });
    }catch{
      dispatchStories({type: "STORIES_FETCH_FAILURE"})
    }

    
      // })
      // .catch(() => dispatchStories({ type: "STORIES_FETCH_FAILURE" }));
  }, [url])

  React.useEffect(() => {
    handleFetchStories()
    
  }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  };

  // const handleSearch = (event) => {
  //   setSearchTerm(event.target.value);
  // };

  // const searchedStories = stories.data.filter((story) =>
  //   story.title.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div className="container">
      <h1 className="headline-primary">My Hacker Stories</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        OnSearchSubmit={handleSearchSubmit}
      >
      </SearchForm>

      <hr />
      {stories.isError && <p>Something went wrong. . .</p>}
      {stories.isLoading ? (
        <p>Loading . . .</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

const InputWithLabel = ({
  id,
  value,
  type = "text",
  onInputChange,
  isFocused,
  children,
}) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id} className="label">{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
        className="input"
      />
    </>
  );
};

const List = ({ list, onRemoveItem }) =>
  list.map((item) => (
    <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
  ));

const Item = ({ item, onRemoveItem }) => (
  <div className="item">
    <span style={{width: '40%'}}>
      <a href={item.url}>{item.title}</a>
    </span>
    <span style={{width: '30%'}}>{item.author}</span>
    <span style={{width: '10%'}}>{item.num_comments}</span>
    <span style={{width: '10%'}}>{item.points}</span>
    <span style={{width: '10%'}}>
      <button type="button" onClick={() => onRemoveItem(item)} className="button button_small">
        Dismiss
      </button>
    </span>
  </div>
);

export default App;
